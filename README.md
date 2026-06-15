# xiaoji (小鸡) — CRMEB 复刻电商平台

基于 CRMEB 开源电商系统进行技术栈重构复刻。原项目基于 PHP ThinkPHP 6.0 + Vue 2 + UniApp (Vue2)，复刻后采用现代化技术栈：**NestJS + Prisma + Vue3 + TypeScript + UniApp (Vue3)**。

## 技术栈

| 层级     | 技术                  | 说明                   |
| -------- | --------------------- | ---------------------- |
| 后端框架 | NestJS                | TypeScript，模块化架构 |
| ORM      | Prisma                | Schema-first，类型安全 |
| 数据库   | MySQL 8.x             | 与原项目兼容           |
| 管理后台 | Vue3 + Ant Design Vue | 替代 Vue2 + Element UI |
| 移动端   | UniApp (Vue3)         | H5/小程序/App 多端     |
| 构建工具 | Vite                  | 管理后台和 UniApp      |
| 包管理   | pnpm                  | Monorepo 工作区        |

## 项目结构

```
xiaoji/
├── apps/
│   ├── api/                    # NestJS 后端 API 服务
│   ├── admin/                  # Vue3 管理后台
│   └── uniapp/                 # UniApp 移动端
├── packages/
│   ├── shared/                 # 前后端共享类型定义
│   ├── prisma/                 # Prisma schema 和迁移
│   └── utils/                  # 通用工具函数
├── docs/                       # 项目文档
├── pnpm-workspace.yaml
├── package.json
├── .env.development            # 开发环境变量
├── .env.test                   # 测试环境变量
└── .env.production             # 生产环境变量
```

---

## 快速开始

### 环境要求

- **Node.js**: >= 22.16.0
- **pnpm**: >= 9.0.0
- **MySQL**: 8.x
- **Redis**: 7.x (可选，开发环境可禁用缓存)

### 1. 克隆项目

```bash
git clone https://github.com/your-username/xiaoji.git
cd xiaoji
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

编辑 `.env.development` 文件：

```bash
# 数据库配置（修改为你的 MySQL 账号密码）
DATABASE_URL="mysql://user:1234567@localhost:3306/xiaoji_dev"

# JWT 密钥（生产环境请更换）
JWT_SECRET="your-jwt-secret-key"

# Redis（可选，开发环境可禁用缓存）
REDIS_URL="redis://localhost:6379/0"
CACHE_ENABLED=false
```

### 4. 创建数据库

**方式 1：命令行执行（推荐）**

```bash
# 注意：-p 和密码之间不要有空格
mysql -u root -p你的密码 -e "CREATE DATABASE IF NOT EXISTS xiaoji_dev DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

示例（账号 user，密码 1234567）：

```bash
mysql -u user -p1234567 -e "CREATE DATABASE IF NOT EXISTS xiaoji_dev DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

**方式 2：分步执行**

```bash
# 登录 MySQL
mysql -u user -p1234567

# 在 MySQL 命令行中执行以下 SQL
CREATE DATABASE IF NOT EXISTS xiaoji_dev DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 退出 MySQL
exit;
```

### 5. 初始化数据库

**所有命令都在项目根目录执行：**

```bash
# 生成 Prisma Client
pnpm --filter @xiaoji/prisma generate

# 运行数据库迁移
pnpm --filter @xiaoji/prisma migrate:dev -- --name init
```

### 6. 填充种子数据

```bash
pnpm run db:seed:dev

```

成功输出：

```
🌱 Seeding database...
✅ Created admin: admin
✅ Created role: 超级管理员
✅ Created menus
✅ Created categories
✅ Created user levels
✅ Created agent levels
✅ Created sign rewards
🎉 Seeding completed!
```

### 7. 启动服务

```bash
# 启动后端 API
pnpm dev
```

启动成功输出：

```
🚀 xiaoji API running on: http://localhost:7001
📚 Swagger docs: http://localhost:7001/api/docs
```

### 8. 验证启动

打开浏览器访问：

- **Swagger 文档**: http://localhost:7001/api/docs
- **测试登录**: 在 Swagger 中找到 `POST /auth/admin/login`

登录请求体：

```json
{
  "account": "admin",
  "password": "password"
}
```

### 9. 启动管理后台（可选）

```bash
# 新开终端
pnpm dev:admin
```

访问 http://localhost:5173

---

## 常用命令

### 开发相关

```bash
pnpm dev                # 启动后端 API（开发模式）
pnpm dev:admin          # 启动管理后台（开发模式）
pnpm dev:uniapp         # 启动 UniApp（H5 模式）
pnpm dev:all            # 同时启动所有服务
```

### 数据库相关

```bash
pnpm --filter @xiaoji/prisma generate                              # 生成 Prisma Client
pnpm --filter @xiaoji/prisma migrate:dev -- --name init            # 运行迁移
pnpm run db:seed:dev
                                                   # 填充种子数据
pnpm --filter @xiaoji/prisma studio                                # 打开可视化管理
```

### 构建相关

```bash
pnpm build              # 构建所有项目
pnpm build:api          # 构建后端 API
pnpm build:admin        # 构建管理后台
```

### 测试相关

```bash
pnpm test               # 运行单元测试
pnpm test:e2e           # 运行 E2E 测试
```

---

## 项目结构详解

### 后端 API (`apps/api/`)

```
apps/api/src/
├── main.ts                    # 应用入口
├── app.module.ts              # 根模块
├── config/
│   └── configuration.ts       # 配置加载
├── prisma/
│   ├── prisma.module.ts       # Prisma 模块
│   └── prisma.service.ts      # 数据库服务
└── modules/
    ├── auth/                  # 认证模块
    │   ├── auth.module.ts
    │   ├── auth.service.ts
    │   ├── auth.controller.ts
    │   ├── strategies/
    │   │   └── jwt.strategy.ts
    │   ├── guards/
    │   │   ├── jwt-auth.guard.ts
    │   │   └── roles.guard.ts
    │   └── dto/
    │       └── auth.dto.ts
    └── system/                # 系统模块
        ├── system.module.ts
        ├── role.service.ts
        ├── role.controller.ts
        ├── menu.service.ts
        └── menu.controller.ts
```

### 数据库 Schema (`packages/prisma/`)

```
packages/prisma/
├── schema.prisma              # 数据库模型定义（45+ 模型）
├── seed.ts                    # 种子数据
└── migrations/                # 迁移文件（自动生成）
```

---

## API 接口

### 认证接口

| 方法   | 路径                 | 说明           | 认证 |
| ------ | -------------------- | -------------- | ---- |
| POST   | /auth/admin/login    | 管理员登录     | ❌   |
| GET    | /auth/admin/info     | 获取管理员信息 | ✅   |
| GET    | /auth/admin/list     | 管理员列表     | ✅   |
| POST   | /auth/admin          | 创建管理员     | ✅   |
| PUT    | /auth/admin/:id      | 更新管理员     | ✅   |
| PUT    | /auth/admin/password | 修改密码       | ✅   |
| DELETE | /auth/admin/:id      | 删除管理员     | ✅   |
| POST   | /auth/admin/logout   | 退出登录       | ✅   |

### 角色管理

| 方法   | 路径              | 说明     |
| ------ | ----------------- | -------- |
| GET    | /system/role/list | 角色列表 |
| GET    | /system/role/all  | 所有角色 |
| GET    | /system/role/:id  | 角色详情 |
| POST   | /system/role      | 创建角色 |
| PUT    | /system/role/:id  | 更新角色 |
| DELETE | /system/role/:id  | 删除角色 |

### 菜单管理

| 方法   | 路径              | 说明             |
| ------ | ----------------- | ---------------- |
| GET    | /system/menu/list | 菜单列表（树形） |
| GET    | /system/menu/all  | 所有菜单         |
| POST   | /system/menu      | 创建菜单         |
| PUT    | /system/menu/:id  | 更新菜单         |
| DELETE | /system/menu/:id  | 删除菜单         |

---

## 开发阶段

- [x] Phase 1: 项目脚手架 + 核心基础
- [ ] Phase 2: 核心业务模块（用户、商品、订单）
- [ ] Phase 3: 营销 + 分销
- [ ] Phase 4: 扩展功能
- [ ] Phase 5: 移动端
- [ ] Phase 6: 联调 + 部署

---

## 常见问题

### 1. 数据库连接失败

检查 `.env.development` 中的 `DATABASE_URL` 配置：

```bash
DATABASE_URL="mysql://root:your_password@localhost:3306/xiaoji_dev"
```

### 1.1 MySQL 命令执行没有反应

确保：

1. MySQL 服务已启动（在 Windows 服务管理器中查看）
2. `-p` 和密码之间**不要有空格**
3. 使用正确的密码

```bash
# 正确写法
mysql -u root -p1234567 -e "SELECT 1"

# 错误写法（会卡住等待输入）
mysql -u root -p 1234567 -e "SELECT 1"
```

### 2. Prisma Client 未找到

```bash
pnpm --filter @xiaoji/prisma generate
```

### 3. 种子数据重复执行报错

```bash
pnpm --filter @xiaoji/prisma migrate:reset
pnpm --filter @xiaoji/prisma migrate:dev -- --name init
pnpm run db:seed:dev

```

### 4. 端口被占用

修改 `.env.development` 中的端口：

```bash
APP_PORT=7002
```

### 5. Redis 未安装

开发环境可禁用缓存：

```bash
CACHE_ENABLED=false
RATE_LIMIT_ENABLED=false
```

---

## License

MIT
