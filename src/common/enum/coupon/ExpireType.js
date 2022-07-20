import Enum from '../enum'

/**
 * 枚举类：优惠券到期类型
 * ExpireTypeEnum
 */
export default new Enum([
  { key: 'RECEIVE', name: '领取后', value: 'from_gain' },
  { key: 'FIXED_TIME', name: '固定时间', value: 'fixed_time' }
])
