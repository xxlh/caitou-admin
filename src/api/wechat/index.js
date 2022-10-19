import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  qrcode: 'wechat/qrcode?uri={uri}',
}

/**
 * 获取页面路径二维码
 */
export function qrcode (uri) {
  return axios({
    url: api.qrcode.replace('{uri}', uri),
    method: 'get',
  })
}
