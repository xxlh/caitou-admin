import { Reducer } from 'redux';
import { Effect } from 'dva';
import { stringify } from 'querystring';
import { router } from 'umi';

import { accountLogin } from '@/services/login';
import { getPageQuery } from '@/utils/utils';
import request from '@/utils/request';
// import defaultSettings from '../../config/defaultSettings';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
  token?: string;
  message?: string;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

let token = localStorage.getItem("token") || '';

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
    token,
  },

  effects: {
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(accountLogin, payload);
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
      
        // Login successfully
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        if (redirect == '/user/login') redirect = '/';
        router.replace(redirect || '/');
      } catch (err) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'error',
            message: err.data.msg,
          },
        });
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      let token = payload.token ? payload.token_type + ' ' + payload.token : '';
	  localStorage.setItem('token', token);
	  request.extendOptions({ 
		headers: {
			Authorization: token,
		},
		});
      return {
        ...state,
        status: payload.status || 'ok',
        type: 'account',
        message: payload.message,
        token : token,
      };
    },
  },
};

export default Model;
