import { axios } from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  image: '/medias',
  video: '/medias',
  presign: '/medias/presign',
  complete: '/medias/{id}/complete'
}

/**
 * 上传图片
 * @param {*} data
 */
export function image (data) {
  return axios({
    url: api.image,
    method: 'post',
    data
  })
}

/**
 * 上传视频
 * @param {*} data
 */
export function video (data) {
  return axios({
    url: api.video,
    method: 'post',
    data
  })
}

/**
 * 获取直传签名
 * @param {*} data
 */
export function presign (data) {
  return axios({
    url: api.presign,
    method: 'post',
    data
  })
}

/**
 * 直传完成确认
 * @param {*} id
 */
export function complete (id) {
  return axios({
    url: api.complete.replace('{id}', id),
    method: 'post'
  })
}
