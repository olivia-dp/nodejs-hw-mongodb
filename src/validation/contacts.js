import Joi from 'joi';

export const createContactSchema = Joi.object ({
    name: Joi.string().min(3).max(30).required(),
    phoneNumber: Joi.number().integer().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua'] } }),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(`work`, `home`, `personal`).required()
});

export const updateContactSchema = Joi.object ({
    name: Joi.string().min(3).max(30),
    phoneNumber: Joi.number().integer(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua'] } }),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(`work`, `home`, `personal`)
});