<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-button v-action:create type="primary" icon="plus" @click="handleAdd">新增</a-button>
    </div>
    <a-table
      v-if="!isLoading"
      rowKey="id"
      :columns="columns"
      :dataSource="categoryList"
      :defaultExpandAllRows="true"
      :expandIconColumnIndex="1"
      :pagination="false"
      :loading="isLoading"
    >
      <span slot="image" slot-scope="text">
        <img v-if="text" :src="text.preview_url" width="30" height="30" />
      </span>
      <!-- 状态 -->
      <span slot="status" slot-scope="text">
        <a-tag :color="text ? 'green' : ''">{{ text ? '显示' : '隐藏' }}</a-tag>
      </span>
      <span slot="action" slot-scope="text, item">
        <a v-action:update style="margin-right: 8px;" @click="handleEdit(item)">编辑</a>
        <a v-action:delete @click="handleDelete(item)">删除</a>
      </span>
    </a-table>
    <AddForm ref="AddForm" :categoryList="categoryList" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" :categoryList="categoryList" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/category'
import { STable } from '@/components'
import AddForm from './modules/AddForm'
import EditForm from './modules/EditForm'

export default {
  name: 'Index',
  components: {
    STable,
    AddForm,
    EditForm
  },
  data () {
    return {
      // 分类列表
      categoryList: [],
      // 查询参数
      queryParam: {},
      // 正在加载
      isLoading: false,
      // 表头
      columns: [
        {
          title: '分类ID',
          dataIndex: 'id'
        },
        {
          title: '分类名称',
          dataIndex: 'name'
        },
        {
          title: '分类图标',
          dataIndex: 'image',
          scopedSlots: { customRender: 'image' }
        },
        // {
        //   title: '状态',
        //   dataIndex: 'status',
        //   scopedSlots: { customRender: 'status' }
        // },
        {
          title: '添加时间',
          dataIndex: 'created_at'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '180px',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created () {
    // 获取分类列表
    this.getCategoryList()
  },
  methods: {

    /**
     * 获取分类列表
     */
    getCategoryList () {
      (this.isLoading = true)
      Api.list()
        .then(result => {
          this.categoryList = result
        })
        .finally(result => {
          this.isLoading = false
        })
    },

    /**
     * 新增记录
     */
    handleAdd () {
      this.$refs.AddForm.add()
    },

    /**
     * 编辑记录
     */
    handleEdit (item) {
      this.$refs.EditForm.edit(item)
    },

    /**
     * 删除记录
     */
    handleDelete (item) {
      const self = this
      const modal = this.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk () {
          return Api.deleted({ categoryId: item['id'] })
            .then((result) => {
              self.$message.success(result.message, 1.5)
              self.handleRefresh()
            })
            .finally(result => {
              modal.destroy()
            })
        }
      })
    },

    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh () {
      // 获取分类列表
      this.getCategoryList()
    }

  }
}
</script>
