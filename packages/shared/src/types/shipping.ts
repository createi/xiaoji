// 运费模板
export interface ShippingTemplate {
  id: number;
  name: string;
  type: number;
  appoint: number;
  sort: number;
  add_time: number;
}

// 快递公司
export interface Express {
  id: number;
  name: string;
  code: string;
  url: string;
  sort: number;
  is_show: number;
  add_time: number;
}
