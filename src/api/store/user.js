import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  info: '/auth/info',
  list: '/members',
  add: '/members',
  edit: '/members/{id}',
  delete: '/members/{id}',
  assign: '/members/{id}/assign_role',
  renew: '/members/renew'
}

/**
 * 获取当前登录的用户信息
 */
export function getInfo (params) {
  return axios({
    url: api.info,
    method: 'get',
    params
  })
}

/**
 * 更新当前管理员信息
 * @param {*} data
 */
export function renew (data) {
  return axios({
    url: api.renew,
    method: 'post',
    data
  })
}

/**
 * 管理员列表
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
export function assign (id, data) {
  return axios({
    url: api.assign.replace('{id}', id),
    method: 'post',
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
