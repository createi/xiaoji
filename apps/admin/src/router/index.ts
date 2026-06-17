import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/layouts/BasicLayout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'HomeOutlined' },
      },
      {
        path: 'product',
        name: 'Product',
        redirect: '/product/list',
        meta: { title: '商品管理', icon: 'ShoppingOutlined' },
        children: [
          {
            path: 'list',
            name: 'ProductList',
            component: () => import('@/views/product/list/index.vue'),
            meta: { title: '商品列表' },
          },
          {
            path: 'add/:id?',
            name: 'ProductAdd',
            component: () => import('@/views/product/form/index.vue'),
            meta: { title: '商品添加', hidden: true },
          },
          {
            path: 'category',
            name: 'ProductCategory',
            component: () => import('@/views/product/category/index.vue'),
            meta: { title: '商品分类' },
          },
          {
            path: 'attr',
            name: 'ProductAttr',
            component: () => import('@/views/product/attr/index.vue'),
            meta: { title: '商品属性' },
          },
          {
            path: 'reply',
            name: 'ProductReply',
            component: () => import('@/views/product/reply/index.vue'),
            meta: { title: '商品评价' },
          },
        ],
      },
      {
        path: 'order',
        name: 'Order',
        redirect: '/order/list',
        meta: { title: '订单管理', icon: 'OrderedListOutlined' },
        children: [
          {
            path: 'list',
            name: 'OrderList',
            component: () => import('@/views/order/list/index.vue'),
            meta: { title: '订单列表' },
          },
          {
            path: 'detail/:id',
            name: 'OrderDetail',
            component: () => import('@/views/order/detail/index.vue'),
            meta: { title: '订单详情', hidden: true },
          },
          {
            path: 'refund',
            name: 'OrderRefund',
            component: () => import('@/views/order/refund/index.vue'),
            meta: { title: '退款管理' },
          },
        ],
      },
      {
        path: 'user',
        name: 'User',
        redirect: '/user/list',
        meta: { title: '用户管理', icon: 'UserOutlined' },
        children: [
          {
            path: 'list',
            name: 'UserList',
            component: () => import('@/views/user/list/index.vue'),
            meta: { title: '用户列表' },
          },
          {
            path: 'level',
            name: 'UserLevel',
            component: () => import('@/views/user/level/index.vue'),
            meta: { title: '用户等级' },
          },
          {
            path: 'level/add/:id?',
            name: 'UserLevelForm',
            component: () => import('@/views/user/level/form.vue'),
            meta: { title: '用户等级编辑', hidden: true },
          },
          {
            path: 'group',
            name: 'UserGroup',
            component: () => import('@/views/user/group/index.vue'),
            meta: { title: '用户分组' },
          },
          {
            path: 'group/add/:id?',
            name: 'UserGroupForm',
            component: () => import('@/views/user/group/form.vue'),
            meta: { title: '用户分组编辑', hidden: true },
          },
          {
            path: 'label',
            name: 'UserLabel',
            component: () => import('@/views/user/label/index.vue'),
            meta: { title: '用户标签' },
          },
          {
            path: 'label/add/:id?',
            name: 'UserLabelForm',
            component: () => import('@/views/user/label/form.vue'),
            meta: { title: '用户标签编辑', hidden: true },
          },
        ],
      },
      {
        path: 'marketing',
        name: 'Marketing',
        redirect: '/marketing/coupon',
        meta: { title: '营销管理', icon: 'GiftOutlined' },
        children: [
          {
            path: 'coupon',
            name: 'MarketingCoupon',
            component: () => import('@/views/marketing/coupon/index.vue'),
            meta: { title: '优惠券管理' },
          },
          {
            path: 'coupon/add/:id?',
            name: 'MarketingCouponForm',
            component: () => import('@/views/marketing/coupon/form.vue'),
            meta: { title: '优惠券编辑', hidden: true },
          },
          {
            path: 'seckill',
            name: 'MarketingSeckill',
            component: () => import('@/views/marketing/seckill/index.vue'),
            meta: { title: '秒杀活动' },
          },
          {
            path: 'seckill/add/:id?',
            name: 'MarketingSeckillForm',
            component: () => import('@/views/marketing/seckill/form.vue'),
            meta: { title: '秒杀编辑', hidden: true },
          },
          {
            path: 'combination',
            name: 'MarketingCombination',
            component: () => import('@/views/marketing/combination/index.vue'),
            meta: { title: '拼团活动' },
          },
          {
            path: 'combination/add/:id?',
            name: 'MarketingCombinationForm',
            component: () => import('@/views/marketing/combination/form.vue'),
            meta: { title: '拼团编辑', hidden: true },
          },
          {
            path: 'bargain',
            name: 'MarketingBargain',
            component: () => import('@/views/marketing/bargain/index.vue'),
            meta: { title: '砍价活动' },
          },
          {
            path: 'bargain/add/:id?',
            name: 'MarketingBargainForm',
            component: () => import('@/views/marketing/bargain/form.vue'),
            meta: { title: '砍价编辑', hidden: true },
          },
          {
            path: 'integral',
            name: 'MarketingIntegral',
            component: () => import('@/views/marketing/integral/index.vue'),
            meta: { title: '积分商品' },
          },
          {
            path: 'integral/add/:id?',
            name: 'MarketingIntegralForm',
            component: () => import('@/views/marketing/integral/form.vue'),
            meta: { title: '积分商品编辑', hidden: true },
          },
        ],
      },
      {
        path: 'finance',
        name: 'Finance',
        redirect: '/finance/balance',
        meta: { title: '财务管理', icon: 'MoneyCollectOutlined' },
        children: [
          {
            path: 'balance',
            name: 'FinanceBalance',
            component: () => import('@/views/finance/balance/index.vue'),
            meta: { title: '余额记录' },
          },
          {
            path: 'commission',
            name: 'FinanceCommission',
            component: () => import('@/views/finance/commission/index.vue'),
            meta: { title: '佣金记录' },
          },
          {
            path: 'extract',
            name: 'FinanceExtract',
            component: () => import('@/views/finance/extract/index.vue'),
            meta: { title: '提现管理' },
          },
        ],
      },
      {
        path: 'agent',
        name: 'Agent',
        redirect: '/agent/list',
        meta: { title: '分销管理', icon: 'ShareAltOutlined' },
        children: [
          {
            path: 'list',
            name: 'AgentList',
            component: () => import('@/views/agent/list/index.vue'),
            meta: { title: '分销商管理' },
          },
          {
            path: 'apply',
            name: 'AgentApply',
            component: () => import('@/views/agent/apply/index.vue'),
            meta: { title: '分销申请' },
          },
        ],
      },
      {
        path: 'cms',
        name: 'CMS',
        redirect: '/cms/article',
        meta: { title: '内容管理', icon: 'FileTextOutlined' },
        children: [
          {
            path: 'article',
            name: 'CmsArticle',
            component: () => import('@/views/cms/article/index.vue'),
            meta: { title: '文章列表' },
          },
          {
            path: 'article-save/:id?',
            name: 'CmsArticleSave',
            component: () => import('@/views/cms/article-save/index.vue'),
            meta: { title: '文章编辑', hidden: true },
          },
        ],
      },
      {
        path: 'statistic',
        name: 'Statistic',
        redirect: '/statistic/transaction',
        meta: { title: '数据统计', icon: 'BarChartOutlined' },
        children: [
          {
            path: 'transaction',
            name: 'StatisticTransaction',
            component: () => import('@/views/statistic/transaction/index.vue'),
            meta: { title: '交易统计' },
          },
          {
            path: 'product',
            name: 'StatisticProduct',
            component: () => import('@/views/statistic/product/index.vue'),
            meta: { title: '商品统计' },
          },
          {
            path: 'user',
            name: 'StatisticUser',
            component: () => import('@/views/statistic/user/index.vue'),
            meta: { title: '用户统计' },
          },
        ],
      },
      {
        path: 'setting',
        name: 'Setting',
        redirect: '/setting/system',
        meta: { title: '系统设置', icon: 'SettingOutlined' },
        children: [
          {
            path: 'system',
            name: 'SettingSystem',
            component: () => import('@/views/setting/system/index.vue'),
            meta: { title: '系统设置' },
          },
          {
            path: 'admin',
            name: 'SettingAdmin',
            component: () => import('@/views/setting/admin/index.vue'),
            meta: { title: '管理员管理' },
          },
          {
            path: 'role',
            name: 'SettingRole',
            component: () => import('@/views/setting/role/index.vue'),
            meta: { title: '角色管理' },
          },
          {
            path: 'menus',
            name: 'SettingMenus',
            component: () => import('@/views/setting/menus/index.vue'),
            meta: { title: '菜单管理' },
          },
          {
            path: 'store',
            name: 'SettingStore',
            component: () => import('@/views/setting/store/index.vue'),
            meta: { title: '门店管理' },
          },
          {
            path: 'shipping',
            name: 'SettingShipping',
            component: () => import('@/views/setting/shipping/index.vue'),
            meta: { title: '运费模板' },
          },
          {
            path: 'express',
            name: 'SettingExpress',
            component: () => import('@/views/setting/express/index.vue'),
            meta: { title: '快递公司' },
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth !== false && !token) {
    next('/login');
  } else if (to.path === '/login' && token) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
