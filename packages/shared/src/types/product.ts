// 商品属性
export interface ProductAttr {
  attr_name: string;
  attr_values: string[];
}

// 商品参数
export interface ProductParam {
  name: string;
  value: string;
}

// 自定义表单
export interface CustomForm {
  title: string;
  label: string;
  type: string;
  status: number;
  value?: string;
}

// 商品 SKU
export interface StoreProductAttrValue {
  id: number;
  product_id: number;
  sku: string;
  unique: string;
  image: string;
  price: number;
  vip_price: number;
  cost_price: number;
  ot_price: number;
  stock: number;
  bar_code: string;
  weight: number;
  volume: number;
  is_show: number;
  fictitious: string;
  product_attr_unique: string;
}

// 商品规格结果
export interface StoreProductAttrResult {
  id: number;
  product_id: number;
  value_name: string;
  result_type: string;
  sort: number;
  image: string;
}

// 商品
export interface StoreProduct {
  id: number;
  mer_id: number;
  cate_id: number[];
  store_name: string;
  store_info: string;
  image: string;
  slider_image: string[];
  video_link: string;
  price: number;
  ot_price: number;
  cost_price: number;
  vip_price: number;
  vip_proportion: number;
  product_type: number;
  give_integral: number;
  stock: number;
  sales: number;
  unit_name: string;
  sort: number;
  is_show: number;
  is_hot: number;
  is_best: number;
  is_new: number;
  is_good: number;
  is_postage: number;
  is_vip: number;
  is_gift: number;
  brokerage: number;
  brokerage_two: number;
  spec_type: number;
  attr: ProductAttr[];
  bar_code: string;
  weight: number;
  volume: number;
  postage: number;
  freight: number;
  temp_id: number;
  logistics: number[];
  min_qty: number;
  is_limit: number;
  limit_type: number;
  limit_num: number;
  keyword: string;
  command_word: string;
  recommend_image: string;
  label_id: number[];
  coupon_ids: number[];
  activity: string[];
  virtual_type: number;
  is_virtual: number;
  fictitious_content: string;
  presale: number;
  presale_time: Date[];
  presale_day: number;
  custom_form: CustomForm[];
  params_list: ProductParam[];
  protection_list: number[];
  add_time: number;
  status: number;
}

// 商品分类
export interface StoreCategory {
  id: number;
  pid: number;
  icon: string;
  image: string;
  is_show: number;
  is_home: number;
  sort: number;
  name: string;
  add_time: number;
  children?: StoreCategory[];
}

// 商品评价
export interface StoreProductReply {
  id: number;
  uid: number;
  product_id: number;
  order_id: number;
  product_score: number;
  service_score: number;
  logistics_score: number;
  context: string;
  pics: string[];
  add_time: number;
  status: number;
  is_reply: number;
  reply: string;
  reply_time: number;
  nickname: string;
  avatar: string;
}

// 商品标签
export interface StoreProductLabel {
  id: number;
  name: string;
  sort: number;
  status: number;
  add_time: number;
}

// 服务保障
export interface StoreProductProtection {
  id: number;
  name: string;
  description: string;
  sort: number;
  status: number;
}
