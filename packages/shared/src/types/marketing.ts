// 优惠券
export interface StoreCoupon {
  id: number;
  title: string;
  type: number;
  value: number;
  min_price: number;
  is_sub: number;
  is_show: number;
  status: number;
  sort: number;
  use_type: number;
  category_ids: number[];
  product_ids: number[];
  start_time: number;
  end_time: number;
  add_time: number;
}

// 优惠券发放
export interface StoreCouponIssue {
  id: number;
  coupon_id: number;
  coupon_type: number;
  use_min_price: number;
  end_time: number;
  is_permanent: number;
  stay_limit: number;
  type: number;
  give_type: number;
  status: number;
  used: number;
  received: number;
}

// 优惠券领取记录
export interface StoreCouponUser {
  id: number;
  uid: number;
  coupon_id: number;
  coupon_issue_id: number;
  status: number;
  used_time: number;
  add_time: number;
}

// 秒杀活动
export interface StoreSeckill {
  id: number;
  title: string;
  activity_name: string;
  image: string;
  price: number;
  cost_price: number;
  product_price: number;
  stock: number;
  quota: number;
  total: number;
  sort: number;
  status: number;
  product_id: number;
  start_time: number;
  end_time: number;
  add_time: number;
}

// 秒杀时间段
export interface StoreSeckillTime {
  id: number;
  name: string;
  start: string;
  stop: string;
  sort: number;
  status: number;
}

// 拼团活动
export interface StoreCombination {
  id: number;
  title: string;
  image: string;
  info: string;
  price: number;
  ot_price: number;
  cost_price: number;
  people_num: number;
  quota: number;
  total: number;
  sort: number;
  is_show: number;
  product_id: number;
  start_time: number;
  end_time: number;
  add_time: number;
}

// 拼团记录
export interface StorePink {
  id: number;
  uid: number;
  nickname: string;
  avatar: string;
  pid: number;
  puid: number;
  combination_id: number;
  order_id: string;
  total_num: number;
  total_price: number;
  people_num: number;
  status: number;
  add_time: number;
  stop_time: number;
}

// 砍价活动
export interface StoreBargain {
  id: number;
  title: string;
  image: string;
  price: number;
  cost_price: number;
  product_price: number;
  min_price: number;
  bargain_stock: number;
  quota: number;
  total: number;
  sort: number;
  status: number;
  product_id: number;
  start_time: number;
  end_time: number;
  add_time: number;
  rule: string;
  count_people_all: number;
  count_people_help: number;
  count_people_success: number;
}

// 积分商品
export interface StoreIntegral {
  id: number;
  title: string;
  image: string;
  price: number;
  cost_price: number;
  vip_price: number;
  stock: number;
  quota: number;
  total: number;
  sales: number;
  sort: number;
  status: number;
  product_id: number;
  add_time: number;
}

// 签到配置
export interface SystemSignReward {
  id: number;
  day: number;
  number: number;
  type: number;
  status: number;
  sort: number;
}
