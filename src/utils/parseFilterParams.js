const parseFilter = (type) => {
  const isString = typeof type === 'string';

  if (!isString) return;
  const isContactType = (type) => [`work`, `home`, `personal`].includes(type);
  if(isContactType(type)) return type;
};


const parseIsFavourite = (isFavourite) => {
    if (typeof isFavourite === 'string') {
        return isFavourite.toLowerCase() === 'true';
      }
      if (typeof isFavourite === 'boolean') {
        return isFavourite;
      }
}

export const parseFilterParams = (query) => {
    const { contactType, isFavourite } = query;
  
    const parsedContactType = parseFilter(contactType);
    const parsedIsFavourite = parseIsFavourite(isFavourite);

  
    return {
      contactType: parsedContactType,
      isFavourite: parsedIsFavourite,
    };
  };