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
  key: number | string;
  onSetExpandIndexes: (id: string | number, isParent?: boolean, children?: any[]) => void;
}

const defaultHeightRow = 40;
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
  const rowVirtualizer = useVirtualizer({
    count: element?.children?.length ?? 0,
    // скролл нормально не отрабатывает, возможно в этом дело
    scrollMargin: expanded ? heightAbove * defaultHeightRow : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) => {
      const rowHeight = defaultHeightRow;
      const child = element?.children?.[index];

      if (!child) return rowHeight;

      const isExpanded = expandedIndexes.includes(child.id);
      const nestedCount = isExpanded ? child.children?.length ?? 0 : 0;

      return rowHeight + rowHeight * nestedCount;
    },
    overscan: 3,
    enabled: !!element?.children?.length && !!scrollRef.current && expanded,
  });

  console.log(heightAbove);

  useEffect(() => {
    rowVirtualizer.measure();
  }, [expanded]);

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
    const rowHeight = defaultHeightRow;
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
          onSetExpandIndexes?.(element.id, true, element.children);
        }}
      >
        <div className={styles.bodyInnerContainer} id="parent">
          <div>{header?.valueGetter ? header.valueGetter(element) + "" : element[header.field] ?? ""}</div>
        </div>
      </div>
      {!!element && !!element?.children?.length && expanded && (
        <div
          style={{
            minWidth: header?.cellStyle?.minWidth || defaultWidthCell,
            position: "absolute", // для растягивания блока
            top: 40,
            ...header.cellStyle,
          }}
        >
          <div
            style={{
              position: "absolute",
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
                    transform: `translateY(${virtualRow.start - defaultHeightRow * heightAbove + offset}px)`,
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
