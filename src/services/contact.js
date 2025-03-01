import Contact from "../contactSchema.js";


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