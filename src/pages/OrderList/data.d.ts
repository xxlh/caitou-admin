export type OrderItemType = {
  id: number;
  no: string;
  type: string;
  user_id: number;
  user_nickname: string;
  address: array;
  closed: boolean
  coupon_code_id: number
  extra?: array
  paid_at: Date;
  payment_method: string;
  payment_no: string;
  refund_no: null
  refund_status: string;
  remark?: string;
  reviewed: false
  ship_data: {express_company: string, express_no: string}
  ship_status: string;
  status: string;
  total_amount: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};

