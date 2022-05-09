import { axios } from '@/utils/request'

const apiPath = {
  login: '/auth/signin',
  logout: '/auth/signout'
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
