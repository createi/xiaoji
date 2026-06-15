// 管理员
export interface SystemAdmin {
  id: number;
  account: string;
  real_name: string;
  pwd: string;
  head_pic: string;
  phone: string;
  level: number;
  status: number;
  last_time: number;
  last_ip: string;
  add_time: number;
  role: SystemRole;
}

// 角色
export interface SystemRole {
  id: number;
  name: string;
  status: number;
  rules: number[];
  add_time: number;
}

// 菜单
export interface SystemMenus {
  id: number;
  pid: number;
  title: string;
  icon: string;
  path: string;
  component: string;
  sort: number;
  status: number;
  is_show: number;
  add_time: number;
}

// 权限/路由
export interface SystemRoute {
  id: number;
  pid: number;
  title: string;
  path: string;
  name: string;
  component: string;
  sort: number;
  status: number;
  is_show: number;
  add_time: number;
}

// 系统配置
export interface SystemConfig {
  id: number;
  tab_id: number;
  name: string;
  value: string;
  type: string;
  info: string;
  status: number;
}

// 操作日志
export interface SystemLog {
  id: number;
  admin_id: number;
  type: string;
  url: string;
  method: string;
  ip: string;
  add_time: number;
  content: string;
}
