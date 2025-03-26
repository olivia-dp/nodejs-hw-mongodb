import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import fs from 'node:fs/promises';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import createHttpError from 'http-errors';
import UserCollection from '../models/userSchema.js';
import SessionCollection from '../models/sessionSchema.js';
import { sendEmail } from '../utils/sendMail.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { TEMPLATES_DIR, SMTP } from '../constants/index.js';

export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(401, 'User not found');

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId, refreshToken) => {
  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });
  return undefined;
};

export const requestResetPassword = async (email) => {
  try {
    const user = await UserCollection.findOne({ email });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const resetToken = jwt.sign(
      {
        sub: user._id,
        email,
      },
      getEnvVar('JWT_SECRET'),
      {
        expiresIn: '5m',
      },
    );

    const templateSource = (await fs.readFile(TEMPLATES_DIR)).toString();

    const template = handlebars.compile(templateSource);
    const html = template({
      name: user.name,
      link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=<${resetToken}>`,
    });

    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    throw createHttpError(
      error.status || 500,
      error.message || 'Failed to send reset email',
    );
  }
};

export const resetPassword = async (payload) => {
  try {
    const entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
    const user = await UserCollection.findOne({
      email: entries.email,
      _id: entries.sub,
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    await UserCollection.updateOne(
      { _id: user._id },
      { password: encryptedPassword },
    );

    await SessionCollection.deleteOne({ userId: user._id });
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw createHttpError(401, 'Token is unauthorized');
    }

    if (error.name === 'TokenExpiredError') {
      throw createHttpError(401, 'Token is expired');
    }

    throw error;
  }
};
