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
  tableProps?: {
    wrapperStyle?: React.CSSProperties;
    isHeaderSticky?: boolean;
    isBorderRight?: boolean;
    isBorderTop?: boolean;
    enableColumnVirtualizer?: boolean;
    maxWidth?: boolean;
    headerStyle: React.CSSProperties;
    bodyStyle: React.CSSProperties;
  };
}

const defaultHeightRow = 40;
const zIndexWrapper = 2;
const boxShadowPinnedTable = "4px 0 6px -2px rgba(0, 0, 0, 0.3)";

export const CustomTable: FC<CustomTableProps> = memo(({ columns, data, tableProps }) => {
  const {
    wrapperStyle = {},
    isHeaderSticky = true,
    headerStyle,
    bodyStyle,
    isBorderRight = true,
    isBorderTop = true,
    enableColumnVirtualizer = false,
    maxWidth,
  } = tableProps ?? {};

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
    const styleSheet = document.styleSheets[0];
    const rule = `.${styles.tableContainer}::-webkit-scrollbar-track {
        background: #f0f0f0;
        margin-left: ${childFirstTableRef?.current?.clientWidth}px;
        margin-top: ${headerStyle?.height ?? defaultHeightRow}px;
      }`;

    styleSheet.insertRule(rule, styleSheet.cssRules.length);
  }, [columns]);

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
    estimateSize: (i) => {
      const rowHeight = +(headerStyle?.height ?? defaultHeightRow);
      const row = dataTable[i];
      if (!row) return rowHeight;

      if (expandedIndexes.includes(row.id)) {
        const visibleDescendantsCount = countVisibleDescendants(row, expandedIndexes);
        return rowHeight + visibleDescendantsCount * rowHeight;
      }
      return defaultHeightRow;
    },
    overscan: 3,
  });

  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    const totalCount = rowVirtualizer.options.count;

    const isLastItemVisible = virtualItems.some((item) => item.index === totalCount - 1);

    if (isLastItemVisible) {
      // console.log("Последний элемент в зоне видимости!");
    }
  }, [rowVirtualizer.getVirtualItems()]);

  const generateNestedItemsTopItemsCount = useCallback(
    (id: number | string) => {
      let count = 0;
      let found = false;

      function traverse(items: any[]) {
        for (const item of items) {
          if (found) return;

          if (item.id === id) {
            found = true;
            return;
          }

          count++;

          if (expandedIndexes.includes(item.id) && item.children) {
            traverse(item.children);
          }
        }
      }

      traverse(dataTable);
      return count;
    },
    [expandedIndexes]
  );

  const onSetExpandIndexes = useCallback(
    (id: string | number, isParent?: boolean, children?: any) => {
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
    },
    [expandedIndexes]
  );

  const lastPinned = useMemo(() => {
    return columns.filter((item: any) => item?.pinned).at(-1);
  }, [columns]);

  const onMouseLeave = useCallback((index: number) => {
    const rowFirstTable = rowFirstTableRefs.current[index];
    const rowSecondTable = rowSecondTableRefs.current[index];
    if (rowFirstTable && rowSecondTable) {
      rowFirstTable.classList.remove(styles.cellHover);
      rowSecondTable.classList.remove(styles.cellHover);
    }
  }, []);

  const onMouseEnter = useCallback((index: number) => {
    const rowFirstTable = rowFirstTableRefs.current[index];
    const rowSecondTable = rowSecondTableRefs.current[index];
    if (rowFirstTable && rowSecondTable) {
      rowFirstTable.classList.add(styles.cellHover);
      rowSecondTable.classList.add(styles.cellHover);
    }
  }, []);

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
            <div className={clsx({ [styles.headerSticky]: isHeaderSticky })} style={{ ...headerStyle }}>
              <div className={styles.header}>
                {memoizedColums.map((column: ColumnType) => {
                  if (!column?.pinned) return null;

                  return (
                    <div
                      key={column.field}
                      className={clsx(styles.headerInner, {
                        [styles.withBorderHeader]: isBorderRight,
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
                const row = dataTable[virtualRow.index];

                return (
                  <div
                    key={row.id}
                    ref={(el) => {
                      rowFirstTableRefs.current[row.id] = el;
                    }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                      display: "flex",
                      ...bodyStyle,
                      // height: `${virtualRow.size}px`, // для hover эффекта закоменчено
                    }}
                    // onMouseLeave={() => onMouseLeave(row.id)}
                    // onMouseEnter={() => onMouseEnter(row.id)}
                  >
                    {memoizedColums.map((column: ColumnType) => {
                      if (!column?.pinned) return null;
                      const isBorder = isBorderRight && lastPinned?.field !== column.field;

                      return (
                        <FirstLevelItem
                          key={column.field}
                          element={row}
                          row={virtualRow}
                          header={column}
                          scrollRef={tableContainerRef}
                          onSetExpandIndexes={onSetExpandIndexes}
                          heightAbove={generateNestedItemsTopItemsCount(row.id) + 1}
                          expanded={expandedIndexes?.includes(row.id)}
                          isBorderRight={isBorder ?? true}
                          isBorderTop={isBorderTop}
                          expandedIndexes={expandedIndexes}
                          heightRow={+(bodyStyle?.height ?? defaultHeightRow)}
                          generateNestedItemsTopItemsCount={generateNestedItemsTopItemsCount}
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
      <div style={{ width: "100%" }}>
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
                        [styles.borderRight]: isBorderRight,
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
                            [styles.borderRight]: isBorderRight,
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
                        [styles.borderRight]: isBorderRight,
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
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = dataTable[virtualRow.index];

                return (
                  <div
                    key={row.id}
                    ref={(el) => {
                      rowSecondTableRefs.current[row.id] = el;
                    }}
                    style={{
                      ...(maxWidth ? { width: "100%", display: "flex" } : {}),
                      ...bodyStyle,
                      // height: `${virtualRow.size}px`, // для hover эффекта закоменчено
                      position: "absolute",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    // onMouseLeave={() => onMouseLeave(row.id)}
                    // onMouseEnter={() => onMouseEnter(row.id)}
                  >
                    {columns.map((column: ColumnType) => {
                      if (column?.pinned) return null;

                      const isBorder = isBorderRight && lastPinned?.field !== column.field;

                      return (
                        <FirstLevelItem
                          key={column.field}
                          element={row}
                          row={virtualRow}
                          header={column}
                          scrollRef={tableContainerRef}
                          onSetExpandIndexes={onSetExpandIndexes}
                          heightAbove={generateNestedItemsTopItemsCount(row.id) + 1}
                          expanded={expandedIndexes?.includes(row.id)}
                          isBorderRight={isBorder ?? true}
                          isBorderTop={isBorderTop}
                          expandedIndexes={expandedIndexes}
                          heightRow={+(bodyStyle?.height ?? defaultHeightRow)}
                          generateNestedItemsTopItemsCount={generateNestedItemsTopItemsCount}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
