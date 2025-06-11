import { useEffect, useMemo, useState } from "react";
import { CustomTable } from "./components/Table/Table";
import { columnsTable, generateDataItems } from "./constants/constants";
import "./styles.scss";

function App() {
  const [isLoading, setLoading] = useState(false);

  const dataTable = useMemo(() => {
    return generateDataItems(40, 5, 5);
  }, []);

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
      <div id="table" style={{ width: "100%", height: "100vh" }}>
        <CustomTable columns={columns} data={dataTable} isLoading={isLoading} tableProps={tableProps} />
      </div>
    </div>
  );
}

export default App;
