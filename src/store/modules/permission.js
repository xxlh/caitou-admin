import { asyncRouterMap, constantRouterMap } from '@/config/router.config'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 * @param permissions
 * @param routePermissions
 * @returns {boolean}
 */
export function hasPermission (rolePermissions, routePermissions) {
  if (!routePermissions) return true
  for (let i = 0, len = routePermissions.length; i < len; i++) {
    const p = routePermissions[i]
    let permisionInRole = false
    rolePermissions?.forEach(permission => {
      if (matchPermission(p, permission.name)) permisionInRole = true
    })
    if (!permisionInRole) return false
  }
  return true
}
function matchPermission (permission, toMatch) {
  const parts = toMatch.split('.')
  const perParts = permission.split('.')
  let isMatched = true
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] == '*') continue
    if (!perParts[i]) continue
    if (perParts[i] == '*') continue // 与后端不一致，后端被判断的权限name的*代表all而不是any
    if (parts[i] == perParts[i]) continue
    isMatched = false
  }
  return isMatched
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole (roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

/**
 * 递归过滤有访问权限的路由
 * @param {*} routerMap 路由表 router.config.js
 * @param {*} roles 角色权限
 */
function filterAsyncRouter (routerMap, roles) {
  const accessedRouters = routerMap.filter(route => {
    if (!route.meta || hasPermission(roles.permissions, route.meta.permission)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

/**
 * 根据角色获取有访问权限的路由
 * @param {*} routerMap
 * @param {*} roles
 */
function getAccessRouter (routerMap, roles) {
  // "超级管理员" 代表超级管理员, 拥有所有权限
  // 根据角色过滤有访问权限的路由
  const accessedRouters = roles.name == "超级管理员" ? routerMap : filterAsyncRouter(routerMap, roles)
  // 动态设置一级菜单的redirect
  return setPrimaryMenuRedirect(accessedRouters)
}

/**
 * 动态设置一级菜单的redirect
 * @param {*} routers
 * @param {*} roles
 */
function setPrimaryMenuRedirect (routerMap) {
  const oneList = routerMap[0].children
  oneList.forEach(oneItem => {
    // 设置二级菜单的redirect
    const twoList = oneItem.children != null ? oneItem.children : []
    twoList.forEach(twoItem => {
      const treeList = twoItem.children != null ? twoItem.children : []
      const childrenPaths = treeList.map(item => item.path)
      if (childrenPaths.length > 0) {
        if (!twoItem.redirect || childrenPaths.indexOf(twoItem.redirect) === -1) {
          twoItem.redirect = childrenPaths[0]
        }
      }
    })
    // 设置一级菜单的redirect
    const childrenPaths = oneItem.children != null ? oneItem.children.map(item => item.path) : []
    if (childrenPaths.length > 0) {
      // 如果未设置redirect, 则默认取第一个path
      // 如果设置了redirect, 判断是否有权限, 无权限则取第一个path
      if (!oneItem.redirect || childrenPaths.indexOf(oneItem.redirect) === -1) {
        oneItem.redirect = childrenPaths[0]
      }
    }
  })

  // 默认的首页
  return setIndexRedirect(routerMap)
}

/**
 * 设置默认的首页
 * @param {*} routerMap
 */
function setIndexRedirect (routerMap) {
  const root = routerMap[0]
  if (root.children && root.children.length) {
    const item = root.children[0]
    root.redirect = item.redirect != null ? item.redirect : item.path
  } else {
    root.redirect = '/404'
  }
  return routerMap
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {

    /**
     * 生成路由表
     * @param {*} param
     * @param {*} data
     */
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const { current_role } = data
        // 根据角色获取有访问权限的路由
        const accessedRouters = getAccessRouter(asyncRouterMap, current_role)
        commit('SET_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      })
    }

  }
}

export default permission
