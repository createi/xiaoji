// 门店
export interface SystemStore {
  id: number;
  image: string;
  name: string;
  phone: string;
  address: string;
  detailed_address: string;
  latitude: number;
  longitude: number;
  day_time: string;
  is_show: number;
  sort: number;
  add_time: number;
}

// 店员
export interface SystemStoreStaff {
  id: number;
  uid: number;
  store_id: number;
  role: string;
  status: number;
  add_time: number;
}
