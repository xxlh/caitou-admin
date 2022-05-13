export type GoodsItemType = {
  id: number;
  title: string;
  description?: string;
  image: string;
  images: Array;
  categories: Array;
  on_sale: number;
  rating: number;
  sold_count: number;
  review_count: number;
  price: string;
  freight: string;
  stock: number;
  generic_spec: Array;
  type: string;
  verify_generator: string;
  multi_checkout: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export type SkuDataType = {
  id: number;
  name?: string;
  image?: string;
  price: string;
  stock: number;
  daily_price: Array
  spec_ids: string;
  own_spec: Array;
  created_at?: string;
};

export type DailypriceItemType = {
  price: string;
  stock: number;
  sku_id: number;
  sku_name?: string;
};

export type SpecDataType = {
  rowKey: React.Key;
  id?: number;
  key: string;
  name: string;
  image?: string;
  created_at?: string;
};