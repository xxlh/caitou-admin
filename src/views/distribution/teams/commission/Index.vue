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
        <a-alert
          type="info"
          show-icon
          message="未启用团队自定义佣金时，将继续使用商品/分类/系统的佣金配置"
          style="margin-bottom: 16px"
        />

        <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-form-item label="启用团队自定义佣金比例">
            <a-switch :checked="enabled" @change="handleToggle" />
          </a-form-item>

          <a-form-item label="佣金类型">
            <span class="ant-form-text">{{ commissionTypeLabel }}</span>
          </a-form-item>

          <a-form-item label="一级佣金">
            <a-input-number
              v-model="displayCommission.rank_1"
              :min="0"
              :max="commissionPercentMax"
              :precision="2"
              :disabled="!enabled"
              style="width: 200px"
              :placeholder="systemCommissionPlaceholder.rank_1"
            />
            <span class="ant-form-text">{{ commissionUnit }}</span>
            <span v-if="!enabled" class="hint-text">（当前使用系统配置：{{ systemCommissionPlaceholder.rank_1 }}{{ commissionUnit }}）</span>
          </a-form-item>

          <a-form-item label="二级佣金">
            <a-input-number
              v-model="displayCommission.rank_2"
              :min="0"
              :max="commissionPercentMax"
              :precision="2"
              :disabled="!enabled"
              style="width: 200px"
              :placeholder="systemCommissionPlaceholder.rank_2"
            />
            <span class="ant-form-text">{{ commissionUnit }}</span>
            <span v-if="!enabled" class="hint-text">（当前使用系统配置：{{ systemCommissionPlaceholder.rank_2 }}{{ commissionUnit }}）</span>
          </a-form-item>

          <a-form-item label="三级佣金">
            <a-input-number
              v-model="displayCommission.rank_3"
              :min="0"
              :max="commissionPercentMax"
              :precision="2"
              :disabled="!enabled"
              style="width: 200px"
              :placeholder="systemCommissionPlaceholder.rank_3"
            />
            <span class="ant-form-text">{{ commissionUnit }}</span>
            <span v-if="!enabled" class="hint-text">（当前使用系统配置：{{ systemCommissionPlaceholder.rank_3 }}{{ commissionUnit }}）</span>
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 14, offset: 8 }">
            <a-button type="primary" :loading="saving" :disabled="!enabled" @click="handleSave">
              保存配置
            </a-button>
            <a-button style="margin-left: 10px" :disabled="saving" @click="loadData">
              重置
            </a-button>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import teamSelectorMixin from '@/views/distribution/teams/mixins/teamSelector'
import { fetchTeamCommission, updateTeamCommission, fetchDistributionSettings } from '@/api/distribution/index'

export default {
  name: 'DistributionTeamCommission',
  mixins: [teamSelectorMixin],
  data () {
    return {
      loading: false,
      saving: false,
      enabled: false,
      commissionType: 'percent',
      config: {
        rank_1_commission: 0,
        rank_2_commission: 0,
        rank_3_commission: 0
      },
      // 用于展示的百分比/金额值
      displayCommission: {
        rank_1: 0,
        rank_2: 0,
        rank_3: 0
      },
      // 系统佣金配置（用于显示初始化值）
      systemConfig: {
        rank_1_commission: 0.05,
        rank_2_commission: 0.01,
        rank_3_commission: 0
      }
    }
  },
  computed: {
    commissionUnit () {
      return this.commissionType === 'percent' ? '%' : '元'
    },
    commissionTypeLabel () {
      return this.commissionType === 'percent' ? '按比例' : '固定金额'
    },
    commissionPercentMax () {
      return this.commissionType === 'percent' ? 100 : undefined
    },
    // 系统佣金的展示值（用于 placeholder 和 hint）
    systemCommissionPlaceholder () {
      if (this.commissionType === 'percent') {
        return {
          rank_1: this.toPercent(this.systemConfig.rank_1_commission),
          rank_2: this.toPercent(this.systemConfig.rank_2_commission),
          rank_3: this.toPercent(this.systemConfig.rank_3_commission)
        }
      }
      return {
        rank_1: Number(this.systemConfig.rank_1_commission || 0),
        rank_2: Number(this.systemConfig.rank_2_commission || 0),
        rank_3: Number(this.systemConfig.rank_3_commission || 0)
      }
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
    // 同步展示值到 config
    syncDisplayToConfig () {
      if (this.commissionType === 'percent') {
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
      if (this.commissionType === 'percent') {
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
    async onTeamChange () {
      await this.loadData()
    },
    async loadData () {
      if (!this.teamLeaderId) return
      this.loading = true
      try {
        // 并行加载团队佣金和系统配置
        const [teamRes, settingsRes] = await Promise.all([
          fetchTeamCommission({ team_leader_id: this.teamLeaderId }),
          fetchDistributionSettings()
        ])

        // 保存系统配置
        if (settingsRes?.config) {
          this.systemConfig = {
            rank_1_commission: Number(settingsRes.config.rank_1_commission || 0),
            rank_2_commission: Number(settingsRes.config.rank_2_commission || 0),
            rank_3_commission: Number(settingsRes.config.rank_3_commission || 0)
          }
        }

        this.commissionType = teamRes?.commission_type || settingsRes?.config?.commission_type || 'percent'

        if (teamRes?.config) {
          this.enabled = true
          this.config = {
            rank_1_commission: Number(teamRes.config.rank_1_commission || 0),
            rank_2_commission: Number(teamRes.config.rank_2_commission || 0),
            rank_3_commission: Number(teamRes.config.rank_3_commission || 0)
          }
        } else {
          this.enabled = false
          // 未启用时使用系统配置作为展示值
          this.config = { ...this.systemConfig }
        }
        this.syncConfigToDisplay()
      } catch (error) {
        this.$message.error(error?.msg || '加载团队佣金失败')
      } finally {
        this.loading = false
      }
    },
    async handleToggle (value) {
      if (!this.teamLeaderId) return
      if (value) {
        this.enabled = true
        // 启用时使用系统配置作为初始值
        this.config = { ...this.systemConfig }
        this.syncConfigToDisplay()
        return
      }
      this.saving = true
      try {
        await updateTeamCommission({
          team_leader_id: this.teamLeaderId,
          enabled: false
        })
        this.enabled = false
        this.$message.success('已清除团队自定义佣金配置')
        await this.loadData()
      } catch (error) {
        this.$message.error(error?.msg || '操作失败')
      } finally {
        this.saving = false
      }
    },
    async handleSave () {
      if (!this.teamLeaderId) return
      // 同步展示值到 config
      this.syncDisplayToConfig()
      this.saving = true
      try {
        await updateTeamCommission({
          team_leader_id: this.teamLeaderId,
          rank_1_commission: Number(this.config.rank_1_commission || 0),
          rank_2_commission: Number(this.config.rank_2_commission || 0),
          rank_3_commission: Number(this.config.rank_3_commission || 0)
        })
        this.$message.success('保存成功')
        await this.loadData()
      } catch (error) {
        this.$message.error(error?.msg || '保存失败')
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.filter-bar {
  margin-bottom: 16px;
}
.hint-text {
  margin-left: 8px;
  color: #999;
  font-size: 12px;
}
</style>
