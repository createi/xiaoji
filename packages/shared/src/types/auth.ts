// JWT Token 载荷
export interface JwtPayload {
  id: number;
  type: 'admin' | 'user' | 'kefu';
  iat: number;
  exp: number;
}

// 管理员登录请求
export interface AdminLoginDto {
  account: string;
  password: string;
  captcha: string;
  key: string;
}

// 管理员登录响应
export interface AdminLoginResponse {
  token: string;
  expires_time: number;
}

// 用户登录请求
export interface UserLoginDto {
  account?: string;
  password?: string;
  phone?: string;
  captcha?: string;
  spread?: number;
  agent_id?: number;
}

// 权限信息
export interface AuthInfo {
  uniqueAuth: string[];
  authList: string[];
  isSuperAdmin: boolean;
}
