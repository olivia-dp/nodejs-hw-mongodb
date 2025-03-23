import Contact from '../models/contactSchema.js';

export const getContacts = async ({ page, perPage, sortBy, sortOrder, filter, userId }) => {
  try {
    const skip = page > 0 ? (page - 1) * perPage : 0;
    const contactQuery = Contact.find().where('userId').equals(userId);

    if (filter.contactType) {
      contactQuery.where('contactType').equals(filter.contactType);
    }

    if (filter.isFavourite) {
      contactQuery.where('isFavourite').equals(filter.isFavourite);
    }

    const [totalItems, data] = await Promise.all([
      Contact.countDocuments(contactQuery),
      contactQuery
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(perPage),
    ]);

    const totalPages = Math.ceil(totalItems / perPage);

    return {
      data,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: totalPages > page,
    };
      
  } catch (error) {
    console.log(error.message);
  }
};

export const getContactById = async (id, userId) => {
  try {
    const contact = await await Contact.findOne({ _id: id, userId });
    return contact;
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteContact = async (id, userId) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: id,
      userId
    });
    return contact;
  } catch (error) {
    console.log(error.message);
  }
};

export const createContact = async (payload) => {
  try {
    const contact = await Contact.create(payload);
    return contact;
  } catch (error) {
    console.log(error.message);
  }
};

export const updateContact = async (id, payload, userId) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: id, userId }, 
      payload,
      { new: true }
    );

    if (!contact) return null;

    return contact;
  } catch (error) {
    console.error('Error in updateContact:', error.message);
    throw error;
  }
};
