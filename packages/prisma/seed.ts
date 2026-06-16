import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// 加载 .env.development
const envPath = path.resolve(__dirname, '../../.env.development');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex).trim();
        let value = trimmed.substring(eqIndex + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

const prisma = new PrismaClient();

// 时间戳工具
const now = BigInt(Date.now());
const daysAgo = (d: number) => now - BigInt(d * 86400000);
const hoursAgo = (h: number) => now - BigInt(h * 3600000);
const minutesAgo = (m: number) => now - BigInt(m * 60000);

// 占位图
const img = (n: number) => `https://picsum.photos/200/200?random=${n}`;
const avatarImg = (n: number) => `https://picsum.photos/100/100?random=${n + 100}`;

// password 的 bcrypt hash
const PWD_HASH = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

async function main() {
  console.log('🌱 Seeding database...');

  // ========== 清除旧数据（幂等：重复执行不会产生重复数据） ==========
  console.log('🧹 Cleaning existing data...');
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0');
  const seededTables = [
    'xj_store_product_reply',
    'xj_division_agent_apply',
    'xj_store_integral',
    'xj_store_bargain',
    'xj_store_combination',
    'xj_store_seckill',
    'xj_store_coupon_issue',
    'xj_store_coupon_user',
    'xj_store_coupon',
    'xj_store_order_refund',
    'xj_store_order_cart_info',
    'xj_store_order_invoice',
    'xj_store_order',
    'xj_user_extract',
    'xj_user_bill',
    'xj_user',
    'xj_system_config',
    'xj_system_config_tab',
    'xj_system_store',
    'xj_express',
    'xj_shipping_templates',
    'xj_article',
    'xj_article_category',
    'xj_store_product_attr_value',
    'xj_store_product_attr_result',
    'xj_store_product',
    'xj_store_product_label',
    'xj_store_category',
    'xj_user_label',
    'xj_user_group',
    'xj_system_sign_reward',
    'xj_agent_level',
    'xj_user_level',
    'xj_system_menus',
    'xj_system_admin',
    'xj_system_role',
  ];
  for (const table of seededTables) {
    await prisma.$executeRawUnsafe(`DELETE FROM \`${table}\``);
    await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` AUTO_INCREMENT = 1`);
  }
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1');
  console.log('✅ Cleaned all data');

  // ========== 基础数据（原有） ==========

  // 角色
  const role = await prisma.systemRole.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: '超级管理员',
      status: 1,
      rules: '[]',
      addTime: now,
    },
  });
  console.log('✅ Created role:', role.name);

  // 超级管理员
  const admin = await prisma.systemAdmin.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      account: 'admin',
      realName: '超级管理员',
      pwd: PWD_HASH,
      roleId: 1,
      level: 0,
      status: 1,
      addTime: now,
    },
  });
  console.log('✅ Created admin:', admin.account);

  // 菜单
  const menus = [
    { pid: 0, title: '首页', icon: 'HomeOutlined', path: '/dashboard', component: 'dashboard/index', sort: 1 },
    { pid: 0, title: '商品管理', icon: 'ShoppingOutlined', path: '/product', component: '', sort: 2 },
    { pid: 0, title: '订单管理', icon: 'OrderedListOutlined', path: '/order', component: '', sort: 3 },
    { pid: 0, title: '用户管理', icon: 'UserOutlined', path: '/user', component: '', sort: 4 },
    { pid: 0, title: '营销管理', icon: 'GiftOutlined', path: '/marketing', component: '', sort: 5 },
    { pid: 0, title: '财务管理', icon: 'MoneyCollectOutlined', path: '/finance', component: '', sort: 6 },
    { pid: 0, title: '分销管理', icon: 'ShareAltOutlined', path: '/agent', component: '', sort: 7 },
    { pid: 0, title: '内容管理', icon: 'FileTextOutlined', path: '/cms', component: '', sort: 8 },
    { pid: 0, title: '数据统计', icon: 'BarChartOutlined', path: '/statistic', component: '', sort: 9 },
    { pid: 0, title: '系统设置', icon: 'SettingOutlined', path: '/setting', component: '', sort: 10 },
  ];
  for (const menu of menus) {
    await prisma.systemMenus.create({
      data: { ...menu, status: 1, isShow: 1, addTime: now },
    });
  }
  console.log('✅ Created menus');

  // 商品分类
  const categories = [
    { name: '手机数码', sort: 1, isShow: 1, isHome: 1 },
    { name: '电脑办公', sort: 2, isShow: 1, isHome: 1 },
    { name: '家用电器', sort: 3, isShow: 1, isHome: 1 },
    { name: '服饰鞋包', sort: 4, isShow: 1, isHome: 1 },
    { name: '食品饮料', sort: 5, isShow: 1, isHome: 1 },
    { name: '美妆个护', sort: 6, isShow: 1, isHome: 1 },
  ];
  for (const c of categories) {
    await prisma.storeCategory.create({
      data: { ...c, pid: 0, icon: '', image: '', addTime: now },
    });
  }
  console.log('✅ Created categories');

  // 用户等级
  const levels = [
    { name: '普通用户', grade: 0, oneBrokeragePercent: 0, twoBrokeragePercent: 0, taskTotalNum: 0, taskNum: 0, isSpecial: 0 },
    { name: 'VIP会员', grade: 1, oneBrokeragePercent: 5, twoBrokeragePercent: 2, taskTotalNum: 100, taskNum: 0, isSpecial: 0 },
    { name: 'SVIP会员', grade: 2, oneBrokeragePercent: 8, twoBrokeragePercent: 3, taskTotalNum: 500, taskNum: 0, isSpecial: 0 },
  ];
  for (const l of levels) {
    await prisma.userLevel.create({
      data: { ...l, image: '', status: 1, addTime: now },
    });
  }
  console.log('✅ Created user levels');

  // 分销等级
  const agentLevels = [
    { name: '普通分销', oneBrokerage: 10, twoBrokerage: 5 },
    { name: '高级分销', oneBrokerage: 15, twoBrokerage: 8 },
    { name: '金牌分销', oneBrokerage: 20, twoBrokerage: 10 },
  ];
  for (const l of agentLevels) {
    await prisma.agentLevel.create({
      data: { ...l, image: '', sort: 0, status: 1, addTime: now },
    });
  }
  console.log('✅ Created agent levels');

  // 签到奖励
  for (let d = 1; d <= 7; d++) {
    await prisma.systemSignReward.create({
      data: { day: d, number: 5 * d + 5, type: 1, status: 1, sort: d },
    });
  }
  console.log('✅ Created sign rewards');

  // ========== 新增数据 ==========

  // 1. 用户分组
  const groups = await Promise.all([
    prisma.userGroup.create({ data: { name: '普通用户', image: '', sort: 1, status: 1, isShow: 1, addTime: now } }),
    prisma.userGroup.create({ data: { name: 'VIP用户', image: '', sort: 2, status: 1, isShow: 1, addTime: now } }),
    prisma.userGroup.create({ data: { name: '超级会员', image: '', sort: 3, status: 1, isShow: 1, addTime: now } }),
  ]);
  console.log('✅ Created user groups');

  // 2. 用户标签
  const labels = await Promise.all([
    prisma.userLabel.create({ data: { name: '高消费', color: '#f5222d', sort: 1, status: 1, addTime: now } }),
    prisma.userLabel.create({ data: { name: '活跃用户', color: '#52c41a', sort: 2, status: 1, addTime: now } }),
    prisma.userLabel.create({ data: { name: '新注册', color: '#1890ff', sort: 3, status: 1, addTime: now } }),
    prisma.userLabel.create({ data: { name: '流失风险', color: '#faad14', sort: 4, status: 1, addTime: now } }),
    prisma.userLabel.create({ data: { name: '分销员', color: '#722ed1', sort: 5, status: 1, addTime: now } }),
  ]);
  console.log('✅ Created user labels');

  // 3. 商品属性标签
  const productLabels = await Promise.all([
    prisma.storeProductLabel.create({ data: { name: '颜色', sort: 1, status: 1, addTime: now } }),
    prisma.storeProductLabel.create({ data: { name: '尺码', sort: 2, status: 1, addTime: now } }),
    prisma.storeProductLabel.create({ data: { name: '材质', sort: 3, status: 1, addTime: now } }),
    prisma.storeProductLabel.create({ data: { name: '款式', sort: 4, status: 1, addTime: now } }),
  ]);
  console.log('✅ Created product labels');

  // 4. 商品（12个）
  const productsData = [
    { storeName: '鲜花定制款永生花礼盒', price: '168.00', otPrice: '199.00', stock: 500, sales: 326, isShow: 1, isHot: 1, isNew: 0, isBest: 0, cateId: JSON.stringify([1]) },
    { storeName: '高端进口巧克力礼盒装', price: '258.00', otPrice: '299.00', stock: 300, sales: 198, isShow: 1, isHot: 1, isNew: 1, isBest: 1, cateId: JSON.stringify([5]) },
    { storeName: '精美陶瓷茶具套装', price: '89.00', otPrice: '129.00', stock: 200, sales: 87, isShow: 1, isHot: 0, isNew: 0, isBest: 0, cateId: JSON.stringify([3]) },
    { storeName: '真丝围巾女士冬季款', price: '320.00', otPrice: '399.00', stock: 150, sales: 64, isShow: 1, isHot: 0, isNew: 1, isBest: 0, cateId: JSON.stringify([4]) },
    { storeName: '智能手环运动版', price: '199.00', otPrice: '269.00', stock: 400, sales: 412, isShow: 1, isHot: 1, isNew: 0, isBest: 1, cateId: JSON.stringify([1]) },
    { storeName: '天然蜂蜜农家自产', price: '68.00', otPrice: '89.00', stock: 600, sales: 523, isShow: 1, isHot: 0, isNew: 0, isBest: 0, cateId: JSON.stringify([5]) },
    { storeName: '手工皮具钱包', price: '158.00', otPrice: '199.00', stock: 100, sales: 45, isShow: 1, isHot: 0, isNew: 1, isBest: 0, cateId: JSON.stringify([4]) },
    { storeName: '蓝牙耳机降噪款', price: '299.00', otPrice: '399.00', stock: 350, sales: 287, isShow: 1, isHot: 1, isNew: 0, isBest: 1, cateId: JSON.stringify([1]) },
    { storeName: '保温杯大容量', price: '79.00', otPrice: '109.00', stock: 500, sales: 198, isShow: 1, isHot: 0, isNew: 0, isBest: 0, cateId: JSON.stringify([3]) },
    { storeName: '瑜伽垫加厚防滑', price: '45.00', otPrice: '69.00', stock: 300, sales: 76, isShow: 1, isHot: 0, isNew: 0, isBest: 0, cateId: JSON.stringify([3]) },
    { storeName: '儿童益智积木套装', price: '128.00', otPrice: '168.00', stock: 250, sales: 0, isShow: 0, isHot: 0, isNew: 0, isBest: 0, cateId: JSON.stringify([3]) },
    { storeName: '老花镜折叠便携', price: '39.00', otPrice: '59.00', stock: 400, sales: 0, isShow: 0, isHot: 0, isNew: 0, isBest: 0, cateId: JSON.stringify([2]) },
  ];

  const products: { id: number }[] = [];
  for (let i = 0; i < productsData.length; i++) {
    const p = productsData[i];
    const created = await prisma.storeProduct.create({
      data: {
        merId: 0,
        cateId: p.cateId,
        storeName: p.storeName,
        storeInfo: `${p.storeName}，优质好物，品质保证`,
        image: img(i + 1),
        sliderImage: JSON.stringify([img(i + 1), img(i + 50)]),
        price: p.price,
        otPrice: p.otPrice,
        costPrice: '0.00',
        vipPrice: '0.00',
        vipProportion: 0,
        productType: 0,
        giveIntegral: 10,
        stock: p.stock,
        sales: p.sales,
        unitName: '件',
        sort: 10 - i,
        isShow: p.isShow,
        isHot: p.isHot,
        isNew: p.isNew,
        isBest: p.isBest,
        isGood: 0,
        isPostage: 0,
        isVip: 0,
        isGift: 0,
        brokerage: '0.00',
        brokerageTwo: '0.00',
        specType: 1,
        weight: '0.00',
        volume: '0.00',
        postage: '0.00',
        freight: 2,
        tempId: 0,
        logistics: '[]',
        minQty: 1,
        isLimit: 0,
        limitType: 1,
        limitNum: 0,
        keyword: '',
        commandWord: '',
        recommendImage: '',
        labelId: '[]',
        couponIds: '[]',
        activity: '[]',
        virtualType: 0,
        isVirtual: 0,
        fictitiousContent: '',
        presale: 0,
        presaleTime: '[]',
        presaleDay: 0,
        protectionList: '[]',
        addTime: daysAgo(30 - i * 2),
        status: 1,
        isDel: 0,
      },
    });
    products.push(created);
  }
  console.log('✅ Created 12 products');

  // 5. 商品SKU变体（每个商品2个）
  for (const p of products) {
    const basePrice = Number(productsData[products.indexOf(p)]?.price || '50');
    await prisma.storeProductAttrValue.createMany({
      data: [
        {
          productId: p.id,
          sku: '默认',
          unique: `attr_${p.id}_1`,
          image: '',
          price: String(basePrice.toFixed(2)),
          vipPrice: '0.00',
          costPrice: '0.00',
          otPrice: '0.00',
          stock: Math.round(productsData[products.indexOf(p)]?.stock / 2 || 50),
          barCode: '',
          weight: '0.00',
          volume: '0.00',
          isShow: 1,
          fictitious: '',
          productAttrUnique: `attr_${p.id}_1`,
        },
        {
          productId: p.id,
          sku: '升级款',
          unique: `attr_${p.id}_2`,
          image: '',
          price: String((basePrice * 1.2).toFixed(2)),
          vipPrice: '0.00',
          costPrice: '0.00',
          otPrice: '0.00',
          stock: Math.round(productsData[products.indexOf(p)]?.stock / 2 || 50),
          barCode: '',
          weight: '0.00',
          volume: '0.00',
          isShow: 1,
          fictitious: '',
          productAttrUnique: `attr_${p.id}_2`,
        },
      ],
    });
  }
  console.log('✅ Created 24 product attr values');

  // 6. 文章分类
  const articleCategories = await Promise.all([
    prisma.articleCategory.create({ data: { name: '公司动态', pid: 0, sort: 1, status: 1, addTime: now } }),
    prisma.articleCategory.create({ data: { name: '产品资讯', pid: 0, sort: 2, status: 1, addTime: now } }),
    prisma.articleCategory.create({ data: { name: '行业资讯', pid: 0, sort: 3, status: 1, addTime: now } }),
    prisma.articleCategory.create({ data: { name: '帮助中心', pid: 0, sort: 4, status: 1, addTime: now } }),
    prisma.articleCategory.create({ data: { name: '购物指南', pid: 0, sort: 5, status: 1, addTime: now } }),
  ]);
  console.log('✅ Created article categories');

  // 7. 文章（10篇）
  const articlesData = [
    { cid: 1, title: '小吉商城正式上线运营', author: '运营团队', visit: 1256, status: 1 },
    { cid: 1, title: '公司搬迁至新办公地址通知', author: '行政部', visit: 832, status: 1 },
    { cid: 2, title: '新品发布：智能手环运动版上市', author: '产品部', visit: 3200, status: 1 },
    { cid: 2, title: '春季新品预览：真丝围巾系列', author: '产品部', visit: 1580, status: 1 },
    { cid: 3, title: '电商行业2026年趋势分析', author: '行业研究', visit: 4500, status: 1 },
    { cid: 3, title: '社交电商新模式：拼团与砍价', author: '行业研究', visit: 2100, status: 0 },
    { cid: 4, title: '如何申请退款退货？', author: '客服部', visit: 5200, status: 1 },
    { cid: 4, title: '账户安全设置指南', author: '技术部', visit: 1800, status: 1 },
    { cid: 5, title: '新人购物攻略：首单优惠详解', author: '运营团队', visit: 3600, status: 1 },
    { cid: 5, title: '积分商城使用说明', author: '运营团队', visit: 900, status: 0 },
  ];
  for (const a of articlesData) {
    await prisma.article.create({
      data: {
        cid: a.cid,
        title: a.title,
        author: a.author,
        imageInput: img(a.cid + 20),
        content: `<p>${a.title}的详细内容。</p><p>这里是正文部分，包含更多详细信息。</p>`,
        digest: `${a.title}的简要介绍`,
        visit: a.visit,
        sort: 0,
        status: a.status,
        isHot: a.visit > 3000 ? 1 : 0,
        isBest: 0,
        isNew: 1,
        addTime: daysAgo(Math.floor(Math.random() * 20)),
      },
    });
  }
  console.log('✅ Created 10 articles');

  // 8. 运费模板
  await prisma.shippingTemplate.createMany({
    data: [
      { name: '全国包邮', type: 1, appoint: 0, sort: 1, addTime: now },
      { name: '按件计费-标准', type: 1, appoint: 0, sort: 2, addTime: now },
      { name: '按重计费', type: 2, appoint: 0, sort: 3, addTime: now },
    ],
  });
  console.log('✅ Created shipping templates');

  // 9. 快递公司
  await prisma.express.createMany({
    data: [
      { name: '顺丰速运', code: 'SF', url: '', sort: 1, isShow: 1, addTime: now },
      { name: '圆通速递', code: 'YTO', url: '', sort: 2, isShow: 1, addTime: now },
      { name: '中通快递', code: 'ZTO', url: '', sort: 3, isShow: 1, addTime: now },
      { name: '韵达快递', code: 'YUNDA', url: '', sort: 4, isShow: 1, addTime: now },
      { name: '申通快递', code: 'STO', url: '', sort: 5, isShow: 1, addTime: now },
      { name: '百世快递', code: 'BEST', url: '', sort: 6, isShow: 0, addTime: now },
    ],
  });
  console.log('✅ Created express companies');

  // 10. 门店
  await prisma.systemStore.createMany({
    data: [
      { name: '旗舰店-朝阳区', phone: '010-88886666', address: '北京市朝阳区建国路88号', detailedAddress: '万达广场B座1层', latitude: 39.9087, longitude: 116.4716, dayTime: '09:00-21:00', isShow: 1, sort: 1, addTime: now, image: '' },
      { name: '体验店-海淀区', phone: '010-66668888', address: '北京市海淀区中关村大街1号', detailedAddress: '海龙大厦1层', latitude: 39.9812, longitude: 116.3105, dayTime: '10:00-20:00', isShow: 1, sort: 2, addTime: now, image: '' },
      { name: '仓储中心-大兴区', phone: '010-55557777', address: '北京市大兴区亦庄经济开发区', detailedAddress: '物流园A区', latitude: 39.7654, longitude: 116.5025, dayTime: '08:00-18:00', isShow: 0, sort: 3, addTime: now, image: '' },
    ],
  });
  console.log('✅ Created stores');

  // 11. 系统配置
  const configTabs = await Promise.all([
    prisma.systemConfigTab.create({ data: { name: '基础设置', status: 1 } }),
    prisma.systemConfigTab.create({ data: { name: '交易设置', status: 1 } }),
  ]);
  await prisma.systemConfig.createMany({
    data: [
      { tabId: configTabs[0].id, name: 'site_name', value: '小吉商城', type: 'text', info: '系统名称', status: 1 },
      { tabId: configTabs[0].id, name: 'site_logo', value: '', type: 'image', info: '系统Logo', status: 1 },
      { tabId: configTabs[0].id, name: 'site_phone', value: '400-888-8888', type: 'text', info: '客服电话', status: 1 },
      { tabId: configTabs[0].id, name: 'site_description', value: '小吉优选电商平台', type: 'text', info: '系统描述', status: 1 },
      { tabId: configTabs[1].id, name: 'order_auto_cancel', value: '30', type: 'number', info: '自动取消时间(分钟)', status: 1 },
      { tabId: configTabs[1].id, name: 'order_auto_confirm', value: '15', type: 'number', info: '自动确认收货(天)', status: 1 },
    ],
  });
  console.log('✅ Created system config');

  // 12. 追加角色
  const extraRoles = await Promise.all([
    prisma.systemRole.create({ data: { name: '内容编辑', status: 1, rules: JSON.stringify([1, 2, 3]), addTime: now } }),
    prisma.systemRole.create({ data: { name: '运营人员', status: 1, rules: JSON.stringify([1, 2, 4]), addTime: now } }),
  ]);
  console.log('✅ Created extra roles');

  // 13. 追加管理员
  for (const a of [
    { account: 'editor', realName: '编辑员小王', phone: '13800001111', roleId: extraRoles[0].id },
    { account: 'operator', realName: '运营小李', phone: '13800002222', roleId: extraRoles[1].id },
  ]) {
    await prisma.systemAdmin.upsert({
      where: { account: a.account },
      update: { realName: a.realName, phone: a.phone, roleId: a.roleId },
      create: { account: a.account, realName: a.realName, pwd: PWD_HASH, headPic: '', phone: a.phone, level: 1, roleId: a.roleId, status: 1, lastTime: 0, lastIp: '', addTime: daysAgo(25) },
    });
  }
  console.log('✅ Created extra admins');

  // 14. 用户（12个）
  const usersData = [
    { nickname: '张三', phone: '13800138001', sex: 1, level: 1, groupId: groups[0].id, agentLevel: 0, payCount: 15, payPrice: '2560.50', nowMoney: '256.50', brokeragePrice: '0.00', integral: 1200, status: 1 },
    { nickname: '李四', phone: '13900139002', sex: 1, level: 2, groupId: groups[1].id, agentLevel: 0, payCount: 42, payPrice: '8960.00', nowMoney: '1080.00', brokeragePrice: '320.00', integral: 3600, status: 1 },
    { nickname: '王小明', phone: '13700137003', sex: 1, level: 1, groupId: groups[0].id, agentLevel: 1, payCount: 8, payPrice: '1280.00', nowMoney: '120.00', brokeragePrice: '150.00', integral: 500, status: 1 },
    { nickname: '赵丽颖', phone: '13600136004', sex: 2, level: 2, groupId: groups[2].id, agentLevel: 0, payCount: 65, payPrice: '15600.00', nowMoney: '2300.00', brokeragePrice: '0.00', integral: 8900, status: 1 },
    { nickname: '陈伟', phone: '13500135005', sex: 1, level: 0, groupId: 0, agentLevel: 0, payCount: 3, payPrice: '320.00', nowMoney: '0.00', brokeragePrice: '0.00', integral: 50, status: 1 },
    { nickname: '刘洋', phone: '13400134006', sex: 1, level: 1, groupId: groups[0].id, agentLevel: 2, payCount: 28, payPrice: '5600.00', nowMoney: '560.00', brokeragePrice: '890.00', integral: 2100, status: 1 },
    { nickname: '孙悦', phone: '13300133007', sex: 2, level: 0, groupId: 0, agentLevel: 0, payCount: 0, payPrice: '0.00', nowMoney: '0.00', brokeragePrice: '0.00', integral: 0, status: 1 },
    { nickname: '周杰', phone: '13200132008', sex: 1, level: 1, groupId: groups[1].id, agentLevel: 1, payCount: 22, payPrice: '3800.00', nowMoney: '380.00', brokeragePrice: '210.00', integral: 1800, status: 0 },
    { nickname: '吴磊', phone: '13100131009', sex: 1, level: 2, groupId: groups[2].id, agentLevel: 0, payCount: 55, payPrice: '12500.00', nowMoney: '1650.00', brokeragePrice: '0.00', integral: 6200, status: 1 },
    { nickname: '郑爽', phone: '13000130010', sex: 2, level: 1, groupId: groups[0].id, agentLevel: 0, payCount: 12, payPrice: '1800.00', nowMoney: '200.00', brokeragePrice: '0.00', integral: 800, status: 1 },
    { nickname: '黄晓明', phone: '15800158011', sex: 1, level: 0, groupId: 0, agentLevel: 0, payCount: 1, payPrice: '68.00', nowMoney: '30.00', brokeragePrice: '0.00', integral: 100, status: 1 },
    { nickname: '林志玲', phone: '15900159012', sex: 2, level: 2, groupId: groups[1].id, agentLevel: 0, payCount: 38, payPrice: '7600.00', nowMoney: '890.00', brokeragePrice: '0.00', integral: 4500, status: 1 },
  ];

  const createdUsers: { uid: number; nickname: string; phone: string }[] = [];
  for (let i = 0; i < usersData.length; i++) {
    const u = usersData[i];
    const created = await prisma.user.create({
      data: {
        account: '',
        realName: u.nickname,
        nickname: u.nickname,
        avatar: avatarImg(i + 1),
        phone: u.phone,
        sex: u.sex,
        birthday: 0,
        cardId: '',
        mark: '',
        groupId: u.groupId,
        level: u.level,
        agentLevel: u.agentLevel,
        spreadOpen: u.agentLevel > 0 ? 1 : 0,
        spreadUid: 0,
        spreadTime: 0,
        userType: 'h5',
        isPromoter: u.agentLevel > 0 ? 1 : 0,
        payCount: u.payCount,
        payPrice: u.payPrice,
        nowMoney: u.nowMoney,
        brokeragePrice: u.brokeragePrice,
        integral: u.integral,
        exp: u.integral,
        signNum: Math.floor(Math.random() * 20),
        status: u.status,
        addTime: daysAgo(30 - i * 2),
        lastTime: daysAgo(Math.floor(Math.random() * 5)),
        lastIp: '127.0.0.1',
        partnerId: 0,
      },
    });
    createdUsers.push({ uid: created.uid, nickname: u.nickname, phone: u.phone });
  }
  console.log('✅ Created 12 users');

  // 15. 账单记录（15条）
  const billTypes = [
    { uid: 1, type: 1, tradingType: 1, number: '200.00', balance: '456.50', mark: '微信充值' },
    { uid: 2, type: 1, tradingType: 1, number: '500.00', balance: '1580.00', mark: '微信充值' },
    { uid: 1, type: 2, tradingType: 2, number: '-168.00', balance: '288.50', mark: '订单消费' },
    { uid: 2, type: 2, tradingType: 2, number: '-89.00', balance: '1080.00', mark: '订单消费' },
    { uid: 3, type: 4, tradingType: 1, number: '50.00', balance: '170.00', mark: '分销佣金' },
    { uid: 4, type: 1, tradingType: 1, number: '1000.00', balance: '3300.00', mark: '支付宝充值' },
    { uid: 4, type: 2, tradingType: 2, number: '-320.00', balance: '2300.00', mark: '订单消费' },
    { uid: 5, type: 2, tradingType: 2, number: '-45.00', balance: '45.00', mark: '订单消费' },
    { uid: 6, type: 3, tradingType: 1, number: '-300.00', balance: '560.00', mark: '提现到微信' },
    { uid: 6, type: 4, tradingType: 1, number: '120.00', balance: '860.00', mark: '分销佣金' },
    { uid: 9, type: 1, tradingType: 1, number: '2000.00', balance: '3650.00', mark: '微信充值' },
    { uid: 9, type: 2, tradingType: 2, number: '-299.00', balance: '1650.00', mark: '订单消费' },
    { uid: 10, type: 1, tradingType: 1, number: '100.00', balance: '300.00', mark: '微信充值' },
    { uid: 12, type: 1, tradingType: 1, number: '500.00', balance: '1390.00', mark: '微信充值' },
    { uid: 12, type: 2, tradingType: 2, number: '-500.00', balance: '890.00', mark: '订单消费' },
  ];
  for (let i = 0; i < billTypes.length; i++) {
    const b = billTypes[i];
    await prisma.userBill.create({
      data: {
        uid: b.uid,
        type: b.type,
        tradingType: b.tradingType,
        number: b.number,
        balance: b.balance,
        mark: b.mark,
        relationId: 0,
        addTime: daysAgo(30 - i),
      },
    });
  }
  console.log('✅ Created 15 user bills');

  // 16. 提现记录（5条）
  await prisma.userExtract.createMany({
    data: [
      { uid: 2, extractPrice: '500.00', extractType: 1, realName: '李四', extractInfo: '{"type":"wechat","account":"wxid_lisi"}', status: 1, addTime: daysAgo(12), mark: '' },
      { uid: 4, extractPrice: '1000.00', extractType: 1, realName: '赵丽颖', extractInfo: '{"type":"wechat","account":"wxid_zhaoli"}', status: 0, addTime: daysAgo(8), mark: '' },
      { uid: 6, extractPrice: '300.00', extractType: 2, realName: '刘洋', extractInfo: '{"type":"alipay","account":"13400134006"}', status: 2, addTime: daysAgo(10), mark: '银行卡信息不完整' },
      { uid: 9, extractPrice: '800.00', extractType: 1, realName: '吴磊', extractInfo: '{"type":"wechat","account":"wxid_wulei"}', status: 1, addTime: daysAgo(5), mark: '' },
      { uid: 2, extractPrice: '200.00', extractType: 1, realName: '李四', extractInfo: '{"type":"wechat","account":"wxid_lisi"}', status: 0, addTime: daysAgo(3), mark: '' },
    ],
  });
  console.log('✅ Created 5 user extracts');

  // 17. 订单（12个）— 覆盖所有状态
  const ordersData = [
    // status: 0 = 待付款
    { uid: 5, status: 0, paid: 0, totalPrice: '45.00', payPrice: '45.00', refundStatus: 0, payTime: 0, realName: '陈伟', userPhone: '13500135005', userAddress: '上海市浦东新区世纪大道100号', remark: '' },
    { uid: 11, status: 0, paid: 0, totalPrice: '39.00', payPrice: '39.00', refundStatus: 0, payTime: 0, realName: '黄晓明', userPhone: '15800158011', userAddress: '广州市天河区体育西路88号', remark: '请尽快发货' },
    // status: 1 = 待发货
    { uid: 1, status: 1, paid: 1, totalPrice: '168.00', payPrice: '148.00', refundStatus: 0, payTime: daysAgo(3), realName: '张三', userPhone: '13800138001', userAddress: '北京市朝阳区三里屯路19号', remark: '' },
    { uid: 3, status: 1, paid: 1, totalPrice: '199.00', payPrice: '199.00', refundStatus: 0, payTime: daysAgo(2), realName: '王小明', userPhone: '13700137003', userAddress: '深圳市南山区科技园南路12号', remark: '周末在家' },
    { uid: 7, status: 1, paid: 1, totalPrice: '89.00', payPrice: '89.00', refundStatus: 0, payTime: daysAgo(1), realName: '孙悦', userPhone: '13300133007', userAddress: '成都市锦江区春熙路99号', remark: '' },
    // status: 2 = 已发货
    { uid: 2, status: 2, paid: 1, totalPrice: '258.00', payPrice: '258.00', refundStatus: 0, payTime: daysAgo(8), realName: '李四', userPhone: '13900139002', userAddress: '杭州市西湖区文三路200号', deliveryType: 'sf', deliveryName: '顺丰速运', deliveryId: 'SF1234567890' },
    { uid: 4, status: 2, paid: 1, totalPrice: '320.00', payPrice: '270.00', refundStatus: 0, payTime: daysAgo(7), realName: '赵丽颖', userPhone: '13600136004', userAddress: '南京市玄武区中山路169号', deliveryType: 'sf', deliveryName: '顺丰速运', deliveryId: 'SF9876543210' },
    { uid: 10, status: 2, paid: 1, totalPrice: '79.00', payPrice: '79.00', refundStatus: 0, payTime: daysAgo(5), realName: '郑爽', userPhone: '13000130010', userAddress: '武汉市江汉区解放大道688号', deliveryType: 'yt', deliveryName: '圆通速递', deliveryId: 'YT1122334455' },
    // status: 3 = 已完成
    { uid: 6, status: 3, paid: 1, totalPrice: '68.00', payPrice: '68.00', refundStatus: 0, payTime: daysAgo(15), realName: '刘洋', userPhone: '13400134006', userAddress: '重庆市渝中区解放碑步行街8号', deliveryType: 'sf', deliveryName: '顺丰速运', deliveryId: 'SF5566778899' },
    { uid: 8, status: 3, paid: 1, totalPrice: '299.00', payPrice: '299.00', refundStatus: 0, payTime: daysAgo(12), realName: '周杰', userPhone: '13200132008', userAddress: '西安市雁塔区高新路56号', deliveryType: 'zto', deliveryName: '中通快递', deliveryId: 'ZT9988776655' },
    { uid: 9, status: 3, paid: 1, totalPrice: '158.00', payPrice: '138.00', refundStatus: 0, payTime: daysAgo(10), realName: '吴磊', userPhone: '13100131009', userAddress: '苏州市工业园区星湖街328号', deliveryType: 'yunda', deliveryName: '韵达快递', deliveryId: 'YD4455667788' },
    // status: -1 = 已取消
    { uid: 12, status: -1, paid: 0, totalPrice: '128.00', payPrice: '128.00', refundStatus: 0, payTime: 0, isCancel: 1, realName: '林志玲', userPhone: '15900159012', userAddress: '厦门市思明区中山路200号', remark: '' },
  ];

  const createdOrders: { id: number; orderId: string; uid: number; status: number }[] = [];
  for (let i = 0; i < ordersData.length; i++) {
    const o = ordersData[i];
    const orderId = `${Date.now()}${String(i).padStart(4, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    const created = await prisma.storeOrder.create({
      data: {
        orderId,
        uid: o.uid,
        totalPrice: o.totalPrice,
        payPrice: o.payPrice,
        payPostage: '0.00',
        couponPrice: o.payPrice !== o.totalPrice ? String((Number(o.totalPrice) - Number(o.payPrice)).toFixed(2)) : '0.00',
        useIntegral: 0,
        deductionPrice: '0.00',
        type: 0,
        status: o.status,
        paid: o.paid,
        refundStatus: o.refundStatus,
        refundType: 0,
        refundReason: '',
        refundExplain: '',
        refundImg: '',
        shippingType: 0,
        deliveryType: o.deliveryType || '',
        deliveryName: o.deliveryName || '',
        deliveryId: o.deliveryId || '',
        orderType: 0,
        realName: o.realName,
        userPhone: o.userPhone,
        userAddress: o.userAddress,
        storeId: 0,
        clerkId: 0,
        verifyCode: '',
        pinkId: 0,
        seckillId: 0,
        bargainId: 0,
        combinationId: 0,
        discountId: 0,
        advanceId: 0,
        mark: '',
        remark: o.remark,
        isCancel: o.isCancel || 0,
        isDel: 0,
        isGift: 0,
        giftUid: 0,
        giftMark: '',
        spreadUid: 0,
        spreadNickname: '',
        divisionName: '',
        addTime: daysAgo(ordersData.length - i),
        payTime: o.payTime,
        isPostage: 0,
        customForm: '',
        invoiceId: 0,
      },
    });
    createdOrders.push({ id: created.id, orderId: created.orderId, uid: o.uid, status: o.status });
  }
  console.log('✅ Created 12 orders');

  // 18. 订单商品（15条）
  const cartInfos: { orderId: string; productId: number; productNum: number; price: string; payPrice: string }[] = [];
  for (let i = 0; i < createdOrders.length; i++) {
    const o = createdOrders[i];
    const pid = (i % 10) + 1;
    const pPrice = productsData[pid - 1]?.price || '50.00';
    const qty = (i % 3) + 1;
    cartInfos.push({ orderId: o.orderId, productId: pid, productNum: qty, price: pPrice, payPrice: pPrice });
    // 部分订单添加第二个商品
    if (i % 3 === 0 && pid + 1 <= 12) {
      const p2Price = productsData[pid]?.price || '60.00';
      cartInfos.push({ orderId: o.orderId, productId: pid + 1, productNum: 1, price: p2Price, payPrice: p2Price });
    }
  }
  for (let i = 0; i < cartInfos.length; i++) {
    const c = cartInfos[i];
    await prisma.storeOrderCartInfo.create({
      data: {
        orderId: c.orderId,
        productId: c.productId,
        cartId: 0,
        productNum: c.productNum,
        price: c.price,
        totalNum: c.productNum,
        payPrice: c.payPrice,
        refundNum: 0,
        unique: `cart_${i}`,
        isGift: 0,
      },
    });
  }
  console.log('✅ Created order cart infos');

  // 19. 退款记录（3条）
  const refundOrders = createdOrders.filter(o => o.status === 3 || o.status === 2).slice(0, 3);
  if (refundOrders.length >= 3) {
    await prisma.storeOrderRefund.createMany({
      data: [
        { orderId: refundOrders[0].orderId, uid: refundOrders[0].uid, refundOrderId: 'RF20260601001', status: 0, refundType: 1, refundReason: '商品质量问题', refundPrice: '89.00', refundExplain: '收到的商品有破损', refundImg: '', refundExpress: '', refundExpressName: '', refundPhone: '', addTime: daysAgo(5), refundTime: 0 },
        { orderId: refundOrders[1].orderId, uid: refundOrders[1].uid, refundOrderId: 'RF20260603002', status: 1, refundType: 1, refundReason: '不想要了', refundPrice: '68.00', refundExplain: '买错了，申请退款', refundImg: '', refundExpress: '', refundExpressName: '', refundPhone: '', addTime: daysAgo(8), refundTime: daysAgo(7) },
        { orderId: refundOrders[2].orderId, uid: refundOrders[2].uid, refundOrderId: 'RF20260605003', status: 2, refundType: 1, refundReason: '与描述不符', refundPrice: '199.00', refundExplain: '颜色和图片不一样', refundImg: '', refundExpress: 'SF1234567890', refundExpressName: '顺丰速运', refundPhone: '13000130010', addTime: daysAgo(3), refundTime: daysAgo(2) },
      ],
    });
  }
  console.log('✅ Created 3 order refunds');

  // 20. 优惠券（5张）
  const coupons = await Promise.all([
    prisma.storeCoupon.create({ data: { title: '新人专享满100减20', type: 1, value: '20.00', minPrice: '100.00', isSub: 0, isShow: 1, status: 1, sort: 1, useType: 1, categoryIds: '[]', productIds: '[]', startTime: daysAgo(30), endTime: daysAgo(-30), addTime: daysAgo(30) } }),
    prisma.storeCoupon.create({ data: { title: '全场满200减50', type: 1, value: '50.00', minPrice: '200.00', isSub: 0, isShow: 1, status: 1, sort: 2, useType: 1, categoryIds: '[]', productIds: '[]', startTime: daysAgo(20), endTime: daysAgo(-10), addTime: daysAgo(20) } }),
    prisma.storeCoupon.create({ data: { title: '限时9折券', type: 2, value: '9.00', minPrice: '0.00', isSub: 0, isShow: 1, status: 1, sort: 3, useType: 1, categoryIds: '[]', productIds: '[]', startTime: daysAgo(15), endTime: daysAgo(-15), addTime: daysAgo(15) } }),
    prisma.storeCoupon.create({ data: { title: '会员专享满500减100', type: 1, value: '100.00', minPrice: '500.00', isSub: 0, isShow: 1, status: 0, sort: 4, useType: 1, categoryIds: '[]', productIds: '[]', startTime: daysAgo(10), endTime: daysAgo(-5), addTime: daysAgo(10) } }),
    prisma.storeCoupon.create({ data: { title: '无门槛10元券', type: 3, value: '10.00', minPrice: '0.00', isSub: 0, isShow: 1, status: 1, sort: 5, useType: 1, categoryIds: '[]', productIds: '[]', startTime: daysAgo(5), endTime: daysAgo(-25), addTime: daysAgo(5) } }),
  ]);
  console.log('✅ Created 5 coupons');

  // 21. 优惠券发行
  for (const c of coupons) {
    await prisma.storeCouponIssue.create({
      data: {
        couponId: c.id,
        couponType: 0,
        useMinPrice: c.minPrice,
        endTime: c.endTime,
        isPermanent: 1,
        stayLimit: 0,
        type: 1,
        giveType: 1,
        status: 1,
        used: Math.floor(Math.random() * 50),
        received: Math.floor(Math.random() * 100),
      },
    });
  }
  console.log('✅ Created coupon issues');

  // 22. 秒杀活动（4个）
  await prisma.storeSeckill.createMany({
    data: [
      { title: '鲜花礼盒秒杀', activityName: '618秒杀', image: img(30), price: '68.00', costPrice: '40.00', productPrice: '168.00', stock: 100, quota: 50, total: 23, sort: 1, status: 1, productId: 1, startTime: daysAgo(7), endTime: daysAgo(-3), addTime: daysAgo(10) },
      { title: '蓝牙耳机限时抢', activityName: '周末特惠', image: img(31), price: '99.00', costPrice: '60.00', productPrice: '299.00', stock: 200, quota: 100, total: 67, sort: 2, status: 1, productId: 8, startTime: daysAgo(3), endTime: daysAgo(-4), addTime: daysAgo(5) },
      { title: '巧克力礼盒特价', activityName: '节日促销', image: img(32), price: '128.00', costPrice: '80.00', productPrice: '258.00', stock: 50, quota: 30, total: 30, sort: 3, status: 0, productId: 2, startTime: daysAgo(20), endTime: daysAgo(10), addTime: daysAgo(25) },
      { title: '智能手环闪购', activityName: '会员日', image: img(33), price: '99.00', costPrice: '55.00', productPrice: '199.00', stock: 150, quota: 80, total: 0, sort: 4, status: 1, productId: 5, startTime: daysAgo(1), endTime: daysAgo(-6), addTime: daysAgo(2) },
    ],
  });
  console.log('✅ Created 4 seckill activities');

  // 23. 拼团活动（3个）
  await prisma.storeCombination.createMany({
    data: [
      { title: '陶瓷茶具拼团', image: img(34), info: '精美陶瓷茶具，3人成团', price: '59.00', otPrice: '89.00', costPrice: '30.00', peopleNum: 3, quota: 100, total: 45, sort: 1, isShow: 1, productId: 3, startTime: daysAgo(10), endTime: daysAgo(-5), addTime: daysAgo(12) },
      { title: '蜂蜜拼团特惠', image: img(35), info: '天然蜂蜜，2人成团', price: '39.00', otPrice: '68.00', costPrice: '20.00', peopleNum: 2, quota: 200, total: 120, sort: 2, isShow: 1, productId: 6, startTime: daysAgo(7), endTime: daysAgo(-7), addTime: daysAgo(8) },
      { title: '瑜伽垫拼团', image: img(36), info: '加厚防滑瑜伽垫，5人成团', price: '29.00', otPrice: '45.00', costPrice: '15.00', peopleNum: 5, quota: 150, total: 0, sort: 3, isShow: 0, productId: 10, startTime: daysAgo(15), endTime: daysAgo(5), addTime: daysAgo(18) },
    ],
  });
  console.log('✅ Created 3 combination activities');

  // 24. 砍价活动（3个）
  await prisma.storeBargain.createMany({
    data: [
      { title: '真丝围巾砍价', image: img(37), price: '1.00', costPrice: '100.00', productPrice: '320.00', minPrice: '99.00', bargainStock: 50, quota: 30, total: 12, sort: 1, status: 1, productId: 4, startTime: daysAgo(10), endTime: daysAgo(-5), addTime: daysAgo(12), rule: '每位用户可邀请好友帮砍', countPeopleAll: 85, countPeopleHelp: 230, countPeopleSuccess: 8 },
      { title: '手工钱包砍价', image: img(38), price: '1.00', costPrice: '50.00', productPrice: '158.00', minPrice: '49.00', bargainStock: 80, quota: 50, total: 25, sort: 2, status: 1, productId: 7, startTime: daysAgo(5), endTime: daysAgo(-10), addTime: daysAgo(7), rule: '砍价到底价即可购买', countPeopleAll: 120, countPeopleHelp: 350, countPeopleSuccess: 20 },
      { title: '保温杯砍价', image: img(39), price: '1.00', costPrice: '30.00', productPrice: '79.00', minPrice: '19.00', bargainStock: 100, quota: 60, total: 0, sort: 3, status: 0, productId: 9, startTime: daysAgo(20), endTime: daysAgo(10), addTime: daysAgo(22), rule: '限时砍价活动', countPeopleAll: 0, countPeopleHelp: 0, countPeopleSuccess: 0 },
    ],
  });
  console.log('✅ Created 3 bargain activities');

  // 25. 积分商品（3个）
  await prisma.storeIntegral.createMany({
    data: [
      { title: '积分兑换-精美钥匙扣', image: img(40), price: 500, costPrice: '5.00', vipPrice: '0.00', stock: 200, quota: 100, total: 45, sales: 45, sort: 1, status: 1, productId: 9, addTime: daysAgo(15) },
      { title: '积分兑换-定制马克杯', image: img(41), price: 1200, costPrice: '15.00', vipPrice: '0.00', stock: 100, quota: 50, total: 18, sales: 18, sort: 2, status: 1, productId: 3, addTime: daysAgo(10) },
      { title: '积分兑换-蓝牙音箱', image: img(42), price: 3000, costPrice: '80.00', vipPrice: '0.00', stock: 50, quota: 20, total: 0, sales: 0, sort: 3, status: 0, productId: 8, addTime: daysAgo(5) },
    ],
  });
  console.log('✅ Created 3 integral products');

  // 26. 分销申请（5条）
  await prisma.divisionAgentApply.createMany({
    data: [
      { uid: 1, name: '张三', phone: '13800138001', levelId: 1, status: 1, addTime: daysAgo(25) },
      { uid: 3, name: '王小明', phone: '13700137003', levelId: 1, status: 1, addTime: daysAgo(20) },
      { uid: 5, name: '陈伟', phone: '13500135005', levelId: 1, status: 0, addTime: daysAgo(5) },
      { uid: 8, name: '周杰', phone: '13200132008', levelId: 1, status: 2, addTime: daysAgo(15) },
      { uid: 11, name: '黄晓明', phone: '15800158011', levelId: 1, status: 0, addTime: daysAgo(3) },
    ],
  });
  console.log('✅ Created 5 agent applications');

  // 27. 商品评价（8条）
  const replyContents = [
    { productId: 1, uid: 1, score: 5, context: '花很漂亮，包装也很好，女朋友很喜欢！', isReply: 1, reply: '感谢您的支持，欢迎下次光临！' },
    { productId: 2, uid: 2, score: 5, context: '巧克力味道很好，包装精美，送礼首选。', isReply: 1, reply: '谢谢好评，祝您生活甜蜜！' },
    { productId: 5, uid: 4, score: 4, context: '手环功能挺全的，就是表带有点硬。', isReply: 1, reply: '感谢反馈，表带佩戴一段时间会变软的。' },
    { productId: 6, uid: 3, score: 5, context: '蜂蜜很纯正，泡水喝口感很好。', isReply: 0, reply: '' },
    { productId: 8, uid: 9, score: 4, context: '降噪效果不错，音质也可以，续航再长点就好了。', isReply: 0, reply: '' },
    { productId: 3, uid: 6, score: 5, context: '茶具做工精细，很有质感，泡茶很有仪式感。', isReply: 1, reply: '感谢认可，好茶配好器！' },
    { productId: 9, uid: 10, score: 3, context: '保温效果一般，没有宣传的那么好。', isReply: 0, reply: '' },
    { productId: 5, uid: 7, score: 5, context: '运动手环很实用，计步和心率监测都很准确。', isReply: 1, reply: '感谢您的详细评价！' },
  ];
  for (let i = 0; i < replyContents.length; i++) {
    const r = replyContents[i];
    await prisma.storeProductReply.create({
      data: {
        uid: r.uid,
        productId: r.productId,
        orderId: createdOrders[i % createdOrders.length]?.orderId || '',
        productScore: r.score,
        serviceScore: r.score,
        logisticsScore: r.score,
        context: r.context,
        pics: '[]',
        addTime: daysAgo(20 - i * 2),
        status: 1,
        isReply: r.isReply,
        reply: r.reply,
        replyTime: r.isReply ? daysAgo(19 - i * 2) : BigInt(0),
        nickname: createdUsers.find(u => u.uid === r.uid)?.nickname || '',
        avatar: avatarImg(r.uid),
      },
    });
  }
  console.log('✅ Created 8 product replies');

  console.log('🎉 Comprehensive seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
