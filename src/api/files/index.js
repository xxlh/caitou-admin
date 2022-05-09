import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/medias',
  edit: '/files/edit',
  delete: '/medias',
  moveGroup: '/files/moveGroup',
  attach: '/medias/{id}/attach',
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
    method: 'delete',
    data: data
  })
}

/**
 * 移动分组
 * @param {*} data
 */
export function moveGroup (data) {
  return axios({
    url: api.moveGroup,
    method: 'post',
    data: data
  })
}

/**
 * 分配所属
 * @param {*} data
 */
 export function attach (goodsId, data) {
  return axios({
    url: api.attach.replace('{id}', goodsId),
    method: 'post',
    data
  })
}