import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/market.seckill/list',
  detail: '/market.seckill/detail',
  receive: '/market.seckill/receive',
  add: '/market.seckill/add',
  edit: '/market.seckill/edit',
  delete: '/market.seckill/delete'
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
export function detail (params) {
  return axios({
    url: api.detail,
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
export function edit (data) {
  return axios({
    url: api.edit,
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
