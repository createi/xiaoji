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

async function main() {
  console.log('🌱 Seeding database...');

  // 先创建默认角色（admin 需要引用角色）
  const role = await prisma.systemRole.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: '超级管理员',
      status: 1,
      rules: '[]',
      addTime: BigInt(Date.now()),
    },
  });
  console.log('✅ Created role:', role.name);

  // 创建超级管理员
  const admin = await prisma.systemAdmin.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      account: 'admin',
      realName: '超级管理员',
      pwd: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      roleId: 1,
      level: 0,
      status: 1,
      addTime: BigInt(Date.now()),
    },
  });
  console.log('✅ Created admin:', admin.account);

  // 创建默认菜单
  const menus = [
    { pid: 0, title: '首页', icon: 'HomeOutlined', path: '/dashboard', component: 'dashboard/index', sort: 1, isShow: 1 },
    { pid: 0, title: '商品管理', icon: 'ShoppingOutlined', path: '/product', component: '', sort: 2, isShow: 1 },
    { pid: 0, title: '订单管理', icon: 'OrderedListOutlined', path: '/order', component: '', sort: 3, isShow: 1 },
    { pid: 0, title: '用户管理', icon: 'UserOutlined', path: '/user', component: '', sort: 4, isShow: 1 },
    { pid: 0, title: '营销管理', icon: 'GiftOutlined', path: '/marketing', component: '', sort: 5, isShow: 1 },
    { pid: 0, title: '财务管理', icon: 'MoneyCollectOutlined', path: '/finance', component: '', sort: 6, isShow: 1 },
    { pid: 0, title: '分销管理', icon: 'ShareAltOutlined', path: '/agent', component: '', sort: 7, isShow: 1 },
    { pid: 0, title: '内容管理', icon: 'FileTextOutlined', path: '/cms', component: '', sort: 8, isShow: 1 },
    { pid: 0, title: '数据统计', icon: 'BarChartOutlined', path: '/statistic', component: '', sort: 9, isShow: 1 },
    { pid: 0, title: '系统设置', icon: 'SettingOutlined', path: '/setting', component: '', sort: 10, isShow: 1 },
  ];

  for (const menu of menus) {
    await prisma.systemMenus.create({
      data: {
        ...menu,
        status: 1,
        addTime: BigInt(Date.now()),
      },
    });
  }
  console.log('✅ Created menus');

  // 创建默认分类
  const categories = [
    { name: '手机数码', sort: 1, isShow: 1, isHome: 1 },
    { name: '电脑办公', sort: 2, isShow: 1, isHome: 1 },
    { name: '家用电器', sort: 3, isShow: 1, isHome: 1 },
    { name: '服饰鞋包', sort: 4, isShow: 1, isHome: 1 },
    { name: '食品饮料', sort: 5, isShow: 1, isHome: 1 },
    { name: '美妆个护', sort: 6, isShow: 1, isHome: 1 },
  ];

  for (const category of categories) {
    await prisma.storeCategory.create({
      data: {
        ...category,
        pid: 0,
        icon: '',
        image: '',
        addTime: BigInt(Date.now()),
      },
    });
  }
  console.log('✅ Created categories');

  // 创建默认用户等级
  const levels = [
    { name: '普通用户', grade: 0, oneBrokeragePercent: 0, twoBrokeragePercent: 0, taskTotalNum: 0, taskNum: 0, isSpecial: 0 },
    { name: 'VIP会员', grade: 1, oneBrokeragePercent: 5, twoBrokeragePercent: 2, taskTotalNum: 100, taskNum: 0, isSpecial: 0 },
    { name: 'SVIP会员', grade: 2, oneBrokeragePercent: 8, twoBrokeragePercent: 3, taskTotalNum: 500, taskNum: 0, isSpecial: 0 },
  ];

  for (const level of levels) {
    await prisma.userLevel.create({
      data: {
        ...level,
        image: '',
        status: 1,
        addTime: BigInt(Date.now()),
      },
    });
  }
  console.log('✅ Created user levels');

  // 创建默认分销等级
  const agentLevels = [
    { name: '普通分销', oneBrokerage: 10, twoBrokerage: 5 },
    { name: '高级分销', oneBrokerage: 15, twoBrokerage: 8 },
    { name: '金牌分销', oneBrokerage: 20, twoBrokerage: 10 },
  ];

  for (const level of agentLevels) {
    await prisma.agentLevel.create({
      data: {
        ...level,
        image: '',
        sort: 0,
        status: 1,
        addTime: BigInt(Date.now()),
      },
    });
  }
  console.log('✅ Created agent levels');

  // 创建默认签到奖励
  const signRewards = [
    { day: 1, number: 10, type: 1 },
    { day: 2, number: 15, type: 1 },
    { day: 3, number: 20, type: 1 },
    { day: 4, number: 25, type: 1 },
    { day: 5, number: 30, type: 1 },
    { day: 6, number: 40, type: 1 },
    { day: 7, number: 50, type: 1 },
  ];

  for (const reward of signRewards) {
    await prisma.systemSignReward.create({
      data: {
        ...reward,
        status: 1,
        sort: reward.day,
      },
    });
  }
  console.log('✅ Created sign rewards');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
