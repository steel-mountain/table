import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { FC, RefObject, useCallback, useEffect } from "react";
import { ColumnType } from "../types/types";
import styles from "./styles.module.scss";

interface SecondLevelItemProps {
  element: any;
  row: any;
  header: ColumnType;
  scrollRef: RefObject<HTMLDivElement | null>;
  heightAbove: number;
  expanded: boolean;
  isBorderRight?: boolean;
  isBorderTop?: boolean;
  heightRow: number;
  expandedIndexes: Array<number | string>;
  onSetExpandIndexes: (id: string | number, isParent?: boolean, children?: any[]) => void;
}

const defaultWidthCell = 60;

export const SecondLevelItem: FC<SecondLevelItemProps> = ({
  element,
  header,
  scrollRef,
  heightAbove,
  expanded,
  row,
  isBorderRight,
  isBorderTop,
  heightRow,
  expandedIndexes,
  onSetExpandIndexes,
}) => {
  const rowVirtualizer = useVirtualizer({
    count: element?.children?.length ?? 0,
    scrollMargin: expanded ? heightAbove * heightRow : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => heightRow,
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
          // backgroundColor: "green",
          height: heightRow,
          minWidth: header?.cellStyle?.minWidth || defaultWidthCell,
          ...header.cellStyle,
        }}
        onClick={() => {
          onSetExpandIndexes?.(element.id);
        }}
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
              // height: `${rowVirtualizer.getTotalSize()}px`, // для hover эффекта закоменчено
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const rowData = element.children?.[virtualRow.index];

              return (
                <div
                  key={virtualRow.index}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start - heightRow * heightAbove}px)`,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                  }}
                  data-id={rowData.id}
                  onMouseLeave={onMouseLeave}
                  onMouseEnter={() => onMouseEnter(rowData.id)}
                >
                  <div
                    key={header.field}
                    className={clsx(styles.bodyInner, {
                      [styles.borderRight]: isBorderRight,
                      [styles.borderTop]: isBorderTop,
                    })}
                    style={{
                      ...header.cellStyle,
                      minWidth: header?.cellStyle?.minWidth || defaultWidthCell,
                      height: heightRow,
                      // backgroundColor: "red",
                    }}
                    onClick={() => {
                      header?.onCellClick?.({ rowData, column: header, row });
                      onSetExpandIndexes?.(rowData.id);
                    }}
                  >
                    <div className={styles.bodyInnerContainer}>
                      <div>{header?.valueGetter ? header.valueGetter(rowData) : rowData[header.field] ?? ""}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
