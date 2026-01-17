<template>
  <a-card bordered="false" title="分销配置">
    <a-spin :spinning="loading">
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <a-divider>系统佣金配置</a-divider>

        <a-form-item label="分佣触发">
          <a-radio-group v-model="config.valid_order">
            <a-radio value="share">分享下单</a-radio>
            <a-radio value="any">下线任意购买</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="入账时机">
          <a-select v-model="pendingEnterAccount" style="width: 200px" @change="handleEnterAccountChange">
            <a-select-option value="paid">支付后</a-select-option>
            <a-select-option value="received">确认收货</a-select-option>
            <a-select-option value="approved">评价后审核</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="返佣层级">
          <a-input-number v-model="config.max_leaders_number" :min="1" :max="3" :precision="0" style="width: 200px" />
          <span class="ant-form-text">层</span>
        </a-form-item>

        <a-form-item label="佣金类型">
          <a-radio-group v-model="config.commission_type">
            <a-radio value="percent">按比例</a-radio>
            <a-radio value="fixed">固定金额</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="一级佣金">
          <a-input-number
            v-model="displayCommission.rank_1"
            :min="0"
            :max="commissionPercentMax"
            :precision="2"
            style="width: 200px"
          />
          <span class="ant-form-text">{{ commissionUnit }}</span>
        </a-form-item>

        <a-form-item label="二级佣金">
          <a-input-number
            v-model="displayCommission.rank_2"
            :min="0"
            :max="commissionPercentMax"
            :precision="2"
            style="width: 200px"
          />
          <span class="ant-form-text">{{ commissionUnit }}</span>
        </a-form-item>

        <a-form-item label="三级佣金">
          <a-input-number
            v-model="displayCommission.rank_3"
            :min="0"
            :max="commissionPercentMax"
            :precision="2"
            style="width: 200px"
          />
          <span class="ant-form-text">{{ commissionUnit }}</span>
        </a-form-item>

        <a-divider>等级管理</a-divider>
        <div class="levels">
          <div v-for="(level, index) in levels" :key="level.id || level.temp_id" class="level-card">
            <div class="level-header">
              <div class="title">等级配置</div>
              <a-button type="link" @click="removeLevel(index)">删除</a-button>
            </div>
            <a-row :gutter="16">
              <a-col :span="8">
                <div class="field">
                  <span class="label">等级</span>
                  <a-input-number v-model="level.level" :min="1" :precision="0" style="width: 160px" />
                </div>
              </a-col>
              <a-col :span="8">
                <div class="field">
                  <span class="label">名称</span>
                  <a-input v-model="level.name" style="width: 160px" />
                </div>
              </a-col>
              <a-col :span="8">
                <div class="field">
                  <span class="label">倍率加成</span>
                  <a-input-number v-model="level.level_buff" :min="0" :precision="2" style="width: 160px" />
                </div>
              </a-col>
            </a-row>
            <a-divider dashed />
            <a-row :gutter="16">
              <a-col :span="12">
                <div class="field">
                  <span class="label">累计销售额</span>
                  <a-input-number v-model="level.min_total_sales" :min="0" :precision="2" style="width: 160px" />
                  <span class="ant-form-text">元</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="field">
                  <span class="label">累计佣金</span>
                  <a-input-number v-model="level.min_total_commission" :min="0" :precision="2" style="width: 160px" />
                  <span class="ant-form-text">元</span>
                </div>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <div class="field">
                  <span class="label">一级下线数</span>
                  <a-input-number v-model="level.min_first_members" :min="0" :precision="0" style="width: 160px" />
                  <span class="ant-form-text">人</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="field">
                  <span class="label">总下线数</span>
                  <a-input-number v-model="level.min_total_members" :min="0" :precision="0" style="width: 160px" />
                  <span class="ant-form-text">人</span>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>

        <a-button type="dashed" icon="plus" @click="addLevel" style="width: 100%; margin-bottom: 20px">
          新增等级
        </a-button>

        <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
          <a-button type="primary" :loading="saving" @click="handleSubmit">保存配置</a-button>
          <a-button style="margin-left: 10px" @click="loadData">重置</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import { fetchDistributionSettings, updateDistributionSettings } from '@/api/distribution/index'

// 入账时机优先级：paid < received < approved
const ENTER_ACCOUNT_ORDER = { paid: 1, received: 2, approved: 3 }
const ENTER_ACCOUNT_LABELS = {
  paid: '支付后',
  received: '确认收货',
  approved: '评价后审核'
}

export default {
  name: 'DistributionSettings',
  data () {
    return {
      loading: false,
      saving: false,
      config: {
        valid_order: 'share',
        enter_account: 'received',
        max_leaders_number: 2,
        commission_type: 'percent',
        rank_1_commission: 0.05,
        rank_2_commission: 0.01,
        rank_3_commission: 0
      },
      // 用于展示的百分比值 (config 中存储的是 0-1 小数)
      displayCommission: {
        rank_1: 5,
        rank_2: 1,
        rank_3: 0
      },
      // 待确认的入账时机
      pendingEnterAccount: 'received',
      levels: []
    }
  },
  computed: {
    commissionUnit () {
      return this.config.commission_type === 'percent' ? '%' : '元'
    },
    commissionPercentMax () {
      return this.config.commission_type === 'percent' ? 100 : undefined
    }
  },
  watch: {
    // 监听佣金类型变化，同步转换展示值
    'config.commission_type' (newType, oldType) {
      if (newType === 'percent' && oldType === 'fixed') {
        // 固定金额切换到比例，不自动转换，重置为 0
        this.displayCommission = { rank_1: 0, rank_2: 0, rank_3: 0 }
      } else if (newType === 'fixed' && oldType === 'percent') {
        // 比例切换到固定金额，不自动转换，重置为 0
        this.displayCommission = { rank_1: 0, rank_2: 0, rank_3: 0 }
      }
    }
  },
  mounted () {
    this.loadData()
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
    // 同步展示值到 config
    syncDisplayToConfig () {
      if (this.config.commission_type === 'percent') {
        this.config.rank_1_commission = this.fromPercent(this.displayCommission.rank_1)
        this.config.rank_2_commission = this.fromPercent(this.displayCommission.rank_2)
        this.config.rank_3_commission = this.fromPercent(this.displayCommission.rank_3)
      } else {
        this.config.rank_1_commission = Number(this.displayCommission.rank_1) || 0
        this.config.rank_2_commission = Number(this.displayCommission.rank_2) || 0
        this.config.rank_3_commission = Number(this.displayCommission.rank_3) || 0
      }
    },
    // 同步 config 到展示值
    syncConfigToDisplay () {
      if (this.config.commission_type === 'percent') {
        this.displayCommission = {
          rank_1: this.toPercent(this.config.rank_1_commission),
          rank_2: this.toPercent(this.config.rank_2_commission),
          rank_3: this.toPercent(this.config.rank_3_commission)
        }
      } else {
        this.displayCommission = {
          rank_1: Number(this.config.rank_1_commission) || 0,
          rank_2: Number(this.config.rank_2_commission) || 0,
          rank_3: Number(this.config.rank_3_commission) || 0
        }
      }
    },
    async loadData () {
      this.loading = true
      try {
        const res = await fetchDistributionSettings()
        if (res?.config) {
          this.config = { ...this.config, ...res.config }
          this.pendingEnterAccount = this.config.enter_account
          this.syncConfigToDisplay()
        }
        this.levels = (res?.levels || []).map(item => ({
          ...item,
          temp_id: item.id || `${Date.now()}_${Math.random()}`
        }))
      } catch (err) {
        this.$message.error(err?.msg || '加载配置失败')
      } finally {
        this.loading = false
      }
    },
    // 处理入账时机切换
    handleEnterAccountChange (newValue) {
      const oldValue = this.config.enter_account
      if (newValue === oldValue) return

      const oldOrder = ENTER_ACCOUNT_ORDER[oldValue] || 2
      const newOrder = ENTER_ACCOUNT_ORDER[newValue] || 2
      const oldLabel = ENTER_ACCOUNT_LABELS[oldValue] || oldValue
      const newLabel = ENTER_ACCOUNT_LABELS[newValue] || newValue

      let warningMessage = ''
      let actionDescription = ''

      if (newOrder < oldOrder) {
        // 降低门槛：从高级往低级修改，需要给符合新条件的订单入账佣金
        actionDescription = '佣金入账'
        if (oldValue === 'approved' && newValue === 'received') {
          warningMessage = '将为所有已确认收货但未评价审核的订单执行佣金入账'
        } else if (oldValue === 'approved' && newValue === 'paid') {
          warningMessage = '将为所有已支付但未评价审核的订单执行佣金入账'
        } else if (oldValue === 'received' && newValue === 'paid') {
          warningMessage = '将为所有已支付但未确认收货的订单执行佣金入账'
        }
      } else {
        // 提高门槛：从低级往高级修改，需要退回已入账但不满足新条件的佣金
        actionDescription = '佣金退回'
        if (oldValue === 'paid' && newValue === 'received') {
          warningMessage = '将为所有已支付但未确认收货的订单执行佣金退回'
        } else if (oldValue === 'paid' && newValue === 'approved') {
          warningMessage = '将为所有已支付但未评价审核的订单执行佣金退回'
        } else if (oldValue === 'received' && newValue === 'approved') {
          warningMessage = '将为所有已确认收货但未评价审核的订单执行佣金退回'
        }
      }

      this.$confirm({
        title: `确认修改入账时机？`,
        content: (h) => h('div', [
          h('p', `从「${oldLabel}」修改为「${newLabel}」`),
          h('p', { style: { color: '#ff4d4f', fontWeight: 'bold' } }, warningMessage),
          h('p', `系统将自动执行${actionDescription}操作，请确认是否继续？`)
        ]),
        okText: '确认修改',
        cancelText: '取消',
        onOk: () => {
          this.config.enter_account = newValue
        },
        onCancel: () => {
          // 恢复原值
          this.pendingEnterAccount = oldValue
        }
      })
    },
    addLevel () {
      const maxLevel = this.levels.reduce((max, item) => Math.max(max, Number(item.level || 0)), 0)
      this.levels.push({
        temp_id: `${Date.now()}_${Math.random()}`,
        level: maxLevel + 1,
        name: '',
        level_buff: 1,
        min_total_sales: null,
        min_total_commission: null,
        min_first_members: null,
        min_total_members: null
      })
    },
    removeLevel (index) {
      this.levels.splice(index, 1)
    },
    validateConfig () {
      // 先同步展示值到 config
      this.syncDisplayToConfig()

      if (this.config.commission_type === 'percent') {
        const sum = Number(this.config.rank_1_commission || 0) +
          Number(this.config.rank_2_commission || 0) +
          Number(this.config.rank_3_commission || 0)
        const maxBuff = this.levels.length
          ? Math.max(...this.levels.map(item => Number(item.level_buff || 1)))
          : 1
        if (sum * maxBuff > 1) {
          this.$message.error('最高等级加成后佣金比例总和不能超过100%')
          return false
        }
      }
      const levelNumbers = this.levels.map(item => Number(item.level || 0))
      const uniqueLevels = new Set(levelNumbers)
      if (uniqueLevels.size !== levelNumbers.length) {
        this.$message.error('等级不能重复')
        return false
      }
      if (this.levels.some(item => !item.name)) {
        this.$message.error('等级名称不能为空')
        return false
      }
      return true
    },
    async handleSubmit () {
      if (!this.validateConfig()) return
      this.saving = true
      try {
        const payload = {
          config: { ...this.config },
          levels: this.levels.map(item => ({
            id: item.id,
            level: item.level,
            name: item.name,
            level_buff: item.level_buff,
            min_total_sales: item.min_total_sales,
            min_total_commission: item.min_total_commission,
            min_first_members: item.min_first_members,
            min_total_members: item.min_total_members
          }))
        }
        const res = await updateDistributionSettings(payload)
        // 处理入账时机变更结果
        if (res?.enter_account_result) {
          const result = res.enter_account_result
          this.$notification.success({
            message: '入账时机变更处理完成',
            description: `处理订单：${result.processed_count || 0} 个，${result.action === 'credit' ? '入账' : '退回'}金额：￥${Number(result.amount || 0).toFixed(2)}`,
            duration: 5
          })
        }
        if (res?.config) {
          this.config = { ...this.config, ...res.config }
          this.pendingEnterAccount = this.config.enter_account
          this.syncConfigToDisplay()
        }
        if (res?.levels) {
          this.levels = res.levels.map(item => ({
            ...item,
            temp_id: item.id || `${Date.now()}_${Math.random()}`
          }))
        }
        this.$message.success('保存成功')
      } catch (err) {
        this.$message.error(err?.msg || '保存失败')
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ant-form-text {
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.45);
}
.levels {
  margin-bottom: 16px;
}
.level-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
}
.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.field {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.field .label {
  width: 90px;
  color: rgba(0, 0, 0, 0.65);
}
</style>
