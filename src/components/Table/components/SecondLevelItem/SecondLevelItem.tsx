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
  onSetExpandIndexes: (id: string | number) => void;
  heightAbove: number;
  expanded: boolean;
  isBorder: boolean;
}

const rowHeight = 40;
const defaultWidthCell = 60;

export const SecondLevelItem: FC<SecondLevelItemProps> = ({
  element,
  header,
  scrollRef,
  onSetExpandIndexes,
  heightAbove,
  expanded,
  row,
  isBorder,
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

  useEffect(() => {
    virtualizer.measure();
  }, [expanded]);

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
          onSetExpandIndexes?.(element.id);
        }}
      >
        <div className={styles.bodyInnerContainer}>
          <div>{header?.valueGetter ? header.valueGetter(element) : element[header.field] ?? ""}</div>
        </div>
      </div>
      {/* {!!element && !!element?.children?.length && expanded && (
        <div
          id="grandChild"
          style={{
            minWidth: header?.cellStyle?.minWidth || defaultWidthCell,
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

              console.log(virtualRow, heightAbove);

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
                    backgroundColor: "red",
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
      )} */}
    </div>
  );
};
