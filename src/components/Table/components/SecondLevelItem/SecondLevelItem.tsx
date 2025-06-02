import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { FC, RefObject, useEffect } from "react";
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
  isBorderBottom?: boolean;
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
  isBorderBottom,
  heightRow,
  expandedIndexes,
  onSetExpandIndexes,
}) => {
  const rowVirtualizer = useVirtualizer({
    count: element?.children?.length ?? 0,
    scrollMargin: expanded ? heightAbove * heightRow : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => heightRow,
    overscan: 2,
    enabled: !!element?.children?.length && !!scrollRef.current && expanded,
    scrollToFn: () => {},
  });

  useEffect(() => {
    rowVirtualizer.measure();
  }, [expandedIndexes]);

  if (!!element && !!element?.children?.length && expanded) {
    // console.log(heightAbove, heightRow, element?.vehicle?.reg_number, element?.children);
    console.log({
      count: element?.children?.length ?? 0,
      scrollMargin: expanded ? heightAbove * heightRow : 0,
      getScrollElement: () => scrollRef.current,
      estimateSize: () => heightRow,
      overscan: 2,
      enabled: !!element?.children?.length && !!scrollRef.current && expanded,
      scrollToFn: () => {},
    });
  }

  return (
    <div
      style={{
        backgroundColor: "red",
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
          backgroundColor: "green",
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
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const rowData = element.children?.[virtualRow.index];

              return (
                <div
                  key={virtualRow.index}
                  id={`second-${heightAbove}`}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start - heightRow * heightAbove}px)`,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
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
                      minWidth: header?.cellStyle?.minWidth || defaultWidthCell,
                      height: heightRow,
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
