// 订单状态枚举
export enum OrderStatus {
  PENDING_PAYMENT = 0,
  PENDING_SHIPMENT = 1,
  PENDING_RECEIPT = 2,
  PENDING_REVIEW = 3,
  COMPLETED = 4,
  UNVERIFIED = 5,
  REFUNDED = -2,
  OFFLINE_UNPAID = 9,
}

// 订单类型
export enum OrderType {
  NORMAL = 0,
  SECKILL = 1,
  BARGAIN = 2,
  COMBINATION = 3,
  PRESALE = 4,
}

// 配送类型
export enum ShippingType {
  EXPRESS = 0,
  PICKUP = 1,
  VIRTUAL = 2,
}

// 订单
export interface StoreOrder {
  id: number;
  order_id: string;
  uid: number;
  total_price: number;
  pay_price: number;
  pay_postage: number;
  coupon_price: number;
  use_integral: number;
  deduction_price: number;
  type: OrderType;
  status: OrderStatus;
  paid: number;
  refund_status: number;
  refund_type: number;
  refund_reason: string;
  refund_explain: string;
  refund_img: string[];
  shipping_type: ShippingType;
  delivery_type: string;
  delivery_name: string;
  delivery_id: string;
  order_type: number;
  real_name: string;
  user_phone: string;
  user_address: string;
  store_id: number;
  clerk_id: number;
  verify_code: string;
  pink_id: number;
  seckill_id: number;
  bargain_id: number;
  combination_id: number;
  discount_id: number;
  advance_id: number;
  mark: string;
  remark: string;
  is_cancel: number;
  is_del: number;
  is_gift: number;
  gift_uid: number;
  gift_mark: string;
  spread_uid: number;
  spread_nickname: string;
  division_name: string;
  add_time: number;
  pay_time: number;
  is_postage: number;
  custom_form: string;
  invoice_id: number;
}

// 订单商品
export interface StoreOrderCartInfo {
  id: number;
  order_id: string;
  product_id: number;
  cart_id: number;
  productInfo: import('./product').StoreProduct;
  attrInfo: import('./product').StoreProductAttrValue;
  product_num: number;
  price: number;
  total_num: number;
  pay_price: number;
  refund_num: number;
  unique: string;
  is_gift: number;
}

// 退款
export interface StoreOrderRefund {
  id: number;
  order_id: string;
  uid: number;
  refund_order_id: string;
  status: number;
  refund_type: number;
  refund_reason: string;
  refund_price: number;
  refund_explain: string;
  refund_img: string[];
  refund_express: string;
  refund_express_name: string;
  refund_phone: string;
  add_time: number;
  refund_time: number;
}

// 购物车
export interface StoreCart {
  id: number;
  uid: number;
  product_id: number;
  product_attr_unique: string;
  cart_num: number;
  is_pay: number;
  is_del: number;
  add_time: number;
  product?: import('./product').StoreProduct;
  attr?: import('./product').StoreProductAttrValue;
}

// 发货信息
export interface OrderDelivery {
  id: number;
  order_id: string;
  delivery_type: string;
  delivery_name: string;
  delivery_id: string;
  add_time: number;
  express_com_id: number;
  to_user: number;
  update_time: number;
}

// 发票
export interface StoreOrderInvoice {
  id: number;
  uid: number;
  order_id: string;
  invoice_type: number;
  title: string;
  tax_no: string;
  email: string;
  invoice_content: string;
  add_time: number;
}
