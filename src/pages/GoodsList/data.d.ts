export type GoodsItemType = {
  id: number;
  title: string;
  description?: string;
  image: string;
  images: array;
  on_sale: number;
  rating: number;
  sold_count: number;
  review_count: number;
  price: number;
  generic_spec: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export type SkuDataType = {
  id: React.Key;
  name?: string;
  image?: string;
  price: number;
  stock: number;
  spec_ids: string;
  own_spec: string;
  created_at?: string;
};

export type SpecDataType = {
  rowKey: React.Key;
  id?: number;
  key: string;
  name: string;
  image?: string;
  created_at?: string;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
