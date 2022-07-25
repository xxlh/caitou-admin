import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/orders',
  detail: '/orders/{id}'
}

// 列表记录
export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}

// 订单详情
export function detail (id, params) {
  return axios({
    url: api.detail.replace('{id}', id),
    method: 'get',
    params
  })
}

// 订单导出
export function exports (params) {
  return axios({
    url: api.detail,
    method: 'get',
    params
  })
}

// 批量发货模板
export function deliveryTpl (params) {
  return axios({
    url: api.deliveryTpl,
    method: 'get',
    params
  })
}
