import { useMemo, useState } from "react";
import { CustomTable } from "./components/Table/Table";
import { columnsTable, generateDataItems } from "./constants/constants";
import "./styles.scss";

// const newData = {
//   id: 100,
//   amount: 1,
//   vehicle: { id: 0, reg_number: "TOYOTA", vin_number: "", count: 12 },
//   totally: "group",
//   driver: { id: 1, fio: "James", count: 15 },
//   gas_station: { name: "noName", count_name: 25, operator: "ИРбис", count_operator: 10 },
//   date_time: { moscow_time: "3.01.2025", threshold_exceeded: false },
//   coordinates: { latitude: 21, longitude: 15 },
//   events: { 1: 1 },
//   volume_of_fuel_filled: 200,
//   volume_of_fuel_paid: 200,
//   difference_in_volume: { number: 20, percent: 20 },
//   column: { id: 1, name: "Колонна №1" },
//   children: [],
// };

// const fetchItems = async () => {
//   return new Promise<DataTableType[]>((resolve) =>
//     setTimeout(() => {
//       resolve(
//         Array.from({ length: 10 }, (_, index) => ({
//           ...newData,
//           id: +uuid(),
//         }))
//       );
//     }, 1000)
//   );
// };

function App() {
  const [isLoading, setLoading] = useState(true);

  const dataTable = useMemo(() => {
    return generateDataItems(100, 24, 24);
  }, []);

  const columns = useMemo(() => columnsTable, []);

  const tableProps = useMemo(
    () => ({
      wrapperStyle: {},
      isHeaderSticky: true,
      enableColumnVirtualizer: false,
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
