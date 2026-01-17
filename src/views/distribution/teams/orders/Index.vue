<template>
  <div>
    <a-card bordered="false">
      <div class="table-search">
        <a-form layout="inline">
          <a-form-item label="团队">
            <a-select
              v-model="teamLeaderId"
              showSearch
              :filterOption="false"
              :loading="teamLoading"
              style="width: 240px"
              placeholder="选择团队长"
              @search="handleTeamSearch"
              @change="handleTeamChange"
            >
              <a-select-option
                v-for="option in teamOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="分销员ID">
            <a-input-number
              v-model="query.agent_user_id"
              :min="1"
              :precision="0"
              placeholder="分销员ID"
              style="width: 180px"
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
        :scroll="{ x: 1060 }"
        rowKey="id"
        @change="handleTableChange"
      >
        <template slot="orderNo" slot-scope="text, record">
          <div class="order-no">
            <div>#{{ record.id }}</div>
            <div class="sub">{{ record.no }}</div>
          </div>
        </template>
        <template slot="buyer" slot-scope="text, record">
          <div class="buyer-cell">
            <div>{{ record.user?.nickname || record.user?.name || record.user?.username || '未知用户' }}</div>
            <div class="sub">ID: {{ record.user_id }}</div>
          </div>
        </template>
        <template slot="amount" slot-scope="text, record">
          ￥{{ toAmount(record.total_amount) }}
        </template>
        <template slot="commission" slot-scope="text, record">
          ￥{{ toAmount(record.team_commission) }}
        </template>
        <template slot="agents" slot-scope="text, record">
          <div class="agent-commission-list">
            <div v-for="(agent, index) in getAgentCommissions(record)" :key="index" class="agent-commission-item">
              <span class="agent-name">{{ agent.nickname || `用户${agent.user_id}` }}</span>
              <span class="agent-level">({{ agent.levelLabel }})</span>
              <span class="agent-amount">获佣 ￥{{ toAmount(agent.amount) }}</span>
            </div>
            <div v-if="!getAgentCommissions(record).length" class="no-agent">-</div>
          </div>
        </template>
        <template slot="actions" slot-scope="text, record">
          <a @click="viewDetail(record)">查看</a>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import teamSelectorMixin from '@/views/distribution/teams/mixins/teamSelector'
import { fetchTeamOrders } from '@/api/distribution/index'

export default {
  name: 'DistributionTeamOrders',
  mixins: [teamSelectorMixin],
  data () {
    return {
      loading: false,
      list: [],
      query: {
        agent_user_id: undefined,
        page: 1,
        per_page: 20
      },
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0,
        showTotal: total => `共 ${total} 条`
      },
      columns: [
        { title: '订单', dataIndex: 'no', width: 160, scopedSlots: { customRender: 'orderNo' } },
        { title: '买家', dataIndex: 'user_id', width: 160, scopedSlots: { customRender: 'buyer' } },
        { title: '订单金额', dataIndex: 'total_amount', width: 120, scopedSlots: { customRender: 'amount' } },
        { title: '团队佣金', dataIndex: 'team_commission', width: 120, scopedSlots: { customRender: 'commission' } },
        { title: '分销员获佣', dataIndex: 'agents', width: 220, scopedSlots: { customRender: 'agents' } },
        { title: '下单时间', dataIndex: 'created_at', width: 180 },
        { title: '操作', dataIndex: 'actions', width: 100, scopedSlots: { customRender: 'actions' } }
      ]
    }
  },
  methods: {
    async onTeamChange () {
      this.query.agent_user_id = undefined
      await this.loadData(true)
    },
    async loadData (reset = false) {
      if (!this.teamLeaderId) return
      if (reset) {
        this.query.page = 1
        this.pagination.current = 1
      }
      this.loading = true
      try {
        const res = await fetchTeamOrders({
          team_leader_id: this.teamLeaderId,
          agent_user_id: this.query.agent_user_id || undefined,
          page: this.query.page,
          per_page: this.query.per_page
        })
        this.list = res.data || []
        this.pagination = {
          ...this.pagination,
          current: res.current_page || 1,
          pageSize: res.per_page || this.query.per_page,
          total: res.total || 0
        }
      } catch (error) {
        this.$message.error(error?.msg || '加载分销订单失败')
      } finally {
        this.loading = false
      }
    },
    reset () {
      this.query.agent_user_id = undefined
      this.loadData(true)
    },
    handleTableChange (pagination) {
      this.query.page = pagination.current
      this.query.per_page = pagination.pageSize
      this.loadData()
    },
    viewDetail (record) {
      if (!record?.id) return
      this.$router.push({ path: '/order/detail', query: { orderId: record.id } })
    },
    toAmount (value) {
      const num = Number(value || 0)
      return Number.isFinite(num) ? num.toFixed(2) : '0.00'
    },
    // 获取订单的分销员获佣信息
    getAgentCommissions (record) {
      const result = []
      const levelLabels = { 1: '一级', 2: '二级', 3: '三级' }

      // 从 rebates 或 commissions 中提取获佣信息
      const commissions = record.rebates || record.commissions || []
      if (Array.isArray(commissions) && commissions.length) {
        commissions.forEach(item => {
          if (item && item.amount > 0) {
            result.push({
              user_id: item.agent_user_id || item.user_id,
              nickname: item.agent_nickname || item.nickname || item.agent?.nickname,
              level: item.level || item.agent_level || 1,
              levelLabel: levelLabels[item.level || item.agent_level || 1] || `${item.level || 1}级`,
              amount: Number(item.amount || 0)
            })
          }
        })
      }

      // 如果没有 rebates/commissions，尝试从 rank_X_agent 字段提取
      if (!result.length) {
        ;[1, 2, 3].forEach(level => {
          const agent = record[`rank_${level}_agent`]
          const commission = record[`rank_${level}_commission`]
          if (agent && commission > 0) {
            result.push({
              user_id: agent.user_id || agent.id,
              nickname: agent.nickname || agent.name,
              level,
              levelLabel: levelLabels[level] || `${level}级`,
              amount: Number(commission || 0)
            })
          }
        })
      }

      return result
    }
  }
}
</script>

<style lang="less" scoped>
.table-search {
  margin-bottom: 16px;
}

.order-no {
  .sub {
    color: #999;
    font-size: 12px;
  }
}

.buyer-cell {
  .sub {
    color: #999;
    font-size: 12px;
  }
}

.agent-commission-list {
  .agent-commission-item {
    line-height: 1.8;
    font-size: 13px;

    .agent-name {
      color: #333;
      font-weight: 500;
    }

    .agent-level {
      color: #999;
      font-size: 12px;
      margin-left: 2px;
    }

    .agent-amount {
      color: #52c41a;
      margin-left: 4px;
    }
  }

  .no-agent {
    color: #999;
  }
}
</style>
