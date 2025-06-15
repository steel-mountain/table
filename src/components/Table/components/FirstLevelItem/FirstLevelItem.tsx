import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import axios from "axios";
import clsx from "clsx";
import { Dispatch, FC, RefObject, SetStateAction, useCallback, useEffect, useMemo } from "react";
import { CellLoader } from "../../../CellLoader/CellLoader";
import { SecondLevelItem } from "../SecondLevelItem/SecondLevelItem";
import { ApiType, ColumnType } from "../types/types";
import styles from "./styles.module.scss";

interface FirstLevelItemProps {
  element: any;
  row: any;
  column: ColumnType;
  scrollRef: RefObject<HTMLDivElement | null>;
  heightAbove: number;
  expanded: boolean;
  isBorderRight?: boolean;
  isBorderTop?: boolean;
  expandedIndexes: Array<number | string>;
  key: number | string;
  heightRow: number;
  api: ApiType;
  onSetExpandIndexes: (id: string | number, isParent?: boolean, children?: any[]) => void;
  generateNestedItemsTopItemsCount: (index: number | string) => number;
  isFirst?: boolean;
  setChilds?: Dispatch<SetStateAction<any[]>>;
  childs: any[];
}

const defaultWidthCell = 60;

export const FirstLevelItem: FC<FirstLevelItemProps> = ({
  element,
  row,
  column,
  scrollRef,
  heightAbove,
  expanded,
  isBorderRight,
  isBorderTop,
  expandedIndexes,
  heightRow,
  api,
  onSetExpandIndexes,
  generateNestedItemsTopItemsCount,
  isFirst,
  setChilds,
  childs = [],
}) => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["nested elements", element.id],
    queryFn: (ctx) => axios.get(`http://localhost:3000/children?_page=${ctx.pageParam}&_per_page=25`),
    getNextPageParam: (lastGroup) => lastGroup.data.next,
    initialPageParam: 1,
    enabled: !!expanded,
  });

  const children = useMemo(() => {
    if (!expanded) return;
    const arr = data?.pages?.flatMap((page) => page.data.data) ?? [];

    const generateStableIds = (items: any[], parentPath: string): any[] => {
      return items.map((item, index) => {
        const currentId = `${parentPath}-${index}`;
        return {
          ...item,
          id: currentId,
          children: Array.isArray(item.children) ? generateStableIds(item.children, currentId) : [],
        };
      });
    };

    const newChildren = generateStableIds(arr, element.id);

    return newChildren;
  }, [data?.pages]);

  useEffect(() => {
    if (!expanded) return;
    setChilds?.((prev) => {
      const arr = prev.map((item) => (item.id === element.id ? { ...item, children } : item));
      return arr;
    });
  }, [element.id, setChilds, children]);

  const rowVirtualizer = useVirtualizer({
    count: children?.length ?? 0,
    scrollMargin: expanded ? heightAbove * heightRow : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: (i) => {
      if (childs[row.index]) {
        const id = childs[row.index].children?.[i]?.id;

        if (expandedIndexes.includes(id)) {
          return heightRow + childs[row.index].children?.[i]?.children?.length * heightRow;
        }
        return heightRow;
      }

      return heightRow;
    },
    overscan: 3,
    enabled: !!children?.length && !!scrollRef.current && expanded,
    scrollToFn: () => {},
  });

  useEffect(() => {
    if (isFirst) {
      const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

      if (!lastItem) {
        return;
      }

      if (lastItem.index >= children?.length - 1 && hasNextPage && !isFetchingNextPage) {
        console.log("CALLLL");
        fetchNextPage();
      }
    }
  }, [hasNextPage, fetchNextPage, children?.length, isFetchingNextPage, rowVirtualizer.getVirtualItems()]);

  useEffect(() => {
    rowVirtualizer.measure();
  }, [expandedIndexes, childs[row.index]]);

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
        minWidth: column?.cellStyle?.minWidth || defaultWidthCell,
        ...column.cellStyle,
      }}
    >
      <div
        key={column.field}
        className={clsx(styles.bodyInner, {
          [styles.borderRight]: isBorderRight,
          [styles.borderTop]: isBorderTop,
        })}
        style={{
          ...column.cellStyle,
        }}
        onClick={() => {
          column?.onCellClick?.({ rowData: element, column, row });
          onSetExpandIndexes?.(element.id, true, children);
        }}
        data-id={element.id}
        onMouseLeave={onMouseLeave}
        onMouseEnter={() => onMouseEnter(element.id)}
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
      {!!element && !!children?.length && expanded && (
        <div
          style={{
            minWidth: column?.cellStyle?.minWidth || defaultWidthCell,
            ...column.cellStyle,
          }}
        >
          <div
            style={{
              position: "relative",
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = children?.[virtualRow.index];

              // console.log(heightAbove, virtualRow);

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
                    column={column}
                    scrollRef={scrollRef}
                    onSetExpandIndexes={onSetExpandIndexes}
                    heightAbove={generateNestedItemsTopItemsCount(row.id) + 1}
                    expanded={expandedIndexes?.includes(row.id)}
                    isBorderRight={isBorderRight}
                    isBorderTop={isBorderTop}
                    heightRow={heightRow}
                    expandedIndexes={expandedIndexes}
                    api={api}
                    isFirst={virtualRow.index === 0}
                    setChilds={setChilds}
                    parentId={element.id}
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
