<template>
  <a-card bordered="false">
    <div class="table-search">
      <a-form layout="inline">
        <a-form-item label="状态">
          <a-select v-model="query.status" allowClear placeholder="全部" style="width: 140px">
            <a-select-option value="pending">待审核</a-select-option>
            <a-select-option value="valid">有效</a-select-option>
            <a-select-option value="done">已入账</a-select-option>
            <a-select-option value="canceled">已取消</a-select-option>
          </a-select>
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
      <span slot="type" slot-scope="text">
        {{ typeText(text) }}
      </span>
      <span slot="status" slot-scope="text">
        <a-tag :color="statusColor(text)">{{ statusText(text) }}</a-tag>
      </span>
      <span slot="commission" slot-scope="text">
        ￥{{ Number(text || 0).toFixed(2) }}
      </span>
      <span slot="actions" slot-scope="text, record">
        <a-button
          v-if="record.status === 'pending' && $auth('distribution.rebates.approve')"
          type="primary"
          size="small"
          @click="handleApprove(record)"
        >通过</a-button>
        <a-button
          v-if="record.status === 'pending' && $auth('distribution.rebates.approve')"
          type="danger"
          size="small"
          style="margin-left: 8px"
          @click="handleReject(record)"
        >拒绝</a-button>
        <span v-if="record.status === 'pending' && !$auth('distribution.rebates.approve')">待审核</span>
        <span v-else-if="record.status !== 'pending'">-</span>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { Modal } from 'ant-design-vue'
import { fetchRebates, approveRebate, rejectRebate } from '@/api/distribution/index'

export default {
  data () {
    return {
      loading: false,
      list: [],
      query: {
        page: 1,
        per_page: 10,
        status: undefined
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`
      },
      columns: [
        { title: 'ID', dataIndex: 'id' },
        { title: '分销员', dataIndex: 'user_nickname' },
        { title: '等级', dataIndex: 'user_level', customRender: text => text ? `LV${text}` : '-' },
        { title: '佣金金额', dataIndex: 'commission', scopedSlots: { customRender: 'commission' } },
        { title: '类型', dataIndex: 'type', scopedSlots: { customRender: 'type' } },
        { title: '状态', dataIndex: 'status', scopedSlots: { customRender: 'status' } },
        {
          title: '创建时间',
          dataIndex: 'created_at',
          customRender: (text) => this.formatDate(text)
        },
        {
          title: '入账时间',
          dataIndex: 'accounted_at',
          customRender: (text) => this.formatDate(text)
        },
        { title: '操作', scopedSlots: { customRender: 'actions' } }
      ]
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
        const res = await fetchRebates({ ...this.query })
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
    handleTableChange (pagination) {
      this.query.page = pagination.current
      this.query.per_page = pagination.pageSize
      this.loadData()
    },
    reset () {
      this.query.status = undefined
      this.loadData(true)
    },
    typeText (type) {
      return type === 'share_buy' ? '分享下单' : '团队订单'
    },
    statusText (status) {
      switch (status) {
        case 'pending': return '待审核'
        case 'paid': return '已支付'
        case 'received': return '已收货'
        case 'done': return '已入账'
        case 'canceled': return '已取消'
        default: return status
      }
    },
    statusColor (status) {
      switch (status) {
        case 'pending': return 'orange'
        case 'done': return 'green'
        case 'canceled': return 'red'
        default: return 'blue'
      }
    },
    formatDate (date) {
      if (!date) return '-'
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    async handleApprove (record) {
      try {
        await approveRebate(record.id)
        this.$message.success('审核通过')
        this.loadData()
      } catch (err) {
        this.$message.error(err?.msg || '操作失败')
      }
    },
    async handleReject (record) {
      Modal.confirm({
        title: '确认操作',
        content: '确定要拒绝该笔佣金吗？',
        onOk: async () => {
          try {
            await rejectRebate(record.id)
            this.$message.success('已拒绝')
            this.loadData()
          } catch (err) {
            this.$message.error(err?.msg || '操作失败')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.table-search {
  margin-bottom: 16px;
}
</style>
