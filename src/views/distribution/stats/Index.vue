<template>
  <div>
    <a-card bordered="false">
    <div class="filter-bar">
      <a-form layout="inline">
        <a-form-item label="日期范围">
          <a-range-picker
            v-model="query.dateRange"
            allowClear
            style="width: 260px"
            @change="handleDateChange"
          />
        </a-form-item>
        <a-form-item>
          <a-radio-group v-model="query.rangePreset" @change="handlePresetChange">
            <a-radio-button value="7d">近7天</a-radio-button>
            <a-radio-button value="30d">近30天</a-radio-button>
            <a-radio-button value="90d">近90天</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="排名指标">
          <a-select v-model="query.metric" style="width: 140px" @change="loadRanking">
            <a-select-option value="income">预计收入</a-select-option>
            <a-select-option value="turnover">成交流水</a-select-option>
            <a-select-option value="order_count">订单数</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="分销员ID">
          <a-input
            v-model="query.agentId"
            placeholder="精确匹配"
            allowClear
            style="width: 160px"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" icon="reload" @click="reset">重置</a-button>
        </a-form-item>
      </a-form>
    </div>

    <div class="overview-grid">
      <div class="overview-card">
        <div class="label">预计收入</div>
        <div class="value">￥{{ toAmount(overview.income) }}</div>
      </div>
      <div class="overview-card">
        <div class="label">成交流水</div>
        <div class="value">￥{{ toAmount(overview.turnover) }}</div>
      </div>
      <div class="overview-card">
        <div class="label">订单数</div>
        <div class="value">{{ overview.order_count || 0 }}</div>
      </div>
      <div class="overview-card">
        <div class="label">有效分销员</div>
        <div class="value">{{ overview.agent_count || 0 }}</div>
      </div>
    </div>

    <a-row :gutter="16" style="margin-top: 16px">
      <a-col :span="8">
        <a-card title="分销员排行榜" bordered="false" size="small" :loading="rankingLoading">
          <a-table
            :columns="rankingColumns"
            :dataSource="ranking"
            size="small"
            rowKey="user_id"
            :pagination="false"
          />
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card title="日维度统计" bordered="false" size="small">
          <a-table
            :columns="dailyColumns"
            :dataSource="dailyList"
            :loading="dailyLoading"
            :pagination="dailyPagination"
            rowKey="id"
            size="small"
            @change="handleDailyChange"
          >
            <template slot="agent" slot-scope="text, record">
              <span>#{{ record.user_id }} {{ resolveNickname(record.user_id, record.nickname) }}</span>
            </template>
            <template slot="actions" slot-scope="text, record">
              <a @click="openDetail(record)">查看趋势</a>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </a-card>

  <a-drawer
    :visible="detailVisible"
    :title="detailTitle"
    :width="720"
    destroyOnClose
    @close="closeDetail"
  >
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
          <div class="label">成交流水</div>
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
      />
      <a-empty v-else description="暂无数据" />
    </a-spin>
  </a-drawer>
  </div>
</template>

<script>
import moment from 'moment'
import {
  fetchAgentStatsOverall,
  fetchAgentStatsRanking,
  fetchAgentStatsDaily,
  fetchAgentDetailStats
} from '@/api/distribution/index'

export default {
  data () {
    return {
      query: {
        dateRange: [],
        rangePreset: '30d',
        metric: 'income',
        agentId: undefined,
        page: 1,
        per_page: 10
      },
      overview: {
        income: 0,
        turnover: 0,
        order_count: 0,
        agent_count: 0
      },
      ranking: [],
      rankingLoading: false,
      rankingColumns: [
        { title: '排名', dataIndex: 'rank', width: 70, customRender: (text, record, index) => index + 1 },
        {
          title: '分销员',
          dataIndex: 'user_id',
          customRender: (text) => `#${text} ${this.resolveNickname(text)}`
        },
        { title: '预计收入', dataIndex: 'income', customRender: text => `￥${this.toAmount(text)}` },
        { title: '成交流水', dataIndex: 'turnover', customRender: text => `￥${this.toAmount(text)}` },
        { title: '订单数', dataIndex: 'order_count' }
      ],
      dailyList: [],
      dailyLoading: false,
      dailyPagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`
      },
      dailyColumns: [
        { title: '日期', dataIndex: 'date' },
        { title: '分销员', dataIndex: 'user_id', scopedSlots: { customRender: 'agent' } },
        { title: '等级', dataIndex: 'level', customRender: text => `LV${text || 1}` },
        { title: '预计收入', dataIndex: 'income', customRender: text => `￥${this.toAmount(text)}` },
        { title: '成交流水', dataIndex: 'turnover', customRender: text => `￥${this.toAmount(text)}` },
        { title: '订单数', dataIndex: 'order_count' },
        { title: '分享数', dataIndex: 'share_count' },
        { title: '操作', dataIndex: 'actions', scopedSlots: { customRender: 'actions' }, width: 100 }
      ],
      agentCache: {},
      detailVisible: false,
      detailLoading: false,
      detailSummary: null,
      detailSeries: [],
      detailColumns: [
        { title: '日期', dataIndex: 'date' },
        { title: '收入', dataIndex: 'income', customRender: text => `￥${this.toAmount(text)}` },
        { title: '已入账', dataIndex: 'accounted', customRender: text => `￥${this.toAmount(text)}` },
        { title: '流水', dataIndex: 'turnover', customRender: text => `￥${this.toAmount(text)}` },
        { title: '订单数', dataIndex: 'order_count' },
        { title: '分享数', dataIndex: 'share_count' },
        { title: '团队人数', dataIndex: 'member_total' }
      ],
      detailRange: '30d',
      currentAgent: null
    }
  },
  computed: {
    detailTitle () {
      if (!this.currentAgent) return '分销员数据'
      const nickname = this.resolveNickname(this.currentAgent.user_id, this.currentAgent.nickname)
      return nickname
        ? `分销员 #${this.currentAgent.user_id}（${nickname}）`
        : `分销员 #${this.currentAgent.user_id}`
    }
  },
  mounted () {
    this.applyPreset('30d')
    this.loadOverview()
    this.loadRanking()
    this.loadDaily(true)
  },
  methods: {
    resolveNickname (userId, fallback) {
      const cached = this.agentCache[userId]
      return cached?.nickname || cached?.user_nickname || fallback || ''
    },
    toAmount (value) {
      return Number(value || 0).toFixed(2)
    },
    formatDate (date) {
      if (!date) return '-'
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    getDateParams () {
      if (!this.query.dateRange || this.query.dateRange.length !== 2) return {}
      const [start, end] = this.query.dateRange
      return {
        date_between: [
          start.startOf('day').format('YYYY-MM-DD'),
          end.endOf('day').format('YYYY-MM-DD')
        ]
      }
    },
    applyPreset (preset) {
      this.query.rangePreset = preset
      const end = moment()
      let start
      switch (preset) {
        case '7d':
          start = end.clone().subtract(6, 'days')
          break
        case '90d':
          start = end.clone().subtract(89, 'days')
          break
        default:
          start = end.clone().subtract(29, 'days')
          break
      }
      this.query.dateRange = [start.startOf('day'), end.endOf('day')]
    },
    handlePresetChange (e) {
      this.applyPreset(e.target.value)
      this.handleSearch()
    },
    handleDateChange () {
      this.query.rangePreset = undefined
    },
    async loadOverview () {
      try {
        const params = { ...this.getDateParams() }
        const res = await fetchAgentStatsOverall(params)
        if (res) {
          this.overview = {
            income: Number(res.income || 0),
            turnover: Number(res.turnover || 0),
            order_count: Number(res.order_count || 0),
            agent_count: Number(res.agent_count || 0)
          }
        }
      } catch (error) {
        this.$message.error(error?.msg || '概览数据加载失败')
      }
    },
    async loadRanking () {
      this.rankingLoading = true
      try {
        const params = {
          metric: this.query.metric,
          limit: 20,
          ...this.getDateParams()
        }
        const res = await fetchAgentStatsRanking(params)
        this.ranking = (res || []).map((item, index) => ({
          ...item,
          rank: index + 1
        }))
      } catch (error) {
        this.$message.error(error?.msg || '排行榜加载失败')
      } finally {
        this.rankingLoading = false
      }
    },
    async loadDaily (reset = false) {
      if (reset) {
        this.query.page = 1
        this.dailyPagination.current = 1
      }
      this.dailyLoading = true
      try {
        const params = {
          page: this.query.page,
          per_page: this.query.per_page,
          ...this.getDateParams()
        }
        if (this.query.agentId) {
          const id = Number(this.query.agentId)
          if (Number.isFinite(id)) params.user_id = id
        }
        const res = await fetchAgentStatsDaily(params)
        const data = (res.data || []).map(item => ({
          ...item,
          id: `${item.date || ''}-${item.user_id}`
        }))
        this.dailyList = data
        this.dailyPagination = {
          ...this.dailyPagination,
          current: res.current_page || this.query.page,
          pageSize: res.per_page || this.query.per_page,
          total: res.total || 0
        }
        this.addAgentsToCache(data)
      } catch (error) {
        this.$message.error(error?.msg || '日统计加载失败')
      } finally {
        this.dailyLoading = false
      }
    },
    addAgentsToCache (agents) {
      (agents || []).forEach(agent => {
        const id = Number(agent.user_id)
        if (!Number.isFinite(id) || id <= 0) return
        this.agentCache[id] = {
          ...this.agentCache[id],
          ...agent,
          user_id: id,
          nickname: agent.nickname || agent.user_nickname
        }
      })
    },
    handleDailyChange (pagination) {
      this.query.page = pagination.current
      this.query.per_page = pagination.pageSize
      this.loadDaily()
    },
    handleSearch () {
      this.loadOverview()
      this.loadRanking()
      this.loadDaily(true)
    },
    reset () {
      this.query.dateRange = []
      this.query.rangePreset = '30d'
      this.query.metric = 'income'
      this.query.agentId = undefined
      this.applyPreset('30d')
      this.handleSearch()
    },
    openDetail (record) {
      this.currentAgent = {
        user_id: record.user_id,
        nickname: record.nickname || record.user_nickname
      }
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
        if (this.detailSummary?.nickname) {
          this.agentCache[this.currentAgent.user_id] = {
            ...(this.agentCache[this.currentAgent.user_id] || {}),
            nickname: this.detailSummary.nickname
          }
        }
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
    }
  }
}
</script>

<style lang="less" scoped>
.filter-bar {
  margin-bottom: 16px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.overview-card {
  background: #f3f6ff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #d6e4ff;

  .label {
    color: #666;
    font-size: 12px;
  }

  .value {
    margin-top: 8px;
    font-size: 20px;
    font-weight: 600;
    color: #2f54eb;
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
