import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { FC, RefObject, useEffect } from "react";
import { SecondLevelItem } from "../SecondLevelItem/SecondLevelItem";
import { ColumnType } from "../types/types";
import styles from "./styles.module.scss";

interface FirstLevelItemProps {
  element: any;
  row: any;
  header: ColumnType;
  scrollRef: RefObject<HTMLDivElement | null>;
  heightAbove: number;
  expanded: boolean;
  isBorder: boolean;
  expandedIndexes: Array<number | string>;
  onSetExpandIndexes: (id: string | number) => void;
}

const rowHeight = 40;
const defaultWidthCell = 60;

export const FirstLevelItem: FC<FirstLevelItemProps> = ({
  element,
  row,
  header,
  scrollRef,
  heightAbove,
  expanded,
  isBorder,
  expandedIndexes,
  onSetExpandIndexes,
}) => {
  const virtualizer = useVirtualizer({
    count: element?.children?.length ?? 0,
    scrollMargin: expanded ? heightAbove * rowHeight : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 3,
    enabled: !!element?.children?.length && !!scrollRef.current && expanded,
    // scrollToFn: (offset, options, ins) => {},
  });

  useEffect(() => {
    virtualizer.measure();
  }, [expanded]);

  const generateNestedItemsTopItemsCount = (dataTable: any[], index: number) => {
    let totalItemsCount: number = 0;
    for (let i = 0; i < dataTable.length; i++) {
      if (index === i) break;

      const element = dataTable[i];

      totalItemsCount += 1;

      if (expandedIndexes.includes(dataTable[i].id)) {
        totalItemsCount += element?.children?.length ?? 0;
      }
    }

    return totalItemsCount;
  };

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
          id="child"
          style={{
            minWidth: header?.cellStyle?.minWidth || defaultWidthCell,
            position: "absolute", // для растягивания блока
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
                  id={`SIZE=${virtualRow.size}`}
                >
                  <SecondLevelItem
                    element={rowData}
                    row={virtualRow}
                    header={header}
                    scrollRef={scrollRef}
                    onSetExpandIndexes={onSetExpandIndexes}
                    heightAbove={generateNestedItemsTopItemsCount(element.children, virtualRow.index) + 1 + heightAbove}
                    expanded={expandedIndexes?.includes(rowData.id)}
                    isBorder={isBorder ?? false}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
