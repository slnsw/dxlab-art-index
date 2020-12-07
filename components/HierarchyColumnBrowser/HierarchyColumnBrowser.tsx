import * as React from 'react';
import { transformFlatToLists } from './hierarchyUtils';
// import { useKeyPressCallback } from '../../lib/hooks';
// import { hashDep } from '../../lib';

// import Loader from '../Loader';
import HierarchyBrowserList from './HierarchyColumnBrowserList';

// import { HierarchyBrowserItem } from '../../types/hierarchyTypes';

import css from './HierarchyColumnBrowser.module.scss';

type Props = {
  /** Flattened items that HierarchyBrowser builds lists from */
  // items: HierarchyBrowserItem;
  items: any[];
  originId: string;
  rowHeight?: number | Function;
  colWidth?: Function; // function should return TRUE if column is to use 'thin col' css
  className?: string;
  listInfoComponent?: React.ReactNode;
  rowComponent?: React.ReactNode;
  listPreviewComponent?: React.ReactNode;
  onChange?: Function;
  onRowsRendered?: Function;
  onScroll?: Function;
};

const HierarchyBrowser: React.FunctionComponent<Props> = ({
  items = [],
  originId,
  rowHeight = 80,
  colWidth,
  className,
  listInfoComponent,
  rowComponent,
  listPreviewComponent,
  onChange,
  onRowsRendered,
  onScroll,
}) => {
  const [selectedId, setSelectedId] = React.useState(originId);
  const [isMounted, setIsMounted] = React.useState(false);
  const containerRef = React.useRef(null);
  const listsRef = React.useRef([]);

  // console.log(selectedId);

  // Cache 'lists' and only transform if items or selectedId changes
  const lists = React.useMemo(() => transformFlatToLists(items, selectedId), [
    // hashDep(items),
    items,
    selectedId,
  ]);

  // Derive selected item and list
  const {
    selectedItem,
    // selectedListIndex
  } = getSelectedInfo(lists, selectedId);

  // Reduce jumpiness of horizontal scrolling with some extra blank lists
  const [maxLists, setMaxLists] = React.useState(lists.length);
  const blankListTotal =
    maxLists - lists.length <= 0 ? 0 : maxLists - lists.length;

  React.useEffect(() => {
    /**
     * Update length of listsRef whenever lists changes
     */
    listsRef.current = listsRef.current.slice(0, lists.length);

    /**
     * Update maxLists if new list total is greater
     * Reduces horizontal jumpiness
     */
    if (lists.length > maxLists) {
      setMaxLists(lists.length);
    }
  }, [
    // hashDep(lists),
    maxLists,
    lists,
  ]);

  const selectedItemId = (selectedItem && selectedItem.id) || null;

  /**
   * Scroll list into view
   * TODO: Only scroll if selectedList partially not in view
   */
  React.useEffect(() => {
    if (listsRef.current) {
      const selectedList = listsRef.current[listsRef.current.length - 1];

      if (selectedList) {
        selectedList.scrollIntoView({
          // 'smooth' doesn't work on first mount for some reason
          behavior: isMounted ? 'smooth' : 'auto',
          inline: 'end',
        });

        setIsMounted(true);
      }
    }
  }, [selectedItemId, lists.length, isMounted]);

  // useKeyPressCallback(
  //   'ArrowLeft',
  //   (event) => {
  //     if (selectedItem) {
  //       const {
  //         selectedItem: parentItem,
  //         selectedRowIndex: parentRowIndex,
  //         selectedListIndex: parentListIndex,
  //       } = getSelectedInfo(lists, selectedItem.parentId);

  //       handleChange(event, {
  //         item: parentItem,
  //         rowIndex: parentRowIndex,
  //         listIndex: parentListIndex,
  //       });
  //     }
  //   },
  //   [selectedItem],
  // );

  // TODO: Not quite working yet. Issue with focus on children list
  // useKeyPressCallback(
  //   'ArrowRight',
  //   (event) => {
  //     const totalLists = lists.length;
  //     const hasChildren = selectedListIndex + 1 < totalLists;

  //     if (hasChildren) {
  //       const childListIndex = totalLists - 1;
  //       const childItem = lists[childListIndex][0];
  //       const childRowIndex = 0;

  //       handleChange(event, {
  //         item: childItem,
  //         rowIndex: childRowIndex,
  //         listIndex: childListIndex,
  //       });
  //     }
  //   },
  //   [lists],
  // );

  /**
   * Change selectedId, causing lists to rebuild
   * Also sends changes to outside of the component for data updates
   */
  const handleChange = (event, { item, rowIndex, listIndex }) => {
    setSelectedId(item.id);

    if (typeof onChange === 'function') {
      onChange(event, { item, rowIndex, listIndex });
    }
  };

  let ListPreviewComponent;

  if (typeof listPreviewComponent === 'function') {
    ListPreviewComponent = listPreviewComponent;
  } else {
    ListPreviewComponent = <p>No children</p>;
  }

  return (
    <div
      className={[css.hierarchyBrowser, className || ''].join(' ')}
      ref={containerRef}
    >
      {lists.map((listItems, index) => {
        const defaultScrollToIndex = listItems.findIndex((listItem) => {
          return listItem.isSelected;
        });

        const isListSelected = checkIsListSelected(listItems, selectedId);
        const isLoading = checkIsLoading(listItems);
        const isListPreview = checkIsListPreview(listItems);
        const colWidthCss =
          typeof colWidth === 'function' && colWidth({ listItems, index })
            ? css.thinList
            : css.list;

        return (
          <div
            className={colWidthCss}
            key={index}
            ref={(el) => {
              listsRef.current[index] = el;
            }}
          >
            {(() => {
              if (isLoading) {
                // return <Loader isLoading={true} className={css.loader} />;
                return 'Loader';
              }

              if (isListPreview) {
                return <ListPreviewComponent item={selectedItem} />;
              }

              return (
                <HierarchyBrowserList
                  items={listItems}
                  index={index}
                  originId={originId}
                  rowHeight={rowHeight}
                  isListSelected={isListSelected}
                  defaultScrollToIndex={defaultScrollToIndex}
                  key={index}
                  listInfoComponent={listInfoComponent}
                  rowComponent={rowComponent}
                  onChange={handleChange}
                  onRowsRendered={onRowsRendered}
                  onScroll={onScroll}
                />
              );
            })()}
          </div>
        );
      })}

      {/**
       * Pad out the right side with blank lists to prevent horizontal scroll
       * jumps
       */}
      {[...Array(blankListTotal)].map((_, index) => {
        return <div key={index} className={css.list}></div>;
      })}
    </div>
  );
};

function getSelectedInfo(lists, selectedId) {
  let selectedListIndex;
  let selectedRowIndex;
  let selectedItem;

  lists.forEach((list, listIndex) => {
    const itemFound = list.find((item, rowIndex) => {
      if (item.id === selectedId) {
        selectedRowIndex = rowIndex;
        selectedItem = item;
      }

      return item.id === selectedId;
    });

    if (itemFound) {
      selectedListIndex = listIndex;
    }
  });

  return { selectedListIndex, selectedItem, selectedRowIndex };
}

const checkIsListSelected = (listItems, selectedId) => {
  return (
    listItems.findIndex((listItem) => {
      return listItem.id === selectedId;
    }) >= 0
  );
};

const checkIsLoading = (listItems) => {
  return (
    listItems.findIndex((listItem) => {
      return listItem.type === 'loader';
    }) >= 0
  );
};

const checkIsListPreview = (listItems) => {
  return (
    listItems.findIndex((listItem) => {
      return listItem.type === 'listPreview';
    }) >= 0
  );
};

export default HierarchyBrowser;
