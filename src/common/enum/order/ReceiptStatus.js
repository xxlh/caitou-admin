import Enum from '../enum'

/**
 * 枚举类：订单收货状态
 * ReceiptStatusEnum
 */
export default new Enum([
  { key: 'NOT_DELIVERED', name: '未收货', value: 'pending' },
  { key: 'DELIVERED', name: '未收货', value: 'delivered' },
  { key: 'RECEIVED', name: '已收货', value: 'received' },
])
