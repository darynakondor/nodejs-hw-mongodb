function parseSortBy(value) {
    if (typeof value !== 'string') {
      return 'name'; 
    }
  
    const validSortFields = ['_id', 'name', 'phoneNumber', 'email', 'isFavourite', 'contactType', 'createdAt'];
  
    if (validSortFields.includes(value) !== true) {
      return 'name';  
    }
  
    return value;
}

function parseSortOrder(value) {
    if (typeof value !== 'string') {
      return 'asc';  
    }
  
    if (['asc', 'desc'].includes(value) !== true) {
      return 'asc';  
    }
  
    return value;
}

export function parseSortParams(query) {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}