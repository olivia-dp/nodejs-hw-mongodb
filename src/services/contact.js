import Contact from '../contactSchema.js';

export const getContacts = async ({ page, perPage, sortBy, sortOrder, filter }) => {
  try {
    const skip = page > 0 ? (page - 1) * perPage : 0;
    const contactQuery = Contact.find();

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

export const getContactById = async (id) => {
  try {
    const contact = await Contact.findById(id);
    return contact;
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteContact = async (id) => {
  try {
    const contact = await Contact.findByIdAndDelete({
      _id: id,
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

export const updateContact = async (id, payload, options = {}) => {
  const result = await Contact.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });
  if (!result || !result.value) return null;

  return {
    contact: result.value,
  };
};
