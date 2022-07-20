import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/vouchers/templates',
  detail: '/vouchers/templates/{id}',
  receive: '/vouchers',
  add: '/vouchers/templates',
  edit: '/vouchers/templates/{id}',
  delete: '/vouchers/templates/{id}',
  set_condition: '/vouchers/templates/{id}/conditions',
}

/**
 * 列表记录
 */
export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}

/**
 * 详情记录
 */
export function detail (id, params) {
  return axios({
    url: api.detail.replace('{id}', id),
    method: 'get',
    params
  })
}

/**
 * 领取记录
 */
export function receive (params) {
  return axios({
    url: api.receive,
    method: 'get',
    params
  })
}

/**
 * 新增记录
 * @param {*} data
 */
export function add (data) {
  return axios({
    url: api.add,
    method: 'post',
    data
  })
}

/**
 * 编辑记录
 * @param {*} data
 */
export function edit (id, data) {
  return axios({
    url: api.edit.replace('{id}', id),
    method: 'patch',
    data
  })
}

/**
 * 删除记录
 * @param {*} data
 */
export function deleted (id, data) {
  return axios({
    url: api.delete.replace('{id}', id),
    method: 'delete',
    data: data
  })
}

/**
 * 设置领取条件
 * @param {*} data
 */
export function set_condition (id, data) {
  return axios({
    url: api.set_condition.replace('{id}', id),
    method: 'post',
    data: data
  })
}
export function remove_condition (id, data) {
  return axios({
    url: api.set_condition.replace('{id}', id),
    method: 'delete',
    data: data
  })
}
