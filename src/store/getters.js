const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  storeId: state => state.user.currentStoreId,
  areaId: state => state.user.info.stores.filter(s => s.id == state.user.currentStoreId)?.[0]?.delivery_area_id,
  // avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  role: state => state.user.info.current_role,
  roles: state => state.user.info.roles || [],
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  // 站点配置文件
  publicConfig: () => window.publicConfig
}

export default getters
