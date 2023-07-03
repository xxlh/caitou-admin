import Vue from 'vue'
import store from '@/store'
import { hasPermission } from '@/store/modules/permission'

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:create >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/sendya/ant-design-pro-vue/pull/53
 */
const action = Vue.directive('action', {
  inserted: function (el, binding, vnode) {
    // const actionName = binding.arg
    const actionName = binding.rawName.replace('v-action:', '')
    const role = store.getters.role
    if (role.name == "超级管理员") return
    let permission = actionName
    if (actionName.indexOf('.') == -1) {
      const elVal = vnode.context.$route.meta.permission
      const firstPermission = elVal.length && elVal[0] || elVal
      const permissionHead = firstPermission.split('.')[0]
      permission = `${permissionHead}.${actionName}`
    }
    let aa = hasPermission(role.permissions, [permission])
    if (hasPermission(role.permissions, [permission])) return
    // 无权限的话 抹除该元素
    el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
  }
})

export default action
