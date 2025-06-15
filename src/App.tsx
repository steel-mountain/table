import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { CustomTable } from "./components/Table/Table";
import { columnsTable } from "./constants/constants";
import "./styles.scss";

function App() {
  const [isLoading, setLoading] = useState(false);

  // const dataTable2 = useMemo(() => {
  //   console.log(generateDataItems(100, 50, 50));
  //   return generateDataItems(5, 5, 5);
  // }, []);

  const { data } = useQuery({
    queryKey: ["parents"],
    queryFn: () => axios.get("http://localhost:3000/parents"),
  });

  const dataTable = data?.data;

  useEffect(() => {
    console.log(dataTable);
  }, [dataTable]);

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
        {dataTable && <CustomTable columns={columns} data={dataTable} isLoading={isLoading} tableProps={tableProps} />}
      </div>
    </div>
  );
}

export default App;
