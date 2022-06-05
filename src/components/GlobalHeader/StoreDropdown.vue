<template>
  <a-dropdown v-if="current" placement="bottomRight">
    <span class="ant-pro-account-avatar oneline-hide">
      <!-- <a-avatar size="small" src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" class="antd-pro-global-header-index-avatar" /> -->
      <a-icon type="bank" :style="{ fontSize: '16px', marginRight: '5px' }"></a-icon>
      <span>{{ current.name || current.id }}</span>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item v-for="store in stores" :key="store.id" @click="handleSelect(store.id)">
          <a-icon type="bank" />{{ store.name || current.id }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>
import { Modal } from 'ant-design-vue'
import storage from 'store'
import { CURRENT_STORE_ID } from '@/store/mutation-types'

export default {
  name: 'StoreDropdown',
  props: {
    stores: {
      type: Array,
      default: () => null
    },
  },
  data () {
    const currentStoreId = this.$store.state.user.currentStoreId
    return {
      current: this.stores.filter(s => s.id == currentStoreId)[0],
    }
  },
  methods: {
    handleSelect (id) {
      this.$store.commit('SET_CURRENT_STORE_ID', id)
      this.current = this.stores.filter(s => s.id == id)[0]
      // 应该都刷新，不刷新无法刷新权限路由表
      if (/(goods|store|page)/.test(this.$route.path)) window.location.reload()
    },
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    padding: 0px 24px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 130px;
    padding-left: 20px;
     font-size: @font-size-base;
  }
}
</style>
