import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  delivery: '/orders/{id}/ship',
  updatePrice: '/order.event/updatePrice',
  confirmCancel: '/orders/{id}/refund',
  delete: '/orders/{id}',
}

/**
 * 确认发货
 * @param {*} data
 */
export function delivery (id, data) {
  return axios({
    url: api.delivery.replace('{id}', id),
    method: 'post',
    data
  })
}

/**
 * 修改订单价格
 * @param {*} data
 */
export function updatePrice (data) {
  return axios({
    url: api.updatePrice,
    method: 'post',
    data
  })
}

/**
 * 审核：用户取消订单
 * @param {*} data
 */
export function confirmCancel (id, data) {
  return axios({
    url: api.confirmCancel.replace('{id}', id),
    method: 'post',
    data
  })
}

/**
 * 删除订单记录
 * @param {*} data
 */
export function deleted (orderId) {
  return axios({
    url: api.delete.replace('{id}', orderId),
    method: 'delete',
  })
}
