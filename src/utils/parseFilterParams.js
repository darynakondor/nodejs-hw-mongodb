
function parseNumber(value) {
    if (typeof value !== 'string') {
      return undefined;
    }
  
    const parsedNumber = parseInt(value);
  
    if (Number.isNaN(parsedNumber)) {
      return undefined;
    }
  
    return parsedNumber;
  }
  

  export function parseFilterParams(query) {
    const { contactType, isFavourite } = query;
  
  
    const parsedFilter = {};
  
    if (contactType) {
      parsedFilter.contactType = contactType;
    }
  
    if (isFavourite !== undefined) {
      parsedFilter.isFavourite = isFavourite === 'true';
    }
  
    return parsedFilter;
  }
  