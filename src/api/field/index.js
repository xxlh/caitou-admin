import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/fields',
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
