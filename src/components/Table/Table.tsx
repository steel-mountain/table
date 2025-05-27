import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React, { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FirstLevelItem } from "./components/FirstLevelItem/FirstLevelItem";
import { ColumnType } from "./components/types/types";
import styles from "./styles.module.scss";
import { countVisibleDescendants } from "./utils/utils";

interface CustomTableProps {
  columns: any;
  data: any[];
  isLoading?: boolean;
  isFetching?: boolean;
  isFlattenArray?: boolean;
  fetchMoreData?: () => void;
  tableProps?: {
    wrapperStyle?: React.CSSProperties;
    isHeaderSticky?: boolean;
    isBorder?: boolean;
    enableColumnVirtualizer?: boolean;
    maxWidth?: boolean;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    onHandleRow?: (row: any) => void;
  };
}

const defaultHeightRow = 40;
const defaultWidthCell = 60;
const zIndexWrapper = 2;
const boxShadowPinnedTable = "4px 0 6px -2px rgba(0, 0, 0, 0.3)";

export const CustomTable: FC<CustomTableProps> = memo(({ columns, data, tableProps }) => {
  const { wrapperStyle, isHeaderSticky, headerStyle, bodyStyle, isBorder, enableColumnVirtualizer, maxWidth } =
    tableProps ?? {};

  const [dataTable, setDataTable] = useState<any[]>([]);
  const [expandedIndexes, setExpandedIndexes] = useState<Array<number | string>>([]);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const childFirstTableRef = useRef<HTMLDivElement>(null);
  const childSecondTableRef = useRef<HTMLDivElement>(null);
  const rowFirstTableRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const rowSecondTableRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    setDataTable(data);
  }, [data]);

  useEffect(() => {
    rowVirtualizer.measure();
  }, [expandedIndexes]);

  const columnVirtualizer = enableColumnVirtualizer
    ? useVirtualizer({
        count: columns.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: (index) => (!columns[index]?.pinned ? columns[index].cellStyle?.minWidth ?? 100 : null),
        horizontal: true,
      })
    : null;

  const rowVirtualizer = useVirtualizer({
    count: dataTable.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: (i: number) => {
      const rowHeight = defaultHeightRow;
      const row = dataTable[i];
      if (!row) return rowHeight;

      if (expandedIndexes.includes(row.id)) {
        const visibleDescendantsCount = countVisibleDescendants(row, expandedIndexes);
        return rowHeight + visibleDescendantsCount * rowHeight;
      }

      return rowHeight;
    },
    overscan: 3,
  });

  const generateNestedItemsTopItemsCount = (index: number) => {
    let totalItemsCount: number = 1;
    for (let i = 0; i < dataTable.length; i++) {
      if (index === i) break;

      const element = dataTable[i];

      totalItemsCount += 1;

      if (expandedIndexes.includes(element.id)) {
        totalItemsCount += element?.children?.length ?? 0;
      }
    }

    return totalItemsCount;
  };

  const lastPinned = useMemo(() => {
    return columns.filter((item: any) => item?.pinned).at(-1);
  }, [columns]);

  const onSetExpandIndexes = useCallback((id: string | number, isParent?: boolean, children?: any) => {
    setExpandedIndexes((prev) => {
      const isExpanded = prev.includes(id);

      if (isExpanded) {
        if (isParent) {
          const childIds = children.map((child: any) => child.id);
          return prev.filter((item) => item !== id && !childIds.includes(item));
        }

        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  }, []);

  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    const totalCount = rowVirtualizer.options.count;

    const isLastItemVisible = virtualItems.some((item) => item.index === totalCount - 1);

    if (isLastItemVisible) {
      // console.log("Последний элемент в зоне видимости!");
    }
  }, [rowVirtualizer.getVirtualItems()]);

  const memoizedColums = useMemo(() => columns, [columns]);

  return (
    <div
      className={styles.tableContainer}
      ref={tableContainerRef}
      style={{
        overflow: "auto",
        height: "100%",
        width: "100%",
        position: "relative",
        display: "flex",
        ...wrapperStyle,
      }}
    >
      <>
        <div
          ref={childFirstTableRef}
          style={{
            position: "sticky",
            left: 0,
            zIndex: zIndexWrapper,
          }}
        >
          <div className={styles.container} style={{ boxShadow: boxShadowPinnedTable }}>
            <div className={clsx({ [styles.headerSticky]: isHeaderSticky })}>
              <div className={styles.header}>
                {memoizedColums.map((column: ColumnType) => {
                  if (!column?.pinned) return null;

                  return (
                    <div
                      key={column.field}
                      className={clsx(styles.headerInner, {
                        [styles.withBorderHeader]: isBorder,
                      })}
                      style={column.cellStyle}
                    >
                      {column.headerComponent ? (
                        <column.headerComponent {...column} />
                      ) : (
                        <div className={styles.headerInnerContainer}>
                          <div>{column.headerName}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ position: "relative", height: rowVirtualizer.getTotalSize() }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const rowData = dataTable[virtualRow.index];

                return (
                  <div
                    key={rowData.id}
                    ref={(el) => {
                      rowFirstTableRefs.current[rowData.id] = el;
                    }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      borderBottom: "1px solid #cbd3dc",
                      display: "flex",
                    }}
                  >
                    {memoizedColums.map((column: ColumnType) => {
                      if (!column?.pinned) return null;
                      const isBorderVisible = isBorder && lastPinned?.field !== column.field;

                      return (
                        <FirstLevelItem
                          key={column.field}
                          element={rowData}
                          row={virtualRow}
                          header={column}
                          scrollRef={tableContainerRef}
                          onSetExpandIndexes={onSetExpandIndexes}
                          heightAbove={generateNestedItemsTopItemsCount(virtualRow.index)}
                          expanded={expandedIndexes?.includes(rowData.id)}
                          isBorder={isBorderVisible ?? false}
                          expandedIndexes={expandedIndexes}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
      {/* <div style={{ width: "100%" }}>
        {enableColumnVirtualizer ? (
          <div
            ref={childSecondTableRef}
            className={styles.container}
            style={{ minWidth: columnVirtualizer?.getTotalSize() }}
          >
            <div className={clsx({ [styles.headerSticky]: isHeaderSticky })}>
              <div className={styles.header} style={headerStyle}>
                {columnVirtualizer?.getVirtualItems().map((item) => {
                  const column = columns[item.index] as ColumnType;

                  if (column?.pinned) return null;

                  return (
                    <div
                      key={column.field}
                      className={clsx(styles.headerInnerVirtualize, {
                        [styles.withBorderCell]: isBorder,
                      })}
                      style={{
                        width: `${item.size}px`,
                        transform: `translateX(${item.start}px)`,
                        ...column.cellStyle,
                      }}
                    >
                      {column?.headerComponent ? (
                        <column.headerComponent {...column} />
                      ) : (
                        <div className={styles.headerInnerContainer}>
                          <div>{column.headerName}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ position: "relative", height: rowVirtualizer.getTotalSize() }}>
              {rowVirtualizer.getVirtualItems().map((row) => {
                const rowData = dataTable[row.index];

                return (
                  <div
                    key={rowData.id}
                    ref={(el) => {
                      rowSecondTableRefs.current[rowData.id] = el;
                    }}
                    style={{
                      position: "absolute",
                      transform: `translateY(${row.start}px)`,
                      width: childSecondTableRef.current?.clientWidth || 0,
                      borderBottom: "1px solid #cbd3dc",
                      ...bodyStyle,
                    }}
                  >
                    {columnVirtualizer?.getVirtualItems().map((colItem) => {
                      const column = columns[colItem.index] as ColumnType;
                      const field = column.field as string;

                      if (column?.pinned) return null;

                      return (
                        <div
                          key={column.field}
                          className={clsx(styles.bodyInnerVirtualize, {
                            [styles.withBorderCell]: isBorder,
                          })}
                          style={{
                            ...column.cellStyle,
                            width: `${colItem.size}px`,
                            transform: `translateX(${colItem.start}px)`,
                          }}
                        >
                          <div className={styles.bodyInnerContainer} style={{ height: "inherit" }}>
                            <div>{column?.valueGetter?.(rowData) ?? rowData[field] ?? ""}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div ref={childSecondTableRef} className={styles.container}>
            <div
              className={clsx({
                [styles.headerSticky]: isHeaderSticky,
              })}
            >
              <div
                className={styles.header}
                style={{
                  ...(maxWidth ? { display: "flex" } : {}),
                  ...headerStyle,
                }}
              >
                {columns.map((column: ColumnType) => {
                  if (column?.pinned) return null;

                  return (
                    <div
                      key={column.field}
                      className={clsx(styles.headerInner, {
                        [styles.withBorderCell]: isBorder,
                      })}
                      style={{
                        ...(maxWidth ? { flex: 1 } : {}),
                        ...column.cellStyle,
                      }}
                    >
                      {column?.headerComponent ? (
                        <column.headerComponent {...column} />
                      ) : (
                        <div className={styles.headerInnerContainer}>
                          <div>{column.headerName}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ position: "relative", height: rowVirtualizer.getTotalSize() }}>
              {rowVirtualizer.getVirtualItems().map((row) => {
                const rowData = dataTable[row.index];

                return (
                  <div
                    className={styles.row}
                    key={rowData.id}
                    ref={(el) => {
                      rowSecondTableRefs.current[rowData.id] = el;
                    }}
                    style={{
                      position: "absolute",
                      transform: `translateY(${row.start}px)`,
                      borderBottom: "1px solid #cbd3dc",
                      ...(maxWidth ? { width: "100%", display: "flex" } : {}),
                      ...bodyStyle,
                    }}
                  >
                    {columns.map((column: ColumnType) => {
                      if (column?.pinned) return null;

                      const isBorderVisible = isBorder && lastPinned?.field !== column.field;

                      return (
                        <FirstLevelItem
                          key={column.field}
                          element={rowData}
                          row={row}
                          header={column}
                          scrollRef={tableContainerRef}
                          onSetExpandIndexes={onSetExpandIndexes}
                          heightAbove={generateNestedItemsTopItemsCount(row.index) + 1}
                          expanded={expandedIndexes?.includes(rowData.id)}
                          isBorder={isBorderVisible ?? false}
                          expandedIndexes={expandedIndexes}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
});
