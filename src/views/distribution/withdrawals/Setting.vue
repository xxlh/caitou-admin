<template>
  <a-card bordered="false" title="提现配置">
    <a-spin :spinning="loading">
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <!-- 基础配置 -->
        <a-divider>基础配置</a-divider>

        <a-form-item label="手续费类型">
          <a-radio-group v-model="config.withdrawal_fee_type">
            <a-radio value="fixed">固定金额</a-radio>
            <a-radio value="percent">按比例</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item :label="config.withdrawal_fee_type === 'percent' ? '手续费比例' : '手续费金额'">
          <a-input-number
            v-model="config.withdrawal_fee_amount"
            :min="0"
            :max="config.withdrawal_fee_type === 'percent' ? 100 : undefined"
            :precision="2"
            style="width: 200px"
          />
          <span class="ant-form-text">{{ config.withdrawal_fee_type === 'percent' ? '%' : '元/笔' }}</span>
        </a-form-item>

        <a-form-item label="最低提现金额">
          <a-input-number v-model="config.withdrawal_min_amount" :min="0.01" :precision="2" style="width: 200px" />
          <span class="ant-form-text">元</span>
        </a-form-item>

        <a-form-item label="每日提现限制">
          <a-input-number v-model="config.withdrawal_daily_limit" :min="0" :precision="0" style="width: 200px" />
          <span class="ant-form-text">笔（0表示不限制）</span>
        </a-form-item>

        <a-form-item label="每月提现限制">
          <a-input-number v-model="config.withdrawal_monthly_limit" :min="0" :precision="0" style="width: 200px" />
          <span class="ant-form-text">笔（0表示不限制）</span>
        </a-form-item>

        <a-form-item label="预计到账时间">
          <a-input v-model="config.withdrawal_estimated_days" style="width: 200px" placeholder="如：1-3" />
          <span class="ant-form-text">工作日</span>
        </a-form-item>

        <!-- 安全配置 -->
        <a-divider>安全配置</a-divider>

        <a-form-item label="首次提现冷静期">
          <a-input-number v-model="config.withdrawal_cooldown_hours" :min="0" :precision="0" style="width: 200px" />
          <span class="ant-form-text">小时（0表示无冷静期）</span>
        </a-form-item>

        <a-form-item label="大额审核阈值">
          <a-input-number
            v-model="config.withdrawal_large_amount_threshold"
            :min="0"
            :precision="2"
            style="width: 200px"
          />
          <span class="ant-form-text">元（超过此金额需人工审核）</span>
        </a-form-item>

        <a-form-item label="手机号验证">
          <a-switch v-model="config.withdrawal_phone_verify_enabled" />
          <span class="ant-form-text">提现前需验证微信手机号</span>
        </a-form-item>

        <!-- 风控配置 -->
        <a-divider>风控配置</a-divider>

        <a-form-item label="1小时提现次数上限">
          <a-input-number
            v-model="config.withdrawal_risk_hourly_count"
            :min="0"
            :precision="0"
            style="width: 200px"
          />
          <span class="ant-form-text">次（超过触发风控）</span>
        </a-form-item>

        <a-form-item label="1小时提现金额上限">
          <a-input-number
            v-model="config.withdrawal_risk_hourly_amount"
            :min="0"
            :precision="2"
            style="width: 200px"
          />
          <span class="ant-form-text">元（超过触发风控）</span>
        </a-form-item>

        <a-form-item label="风控企业微信通知">
          <a-switch v-model="config.withdrawal_risk_notify_wework" />
          <span class="ant-form-text">触发风控时推送企业微信通知给管理员</span>
        </a-form-item>

        <!-- VIP快速提现 -->
        <a-divider>VIP快速提现</a-divider>

        <a-form-item label="免审核分销等级">
          <a-select v-model="config.withdrawal_fast_min_level" style="width: 200px">
            <a-select-option :value="0">不启用</a-select-option>
            <a-select-option :value="1">1级及以上</a-select-option>
            <a-select-option :value="2">2级及以上</a-select-option>
            <a-select-option :value="3">3级及以上</a-select-option>
          </a-select>
          <span class="ant-form-text">达到等级且金额≤大额阈值时自动通过</span>
        </a-form-item>

        <!-- 自动提现 -->
        <a-divider>自动提现</a-divider>

        <a-form-item label="开启自动提现">
          <a-switch v-model="config.withdrawal_auto_enabled" />
          <span class="ant-form-text">
            <a-tag color="orange">仅支持微信零钱</a-tag>
          </span>
        </a-form-item>

        <a-form-item v-if="config.withdrawal_auto_enabled" label="触发阈值">
          <a-input-number v-model="config.withdrawal_auto_threshold" :min="1" :precision="2" style="width: 200px" />
          <span class="ant-form-text">元（余额达到此金额时自动提现）</span>
        </a-form-item>

        <a-form-item v-if="config.withdrawal_auto_enabled" label="执行时间">
          <a-time-picker v-model="autoTimeValue" format="HH:mm" @change="onAutoTimeChange" style="width: 200px" />
          <span class="ant-form-text">每日执行时间</span>
        </a-form-item>

        <!-- 保存按钮 -->
        <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
          <a-button type="primary" :loading="saving" @click="handleSubmit">保存配置</a-button>
          <a-button style="margin-left: 10px" @click="loadConfig">重置</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import moment from 'moment'
import { fetchWithdrawalConfig, updateWithdrawalConfig } from '@/api/distribution/index'

export default {
  name: 'WithdrawalSetting',
  data () {
    return {
      loading: false,
      saving: false,
      form: this.$form.createForm(this),
      autoTimeValue: null,
      config: {
        // 基础配置
        withdrawal_fee_type: 'fixed',
        withdrawal_fee_amount: 0,
        withdrawal_min_amount: 1,
        withdrawal_daily_limit: 3,
        withdrawal_monthly_limit: 10,
        withdrawal_estimated_days: '1-3',
        // 安全配置
        withdrawal_cooldown_hours: 0,
        withdrawal_large_amount_threshold: 500,
        withdrawal_phone_verify_enabled: false,
        // 风控配置
        withdrawal_risk_hourly_count: 5,
        withdrawal_risk_hourly_amount: 1000,
        withdrawal_risk_notify_wework: true,
        // VIP快速提现
        withdrawal_fast_min_level: 0,
        // 自动提现
        withdrawal_auto_enabled: false,
        withdrawal_auto_threshold: 100,
        withdrawal_auto_time: '10:00'
      }
    }
  },
  mounted () {
    this.loadConfig()
  },
  methods: {
    async loadConfig () {
      this.loading = true
      try {
        const res = await fetchWithdrawalConfig()
        if (res) {
          Object.keys(this.config).forEach(key => {
            if (res[key] !== undefined) {
              this.config[key] = res[key]
            }
          })
          // 处理时间格式
          if (this.config.withdrawal_auto_time) {
            this.autoTimeValue = moment(this.config.withdrawal_auto_time, 'HH:mm')
          }
        }
      } catch (err) {
        this.$message.error(err?.msg || '加载配置失败')
      } finally {
        this.loading = false
      }
    },
    onAutoTimeChange (time, timeString) {
      this.config.withdrawal_auto_time = timeString
    },
    async handleSubmit () {
      this.saving = true
      try {
        await updateWithdrawalConfig(this.config)
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
</style>

