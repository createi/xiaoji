# xiaoji (小鸡) — CRMEB 复刻项目规划

## Context

基于 CRMEB 开源电商系统进行技术栈重构复刻。原项目基于 PHP ThinkPHP 6.0 + Vue 2 + UniApp (Vue2)，复刻后采用现代化技术栈：**NestJS + Prisma + Vue3 + TypeScript + UniApp (Vue3)**。项目名称为 **xiaoji (小鸡)**。

## 技术栈选型

| 层级 | 技术 | 说明 |
|------|------|------|
| 后端框架 | NestJS (Node 22.16.0) | TypeScript，模块化架构 |
| ORM | Prisma | Schema-first，类型安全 |
| 数据库 | MySQL 8.x | 与原项目兼容 |
| 缓存 | Redis | Session、队列、缓存 |
| 管理后台 | Vue3 + TypeScript + Ant Design Vue | 替代 Vue2 + Element UI |
| 移动端 | UniApp (Vue3 + TypeScript) | H5/小程序/App 多端 |
| 构建工具 | Vite | 管理后台和 UniApp |
| 包管理 | pnpm | Monorepo 工作区 |

## 项目结构

```
xiaoji/
├── apps/
│   ├── api/                    # NestJS 后端 API 服务
│   ├── admin/                  # Vue3 管理后台
│   └── uniapp/                 # UniApp 移动端
├── packages/
│   ├── shared/                 # 前后端共享类型定义、常量
│   ├── prisma/                 # Prisma schema 和迁移
│   └── utils/                  # 通用工具函数
├── pnpm-workspace.yaml
├── package.json
├── .env.development          # 开发环境变量
├── .env.test                 # 测试环境变量
├── .env.production           # 生产环境变量
└── .env                      # 通用环境变量（不提交 Git）
```

## 环境配置

### 环境分类

| 环境 | NODE_ENV | 用途 | 部署方式 |
|------|----------|------|----------|
| development | development | 本地开发 | `pnpm dev` |
| test | test | 测试/预发布 | Docker Compose |
| production | production | 正式环境 | Docker / PM2 |

### 各环境配置差异

| 配置项 | development | test | production |
|--------|-------------|------|------------|
| 数据库 (DATABASE_URL) | `localhost:3306/xiaoji_dev` | 测试库 `xiaoji_test` | 生产库 `xiaoji_prod` |
| Redis (REDIS_URL) | `localhost:6379/0` | 测试实例 `/1` | 生产集群 `/0` |
| JWT 密钥 | 开发密钥 (宽松过期 7d) | 模拟生产密钥 (24h) | 强随机密钥 (24h) |
| 日志级别 | `debug` | `info` | `warn` |
| 文件存储 | 本地 `uploads/` | 测试 OSS Bucket | 生产 OSS + CDN |
| 邮件/短信 | Ethereal (模拟) | 测试账号 | 正式账号 |
| CORS | `*` (全开放) | 指定域名 | 严格白名单 |
| HTTPS | 不需要 | 可选 | 强制 |
| 支付回调 | 沙箱环境 | 沙箱环境 | 正式环境 |
| WebSocket | `ws://` | `ws://` / `wss://` | `wss://` |
| API 文档 | 开启 Swagger | 开启 Swagger | 关闭 |
| 缓存策略 | 关闭缓存 | 开启 | 开启 + Redis 集群 |
| 限流 | 关闭 | 开启 (宽松) | 开启 (严格) |

### 文件结构

#### NestJS 后端 (`apps/api/`)

```
apps/api/
├── .env.development          # 开发环境
├── .env.test                 # 测试环境
├── .env.production           # 生产环境
├── .env                      # 通用变量（提交到 Git）
├── config/
│   └── configuration.ts      # 统一配置加载
└── src/
    └── app.module.ts         # ConfigModule 注册
```

**环境变量文件示例**：

```bash
# .env（通用，提交到 Git）
APP_NAME=xiaoji
APP_PORT=7001
DB_PREFIX=xj_
JWT_EXPIRES_IN=24h

# .env.development（开发环境）
NODE_ENV=development
DATABASE_URL="mysql://root:123456@localhost:3306/xiaoji_dev"
REDIS_URL="redis://localhost:6379/0"
JWT_SECRET="dev-secret-key-not-for-production"
LOG_LEVEL=debug
STORAGE_DRIVER=local
STORAGE_LOCAL_PATH=uploads
CORS_ORIGIN=*
SWAGGER_ENABLED=true
RATE_LIMIT_ENABLED=false
CACHE_ENABLED=false
```

```bash
# .env.test（测试环境）
NODE_ENV=test
DATABASE_URL="mysql://root:123456@localhost:3306/xiaoji_test"
REDIS_URL="redis://localhost:6379/1"
JWT_SECRET="test-secret-key-mock-production"
LOG_LEVEL=info
STORAGE_DRIVER=oss
STORAGE_OSS_BUCKET=xiaoji-test
CORS_ORIGIN=https://admin-test.xiaoji.com
SWAGGER_ENABLED=true
RATE_LIMIT_ENABLED=true
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100
CACHE_ENABLED=true
```

```bash
# .env.production（生产环境）
NODE_ENV=production
DATABASE_URL="mysql://user:strongpassword@db-host:3306/xiaoji_prod"
REDIS_URL="redis://redis-cluster:6379/0"
JWT_SECRET="generate-with-openssl-rand-base64-32"
LOG_LEVEL=warn
STORAGE_DRIVER=oss
STORAGE_OSS_BUCKET=xiaoji-prod
STORAGE_OSS_CDN=https://cdn.xiaoji.com
CORS_ORIGIN=https://admin.xiaoji.com
SWAGGER_ENABLED=false
RATE_LIMIT_ENABLED=true
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=30
CACHE_ENABLED=true
PAY_ENV=production
WECHAT_ENV=production
```

**配置加载** (`config/configuration.ts`)：

```typescript
export default () => ({
  port: parseInt(process.env.APP_PORT, 10) || 7001,
  env: process.env.NODE_ENV || 'development',

  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  storage: {
    driver: process.env.STORAGE_DRIVER || 'local',
    localPath: process.env.STORAGE_LOCAL_PATH || 'uploads',
    oss: {
      bucket: process.env.STORAGE_OSS_BUCKET,
      cdn: process.env.STORAGE_OSS_CDN,
    },
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true',
  },
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED === 'true',
    ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
    limit: parseInt(process.env.RATE_LIMIT_LIMIT, 10) || 100,
  },
  cache: {
    enabled: process.env.CACHE_ENABLED === 'true',
  },
  pay: {
    env: process.env.PAY_ENV || 'sandbox',
  },
  wechat: {
    env: process.env.WECHAT_ENV || 'sandbox',
  },
});
```

#### Vue3 管理后台 (`apps/admin/`)

```
apps/admin/
├── .env.development          # VITE_* 变量
├── .env.test
├── .env.production
├── .env                      # 通用
├── vite.config.ts
└── src/
```

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:7001
VITE_APP_TITLE=xiaoji 管理后台（开发）
VITE_STORAGE_URL=http://localhost:7001/uploads
VITE_WEBSOCKET_URL=ws://localhost:7001

# .env.test
VITE_API_BASE_URL=https://api-test.xiaoji.com
VITE_APP_TITLE=xiaoji 管理后台（测试）
VITE_STORAGE_URL=https://cdn-test.xiaoji.com
VITE_WEBSOCKET_URL=wss://api-test.xiaoji.com

# .env.production
VITE_API_BASE_URL=https://api.xiaoji.com
VITE_APP_TITLE=xiaoji 管理后台
VITE_STORAGE_URL=https://cdn.xiaoji.com
VITE_WEBSOCKET_URL=wss://api.xiaoji.com
```

#### UniApp 移动端 (`apps/uniapp/`)

```
apps/uniapp/
├── .env.development
├── .env.test
├── .env.production
├── manifest.json
├── pages.json
└── src/
```

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:7001
VITE_STORAGE_URL=http://localhost:7001/uploads

# .env.test
VITE_API_BASE_URL=https://api-test.xiaoji.com
VITE_STORAGE_URL=https://cdn-test.xiaoji.com

# .env.production
VITE_API_BASE_URL=https://api.xiaoji.com
VITE_STORAGE_URL=https://cdn.xiaoji.com
```

#### Prisma (`packages/prisma/`)

```typescript
// schema.prisma — 使用 env() 引用
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}
```

### Docker 配置

**开发环境** (`docker-compose.yml`)：

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: xiaoji_dev
    volumes:
      - mysql_data:/var/lib/mysql
      - ./docker/init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mysql_data:
```

**生产环境** (`docker-compose.prod.yml`)：

```yaml
version: '3.8'
services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "7001:7001"
    env_file:
      - apps/api/.env.production
    depends_on:
      - mysql
      - redis
    restart: always

  admin:
    build:
      context: .
      dockerfile: apps/admin/Dockerfile
    ports:
      - "8080:80"
    restart: always

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: xiaoji_prod
    volumes:
      - mysql_prod_data:/var/lib/mysql
      - ./docker/init-prod.sql:/docker-entrypoint-initdb.d/init.sql
    restart: always

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_prod_data:/data
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx.conf:/etc/nginx/nginx.conf
      - ./docker/ssl:/etc/nginx/ssl
    depends_on:
      - api
      - admin
    restart: always

volumes:
  mysql_prod_data:
  redis_prod_data:
```

### 脚本命令

```json
{
  "scripts": {
    "dev": "pnpm --filter @xiaoji/api dev",
    "dev:admin": "pnpm --filter @xiaoji/admin dev",
    "dev:uniapp": "pnpm --filter @xiaoji/uniapp dev:h5",
    "dev:all": "pnpm run --parallel dev dev:admin dev:uniapp",
    "build": "pnpm --filter @xiaoji/api build && pnpm --filter @xiaoji/admin build",
    "build:api": "pnpm --filter @xiaoji/api build",
    "build:admin": "pnpm --filter @xiaoji/admin build",
    "build:uniapp": "pnpm --filter @xiaoji/uniapp build",
    "start:test": "NODE_ENV=test node apps/api/dist/main.js",
    "start:prod": "NODE_ENV=production node apps/api/dist/main.js",
    "db:migrate:dev": "pnpm --filter @xiaoji/prisma migrate dev",
    "db:migrate:prod": "pnpm --filter @xiaoji/prisma migrate deploy",
    "db:seed:dev": "pnpm --filter @xiaoji/prisma db seed",
    "db:studio": "pnpm --filter @xiaoji/prisma studio",
    "docker:dev": "docker compose -f docker-compose.yml up -d",
    "docker:prod": "docker compose -f docker-compose.prod.yml up -d",
    "test": "pnpm --filter @xiaoji/api test",
    "test:e2e": "pnpm --filter @xiaoji/api test:e2e"
  }
}
```

---

# 一、共享类型定义 (packages/shared/src/types/)

所有前后端共享的 TypeScript 类型定义，确保类型安全。

## 1.1 基础类型 (`common.ts`)

```typescript
// 分页请求
export interface PaginationParams {
  page: number;
  limit: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// API 统一响应
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

// 排序
export type SortOrder = 'asc' | 'desc';

// 时间范围筛选
export interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}
```

## 1.2 认证类型 (`auth.ts`)

```typescript
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
  uniqueAuth: string[];   // 权限标识列表
  authList: string[];     // 路由权限列表
  isSuperAdmin: boolean;  // 是否超级管理员
}
```

## 1.3 系统类型 (`system.ts`)

```typescript
// 管理员
export interface SystemAdmin {
  id: number;
  account: string;
  real_name: string;
  pwd: string;
  head_pic: string;
  phone: string;
  level: number;         // 0=超级管理员
  status: number;        // 1=正常 0=禁用
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
  rules: number[];       // 权限 ID 列表
  add_time: number;
}

// 菜单
export interface SystemMenus {
  id: number;
  pid: number;           // 父级 ID
  title: string;
  icon: string;
  path: string;
  component: string;
  sort: number;
  status: number;
  is_show: number;       // 是否显示
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
  tab_id: number;        // 配置分类 ID
  name: string;          // 配置名称
  value: string;         // 配置值
  type: string;          // 类型: text, number, select, switch, upload, textarea
  info: string;          // 提示信息
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
```

## 1.4 用户类型 (`user.ts`)

```typescript
// 用户
export interface User {
  uid: number;
  account: string;
  real_name: string;
  nickname: string;
  avatar: string;
  phone: string;
  sex: number;           // 0=未知 1=男 2=女
  birthday: number;
  card_id: string;
  mark: string;
  group_id: number;
  level: number;
  agent_level: number;
  spread_open: number;   // 是否有推广资格
  spread_uid: number;    // 推荐人 UID
  spread_time: number;
  user_type: string;     // h5, wechat, routine, app, pc
  is_promoter: number;
  pay_count: number;
  pay_price: number;
  now_money: number;     // 余额
  brokerage_price: number; // 佣金余额
  integral: number;      // 积分
  exp: number;           // 经验值
  sign_num: number;      // 连续签到天数
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
  type: number;          // 1=充值 2=消费 3=提现 4=佣金 5=其他
  trading_type: number;  // 交易类型
  number: number;        // 金额（+/-）
  balance: number;       // 余额
  mark: string;          // 备注
  relation_id: number;   // 关联 ID
  add_time: number;
}

// 提现记录
export interface UserExtract {
  id: number;
  uid: number;
  extract_price: number;
  extract_type: number;  // 1=微信 2=支付宝 3=银行卡
  real_name: string;
  extract_info: string;  // JSON: 支付宝/银行卡信息
  status: number;        // 0=待审核 1=审核通过 2=已提现 3=审核失败
  add_time: number;
  mark: string;
}

// 签到记录
export interface UserSign {
  id: number;
  uid: number;
  add_time: number;
  sign_num: number;      // 连续签到天数
  integral: number;      // 获得积分
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
```

## 1.5 商品类型 (`product.ts`)

```typescript
// 商品
export interface StoreProduct {
  id: number;
  mer_id: number;
  cate_id: number[];     // 分类 ID
  store_name: string;
  store_info: string;
  image: string;
  slider_image: string[]; // 轮播图
  video_link: string;
  price: number;
  ot_price: number;      // 原价
  cost_price: number;    // 成本价
  vip_price: number;
  vip_proportion: number;
  product_type: number;  // 0=普通 1=卡密 2=优惠券 3=虚拟
  give_integral: number; // 购买送积分
  stock: number;
  sales: number;
  unit_name: string;     // 单位
  sort: number;
  is_show: number;       // 1=上架 0=下架
  is_hot: number;
  is_best: number;
  is_new: number;
  is_good: number;
  is_postage: number;    // 1=包邮
  is_vip: number;        // 1=会员专属
  is_gift: number;
  brokerage: number;     // 一级返佣
  brokerage_two: number; // 二级返佣
  spec_type: number;     // 0=单规格 1=多规格
  attr: ProductAttr[];   // 规格
  bar_code: string;
  weight: number;
  volume: number;
  postage: number;       // 邮费
  freight: number;       // 2=固定邮费 3=运费模板
  temp_id: number;       // 运费模板 ID
  logistics: number[];   // 1=快递 2=到店
  min_qty: number;       // 起购数量
  is_limit: number;
  limit_type: number;    // 1=单次限购 2=单人限购
  limit_num: number;
  keyword: string;
  command_word: string;  // 商品口令
  recommend_image: string;
  label_id: number[];
  coupon_ids: number[];
  activity: string[];    // 参与活动
  virtual_type: number;
  is_virtual: number;
  fictitious_content: string;
  presale: number;       // 1=预售
  presale_time: Date[];
  presale_day: number;
  custom_form: CustomForm[];
  params_list: ProductParam[];
  protection_list: number[];
  add_time: number;
  status: number;
}

// 商品属性
export interface ProductAttr {
  attr_name: string;     // 规格名称
  attr_values: string[]; // 规格值列表
}

// 商品 SKU
export interface StoreProductAttrValue {
  id: number;
  product_id: number;
  sku: string;           // SKU 编码
  unique: string;        // 唯一标识
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
  fictitious: string;    // 卡密/优惠券内容
  product_attr_unique: string;
}

// 商品规格结果
export interface StoreProductAttrResult {
  id: number;
  product_id: number;
  value_name: string;    // 规格值名称（JSON）
  result_type: string;
  sort: number;
  image: string;
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

// 服务保障
export interface StoreProductProtection {
  id: number;
  name: string;
  description: string;
  sort: number;
  status: number;
}
```

## 1.6 订单类型 (`order.ts`)

```typescript
// 订单状态枚举
export enum OrderStatus {
  PENDING_PAYMENT = 0,     // 待付款
  PENDING_SHIPMENT = 1,    // 待发货
  PENDING_RECEIPT = 2,     // 待收货
  PENDING_REVIEW = 3,      // 待评价
  COMPLETED = 4,           // 已完成
  UNVERIFIED = 5,          // 待核销
  REFUNDED = -2,           // 已退款
  OFFLINE_UNPAID = 9,      // 线下未支付
}

// 订单类型
export enum OrderType {
  NORMAL = 0,              // 普通订单
  SECKILL = 1,             // 秒杀订单
  BARGAIN = 2,             // 砍价订单
  COMBINATION = 3,         // 拼团订单
  PRESALE = 4,             // 预售订单
}

// 配送类型
export enum ShippingType {
  EXPRESS = 0,             // 快递
  PICKUP = 1,              // 到店自提
  VIRTUAL = 2,             // 虚拟商品
}

// 订单
export interface StoreOrder {
  id: number;
  order_id: string;
  uid: number;
  total_price: number;     // 商品总价
  pay_price: number;       // 实际支付价
  pay_postage: number;     // 邮费
  coupon_price: number;    // 优惠券抵扣
  use_integral: number;    // 使用积分
  deduction_price: number; // 积分抵扣价
  type: OrderType;
  status: OrderStatus;
  paid: number;            // 是否已支付
  refund_status: number;   // 退款状态
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
  pink_id: number;         // 拼团 ID
  seckill_id: number;      // 秒杀 ID
  bargain_id: number;      // 砍价 ID
  combination_id: number;  // 拼团活动 ID
  discount_id: number;
  advance_id: number;
  mark: string;            // 用户备注
  remark: string;          // 商家备注
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
  productInfo: StoreProduct;
  attrInfo: StoreProductAttrValue;
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
  product?: StoreProduct;
  attr?: StoreProductAttrValue;
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
  invoice_type: number;   // 1=个人 2=企业
  title: string;
  tax_no: string;
  email: string;
  invoice_content: string;
  add_time: number;
}
```

## 1.7 营销类型 (`marketing.ts`)

```typescript
// 优惠券
export interface StoreCoupon {
  id: number;
  title: string;
  type: number;           // 1=满减 2=折扣 3=无门槛
  value: number;
  min_price: number;      // 使用门槛
  is_sub: number;
  is_show: number;
  status: number;
  sort: number;
  use_type: number;       // 1=全场 2=指定分类 3=指定商品
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
  is_permanent: number;   // 1=永久
  stay_limit: number;     // 领取限制
  type: number;           // 1=通用 2=新人券
  give_type: number;      // 1=直接领取 2=注册赠送 3=手动发放
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
  status: number;         // 0=未使用 1=已使用 2=已过期
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
  quota: number;          // 限购数量
  total: number;          // 总库存
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
  start: string;          // HH:mm
  stop: string;           // HH:mm
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
  ot_price: number;       // 原价
  cost_price: number;
  people_num: number;     // 成团人数
  quota: number;          // 限购数量
  total: number;          // 总库存
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
  pid: number;            // 父级拼团 ID
  puid: number;           // 发起人 UID
  combination_id: number;
  order_id: string;
  total_num: number;
  total_price: number;
  people_num: number;
  status: number;         // 0=拼团中 1=拼团成功 2=拼团失败
  add_time: number;
  stop_time: number;
}

// 砍价活动
export interface StoreBargain {
  id: number;
  title: string;
  image: string;
  price: number;          // 底价
  cost_price: number;
  product_price: number;
  min_price: number;      // 最低砍价金额
  bargain_stock: number;
  quota: number;
  total: number;
  sort: number;
  status: number;
  product_id: number;
  start_time: number;
  end_time: number;
  add_time: number;
  rule: string;           // 活动规则
  count_people_all: number;
  count_people_help: number;
  count_people_success: number;
}

// 积分商品
export interface StoreIntegral {
  id: number;
  title: string;
  image: string;
  price: number;          // 积分价格
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
  day: number;            // 连续天数
  number: number;         // 积分
  type: number;           // 1=连续 2=累计
  status: number;
  sort: number;
}
```

## 1.8 分销类型 (`agent.ts`)

```typescript
// 分销等级
export interface AgentLevel {
  id: number;
  name: string;
  image: string;
  one_brokerage: number;  // 一级佣金比例
  two_brokerage: number;  // 二级佣金比例
  sort: number;
  status: number;
  add_time: number;
}

// 分销申请
export interface DivisionAgentApply {
  id: number;
  uid: number;
  name: string;
  phone: string;
  level_id: number;
  status: number;         // 0=待审核 1=通过 2=拒绝
  add_time: number;
}

// 推广申请
export interface SpreadApply {
  id: number;
  uid: number;
  status: number;
  add_time: number;
}
```

## 1.9 物流类型 (`shipping.ts`)

```typescript
// 运费模板
export interface ShippingTemplate {
  id: number;
  name: string;
  type: number;           // 1=按件 2=按重量 3=按体积
  appoint: number;        // 指定包邮
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
```

## 1.10 门店类型 (`store.ts`)

```typescript
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
  day_time: string;       // 营业时间
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
```

## 1.11 微信类型 (`wechat.ts`)

```typescript
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
```

## 1.12 CMS 类型 (`cms.ts`)

```typescript
// 文章
export interface Article {
  id: number;
  cid: number;
  title: string;
  author: string;
  image_input: string[];
  content: string;
  digest: string;
  visit: number;
  sort: number;
  status: number;
  is_hot: number;
  is_best: number;
  is_new: number;
  add_time: number;
}

// 文章分类
export interface ArticleCategory {
  id: number;
  pid: number;
  name: string;
  sort: number;
  status: number;
  add_time: number;
}
```

---

# 二、后端模块 (NestJS)

## 1. Auth 模块 (`auth/`)

### 功能说明
- JWT 认证（管理员 + 用户 + 客服 三种 Token）
- RBAC 权限系统（菜单/路由级权限）
- 验证码（图形验证码 + 行为验证码）
- 中间件：Token 校验、角色校验、操作日志

### API 接口
| 路径 | 方法 | 说明 | 请求参数 | 响应 |
|------|------|------|----------|------|
| `POST /auth/admin/login` | POST | 管理员登录 | `AdminLoginDto` | `AdminLoginResponse` |
| `POST /auth/admin/logout` | POST | 管理员退出 | - | `{ success: boolean }` |
| `GET /auth/admin/info` | GET | 管理员信息 | - | `SystemAdmin` |
| `POST /auth/user/login` | POST | 用户登录 | `UserLoginDto` | `{ token, expires_time }` |
| `GET /auth/captcha` | GET | 获取验证码 | - | `{ image, key }` |

---

## 2. System 模块 (`system/`)

### 2.1 管理员管理

**列表页**
- 搜索：account, real_name
- 表格列：id, head_pic, account, real_name, status, role, last_time, last_ip, action
- 操作：添加、编辑、删除、修改密码

**创建/编辑表单**
| 字段 | 类型 | 说明 |
|------|------|------|
| account | input | 账号 |
| real_name | input | 真实姓名 |
| head_pic | upload | 头像 |
| pwd | password | 密码（编辑时可留空） |
| role_id | select | 角色 |
| phone | input | 手机号 |
| status | switch | 状态 |

### 2.2 角色管理

**列表页**
- 表格列：id, name, status, add_time, action
- 操作：添加、编辑、删除、设置权限

**权限设置**
- 树形菜单，勾选权限节点
- 数据结构：`{ rules: number[] }`

### 2.3 菜单管理

**列表页**
- 树形表格展示
- 表格列：id, title, icon, path, sort, status, is_show, action

**创建/编辑表单**
| 字段 | 类型 | 说明 |
|------|------|------|
| pid | tree-select | 父级菜单 |
| title | input | 菜单名称 |
| icon | icon-picker | 图标 |
| path | input | 路由地址 |
| component | input | 组件路径 |
| sort | number | 排序 |
| status | switch | 状态 |
| is_show | switch | 是否显示 |

### 2.4 系统配置

**动态表单页面**
- 通过 API 获取配置项，动态渲染表单
- 配置分类：站点设置、支付设置、短信设置、存储设置、快递设置
- 表单字段根据 `type` 字段动态渲染（text, number, select, switch, upload, textarea）

### 2.5 操作日志

**列表页**
- 搜索：admin_name, type, url, time
- 表格列：id, admin_name, type, url, method, ip, add_time
- 操作：查看详情

---

## 3. User 模块 (`user/`)

### 3.1 用户列表

**搜索表单**
| 字段 | 类型 | 选项 |
|------|------|------|
| nickname | input (prepend) | all/uid/phone/nickname |
| level | select | 从 API 获取 |
| group_id | select | 从 API 获取 |
| agent_level | select | 分销等级 |
| label_id | label-selector | 用户标签 |
| is_promoter | select | 推广员/普通用户 |
| isMember | select | 是/否会员 |
| balance | range | 余额范围 |
| integral | range | 积分范围 |
| before_pay_time | date-range | 最近消费时间 |
| pay_count_num | range | 消费次数 |
| pay_count_money | range | 消费金额 |

**表格列**
| 列名 | 字段 | 说明 |
|------|------|------|
| UID | uid | 用户 ID |
| 头像 | avatar | 用户头像 |
| 昵称 | nickname | 含性别图标 |
| 会员 | isMember | 是否会员 |
| 等级 | level | 会员等级 |
| 分组 | group_id | 用户分组 |
| 分销等级 | agent_level_name | 分销等级 |
| 手机号 | phone | 手机号 |
| 来源 | user_type | h5/wechat/routine/app/pc |
| 推荐人 | spread_uid_nickname | 推荐人昵称 |
| 余额 | now_money | 可排序 |
| 操作 | - | 编辑/详情/更多 |

**批量操作**：发送优惠券、批量设置分组、批量设置标签、导出

### 3.2 用户等级

**列表页**
- 表格列：id, image, name, grade, one_brokerage_percent, two_brokerage_percent, task_total_num, task_num, status, action

**创建/编辑表单**
| 字段 | 类型 | 说明 |
|------|------|------|
| name | input | 等级名称 |
| image | upload | 等级图标 |
| grade | number | 等级值 |
| one_brokerage_percent | number | 一级佣金比例(%) |
| two_brokerage_percent | number | 二级佣金比例(%) |
| task_total_num | number | 任务总数 |
| status | switch | 状态 |

### 3.3 用户分组

**列表页**
- 表格列：id, image, name, sort, status, is_show, action

### 3.4 用户标签

**列表页**
- 表格列：id, name, color, sort, status, action

### 3.5 会员卡管理

**子页面**：会员协议、会员卡批次、记录、权益、类型

---

## 4. Product 模块 (`product/`)

### 4.1 商品列表

**搜索表单**
| 字段 | 类型 | 选项 |
|------|------|------|
| store_name | input | 商品名称 |
| virtual_type | select | 商品类型 |
| cate_id | cascader | 商品分类 |
| logistics | select | 物流方式 |
| store_label_id | label-selector | 商品标签 |
| spec_type | select | 单/多规格 |
| vip_product | select | 会员专属 |
| is_gift | select | 赠品 |
| time | date-range | 时间范围 |
| stock_s | range | 库存范围 |
| price_s | range | 价格范围 |
| sales_s | range | 销量范围 |

**表格列**
| 列名 | 字段 | 说明 |
|------|------|------|
| ID | id | 商品 ID |
| 图片 | image | 商品主图 |
| 商品名称 | store_name | 最大 80 字 |
| 活动标签 | activityExist | 秒杀/拼团/砍价标签 |
| 类型 | product_type | 普通/卡密/优惠券/虚拟 |
| 价格 | price | 销售价格 |
| 销量 | sales | 销售数量 |
| 库存 | stock | 库存数量 |
| 排序 | sort | 排序值 |
| 状态 | is_show | 上架/下架开关 |
| 操作 | - | 编辑/查看/删除 |

**批量操作**：商品分类、物流设置、购买送积分、购买送优惠券、关联用户标签、活动推荐、批量上下架、设置商品标签、移到回收站

### 4.2 商品创建/编辑

**表单分为 6 个区域**：

**基本信息 (BasicInfo)**
| 字段 | 类型 | 说明 |
|------|------|------|
| virtual_type | radio | 0=普通 1=卡密 2=优惠券 3=虚拟 |
| store_name | input | 商品名称，max 80 |
| unit_name | input | 单位，max 5 |
| slider_image | image-upload | 轮播图，max 10 |
| video_link | video-upload | 商品视频 |
| cate_id | cascader | 商品分类，多选 |
| label_list | label-selector | 商品标签 |
| is_show | radio | 1=上架 0=下架 |

**规格库存 (SpecStock)**
| 字段 | 类型 | 说明 |
|------|------|------|
| spec_type | radio | 0=单规格 1=多规格 |
| attrs | dynamic-group | 规格名称+规格值（多规格时） |
| price | input-number | 销售价格 |
| cost | input-number | 成本价 |
| ot_price | input-number | 原价 |
| stock | input-number | 库存 |
| bar_code | input | 条码 |
| weight | input-number | 重量(kg) |
| volume | input-number | 体积(cm³) |
| image | image-upload | 规格图片（多规格时） |

**价格佣金 (PriceCommission)**
| 字段 | 类型 | 说明 |
|------|------|------|
| vip_product | switch | 付费会员专属 |
| vip_product_type | radio | 0=仅可见 1=仅可购买 |
| brokerage | input-number | 一级返佣(元) |
| brokerage_two | input-number | 二级返佣(元) |
| vip_price | input-number | 会员价(元) |
| vip_proportion | input-number | 折扣比例(%) |

**物流设置 (LogisticsSetting)**
| 字段 | 类型 | 说明 |
|------|------|------|
| logistics | checkbox | '1'=快递 '2'=到店 |
| freight | radio | 2=固定邮费 3=运费模板 |
| postage | input-number | 邮费(元) |
| temp_id | select | 运费模板 |

**营销设置 (MarketingSetting)**
| 字段 | 类型 | 说明 |
|------|------|------|
| give_integral | input-number | 购买送积分 |
| coupon_ids | tag-select | 优惠券 |
| label_id | label-selector | 关联用户标签 |
| min_qty | input-number | 起购数量(默认 1) |
| is_limit | switch | 是否限购 |
| limit_type | radio | 1=单次 2=单人 |
| limit_num | input-number | 限购数量 |
| presale | switch | 预售商品 |
| presale_time | date-picker | 预售时间范围 |
| presale_day | input-number | 发货时间(天) |
| recommend | checkbox | is_hot/is_best/is_new/is_good |
| activity | draggable | 活动优先级排序 |
| ficti | input-number | 虚拟销量 |
| sort | input-number | 排序 |

**其他设置 (OtherSetting)**
| 字段 | 类型 | 说明 |
|------|------|------|
| keyword | input | 商品关键字，max 100 |
| store_info | textarea | 商品简介，max 100 |
| command_word | textarea | 商品口令 |
| recommend_image | image-upload | 推荐图 |
| protection_list | checkbox | 服务保障 |
| params_list | dynamic-table | 商品参数 name+value，max 8 行 |
| custom_form | dynamic-form | 自定义表单，max 10 |

### 4.3 商品分类

**列表页**
- 树形展示
- 表格列：id, icon, image, name, is_show, is_home, sort, action

### 4.4 商品属性

**列表页**
- 表格列：id, name, attr_values, sort, action

### 4.5 商品评价

**列表页**
- 搜索：store_name, reply_status
- 表格列：id, product_image, product_name, reply_star, context, pics, reply_status, add_time, action
- 操作：回复、删除

---

## 5. Order 模块 (`order/`)

### 5.1 订单列表

**搜索表单**
| 字段 | 类型 | 选项 |
|------|------|------|
| status | select | 全部/普通订单(1)/拼团订单(2)/秒杀订单(3)/砍价订单(4)/预售订单(5) |
| pay_type | select | 全部/微信支付(1)/支付宝支付(4)/余额支付(2)/线下支付(3) |
| data | date-range | 时间范围 |
| real_name | input (prepend) | all/order_id/uid/real_name/user_phone/title |

**表格列**
| 列名 | 字段 | 说明 |
|------|------|------|
| 订单号 | order_id | 订单编号 |
| 用户信息 | nickname/uid | 用户昵称和 UID |
| 商品信息 | image/name | 商品图+名称+规格 |
| 数量 | total_num | 商品数量 |
| 实际支付 | pay_price | 支付金额 |
| 支付方式 | pay_type_name | 微信/支付宝/余额/线下 |
| 订单状态 | status_name | 订单状态文字 |
| 创建时间 | add_time | 下单时间 |
| 操作 | - | 详情/发货/编辑/删除 |

**展开行信息**：total_price, add_time, spread_nickname, division_name, mark, remark, verify_code, store_name

### 5.2 订单详情

**信息区块**：
- 订单信息：订单号、订单类型、订单状态、支付状态、支付时间、支付方式、交易号
- 收货信息：收货人、手机号、收货地址
- 商品信息：商品列表（图片、名称、规格、单价、数量、小计）
- 物流信息：快递公司、快递单号、物流追踪
- 费用信息：商品总价、邮费、优惠券、积分抵扣、实付金额
- 备注信息：用户备注、商家备注
- 操作日志：操作时间、操作人、操作内容

### 5.3 发货管理

**列表页**
- 搜索：order_id, real_name, delivery_name
- 表格列：id, order_id, delivery_name, delivery_id, add_time, action

**批量发货**
- 支持导入 Excel 批量发货
- 手动填写快递信息

### 5.4 退款管理

**列表页**
- 搜索：refund_order_id, real_name
- 表格列：id, refund_order_id, order_id, image, store_name, refund_price, refund_type, status, add_time, action
- 操作：同意退款、拒绝退款、查看详情

---

## 6. Marketing 模块 (`marketing/`)

### 6.1 优惠券管理

**列表页**
| 字段 | 类型 | 说明 |
|------|------|------|
| status | select | 有效/无效 |
| title | input | 优惠券名称 |

**表格列**：id, title, type, coupon_price, use_min_price, coupon_time, sort, status, add_time, action

**创建表单**
| 字段 | 类型 | 说明 |
|------|------|------|
| title | input | 优惠券名称 |
| type | radio | 1=满减 2=折扣 3=无门槛 |
| value | input-number | 面值/折扣 |
| min_price | input-number | 使用门槛 |
| use_type | radio | 1=全场 2=指定分类 3=指定商品 |
| category_ids | cascader | 指定分类 |
| product_ids | product-selector | 指定商品 |
| start_time | date-picker | 开始时间 |
| end_time | date-picker | 结束时间 |
| type | radio | 1=通用 2=新人券 |
| is_permanent | switch | 永久有效 |
| stay_limit | input-number | 领取限制 |

### 6.2 秒杀活动

**列表页**
| 字段 | 类型 | 说明 |
|------|------|------|
| store_name | input | 商品名称 |
| activity_name | input | 活动名称 |
| status | select | 开启/关闭 |
| time | date-range | 时间范围 |

**表格列**：id, image, title, info, activity_name, product_price, price, quota_show, quota, start_name, start_time/stop_time, status, action

**创建表单**
| 字段 | 类型 | 说明 |
|------|------|------|
| title | input | 活动标题 |
| activity_name | input | 活动名称 |
| product_id | product-selector | 关联商品 |
| price | input-number | 秒杀价格 |
| stock | input-number | 秒杀库存 |
| quota | input-number | 限购数量 |
| start_time | date-picker | 开始时间 |
| end_time | date-picker | 结束时间 |
| sort | input-number | 排序 |

### 6.3 拼团活动

**列表页**
| 字段 | 类型 | 说明 |
|------|------|------|
| is_show | select | 上架/下架 |
| store_name | input | 商品名称 |

**表格列**：id, image, title, ot_price, price, count_people, count_people_all, count_people_pink, quota_show, quota, start_name, start_time/stop_time, is_show, action

**创建表单**
| 字段 | 类型 | 说明 |
|------|------|------|
| title | input | 活动标题 |
| product_id | product-selector | 关联商品 |
| price | input-number | 拼团价格 |
| people_num | number-picker | 成团人数 |
| total | input-number | 总库存 |
| quota | input-number | 限购数量 |
| start_time | date-picker | 开始时间 |
| end_time | date-picker | 结束时间 |

### 6.4 砍价活动

**列表页**
| 字段 | 类型 | 说明 |
|------|------|------|
| status | select | 上架/下架 |
| store_name | input | 商品名称 |

**表格列**：id, image, title, price, min_price, count_people_all, count_people_help, count_people_success, quota_show, quota, start_name, start_time/stop_time, status, action

**创建表单**
| 字段 | 类型 | 说明 |
|------|------|------|
| title | input | 活动标题 |
| product_id | product-selector | 关联商品 |
| price | input-number | 底价 |
| min_price | input-number | 最低砍价金额 |
| bargain_stock | input-number | 砍价库存 |
| quota | input-number | 限购数量 |
| start_time | date-picker | 开始时间 |
| end_time | date-picker | 结束时间 |
| rule | textarea | 活动规则 |

### 6.5 积分商城

**积分商品列表**
- 表格列：id, image, title, price(积分), stock, quota, sales, status, action

**积分订单列表**
- 表格列：id, order_id, image, store_name, pay_price, status, add_time, action

### 6.6 每日签到

**签到配置**
| 字段 | 类型 | 说明 |
|------|------|------|
| day | number | 连续天数 |
| number | number | 获得积分 |
| type | radio | 1=连续签到 2=累计签到 |

---

## 7. Agent 模块 (`agent/`)

### 7.1 分销商管理

**列表页**
| 字段 | 类型 | 说明 |
|------|------|------|
| time | date-range | 时间范围 |
| nickname | input | 名称/手机/UID |

**表格列**：uid, headimgurl, nickname, agentLevel.name, spread_count, order_count, order_price, brokerage_money, extract_count_price, new_money, spread_name, action

**操作**：推广人、推广订单、推广二维码、修改上级推广人、清除上级推广人、取消推广资格、修改分销等级

### 7.2 分销申请

**列表页**
- 表格列：id, nickname, phone, name, add_time, action
- 操作：审核通过、审核拒绝

---

## 8. Finance 模块 (`finance/`)

### 8.1 余额记录

**列表页**
| 字段 | 类型 | 说明 |
|------|------|------|
| time | date-range | 时间范围 |
| trading_type | select | 交易类型 |

**表格列**：id, relation, add_time, number(+/-), nickname, type_name, mark, action

### 8.2 资金流水

**列表页**
- 表格列：id, uid, nickname, number, balance, mark, add_time

### 8.3 佣金记录

**列表页**
- 表格列：id, uid, nickname, number, mark, add_time

### 8.4 提现管理

**列表页**
- 表格列：id, nickname, extract_price, extract_type, real_name, status, add_time, action
- 操作：审核通过、拒绝

---

## 9. Statistic 模块 (`statistic/`)

### 9.1 交易统计
- 今日数据卡片：今日销售额、昨日销售额、增长率、总销售额
- 趋势图表：30天/周/月/年

### 9.2 商品统计
- 商品概览：今日销量、今日销售额、总销量、总销售额
- 商品排行：按销量/销售额排序
- 趋势图表

### 9.3 用户统计
- 用户概览：今日新增、昨日新增、增长率、总用户数
- 增长趋势图表
- 地域分布
- 性别分布

### 9.4 订单统计
- 订单概览：今日订单数、昨日订单数、增长率、总订单数
- 渠道分析：微信/支付宝/余额/线下占比
- 类型分析：普通/秒杀/拼团/砍价占比

---

## 10. CMS 模块 (`cms/`)

### 10.1 文章列表

**搜索表单**
| 字段 | 类型 | 说明 |
|------|------|------|
| pid | cascader | 文章分类 |
| title | input | 文章标题 |

**表格列**：id, image_input, title(含分类名), store_name, visit, add_time, action

### 10.2 文章创建/编辑

**表单**
| 字段 | 类型 | 说明 |
|------|------|------|
| cid | cascader | 文章分类 |
| title | input | 文章标题 |
| author | input | 作者 |
| image_input | image-upload | 封面图 |
| content | rich-editor | 文章内容 |
| digest | textarea | 摘要 |
| sort | number | 排序 |
| is_hot | switch | 热门 |
| is_best | switch | 精选 |
| is_new | switch | 最新 |

---

## 11. Setting 模块 (`setting/`)

### 11.1 系统设置
- 动态表单，根据 API 返回的配置项渲染
- 配置分类：站点设置、支付设置、短信设置、存储设置

### 11.2 运费模板

**列表页**
- 表格列：id, name, type, appoint, sort, add_time, action

**创建/编辑**
| 字段 | 类型 | 说明 |
|------|------|------|
| name | input | 模板名称 |
| type | radio | 1=按件 2=按重量 3=按体积 |
| appoint | number | 指定包邮 |
| region | dynamic-table | 区域运费（首件/首费/续件/续费） |

### 11.3 快递公司

**列表页**
- 表格列：id, name, code, sort, is_show, action
- 操作：同步物流公司

### 11.4 门店管理

**列表页**
- 搜索：keywords
- 表格列：id, image, name, phone, detailed_address, day_time, is_show, action

**创建/编辑表单**
| 字段 | 类型 | 说明 |
|------|------|------|
| image | upload | 门店图片 |
| name | input | 门店名称 |
| phone | input | 联系电话 |
| address | select | 省市区 |
| detailed_address | input | 详细地址 |
| latitude | number | 纬度 |
| longitude | number | 经度 |
| day_time | input | 营业时间 |
| sort | number | 排序 |

### 11.5 店员管理

**列表页**
- 表格列：id, uid, store_name, role, status, add_time, action

### 11.6 会员等级

**列表页**
- 表格列：id, image, name, grade, one_brokerage_percent, two_brokerage_percent, task_total_num, task_num, status, action

---

## 12. WebSocket 模块 (`websocket/`)

### 功能说明
- 管理员通知推送（订单提醒等）
- 客服实时聊天
- 使用 Socket.io 替代 Workerman

### 事件类型
| 事件 | 方向 | 说明 |
|------|------|------|
| `connect` | 客户端→服务端 | 建立连接 |
| `admin:notification` | 服务端→客户端 | 管理员通知 |
| `chat:message` | 双向 | 客服消息 |
| `chat:transfer` | 双向 | 客服转接 |
| `chat:read` | 双向 | 消息已读 |
| `ping/pong` | 双向 | 心跳检测 |

---

# 三、管理后台模块 (Vue3 + Ant Design Vue)

## 路由结构

```
/admin/login                    # 登录页（独立布局）
/admin/                         # 主布局
  ├── /dashboard                # 首页/仪表盘
  ├── /product
  │   ├── /list                 # 商品列表
  │   ├── /add/:id?             # 商品添加/编辑
  │   ├── /category             # 商品分类
  │   ├── /attr                 # 商品属性
  │   ├── /param                # 商品参数
  │   ├── /label                # 商品标签
  │   ├── /protection           # 服务保障
  │   └── /reply                # 商品评价
  ├── /order
  │   ├── /list                 # 订单列表
  │   ├── /detail/:id           # 订单详情
  │   ├── /refund               # 退款管理
  │   ├── /invoice              # 发票管理
  │   ├── /offline              # 离线订单
  │   └── /print                # 打印管理
  ├── /user
  │   ├── /list                 # 用户列表
  │   ├── /group                # 用户分组
  │   ├── /label                # 用户标签
  │   ├── /level                # 用户等级
  │   ├── /cancel               # 注销申请
  │   └── /grade/               # 会员等级管理
  ├── /marketing
  │   ├── /coupon               # 优惠券管理
  │   ├── /coupon-issue         # 优惠券发放
  │   ├── /coupon-user          # 领券记录
  │   ├── /seckill              # 秒杀活动
  │   ├── /combination          # 拼团活动
  │   ├── /bargain              # 砍价活动
  │   ├── /integral             # 积分商品
  │   ├── /integral-order       # 积分订单
  │   ├── /sign                 # 签到管理
  │   ├── /recharge             # 充值套餐
  │   ├── /newuser              # 新人礼
  │   ├── /lottery              # 抽奖活动
  │   ├── /live                 # 直播管理
  │   ├── /channel-code         # 渠道码
  │   └── /presell              # 预售管理
  ├── /finance
  │   ├── /balance              # 余额记录
  │   ├── /capital-flow         # 资金流水
  │   ├── /commission           # 佣金记录
  │   ├── /extract              # 提现管理
  │   └── /recharge             # 充值记录
  ├── /agent
  │   ├── /list                 # 分销商管理
  │   ├── /apply                # 分销申请
  │   ├── /division             # 部门管理
  │   ├── /staff                # 员工管理
  │   └── /spread               # 推广申请
  ├── /cms
  │   ├── /article              # 文章列表
  │   └── /article-save/:id?    # 文章编辑
  ├── /statistic
  │   ├── /transaction          # 交易统计
  │   ├── /product              # 商品统计
  │   ├── /user                 # 用户统计
  │   ├── /order                # 订单统计
  │   └── /balance              # 余额统计
  ├── /setting
  │   ├── /system               # 系统设置
  │   ├── /app                  # 应用设置
  │   ├── /shipping             # 运费模板
  │   ├── /express              # 快递公司
  │   ├── /store                # 门店管理
  │   ├── /staff                # 店员管理
  │   ├── /membership           # 会员等级
  │   ├── /admin                # 管理员管理
  │   ├── /role                 # 角色管理
  │   ├── /menus                # 菜单管理
  │   ├── /storage              # 存储配置
  │   ├── /agreement            # 协议管理
  │   └── /verify               # 核销订单
  ├── /app
  │   ├── /wechat/menus         # 微信菜单
  │   ├── /wechat/reply         # 自动回复
  │   ├── /wechat/news          # 图文管理
  │   ├── /routine/download     # 小程序包
  │   └── /version              # 版本管理
  ├── /diy
  │   ├── /list                 # DIY 模板列表
  │   ├── /edit/:id             # DIY 编辑器
  │   └── /theme                # 主题管理
  └── /system
      ├── /backup               # 数据备份
      ├── /log                  # 系统日志
      ├── /crontab              # 定时任务
      └── /file                 # 文件管理
/kefu/                           # 客服（独立布局）
  └── /pc                        # PC 客服端
```

---

# 四、移动端模块 (UniApp Vue3)

## 页面结构

```
pages/
├── guide/                       # 引导页
├── index/                       # 首页
├── goods_cate/                  # 商品分类
├── goods_details/               # 商品详情（分包）
├── goods/
│   ├── goods_list/              # 商品列表
│   ├── goods_search/            # 搜索
│   ├── goods_comment_list/      # 评论列表
│   ├── goods_return/            # 退款申请
│   ├── goods_logistics/         # 物流追踪
│   ├── order_confirm/           # 订单确认
│   ├── order_details/           # 订单详情
│   ├── order_list/              # 订单列表
│   ├── order_pay_status/        # 支付结果
│   ├── order_refund_goods/      # 退货物流
│   └── cashier/                 # 收银台
├── order_addcart/               # 购物车
├── user/                        # 用户中心
├── users/
│   ├── login/                   # 登录
│   ├── user_address/            # 地址编辑
│   ├── user_address_list/       # 地址列表
│   ├── user_integral/           # 积分明细
│   ├── user_sgin/               # 签到
│   ├── user_bill/               # 账单
│   └── user_extract/            # 提现
├── activity/
│   ├── goods_bargain_details/   # 砍价详情
│   ├── goods_combination_details/ # 拼团详情
│   └── goods_seckill_details/   # 秒杀详情
├── extension/
│   ├── news_list/               # 文章列表
│   └── news_detail/             # 文章详情
└── points_mall/                 # 积分商城
```

### 4.1 首页

**展示内容**：
- DIY 模板渲染（从后端获取模板数据）
- Banner 轮播
- 分类导航
- 秒杀专区
- 拼团专区
- 砍价专区
- 推荐商品列表

**API 接口**：
- `getIndexData()` — 首页数据
- `getDiy()` — DIY 模板数据
- `getCoupons()` — 优惠券列表
- `category()` — 分类列表

### 4.2 商品详情

**展示内容**：
- 商品轮播图 + 视频
- SKU 选择器
- 价格/会员价
- 规格信息
- 商品参数
- 服务保障
- 优惠券列表
- 评价列表
- 推荐商品
- 底部操作栏（收藏/加入购物车/立即购买）

**SKU 选择器数据结构**：
```typescript
interface SkuSelector {
  productValue: Record<string, {
    stock: number;
    unique: string;
    image: string;
    price: number;
    vip_price: number;
  }>;
  productAttr: {
    attr_values: string[];
    index: number;
  }[];
  productSelect: {
    image: string;
    stock: number;
    unique: string;
    price: number;
    vip_price: number;
  };
}
```

### 4.3 购物车

**展示内容**：
- 商品列表（图片、名称、规格、价格、数量选择器）
- 全选/单选
- 合计金额
- 结算按钮
- 空购物车提示

### 4.4 订单确认

**展示内容**：
- 收货地址选择
- 商品清单
- 配送方式（快递/到店自提）
- 优惠券选择
- 积分抵扣
- 发票信息
- 备注输入
- 合计金额
- 提交订单

**订单创建参数**：
```typescript
interface CreateOrderDto {
  addressId?: number;
  couponId?: number;
  useIntegral?: number;
  bargainId?: number;
  combinationId?: number;
  pinkId?: number;
  advanceId?: number;
  seckill_id?: number;
  mark?: string;
  store_id?: number;
  shipping_type: number;  // 0=快递 1=到店
  invoice_id?: number;
  custom_form?: Record<string, any>;
}
```

### 4.5 订单列表

**Tab 切换**：全部/待付款/待发货/待收货/待评价/退款

**订单卡片信息**：
```typescript
interface OrderCard {
  order_id: string;
  _status: {
    _type: number;
    _msg: string;
    _payType: string;
  };
  cartInfo: {
    productInfo: {
      image: string;
      store_name: string;
      attrInfo: { price: number };
    };
    price: number;
    cart_num: number;
    refund_num: number;
  }[];
  total_num: number;
  pay_price: number;
  shipping_type: number;
  is_cancel: number;
  is_all_refund: number;
}
```

### 4.6 收银台

**支付方式**：
1. 微信支付 (weixin)
2. 支付宝支付 (alipay)
3. 余额支付 (yue)
4. 线下支付 (offline)
5. 好友代付 (friend)

### 4.7 砍价详情

**展示内容**：
- 商品信息（图片、标题、价格、底价）
- 砍价进度条
- 帮砍列表
- 操作按钮（开始砍价/邀请好友砍价/去购买）

### 4.8 拼团详情

**展示内容**：
- 商品信息（图片、标题、拼团价、原价）
- 成团进度（已拼 X 人/还需 Y 人）
- 参团列表
- 操作按钮（立即参团/邀请好友拼团）

### 4.9 秒杀详情

**展示内容**：
- 商品信息
- 倒计时
- 秒杀价格/原价
- 库存进度
- 操作按钮（立即抢购）

### 4.10 用户中心

**展示内容**：
- 用户头像/昵称
- 会员等级
- 订单状态快捷入口（待付款/待发货/待收货/待评价/退款）
- 功能菜单（积分/收藏/地址/设置等）
- DIY 可配置布局

### 4.11 签到

**展示内容**：
- 连续签到天数
- 签到日历（7天/30天）
- 签到规则
- 签到按钮
- 签到记录

---

# 五、数据库设计 (Prisma)

原项目 120+ 张表，复刻使用 `xj_` 前缀。核心表：

## 系统表
- `xj_system_admin` — 管理员
- `xj_system_role` — 角色
- `xj_system_menus` — 菜单
- `xj_system_pem` — 权限
- `xj_system_config` — 配置
- `xj_system_config_tab` — 配置分类
- `xj_system_log` — 操作日志
- `xj_system_route` — 路由
- `xj_system_storage` — 存储配置
- `xj_system_notice` — 通知
- `xj_system_store` — 门店
- `xj_system_store_staff` — 店员

## 用户表
- `xj_user` — 用户主表
- `xj_user_address` — 收货地址
- `xj_user_level` — 用户等级
- `xj_user_group` — 用户分组
- `xj_user_label` — 用户标签
- `xj_user_label_relation` — 标签关联
- `xj_user_bill` — 余额记录
- `xj_user_brokerage` — 佣金
- `xj_user_brokerage_frozen` — 冻结佣金
- `xj_user_extract` — 提现记录
- `xj_user_sign` — 签到记录
- `xj_user_spread` — 推广数据
- `xj_user_money` — 余额
- `xj_user_notice` — 用户通知
- `xj_user_invoice` — 发票

## 商品表
- `xj_store_product` — 商品主表
- `xj_store_category` — 商品分类
- `xj_store_product_attr` — 商品属性
- `xj_store_product_attr_result` — 属性结果
- `xj_store_product_attr_value` — SKU 值
- `xj_store_product_reply` — 商品评价
- `xj_store_product_label` — 商品标签
- `xj_store_product_param` — 商品参数
- `xj_store_product_protection` — 服务保障
- `xj_store_product_relation` — 关联商品

## 订单表
- `xj_store_order` — 订单主表
- `xj_store_order_cart_info` — 订单商品
- `xj_store_order_refund` — 退款
- `xj_store_order_status` — 订单状态
- `xj_store_order_invoice` — 发票
- `xj_store_cart` — 购物车
- `xj_store_order_economize` — 节省金额

## 营销表
- `xj_store_coupon` — 优惠券
- `xj_store_coupon_issue` — 发放
- `xj_store_coupon_user` — 领取记录
- `xj_store_seckill` — 秒杀
- `xj_store_seckill_time` — 秒杀时段
- `xj_store_combination` — 拼团
- `xj_store_pink` — 拼团记录
- `xj_store_bargain` — 砍价
- `xj_store_bargain_user` — 砍价用户
- `xj_store_bargain_user_help` — 帮砍记录
- `xj_store_integral` — 积分商品
- `xj_store_integral_order` — 积分订单
- `xj_luck_lottery` — 抽奖
- `xj_luck_prize` — 奖品
- `xj_system_sign_reward` — 签到奖励

## 分销表
- `xj_agent_level` — 分销等级
- `xj_agent_level_task` — 等级任务
- `xj_division_agent_apply` — 分销申请
- `xj_spread_apply` — 推广申请

## 物流表
- `xj_shipping_templates` — 运费模板
- `xj_shipping_templates_region` — 区域运费
- `xj_shipping_templates_free` — 包邮规则
- `xj_express` — 快递公司

## 微信表
- `xj_wechat_user` — 微信用户
- `xj_wechat_key` — 微信密钥
- `xj_wechat_media` — 素材
- `xj_wechat_message` — 消息
- `xj_wechat_qrcode` — 二维码
- `xj_wechat_reply` — 自动回复

## CMS 表
- `xj_article` — 文章
- `xj_article_category` — 文章分类

## 其他
- `xj_diy` — DIY 页面
- `xj_theme` — 主题
- `xj_capital_flow` — 资金流水
- `xj_sms_record` — 短信记录
- `xj_system_timer` — 定时任务

---

# 六、开发阶段

### Phase 1: 项目脚手架 + 核心基础
1. 初始化 monorepo (pnpm workspace)
2. NestJS 项目搭建 + Prisma 配置 + 数据库 Schema
3. Auth 模块（JWT + RBAC）
4. System 模块（管理员、角色、菜单）
5. Vue3 管理后台脚手架（路由、布局、登录、权限）
6. packages/shared 类型定义

### Phase 2: 核心业务模块
7. User 模块
8. Product 模块
9. Order 模块
10. Upload 模块（多云存储）

### Phase 3: 营销 + 分销
11. Marketing 模块（优惠券、秒杀、拼团、砍价、积分）
12. Agent 分销模块
13. Finance 财务模块

### Phase 4: 扩展功能
14. CMS + DIY 模块
15. Statistic 统计模块
16. Shipping 物流模块
17. WeChat 模块
18. WebSocket（客服 + 通知）
19. Queue（异步任务 + 定时任务）

### Phase 5: 移动端
20. UniApp (Vue3) 脚手架
21. 移动端页面开发（首页、商品、购物车、订单、用户）
22. 活动页面（秒杀、拼团、砍价、积分商城）
23. 客服聊天

### Phase 6: 联调 + 部署
24. 前后端联调
25. Docker 化部署配置
26. 文档编写

---

# 七、验证方式

1. 启动 NestJS 后端 → 访问 `/api` Swagger 文档确认接口可用
2. 启动 Vue3 管理后台 → 登录、权限验证、各模块 CRUD 操作
3. 启动 UniApp → H5 模式预览页面
4. 运行 Prisma Studio → 检查数据模型和关系
5. 单元测试 + E2E 测试覆盖核心模块

---

# 八、关键决策总结

| 决策项 | 选择 | 理由 |
|--------|------|------|
| 移动端 | UniApp (Vue3) 完全复刻 | 与原项目一致，多端覆盖 |
| 数据库 | MySQL | 兼容原项目 SQL |
| ORM | Prisma | 类型安全，开发体验好 |
| UI 框架 | Ant Design Vue | 设计体系成熟，功能丰富 |
| 缓存 | Redis | Session + 队列 + 缓存 |
| WebSocket | @nestjs/websockets (Socket.io) | 替代 Workerman |
| 包管理 | pnpm + monorepo | 统一管理多项目 |
| 表前缀 | `xj_` | 区分原项目的 `eb_` 前缀 |
