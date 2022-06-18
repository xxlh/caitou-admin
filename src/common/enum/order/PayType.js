import Enum from '../enum'

/**
 * 枚举类：订单支付方式
 * PayTypeEnum
 */
export default new Enum([
  { key: 'BALANCE', name: '余额支付', value: 'balance' },
  { key: 'WECHAT', name: '微信支付', value: 'wechat' },
  { key: 'APLIPAY', name: '支付宝', value: 'alipay' },
  { key: 'APLIPAY', name: '未知付款方式', value: null },
])
