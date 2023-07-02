import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/roles',
  add: '/roles',
  edit: '/roles/{id}',
  delete: '/roles/{id}'
}

/**
 * 角色列表
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
export function edit (data) {
  return axios({
    url: api.edit,
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
    method: 'delete',
    data: data
  })
}
