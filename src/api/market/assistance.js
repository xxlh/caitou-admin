import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/assists',
  detail: '/assists/{id}',
  log: '/assists/logs',
  add: '/assists',
  edit: '/assists/{id}',
  delete: '/assists/{id}'
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
export function log (params) {
  return axios({
    url: api.log,
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
export function deleted (id) {
  return axios({
    url: api.delete.replace('{id}', id),
    method: 'delete',
  })
}
