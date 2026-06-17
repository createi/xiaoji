# xiaoji 剩余开发计划

## Context

项目已完成 Phase 1-3 及 Phase 4 大部分内容。后端 API（15 模块、26 个 Controller）和管理后台（36 个页面、11 个 API 模块）的主体框架已就绪。剩余工作包括：管理后台缺失的 CRUD 页面、UniApp 移动端开发、Docker 部署配置。

**原则**：不修改已完成的功能代码，只新增缺失的部分。

---

## Part 1: Admin 后台 — 缺失 CRUD 页面补全

**问题**：每个模块的列表页 + 删除已实现，但创建/编辑/详情操作缺失。API 层已完备（~57 个函数未被调用），只缺路由和页面组件。

### 1.1 需要新建的编辑/表单页面（8 个）

每个页面模式一致：`PageHeader` + `a-form` 表单，支持新建和编辑模式（通过路由 `:id?` 参数区分）。

| 模块 | 页面路径 | 路由 | 表单字段 |
|------|----------|------|----------|
| 优惠券 | `views/marketing/coupon/form.vue` | `/marketing/coupon/add/:id?` | title, type, value, min_price, use_type, start/end_time, stay_limit |
| 秒杀 | `views/marketing/seckill/form.vue` | `/marketing/seckill/add/:id?` | title, activity_name, product_id, price, stock, quota, start/end_time |
| 拼团 | `views/marketing/combination/form.vue` | `/marketing/combination/add/:id?` | title, product_id, price, people_num, total, quota, start/end_time |
| 砍价 | `views/marketing/bargain/form.vue` | `/marketing/bargain/add/:id?` | title, product_id, price, min_price, bargain_stock, quota, start/end_time, rule |
| 积分商品 | `views/marketing/integral/form.vue` | `/marketing/integral/add/:id?` | title, product_id, price, stock, quota |
| 用户等级 | `views/user/level/form.vue` | `/user/level/add/:id?` | name, image, grade, brokerage percentages, task_total_num |
| 用户分组 | `views/user/group/form.vue` | `/user/group/add/:id?` | name, image, sort, status, is_show |
| 用户标签 | `views/user/label/form.vue` | `/user/label/add/:id?` | name, color, sort, status |

### 1.2 路由注册

在 `apps/admin/src/router/index.ts` 中为每个模块添加 `add/:id?` 路由（hidden: true），模式参照已有的 `/product/add/:id?`。

### 1.3 修复现有 TODO

- **9 个 `handleEdit`**：在各列表页的 `handleEdit` 中添加 `router.push('/xxx/add/' + record.id)`
- **1 个 system settings save**：在 `apps/admin/src/api/setting.ts` 中新增 `getSystemConfig()` 和 `saveSystemConfig()` API 函数，在 `setting/system/index.vue` 的 `handleSave` 中调用
- **CMS article**：路由已存在，只需在 `cms/article/index.vue` 的 `handleEdit` 中添加 `router.push`

### 1.4 关键文件

- `apps/admin/src/router/index.ts` — 添加路由
- `apps/admin/src/api/setting.ts` — 新增系统配置 API
- `apps/admin/src/views/marketing/*/index.vue` — 修复 handleEdit
- `apps/admin/src/views/user/*/index.vue` — 修复 handleEdit
- `apps/admin/src/views/cms/article/index.vue` — 修复 handleEdit
- `apps/admin/src/views/setting/system/index.vue` — 接入 save API

---

## Part 2: UniApp 移动端开发

**当前状态**：19 个页面中仅首页有真实 UI，其余全是空壳。无 API 层、无 Store、无组件库、无样式、未加入 pnpm workspace。

### 2.1 基础设施搭建

1. **加入 pnpm workspace**：在 `pnpm-workspace.yaml` 中添加 `'apps/uniapp'`
2. **安装依赖**：`pnpm install` 后确认 `@xiaoji/shared` 可用
3. **新建目录结构**：
   ```
   apps/uniapp/src/
   ├── api/              # HTTP 请求封装 + 各模块 API
   │   ├── request.ts    # uni.request 封装（token 注入、错误处理）
   │   ├── auth.ts
   │   ├── product.ts
   │   ├── order.ts
   │   ├── user.ts
   │   └── marketing.ts
   ├── stores/           # Pinia stores
   │   ├── user.ts       # 用户信息、token、登录状态
   │   └── cart.ts       # 购物车
   ├── components/       # 复用组件
   │   ├── ProductCard/  # 商品卡片
   │   ├── Empty/        # 空状态
   │   ├── PriceDisplay/ # 价格显示
   │   └── LoadMore/     # 上拉加载更多
   ├── styles/
   │   └── variables.scss
   └── utils/
       └── index.ts      # 工具函数
   ```
4. **TabBar 图标**：在 `static/tab/` 下创建 8 个 SVG/PNG 图标（首页/分类/购物车/我的 各选中+未选中）

### 2.2 API 层 (`request.ts`)

使用 `uni.request` 封装（无需 axios，UniApp 原生支持）：
- Base URL 从环境变量读取
- 自动注入 Authorization header
- 统一错误处理（401 跳转登录）
- loading 状态管理

### 2.3 Store 层

- `userStore`：token、userInfo、login/logout actions
- `cartStore`：cartList、totalCount、totalPrice、add/remove/update actions

### 2.4 页面实现（按优先级）

**TabBar 页面**（4 个）：
1. `pages/index/index` — 从硬编码改为 API 调用，接入真实数据
2. `pages/goods_cate/index` — 分类页，左侧分类列表 + 右侧商品网格
3. `pages/order_addcart/index` — 购物车页，商品列表 + 全选 + 结算栏
4. `pages/user/index` — 我的页，头像/昵称 + 订单快捷入口 + 功能菜单

**核心子页面**（10 个）：
5. `pages/users/login/index` — 登录页（手机号 + 密码/验证码）
6. `pages/goods_details/index` — 商品详情（轮播图 + SKU 选择器 + 底部操作栏）
7. `pages/goods/goods_list/index` — 商品列表（搜索结果 + 分类筛选）
8. `pages/goods/goods_search/index` — 搜索页（搜索框 + 热搜 + 历史）
9. `pages/goods/order_confirm/index` — 确认订单（地址 + 商品清单 + 优惠券 + 支付）
10. `pages/goods/order_list/index` — 我的订单（Tab 切换 + 订单卡片）
11. `pages/goods/order_details/index` — 订单详情
12. `pages/goods/cashier/index` — 收银台（支付方式选择）
13. `pages/users/user_address_list/index` — 地址列表
14. `pages/users/user_address/index` — 地址编辑

**营销活动页面**（3 个）：
15. `pages/activity/goods_seckill_details/index` — 秒杀详情
16. `pages/activity/goods_combination_details/index` — 拼团详情
17. `pages/activity/goods_bargain_details/index` — 砍价详情

**其他**（2 个）：
18. `pages/users/user_sgin/index` — 签到页
19. `pages/users/user_integral/index` — 积分明细

### 2.5 复用组件

| 组件 | 说明 |
|------|------|
| `ProductCard` | 商品卡片（图片+名称+价格），用于首页/列表/推荐 |
| `Empty` | 空状态提示（购物车空/订单空等） |
| `PriceDisplay` | 价格格式化显示（支持会员价） |
| `LoadMore` | 上拉加载 + 下拉刷新 |
| `SKUSelector` | SKU 选择器（规格选择弹窗） |

### 2.6 关键文件

- `pnpm-workspace.yaml` — 添加 uniapp
- `apps/uniapp/src/api/request.ts` — 新建
- `apps/uniapp/src/api/*.ts` — 新建各模块 API
- `apps/uniapp/src/stores/*.ts` — 新建 stores
- `apps/uniapp/src/components/` — 新建组件
- `apps/uniapp/src/pages/**/*.vue` — 替换 18 个 stub 页面
- `apps/uniapp/src/pages/index/index.vue` — 改造为 API 驱动

---

## Part 3: DIY 模块 — 暂缓

**决策**：DIY 可视化页面编辑器实现复杂度极高（需要拖拽引擎、组件渲染器、模板存储），本轮跳过，后续单独规划。

---

## Part 4: Docker 部署配置

### 4.1 开发环境 (`docker-compose.yml`)

已在计划中定义，检查是否已创建。如未创建则按计划新建：
- MySQL 8.0（端口 3306，root/123456，数据库 xiaoji_dev）
- Redis 7（端口 6379）
- init.sql 初始化脚本

### 4.2 生产环境 (`docker-compose.prod.yml`)

按计划新建：
- api 服务（NestJS，端口 7001）
- admin 服务（Nginx 静态文件，端口 8080）
- MySQL 8.0（带密码）
- Redis 7（带密码）
- Nginx 反向代理（端口 80/443）

### 4.3 应用 Dockerfile

- `apps/api/Dockerfile` — Node 22 + 生产构建
- `apps/admin/Dockerfile` — Nginx + 静态文件

### 4.4 Nginx 配置

- `docker/nginx.conf` — 反向代理 `/api` 到 api 服务，静态文件服务 admin

### 4.5 关键文件

- `docker-compose.yml` — 新建
- `docker-compose.prod.yml` — 新建
- `apps/api/Dockerfile` — 新建
- `apps/admin/Dockerfile` — 新建
- `docker/nginx.conf` — 新建
- `docker/init.sql` — 新建（如不存在）

---

## 执行顺序

1. **Part 1**（Admin CRUD 补全）— 最快见效，工作量适中
2. **Part 4**（Docker 配置）— 独立性强
3. **Part 2**（UniApp 移动端）— 最大工作量，分批实现
4. **Part 3**（DIY 模块）— 暂缓

## 验证方式

1. Admin：启动后端 + 管理后台，验证所有 CRUD 操作可用
2. UniApp：启动 H5 模式，验证页面渲染和 API 调用
3. Docker：`docker compose up` 验证容器启动和数据库连接
