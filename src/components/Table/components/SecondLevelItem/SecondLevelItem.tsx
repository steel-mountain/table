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
  onSetExpandIndexes: (id: string | number, isParent?: boolean, children?: any[]) => void;
}

const defaultHeightRow = 40;
const defaultWidthCell = 60;

export const SecondLevelItem: FC<SecondLevelItemProps> = ({
  element,
  header,
  scrollRef,
  onSetExpandIndexes,
  heightAbove,
  expanded,
  row,
  isBorderRight,
  isBorderBottom,
}) => {
  const rowVirtualizer = useVirtualizer({
    count: element?.children?.length ?? 0,
    scrollMargin: expanded ? heightAbove * defaultHeightRow : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => defaultHeightRow,
    overscan: 3,
    enabled: !!element?.children?.length && !!scrollRef.current && expanded,
    scrollToFn: () => {},
  });

  useEffect(() => {
    rowVirtualizer.measure();
  }, [expanded]);

  return (
    <div
      style={{
        ...header.cellStyle,
        flex: "1 1 0",
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
          height: "40px",
          minWidth: header?.cellStyle?.minWidth || defaultWidthCell,
        }}
        onClick={() => {
          onSetExpandIndexes?.(element.id);
        }}
      >
        <div className={styles.bodyInnerContainer}>
          <div>{header?.valueGetter ? header.valueGetter(element) + "22" : element[header.field] ?? ""}</div>
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
                  id="second"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start - defaultHeightRow * heightAbove}px)`,
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
                      height: defaultHeightRow,
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
