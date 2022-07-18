import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/categories',
  add: '/categories',
  get: '/categories/{id}',
  edit: '/categories/{id}',
  delete: '/category/delete',
  attach: '/products/{id}/categorize',
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
export function get (id, data) {
  return axios({
    url: api.edit.replace('{id}', id),
    method: 'get',
    data
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
export function deleted (data) {
  return axios({
    url: api.delete,
    method: 'post',
    data: data
  })
}

/**
 * 分配类目
 * @param {*} data
 */
export function attach (goodsId, category_ids) {
  return axios({
    url: api.attach.replace('{id}', goodsId),
    method: 'post',
    data: {category_ids}
  })
}
