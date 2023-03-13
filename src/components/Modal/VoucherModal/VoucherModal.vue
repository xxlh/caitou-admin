<template>
  <a-modal
    class="noborder"
    :title="title"
    :width="820"
    :visible="visible"
    :isLoading="isLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <!-- 搜索板块 -->
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="优惠券名称">
            <a-input v-decorator="['title']" placeholder="请输入优惠券名称" />
          </a-form-item>
          <a-form-item label="优惠券类型">
            <a-select
              :options="types"
              :dropdownStyle="{ maxHeight: '500px', overflow: 'auto' }"
              allowClear
              v-decorator="['type', {initialValue: ''}]"
            ></a-select>
          </a-form-item>
          <a-form-item class="search-btn">
            <a-button type="primary" icon="search" html-type="submit">搜索</a-button>
          </a-form-item>
        </a-form>
      </a-row>
    </div>
    <s-table
      ref="table"
      :scroll="{ y: '420px', scrollToFirstRowOnChange: true }"
      :rowKey="fieldName"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :rowSelection="rowSelection"
      :pageSize="15"
    >
      <!-- 类型 -->
      <span slot="type" slot-scope="text, item">
        <a-tag :color="text == 'disoucnt' ? 'yellow' : 'orange'">{{ item.type_name }}</a-tag>
      </span>
      <!-- 优惠力度 -->
      <template slot="save" slot-scope="item">
        <span v-if="item.type == 'discount'">{{ item.save_amount }}</span>
        <span v-else-if="item.type == 'percent'">{{ item.off_percent }}</span>
      </template>
    </s-table>
  </a-modal>
</template>

<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import cloneDeep from 'lodash.clonedeep'
import * as CouponApi from '@/api/market/coupon'
import CategoryModel from '@/common/model/Category'
import { STable, GoodsItem } from '@/components/Table'

// table表头
const columns = [
  {
    title: '优惠券ID',
    dataIndex: 'id'
  },
  {
    title: '类型',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '名称',
    dataIndex: 'title'
  },
  {
    title: '优惠力度',
    scopedSlots: { customRender: 'save' }
  },
  {
    title: '满减条件',
    dataIndex: 'amount_limit'
  },
]

export default {
  name: 'VoucherModal',
  props: {
    // 多选模式, 如果false为单选
    multiple: PropTypes.bool.def(true),
    // 最大选择的数量限制, multiple模式下有效
    maxNum: PropTypes.integer.def(100),
    // 默认选中的列表记录
    defaultList: PropTypes.array.def({}),
    // 参数
    params: [],
  },
  components: {
    STable,
    GoodsItem
  },
  data () {
    return {
      // 对话框标题
      title: '优惠券池',
      // modal(对话框)是否可见
      visible: false,
      // loading状态
      isLoading: false,
      // 当前表单元素
      searchForm: this.$form.createForm(this),
      // 查询参数
      queryParam: {},
      // table表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return CouponApi.list({ ...param, ...this.params, ...this.queryParam, ...this.$store.getters.storeId ? {store_id:this.$store.getters.storeId} : {} })
          .then(response => {
            return response
          })
      },
      // 主键ID字段名
      fieldName: 'id',
      // 已选择的元素
      selectedRowKeys: [],
      // 已选择的列表记录
      selectedItems: [],
      // 商品分类列表
      types: [
        {label:'全部', value:''},
        {label:'满减券', value:'discount'},
        {label:'折扣券', value:'percent'},
        {label:'运费券', value:'freight'},
        {label:'赠品券', value:'gift'},
        {label:'免单券', value:'free'},
      ]
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  created () {
  },
  methods: {

    // 显示对话框
    handle () {
      // 显示窗口
      this.visible = true
      this.$nextTick(() => {
        // 刷新列表数据
        // this.handleRefresh(true)
        // 设置默认数据
        this.setDefaultValue()
      })
    },

    // 设置默认数据
    setDefaultValue () {
      const { fieldName, defaultList } = this
      if (defaultList.length) {
        this.selectedItems = cloneDeep(defaultList)
        this.selectedRowKeys = defaultList.map(item => item[fieldName])
      }
    },

    // 选中项发生变化时的回调
    onSelectChange (selectedRowKeys, newSelectedItems) {
      const { selectedItems } = this
      this.selectedRowKeys = selectedRowKeys
      this.selectedItems = this.createSelectedItems(selectedRowKeys, selectedItems, newSelectedItems)
    },

    /**
     * 生成已选中的元素列表
     * @param array selectedRowKeys 当前已选中的ID集
     * @param array oldSelectedItems 已选择的列表记录 (change前)
     * @param array newSelectedItems 已选择的列表记录 (change后)
     */
    createSelectedItems (selectedRowKeys, oldSelectedItems, newSelectedItems) {
      const { fieldName } = this
      const selectedItems = []
      oldSelectedItems.forEach(item => {
        if (selectedRowKeys.includes(item[fieldName])) {
          selectedItems.push(item)
        }
      })
      const oldSelectedKeys = oldSelectedItems.map(item => item[fieldName])
      newSelectedItems.forEach(item => {
        if (!oldSelectedKeys.includes(item[fieldName]) && selectedRowKeys.includes(item[fieldName])) {
          selectedItems.push(item)
        }
      })
      return selectedItems
    },

    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh (bool = false) {
      this.$refs.table.refresh(true)
    },

    // 确认搜索
    handleSearch (e) {
      e.preventDefault()
      this.searchForm.validateFields((error, values) => {
        if (!error) {
          this.queryParam = { ...this.queryParam, ...values }
          this.handleRefresh(true)
        }
      })
    },

    // 关闭对话框事件
    handleCancel () {
      this.visible = false
      this.queryParam = {}
      this.searchForm.resetFields()
      this.selectedRowKeys = []
      this.selectedItems = []
    },

    // 确认按钮
    handleSubmit (e) {
      e.preventDefault()
      // 通知父端组件提交完成了
      this.$emit('handleSubmit', {
        selectedItems: this.selectedItems,
        selectedRowKeys: this.selectedRowKeys
      })
      // 关闭对话框
      this.handleCancel()
    }

  }
}
</script>

<style lang="less" scoped>
.ant-modal-root {
  background: #ccc;
  /deep/.ant-modal-body {
    padding-bottom: 8px;
  }
  /deep/.ant-modal-footer {
    padding-top: 0;
  }
}
// 搜索表单
.search-form {
  /deep/.ant-form-item-control-wrapper {
    min-width: 180px;
  }
}
</style>
