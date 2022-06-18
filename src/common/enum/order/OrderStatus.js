import Enum from '../enum'

/**
 * 枚举类：订单状态
 * OrderStatusEnum
 */
export default new Enum([
  { key: 'NORMAL', name: '进行中', value: 'pending' },
  { key: 'CANCELLED', name: '已取消', value: 'canceled' },
  { key: 'REFUNDING', name: '退款中', value: 'refunding' },
  { key: 'UNPAID', name: '未支付', value: 'unpaid' },
  { key: 'UNDELIVERED', name: '待发货', value: 'undelivered' },
  { key: 'UNRECEIVED', name: '未收货', value: 'unreceived' },
  { key: 'UNREVIEWED', name: '已收货', value: 'unreviewed' },
  { key: 'REVIEWING', name: '待评价', value: 'reviewing' },
  { key: 'COMPLETED', name: '已完成', value: 'completed' }
])
