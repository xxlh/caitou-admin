import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/deals',
  add: '/deals',
  edit: '/deals/{id}',
  delete: '/deals/{id}',
  allocate: '/deals/{id}/allocate_man',
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
 * 分配骑手
 * @param {*} data
 */
export function allocate (id, data) {
  return axios({
    url: api.allocate.replace('{id}', id),
    method: 'post',
    data: data
  })
}
