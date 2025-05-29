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
  isBorderRight?: boolean;
  isBorderBottom?: boolean;
  expandedIndexes: Array<number | string>;
  key: number | string;
  heightRow: number;
  onSetExpandIndexes: (id: string | number, isParent?: boolean, children?: any[]) => void;
}

const defaultWidthCell = 60;

export const FirstLevelItem: FC<FirstLevelItemProps> = ({
  element,
  row,
  header,
  scrollRef,
  heightAbove,
  expanded,
  isBorderRight,
  isBorderBottom,
  expandedIndexes,
  heightRow,
  onSetExpandIndexes,
}) => {
  const rowVirtualizer = useVirtualizer({
    count: element?.children?.length ?? 0,
    scrollMargin: expanded ? heightAbove * heightRow : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => heightRow,
    overscan: 0,
    enabled: !!element?.children?.length && !!scrollRef.current && expanded,
    scrollToFn: () => {},
  });

  useEffect(() => {
    rowVirtualizer.measure();
  }, [expandedIndexes]);

  // useEffect(() => {
  //   const virtualItems = rowVirtualizer.getVirtualItems();
  //   const totalCount = rowVirtualizer.options.count;

  //   const isLastItemVisible = virtualItems.some((item) => item.index === totalCount - 1);

  //   if (isLastItemVisible) {
  //     console.log("Последний элемент в зоне видимости!");
  //   }
  // }, [rowVirtualizer.getVirtualItems()]);

  const generateNestedItemsTopItemsCount = (index: number) => {
    let totalItemsCount: number = 1;
    const elements = element?.children ?? [];
    for (let i = 0; i < elements.length; i++) {
      if (index === i) break;

      const element = elements[i];

      totalItemsCount += 1;

      if (expandedIndexes.includes(element.id)) {
        totalItemsCount += element?.children?.length ?? 0;
      }
    }

    return totalItemsCount;
  };

  const calculateOffsetBeforeIndex = (index: number): number => {
    const rowHeight = heightRow;
    const children = element?.children ?? [];
    let offset = 0;

    for (let i = 0; i < index; i++) {
      const child = children[i];

      if (expandedIndexes.includes(child.id)) {
        offset += (child.children?.length ?? 0) * rowHeight;
      }
    }

    return offset;
  };

  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: header?.cellStyle?.minWidth || defaultWidthCell,
        ...header.cellStyle,
      }}
    >
      <div
        key={header.field}
        className={clsx(styles.bodyInner, {
          [styles.borderRight]: isBorderRight,
          [styles.borderBottom]: isBorderBottom,
        })}
        style={{
          ...header.cellStyle,
        }}
        onClick={() => {
          header?.onCellClick?.({ rowData: element, column: header, row });
          onSetExpandIndexes?.(element.id, true, element.children);
        }}
      >
        <div className={styles.bodyInnerContainer}>
          <div>{header?.valueGetter ? header.valueGetter(element) + "" : element[header.field] ?? ""}</div>
        </div>
      </div>
      {!!element && !!element?.children?.length && expanded && (
        <div
          style={{
            minWidth: header?.cellStyle?.minWidth || defaultWidthCell,
            top: 40,
            ...header.cellStyle,
          }}
        >
          <div
            style={{
              position: "relative",
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const rowData = element.children?.[virtualRow.index];

              const offset = calculateOffsetBeforeIndex(virtualRow.index);

              return (
                <div
                  id="first"
                  key={virtualRow.index}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start - heightRow * heightAbove + offset}px)`,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                  }}
                >
                  <SecondLevelItem
                    element={rowData}
                    row={virtualRow}
                    header={header}
                    scrollRef={scrollRef}
                    onSetExpandIndexes={onSetExpandIndexes}
                    heightAbove={generateNestedItemsTopItemsCount(virtualRow.index) + 1 + heightAbove}
                    expanded={expandedIndexes?.includes(rowData.id)}
                    isBorderRight={isBorderRight}
                    isBorderBottom={isBorderBottom}
                    heightRow={heightRow}
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
