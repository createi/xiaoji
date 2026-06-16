# Admin 前端重构 — 完全参考 CRMEB 样式

## 背景

xiaoji 管理后台目前基础设施已搭建完成（路由、状态管理、布局、登录），但 34+ 个页面视图全部是占位符（"页面开发中..."），没有全局样式、没有公共组件、布局和登录页也不匹配 CRMEB 的设计风格。需要将整个管理后台 UI 重构为与 CRMEB 一致的视觉风格，技术栈为 Vue 3 + TypeScript + Ant Design Vue。

CRMEB 参考：`D:\WorkSpace\Github-Projects\CRMEB\template\admin`
xiaoji 后台：`D:\WorkSpace\Github-Projects\xiaoji\xiaoji\apps\admin`

---

## 阶段 A：基础建设（样式、布局、组件、API、状态管理）

### A1. 安装 sass 并配置 Vite
- `apps/admin/package.json` 添加 `sass` 开发依赖
- `apps/admin/vite.config.ts` 添加 SCSS 全局变量注入配置

### A2. 全局样式 — 创建 `src/styles/` 目录（6 个文件）

**`variables.scss`** — CSS 自定义属性，匹配 CRMEB `:root`：
- 主色 `#0256ff`，侧边栏 `#282c34`，顶栏 `#fff`，内容区背景 `#f0f2f5`
- 文字色 `#303133`/`#909399`，边框 `#ebeef5`，表头背景 `#f2f6ff`

**`global.scss`** — 基础排版、工具类、滚动条
- 字体引入：`@import url("https://cdn-font.hyperos.mi.com/font/css?family=MiSans:100,200,300,400,450,600,650,700,900:Chinese_Simplify,Latin&display=swap");`
- 正文字体：`MiSans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- 数字/金额等需要等宽显示的场景：`'Roboto', 'Roboto Mono', monospace`
- 基础字号 12px

**`antd-overrides.scss`** — 覆盖 Ant Design 组件默认样式：
- 按钮：圆角 4px，字号 12px
- 卡片：无阴影、无边框
- 表格：表头背景 `#f2f6ff`，行高 100px，单元格内边距 10px 5px
- 弹窗：圆角 6px，头部背景 `#fafafa`
- 菜单项高度 50px，字号 14px
- 数字/金额/统计类内容使用 `'Roboto', monospace` 等宽字体

**`layout.scss`** — 布局样式（侧边栏 180px、顶栏 50px、内容区 16px 内边距）
**`dashboard.scss`** — 仪表盘统计卡片和图表样式
**`login.scss`** — 登录页样式

### A3. 重写 `src/layouts/BasicLayout.vue`
- 侧边栏：宽度 180px，背景 `#282c34`，阴影 `1px 1px 4px rgba(0,21,41,0.08)`
- Logo：展开 180x50px，收起 50x50px
- 顶栏：高度 50px，白色背景，阴影 `0 1px 4px rgba(0,21,41,0.08)`
- 内容区：背景 `#f0f2f5`，内边距 16px
- **动态菜单**：从 `router.options.routes` 递归生成，跳过 `meta.hidden` 的路由

### A4. TagsView 标签页组件
- 创建 `src/components/TagsView/index.vue`：顶栏下方的水平标签栏
- 更新 `src/stores/app.ts`：添加 `tagsViewList` 数组和增删操作
- 路由监听自动添加/激活标签
- 右键菜单：关闭、关闭其他、关闭全部

### A5. API 层 — 创建 10 个 API 模块文件
每个文件沿用 `src/api/auth.ts` 的模式，类型从 `@xiaoji/shared` 导入：

| 文件 | 接口 |
|------|------|
| `src/api/product.ts` | 商品列表、详情、增删改、分类 CRUD |
| `src/api/order.ts` | 订单列表、详情、发货、退款 |
| `src/api/user.ts` | 用户列表、详情、修改、等级/分组/标签 CRUD |
| `src/api/marketing.ts` | 优惠券/秒杀/拼团/砍价/积分 CRUD |
| `src/api/finance.ts` | 余额、佣金、提现 |
| `src/api/agent.ts` | 分销商列表、申请审核 |
| `src/api/cms.ts` | 文章 CRUD、分类 CRUD |
| `src/api/statistic.ts` | 仪表盘、交易、商品、用户统计 |
| `src/api/setting.ts` | 系统配置、管理员/角色/菜单 CRUD、门店、运费、快递 |
| `src/api/upload.ts` | 文件上传 |

### A6. 公共组件
- **`PageHeader`**：页面标题（18px/500）+ 描述 + 操作按钮插槽
- **`SearchForm`**：可折叠搜索表单容器
- **`ECharts`**：vue-echarts 封装组件
- **`StatCard`**：仪表盘统计卡片（彩色圆形图标）

### A7. 状态管理与认证增强
- `src/stores/user.ts`：添加 `fetchUserInfo()` 调用 `getAdminInfo()`
- `src/router/index.ts`：导航守卫在首次认证后自动获取用户信息
- `src/App.vue`：导入全局样式（含 MiSans 字体 CDN），配置 Ant Design 主题色 `#0256ff`

---

## 阶段 B：核心页面

### B1. 登录页重写 — `src/views/login/index.vue`
匹配 CRMEB 登录风格：
- 全屏深色背景（渐变或纯色 `#282c34`）
- 居中容器，圆角 12px，阴影
- 左侧：图片轮播（`a-carousel`）
- 右侧：Logo + 表单（账号、密码、可选验证码）
- 登录按钮：渐变 `linear-gradient(90deg, #19b4f1, #0e73e8)`，全宽
- 底部版权信息

### B2. 仪表盘重写 — `src/views/dashboard/index.vue`
匹配 CRMEB 仪表盘布局：
1. **4 个统计卡片**（第一行）：今日销售额、订单数、新增用户、待退款
   - 彩色圆形图标（循环色：`#4d7cfe`、`#ffab2b`、`#6dd230`、`#ff85c0`）
   - 大数字 24px（Roboto 等宽字体），标签 12px/`#98a9bc`
   - 昨日对比 + 增长率（红涨绿跌箭头）
2. **快捷入口**（8 个图标）：用户管理、系统设置、商品、订单等
   - 48x48px 圆形图标背景 `#f6f6f6`，标签 14px
3. **订单趋势图**（全宽）：折线+柱状组合图，双 Y 轴，时间范围切换
4. **用户统计**（2/3 + 1/3）：折线图（用户增长）+ 饼图（买家统计）
- 数据来源：`GET /api/statistic/dashboard` 等接口
- 使用 `vue-echarts`（已安装）

---

## 阶段 C：3 个参考 CRUD 页面

建立所有剩余页面的视觉模板。每个页面遵循：

```
[页面标题]
[搜索表单 + 操作按钮]
[数据表格 + 分页]
```

### C1. 商品列表 — `src/views/product/list/index.vue`
- 搜索：商品名称输入框、状态下拉
- 表格列：ID、图片（48x48 缩略图）、名称（最多 80 字）、价格、销量、库存、状态（开关）、排序、操作（编辑/删除）
- 状态开关直接调用更新接口
- 底部分页

### C2. 订单列表 — `src/views/order/list/index.vue`
- 搜索：状态、支付方式、时间范围、关键词
- 表格列：订单号（可复制）、用户信息、商品图+名、数量、价格、支付方式、状态（彩色标签）、时间、操作
- 可展开行显示详情

### C3. 用户列表 — `src/views/user/list/index.vue`
- 搜索：昵称/手机/UID、等级
- 表格列：UID、头像（圆形）、昵称、手机、余额、积分、状态徽章、注册时间、操作

---

## 阶段 D：剩余 31 个页面（按 CRUD 模板开发）

优先级分组（均按 表格+搜索+分页 模板）：
1. **订单**：退款、详情（订单信息区块）
2. **营销**：优惠券、秒杀、拼团、砍价、积分
3. **财务**：余额、佣金、提现
4. **设置**：管理员、角色、菜单、系统、门店、运费、快递
5. **用户**：等级、分组、标签
6. **分销**：分销商、申请
7. **内容**：文章列表、文章编辑（富文本）
8. **统计**：交易、商品、用户（图表密集页面）

---

## 关键文件清单

### 新建文件
```
apps/admin/src/styles/variables.scss
apps/admin/src/styles/global.scss
apps/admin/src/styles/antd-overrides.scss
apps/admin/src/styles/layout.scss
apps/admin/src/styles/dashboard.scss
apps/admin/src/styles/login.scss
apps/admin/src/components/TagsView/index.vue
apps/admin/src/components/PageHeader/index.vue
apps/admin/src/components/SearchForm/index.vue
apps/admin/src/components/ECharts/index.vue
apps/admin/src/components/StatCard/index.vue
apps/admin/src/api/product.ts
apps/admin/src/api/order.ts
apps/admin/src/api/user.ts
apps/admin/src/api/marketing.ts
apps/admin/src/api/finance.ts
apps/admin/src/api/agent.ts
apps/admin/src/api/cms.ts
apps/admin/src/api/statistic.ts
apps/admin/src/api/setting.ts
apps/admin/src/api/upload.ts
```

### 修改文件
```
apps/admin/package.json              — 添加 sass 依赖
apps/admin/vite.config.ts            — 添加 SCSS 配置
apps/admin/src/main.ts               — 导入全局样式
apps/admin/src/App.vue               — 添加主题配置、导入样式
apps/admin/src/layouts/BasicLayout.vue — 全面重写（180px 侧边栏、动态菜单、TagsView）
apps/admin/src/stores/app.ts         — 添加 tagsViewList
apps/admin/src/stores/user.ts        — 添加 fetchUserInfo
apps/admin/src/router/index.ts       — 更新导航守卫
apps/admin/src/views/login/index.vue — 全面重写（CRMEB 风格）
apps/admin/src/views/dashboard/index.vue — 全面重写（图表+统计）
apps/admin/src/views/product/list/index.vue — 全面重写（CRUD 表格）
apps/admin/src/views/order/list/index.vue   — 全面重写（CRUD 表格）
apps/admin/src/views/user/list/index.vue    — 全面重写（CRUD 表格）
+ 31 个剩余页面视图 → CRUD 页面（阶段 D）
```

---

## 验证方式

1. `cd apps/admin && pnpm dev` — 确认无编译错误
2. 打开 `http://localhost:3000` — 登录页应显示 CRMEB 风格
3. 使用 admin/password 登录 — 跳转仪表盘，图表正常渲染
4. 导航侧边栏 — 菜单动态生成，TagsView 追踪打开的页面
5. 访问 `/product/list` — 显示带搜索、分页的样式化表格
6. 检查响应式：侧边栏收起/展开平滑过渡
7. TypeScript 检查：`vue-tsc --noEmit` 无错误
