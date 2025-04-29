interface Vehicle {
  id: number;
  reg_number: string;
  vin_number: string;
  count: number;
}

interface Driver {
  id: number;
  fio: string;
  count: number;
}

interface GasStation {
  name: string;
  count_name: number;
  operator: string;
  count_operator: number;
}

interface Coordinates {
  latitude: number;
  longitude: number;
  threshold_exceeded?: boolean;
}

interface DifferenceInVolume {
  number: number;
  percent: number;
  threshold_exceeded?: boolean;
}

interface DateTime {
  local_time?: string;
  moscow_time: string;
  threshold_exceeded?: boolean;
}

interface Column {
  id: number;
  name: string;
}

export interface DataTableType {
  id?: number | string;
  amount: number | string;
  vehicle?: Vehicle;
  totally: string;
  driver?: Driver;
  gas_station?: GasStation;
  date_time?: DateTime;
  coordinates?: Coordinates;
  events: Record<number, number>;
  volume_of_fuel_filled: number;
  volume_of_fuel_paid?: number;
  difference_in_volume: DifferenceInVolume;
  column: Column;
  isVisibleChildren?: boolean;
  children?: DataTableType[];
}
