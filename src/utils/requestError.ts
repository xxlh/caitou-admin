/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { notification } from 'antd';
import { router } from 'umi';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * HTTP底层异常处理，request.js接管
 */
const httpErrorHandler = (error: {
  response: Response;
  data: { code: number; msg: string };
  message: string;
}) => {
  const { response } = error;
  if (!response || !response.status) throw error.message;

  const errorText = codeMessage[response.status] || response.statusText;
  const errorTitle = error.data.msg || errorText;
  const { status } = response;

  if (status === 401 && window.location.pathname !== '/user/login') {
    localStorage.removeItem('token');
    router.push('/user/login');
    notification.error({
      message: errorTitle,
      description: errorText,
    });
  } else {
    throw error;
  }

  return error.data;
};

/**
 * 默认异常处理程序。dva/onError统一接管，unhandledrejection统一接管request promise
 */
const defaultErrorHandler = (error: {
  response: Response;
  data: { code: number; msg: string };
}) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const errorTitle = error.data.msg || errorText;

    notification.error({
      message: errorTitle,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return error.data;
};

export { httpErrorHandler, defaultErrorHandler };
