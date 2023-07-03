<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row>
        <a-col :span="6">
          <a-button v-action:create type="primary" icon="plus" @click="handleAdd">新增</a-button>
        </a-col>
        <a-col :span="8" :offset="10">
          <a-input-search
            style="max-width: 300px; min-width: 150px;float: right;"
            v-model="queryParam.search"
            placeholder="请输入用户名/姓名"
            @search="onSearch"
          />
        </a-col>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <div slot="username" slot-scope="text, item">
        <span style="margin-right: 6px">{{ text }}</span>
        <a-tag v-if="item.role && item.role.name == '超级管理员'" color="green">超级管理员</a-tag>
      </div>
      <div slot="roles" slot-scope="text, item">
        <a-tag v-for="(role,index) in text" :key="index" :color="role.name == '超级管理员' ? 'green' : ''">
          {{role.name}} 
          <span v-if="role.name == '仓储管理员' && storeListById[role.store_id]"> ({{storeListById[role.store_id].name}})</span>
          <span v-if="role.name == '区域管理员' && areaListById[role.store_id]"> ({{areaListById[role.store_id].name}})</span>
        </a-tag>
      </div>
      <div class="actions" slot="action" slot-scope="text, item">
        <a v-action:update @click="handleEdit(item)">编辑</a>
        <template v-if="!item.role || item.role.name != '超级管理员'">
          <a v-action:update @click="handleAssign(item)">分配角色</a>
          <a v-action:delete @click="handleDelete(item)">删除</a>
        </template>
      </div>
    </s-table>
    <AddForm ref="AddForm" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
    <AssignForm ref="AssignForm" :roleList="roleList" :storeList="storeList" :areaList="areaList" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/store/user'
import * as RoleApi from '@/api/store/role'
import { STable } from '@/components'
import AddForm from './modules/AddForm'
import EditForm from './modules/EditForm'
import AssignForm from './modules/AssignForm'
import * as StoreApi from '@/api/store/address'
import * as AreaApi from '@/api/area'
import _ from 'lodash'

export default {
  name: 'Index',
  components: {
    STable,
    AddForm,
    EditForm,
    AssignForm,
  },
  data () {
    return {
      // 角色列表
      roleList: [],
      // 仓储列表
      storeList: [],
      storeListById: [],
      areaList: [],
      areaListById: [],
      // 查询参数
      queryParam: {},
      // 正在加载
      isLoading: false,
      // 表头
      columns: [
        {
          title: '管理员ID',
          dataIndex: 'id'
        },
        {
          title: '用户名',
          dataIndex: 'username',
          scopedSlots: { customRender: 'username' }
        },
        {
          title: '姓名',
          dataIndex: 'name'
        },
        {
          title: '角色',
          dataIndex: 'roles',
          scopedSlots: { customRender: 'roles' }
        },
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
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.list({ ...param, ...this.queryParam })
          .then(response => {
            return response
          })
      }
    }
  },
  created () {
    // 获取角色列表
    this.getRoleList()
    this.getStoreList()
    this.getAreaList()
  },
  methods: {

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
    handleAssign (item) {
      this.$refs.AssignForm.edit(item)
    },

    /**
     * 获取角色列表
     */
    getRoleList () {
      this.isLoading = true
      RoleApi.list()
        .then(result => {
          this.roleList = result.data
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    /**
     * 获取仓储列表
     */
    async getStoreList () {
      this.storeList = (await StoreApi.list()).data
      this.storeListById = _(this.storeList).keyBy('id').value();
    },
    async getAreaList () {
      this.areaList = (await AreaApi.list()).data
      this.areaListById = _(this.areaList).keyBy('id').value();
    },

    /**
     * 删除记录
     */
    handleDelete (item) {
      const app = this
      const modal = this.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk () {
          return Api.deleted({ userId: item['id'] })
            .then((result) => {
              app.$message.success(result.message, 1.5)
              app.handleRefresh()
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
    handleRefresh (bool = false) {
      this.$refs.table.refresh(bool)
    },

    /**
     * 检索查询
     */
    onSearch () {
      this.handleRefresh(true)
    }

  }
}
</script>
