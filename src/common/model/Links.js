
// 常量：链接类型 - 页面
const LINK_TYPE_PAGE = 'PAGE'
const LINK_TYPE_URL = 'URL'

// 基础页面
const basics = {
  title: '基础页面',
  key: 'basics',
  data: [
    {
      id: 'cb344ba',
      title: '商城首页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/tabBar/home/index'
      }
    },
    {
      id: 'c37c2ee',
      title: '分类页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/tabBar/category/category'
      }
    },
    {
      id: 'bb2f7f1',
      title: '购物车',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/tabBar/cart/cart'
      }
    },
    {
      id: 'a013c9e',
      title: '个人中心',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/tabBar/user/user'
      }
    },
    {
      id: '593fe1f',
      title: '会员登录页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/login/login'
      }
    }
  ]
}

// 商城页面
const store = {
  title: '商城页面',
  key: 'store',
  data: [
    {
      id: '995bf1c',
      title: '商品列表页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/category/category-page',
        query: {}
      },
      form: [
        {
          key: 'query.category_id',
          lable: '分类ID',
          tips: '商品管理 -> 商品分类'
        },
        {
          key: 'query.search',
          lable: '关键词',
          tips: '搜索的关键词，用于匹配商品名称'
        }
      ]
    },
    {
      id: '6wawb10',
      title: '商品详情页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/goods/goods',
        query: {}
      },
      form: [
        {
          key: 'query.id',
          lable: '商品ID',
          required: true,
          // value: '10001',    // 默认值
          tips: '商品管理 - 商品列表' // 字段提示
        }
      ]
    },
    {
      id: '88lxeey',
      title: '商品搜索页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/search/index'
      }
    },
    {
      id: '56sswhq',
      title: '领券中心',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/coupon/index'
      }
    }
  ]
}

// 个人中心
const personal = {
  title: '个人中心',
  key: 'personal',
  data: [
    {
      id: '7b345f6',
      title: '我的订单',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/user/order_list/order_list',
        query: {}
      },
      form: [
        {
          key: 'query.tbIndex',
          lable: '订单类型',
          required: true,
          value: '0', // 默认值
          tips: '0 全部<br>1 待支付<br>2 待发货<br>3 待收货<br>4 待评价' // 字段提示
        }
      ]
    },
    {
      id: 'c4f630d',
      title: '我的钱包页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/wallet/index'
      }
    },
    {
      id: '792db19',
      title: '充值中心页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/wallet/recharge/index'
      }
    },
    {
      id: '03b9290',
      title: '我的优惠券',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/user/coupon/coupon'
      }
    },
    {
      id: '569b0b0',
      title: '会员积分明细',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/points/log'
      }
    },
    {
      id: '0c25051',
      title: '收货地址',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/user/address/address'
      }
    },
    {
      id: '3558c27',
      title: '帮助中心',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/help/index'
      }
    }
  ]
}

// 其他页面
const other = {
  title: '其他页面',
  key: 'other',
  data: [
    {
      id: '91th4ss',
      title: '落地页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/landing-page/index',
        query: {}
      },
      form: [
        {
          key: 'query.id',
          lable: '页面ID',
          required: true,
          tips: '仓储管理 -> 页面设计'
        }
      ]
    },
    {
      id: 'ugrauzv',
      title: '资讯列表页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/article/index',
        query: {}
      },
      form: [
        {
          key: 'query.categoryId',
          lable: '分类ID',
          tips: '内容管理 -> 文章分类',
          value: ''
        }
      ]
    },
    {
      id: 'u1v6aux',
      title: '资讯详情页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/article/detail',
        query: {}
      },
      form: [
        {
          key: 'query.articleId',
          lable: '文章ID',
          required: true,
          tips: '内容管理 -> 文章列表'
        }
      ]
    },
    {
      id: 'pagelink',
      title: '自定义页',
      type: LINK_TYPE_PAGE,
      param: {
        path: '',
        query: {}
      },
      form: [
        {
          key: 'path',
          lable: '页面路径',
          required: true,
          tips: '如: pages/user/setting/setting'
        }
      ]
    },
    {
      id: 'url',
      title: '外链页面',
      type: LINK_TYPE_URL,
      param: {
        path: '',
        query: {}
      },
      form: [
        {
          key: 'path',
          lable: '外链地址',
          required: true,
          tips: '任意http开头的页面'
        }
      ]
    },
  ]
}

// // 门店 - 拨打电话 - 暂未实现
// const callPhone = {
//   id: 'cb344ba',
//   title: '拨打电话',
//   type: 'callPhone',
//   param: {
//     phoneNumber: '13212341234'
//   },
//   form: [
//     {
//       key: 'phoneNumber',
//       lable: '电话号码',
//       tips: ''
//     }
//   ]
// }

export const linkList = [basics, store, personal, other]
