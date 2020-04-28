/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { httpErrorHandler } from './requestError'; // 移至dva最上层处理。目的为了在effect内如果做catch可以阻止dva上层统一错误捕获

/**
 * 配置request请求时的默认参数
 */
/* global BASE_URL */
const token: string = localStorage.getItem('token') || '';
const request = extend({
  prefix: BASE_URL,
  errorHandler: httpErrorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  headers: token
    ? {
        Authorization: token,
      }
    : {},
});

export default request;
