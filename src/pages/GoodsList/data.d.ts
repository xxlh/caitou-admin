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
  price: string;
  generic_spec: array;
  type: string;
  verify_generator: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export type SkuDataType = {
  id: React.Key;
  name?: string;
  image?: string;
  price: string;
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
