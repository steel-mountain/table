import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { FC, RefObject, useCallback, useEffect, useState } from "react";
import { SecondLevelItem } from "../SecondLevelItem/SecondLevelItem";
import { ColumnType } from "../types/types";
import styles from "./styles.module.scss";

interface FirstLevelItemProps {
  element: any;
  row: any;
  header: ColumnType;
  scrollRef: RefObject<HTMLDivElement | null>;
  onSetExpandIndexes: (id: string | number) => void;
  heightAbove: number;
  expanded: boolean;
  isBorder: boolean;
  expandedIndexes: Array<number | string>;
  generateNestedItemsTopItemsCount: (arr: any[], index: number) => number;
}

const rowHeight = 40;
const defaultWidthCell = 60;

export const FirstLevelItem: FC<FirstLevelItemProps> = ({
  element,
  header,
  scrollRef,
  onSetExpandIndexes,
  heightAbove,
  expanded,
  row,
  isBorder,
  // expandedIndexes,
  // generateNestedItemsTopItemsCount,
}) => {
  const virtualizer = useVirtualizer({
    count: element?.children?.length ?? 0,
    scrollMargin: expanded ? heightAbove * rowHeight : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 3,
    enabled: !!element?.children?.length && !!scrollRef.current && expanded,
    scrollToFn: (offset, options, ins) => {},
  });

  const [expandedIndexes, setExpandedIndexes] = useState<Array<number | string>>([]);

  useEffect(() => {
    virtualizer.measure();
    console.log(expandedIndexes);
  }, [expandedIndexes]);

  const generateNestedItemsTopItemsCount = (dataTable: any[], index: number) => {
    let totalItemsCount: number = 0;
    for (let i = 0; i < dataTable.length; i++) {
      if (index === i) break;

      const element = dataTable[i];

      totalItemsCount += 1;

      if (expandedIndexes.includes(dataTable[i].id)) {
        console.log("test");
        totalItemsCount += element?.children?.length ?? 0;
      }
    }

    return totalItemsCount;
  };

  const onSetExpandIndexesCurrent = useCallback(
    (id: string | number) => {
      setExpandedIndexes((prev) => {
        if (prev?.includes(id)) {
          return prev.filter((el) => el !== id);
        }
        return [...prev, id];
      });
    },
    [expandedIndexes]
  );

  return (
    <div
      style={{
        ...header.cellStyle,
        flex: "1 1 0",
        minWidth: header?.cellStyle?.minWidth || defaultWidthCell,
      }}
    >
      <div
        key={header.field}
        className={clsx(styles.bodyInner, {
          [styles.withBorderCell]: isBorder,
        })}
        style={{
          ...header.cellStyle,
          minWidth: header?.cellStyle?.minWidth || defaultWidthCell,
        }}
        onClick={() => {
          header?.onCellClick?.({ rowData: element, column: header, row });
          onSetExpandIndexes?.(element.id);
        }}
      >
        <div className={styles.bodyInnerContainer} id="parent">
          <div>{header?.valueGetter ? header.valueGetter(element) : element[header.field] ?? ""}</div>
        </div>
      </div>
      {!!element && !!element?.children?.length && expanded && (
        <div
          style={{
            minWidth: header?.cellStyle?.minWidth || defaultWidthCell,
            position: "absolute",
            top: 40,
            ...header.cellStyle,
          }}
        >
          <div
            style={{
              position: "relative",
              height: `${virtualizer.getTotalSize()}px`,
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const rowData = element.children?.[virtualRow.index];

              console.log(virtualRow);

              return (
                <div
                  key={virtualRow.index}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start - rowHeight * heightAbove}px)`,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    borderBottom: "1px solid #cbd3dc",
                    backgroundColor: "green",
                  }}
                  id={`!@${virtualRow.size}`}
                >
                  <SecondLevelItem
                    element={rowData}
                    row={virtualRow}
                    header={header}
                    scrollRef={scrollRef}
                    onSetExpandIndexes={onSetExpandIndexesCurrent}
                    heightAbove={generateNestedItemsTopItemsCount(element.children, virtualRow.index) + 1 + heightAbove}
                    expanded={expandedIndexes?.includes(rowData.id)}
                    isBorder={isBorder ?? false}
                    children={rowData?.children}
                  />
                  {/* <div
                    key={header.field}
                    className={clsx(styles.bodyInner, {
                      [styles.withBorderCell]: isBorder,
                    })}
                    style={{
                      ...header.cellStyle,
                      backgroundColor: "green",
                      minWidth: header?.cellStyle?.minWidth || defaultWidthCell,
                    }}
                    onClick={() => {
                      // header?.onCellClick?.({ rowData: el, column: header, row });
                      // onSetExpandIndexes?.();
                    }}
                  >
                    <div className={styles.bodyInnerContainer}>
                      <div>{header?.valueGetter ? header.valueGetter(rowData) : rowData[header.field] ?? ""}</div>
                    </div>
                  </div> */}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
