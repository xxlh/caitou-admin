<template>
  <div>
    <a-card bordered="false">
      <div class="filter-bar">
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
        </a-form>
      </div>

      <a-spin :spinning="loading">
        <div class="overview-grid">
          <div class="overview-card">
            <div class="label">团队佣金</div>
            <div class="value">￥{{ toAmount(summary.team_commission_amount) }}</div>
          </div>
          <div class="overview-card">
            <div class="label">团队流水</div>
            <div class="value">￥{{ toAmount(summary.team_paid_amount) }}</div>
          </div>
          <div class="overview-card">
            <div class="label">团队订单数</div>
            <div class="value">{{ summary.team_order_count || 0 }}</div>
          </div>
          <div class="overview-card">
            <div class="label">团队人数</div>
            <div class="value">{{ totalMembers }}</div>
          </div>
        </div>

        <div class="member-grid">
          <div class="member-card">
            <div class="label">一级下线</div>
            <div class="value">{{ summary.members.first || 0 }}</div>
          </div>
          <div class="member-card">
            <div class="label">二级下线</div>
            <div class="value">{{ summary.members.second || 0 }}</div>
          </div>
          <div class="member-card">
            <div class="label">三级下线</div>
            <div class="value">{{ summary.members.third || 0 }}</div>
          </div>
        </div>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import teamSelectorMixin from '@/views/distribution/teams/mixins/teamSelector'
import { fetchTeamSummary } from '@/api/distribution/index'

export default {
  name: 'DistributionTeamData',
  mixins: [teamSelectorMixin],
  data () {
    return {
      loading: false,
      summary: {
        team_commission_amount: 0,
        team_order_count: 0,
        team_paid_amount: 0,
        members: {
          first: 0,
          second: 0,
          third: 0
        }
      }
    }
  },
  computed: {
    totalMembers () {
      const { first = 0, second = 0, third = 0 } = this.summary.members || {}
      return Number(first || 0) + Number(second || 0) + Number(third || 0)
    }
  },
  methods: {
    async onTeamChange () {
      await this.loadSummary()
    },
    async loadSummary () {
      if (!this.teamLeaderId) return
      this.loading = true
      try {
        const res = await fetchTeamSummary({ team_leader_id: this.teamLeaderId })
        this.summary = {
          team_commission_amount: res?.team_commission_amount || 0,
          team_order_count: res?.team_order_count || 0,
          team_paid_amount: res?.team_paid_amount || 0,
          members: {
            first: res?.members?.first || 0,
            second: res?.members?.second || 0,
            third: res?.members?.third || 0
          }
        }
      } catch (error) {
        this.$message.error(error?.msg || '加载团队数据失败')
      } finally {
        this.loading = false
      }
    },
    toAmount (value) {
      const num = Number(value || 0)
      return Number.isFinite(num) ? num.toFixed(2) : '0.00'
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

.member-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.member-card {
  background: #f6ffed;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #b7eb8f;

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
</style>
