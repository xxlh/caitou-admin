<template>
  <div>
    <a-card bordered="false">
    <div class="table-search">
      <a-form layout="inline">
        <a-form-item label="关键词">
          <a-input
            v-model="query.keyword"
            placeholder="姓名或账号"
            allowClear
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="loadData(true)">查询</a-button>
          <a-button style="margin-left: 8px" icon="reload" @click="reset">重置</a-button>
        </a-form-item>
      </a-form>
    </div>

    <a-table
      :columns="columns"
      :dataSource="list"
      :loading="loading"
      :pagination="pagination"
      rowKey="id"
      @change="handleTableChange"
    >
      <span slot="agents" slot-scope="text, record">
        {{ record.managed_agent_count || 0 }}
      </span>
      <span slot="actions" slot-scope="text, record">
        <a @click="openAssignModal(record)">分配分销员</a>
        <a-divider type="vertical" />
        <a @click="openDrawer(record)">查看分销员</a>
      </span>
    </a-table>
  </a-card>

  <a-modal
    :visible="assignVisible"
    :title="modalTitle"
    :confirmLoading="assignSubmitting"
    width="640"
    destroyOnClose
    @ok="handleAssignSubmit"
    @cancel="closeAssignModal"
  >
    <a-form layout="vertical">
      <a-form-item label="选择分销员">
        <a-select
          v-model="selectedAgentIds"
          mode="multiple"
          showSearch
          :filterOption="false"
          :loading="agentsLoading"
          placeholder="输入昵称或ID搜索一级分销员"
          style="width: 100%"
          @search="handleAgentSearch"
        >
          <a-select-option
            v-for="option in agentOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>

    <div class="selected-list" v-if="selectedAgentDetails.length">
      <div class="selected-list__title">已选择 {{ selectedAgentDetails.length }} 位：</div>
      <a-table
        :columns="selectedColumns"
        :dataSource="selectedAgentDetails"
        :pagination="false"
        size="small"
        rowKey="user_id"
      />
    </div>
  </a-modal>

  <a-drawer
    :visible="drawerVisible"
    :title="drawerTitle"
    :width="720"
    destroyOnClose
    @close="closeDrawer"
  >
    <a-table
      :columns="drawerColumns"
      :dataSource="drawerData"
      :loading="drawerLoading"
      :pagination="drawerPagination"
      rowKey="user_id"
      size="middle"
      @change="handleDrawerChange"
    />
  </a-drawer>
  </div>
</template>

<script>
import moment from 'moment'
import {
  fetchManagers,
  assignAgentsToManager,
  fetchManagerAgents,
  fetchAgents
} from '@/api/distribution/index'

export default {
  data () {
    return {
      loading: false,
      list: [],
      query: {
        page: 1,
        per_page: 10,
        keyword: undefined
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`
      },
      columns: [
        { title: 'ID', dataIndex: 'id', width: 80 },
        { title: '姓名', dataIndex: 'name' },
        { title: '账号', dataIndex: 'username' },
        { title: '手机号', dataIndex: 'phone' },
        { title: '负责分销员', scopedSlots: { customRender: 'agents' }, width: 120 },
        { title: '操作', scopedSlots: { customRender: 'actions' }, width: 200 }
      ],
      assignVisible: false,
      assignSubmitting: false,
      currentManager: null,
      selectedAgentIds: [],
      selectedColumns: [
        { title: '用户ID', dataIndex: 'user_id', width: 100 },
        { title: '昵称', dataIndex: 'user_nickname' },
        { title: '等级', dataIndex: 'level', customRender: text => `LV${text || 1}` },
        { title: '加入时间', dataIndex: 'created_at', customRender: text => text ? moment(text).format('YYYY-MM-DD HH:mm') : '-' }
      ],
      agentOptions: [],
      agentCache: {},
      agentsLoading: false,
      agentSearchKeyword: '',
      assignedAgents: [],
      drawerVisible: false,
      drawerLoading: false,
      drawerData: [],
      drawerPagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`
      },
      drawerColumns: [
        { title: '用户ID', dataIndex: 'user_id', width: 100 },
        { title: '昵称', dataIndex: 'user_nickname' },
        { title: '等级', dataIndex: 'level', customRender: text => `LV${text || 1}` },
        { title: '直属成员', dataIndex: 'first_members_count' },
        { title: '团队成员', dataIndex: 'team_members', customRender: (text, record) => (record.first_members_count || 0) + (record.second_members_count || 0) + (record.third_members_count || 0) },
        { title: '创建时间', dataIndex: 'created_at', customRender: text => text ? moment(text).format('YYYY-MM-DD HH:mm') : '-' }
      ]
    }
  },
  computed: {
    selectedAgentDetails () {
      return this.selectedAgentIds
        .map(id => this.agentCache[id])
        .filter(item => !!item)
    },
    modalTitle () {
      if (!this.currentManager) return '分配分销员'
      const name = this.currentManager.name || this.currentManager.username || `#${this.currentManager.id}`
      return `分配分销员 - ${name}`
    },
    drawerTitle () {
      if (!this.currentManager) return '分销员列表'
      const name = this.currentManager.name || this.currentManager.username || `#${this.currentManager.id}`
      return `分销员列表 - ${name}`
    }
  },
  mounted () {
    this.loadData(true)
  },
  methods: {
    async loadData (reset = false) {
      if (reset) {
        this.query.page = 1
        this.pagination.current = 1
      }
      this.loading = true
      try {
        const res = await fetchManagers({ ...this.query })
        this.list = res.data || []
        this.pagination = {
          ...this.pagination,
          current: res.current_page || 1,
          pageSize: res.per_page || this.query.per_page,
          total: res.total || 0
        }
      } catch (error) {
        this.$message.error(error?.msg || '加载失败')
      } finally {
        this.loading = false
      }
    },
    reset () {
      this.query.keyword = undefined
      this.loadData(true)
    },
    handleTableChange (pagination) {
      this.query.page = pagination.current
      this.query.per_page = pagination.pageSize
      this.loadData()
    },
    addAgentsToCache (agents) {
      (agents || []).forEach(agent => {
        if (!agent) return
        const id = Number(agent.user_id || agent.id)
        if (!Number.isFinite(id) || id <= 0) return
        this.agentCache[id] = {
          ...this.agentCache[id],
          ...agent,
          user_id: id
        }
      })
    },
    buildAgentOption (agent) {
      if (!agent) return null
      const id = Number(agent.user_id)
      if (!Number.isFinite(id) || id <= 0) return null
      const label = agent.user_nickname ? `${agent.user_nickname} (#${id})` : `分销员 #${id}`
      return { value: id, label }
    },
    ensureSelectedAgentsOption () {
      const existingIds = new Set(this.agentOptions.map(item => item.value))
      this.selectedAgentIds.forEach(id => {
        if (!existingIds.has(id)) {
          const agent = this.agentCache[id]
          const option = this.buildAgentOption(agent)
          if (option) {
            this.agentOptions = [...this.agentOptions, option]
            existingIds.add(id)
          }
        }
      })
    },
    async openAssignModal (manager) {
      this.currentManager = manager
      this.assignVisible = true
      this.assignSubmitting = false
      this.agentOptions = []
      this.agentSearchKeyword = ''
      const ids = (manager.agent_ids || []).map(id => Number(id)).filter(id => Number.isFinite(id))
      this.selectedAgentIds = ids
      await this.loadAssignedAgents(manager.id)
      await this.loadAgentOptions()
      this.ensureSelectedAgentsOption()
    },
    closeAssignModal () {
      this.assignVisible = false
      this.assignSubmitting = false
      this.currentManager = null
      this.selectedAgentIds = []
      this.agentOptions = []
      this.assignedAgents = []
    },
    async loadAssignedAgents (managerId) {
      this.agentsLoading = true
      try {
        const res = await fetchManagerAgents(managerId, { per_page: 200, page: 1 })
        const list = (res.data || []).map(item => item.agent || item)
        this.assignedAgents = list
        this.addAgentsToCache(list)
        if (!this.selectedAgentIds.length) {
          const ids = list.map(agent => Number(agent.user_id)).filter(id => Number.isFinite(id))
          this.selectedAgentIds = ids
        }
        this.ensureSelectedAgentsOption()
      } catch (error) {
        this.$message.error(error?.msg || '加载当前分销员失败')
      } finally {
        this.agentsLoading = false
      }
    },
    async loadAgentOptions (keyword) {
      this.agentsLoading = true
      this.agentSearchKeyword = keyword || ''
      try {
        const res = await fetchAgents({ per_page: 100, page: 1, level: 1, keyword })
        const list = res.data || []
        this.addAgentsToCache(list)
        this.agentOptions = list
          .map(agent => this.buildAgentOption(agent))
          .filter(option => !!option)
        this.ensureSelectedAgentsOption()
      } catch (error) {
        this.$message.error(error?.msg || '分销员搜索失败')
      } finally {
        this.agentsLoading = false
      }
    },
    handleAgentSearch (value) {
      this.loadAgentOptions(value)
    },
    async handleAssignSubmit () {
      if (!this.currentManager) return
      this.assignSubmitting = true
      try {
        const agentIds = this.selectedAgentIds.map(id => Number(id)).filter(id => Number.isFinite(id))
        await assignAgentsToManager(this.currentManager.id, { agent_ids: agentIds })
        this.$message.success('分配成功')
        this.closeAssignModal()
        this.loadData()
      } catch (error) {
        this.$message.error(error?.msg || '分配失败')
      } finally {
        this.assignSubmitting = false
      }
    },
    async openDrawer (manager) {
      this.currentManager = manager
      this.drawerVisible = true
      this.drawerPagination.current = 1
      await this.loadDrawerData(1)
    },
    closeDrawer () {
      this.drawerVisible = false
      this.drawerData = []
      this.drawerLoading = false
    },
    async loadDrawerData (page = 1) {
      if (!this.currentManager) return
      this.drawerLoading = true
      try {
        const res = await fetchManagerAgents(this.currentManager.id, {
          per_page: this.drawerPagination.pageSize,
          page
        })
        const list = (res.data || []).map(item => item.agent || item)
        this.drawerData = list
        this.addAgentsToCache(list)
        this.drawerPagination = {
          ...this.drawerPagination,
          current: res.current_page || page,
          total: res.total || 0
        }
      } catch (error) {
        this.$message.error(error?.msg || '分销员列表加载失败')
      } finally {
        this.drawerLoading = false
      }
    },
    handleDrawerChange (pagination) {
      this.loadDrawerData(pagination.current)
    }
  }
}
</script>

<style lang="less" scoped>
.table-search {
  margin-bottom: 16px;
}

.selected-list {
  margin-top: 16px;

  &__title {
    margin-bottom: 8px;
    color: #666;
  }
}
</style>
