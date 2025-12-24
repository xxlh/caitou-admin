import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/areas',
  add: '/areas',
  edit: '/areas/{id}',
  getCategories: '/areas/{id}/categories',
  setCategories: '/areas/{id}/categorize',
  setDefault: '/areas/{id}/set_default',
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
 * 获取分类筛选
 */
export function getCategories (id) {
  return axios({
    url: api.getCategories.replace('{id}', id),
    method: 'get',
  })
}

export function setCategories (id) {
  return axios({
    url: api.setCategories.replace('{id}', id),
    method: 'post',
  })
}

/**
 * 设置默认区域
 * @param {*} id
 */
export function setDefault (id) {
  return axios({
    url: api.setDefault.replace('{id}', id),
    method: 'post',
  })
}
