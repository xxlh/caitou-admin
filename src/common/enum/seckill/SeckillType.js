import Enum from '../enum'

/**
 * 枚举类：优惠券类型
 * CouponTypeEnum
 */
export default new Enum([
  { key: 'FULL_DISCOUNT', name: '限时秒杀', value: 10 },
  { key: 'DISCOUNT', name: '实时秒杀', value: 20 }
])
