import queryString from 'query-string';

interface Action<T> {
  type: 'remove' | 'add';
  key: keyof T;
  value: string;
}

interface Query {
  [key: string]: string | number;
}

/**
 * Create a utility to handle search queries
 */
function createSearchQuery<T extends Query>({ baseUrl }) {
  const stringify = (query: T) => {
    const params = queryString.stringify(query, {
      sort: false,
      arrayFormat: 'comma',
      skipNull: true,
      skipEmptyString: true,
    });

    return `${baseUrl}${params ? `?${params.replace(/%2C/g, ',')}` : ''}`;
  };

  const stringifyAction = (query: T, action: Action<T>) => {
    const newQuery = {
      ...query,
    };

    if (action.type === 'remove') {
      // Convert value to array
      const keyValue = query[action.key] as { split: Function };
      const values = keyValue.split(',');
      // Filter out value
      const newValues = values.filter((value) => value !== action.value);
      // Update newQuery
      newQuery[action.key] = newValues;
    } else if (action.type === 'add') {
      const keyValue = query[action.key];
      // TODO: Fix this obscure TS issue
      newQuery[action.key] = keyValue
        ? `${keyValue},${action.value}`
        : action.value;
    }

    return stringify(newQuery);
  };

  return {
    stringify,
    stringifyAction,
  };
}

// function isEmpty(obj) {
//   return Object.keys(obj).length === 0 && obj.constructor === Object;
// }

export default createSearchQuery;
