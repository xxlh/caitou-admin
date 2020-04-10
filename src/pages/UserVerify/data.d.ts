export interface TableListItem {
  id : number;
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  realname: string;
  account_balance:number;
  title: string;
  owner: string;
  desc: string;
  callNo: number;
  status: number;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
  plot_id?: number;
  room_number: string;
  unit_number: number;
  building_number: number;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter?: string;
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  plot_id?: number;
}
export interface BillParams {
	plot_id?: number;
	room_number: string;
	unit_number: number;
	building_number: number;
  }
