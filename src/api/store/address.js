import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/stores',
  all: '/stores',
  add: '/stores',
  edit: '/stores/{id}',
  delete: '/stores/{id}'
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
 * 全部记录
 */
export function all (params) {
  return axios({
    url: api.all,
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
