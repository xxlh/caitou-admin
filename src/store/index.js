import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// default router permission control
import permission from './modules/permission'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  state: {
    WEWORK_CORPID: 'wwab032cc648e1816d',
    WEWORK_AGENTID: process.env.NODE_ENV === 'production' ? '1000008' : '1000009',  // 需与后端配置对应
    AMap_securityJsCode: 'cc376bf07ec7a861cbfada9c7de5b86f',
    AMap_key: "8eed729112431178d5b9adaff42b33c1",
  },
  mutations: {

  },
  actions: {

  },
  getters
})
