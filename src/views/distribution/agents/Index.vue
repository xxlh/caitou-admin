<template>
  <div>
    <a-card bordered="false">
    <div class="table-search">
      <a-form layout="inline">
        <a-form-item label="关键词">
          <a-input
            v-model="query.keyword"
            placeholder="昵称或用户ID"
            allowClear
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="等级">
          <a-select
            v-model="query.level"
            placeholder="全部"
            allowClear
            style="width: 120px"
          >
            <a-select-option :value="1">LV1</a-select-option>
            <a-select-option :value="2">LV2</a-select-option>
            <a-select-option :value="3">LV3</a-select-option>
            <a-select-option :value="4">LV4</a-select-option>
            <a-select-option :value="5">LV5</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="负责人">
          <a-select
            v-model="query.manager_id"
            placeholder="全部"
            allowClear
            showSearch
            :filterOption="false"
            :loading="managerLoading"
            style="width: 200px"
            @search="handleManagerSearch"
          >
            <a-select-option
              v-for="manager in managerOptions"
              :key="manager.id"
              :value="manager.id"
            >
              {{ manager.name || manager.username || ('#' + manager.id) }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="loadData(true)">查询</a-button>
          <a-button style="margin-left: 8px" icon="reload" @click="reset">重置</a-button>
        </a-form-item>
      </a-form>
      <div style="margin-top: 16px" v-if="$auth('distribution.agents.manage')">
        <a-button type="primary" icon="user-add" @click="openPromoteModal">
          从用户提升为分销员
        </a-button>
      </div>
    </div>

    <a-table
      :columns="columns"
      :dataSource="list"
      :loading="loading"
      :pagination="pagination"
      :scroll="{ x: 1200 }"
      rowKey="user_id"
      @change="handleTableChange"
    >
      <span slot="commission" slot-scope="text, record">
        {{ formatCommissionWithCount(record, 'total') }}
      </span>
      <span slot="downlineCommission" slot-scope="text, record">
        {{ formatCommissionWithCount(record, 'downline') }}
      </span>
      <span slot="teamMembers" slot-scope="text, record">
        {{ (record.first_members_count || 0) + (record.second_members_count || 0) + (record.third_members_count || 0) }}
      </span>
      <span slot="managers" slot-scope="text, record">
        <template v-if="record.managerScopes && record.managerScopes.length">
          {{ record.managerScopes.map(item => item.manager?.name || item.manager?.username || ('#' + item.member_id)).join('、') }}
        </template>
        <template v-else>-</template>
      </span>
      <span slot="levelSelect" slot-scope="text, record">
        <a-select
          v-if="$auth('distribution.agents.manage')"
          size="small"
          :value="record.level || 1"
          style="width: 100px"
          @change="value => handleLevelChange(record, value)"
        >
          <a-select-option v-for="lvl in [1,2,3,4,5]" :key="lvl" :value="lvl">LV{{ lvl }}</a-select-option>
        </a-select>
        <span v-else>LV{{ record.level || 1 }}</span>
      </span>
      <span slot="actions" slot-scope="text, record">
        <a @click="openDetail(record)">查看数据</a>
        <template v-if="$auth('distribution.agents.manage')">
          <a-divider type="vertical" />
          <a @click="openChangeLeaderModal(record)">修改上级</a>
        </template>
      </span>
    </a-table>
  </a-card>

  <a-drawer
    :visible="detailVisible"
    :width="720"
    :title="detailTitle"
    destroyOnClose
    @close="closeDetail"
  >
    <template v-if="currentAgent">
      <div class="detail-toolbar">
        <span>统计范围：</span>
        <a-select v-model="detailRange" style="width: 120px" @change="handleDetailRangeChange">
          <a-select-option value="7d">近7天</a-select-option>
          <a-select-option value="30d">近30天</a-select-option>
          <a-select-option value="90d">近90天</a-select-option>
        </a-select>
      </div>

      <a-spin :spinning="detailLoading">
        <div v-if="detailSummary" class="summary-grid">
          <div class="summary-card">
            <div class="label">收入合计</div>
            <div class="value">￥{{ toAmount(detailSummary.income) }}</div>
          </div>
          <div class="summary-card">
            <div class="label">已入账</div>
            <div class="value">￥{{ toAmount(detailSummary.accounted) }}</div>
          </div>
          <div class="summary-card">
            <div class="label">团队流水</div>
            <div class="value">￥{{ toAmount(detailSummary.turnover) }}</div>
          </div>
          <div class="summary-card">
            <div class="label">订单数</div>
            <div class="value">{{ detailSummary.order_count || 0 }}</div>
          </div>
          <div class="summary-card">
            <div class="label">分享次数</div>
            <div class="value">{{ detailSummary.share_count || 0 }}</div>
          </div>
          <div class="summary-card">
            <div class="label">团队人数</div>
            <div class="value">{{ detailSummary.member_total || 0 }}</div>
          </div>
        </div>

        <a-table
          v-if="detailSeries.length"
          :columns="detailColumns"
          :dataSource="detailSeries"
          :pagination="false"
          size="small"
          rowKey="date"
          style="margin-top: 16px"
        />
        <a-empty v-else description="暂无数据" />
      </a-spin>
    </template>
  </a-drawer>

  <!-- 修改上级分销员的模态框 -->
  <a-modal
    title="修改上级分销员"
    :visible="changeLeaderVisible"
    :confirmLoading="changeLeaderLoading"
    :maskClosable="false"
    @ok="handleChangeLeader"
    @cancel="closeChangeLeaderModal"
    width="600px"
  >
    <a-form layout="vertical">
      <a-alert 
        v-if="currentChangeAgent" 
        type="info" 
        showIcon
        style="margin-bottom: 16px"
      >
        <template slot="message">
          <div>
            <strong>当前分销员：</strong>
            {{ currentChangeAgent.user_nickname || '未设置昵称' }} (ID: {{ currentChangeAgent.user_id }})
            <div style="margin-top: 4px; color: #666">
              当前上级：{{ currentChangeAgent.first_leader ? ('ID: ' + currentChangeAgent.first_leader) : '无（顶级分销员）' }}
            </div>
          </div>
        </template>
      </a-alert>
      
      <a-form-item label="新上级分销员">
        <a-select
          v-model="changeLeaderForm.first_leader"
          showSearch
          allowClear
          placeholder="搜索分销员昵称/ID，留空则设为顶级分销员"
          :filterOption="false"
          :loading="leaderSearchLoading"
          @search="handleLeaderSearch"
          style="width: 100%"
        >
          <a-select-option 
            v-for="agent in leaderOptions" 
            :key="agent.user_id" 
            :value="agent.user_id"
            :disabled="currentChangeAgent && agent.user_id === currentChangeAgent.user_id"
          >
            {{ agent.user_nickname || '未设置昵称' }} (ID: {{ agent.user_id }}) - LV{{ agent.level }}
          </a-select-option>
        </a-select>
        <div style="margin-top: 8px; color: #999; font-size: 12px">
          留空或清除选择，该分销员将成为顶级分销员（无上级）
        </div>
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 提升用户为分销员的模态框 -->
  <a-modal
    title="提升用户为分销员"
    :visible="promoteVisible"
    :confirmLoading="promoteLoading"
    :maskClosable="false"
    @ok="handlePromote"
    @cancel="closePromoteModal"
    width="600px"
  >
    <a-form layout="vertical">
      <a-form-item label="选择用户" required>
        <a-select
          v-model="promoteForm.user_id"
          showSearch
          placeholder="搜索用户昵称/ID/手机号"
          :filterOption="false"
          :loading="userSearchLoading"
          :notFoundContent="userSearchLoading ? undefined : '输入关键词搜索用户'"
          @search="handleUserSearch"
          style="width: 100%"
        >
          <a-select-option 
            v-for="user in userOptions" 
            :key="user.id" 
            :value="user.id"
          >
            <div style="display: flex; align-items: center">
              <a-avatar 
                :src="user.avatar_url" 
                size="small" 
                style="margin-right: 8px"
              >
                {{ user.nickname ? user.nickname.charAt(0) : 'U' }}
              </a-avatar>
              <span>{{ user.nickname || '未设置昵称' }} (ID: {{ user.id }})</span>
            </div>
          </a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item label="推荐人（可选）">
        <a-select
          v-model="promoteForm.referrer_id"
          showSearch
          allowClear
          placeholder="可选，搜索已有分销员作为推荐人"
          :filterOption="false"
          :loading="referrerSearchLoading"
          @search="handleReferrerSearch"
          style="width: 100%"
        >
          <a-select-option 
            v-for="agent in referrerOptions" 
            :key="agent.user_id" 
            :value="agent.user_id"
          >
            {{ agent.user_nickname }} (ID: {{ agent.user_id }}) - LV{{ agent.level }}
          </a-select-option>
        </a-select>
        <div style="margin-top: 8px; color: #999; font-size: 12px">
          如果不选择推荐人，该用户将成为顶级分销员
        </div>
      </a-form-item>
      
      <a-alert 
        v-if="selectedUser" 
        type="info" 
        showIcon
        style="margin-top: 16px"
      >
        <template slot="message">
          <div>
            <strong>即将提升用户：</strong>
            <div style="margin-top: 8px">
              {{ selectedUser.nickname || '未设置昵称' }} (ID: {{ selectedUser.id }})
            </div>
            <div v-if="selectedUser.phone" style="margin-top: 4px">
              手机：{{ selectedUser.phone }}
            </div>
          </div>
        </template>
      </a-alert>
    </a-form>
  </a-modal>

  </div>
</template>

<script>
import moment from 'moment'
import { axios } from '@/utils/request'
import {
  fetchAgents,
  fetchManagers,
  updateAgent,
  fetchAgentDetailStats,
  createAgent
} from '@/api/distribution/index'

export default {
  data () {
    return {
      loading: false,
      list: [],
      query: {
        page: 1,
        per_page: 10,
        keyword: undefined,
        level: undefined,
        manager_id: undefined
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`
      },
      columns: [
        { title: '用户ID', dataIndex: 'user_id' },
        { title: '昵称', dataIndex: 'user_nickname' },
        { title: '等级', dataIndex: 'level', scopedSlots: { customRender: 'levelSelect' } },
        { title: '直属成员', dataIndex: 'first_members_count' },
        { title: '团队成员', scopedSlots: { customRender: 'teamMembers' } },
        { title: '负责人', scopedSlots: { customRender: 'managers' } },
        { title: '累计佣金/单量', scopedSlots: { customRender: 'commission' } },
        { title: '下线佣金/单量', scopedSlots: { customRender: 'downlineCommission' } },
        {
          title: '创建时间',
          dataIndex: 'created_at',
          customRender: (text) => this.formatDate(text)
        },
        { title: '操作', scopedSlots: { customRender: 'actions' }, width: 160 }
      ],
      detailColumns: [
        { title: '日期', dataIndex: 'date' },
        { title: '收入', dataIndex: 'income', customRender: text => `￥${Number(text || 0).toFixed(2)}` },
        { title: '已入账', dataIndex: 'accounted', customRender: text => `￥${Number(text || 0).toFixed(2)}` },
        { title: '流水', dataIndex: 'turnover', customRender: text => `￥${Number(text || 0).toFixed(2)}` },
        { title: '订单数', dataIndex: 'order_count' },
        { title: '分享数', dataIndex: 'share_count' },
        { title: '团队人数', dataIndex: 'member_total' }
      ],
      managerOptions: [],
      managerCache: {},
      managerLoading: false,
      managerSearchKeyword: '',
      detailVisible: false,
      detailLoading: false,
      detailSummary: null,
      detailSeries: [],
      detailRange: '30d',
      currentAgent: null,
      
      // 提升用户为分销员相关
      promoteVisible: false,
      promoteLoading: false,
      promoteForm: {
        user_id: undefined,
        referrer_id: undefined
      },
      userOptions: [],
      referrerOptions: [],
      userSearchLoading: false,
      referrerSearchLoading: false,
      
      // 修改上级分销员相关
      changeLeaderVisible: false,
      changeLeaderLoading: false,
      changeLeaderForm: {
        first_leader: undefined
      },
      currentChangeAgent: null,
      leaderOptions: [],
      leaderSearchLoading: false
    }
  },
  computed: {
    detailTitle () {
      if (!this.currentAgent) {
        return '分销员数据'
      }
      const nickname = this.currentAgent.user_nickname || ''
      return nickname
        ? `分销员 #${this.currentAgent.user_id}（${nickname}）`
        : `分销员 #${this.currentAgent.user_id}`
    },
    selectedUser () {
      return this.userOptions.find(u => u.id === this.promoteForm.user_id)
    }
  },
  mounted () {
    this.loadData(true)
    this.loadManagers()
  },
  methods: {
    normalizeManagerInfo (raw) {
      if (!raw || raw.id === undefined || raw.id === null) return null
      const id = Number(raw.id)
      if (!Number.isFinite(id) || id <= 0) return null
      return {
        id,
        name: raw.name,
        username: raw.username
      }
    },
    cacheManagerOption (raw) {
      const option = this.normalizeManagerInfo(raw)
      if (!option) return null
      this.managerCache[option.id] = option
      return option
    },
    ensureSelectedManagerOption () {
      const rawId = this.query.manager_id
      if (rawId === undefined || rawId === null) return
      const numericId = Number(rawId)
      if (!Number.isFinite(numericId)) {
        this.query.manager_id = undefined
        return
      }
      if (this.query.manager_id !== numericId) {
        this.query.manager_id = numericId
      }
      const exists = this.managerOptions.find(item => item.id === numericId)
      if (!exists) {
        const cached = this.managerCache[numericId]
        if (cached) {
          this.managerOptions = [cached, ...this.managerOptions]
        }
      }
    },
    async loadData (reset = false) {
      if (reset) {
        this.query.page = 1
        this.pagination.current = 1
      }
      this.loading = true
      try {
        const params = { ...this.query }
        if (params.manager_id !== undefined && params.manager_id !== null) {
          const numericId = Number(params.manager_id)
          if (Number.isFinite(numericId)) {
            params.manager_id = numericId
            this.query.manager_id = numericId
          } else {
            delete params.manager_id
            this.query.manager_id = undefined
          }
        }
        const res = await fetchAgents(params)
        const data = (res.data || []).map(item => ({
          ...item,
          managerScopes: item.managerScopes || []
        }))
        this.list = data
        this.pagination = {
          ...this.pagination,
          current: res.current_page || 1,
          pageSize: res.per_page || this.query.per_page,
          total: res.total || 0
        }
        this.syncManagerOptionsFromList()
      } catch (error) {
        this.$message.error(error?.msg || '加载失败')
      } finally {
        this.loading = false
      }
    },
    async loadManagers (keyword) {
      this.managerLoading = true
      this.managerSearchKeyword = keyword || ''
      try {
        const res = await fetchManagers({ per_page: 50, page: 1, keyword })
        const options = []
        const dataList = res.data || []
        dataList.forEach(item => {
          const option = this.cacheManagerOption(item)
          if (option) {
            options.push(option)
          }
        })
        this.managerOptions = options
        this.ensureSelectedManagerOption()
      } catch (error) {
        this.$message.error(error?.msg || '负责人加载失败')
      } finally {
        this.managerLoading = false
      }
    },
    syncManagerOptionsFromList () {
      this.list.forEach(agent => {
        (agent.managerScopes || []).forEach(scope => {
          const option = this.cacheManagerOption({
            id: scope.member_id,
            name: scope.manager?.name,
            username: scope.manager?.username
          })
          if (option && !this.managerSearchKeyword) {
            const exists = this.managerOptions.find(item => item.id === option.id)
            if (!exists) {
              this.managerOptions = [...this.managerOptions, option]
            }
          }
        })
      })
      this.ensureSelectedManagerOption()
    },
    handleManagerSearch (value) {
      this.loadManagers(value)
    },
    handleTableChange (pagination) {
      this.query.page = pagination.current
      this.query.per_page = pagination.pageSize
      this.loadData()
    },
    reset () {
      this.query.keyword = undefined
      this.query.level = undefined
      this.query.manager_id = undefined
      this.loadData(true)
    },
    async handleLevelChange (record, level) {
      const targetLevel = Number(level)
      if (!targetLevel || targetLevel === record.level) return
      try {
        await updateAgent(record.user_id, { level: targetLevel })
        this.$message.success('等级已更新')
        record.level = targetLevel
      } catch (error) {
        this.$message.error(error?.msg || '更新失败')
      }
    },
    formatDate (date) {
      if (!date) return '-'
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    toAmount (value) {
      return Number(value || 0).toFixed(2)
    },
    formatCommissionWithCount (record, type) {
      let commission = 0
      let orderCount = 0
      
      if (type === 'total') {
        // 累计佣金 = 分享佣金 + 下级佣金
        commission = (Number(record.share_member_commission_amount) || 0) +
                    (Number(record.first_member_commission_amount) || 0) +
                    (Number(record.second_member_commission_amount) || 0) +
                    (Number(record.third_member_commission_amount) || 0)
        // 累计单量 = 分享单量 + 下级单量
        orderCount = (Number(record.share_member_orders) || 0) +
                    (Number(record.first_member_orders) || 0) +
                    (Number(record.second_member_orders) || 0) +
                    (Number(record.third_member_orders) || 0)
      } else if (type === 'downline') {
        // 下线佣金 = 下级 + 下下级 + 下下下级佣金
        commission = (Number(record.first_member_commission_amount) || 0) +
                    (Number(record.second_member_commission_amount) || 0) +
                    (Number(record.third_member_commission_amount) || 0)
        // 下线单量 = 下级 + 下下级 + 下下下级单量
        orderCount = (Number(record.first_member_orders) || 0) +
                    (Number(record.second_member_orders) || 0) +
                    (Number(record.third_member_orders) || 0)
      }
      
      const commissionText = '￥' + this.toAmount(commission)
      const countText = orderCount > 0 ? ' / ' + orderCount : ' / 0'
      return commissionText + countText
    },
    openDetail (record) {
      this.currentAgent = record
      this.detailVisible = true
      this.detailRange = '30d'
      this.loadAgentDetail()
    },
    async loadAgentDetail () {
      if (!this.currentAgent) return
      this.detailLoading = true
      try {
        const res = await fetchAgentDetailStats({
          agent_id: this.currentAgent.user_id,
          range: this.detailRange
        })
        this.detailSummary = res?.summary ? { ...res.summary } : null
        this.detailSeries = (res?.series || []).map(item => ({
          date: item.date,
          income: Number(item.income || 0),
          accounted: Number(item.accounted || 0),
          turnover: Number(item.turnover || 0),
          order_count: Number(item.order_count || 0),
          share_count: Number(item.share_count || 0),
          member_total: Number(item.member_total || 0)
        }))
      } catch (error) {
        this.$message.error(error?.msg || '统计数据获取失败')
        this.detailSummary = null
        this.detailSeries = []
      } finally {
        this.detailLoading = false
      }
    },
    handleDetailRangeChange (value) {
      this.detailRange = value
      this.loadAgentDetail()
    },
    closeDetail () {
      this.detailVisible = false
      this.detailLoading = false
      this.currentAgent = null
      this.detailSummary = null
      this.detailSeries = []
      this.detailRange = '30d'
    },

    // === 提升用户为分销员相关方法 ===
    
    /**
     * 打开提升用户模态框
     */
    openPromoteModal () {
      this.promoteVisible = true
      this.promoteForm = { 
        user_id: undefined, 
        referrer_id: undefined 
      }
      this.userOptions = []
      this.referrerOptions = []
    },
    
    /**
     * 关闭提升用户模态框
     */
    closePromoteModal () {
      this.promoteVisible = false
      this.promoteForm = { 
        user_id: undefined, 
        referrer_id: undefined 
      }
      this.userOptions = []
      this.referrerOptions = []
    },
    
    /**
     * 搜索用户
     */
    async handleUserSearch (keyword) {
      if (!keyword || keyword.trim().length < 2) {
        this.userOptions = []
        return
      }
      
      this.userSearchLoading = true
      try {
        const res = await axios.get('/users', {
          params: { 
            keyword: keyword.trim(), 
            per_page: 20 
          }
        })
        this.userOptions = res.data || []
      } catch (error) {
        this.$message.error('搜索用户失败: ' + (error?.msg || ''))
        this.userOptions = []
      } finally {
        this.userSearchLoading = false
      }
    },
    
    /**
     * 搜索推荐人（分销员）
     */
    async handleReferrerSearch (keyword) {
      this.referrerSearchLoading = true
      try {
        const res = await fetchAgents({ 
          keyword: keyword || undefined, 
          per_page: 50 
        })
        this.referrerOptions = res.data || []
      } catch (error) {
        this.$message.error('搜索推荐人失败')
        this.referrerOptions = []
      } finally {
        this.referrerSearchLoading = false
      }
    },
    
    /**
     * 提升用户为分销员
     */
    async handlePromote () {
      if (!this.promoteForm.user_id) {
        this.$message.warning('请选择要提升的用户')
        return
      }
      
      this.promoteLoading = true
      try {
        const params = {
          user_id: this.promoteForm.user_id
        }
        
        // 如果选择了推荐人，添加到参数中
        if (this.promoteForm.referrer_id) {
          params.referrer_id = this.promoteForm.referrer_id
        }
        
        await createAgent(params)
        
        this.$message.success('提升成功！该用户已成为分销员')
        this.closePromoteModal()
        this.loadData(true) // 刷新列表
      } catch (error) {
        this.$message.error(error?.msg || '提升失败，该用户可能已经是分销员')
      } finally {
        this.promoteLoading = false
      }
    },

    // === 修改上级分销员相关方法 ===
    
    /**
     * 打开修改上级模态框
     */
    openChangeLeaderModal (record) {
      this.currentChangeAgent = record
      this.changeLeaderForm = {
        first_leader: record.first_leader || undefined
      }
      this.leaderOptions = []
      this.changeLeaderVisible = true
      
      // 如果当前有上级，预加载上级信息
      if (record.first_leader) {
        this.preloadCurrentLeader(record.first_leader)
      }
    },
    
    /**
     * 关闭修改上级模态框
     */
    closeChangeLeaderModal () {
      this.changeLeaderVisible = false
      this.currentChangeAgent = null
      this.changeLeaderForm = { first_leader: undefined }
      this.leaderOptions = []
    },
    
    /**
     * 预加载当前上级信息
     */
    async preloadCurrentLeader (leaderId) {
      try {
        const res = await fetchAgents({ 
          keyword: String(leaderId), 
          per_page: 10 
        })
        const agents = res.data || []
        const currentLeader = agents.find(a => a.user_id === leaderId)
        if (currentLeader && !this.leaderOptions.find(o => o.user_id === leaderId)) {
          this.leaderOptions = [currentLeader, ...this.leaderOptions]
        }
      } catch (error) {
        console.error('预加载上级信息失败:', error)
      }
    },
    
    /**
     * 搜索上级分销员
     */
    async handleLeaderSearch (keyword) {
      this.leaderSearchLoading = true
      try {
        const res = await fetchAgents({ 
          keyword: keyword || undefined, 
          per_page: 50 
        })
        this.leaderOptions = res.data || []
      } catch (error) {
        this.$message.error('搜索分销员失败')
        this.leaderOptions = []
      } finally {
        this.leaderSearchLoading = false
      }
    },
    
    /**
     * 提交修改上级
     */
    async handleChangeLeader () {
      if (!this.currentChangeAgent) {
        return
      }
      
      const newLeader = this.changeLeaderForm.first_leader || null
      const oldLeader = this.currentChangeAgent.first_leader || null
      
      // 如果没有变化，直接关闭
      if (newLeader === oldLeader) {
        this.$message.info('上级未发生变化')
        this.closeChangeLeaderModal()
        return
      }
      
      // 不能设置自己为自己的上级
      if (newLeader && newLeader === this.currentChangeAgent.user_id) {
        this.$message.error('不能将自己设为自己的上级')
        return
      }
      
      this.changeLeaderLoading = true
      try {
        await updateAgent(this.currentChangeAgent.user_id, {
          first_leader: newLeader
        })
        
        const msg = newLeader 
          ? '上级分销员已修改' 
          : '已设置为顶级分销员（无上级）'
        this.$message.success(msg)
        this.closeChangeLeaderModal()
        this.loadData() // 刷新列表
      } catch (error) {
        this.$message.error(error?.msg || '修改上级失败')
      } finally {
        this.changeLeaderLoading = false
      }
    }
  }
}
</script>


<style lang="less" scoped>
.table-search {
  margin-bottom: 16px;
}

// 操作区链接间距
::v-deep .ant-table-tbody td {
  a + .ant-divider-vertical {
    margin: 0 8px;
  }
}

.detail-toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  span {
    margin-right: 8px;
    color: #666;
  }
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;

  .summary-card {
    background: #f6ffed;
    border: 1px solid #b7eb8f;
    border-radius: 6px;
    padding: 12px;

    .label {
      color: #666;
      font-size: 12px;
    }

    .value {
      margin-top: 6px;
      font-size: 18px;
      font-weight: 600;
      color: #389e0d;
    }
  }
}
</style>
