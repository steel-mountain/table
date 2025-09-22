import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo, useState } from "react";
import { CustomTable } from "./components/Table/Table";
import { generateStableIds } from "./components/Table/utils/utils";
import { columnsTable } from "./constants/constants";
import "./styles.scss";

function App() {
  const [isLoading, setLoading] = useState(false);

  // const dataTable2 = useMemo(() => {
  //   console.log(generateDataItems(50, 50, 50));
  //   return generateDataItems(5, 5, 5);
  // }, []);

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isFetch } = useInfiniteQuery({
    queryKey: ["parents"],
    queryFn: (ctx) => axios.get(`http://localhost:4879/parents?_page=${ctx.pageParam}&_per_page=25`),
    getNextPageParam: (lastGroup) => {
      return lastGroup.data.next;
    },
    initialPageParam: 1,
  });

  const dataTable = useMemo(() => {
    const arr = data?.pages?.flatMap((page) => page.data.data) ?? [];

    return generateStableIds(arr, "test");
  }, [data?.pages]);

  const columns = useMemo(() => columnsTable, []);

  const tableProps = useMemo(
    () => ({
      maxWidth: true,
      headerStyle: {
        height: 40,
      },
      bodyStyle: {
        height: 40,
      },
    }),
    []
  );

  return (
    <div className="app">
      <div id="table" style={{ width: "100%", height: "100vh", display: "flex" }}>
        {dataTable && (
          <CustomTable
            columns={columns}
            data={dataTable}
            isLoading={isLoading}
            tableProps={tableProps}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          />
        )}
      </div>
    </div>
  );
}

export default App;
