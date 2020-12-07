import React from 'react';
import * as d3 from 'd3';
import * as d3Array from 'd3-array';

import Link from '../Link';
import HierarchyColumnBrowser from '../HierarchyColumnBrowser';
import Icon from '../Icon';

const ArtIndexExplore = () => {
  const [rawData, setRawData] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [items, setItems] = React.useState([]);

  const [listOfColumns, setListOfColumns] = React.useState([
    { type: 'chooser', id: 0, index: 0, key: null, data: null },
  ]);

  const columnTypes = [
    'chooser', // this one is special
    'years',
    'exhibitions',
    'artists',
    'works',
    'format',
    'price',
    'gender',
  ];

  const typeToField = {
    // this is the field name we use for grouping
    years: 'exhibitionYear',
    exhibitions: 'exhibitionName',
    artists: 'artistId',
    works: 'id',
    format: 'mediumFormat',
    price: 'price',
    gender: 'artistGender',
  };

  React.useEffect(() => {
    d3.csv(
      // '/data/australian-art-exhibition-catalogue-index-1845-1900-new.csv',
      '/art-index/data/works.csv',
    ).then((newData) => {
      setRawData(newData);
      const loc = {
        type: 'chooser',
        id: 0,
        index: 0,
        key: null,
        data: newData,
      };
      setListOfColumns([loc]);
    });
  }, []);

  React.useEffect(() => {
    const columnTypesLocal = [
      'chooser', // this one is special
      'years',
      'exhibitions',
      'artists',
      'works',
      'format',
      'price',
      'gender',
    ];

    const typeToFieldLocal = {
      // this is the field name we use for grouping
      years: 'exhibitionYear',
      exhibitions: 'exhibitionName',
      artists: 'artistId',
      works: 'id',
      format: 'mediumFormat',
      price: 'price',
      gender: 'artistGender',
    };

    let initialData = columnTypesLocal.map((type, i) => {
      const groupingField = typeToFieldLocal[type];
      const tempGroupedData = d3Array.group(rawData, (d) => d[groupingField]);
      const childCount = tempGroupedData.size;
      const out = {
        id: i.toString(),
        title: type,
        parentId: 'top',
        childrenTotal: childCount,
        type: 'chooser',
        columnIndex: 0,
      };
      return out;
    });
    initialData.shift();
    initialData = initialData.sort((a, b) => {
      if (a.childrenTotal < b.childrenTotal) {
        return 1;
      }
      if (a.childrenTotal > b.childrenTotal) {
        return -1;
      }
      return 0;
    });
    setData(initialData);
  }, [rawData]); // , columnTypes, typeToField

  React.useEffect(() => {
    setItems(
      data.map((d) => {
        if (d.parentId === 'top') {
          return {
            ...d,
            parentId: null,
          };
        }
        return {
          ...d,
        };
      }),
    );
  }, [data]);

  const formatPrice = (p) => {
    if (!p) {
      return '';
    }
    const pounds = Math.floor(p);
    const allPence = Math.round((p - pounds) * 240);
    const shillings = Math.floor(allPence / 12);
    const pence = allPence - shillings * 12;
    return `£${pounds} ${shillings}s ${pence}d`;
  };

  const doOnChange = (event, { item, rowIndex, listIndex }) => {
    // remove stuff that will no longer be displayed
    const prevData = data.filter(
      (e) => e.columnIndex === 0 || e.columnIndex <= listIndex,
    );
    const newListOfColumns = listOfColumns.filter(
      (e) => e.index === 0 || e.index <= listIndex,
    );

    // find new data to add
    const newType = item.type === 'chooser' ? item.title : 'chooser';
    let groupedData;
    let narrowedData;
    if (item.type === 'chooser') {
      // group data
      const dataToWorkOn = newListOfColumns[listIndex].data;
      const groupBy = typeToField[item.title];
      groupedData = d3Array.group(dataToWorkOn, (d) => d[groupBy]);
    } else {
      // narrow data
      const preNarrowedData =
        newListOfColumns[newListOfColumns.length - 1].data;
      narrowedData = preNarrowedData.get(item.key);
    }

    const newColumnListData = {
      type: newType,
      id: item.id,
      key: item.type === 'chooser' ? null : item.key,
      index: listIndex + 1,
      data: item.type === 'chooser' ? groupedData : narrowedData,
    };
    newListOfColumns.push(newColumnListData);
    setListOfColumns(newListOfColumns);

    let newData = [];
    const currentColumnTypes = newListOfColumns
      .map((d) => {
        return d.type;
      })
      .filter((d) => {
        return d !== 'chooser';
      });

    const otherColumnTypes = columnTypes.filter((d) => {
      return currentColumnTypes.indexOf(d) < 0;
    });
    otherColumnTypes.shift();

    if (newType === 'chooser') {
      // new column is a type choosing column
      newData = otherColumnTypes.map((type, i) => {
        const groupingField = typeToField[type];
        const tempGroupedData = d3Array.group(
          narrowedData,
          (d) => d[groupingField],
        );
        const childCount = tempGroupedData.size;
        const l = prevData.length + i + 1;
        const out = {
          id: l.toString(),
          title: type,
          parentId: item.id.toString(),
          childrenTotal: childCount,
          type: 'chooser',
          columnIndex: listIndex + 1,
        };
        return out;
      });

      newData = newData.sort((a, b) => {
        if (a.childrenTotal < b.childrenTotal) {
          return 1;
        }
        if (a.childrenTotal > b.childrenTotal) {
          return -1;
        }
        return 0;
      });
    } else {
      let id = prevData.length;

      const newDataToId = [];

      groupedData.forEach((value, key) => {
        id += 1;
        newDataToId[key] = id;
        let thisTitle;

        if (item.title === 'artists') {
          thisTitle =
            value[0].artistFirstName || value[0].artistLastName
              ? `${value[0].artistFirstName} ${value[0].artistLastName}`
              : 'unknown';
        } else if (item.title === 'works') {
          thisTitle = `${value[0].title}${
            value[0].medium || value[0].format ? ' (' : ''
          }${value[0].medium}${value[0].medium && value[0].format ? ' ' : ''}${
            value[0].format
          }${value[0].medium || value[0].format ? ')' : ''}`;
        } else if (item.title === 'price') {
          thisTitle = key ? formatPrice(key) : '';
        } else {
          thisTitle = key;
        }

        let link;
        if (item.title === 'artists') {
          link = `/art-index/artist/${value[0].artistId}`;
        } else if (item.title === 'works') {
          link = `/art-index/work/${value[0].id}`;
        } else if (item.title === 'exhibitions') {
          link = `/art-index/exhibition/${value[0].exhibitionId}`;
        } else if (item.title === 'format') {
          link = `/art-index/search/?formats=${value[0].mediumFormat.toLowerCase()}`;
        } else if (item.title === 'years') {
          link = `/art-index/search/?search=${value[0].exhibitionYear}`;
        }

        newData.push({
          id: id.toString(),
          title: thisTitle,
          parentId: item.id,
          childrenTotal: 0,
          columnIndex: listIndex + 1,
          type: newType,
          key,
          link,
        });
      });

      newData = newData.sort((a, b) => {
        if (a.title < b.title) {
          return newType === 'price' ? 1 : -1;
        }
        if (a.title > b.title) {
          return newType === 'price' ? -1 : 1;
        }
        return 0;
      });
    }

    setData([...prevData, ...newData]);
  };
  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
      <HierarchyColumnBrowser
        items={items}
        originId="1"
        rowHeight={computeRowHeight}
        colWidth={computeColWidth}
        rowComponent={RowComponent}
        listInfoComponent={ListInfoComponent}
        onChange={doOnChange} // event, { item, rowIndex, listIndex }
      />
    </div>
  );
};

const computeRowHeight = ({ item, index, isSelected }) => {
  let height;
  const chars = 41;
  if (item.type === 'chooser') {
    height = 40;
  } else {
    height = Math.floor(item.title.length / chars) * 20 + 40;
  }

  return height;
};
const computeColWidth = ({ listItems, index }) => {
  return (
    index % 2 === 0 ||
    listItems[0]?.type === 'gender' ||
    listItems[0]?.type === 'years' ||
    listItems[0]?.type === 'price'
  );
};

const RowComponent = ({ item, index, key, isSelected, style, onClick }) => {
  return (
    <div
      key={key}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5em',
        fontWeight: isSelected ? '500' : '400',
        // pointerEvents: 'cursor',
        backgroundColor:
          index % 2 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
        color: isSelected ? 'var(--colour-primary)' : 'var(--colour-white)',
        ...style,
      }}
      onClick={onClick}
    >
      <span
        style={{
          textTransform: 'capitalize',
        }}
      >
        {item.title || 'unknown'}
      </span>
      {item.link && (
        <Link as={item.link}>
          <a
            style={{
              marginLeft: '0.5em',
            }}
          >
            view
          </a>
        </Link>
      )}
      {item.childrenTotal ? (
        <span style={{ display: 'flex', opacity: 0.8 }}>
          {item.childrenTotal}{' '}
          <Icon
            name="chevron-forward"
            size="sm"
            colour="white"
            style={{ display: 'flex', marginLeft: '0.5em' }}
          />
        </span>
      ) : null}
    </div>
  );
};

const ListInfoComponent = ({ level, totalItems }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--colour-grey-darkest)',
        padding: '0.5em',
        height: '2.5em',
      }}
    >
      <span style={{ fontWeight: '600' }}>Level {level}</span>{' '}
      <span>{totalItems.toLocaleString()} items</span>
    </div>
  );
};

// const items2 = [
//   {
//     title: 'Test 1',
//     id: '1',
//     parentId: null,
//   },
//   {
//     title: 'Test 1_1',
//     id: '1_1',
//     parentId: '1',
//   },
//   {
//     title: 'Test 1_2',
//     id: '1_2',
//     parentId: '1',
//   },
//   {
//     title: 'Test 1_3',
//     id: '1_3',
//     parentId: '1',
//   },
//   {
//     title: 'Test 1_1_1',
//     id: '1_1_1',
//     parentId: '1_1',
//   },
// ];

export default ArtIndexExplore;
