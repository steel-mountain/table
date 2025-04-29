import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { FC, RefObject } from "react";
import { ColumnType } from "../types/types";
import styles from "./styles.module.scss";

interface FirstLevelItemProps {
  element: any;
  column: any;
  row: any;
  header: ColumnType;
  scrollRef: RefObject<HTMLDivElement | null>;
  onSetExpandIndexes: () => void;
  heightAbove: number;
  expanded: boolean;
  isBorder: boolean;
}

const rowHeight = 40;
const defaultWidthCell = 60;

export const FirstLevelItem: FC<FirstLevelItemProps> = ({
  element,
  column,
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
    overscan: 5,
    enabled: !!element?.children?.length && !!scrollRef.current && expanded,
    scrollToFn: (offset, options, ins) => {},
  });
  console.log(virtualizer, "virtualizer");

  // useEffect(() => {
  //   virtualizer.measure();
  // }, [expanded]);

  // useEffect(() => {
  //   const [lastItem] = [...virtualizer.getVirtualItems()].reverse();

  //   if (!lastItem) {
  //     return;
  //   }

  //   if (lastItem.index + 10 >= +element?.children?.length) {
  //     console.log("WORK AT CHILDREN", element.id);
  //   }
  // }, [virtualizer.getVirtualItems()]);

  return (
    <div>
      <div
        key={header.field}
        className={clsx(styles.bodyInner, {
          [styles.withBorderCell]: isBorder,
        })}
        style={{
          ...header.cellStyle,
          // flex: "1 1 0",
          minWidth: header?.cellStyle?.minWidth || defaultWidthCell,
        }}
        onClick={() => {
          header?.onCellClick?.({ rowData: element, column: header, row });
          onSetExpandIndexes?.();
        }}
      >
        <div className={styles.bodyInnerContainer} id="parent">
          <div>{header?.valueGetter ? header.valueGetter(element) : element[header.field] ?? ""}</div>
        </div>
      </div>
      {!!element && !!element?.children?.length && expanded && (
        <div
          style={{
            top: rowHeight,
          }}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              position: "relative",
              display: "flex",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const el = element.children?.[virtualRow.index];

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
                    display: "flex",
                    borderBottom: "1px solid #cbd3dc",
                  }}
                  id="child"
                >
                  <div
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
                      header?.onCellClick?.({ rowData: el, column: header, row });
                      onSetExpandIndexes?.();
                    }}
                  >
                    <div className={styles.bodyInnerContainer}>
                      <div>{header?.valueGetter ? header.valueGetter(el) : el[header.field] ?? ""}</div>
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
