import { v4 as uuidv4 } from "uuid";
import { CellTable } from "../components/CellTable/CellTable";
import { HeaderComponent } from "../components/HeaderComponent/HeaderComponent";
import { ColumnType } from "../components/Table/components/types/types";
import { DataTableType } from "../types/types";

export const columnsTable: ColumnType[] = [
  {
    headerName: "П.п",
    field: "amount",
    cellStyle: { minWidth: 60, maxWidth: 60 },
    pinned: true,
    headerComponent: HeaderComponent,
    cellComponent: CellTable,
  },
  {
    headerName: "ТС",
    field: "vehicle",
    cellStyle: { minWidth: 180, maxWidth: 180 },
    pinned: true,
    valueGetter: (props) => props?.vehicle?.reg_number,
    headerComponent: HeaderComponent,
    cellComponent: CellTable,
  },
  {
    headerName: "Итог",
    field: "totally",
    cellStyle: {
      minWidth: 60,
      maxWidth: 60,
    },
    headerComponent: HeaderComponent,
    cellComponent: CellTable,
  },
  {
    headerName: "Водитель",
    field: "driver",
    cellStyle: { minWidth: 150 },
    valueGetter: (props) => props?.driver?.fio,
    headerComponent: HeaderComponent,
    cellComponent: CellTable,
  },
  {
    field: "operator",
    headerName: "Оператор",
    cellStyle: { minWidth: 150 },
    valueGetter: (props) => props?.gas_station?.operator,
    headerComponent: HeaderComponent,
    cellComponent: CellTable,
  },
  {
    field: "oilStation",
    headerName: "АЗС",
    cellStyle: { minWidth: 150 },
    valueGetter: (props) => props?.gas_station?.name,
    headerComponent: HeaderComponent,
    cellComponent: CellTable,
  },
  {
    field: "dateTime",
    headerName: "Дата, время",
    cellStyle: { minWidth: 140, maxWidth: 140 },
    valueGetter: (props) => props?.date_time?.moscow_time,
    headerComponent: HeaderComponent,
    cellComponent: CellTable,
  },
  {
    field: "coordinates",
    headerName: "Координаты",
    cellStyle: {
      minWidth: 130,
      maxWidth: 130,
    },
    valueGetter: (props) => `${props?.coordinates?.latitude} ${props?.coordinates?.longitude}`,
    headerComponent: HeaderComponent,
    cellComponent: CellTable,
  },
  {
    field: "events",
    headerName: "Событие",
    cellStyle: {
      minWidth: 100,
      maxWidth: 140,
    },
    valueGetter: (props) => +Object.keys(props?.events)[0],
    headerComponent: HeaderComponent,
    cellComponent: CellTable,
  },
  {
    field: "dut",
    headerName: "Объем по ДУТ, л",
    cellStyle: {
      minWidth: 130,
      maxWidth: 130,
    },
    valueGetter: (props) => props?.volume_of_fuel_filled,
    headerComponent: HeaderComponent,
    cellComponent: CellTable,
  },
  {
    field: "transaction",
    headerName: "Транзакции, л",
    cellStyle: {
      minWidth: 130,
      maxWidth: 130,
    },
    valueGetter: (props) => props?.volume_of_fuel_paid,
    headerComponent: HeaderComponent,
    cellComponent: CellTable,
  },
  {
    field: "diffNumber",
    headerName: "Разница, л",
    cellStyle: {
      minWidth: 80,
      maxWidth: 80,
    },
    valueGetter: (props) => props?.difference_in_volume?.number,
    headerComponent: HeaderComponent,
    cellComponent: CellTable,
  },
  {
    field: "diffPercent",
    headerName: "Разница, %",
    cellStyle: {
      minWidth: 80,
      maxWidth: 80,
    },
    valueGetter: (props) => props?.difference_in_volume?.percent,
    headerComponent: HeaderComponent,
    cellComponent: CellTable,
  },
  // {
  //   headerName: "П.п1",
  //   field: "amount1",
  //   cellStyle: { minWidth: 60, maxWidth: 70 },
  //   pinned: true,
  // },
  // {
  //   headerName: "ТС1",
  //   field: "vehicle1",
  //   cellStyle: { minWidth: 150, maxWidth: 170 },
  //   pinned: true,
  //   valueGetter: (props) => props?.vehicle?.reg_number,
  // },
  // {
  //   headerName: "Итог1",
  //   field: "totally1",
  //   cellStyle: {
  //     minWidth: 60,
  //     maxWidth: 60,
  //   },
  //   pinned: true,
  // },
  // {
  //   headerName: "Водитель1",
  //   field: "driver1",
  //   cellStyle: { minWidth: 150 },
  //   valueGetter: (props) => props?.driver?.fio,
  // },
  // {
  //   field: "operator1",
  //   headerName: "Оператор1",
  //   cellStyle: { minWidth: 150 },
  //   valueGetter: (props) => props?.gas_station?.operator,
  // },
  // {
  //   field: "oilStation1",
  //   headerName: "АЗС1",
  //   cellStyle: { minWidth: 150 },
  //   valueGetter: (props) => props?.gas_station?.name,
  // },
  // {
  //   field: "dateTime1",
  //   headerName: "Дата, время1",
  //   cellStyle: { minWidth: 140, maxWidth: 140 },
  //   valueGetter: (props) => props?.date_time?.moscow_time,
  // },
  // {
  //   field: "coordinates1",
  //   headerName: "Координаты1",
  //   cellStyle: {
  //     minWidth: 130,
  //     maxWidth: 130,
  //   },
  //   valueGetter: (props) => `${props?.coordinates?.latitude} ${props?.coordinates?.longitude}`,
  // },
  // {
  //   field: "event1",
  //   headerName: "Событие1",
  //   cellStyle: {
  //     minWidth: 100,
  //     maxWidth: 140,
  //   },
  // },
  // {
  //   field: "dut1",
  //   headerName: "Объем по ДУТ, л1",
  //   cellStyle: {
  //     minWidth: 130,
  //     maxWidth: 130,
  //   },
  //   valueGetter: (props) => props?.volume_of_fuel_filled,
  // },
  // {
  //   field: "transaction1",
  //   headerName: "Транзакции, л1",
  //   cellStyle: {
  //     minWidth: 130,
  //     maxWidth: 130,
  //   },
  //   valueGetter: (props) => props?.volume_of_fuel_paid,
  // },
  // {
  //   field: "diffNumber1",
  //   headerName: "Разница, л1",
  //   cellStyle: {
  //     minWidth: 130,
  //     maxWidth: 130,
  //   },
  //   valueGetter: (props) => props?.difference_in_volume?.number,
  // },
  // {
  //   field: "diffPercent1",
  //   headerName: "Разница, %1",
  //   cellStyle: {
  //     minWidth: 130,
  //     maxWidth: 130,
  //   },
  //   valueGetter: (props) => props?.difference_in_volume?.percent,
  // },
];

export const generateDataItems = (
  parentCount: number,
  maxChildren: number,
  maxGrandChildren?: number
): DataTableType[] => {
  const dataItems: DataTableType[] = [];

  for (let i = 1; i <= parentCount; i++) {
    const children: DataTableType[] = [];
    const grandChildren: DataTableType[] = [];
    const childCount = Math.floor(Math.random() * (maxChildren + 1));
    const maxGrandchildCount = Math.floor(Math.random() * (maxChildren + 1));

    if (maxGrandChildren) {
      for (let k = 1; k <= maxGrandchildCount; k++) {
        grandChildren.push({
          id: uuidv4(),
          amount: `${i}.${k}`,
          vehicle: { id: 0, reg_number: `number-${k}-3th`, vin_number: "", count: 12 },
          totally: "group",
          driver: { id: 1, fio: `Statham ${k}.${k}`, count: 15 },
          gas_station: { name: "noName", count_name: 25, operator: "Татнефть", count_operator: 10 },
          date_time: { moscow_time: "27.02.2025", threshold_exceeded: false },
          coordinates: { latitude: 21, longitude: 15 },
          events: { 1: 1 },
          volume_of_fuel_filled: 200,
          volume_of_fuel_paid: 200,
          difference_in_volume: { number: 20, percent: 20 },
          column: { id: 1, name: "Колонна №1" },
          children: [],
        });
      }
    }

    for (let j = 1; j <= childCount; j++) {
      children.push({
        id: uuidv4(),
        amount: `${i}.${j}`,
        vehicle: { id: 0, reg_number: `number-${j}-2th`, vin_number: "", count: 12 },
        totally: "group",
        driver: { id: 1, fio: `Statham ${i}.${j}`, count: 15 },
        gas_station: { name: "noName", count_name: 25, operator: `Татнефть ${i}.${j}`, count_operator: 10 },
        date_time: { moscow_time: "27.02.2025", threshold_exceeded: false },
        coordinates: { latitude: 21, longitude: 15 },
        events: { 1: 1 },
        volume_of_fuel_filled: 200,
        volume_of_fuel_paid: 200,
        difference_in_volume: { number: 20, percent: 20 },
        column: { id: 1, name: "Колонна №1" },
        children: grandChildren,
      });
    }

    dataItems.push({
      id: uuidv4(),
      amount: i,
      vehicle: { id: 0, reg_number: `number-${i}-1st`, vin_number: "", count: 12 },
      totally: "group",
      driver: { id: 1, fio: "Statham", count: 15 },
      gas_station: { name: "noName", count_name: 25, operator: "Татнефть", count_operator: 10 },
      date_time: { moscow_time: "27.02.2025", threshold_exceeded: false },
      coordinates: { latitude: 21, longitude: 15 },
      events: { 1: 1 },
      volume_of_fuel_filled: 200,
      volume_of_fuel_paid: 200,
      difference_in_volume: { number: 20, percent: 20 },
      column: { id: 1, name: "Колонна №1" },
      children,
    });
  }

  return dataItems;
};
