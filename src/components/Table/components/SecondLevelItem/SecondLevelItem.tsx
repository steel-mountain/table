import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { FC, RefObject, useCallback, useEffect } from "react";
import { CellLoader } from "../../../CellLoader/CellLoader";
import { ApiType, ColumnType } from "../types/types";
import styles from "./styles.module.scss";

interface SecondLevelItemProps {
  element: any;
  row: any;
  column: ColumnType;
  scrollRef: RefObject<HTMLDivElement | null>;
  heightAbove: number;
  expanded: boolean;
  isBorderRight?: boolean;
  isBorderTop?: boolean;
  heightRow: number;
  expandedIndexes: Array<number | string>;
  api: ApiType;
  onSetExpandIndexes: (id: string | number, isParent?: boolean, children?: any[]) => void;
}

const defaultWidthCell = 60;

export const SecondLevelItem: FC<SecondLevelItemProps> = ({
  element,
  column,
  scrollRef,
  heightAbove,
  expanded,
  row,
  isBorderRight,
  isBorderTop,
  heightRow,
  expandedIndexes,
  api,
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

  // if (expanded) {
  //   console.log("secondLevelItemL: " + heightAbove);
  // }

  return (
    <div style={{ ...column.cellStyle }}>
      <div
        key={column.field}
        className={clsx(styles.bodyInner, {
          [styles.borderRight]: isBorderRight,
          [styles.borderTop]: isBorderTop,
        })}
        style={{
          backgroundColor: "green",
          height: heightRow,
          minWidth: column?.cellStyle?.minWidth || defaultWidthCell,
          ...column.cellStyle,
        }}
        onClick={() => {
          onSetExpandIndexes?.(element.id);
        }}
      >
        <div className={styles.bodyInnerContainer}>
          {false ? (
            <CellLoader />
          ) : column?.cellComponent ? (
            <column.cellComponent
              data={element}
              column={column}
              row={row}
              value={column?.valueGetter?.(element) ?? element[column.field] ?? ""}
              api={api}
            />
          ) : (
            <div>{column?.valueGetter ? column?.valueGetter?.(element) : element[column.field] ?? ""}</div>
          )}
        </div>
      </div>
      {!!element && !!element?.children?.length && expanded && (
        <div
          style={{
            minWidth: column?.cellStyle?.minWidth || defaultWidthCell,
            ...column.cellStyle,
          }}
        >
          <div
            style={{
              position: "relative",
              height: `${rowVirtualizer.getTotalSize()}px`, // для hover эффекта закоменчено
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const rowData = element.children?.[virtualRow.index];

              // console.log(heightAbove, virtualRow);

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
                    key={column.field}
                    className={clsx(styles.bodyInner, {
                      [styles.borderRight]: isBorderRight,
                      [styles.borderTop]: isBorderTop,
                    })}
                    style={{
                      ...column.cellStyle,
                      minWidth: column?.cellStyle?.minWidth || defaultWidthCell,
                      height: heightRow,
                      backgroundColor: "red",
                    }}
                    onClick={() => {
                      column?.onCellClick?.({ rowData, column, row });
                      onSetExpandIndexes?.(rowData.id);
                    }}
                  >
                    <div className={styles.bodyInnerContainer}>
                      {false ? (
                        <CellLoader />
                      ) : column?.cellComponent ? (
                        <column.cellComponent
                          data={rowData}
                          column={column}
                          row={virtualRow}
                          value={column?.valueGetter?.(rowData) ?? rowData[column.field] ?? ""}
                          api={api}
                        />
                      ) : (
                        <div>{column?.valueGetter ? column?.valueGetter?.(rowData) : rowData[column.field] ?? ""}</div>
                      )}
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
