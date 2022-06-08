import storage from 'store'
import { login, logout } from '@/api/login'
import { getInfo } from '@/api/store/user'
import { ACCESS_TOKEN, CURRENT_STORE_ID } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import _ from 'lodash'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    // avatar: '',
    roles: {

    },
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_CURRENT_STORE_ID: (state, storeId) => {
      state.currentStoreId = storeId
      storage.set(CURRENT_STORE_ID, storeId)
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {

    // 用户登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(response => {
            const data = response
            // token保存7天
            storage.set(ACCESS_TOKEN, `${data.token_type} ${data.token}`, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', `${data.token_type} ${data.token}`)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        let currentStoreId = storage.get(CURRENT_STORE_ID)
        getInfo({store_id: currentStoreId}).then(response => {
          const data = response
          // 处理选中store
          if (!currentStoreId) currentStoreId = data.stores.length ? data.stores[0].id : null
          if (!data.stores.filter(s => s.id == currentStoreId).length) currentStoreId = null
          commit('SET_CURRENT_STORE_ID', currentStoreId)
          commit('SET_ROLES', data.roles)
          // data.current_role = data.roles.filter(r => r.store_id == currentStoreId)
          // data.current_role = data.current_role.length > 0 ? data.current_role[0] : data.roles.filter(r => r.store_id == null);
          // data.current_role = data.current_role.length > 0 ? data.current_role[0] : data.roles[0];
          commit('SET_INFO', data)
          commit('SET_NAME', { name: data.name, welcome: welcome() })
          // commit('SET_AVATAR', result.avatar)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出登录
    Logout ({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            // 清理用户信息
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            storage.remove(ACCESS_TOKEN)
            resolve()
          })
      })
    },

    // 超管后台自动登录
    SuperLogin ({ commit }, loginInfo) {
      // token保存7天
      storage.set(ACCESS_TOKEN, loginInfo['token'], 7 * 24 * 60 * 60 * 1000)
      commit('SET_TOKEN', loginInfo['token'])
    }

  }
}

export default user
