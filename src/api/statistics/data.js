import { axios } from '@/utils/request'

const api = {
  overall: '/statistic',
  total: '/statistic/total',
  today: '/statistic/today',
  pending: '/statistic/pending',
  survey: '/statistics/survey',
  orders_daily: '/summary/orders',
}

/**
 * 数据统计主页
 * @param {*} params
 */
export function overall (params) {
  return axios({
    url: api.overall,
    method: 'get',
    params
  })
}

/**
 * 数据概况
 * @param {*} params
 */
export function total (params) {
  return axios({
    url: api.total,
    method: 'get',
    params
  })
}
export function today (params) {
  return axios({
    url: api.today,
    method: 'get',
    params
  })
}
export function pending (params) {
  return axios({
    url: api.pending,
    method: 'get',
    params
  })
}
export function survey (params) {
  return axios({
    url: api.survey,
    method: 'get',
    params
  })
}

/**
 * 每日订单数据
 * @param {*} params
 */
export function orders_daily (params) {
  return axios({
    url: api.orders_daily,
    method: 'get',
    params
  })
}
