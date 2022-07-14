import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/pages',
  defaultData: '/pages/default',
  detail: '/pages/{id}',
  add: '/pages',
  edit: '/pages/{id}',
  delete: '/pages/{id}',
  setDefault: '/pages/{id}/set_default',
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
export function defaultData (params) {
  return axios({
    url: api.defaultData,
    method: 'get',
    params
  })
}

/**
 * 页面详情
 */
export function detail (id) {
  return axios({
    url: api.detail.replace('{id}', id),
    method: 'get',
  })
}

/**
 * 设置默认首页
 * @param {*} data
 */
export function setDefault (id, data) {
  return axios({
    url: api.setDefault.replace('{id}', id),
    method: 'post',
    data: data
  })
}

/**
 * 新增页面
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
 * 编辑页面
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
