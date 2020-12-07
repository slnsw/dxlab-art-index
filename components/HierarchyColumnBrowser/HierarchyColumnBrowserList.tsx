import * as React from 'react';
import { AutoSizer, List, ArrowKeyStepper } from 'react-virtualized';

// import { HierarchyBrowserRowProps } from '../../types/hierarchyTypes';

import css from './HierarchyColumnBrowserList.module.scss';

type ListProps = {
  items: any[];
  index: number;
  originId?: string;
  isListSelected?: boolean;
  rowHeight?: number | Function;
  defaultScrollToIndex?: number;
  className?: string;
  listInfoComponent?: React.ReactNode;
  rowComponent?: React.ReactNode;
  onChange?: Function;
  onRowsRendered?: Function;
  onScroll?: Function;
};

type Ref = HTMLDivElement;

const HierarchyBrowserList = React.forwardRef<Ref, ListProps>(
  (
    {
      items = [],
      index,
      originId,
      rowHeight,
      defaultScrollToIndex,
      isListSelected,
      className,
      listInfoComponent,
      rowComponent,
      onChange,
      onRowsRendered,
      onScroll,
    },
    ref,
  ) => {
    const [scrollToIndex, setScrollToIndex] = React.useState(
      defaultScrollToIndex,
    );
    const virtualListRef = React.useRef(null);
    // const { type, totalSiblings } = items[0];
    const { type } = items[0];

    const ListInfo =
      typeof listInfoComponent === 'function'
        ? listInfoComponent
        : DefaultListInfo;

    // console.log(items);

    /**
     * Recompute rowHeights when scrollToIndex changes
     */
    React.useEffect(() => {
      if (virtualListRef.current) {
        // NOTE: be careful as recomputeRowHeights will also cause a scroll to
        // row which may lead to jumps during infinite scroll
        virtualListRef.current.recomputeRowHeights();
      }
    }, [scrollToIndex]);

    /**
     * Handles mouse clicks, keyboard and touch taps, sending changes up
     */
    const handleChange = (event, { item, rowIndex }) => {
      setScrollToIndex(rowIndex);

      if (typeof onChange === 'function') {
        onChange(event, { item, rowIndex, listIndex: index });
      }
    };

    /**
     * Send data on visible rows for data fetching etc.
     */
    const handleRowsRendered = (rowsRendered) => {
      if (typeof onRowsRendered === 'function') {
        onRowsRendered(
          {
            ...rowsRendered,
            // Send some extra info to help with data fetching
            startItem: items[rowsRendered.startIndex],
            stopItem: items[rowsRendered.stopIndex],
          },
          index,
        );
      }
    };

    /**
     * Handle scroll events
     */
    const handleScroll = (event) => {
      if (typeof onScroll === 'function') {
        onScroll(event);
      }
    };

    return (
      <>
        <ArrowKeyStepper
          className={[css.hierarchyBrowserList, className || ''].join(' ')}
          mode="cells"
          columnCount={1}
          width={100}
          rowCount={items.length}
          isControlled={true}
          onScrollToChange={(args) => {
            handleChange(null, {
              item: items[args.scrollToRow],
              rowIndex: args.scrollToRow,
            });
          }}
          scrollToRow={scrollToIndex === null ? -1 : scrollToIndex}
          ref={ref}
        >
          {({ onSectionRendered, scrollToRow }) => {
            return (
              <AutoSizer
                style={{
                  width: '100%',
                  height: '100%',
                  // Prevent list container from scrolling
                  overflow: 'hidden',
                }}
              >
                {({ width, height }) => (
                  <List
                    height={height}
                    width={width}
                    rowCount={items.length}
                    rowHeight={({ index: rowIndex }) => {
                      if (typeof rowHeight === 'function') {
                        const item = items[rowIndex];

                        return rowHeight({
                          item,
                          index: rowIndex,
                          isSelected: rowIndex === scrollToRow,
                        });
                      }

                      return rowHeight;
                    }}
                    // Be careful with this, causes inaccurate scrollToIndex
                    // overscanRowCount={20}
                    scrollToIndex={scrollToIndex}
                    rowRenderer={(params) => {
                      const item = items[params.index];
                      const isSelected = params.index === scrollToRow;
                      const isOrigin = item.id === originId;

                      const rowProps = {
                        item,
                        items,
                        isOrigin,
                        isListSelected,
                        isSelected,
                        onClick: (event) => {
                          // console.log(rowItem);

                          handleChange(event, {
                            item,
                            rowIndex: params.index,
                          });
                        },
                        ...params,
                      };

                      if (typeof rowComponent === 'function') {
                        return rowComponent(rowProps);
                      }

                      return <DefaultRow {...rowProps} />;
                    }}
                    ref={virtualListRef}
                    onSectionRendered={onSectionRendered}
                    onRowsRendered={handleRowsRendered}
                    onScroll={handleScroll}
                  />
                )}
              </AutoSizer>
            );
          }}
        </ArrowKeyStepper>

        <ListInfo type={type} totalItems={items.length} level={index + 1} />
      </>
    );
  },
);

/**
 * Default component to render list info
 * Sits on the bottom of the list
 */
const DefaultListInfo = ({ type, totalItems = 0, level }) => {
  return (
    <div className={css.listInfo}>
      <span className={css.listInfoLevel}>Level {level}</span>
      <span>
        {totalItems.toLocaleString()} {type === 'item' ? 'record' : 'file'}
        {totalItems === 1 ? ' ' : 's'}
      </span>
    </div>
  );
};

/**
 * Default component to render list row
 */
const DefaultRow: React.FunctionComponent<HierarchyBrowserRowProps> = ({
  item,
  index = 0,
  isSelected,
  // key,
  style,
  onClick,
}) => {
  const handleClick = (event) => {
    if (typeof onClick === 'function') {
      // console.log(event, item);

      onClick(event, { item, rowIndex: index });
    }
  };

  return (
    <div
      onClick={handleClick}
      style={style}
      // key={key}
      className={[css.row, isSelected ? css.rowSelected : ''].join(' ')}
    >
      {index}. {item.id} - {item.title}
    </div>
  );
};

export default HierarchyBrowserList;
