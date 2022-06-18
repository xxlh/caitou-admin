import Enum from '../enum'

/**
 * 枚举类：订单发货状态
 * DeliveryStatusEnum
 */
export default new Enum([
  { key: 'NOT_DELIVERED', name: '未发货', value: 'pending' },
  { key: 'DELIVERED', name: '已发货', value: 'delivered' },
  { key: 'RECEIVED', name: '已发货', value: 'received' },
])
