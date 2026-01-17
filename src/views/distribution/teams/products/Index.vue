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
          <a-form-item label="关键词">
            <a-input
              v-model="query.keyword"
              placeholder="商品名称"
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
        :scroll="{ x: 900 }"
        rowKey="product_id"
        @change="handleTableChange"
      >
        <template slot="product" slot-scope="text, record">
          <div class="product-cell">
            <img :src="record.image_url" class="product-image" alt="product" />
            <div class="product-info">
              <div class="title">{{ record.title }}</div>
              <div class="sub">ID: {{ record.product_id }}</div>
            </div>
          </div>
        </template>
        <template slot="pool" slot-scope="text, record">
          <a-tooltip>
            <template slot="title">
              <div>佣金池构成：{{ formatCommissionBreakdown(record.base_commission, record.commission_type) }}</div>
            </template>
            <span>{{ formatPool(record.pool, record.commission_type) }}</span>
          </a-tooltip>
        </template>
        <template slot="teamCommissionTotal" slot-scope="text, record">
          ￥{{ toAmount(record.team_commission_total) }}
        </template>
        <template slot="rank1" slot-scope="text, record">
          {{ formatCommissionValue(resolveRank1(record), record.commission_type) }}
        </template>
        <template slot="actions" slot-scope="text, record">
          <a @click="openModal(record)">重分配</a>
          <a-divider type="vertical" />
          <a v-if="record.team_commission" @click="handleClear(record)">清除</a>
        </template>
      </a-table>
    </a-card>

    <a-modal
      :visible="modal.visible"
      :title="modalTitle"
      :confirmLoading="modal.submitting"
      width="520px"
      destroyOnClose
      @ok="handleSubmit"
      @cancel="closeModal"
    >
      <div v-if="modal.product" class="modal-content">
        <div class="pool-info">
          <div>当前佣金池：{{ formatPool(modal.product.pool, modal.product.commission_type) }}</div>
          <div class="pool-detail">
            基础配置（{{ getBaseConfigSource(modal.product) }}）：{{ formatCommissionBreakdown(modal.product.base_commission, modal.product.commission_type) }}
          </div>
        </div>

        <a-form layout="vertical">
          <a-form-item label="二级佣金">
            <a-input-number
              v-model="modal.displayForm.rank_2"
              :min="0"
              :max="modalCommissionMax"
              :precision="2"
              style="width: 100%"
              :placeholder="getBaseCommissionDisplay(modal.product, 'rank_2')"
            />
            <span class="unit">{{ commissionUnit }}</span>
            <span class="hint-text">当前基础配置：{{ getBaseCommissionDisplay(modal.product, 'rank_2') }}{{ commissionUnit }}</span>
          </a-form-item>
          <a-form-item label="三级佣金">
            <a-input-number
              v-model="modal.displayForm.rank_3"
              :min="0"
              :max="modalCommissionMax"
              :precision="2"
              style="width: 100%"
              :placeholder="getBaseCommissionDisplay(modal.product, 'rank_3')"
            />
            <span class="unit">{{ commissionUnit }}</span>
            <span class="hint-text">当前基础配置：{{ getBaseCommissionDisplay(modal.product, 'rank_3') }}{{ commissionUnit }}</span>
          </a-form-item>
          <a-form-item label="一级佣金（自动计算）">
            <div class="rank1-value" :class="{ danger: rank1Negative }">
              {{ formatCommissionValueDisplay(modalRank1Display, modal.product.commission_type) }}
            </div>
            <div v-if="rank1Negative" class="danger-text">佣金池不足，请调整比例</div>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script>
import teamSelectorMixin from '@/views/distribution/teams/mixins/teamSelector'
import { fetchTeamProducts, updateTeamProductCommission } from '@/api/distribution/index'

export default {
  name: 'DistributionTeamProducts',
  mixins: [teamSelectorMixin],
  data () {
    return {
      loading: false,
      list: [],
      query: {
        keyword: undefined,
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
        { title: '商品', dataIndex: 'title', scopedSlots: { customRender: 'product' } },
        { title: '佣金池', dataIndex: 'pool', width: 120, scopedSlots: { customRender: 'pool' } },
        { title: '团队订单数', dataIndex: 'team_order_count', width: 120 },
        { title: '团队总佣金', dataIndex: 'team_commission_total', width: 130, scopedSlots: { customRender: 'teamCommissionTotal' } },
        { title: '一级佣金', dataIndex: 'rank1', width: 120, scopedSlots: { customRender: 'rank1' } },
        { title: '操作', dataIndex: 'actions', width: 150, scopedSlots: { customRender: 'actions' } }
      ],
      modal: {
        visible: false,
        submitting: false,
        product: null,
        form: {
          rank_2_commission: 0,
          rank_3_commission: 0
        },
        // 用于展示的百分比值
        displayForm: {
          rank_2: 0,
          rank_3: 0
        }
      }
    }
  },
  computed: {
    modalTitle () {
      if (!this.modal.product) return '佣金池重分配'
      return `佣金池重分配 - ${this.modal.product.title}`
    },
    // 计算展示用的一级佣金（百分比或金额）
    modalRank1Display () {
      if (!this.modal.product) return 0
      const type = this.modal.product.commission_type
      const pool = Number(this.modal.product.pool || 0)
      const poolDisplay = type === 'percent' ? this.toPercent(pool) : pool
      const rank2Display = Number(this.modal.displayForm.rank_2 || 0)
      const rank3Display = Number(this.modal.displayForm.rank_3 || 0)
      return Number((poolDisplay - rank2Display - rank3Display).toFixed(2))
    },
    // 实际存储值（小数）
    modalRank1 () {
      if (!this.modal.product) return 0
      const type = this.modal.product.commission_type
      const pool = Number(this.modal.product.pool || 0)
      if (type === 'percent') {
        const rank2 = this.fromPercent(this.modal.displayForm.rank_2)
        const rank3 = this.fromPercent(this.modal.displayForm.rank_3)
        return Number((pool - rank2 - rank3).toFixed(6))
      }
      const rank2 = Number(this.modal.displayForm.rank_2 || 0)
      const rank3 = Number(this.modal.displayForm.rank_3 || 0)
      return Number((pool - rank2 - rank3).toFixed(2))
    },
    rank1Negative () {
      return this.modalRank1Display < -0.01
    },
    commissionUnit () {
      const type = this.modal.product?.commission_type || 'percent'
      return type === 'percent' ? '%' : '元'
    },
    modalCommissionMax () {
      const type = this.modal.product?.commission_type || 'percent'
      return type === 'percent' ? 100 : undefined
    }
  },
  methods: {
    // 小数转百分比展示
    toPercent (value) {
      return Number(((Number(value) || 0) * 100).toFixed(2))
    },
    // 百分比转小数存储
    fromPercent (value) {
      return Number(((Number(value) || 0) / 100).toFixed(6))
    },
    // 获取基础配置来源说明
    getBaseConfigSource (product) {
      if (!product) return '系统配置'
      if (product.product_commission) return '商品配置'
      if (product.category_commission) return '分类配置'
      return '系统配置'
    },
    // 获取基础配置的展示值
    getBaseCommissionDisplay (product, rank) {
      if (!product) return 0
      const type = product.commission_type
      const base = product.base_commission || {}
      const value = Number(base[`${rank}_commission`] || 0)
      if (type === 'percent') {
        return this.toPercent(value)
      }
      return value
    },
    async onTeamChange () {
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
        const res = await fetchTeamProducts({
          team_leader_id: this.teamLeaderId,
          keyword: this.query.keyword || undefined,
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
        this.$message.error(error?.msg || '加载分销商品失败')
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
    openModal (record) {
      this.modal.product = record
      const current = record.team_commission || record.base_commission || {}
      const type = record.commission_type
      // 转换为展示值
      if (type === 'percent') {
        this.modal.displayForm = {
          rank_2: this.toPercent(current.rank_2_commission),
          rank_3: this.toPercent(current.rank_3_commission)
        }
      } else {
        this.modal.displayForm = {
          rank_2: Number(current.rank_2_commission || 0),
          rank_3: Number(current.rank_3_commission || 0)
        }
      }
      this.modal.form = {
        rank_2_commission: Number(current.rank_2_commission || 0),
        rank_3_commission: Number(current.rank_3_commission || 0)
      }
      this.modal.visible = true
    },
    closeModal () {
      this.modal.visible = false
      this.modal.submitting = false
      this.modal.product = null
      this.modal.form = { rank_2_commission: 0, rank_3_commission: 0 }
      this.modal.displayForm = { rank_2: 0, rank_3: 0 }
    },
    async handleSubmit () {
      if (!this.modal.product || !this.teamLeaderId) return
      if (this.rank1Negative) {
        this.$message.error('佣金池不足，请调整比例')
        return
      }
      // 转换展示值为存储值
      const type = this.modal.product.commission_type
      let rank2, rank3
      if (type === 'percent') {
        rank2 = this.fromPercent(this.modal.displayForm.rank_2)
        rank3 = this.fromPercent(this.modal.displayForm.rank_3)
      } else {
        rank2 = Number(this.modal.displayForm.rank_2 || 0)
        rank3 = Number(this.modal.displayForm.rank_3 || 0)
      }
      this.modal.submitting = true
      try {
        await updateTeamProductCommission(this.modal.product.product_id, {
          team_leader_id: this.teamLeaderId,
          rank_2_commission: rank2,
          rank_3_commission: rank3
        })
        this.$message.success('重分配成功')
        this.closeModal()
        await this.loadData()
      } catch (error) {
        this.$message.error(error?.msg || '操作失败')
      } finally {
        this.modal.submitting = false
      }
    },
    async handleClear (record) {
      if (!this.teamLeaderId) return
      const title = record.title || `商品 ${record.product_id}`
      this.$confirm({
        title: '确认清除该商品团队配置？',
        content: `清除后将恢复基础佣金配置：${title}`,
        onOk: async () => {
          await updateTeamProductCommission(record.product_id, {
            team_leader_id: this.teamLeaderId,
            clear: true
          })
          this.$message.success('已清除')
          await this.loadData()
        }
      })
    },
    resolveRank1 (record) {
      const source = record.team_commission || record.base_commission || {}
      return Number(source.rank_1_commission || 0)
    },
    formatPool (pool, type) {
      const value = Number(pool || 0)
      if (type === 'percent') return `${(value * 100).toFixed(2)}%`
      return `￥${this.toAmount(value)}`
    },
    formatCommissionValue (value, type) {
      const num = Number(value || 0)
      if (type === 'percent') return `${(num * 100).toFixed(2)}%`
      return `￥${this.toAmount(num)}`
    },
    // 用于展示已经是百分比/金额的值
    formatCommissionValueDisplay (value, type) {
      const num = Number(value || 0)
      if (type === 'percent') return `${num.toFixed(2)}%`
      return `￥${this.toAmount(num)}`
    },
    formatCommissionBreakdown (config, type) {
      if (!config) return '-'
      const rank1 = this.formatCommissionValue(config.rank_1_commission, type)
      const rank2 = this.formatCommissionValue(config.rank_2_commission, type)
      const rank3 = this.formatCommissionValue(config.rank_3_commission, type)
      return `${rank1} + ${rank2} + ${rank3}`
    },
    toAmount (value) {
      const num = Number(value || 0)
      return Number.isFinite(num) ? num.toFixed(2) : '0.00'
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

.product-cell {
  display: flex;
  align-items: center;
}

.product-image {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 12px;
  background: #f5f5f5;
}

.product-info {
  .title {
    font-weight: 500;
  }
  .sub {
    color: #999;
    font-size: 12px;
    margin-top: 2px;
  }
}

.modal-content {
  .pool-info {
    background: #f6ffed;
    border: 1px solid #b7eb8f;
    border-radius: 6px;
    padding: 10px 12px;
    margin-bottom: 16px;
  }
  .pool-detail {
    color: #666;
    font-size: 12px;
    margin-top: 4px;
  }
  .unit {
    margin-left: 8px;
    color: #999;
  }
  .hint-text {
    display: block;
    color: #999;
    font-size: 12px;
    margin-top: 4px;
  }
  .rank1-value {
    font-size: 16px;
    font-weight: 600;
    color: #2f54eb;
  }
  .danger {
    color: #ff4d4f;
  }
  .danger-text {
    color: #ff4d4f;
    font-size: 12px;
    margin-top: 4px;
  }
}
</style>
