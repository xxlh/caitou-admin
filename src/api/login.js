import { axios } from '@/utils/request'

const apiPath = {
  login: '/auth/signin',
  logout: '/auth/signout',
  loginWework: '/auth/wework',
}

/**
 * 用户登录
 * @param {*} data
 */
export function login (data) {
  return axios({
    url: apiPath.login,
    method: 'post',
    data
  })
}

export function logout () {
  return axios({
    url: apiPath.logout,
    method: 'post'
  })
}

/**
 * 企业微信用户登录
 * @param {*} data
 */
export function loginWework (data) {
  return axios({
    url: apiPath.loginWework,
    method: 'post',
    data
  })
}
