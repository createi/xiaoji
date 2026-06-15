// 微信用户
export interface WechatUser {
  id: number;
  uid: number;
  openid: string;
  nickname: string;
  headimgurl: string;
  sex: number;
  city: string;
  province: string;
  country: string;
  language: string;
  unionid: string;
  add_time: number;
}

// 微信二维码
export interface WechatQrcode {
  id: number;
  name: string;
  type: number;
  group_id: number;
  category_id: number;
  code_url: string;
  image_url: string;
  add_time: number;
}
