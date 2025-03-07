import Contact from '../contactSchema.js';

export const getContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
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
