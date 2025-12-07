// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import * as Icons from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

/**
 * 路由配置说明：
 * 建议：sider menu 请不要超过三级菜单，若超过三级菜单，则应该设计为顶部主菜单 配合左侧次级菜单
// {
//   redirect: noredirect,  //重定向
//   name: 'router-name',   //路由名称
//   hidden: true,          //可以在菜单中不展示这个路由，包括子路由。效果可以查看 other 下的路由配置。
//   meta: {
//     title: 'title',      //菜单项名称
//     icon: 'a-icon',      //菜单项图标
//     keepAlive: true,     //缓存页面
//     permission：[string]   //用来配置这个路由的权限，如果配置了将会验证当前用户的权限，并决定是否展示 *（默认情况下）
//   }
// }
 **/
export const asyncRouterMap = [

  {
    path: '/',
    name: 'root',
    component: BasicLayout,
    children: [

      // 后台首页
      {
        path: '/index',
        name: 'index',
        component: () => import(/* webpackChunkName: "index" */ '@/views/index/Index'),
        meta: { title: '首页', keepAlive: true, icon: Icons.home, permission: [] }
      },

      // 管理员
      {
        path: '/manage',
        name: 'manage',
        component: RouteView,
        redirect: '/manage/user/index',
        meta: { title: '管理员', icon: Icons.manage, permission: ['members'] },
        children: [
          {
            path: '/manage/user/index',
            component: () => import(/* webpackChunkName: "manage" */ '@/views/manage/user/Index'),
            meta: { title: '管理员列表', keepAlive: false, permission: ['members.view'] }
          },
          {
            path: '/manage/role/index',
            component: () => import(/* webpackChunkName: "manage" */ '@/views/manage/role/Index'),
            meta: { title: '角色管理', keepAlive: false, permission: ['roles.view'] }
          }
        ]
      },

      // 店铺管理
      {
        path: '/store',
        name: 'store',
        component: RouteView,
        redirect: '/store/address/index',
        meta: { title: '仓储管理', icon: Icons.shop, permission: ['stores'] },
        children: [
          // {
          //   path: '/store/setting',
          //   component: () => import(/* webpackChunkName: "store" */ '@/views/store/Setting'),
          //   meta: { title: '店铺设置', keepAlive: false, permission: ['/store/setting'] }
          // },
          {
            path: '/store/address/index',
            component: () => import(/* webpackChunkName: "store" */ '@/views/store/address/Index'),
            meta: { title: '仓储地址', keepAlive: false, permission: ['stores.view'] }
          },
          {
            path: '/page',
            component: RouteView,
            redirect: '/page/index',
            meta: { title: '区域管理', keepAlive: false, permission: ['pages'] },
            children: [
              {
                path: '/area/index',
                component: () => import(/* webpackChunkName: "store" */ '@/views/area/Index'),
                meta: { title: '区域配置', keepAlive: false, permission: ['areas.view'] }
              },
              {
                path: '/page/index',
                component: () => import(/* webpackChunkName: "page" */ '@/views/page/Index'),
                meta: { title: '页面设计', keepAlive: false, permission: ['pages.view'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: ['/page/create', '/page/update']
              },
              {
                path: '/page/create',
                component: () => import(/* webpackChunkName: "page" */ '@/views/page/Create'),
                meta: { title: '新增页面', keepAlive: false, permission: ['pages.create'] },
                hidden: true
              },
              {
                path: '/page/update',
                component: () => import(/* webpackChunkName: "page" */ '@/views/page/Update'),
                meta: { title: '编辑页面', keepAlive: false, permission: ['pages.update'] },
                hidden: true
              },
              // {
              //   path: '/page/category',
              //   component: () => import(/* webpackChunkName: "page" */ '@/views/page/category/Index'),
              //   meta: { title: '分类模板', keepAlive: false, permission: ['/page/category'] }
              // }
            ]
          }
        ]
      },

      // 商品管理
      {
        path: '/goods',
        name: 'goods',
        component: RouteView,
        redirect: '/goods/index',
        meta: { title: '商品管理', icon: Icons.goods, permission: ['products'] },
        children: [
          {
            path: '/goods/index',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/Index'),
            meta: { title: '商品列表', keepAlive: false, permission: ['products.*.view'] },
            // 访问其他页面时激活该菜单(router-link-active)
            activePath: ['/goods/create', '/goods/update']
          },
          {
            path: '/goods/create',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/Create'),
            meta: { title: '创建商品', keepAlive: false, permission: ['products.*.create'] },
            hidden: true
          },
          {
            path: '/goods/update',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/Update'),
            meta: { title: '编辑商品', keepAlive: false, permission: ['products.*.update'] },
            hidden: true
          },
          {
            path: '/goods/category/index',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/category/Index'),
            meta: { title: '商品分类', keepAlive: false, permission: ['categories.view'] }
          },
          // {
          //   path: '/goods/spec-template/index',
          //   component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/service/Index'),
          //   meta: { title: '规格模板', keepAlive: false, permission: ['/goods/spec-template/index'] }
          // },
          {
            path: '/goods/service/index',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/service/Index'),
            meta: { title: '服务承诺', keepAlive: false, permission: ['products.service.view'] }
          },
          {
            path: '/goods/comment/index',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/comment/Index'),
            meta: { title: '商品评价', keepAlive: false, permission: ['reviews.view'] }
          }
        ]
      },

      // 订单管理
      {
        path: '/order',
        name: 'order',
        component: RouteView,
        redirect: '/order/list/all',
        meta: { title: '订单管理', icon: Icons.order, permission: ['/order'] },
        children: [
          {
            path: '/order/list/all',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/Index'),
            meta: { title: '全部订单', keepAlive: false, permission: ['orders.view'] }
          },
          {
            path: '/order/list/undelivered',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/Index'),
            meta: { title: '待发货', keepAlive: false, permission: ['orders.view'] }
          },
          {
            path: '/order/list/unreceived',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/Index'),
            meta: { title: '待收货', keepAlive: false, permission: ['orders.view'] }
          },
          {
            path: '/order/list/unpaid',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/Index'),
            meta: { title: '待付款', keepAlive: false, permission: ['orders.view'] }
          },
          {
            path: '/order/list/completed',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/Index'),
            meta: { title: '已完成', keepAlive: false, permission: ['orders.view'] }
          },
          {
            path: '/order/list/canceled',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/Index'),
            meta: { title: '已取消', keepAlive: false, permission: ['orders.view'] }
          },
          {
            path: '/order/detail',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/Detail'),
            meta: { title: '订单详情', keepAlive: false, permission: ['orders.view'] },
            hidden: true
          },
          {
            path: '/order/refund/index',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/refund/Index'),
            meta: { title: '售后管理', keepAlive: false, permission: ['orders.refund'] },
            activePath: ['/order/refund/detail']
          },
          {
            path: '/order/refund/detail',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/refund/Detail'),
            meta: { title: '售后单详情', keepAlive: false, permission: ['orders.refund'] },
            hidden: true
          },
          {
            path: '/order/deal/index',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/deal/Index'),
            meta: { title: '配送订单', keepAlive: false, permission: ['deals.view'] },
          },
          {
            path: '/order/tools',
            component: RouteView,
            meta: { title: '订单处理', keepAlive: false, permission: ['orders.export'] },
            children: [
              {
                path: '/order/tools/export',
                component: () => import(/* webpackChunkName: "order" */ '@/views/order/tools/Export'),
                meta: { title: '订单导出', keepAlive: false, permission: ['orders.export'] }
              },
            ]
          },
        ]
      },

      // 会员管理
      {
        path: '/user',
        name: 'user',
        component: RouteView,
        meta: { title: '会员管理', icon: Icons.user, permission: ['users'] },
        children: [
          {
            path: '/user/index',
            component: () => import(/* webpackChunkName: "user" */ '@/views/user/Index'),
            meta: { title: '会员列表', keepAlive: false, permission: ['users'] }
          },
          {
            path: '/user/grade/index',
            component: () => import(/* webpackChunkName: "user" */ '@/views/user/grade/Index'),
            meta: { title: '会员等级', keepAlive: false, permission: ['users.level'] }
          },
          {
            path: '/user/balance',
            component: RouteView,
            redirect: '/user/balance/index',
            meta: { title: '余额记录', keepAlive: false, permission: ['users.account'] },
            children: [
              {
                path: '/user/recharge/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/user/recharge/Index'),
                meta: { title: '充值记录', keepAlive: false, permission: ['users.account'] }
              },
              {
                path: '/user/balance/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/user/balance/Index'),
                meta: { title: '余额明细', keepAlive: false, permission: ['users.account'] }
              }
            ]
          }
        ]
      },

      // 分销管理
      {
        path: '/distribution',
        name: 'distribution',
        component: RouteView,
        redirect: '/distribution/agents',
        meta: {
          title: '分销管理',
          icon: Icons.team,
          permission: [
            'distribution.agents.view',
            'distribution.rebates.view',
            'distribution.withdrawals.view',
            'distribution.orders.view'
          ]
        },
        children: [
          {
            path: '/distribution/agents',
            component: () => import(/* webpackChunkName: "distribution" */ '@/views/distribution/agents/Index'),
            meta: { title: '分销员列表', keepAlive: false, permission: ['distribution.agents.view'] }
          },
          {
            path: '/distribution/rebates',
            component: () => import(/* webpackChunkName: "distribution" */ '@/views/distribution/rebates/Index'),
            meta: { title: '佣金记录', keepAlive: false, permission: ['distribution.rebates.view'] }
          },
          {
            path: '/distribution/withdrawals',
            component: () => import(/* webpackChunkName: "distribution" */ '@/views/distribution/withdrawals/Index'),
            meta: { title: '提现审核', keepAlive: false, permission: ['distribution.withdrawals.view'] }
          },
          {
            path: '/distribution/withdrawals/setting',
            component: () => import(/* webpackChunkName: "distribution" */ '@/views/distribution/withdrawals/Setting'),
            meta: { title: '提现配置', keepAlive: false, permission: ['distribution.withdrawals.setting'] }
          },
          {
            path: '/distribution/manager',
            component: () => import(/* webpackChunkName: "distribution" */ '@/views/distribution/manager/Index'),
            meta: { title: '分销管理员', keepAlive: false, permission: ['distribution.agents.manage'] }
          },
          {
            path: '/distribution/stats',
            component: () => import(/* webpackChunkName: "distribution" */ '@/views/distribution/stats/Index'),
            meta: { title: '分销数据', keepAlive: false, permission: ['distribution.orders.view'] }
          }
        ]
      },

      // 内容管理
      {
        path: '/content',
        name: 'content',
        component: RouteView,
        meta: { title: '内容管理', icon: Icons.content, permission: ['/content'] },
        children: [
          {
            path: '/content/article',
            component: RouteView,
            redirect: '/content/article/index',
            meta: { title: '文章管理', keepAlive: false, permission: ['/content/article'] },
            children: [
              {
                path: '/content/article/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/content/article/Index'),
                meta: { title: '文章列表', keepAlive: false, permission: ['/content/article/index'] }
              },
              {
                path: '/content/article/category/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/content/article/category/Index'),
                meta: { title: '文章分类', keepAlive: false, permission: ['/content/article/category/index'] }
              }
            ]
          },
          {
            path: '/content/files',
            component: RouteView,
            redirect: '/content/files/index',
            meta: { title: '文件库管理', keepAlive: false, permission: ['/content/files'] },
            children: [
              {
                path: '/content/files/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/content/files/Index'),
                meta: { title: '文件列表', keepAlive: false, permission: ['/content/files/index'] }
              },
              {
                path: '/content/files/group/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/content/files/group/Index'),
                meta: { title: '文件分组', keepAlive: false, permission: ['/content/files/group/index'] }
              }
            ]
          },
          {
            path: '/content/help/index',
            component: () => import(/* webpackChunkName: "content" */ '@/views/content/help/Index'),
            meta: { title: '帮助中心', keepAlive: false, permission: ['/content/help/index'] }
          }
        ]
      },

      // 营销管理
      {
        path: '/market',
        name: 'market',
        component: RouteView,
        meta: { title: '营销管理', icon: Icons.market, permission: ['vouchers'] },
        children: [
          
          {
            path: '/market/seckill',
            component: RouteView,
            redirect: '/market/seckill/index',
            meta: { title: '秒杀', keepAlive: false, permission: ['/market/seckill'] },
            children: [
              {
                path: '/market/seckill/index',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/seckill/Index'),
                meta: { title: '限时秒杀', keepAlive: false, permission: ['/market/seckill/index'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: ['/market/seckill/create', '/market/seckill/update']
              },
            ]
          },
          {
            path: '/market/coupon',
            component: RouteView,
            redirect: '/market/coupon/index',
            meta: { title: '优惠券', keepAlive: false, permission: ['vouchers.view'] },
            children: [
              {
                path: '/market/coupon/index',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/coupon/Index'),
                meta: { title: '优惠券列表', keepAlive: false, permission: ['vouchers.view'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: ['/market/coupon/create', '/market/coupon/update']
              },
              {
                path: '/market/coupon/create',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/coupon/Create'),
                meta: { title: '创建优惠券', keepAlive: false, permission: ['vouchers.create'] },
                hidden: true
              },
              {
                path: '/market/coupon/update',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/coupon/Update'),
                meta: { title: '编辑优惠券', keepAlive: false, permission: ['vouchers.update'] },
                hidden: true
              },
              {
                path: '/market/coupon/receive/index',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/coupon/Receive'),
                meta: { title: '领券记录', keepAlive: false, permission: ['vouchers.view'] }
              }
            ]
          },
          {
            path: '/market/recharge',
            component: RouteView,
            redirect: '/market/recharge/plan/index',
            meta: { title: '会员充值', keepAlive: false, permission: ['users.account'] },
            children: [
              {
                path: '/market/recharge/plan/index',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/recharge/plan/Index'),
                meta: { title: '充值套餐', keepAlive: false, permission: ['users.account.strategy'] }
              },
              {
                path: '/market/recharge/setting',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/recharge/Setting'),
                meta: { title: '充值设置', keepAlive: false, permission: ['users.account.strategy'] }
              }
            ]
          },
          {
            path: '/market/points',
            component: RouteView,
            redirect: '/market/points/setting',
            meta: { title: '积分管理', keepAlive: false, permission: ['points'] },
            children: [
              {
                path: '/market/points/setting',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/points/Setting'),
                meta: { title: '积分设置', keepAlive: false, permission: ['points.update'] }
              },
              {
                path: '/market/points/log',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/points/Log'),
                meta: { title: '积分明细', keepAlive: false, permission: ['points.view'] }
              }
            ]
          },
          {
            path: '/market/assistance',
            component: RouteView,
            redirect: '/market/assistance/index',
            meta: { title: '助力券', keepAlive: false, permission: ['assists'] },
            children: [
              {
                path: '/market/assistance/index',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/assistance/Index'),
                meta: { title: '助力券列表', keepAlive: false, permission: ['assists.view'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: ['/market/assistance/create', '/market/assistance/update']
              },
              {
                path: '/market/assistance/create',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/assistance/Create'),
                meta: { title: '创建助力券', keepAlive: false, permission: ['assists.create'] },
                hidden: true
              },
              {
                path: '/market/assistance/update',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/assistance/Update'),
                meta: { title: '编辑助力券', keepAlive: false, permission: ['assists.update'] },
                hidden: true
              },
              {
                path: '/market/assistance/log/index',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/assistance/Log'),
                meta: { title: '助力记录', keepAlive: false, permission: ['assists.log'] }
              }
            ]
          },
          
          {
            path: '/market/full-free',
            component: () => import(/* webpackChunkName: "market" */ '@/views/market/FullFree'),
            meta: { title: '满额包邮', keepAlive: false, permission: ['freight.update'] }
          }
        ]
      },

      // 数据统计
      {
        path: '/statistics',
        name: 'statistics',
        component: () => import(/* webpackChunkName: "statistics" */ '@/views/statistics/Index'),
        meta: { title: '数据统计', keepAlive: true, icon: Icons.statistics, permission: ['statistics'] }
      },

      // 客户端
      {
        path: '/client',
        name: 'client',
        component: RouteView,
        meta: { title: '客户端', keepAlive: true, icon: Icons.mpweixin, iconStyle: { fontSize: '17.2px', color: '#36b313' }, permission: ['/client'] },
        children: [
          {
            path: '/client/register',
            component: () => import(/* webpackChunkName: "client" */ '@/views/client/Register'),
            meta: { title: '注册设置', keepAlive: false, permission: ['/client/register'] }
          },
          {
            path: '/client/wxapp',
            component: RouteView,
            redirect: '/client/wxapp/setting',
            meta: { title: '微信小程序', keepAlive: false, permission: ['/client/wxapp'] },
            children: [
              {
                path: '/client/wxapp/setting',
                component: () => import(/* webpackChunkName: "client" */ '@/views/client/wxapp/Setting'),
                meta: { title: '小程序设置', keepAlive: false, permission: ['/client/wxapp/setting'] }
              }
            ]
          },
          {
            path: '/client/h5',
            component: RouteView,
            redirect: '/client/h5/setting',
            meta: { title: 'H5端', keepAlive: false, permission: ['/client/h5'] },
            children: [
              {
                path: '/client/h5/setting',
                component: () => import(/* webpackChunkName: "client" */ '@/views/client/h5/Setting'),
                meta: { title: '站点设置', keepAlive: false, permission: ['/client/h5/setting'] }
              }
            ]
          },
          // 安卓客户端
          {
            path: 'http://upgrade.admin.caitou.ieexx.com/admin',
            name: 'android',
            meta: { title: '安卓发布', target: '_blank', icon: 'android', iconStyle: { fontSize: '17.2px', color: '#36b313' }, permission: ['/client/android'] },
          },
        ]
      },

      // 设置
      {
        path: '/setting',
        name: 'setting',
        component: RouteView,
        redirect: '/setting/store/basic',
        meta: { title: '设置', icon: Icons.setting, permission: ['settings'] },
        children: [
          {
            path: '/setting/trade',
            component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/Trade'),
            meta: { title: '交易设置', keepAlive: false, permission: ['settings.trade'] }
          },
          {
            path: '/setting/storage',
            component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/Storage'),
            meta: { title: '上传设置', keepAlive: false, permission: ['settings.storage'] }
          },
          {
            path: '/setting/sms',
            component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/Sms'),
            meta: { title: '短信通知', keepAlive: false, permission: ['settings.sms'] }
          },
          {
            path: '/setting/delivery',
            component: RouteView,
            redirect: '/setting/delivery/setting',
            meta: { title: '配送设置', keepAlive: false, permission: ['settings.delivery'] },
            children: [
              {
                path: '/setting/delivery/setting',
                component: () => import(/* webpackChunkName: "content" */ '@/views/setting/delivery/Setting'),
                meta: { title: '配送方式', keepAlive: false, permission: ['settings.delivery'] }
              },
              {
                path: '/setting/delivery/template/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/setting/delivery/template/Index'),
                meta: { title: '运费模板', keepAlive: false, permission: ['settings.delivery'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: ['/setting/delivery/template/create', '/setting/delivery/template/update']
              },
              {
                path: '/setting/delivery/template/create',
                component: () => import(/* webpackChunkName: "content" */ '@/views/setting/delivery/template/Create'),
                meta: { title: '新增运费模板', keepAlive: false, permission: ['settings.delivery.templates'] },
                hidden: true
              },
              {
                path: '/setting/delivery/template/update',
                component: () => import(/* webpackChunkName: "content" */ '@/views/setting/delivery/template/Update'),
                meta: { title: '编辑运费模板', keepAlive: false, permission: ['settings.delivery.templates.update'] },
                hidden: true
              },
              {
                path: '/setting/delivery/express/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/setting/delivery/express/Index'),
                meta: { title: '物流公司', keepAlive: false, permission: ['settings.delivery.express'] }
              }
            ]
          },
          {
            path: '/setting/other',
            component: RouteView,
            redirect: '/setting/other/clear',
            meta: { title: '其他设置', keepAlive: false, permission: ['settings.clear'] },
            children: [
              {
                path: '/setting/other/clear',
                component: () => import(/* webpackChunkName: "content" */ '@/views/setting/other/Clear'),
                meta: { title: '清理缓存', keepAlive: false, permission: ['settings.clear'] }
              }
            ]
          }
        ]
      }

    ]
  },

  // 更新账户信息
  {
    name: 'renew',
    path: '/manage',
    redirect: '/manage/renew',
    component: BasicLayout,
    hidden: true,
    meta: { title: '更新账户信息', keepAlive: false },
    children: [
      {
        path: 'renew',
        component: () => import(/* webpackChunkName: "manage" */ '@/views/manage/renew')
      }
    ]
  },

  {
    path: '*', redirect: '/404', hidden: true
  }

]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [

  // 用户登录页
  {
    path: '/passport',
    component: UserLayout,
    redirect: '/passport/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "passport" */ '@/views/passport/Login')
      }
    ]
  },

  // 404页
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "exception" */ '@/views/exception/404')
  }

]
