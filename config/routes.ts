export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user', routes: [{ name: '登录', path: '/user/login', component: './user/Login' }] },
    ],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      { path: '/admin/sub-page', name: '二级管理页', icon: 'smile', component: './Welcome' },
    ],
  },
  { name: '订单管理', icon: 'ShoppingCartOutlined', path: '/order', component: './OrderList' },
  { name: '查询用户表格', icon: 'table', path: '/user-list', component: './UserList' },
  { name: '商品管理', icon: 'SkinOutlined', path: '/goods', component: './GoodsList' },
  { name: '区域管理', icon: 'SkinOutlined', path: '/area', component: './AreaEdit' },
  { path: '/', redirect: '/welcome' },
  { component: './404' },
];
