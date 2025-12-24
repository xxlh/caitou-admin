<template>
  <div class="container">
    <a-spin :spinning="isLoading">
      <!-- 工作区 -->
      <div class="work-content">
        <!-- 组件库 -->
        <Components @handleClickItem="onAddItem" />
        <!--手机容器-->
        <Phone
          v-if="!isLoading"
          :data="data"
          :selectedIndex="selectedIndex"
          @onEditer="onEditer"
          @onDeleleItem="onDeleleItem"
        />
        <!-- 编辑器 -->
        <Editor
          v-if="!isLoading"
          :defaultData="defaultData"
          :data="data"
          :selectedIndex="selectedIndex"
          :curItem="curItem"
          :pageId="parseInt(pageId)"
        />
      </div>
      <!-- 操作栏 -->
      <div class="footer">
        <div class="footer-content">
          <a-button type="primary" :loading="isLoading" @click="onFormSubmit">保存</a-button>
          <!-- <a-button>另存为</a-button> -->
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import _ from 'lodash'
import draggable from 'vuedraggable'
import { inArray } from '@/utils/util'
import * as Api from '@/api/page'
import { SelectImage } from '@/components'
import { Components, Phone, Editor } from './modules'

export default {
  components: {
    SelectImage,
    draggable,
    Components,
    Phone,
    Editor
  },
  data () {
    return {
      // loading状态
      isLoading: false,
      // 页面装修默认数据
      defaultData: {},
      // 当前页面数据
      data: { page: {}, items: [] },
      // 当前选中的元素索引
      selectedIndex: 'page',
      // 当前选中的元素
      curItem: {},
      // 当前页面ID
      pageId: null
    }
  },
  // 初始化数据
  created () {
    // 记录页面ID
    this.pageId = this.$route.query.pageId
    // 获取初始化数据
    this.initData()
  },
  methods: {

    // 获取初始化数据
    initData () {
      this.isLoading = true
      Promise.all([
        // 获取默认数据
        this.getDefaultData(),
        // 获取当前页面数据
        this.getPageData()
      ]).then(() => {
        this.isLoading = false
      })
    },

    // 获取默认数据
    getDefaultData () {
      return new Promise((resolve, reject) => {
        Api.defaultData()
          .then(result => {
            this.defaultData = result
            resolve()
          })
      })
    },

    // 获取当前页面数据
    getPageData () {
      const { pageId } = this
      return new Promise((resolve, reject) => {
        Api.detail(pageId)
          .then(result => {
            this.data = result.data
            resolve()
          })
      })
    },

    /**
     * 新增Diy组件
     * @param type
     */
    onAddItem (type) {
      // 验证新增Diy组件
      if (!this.onCheckAddItem(type)) {
        return false
      }
      const { defaultData, data } = this
      // 复制默认diy组件数据
      const newItem = _.cloneDeep(defaultData.items[type])
      // 新增到diy列表数据
      data.items.push(newItem)
      // 编辑当前选中的元素
      this.onEditer(data.items.length - 1)
    },

    /**
     * 验证新增Diy组件
     * @param type
     */
    onCheckAddItem (type) {
      const { data } = this
      const itemsTypes = data.items.map(item => item.type)
      
      // 验证分类页组件的添加限制
      if (type === 'categorySubNav') {
        // 添加二级分类导航前，必须有一级分类导航
        if (!inArray('categoryNav', itemsTypes)) {
          this.$message.warning('请先添加「一级分类导航」组件')
          return false
        }
        // 二级分类导航只能存在一个
        if (inArray('categorySubNav', itemsTypes)) {
          this.$message.warning('「二级分类导航」组件最多只能存在一个')
          return false
        }
      }
      
      if (type === 'categoryProductList') {
        // 添加商品列表前，建议有一级分类导航（但不强制）
        // 如果没有一级分类导航，给出提示
        if (!inArray('categoryNav', itemsTypes)) {
          const confirmed = confirm('建议先添加「一级分类导航」组件，以便商品列表能够根据分类筛选。是否继续添加？')
          if (!confirmed) {
            return false
          }
        }
        // 商品列表只能存在一个
        if (inArray('categoryProductList', itemsTypes)) {
          this.$message.warning('「分类商品列表」组件最多只能存在一个')
          return false
        }
      }
      // 验证xx组件只能存在一个
      if (type === 'xxx') {
        const itemsTypes = data.items.map(item => item.type)
        if (inArray(type, itemsTypes)) {
          this.$message.warning('该组件最多存在一个')
          return false
        }
      }
      return true
    },

    /**
     * 编辑当前选中的Diy元素
     * @param index
     */
    onEditer (index) {
      const { data } = this
      // 记录当前选中元素的索引
      this.selectedIndex = index
      // 当前选中的元素数据
      this.curItem = index === 'page' ? data.page
        : data.items[index]
    },

    /**
     * 删除diy元素
     * @param index
     */
    onDeleleItem (index) {
      const { data: { items } } = this
      items.splice(index, 1)
      this.selectedIndex = -1
    },

    /**
     * 编辑器：重置颜色
     * @param holder
     * @param attribute
     * @param color
     */
    onEditorResetColor (holder, attribute, color) {
      holder[attribute] = color
    },

    // 提交到后端api
    onFormSubmit () {
      this.isLoading = true
      const { pageId, data, $message } = this
      const name = data.page.params.name
      const type = data.page.params.type
      data.items.map(item => {
        if (item.type == 'goods' && item.params.source == 'choice') item.params.loadmore = false
      })
      Api.edit(pageId, { data, ...name?{name}:{}, ...type?{type}:{} })
        .then(result => {
          // 显示成功
          $message.success('更新成功', 1.5)
          // 跳转到列表页
          setTimeout(() => {
            this.$router.push('./index')
          }, 1200)
        })
        .catch(res => {
          $message.error(res.msg, 3)
        })
        .finally(() => {
          setTimeout(() => {
            this.isLoading = false
          }, 1500)
        })
    }

  }
}
</script>
<style lang="less" scoped>
@import './style.less';
</style>