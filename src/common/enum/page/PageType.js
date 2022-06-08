import Enum from '../enum'

/**
 * 枚举类：订单支付方式
 * PageTypeEnum
 */
export default new Enum([
  { key: 'HOME', name: '首页', value: 'index' },
  { key: 'CATEGORY', name: '分类页', value: 'category' },
  { key: 'LANDING', name: '落地页', value: 'landingpage' }
])
