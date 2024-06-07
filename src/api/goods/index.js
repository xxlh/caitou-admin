import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/products',
  listByIds: '/products',
  detail: '/products/{id}',
  basic: '/goods/basic',
  add: '/products',
  edit: '/products/{id}',
  batchDelete: '/products',
  batchDeleteSkus: '/products/sku',
  state: '/goods/state',
  saveSpec: '/products/{id}/spec',
  saveSku: '/products/{id}/sku',
  copySku: '/products/copy_sku',
  schedulePrice: '/products/{id}/scheduled_price',
  editSchedulePrice: '/products/{id}/scheduled_price/{schedule_id}',
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
 * 根据商品ID集获取列表记录
 */
export function listByIds (goodsIds, params) {
  return axios({
    url: api.listByIds,
    method: 'get',
    params: { ids: goodsIds, per_page: 99, ...params }
  })
}

/**
 * 商品详情(详细信息)
 */
export function detail (id, params) {
  return axios({
    url: api.detail.replace('{id}', id),
    method: 'get',
    params
  })
}

/**
 * 商品详情(基础信息)
 */
export function basic (goodsId, params) {
  return axios({
    url: api.basic,
    method: 'get',
    params: { goodsId, ...params }
  })
}

/**
 * 更新状态
 * @param {*} data
 */
export function state (data) {
  return axios({
    url: api.state,
    method: 'post',
    data
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
export function edit (goodsId, form) {
  return axios({
    url: api.edit.replace('{id}', goodsId),
    method: 'patch',
    data: form,
  })
}

/**
 * 删除记录
 * @param {*} data
 */
export function deleted (data) {
  return axios({
    url: api.batchDelete,
    method: 'delete',
    data: data
  })
}
export function deleteSkus (data) {
  return axios({
    url: api.batchDeleteSkus,
    method: 'delete',
    data: data
  })
}

/**
 * 规格编辑
 * @param {*} data
 */
export function saveSpec (goodsId, data) {
  return axios({
    url: api.saveSpec.replace('{id}', goodsId),
    method: 'put',
    data: data
  })
}
export function saveSku (goodsId, data) {
  return axios({
    url: api.saveSku.replace('{id}', goodsId),
    method: 'put',
    data: data
  })
}

export function copySku (data) {
  return axios({
    url: api.copySku,
    method: 'post',
    data: data
  })
}

/**
 * 商品定时调价
 * @param {*} data
 */
export function schedulePrice (goodsId, data) {
  return axios({
    url: api.schedulePrice.replace('{id}', goodsId),
    method: 'post',
    data
  })
}
export function getScheduledPrice (goodsId, params) {
  return axios({
    url: api.schedulePrice.replace('{id}', goodsId),
    method: 'get',
    params
  })
}
export function editScheduledPrice (goodsId, scheduleId, params) {
  return axios({
    url: api.editSchedulePrice.replace('{id}', goodsId).replace('{schedule_id}', scheduleId),
    method: 'patch',
    params
  })
}
export function deleteScheduledPrice (goodsId, scheduleId, params) {
  return axios({
    url: api.editSchedulePrice.replace('{id}', goodsId).replace('{schedule_id}', scheduleId),
    method: 'delete',
    params
  })
}
