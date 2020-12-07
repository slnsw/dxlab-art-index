/**
 * Flexible array flatten utility function
 */
export const flatten = (
  array,
  parentId = null,
  {
    idField = 'id',
    childrenField = 'children',
    childrenTotalField = 'childrenTotal',
    parentIdField = 'parentId',
  } = {},
) => {
  return array.reduce((acc, value) => {
    const newValue = {
      ...value,
    };

    acc.push(newValue);

    if (parentIdField) {
      newValue[parentIdField] = parentId;
      newValue[childrenTotalField] = newValue.children.length;
    }

    if (newValue.children) {
      /* eslint-disable no-param-reassign */
      acc = acc.concat(
        flatten(newValue[childrenField], newValue[idField], {
          idField,
          childrenField,
          parentIdField,
        }),
      );
      /* eslint-enable no-param-reassign */
      delete newValue.children;
    }
    // console.log(acc);
    return acc;
  }, []);
};

/**
 * Transform flat records to hierarchy
 */
export const transformFlatToHierarchy = (
  flatRecords = [],
  id = null,
  count = 0,
) => {
  if (flatRecords.length === 0) {
    return [];
  }

  const rootRecord = flatRecords.find((record) => record.parentId === id);

  return [buildHierarchy(flatRecords, rootRecord, count)];
};

const buildHierarchy = (flatRecords, record, count) => {
  return {
    ...record,
    children: getChildren(flatRecords, record.id).map((r) => {
      return buildHierarchy(flatRecords, r, count + 1);
    }),
  };
};

/**
 * Transform hierarchy records to lists
 */
export const transformHierarchyToLists = (records = [], id: string) => {
  if (records.length === 0) {
    return [];
  }

  if (!id) {
    throw new Error('id argument required');
  }

  const flatRecords = flatten(records);
  const lists = transformFlatToLists(flatRecords, id);

  return lists;
};

/**
 * Transform flat records to lists
 */
export const transformFlatToLists = (flatRecords, id: string) => {
  if (flatRecords.length === 0) {
    return [];
  }

  if (!id) {
    throw new Error('id argument required');
  }

  const lists = buildAncestorLists(flatRecords, id);
  const children = getChildren(flatRecords, id);
  const hasChildren = children && children.length > 0;

  return [...lists, ...(hasChildren ? [children] : [])];
};

const buildAncestorLists = (
  records,
  id,
  result = [],
  // TODO: Expose this to outer function
  { selectedField = 'isSelected' } = {},
) => {
  const siblings = getSiblings(records, id);
  const siblingsWithSelectedRecord = siblings.map((sibling) => {
    const isSelected = sibling.id === id;

    return {
      ...sibling,
      [selectedField]: isSelected,
    };
  });

  const selectedItem = getItem(records, id);
  const { parentId } = selectedItem;

  const newResult = [siblingsWithSelectedRecord, ...result];

  if (parentId) {
    return buildAncestorLists(records, parentId, newResult, {
      selectedField,
    });
  }

  return newResult;
};

const getSiblings = (records, id) => {
  const selectedItem = getItem(records, id);

  return records.filter((item) => {
    return item.parentId === selectedItem.parentId;
  });
};

const getItem = (records, id) => {
  return records.find((item) => {
    return item.id === id;
  });
};

const getChildren = (records, id) => {
  return records.filter((item) => {
    return item.parentId === id;
  });
};
