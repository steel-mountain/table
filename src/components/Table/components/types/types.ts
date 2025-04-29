export interface ParamsOnCellClick {
  rowData: any;
  column: ColumnType;
  row: any;
}

export interface ColumnType {
  field: string;
  headerName: string;
  headerComponent?: any;
  cellComponent?: any;
  cellLoader?: any;
  visible?: boolean;
  cellStyle?: React.CSSProperties;
  type?: string;
  pinned?: boolean;
  onCellClick?: (params: ParamsOnCellClick) => void;
  valueGetter?: (params: any) => any;
}

export interface ApiType {
  getColumns: () => ColumnType[];
  getCellValue: (field: string, data: any) => any;
}

export interface CellProps {
  data: any;
  column: any;
  row: any;
  value: any;
  api: ApiType;
}
