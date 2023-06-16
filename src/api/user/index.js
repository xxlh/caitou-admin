import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/users',
  detail: '/users/{id}',
  recharge: '/user/recharge',
  grade: '/user/grade',
  delete: '/user/delete'
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
 * 会员充值
 * @param {*} data
 */
export function recharge (data) {
  return axios({
    url: api.recharge,
    method: 'post',
    data
  })
}

/**
 * 修改会员等级
 * @param {*} data
 */
export function grade (data) {
  return axios({
    url: api.grade,
    method: 'post',
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
