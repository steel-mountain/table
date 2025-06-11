import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { FC, RefObject, useCallback, useEffect } from "react";
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
  isBorderTop?: boolean;
  expandedIndexes: Array<number | string>;
  key: number | string;
  heightRow: number;
  onSetExpandIndexes: (id: string | number, isParent?: boolean, children?: any[]) => void;
  generateNestedItemsTopItemsCount: (index: number | string) => number;
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
  isBorderTop,
  expandedIndexes,
  heightRow,
  onSetExpandIndexes,
  generateNestedItemsTopItemsCount,
}) => {
  const rowVirtualizer = useVirtualizer({
    count: element?.children?.length ?? 0,
    scrollMargin: expanded ? heightAbove * heightRow : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: (i) => {
      const id = element?.children?.[i]?.id;

      if (expandedIndexes.includes(id)) {
        return heightRow + element?.children?.[i]?.children?.length * heightRow;
      }

      return heightRow;
    },
    overscan: 3,
    enabled: !!element?.children?.length && !!scrollRef.current && expanded,
    scrollToFn: () => {},
  });

  useEffect(() => {
    rowVirtualizer.measure();
  }, [expandedIndexes]);

  const onMouseLeave = useCallback(() => {
    const cells = document.querySelectorAll<HTMLDivElement>("[data-id]");
    cells.forEach((cell) => {
      cell.classList.remove(styles.cellHover);
    });
  }, []);

  const onMouseEnter = useCallback((rowId: number | string) => {
    const cells = document.querySelectorAll<HTMLDivElement>("[data-id]");
    cells.forEach((cell) => {
      if (cell.dataset.id === rowId) {
        cell.classList.add(styles.cellHover);
      }
    });
  }, []);

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
          [styles.borderTop]: isBorderTop,
        })}
        style={{
          ...header.cellStyle,
        }}
        onClick={() => {
          header?.onCellClick?.({ rowData: element, column: header, row });
          onSetExpandIndexes?.(element.id, true, element.children);
        }}
        data-id={element.id}
        onMouseLeave={onMouseLeave}
        onMouseEnter={() => onMouseEnter(element.id)}
      >
        <div className={styles.bodyInnerContainer}>
          <div>{header?.valueGetter ? header.valueGetter(element) : element[header.field] ?? ""}</div>
        </div>
      </div>
      {!!element && !!element?.children?.length && expanded && (
        <div
          style={{
            minWidth: header?.cellStyle?.minWidth || defaultWidthCell,
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
              const row = element.children?.[virtualRow.index];

              return (
                <div
                  key={virtualRow.index}
                  style={{
                    // height: `${virtualRow.size}px`, // для hover эффекта закоменчено
                    transform: `translateY(${virtualRow.start - heightRow * heightAbove}px)`,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                  }}
                  data-id={row.id}
                  onMouseLeave={onMouseLeave}
                  onMouseEnter={() => onMouseEnter(row.id)}
                >
                  <SecondLevelItem
                    element={row}
                    row={virtualRow}
                    header={header}
                    scrollRef={scrollRef}
                    onSetExpandIndexes={onSetExpandIndexes}
                    heightAbove={generateNestedItemsTopItemsCount(row.id) + 1}
                    expanded={expandedIndexes?.includes(row.id)}
                    isBorderRight={isBorderRight}
                    isBorderTop={isBorderTop}
                    heightRow={heightRow}
                    expandedIndexes={expandedIndexes}
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
