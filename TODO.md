# xiaoji 项目待完成事项

## 🔴 需要外部服务配置

### 1. 支付接入
- [ ] 微信支付：需要商户号、APIv3 密钥、证书序列号
- [ ] 支付宝支付：需要应用 PID、应用公钥、支付宝公钥
- [ ] 实现支付回调接口（`POST /pay/wechat/notify`, `POST /pay/alipay/notify`）
- [ ] 实现退款接口（微信/支付宝退款 API）
- [ ] 支付结果通知 WebSocket 推送

**参考代码位置**：
- 后端: `apps/api/src/modules/` (待创建 `pay/` 模块)
- 配置: `apps/api/.env.production` 中的 `PAY_ENV`, `WECHAT_ENV`
- CRMEB 参考: `D:\WorkSpace\Github-Projects\CRMEB\crmeb\crmeb\services\pay\storage\`

### 2. 短信服务接入
- [ ] 选择短信服务商（阿里云/腾讯云）
- [ ] 获取 Access Key / Secret Key
- [ ] 配置短信签名和模板
- [ ] 实现发送短信接口
- [ ] 短信验证码发送和校验

**配置位置**：
- 后端: `apps/api/.env.production` 中的短信相关配置
- CRMEB 参考: `D:\WorkSpace\Github-Projects\CRMEB\crmeb\crmeb\services\sms\storage\`

### 3. 对象存储接入（OSS）
- [ ] 选择存储服务商（阿里云 OSS / 腾讯 COS / 七牛云）
- [ ] 创建 Bucket、获取 Access Key
- [ ] 配置 CDN 域名（可选）
- [ ] 实现文件上传到 OSS
- [ ] 实现 OSS 图片处理（缩放、水印）

**配置位置**：
- 后端: `apps/api/.env.production` 中的 `STORAGE_*` 配置
- 管理后台: `apps/admin/src/views/setting/storage/index.vue`
- CRMEB 参考: `D:\WorkSpace\Github-Projects\CRMEB\crmeb\crmeb\services\upload\storage\`

### 4. 微信公众号/小程序配置
- [ ] 微信公众号 AppID、AppSecret
- [ ] 微信小程序 AppID、AppSecret
- [ ] 消息校验 Token、EncodingAESKey
- [ ] 微信 OAuth2.0 网页授权
- [ ] 微信模板消息推送
- [ ] 小程序订阅消息

**配置位置**：
- 后端: `apps/api/.env.production` 中的 `WECHAT_*` 配置
- 管理后台: `apps/admin/src/views/setting/app/index.vue`

---

## 🟡 可选增强功能

### 5. Docker 部署配置
- [ ] 编写 `Dockerfile` (apps/api/, apps/admin/)
- [ ] 编写 `docker-compose.yml` (开发环境)
- [ ] 编写 `docker-compose.prod.yml` (生产环境)
- [ ] 编写 Nginx 配置
- [ ] 编写数据库初始化 SQL
- [ ] 编写 Redis 配置

**参考**: `D:\WorkSpace\Github-Projects\xiaoji\xiaoji\docs\PROJECT_PLAN.md` 中的 Docker 配置章节

### 6. WebSocket 客服聊天
- [ ] 客服消息数据模型（需要新建 Prisma 模型）
- [ ] 客服分配逻辑
- [ ] 消息已读状态
- [ ] 客服转接
- [ ] 离线消息存储

### 7. 接入日志系统
- [ ] 集成 Winston 日志框架
- [ ] 配置日志文件轮转
- [ ] 接入 Sentry 错误监控（可选）

### 8. 性能优化
- [ ] Redis 缓存热点数据
- [ ] 接口限流优化（Redis-based）
- [ ] 数据库查询优化（添加索引）
- [ ] 前端资源 CDN 加速

---

## 🟢 已完成

### 后端 API (15 个模块)
- ✅ Auth (JWT + RBAC)
- ✅ System (管理员/角色/菜单/配置/日志/门店/店员/协议/存储/定时任务)
- ✅ User (用户/地址/分组/标签/等级)
- ✅ Product (商品/分类/属性/标签/评价)
- ✅ Order (订单/退款/发票)
- ✅ Marketing (优惠券/秒杀/拼团/砍价/积分/签到/预售)
- ✅ Agent (分销等级/申请)
- ✅ Finance (账单/提现/佣金/资金流水/充值)
- ✅ CMS (文章/分类)
- ✅ Statistic (仪表盘/交易/商品/用户/订单统计)
- ✅ Shipping (运费模板/快递公司)
- ✅ Upload (文件上传)
- ✅ WebSocket (Socket.IO 网关)
- ✅ Queue (内存任务队列)
- ✅ WeChat (用户/二维码/回复/素材/消息/密钥)
- ✅ DIY (模板/主题)

### 管理后台 (78 个页面)
- ✅ Dashboard
- ✅ Product (7 页: 列表/表单/分类/属性/评价/参数/标签/服务保障)
- ✅ Order (6 页: 列表/详情/退款/发票/离线/打印)
- ✅ User (6 页: 列表/等级/分组/标签/会员等级/注销)
- ✅ Marketing (10 页: 优惠券/发放/领券/秒杀/拼团/砍价/积分/积分订单/签到/预售)
- ✅ Finance (5 页: 余额/佣金/提现/资金流水/充值)
- ✅ Agent (5 页: 列表/申请/部门/员工/推广)
- ✅ CMS (2 页: 文章列表/文章编辑)
- ✅ Statistic (5 页: 交易/商品/用户/订单/余额)
- ✅ Setting (13 页: 系统/管理员/角色/菜单/门店/运费/快递/店员/会员/存储/协议/核销/应用)
- ✅ System (4 页: 日志/备份/定时任务/文件管理)
- ✅ App (5 页: 微信菜单/自动回复/图文/小程序包/版本)
- ✅ DIY (3 页: 模板列表/编辑器/主题)

### UniApp 移动端 (30 页 + 5 组件)
- ✅ 首页/分类/购物车/用户中心
- ✅ 商品: 详情/列表/搜索/评价/物流/退款/退货/支付结果
- ✅ 订单: 确认/详情/列表/收银台
- ✅ 用户: 登录/地址/积分/签到/账单/提现
- ✅ 活动: 秒杀/拼团/砍价
- ✅ 积分商城/文章
- ✅ 组件: ProductCard/Empty/PriceDisplay/LoadMore/SKUSelector

### Prisma Schema (50+ 模型)
- ✅ 全部数据模型已定义

---

## 📋 部署检查清单

### 环境变量配置
```bash
# 支付配置
PAY_ENV=sandbox  # sandbox 或 production
WECHAT_PAY_MCH_ID=
WECHAT_PAY_API_V3_KEY=
WECHAT_PAY_CERT_SERIAL_NO=
ALIPAY_APP_ID=
ALIPAY_PRIVATE_KEY=

# 短信配置
SMS_PROVIDER=aliyun  # aliyun 或 tencent
SMS_ACCESS_KEY=
SMS_SECRET_KEY=
SMS_SIGN_NAME=
SMS_TEMPLATE_CODE=

# 存储配置
STORAGE_DRIVER=oss  # local 或 oss
STORAGE_OSS_BUCKET=
STORAGE_OSS_ACCESS_KEY=
STORAGE_OSS_SECRET_KEY=
STORAGE_OSS_ENDPOINT=
STORAGE_OSS_CDN=

# 微信配置
WECHAT_APP_ID=
WECHAT_APP_SECRET=
WECHAT_TOKEN=
WECHAT_ENCODING_AES_KEY=
WECHAT_MINI_APP_ID=
WECHAT_MINI_APP_SECRET=

# 数据库
DATABASE_URL="mysql://user:password@localhost:3306/xiaoji_prod"

# Redis
REDIS_URL="redis://localhost:6379/0"

# JWT
JWT_SECRET="生成一个强随机密钥"
```

### 部署步骤
1. 配置所有环境变量
2. 运行 `npx prisma migrate deploy`
3. 运行 `pnpm build`
4. 启动服务: `node apps/api/dist/main.js`
5. 部署管理后台静态文件到 Nginx
6. 配置 SSL 证书
7. 配置域名解析
