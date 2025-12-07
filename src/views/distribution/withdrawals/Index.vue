<template>
  <a-card bordered="false">
    <!-- 统计卡片 -->
    <div class="stats-cards" v-if="stats">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-statistic title="待审核" :value="stats.pending_count" suffix="笔">
            <template #prefix><a-icon type="clock-circle" style="color: #fa8c16" /></template>
          </a-statistic>
          <div class="stats-amount">￥{{ Number(stats.pending_amount || 0).toFixed(2) }}</div>
        </a-col>
        <a-col :span="6">
          <a-statistic title="待打款" :value="stats.approved_count" suffix="笔">
            <template #prefix><a-icon type="wallet" style="color: #1890ff" /></template>
          </a-statistic>
          <div class="stats-amount">￥{{ Number(stats.approved_amount || 0).toFixed(2) }}</div>
        </a-col>
        <a-col :span="6">
          <a-statistic title="已打款" :value="stats.paid_count" suffix="笔">
            <template #prefix><a-icon type="check-circle" style="color: #52c41a" /></template>
          </a-statistic>
          <div class="stats-amount">￥{{ Number(stats.paid_amount || 0).toFixed(2) }}</div>
        </a-col>
        <a-col :span="6">
          <a-statistic title="手续费收入" :value="Number(stats.total_fee || 0).toFixed(2)" prefix="￥">
            <template #prefix><a-icon type="dollar" style="color: #722ed1" /></template>
          </a-statistic>
        </a-col>
      </a-row>
    </div>

    <a-divider />

    <div class="table-toolbar">
      <div class="table-search">
        <a-form layout="inline">
          <a-form-item label="状态">
            <a-select v-model="query.status" allowClear placeholder="全部" style="width: 160px">
              <a-select-option value="pending">待审核</a-select-option>
              <a-select-option value="approved">待打款</a-select-option>
              <a-select-option value="paid">已打款</a-select-option>
              <a-select-option value="rejected">已拒绝</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="时间范围">
            <a-range-picker v-model="query.date_between" format="YYYY-MM-DD" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" icon="search" @click="loadData(true)">查询</a-button>
            <a-button style="margin-left: 8px" icon="reload" @click="reset">重置</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="table-actions">
        <a-button icon="download" @click="handleExport" :loading="exporting">导出Excel</a-button>
        <a-button 
          v-if="$auth('distribution.withdrawals.approve')"
          type="primary" 
          icon="check" 
          :disabled="!selectedRowKeys.length"
          @click="handleBatchApprove"
          style="margin-left: 8px"
        >
          批量通过 {{ selectedRowKeys.length ? `(${selectedRowKeys.length})` : '' }}
        </a-button>
        <a-button 
          v-if="$auth('distribution.withdrawals.approve')"
          type="primary" 
          icon="pay-circle" 
          :disabled="!approvedSelectedKeys.length"
          @click="handleBatchMarkPaid"
          style="margin-left: 8px"
        >
          批量打款 {{ approvedSelectedKeys.length ? `(${approvedSelectedKeys.length})` : '' }}
        </a-button>
        <a-button 
          v-if="$auth('distribution.withdrawals.setting')"
          icon="setting" 
          @click="$router.push('/distribution/withdrawals/setting')"
          style="margin-left: 8px"
        >
          提现配置
        </a-button>
      </div>
    </div>

    <a-table
      :columns="columns"
      :dataSource="list"
      :loading="loading"
      :pagination="pagination"
      :rowSelection="rowSelection"
      rowKey="id"
      @change="handleTableChange"
    >
      <span slot="amount" slot-scope="text">
        ￥{{ Number(text || 0).toFixed(2) }}
      </span>
      <span slot="status" slot-scope="text">
        <a-tag :color="statusColor(text)">{{ statusText(text) }}</a-tag>
      </span>
      <span slot="account" slot-scope="text, record">
        {{ formatAccount(record) }}
      </span>
      <span slot="actions" slot-scope="text, record">
        <span v-if="record.status === 'pending' && $auth('distribution.withdrawals.approve')">
          <a-button type="primary" size="small" @click="handleApprove(record)">通过</a-button>
          <a-button type="danger" size="small" style="margin-left: 8px" @click="handleReject(record)">拒绝</a-button>
        </span>
        <span v-else-if="record.status === 'approved' && $auth('distribution.withdrawals.approve')">
          <a-button type="primary" size="small" @click="handleMarkPaid(record)">标记打款</a-button>
          <a-button type="danger" size="small" style="margin-left: 8px" @click="handleReject(record)">拒绝</a-button>
        </span>
        <span v-else-if="!$auth('distribution.withdrawals.approve')">
          {{ statusText(record.status) }}
        </span>
        <span v-else>-</span>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { Modal } from 'ant-design-vue'
import { 
  fetchWithdrawals, 
  approveWithdrawal, 
  rejectWithdrawal, 
  markWithdrawalPaid,
  fetchWithdrawalStats,
  exportWithdrawals,
  batchApproveWithdrawals,
  batchMarkWithdrawalsPaid
} from '@/api/distribution/index'

export default {
  data () {
    return {
      loading: false,
      exporting: false,
      list: [],
      stats: null,
      selectedRowKeys: [],
      query: {
        page: 1,
        per_page: 10,
        status: undefined,
        date_between: []
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`
      },
      columns: [
        { title: 'ID', dataIndex: 'id', width: 80 },
        { title: '用户ID', dataIndex: 'user_id', width: 100 },
        { title: '提现金额', dataIndex: 'amount', scopedSlots: { customRender: 'amount' }, width: 120 },
        { title: '手续费', dataIndex: 'fee', customRender: text => `￥${Number(text || 0).toFixed(2)}`, width: 100 },
        { title: '实际到账', dataIndex: 'actual_amount', customRender: text => `￥${Number(text || 0).toFixed(2)}`, width: 120 },
        { title: '到账方式', scopedSlots: { customRender: 'account' }, width: 150 },
        { title: '状态', dataIndex: 'status', scopedSlots: { customRender: 'status' }, width: 100 },
        { title: '申请时间', dataIndex: 'created_at', customRender: text => this.formatDate(text), width: 160 },
        { title: '审核时间', dataIndex: 'reviewed_at', customRender: text => this.formatDate(text), width: 160 },
        { title: '打款时间', dataIndex: 'paid_at', customRender: text => this.formatDate(text), width: 160 },
        { title: '操作', scopedSlots: { customRender: 'actions' }, width: 180, fixed: 'right' }
      ]
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: record => ({
          props: {
            disabled: record.status === 'paid' || record.status === 'rejected'
          }
        })
      }
    },
    approvedSelectedKeys () {
      return this.list
        .filter(item => this.selectedRowKeys.includes(item.id) && item.status === 'approved')
        .map(item => item.id)
    },
    pendingSelectedKeys () {
      return this.list
        .filter(item => this.selectedRowKeys.includes(item.id) && item.status === 'pending')
        .map(item => item.id)
    }
  },
  mounted () {
    this.loadData(true)
    this.loadStats()
  },
  methods: {
    async loadData (reset = false) {
      if (reset) {
        this.query.page = 1
        this.pagination.current = 1
        this.selectedRowKeys = []
      }
      this.loading = true
      try {
        const params = { ...this.query }
        if (params.date_between && params.date_between.length === 2) {
          params.date_between = [
            params.date_between[0].format('YYYY-MM-DD'),
            params.date_between[1].format('YYYY-MM-DD')
          ]
        } else {
          delete params.date_between
        }
        const res = await fetchWithdrawals(params)
        this.list = res.data || []
        this.pagination = {
          ...this.pagination,
          current: res.current_page || 1,
          pageSize: res.per_page || this.query.per_page,
          total: res.total || 0
        }
      } catch (err) {
        this.$message.error(err?.msg || '加载失败')
      } finally {
        this.loading = false
      }
    },
    async loadStats () {
      try {
        this.stats = await fetchWithdrawalStats({ period: 'month' })
      } catch (err) {
        console.error('加载统计失败', err)
      }
    },
    handleTableChange (pagination) {
      this.query.page = pagination.current
      this.query.per_page = pagination.pageSize
      this.loadData()
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    reset () {
      this.query.status = undefined
      this.query.date_between = []
      this.loadData(true)
    },
    statusText (status) {
      switch (status) {
        case 'pending': return '待审核'
        case 'approved': return '待打款'
        case 'paid': return '已打款'
        case 'rejected': return '已拒绝'
        default: return status
      }
    },
    statusColor (status) {
      switch (status) {
        case 'pending': return 'orange'
        case 'approved': return 'blue'
        case 'paid': return 'green'
        case 'rejected': return 'red'
        default: return 'purple'
      }
    },
    formatDate (date) {
      if (!date) return '-'
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    formatAccount (record) {
      if (!record) return '-'
      if (record.account_type === 'wechat' || !record.account_type) return '微信零钱'
      const info = record.account_info || {}
      if (record.account_type === 'alipay') {
        return `支付宝 ${info.account_no || ''}`
      }
      if (record.account_type === 'bank_card') {
        const tail = info.account_no ? info.account_no.slice(-4) : ''
        return `${info.bank_name || '银行卡'} (***${tail})`
      }
      return record.account_type
    },
    async handleApprove (record) {
      Modal.confirm({
        title: '确认操作',
        content: '确认通过该提现申请吗？',
        onOk: async () => {
          try {
            await approveWithdrawal(record.id)
            this.$message.success('操作成功')
            this.loadData()
            this.loadStats()
          } catch (err) {
            this.$message.error(err?.msg || '操作失败')
          }
        }
      })
    },
    async handleReject (record) {
      Modal.confirm({
        title: '确认操作',
        content: '确认拒绝该提现申请吗？',
        onOk: async () => {
          try {
            await rejectWithdrawal(record.id)
            this.$message.success('已拒绝')
            this.loadData()
            this.loadStats()
          } catch (err) {
            this.$message.error(err?.msg || '操作失败')
          }
        }
      })
    },
    async handleMarkPaid (record) {
      Modal.confirm({
        title: '确认操作',
        content: '确认已完成打款？',
        onOk: async () => {
          try {
            await markWithdrawalPaid(record.id)
            this.$message.success('已标记打款')
            this.loadData()
            this.loadStats()
          } catch (err) {
            this.$message.error(err?.msg || '操作失败')
          }
        }
      })
    },
    async handleBatchApprove () {
      const ids = this.pendingSelectedKeys
      if (!ids.length) {
        this.$message.warning('请选择待审核的记录')
        return
      }
      Modal.confirm({
        title: '批量审核通过',
        content: `确认批量通过 ${ids.length} 条提现申请吗？`,
        onOk: async () => {
          try {
            const res = await batchApproveWithdrawals(ids)
            this.$message.success(`成功通过 ${res.success_count} 条`)
            if (res.failed_ids && res.failed_ids.length) {
              this.$message.warning(`${res.failed_ids.length} 条失败`)
            }
            this.selectedRowKeys = []
            this.loadData()
            this.loadStats()
          } catch (err) {
            this.$message.error(err?.msg || '批量操作失败')
          }
        }
      })
    },
    async handleBatchMarkPaid () {
      const ids = this.approvedSelectedKeys
      if (!ids.length) {
        this.$message.warning('请选择待打款的记录')
        return
      }
      Modal.confirm({
        title: '批量标记打款',
        content: `确认批量标记 ${ids.length} 条记录为已打款吗？`,
        onOk: async () => {
          try {
            const res = await batchMarkWithdrawalsPaid(ids)
            this.$message.success(`成功标记 ${res.success_count} 条`)
            if (res.failed_ids && res.failed_ids.length) {
              this.$message.warning(`${res.failed_ids.length} 条失败`)
            }
            this.selectedRowKeys = []
            this.loadData()
            this.loadStats()
          } catch (err) {
            this.$message.error(err?.msg || '批量操作失败')
          }
        }
      })
    },
    async handleExport () {
      this.exporting = true
      try {
        const params = { ...this.query }
        if (params.date_between && params.date_between.length === 2) {
          params.date_between = [
            params.date_between[0].format('YYYY-MM-DD'),
            params.date_between[1].format('YYYY-MM-DD')
          ]
        } else {
          delete params.date_between
        }
        const data = await exportWithdrawals(params)
        
        // 转换为 CSV
        const headers = ['ID', '用户ID', '用户昵称', '提现金额', '手续费', '实际到账', '到账方式', '账户信息', '状态', '申请时间', '审核时间', '打款时间']
        const rows = data.map(item => [
          item.id,
          item.user_id,
          item.user_nickname || '',
          item.amount,
          item.fee,
          item.actual_amount,
          item.account_type === 'wechat' ? '微信零钱' : item.account_type,
          item.account_info ? JSON.stringify(item.account_info) : '',
          this.statusText(item.status),
          item.created_at || '',
          item.reviewed_at || '',
          item.paid_at || ''
        ])
        
        const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `提现记录_${moment().format('YYYYMMDD_HHmmss')}.csv`
        link.click()
        
        this.$message.success('导出成功')
      } catch (err) {
        this.$message.error(err?.msg || '导出失败')
      } finally {
        this.exporting = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.stats-cards {
  margin-bottom: 16px;
  
  .stats-amount {
    font-size: 14px;
    color: #666;
    margin-top: 4px;
  }
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
}

.table-search {
  flex: 1;
}

.table-actions {
  display: flex;
  gap: 8px;
}
</style>
