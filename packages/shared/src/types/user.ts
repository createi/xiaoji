// 用户
export interface User {
  uid: number;
  account: string;
  real_name: string;
  nickname: string;
  avatar: string;
  phone: string;
  sex: number;
  birthday: number;
  card_id: string;
  mark: string;
  group_id: number;
  level: number;
  agent_level: number;
  spread_open: number;
  spread_uid: number;
  spread_time: number;
  user_type: string;
  is_promoter: number;
  pay_count: number;
  pay_price: number;
  now_money: number;
  brokerage_price: number;
  integral: number;
  exp: number;
  sign_num: number;
  status: number;
  add_time: number;
  last_time: number;
  last_ip: string;
  partner_id: number;
}

// 用户等级
export interface UserLevel {
  id: number;
  name: string;
  image: string;
  grade: number;
  one_brokerage_percent: number;
  two_brokerage_percent: number;
  task_total_num: number;
  task_num: number;
  status: number;
  is_special: number;
  add_time: number;
}

// 用户分组
export interface UserGroup {
  id: number;
  name: string;
  image: string;
  sort: number;
  status: number;
  is_show: number;
  add_time: number;
}

// 用户标签
export interface UserLabel {
  id: number;
  name: string;
  color: string;
  sort: number;
  status: number;
  add_time: number;
}

// 收货地址
export interface UserAddress {
  id: number;
  uid: number;
  real_name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  is_default: number;
  add_time: number;
  latitude: number;
  longitude: number;
}

// 余额/资金记录
export interface UserBill {
  id: number;
  uid: number;
  type: number;
  trading_type: number;
  number: number;
  balance: number;
  mark: string;
  relation_id: number;
  add_time: number;
}

// 提现记录
export interface UserExtract {
  id: number;
  uid: number;
  extract_price: number;
  extract_type: number;
  real_name: string;
  extract_info: string;
  status: number;
  add_time: number;
  mark: string;
}

// 签到记录
export interface UserSign {
  id: number;
  uid: number;
  add_time: number;
  sign_num: number;
  integral: number;
}

// 用户通知
export interface UserNotice {
  id: number;
  uid: number;
  title: string;
  content: string;
  add_time: number;
  type: number;
  is_see: number;
}
