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
          <a-form-item label="层级">
            <a-radio-group v-model="query.rank" @change="handleRankChange">
              <a-radio-button value="second">二级分销员</a-radio-button>
              <a-radio-button value="third">三级分销员</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="关键词">
            <a-input
              v-model="query.keyword"
              placeholder="昵称或ID"
              allowClear
              style="width: 200px"
            />
          </a-form-item>
          <a-form-item v-if="query.rank === 'third'" label="二级ID">
            <a-input-number
              v-model="query.leader_id"
              :min="1"
              :precision="0"
              placeholder="二级分销员ID"
              style="width: 160px"
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
        rowKey="user_id"
        @change="handleTableChange"
      >
        <template slot="agent" slot-scope="text, record">
          <div class="agent-cell">
            <div class="name">#{{ record.user_id }} {{ record.user_nickname || '' }}</div>
          </div>
        </template>
        <template slot="level" slot-scope="text, record">
          LV{{ record.level || 1 }}
        </template>
        <template slot="rank" slot-scope="text">
          {{ query.rank === 'third' ? '三级' : '二级' }}
        </template>
        <template slot="commission" slot-scope="text, record">
          ￥{{ toAmount(record.total_commission_amount) }}
        </template>
        <template slot="special" slot-scope="text, record">
          {{ record.special_commission_count || 0 }} 个
        </template>
        <template slot="actions" slot-scope="text, record">
          <a @click="openSpecialModal(record)">特殊分佣</a>
          <template v-if="query.rank === 'second'">
            <a-divider type="vertical" />
            <a @click="viewChildren(record)">查看下级</a>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      :visible="special.visible"
      :title="specialTitle"
      :confirmLoading="special.submitting"
      width="720px"
      :footer="null"
      destroyOnClose
      @cancel="closeSpecialModal"
    >
      <a-spin :spinning="special.loading">
        <a-table
          :columns="specialColumns"
          :dataSource="special.configs"
          rowKey="product_id"
          :pagination="false"
          size="small"
        >
          <template slot="product" slot-scope="text, record">
            <div class="product-cell">
              <img :src="record.product_image" class="product-image" alt="product" />
              <div class="product-info">
                <div class="title">{{ record.product_title }}</div>
                <div class="sub">ID: {{ record.product_id }}</div>
              </div>
            </div>
          </template>
          <template slot="sharer" slot-scope="text, record">
            <a-tooltip>
              <template slot="title">
                <div class="commission-tooltip">
                  <div>佣金池：{{ formatPoolValue(record) }}</div>
                  <div>一级：{{ formatRank1Value(record) }}</div>
                  <div>二级：{{ formatRank2Value(record) }}</div>
                  <div>三级：{{ formatRank3Value(record) }}</div>
                </div>
              </template>
              <span class="commission-value">{{ formatCommissionValue(record.sharer_commission) }}</span>
            </a-tooltip>
          </template>
          <template slot="specialActions" slot-scope="text, record">
            <a @click="editSpecial(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="deleteSpecial(record)">删除</a>
          </template>
        </a-table>

        <a-divider />
        <a-form layout="vertical" class="special-form">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="选择商品">
                <a-select
                  v-model="special.form.product_id"
                  showSearch
                  :filterOption="false"
                  :loading="special.productLoading"
                  style="width: 100%"
                  placeholder="搜索商品（可选）"
                  allowClear
                  @search="handleProductSearch"
                  @change="handleProductChange"
                >
                  <a-select-option
                    v-for="option in special.productOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="specialFormLabel">
                <a-input-number
                  v-model="special.displayForm.sharer_commission"
                  :min="0"
                  :max="commissionType === 'percent' ? 100 : undefined"
                  :precision="2"
                  style="width: 160px"
                  :placeholder="defaultSharerCommissionDisplay"
                />
                <span class="unit">{{ commissionType === 'percent' ? '%' : '元' }}</span>
              </a-form-item>
            </a-col>
          </a-row>

          <!-- 实时计算各级佣金比例 -->
          <div class="commission-preview" v-if="commissionType === 'percent'">
            <div class="preview-title">佣金分配预览（基于当前输入）</div>
            <div class="preview-list">
              <div class="preview-item pool">
                <span class="label">佣金池</span>
                <span class="value">{{ calculatePoolDisplay }}%</span>
              </div>
              <div class="preview-item" :class="{ highlight: memberRank === 2, editable: memberRank === 2 }">
                <span class="label">二级佣金{{ memberRank === 2 ? '（目标成员 ✎）' : '' }}</span>
                <span class="value">{{ calculateRank2Display }}%</span>
              </div>
              <div class="preview-item" :class="{ highlight: memberRank === 3, editable: memberRank === 3 }">
                <span class="label">三级佣金{{ memberRank === 3 ? '（目标成员 ✎）' : '' }}</span>
                <span class="value">{{ calculateRank3Display }}%</span>
              </div>
              <div class="preview-item result">
                <span class="label">一级实得</span>
                <span class="value" :class="{ danger: calculateRank1Display < 0 }">{{ calculateRank1Display }}%</span>
              </div>
            </div>
            <div v-if="calculateRank1Display < 0" class="danger-hint">⚠️ 佣金池不足，请调整分佣比例</div>
          </div>

          <div class="form-actions">
            <a-button type="primary" :loading="special.submitting" :disabled="calculateRank1Display < 0" @click="handleSpecialSave">
              保存
            </a-button>
            <a-button style="margin-left: 8px" @click="resetSpecialForm">重置</a-button>
            <a-button style="margin-left: 8px" @click="closeSpecialModal">关闭</a-button>
          </div>
        </a-form>
        <div class="hint">特殊分佣设置的是该成员在其所在层级（{{ memberRank === 2 ? '二级' : '三级' }}）的佣金比例，佣金池 - 二级 - 三级 = 一级实得。</div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import teamSelectorMixin from '@/views/distribution/teams/mixins/teamSelector'
import {
  fetchTeamMembers,
  fetchTeamMemberProducts,
  upsertTeamMemberProduct,
  deleteTeamMemberProduct,
  fetchTeamProducts,
  fetchTeamCommission,
  fetchDistributionSettings
} from '@/api/distribution/index'

export default {
  name: 'DistributionTeamMembers',
  mixins: [teamSelectorMixin],
  data () {
    return {
      loading: false,
      list: [],
      query: {
        keyword: undefined,
        rank: 'second',
        leader_id: undefined,
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
        { title: '分销员', dataIndex: 'user_id', scopedSlots: { customRender: 'agent' } },
        { title: '等级', dataIndex: 'level', width: 90, scopedSlots: { customRender: 'level' } },
        { title: '层级', dataIndex: 'rank', width: 90, scopedSlots: { customRender: 'rank' } },
        { title: '订单数', dataIndex: 'total_order_count', width: 100 },
        { title: '总佣金', dataIndex: 'total_commission_amount', width: 120, scopedSlots: { customRender: 'commission' } },
        { title: '特殊分佣', dataIndex: 'special_commission_count', width: 110, scopedSlots: { customRender: 'special' } },
        { title: '操作', dataIndex: 'actions', width: 160, scopedSlots: { customRender: 'actions' } }
      ],
      commissionType: 'percent',
      // 系统佣金配置
      systemConfig: {
        rank_1_commission: 0.05,
        rank_2_commission: 0.01,
        rank_3_commission: 0
      },
      // 团队佣金配置
      teamConfig: null,
      // 当前选中商品的佣金配置
      selectedProductConfig: null,
      special: {
        visible: false,
        loading: false,
        submitting: false,
        agent: null,
        configs: [],
        form: {
          product_id: undefined,
          sharer_commission: 0
        },
        // 用于百分比展示的表单
        displayForm: {
          sharer_commission: 0
        },
        productOptions: [],
        productCache: {}, // 缓存商品配置
        productLoading: false
      }
    }
  },
  computed: {
    specialTitle () {
      if (!this.special.agent) return '特殊分佣配置'
      const nickname = this.special.agent.user_nickname || ''
      return nickname ? `特殊分佣 - #${this.special.agent.user_id} ${nickname}` : `特殊分佣 - #${this.special.agent.user_id}`
    },
    commissionUnit () {
      return this.commissionType === 'percent' ? '%' : '元'
    },
    specialColumns () {
      return [
        { title: '商品', dataIndex: 'product_id', scopedSlots: { customRender: 'product' } },
        { title: '分享佣金', dataIndex: 'sharer_commission', width: 120, scopedSlots: { customRender: 'sharer' } },
        { title: '操作', dataIndex: 'actions', width: 120, scopedSlots: { customRender: 'specialActions' } }
      ]
    },
    // 成员层级（2=二级，3=三级）
    memberRank () {
      return this.query.rank === 'third' ? 3 : 2
    },
    // 当前生效的佣金配置（优先级：商品 > 团队 > 系统）
    currentBaseConfig () {
      if (this.selectedProductConfig) {
        return this.selectedProductConfig
      }
      if (this.teamConfig) {
        return this.teamConfig
      }
      return this.systemConfig
    },
    // 表单标签，根据成员层级显示
    specialFormLabel () {
      const levelName = this.memberRank === 2 ? '二级' : '三级'
      return `${levelName}成员特殊分佣比例`
    },
    // 默认分佣展示值（百分比）- 预设该成员所在层级的佣金
    defaultSharerCommissionDisplay () {
      const config = this.currentBaseConfig
      // 根据成员层级预设对应的佣金比例
      if (this.memberRank === 2) {
        return this.toPercent(config.rank_2_commission).toFixed(2)
      } else {
        return this.toPercent(config.rank_3_commission).toFixed(2)
      }
    },
    // 计算佣金池展示值（固定不变）
    calculatePoolDisplay () {
      const config = this.currentBaseConfig
      const pool = this.toPercent(config.rank_1_commission) + this.toPercent(config.rank_2_commission) + this.toPercent(config.rank_3_commission)
      return pool.toFixed(2)
    },
    // 计算二级佣金展示值 - 如果是二级成员则跟随输入变化
    calculateRank2Display () {
      const config = this.currentBaseConfig
      if (this.memberRank === 2) {
        // 二级成员：显示用户输入的值
        return Number(this.special.displayForm.sharer_commission || 0).toFixed(2)
      }
      // 三级成员：显示基础配置的二级佣金
      return this.toPercent(config.rank_2_commission).toFixed(2)
    },
    // 计算三级佣金展示值 - 如果是三级成员则跟随输入变化
    calculateRank3Display () {
      const config = this.currentBaseConfig
      if (this.memberRank === 3) {
        // 三级成员：显示用户输入的值
        return Number(this.special.displayForm.sharer_commission || 0).toFixed(2)
      }
      // 二级成员：显示基础配置的三级佣金
      return this.toPercent(config.rank_3_commission).toFixed(2)
    },
    // 计算一级实得（佣金池 - 二级 - 三级）
    calculateRank1Display () {
      const config = this.currentBaseConfig
      const pool = this.toPercent(config.rank_1_commission) + this.toPercent(config.rank_2_commission) + this.toPercent(config.rank_3_commission)
      // 根据成员层级，使用用户输入替换对应层级的佣金
      let rank2, rank3
      if (this.memberRank === 2) {
        rank2 = Number(this.special.displayForm.sharer_commission || 0)
        rank3 = this.toPercent(config.rank_3_commission)
      } else {
        rank2 = this.toPercent(config.rank_2_commission)
        rank3 = Number(this.special.displayForm.sharer_commission || 0)
      }
      // 一级实得 = 佣金池 - 二级 - 三级
      const rank1 = pool - rank2 - rank3
      return rank1.toFixed(2)
    }
  },
  methods: {
    // 小数转百分比
    toPercent (value) {
      return Number(((Number(value) || 0) * 100).toFixed(2))
    },
    // 百分比转小数
    fromPercent (value) {
      return Number(((Number(value) || 0) / 100).toFixed(6))
    },
    async onTeamChange () {
      this.query.rank = 'second'
      this.query.leader_id = undefined
      await Promise.all([this.loadData(true), this.loadCommissionConfigs()])
    },
    async loadCommissionConfigs () {
      if (!this.teamLeaderId) return
      try {
        // 并行加载系统配置和团队配置
        const [settingsRes, teamRes] = await Promise.all([
          fetchDistributionSettings(),
          fetchTeamCommission({ team_leader_id: this.teamLeaderId })
        ])

        // 系统配置
        if (settingsRes?.config) {
          this.systemConfig = {
            rank_1_commission: Number(settingsRes.config.rank_1_commission || 0),
            rank_2_commission: Number(settingsRes.config.rank_2_commission || 0),
            rank_3_commission: Number(settingsRes.config.rank_3_commission || 0)
          }
          this.commissionType = settingsRes.config.commission_type || 'percent'
        }

        // 团队配置
        this.commissionType = teamRes?.commission_type || this.commissionType
        if (teamRes?.config) {
          this.teamConfig = {
            rank_1_commission: Number(teamRes.config.rank_1_commission || 0),
            rank_2_commission: Number(teamRes.config.rank_2_commission || 0),
            rank_3_commission: Number(teamRes.config.rank_3_commission || 0)
          }
        } else {
          this.teamConfig = null
        }
      } catch (error) {
        this.commissionType = 'percent'
      }
    },
    // 处理商品选择变化
    async handleProductChange (productId) {
      this.selectedProductConfig = null
      if (!productId) {
        // 未选商品，使用默认值
        this.initDisplayFormWithDefault()
        return
      }
      // 查找商品配置
      const cached = this.special.productCache[productId]
      if (cached) {
        this.selectedProductConfig = cached.base_commission
        this.initDisplayFormWithProduct(cached)
        return
      }
      // 从商品列表中查找
      try {
        const res = await fetchTeamProducts({
          team_leader_id: this.teamLeaderId,
          keyword: undefined,
          page: 1,
          per_page: 100
        })
        const product = (res.data || []).find(item => item.product_id === productId)
        if (product) {
          this.special.productCache[productId] = product
          this.selectedProductConfig = product.base_commission || product.team_commission
          this.initDisplayFormWithProduct(product)
        } else {
          this.initDisplayFormWithDefault()
        }
      } catch (error) {
        this.initDisplayFormWithDefault()
      }
    },
    // 使用商品配置初始化表单
    initDisplayFormWithProduct (product) {
      const config = product.team_commission || product.base_commission || this.currentBaseConfig
      // 根据成员层级预设对应的佣金比例
      let defaultValue
      if (this.memberRank === 2) {
        defaultValue = Number(config.rank_2_commission || 0)
      } else {
        defaultValue = Number(config.rank_3_commission || 0)
      }
      if (this.commissionType === 'percent') {
        this.special.displayForm.sharer_commission = this.toPercent(defaultValue)
      } else {
        this.special.displayForm.sharer_commission = defaultValue
      }
    },
    // 使用默认配置初始化表单
    initDisplayFormWithDefault () {
      const config = this.currentBaseConfig
      // 根据成员层级预设对应的佣金比例
      let defaultValue
      if (this.memberRank === 2) {
        defaultValue = Number(config.rank_2_commission || 0)
      } else {
        defaultValue = Number(config.rank_3_commission || 0)
      }
      if (this.commissionType === 'percent') {
        this.special.displayForm.sharer_commission = this.toPercent(defaultValue)
      } else {
        this.special.displayForm.sharer_commission = defaultValue
      }
    },
    async loadData (reset = false) {
      if (!this.teamLeaderId) return
      if (reset) {
        this.query.page = 1
        this.pagination.current = 1
      }
      this.loading = true
      try {
        const params = {
          team_leader_id: this.teamLeaderId,
          keyword: this.query.keyword || undefined,
          rank: this.query.rank,
          leader_id: this.query.rank === 'third' ? this.query.leader_id || undefined : undefined,
          page: this.query.page,
          per_page: this.query.per_page
        }
        const res = await fetchTeamMembers(params)
        this.list = res.data || []
        this.pagination = {
          ...this.pagination,
          current: res.current_page || 1,
          pageSize: res.per_page || this.query.per_page,
          total: res.total || 0
        }
      } catch (error) {
        this.$message.error(error?.msg || '加载团队成员失败')
      } finally {
        this.loading = false
      }
    },
    reset () {
      this.query.keyword = undefined
      this.query.rank = 'second'
      this.query.leader_id = undefined
      this.loadData(true)
    },
    handleTableChange (pagination) {
      this.query.page = pagination.current
      this.query.per_page = pagination.pageSize
      this.loadData()
    },
    handleRankChange (e) {
      const value = e?.target?.value || this.query.rank
      if (value !== 'third') {
        this.query.leader_id = undefined
      }
      this.loadData(true)
    },
    viewChildren (record) {
      this.query.rank = 'third'
      this.query.leader_id = record.user_id
      this.loadData(true)
    },
    openSpecialModal (record) {
      this.special.agent = record
      this.special.visible = true
      this.selectedProductConfig = null
      this.special.productCache = {}
      this.resetSpecialForm()
      this.loadSpecialConfigs()
      this.loadProductOptions('')
    },
    closeSpecialModal () {
      this.special.visible = false
      this.special.agent = null
      this.special.configs = []
      this.selectedProductConfig = null
      this.special.productCache = {}
      this.resetSpecialForm()
    },
    async loadSpecialConfigs () {
      if (!this.teamLeaderId || !this.special.agent) return
      this.special.loading = true
      try {
        const res = await fetchTeamMemberProducts(this.special.agent.user_id, {
          team_leader_id: this.teamLeaderId
        })
        this.special.configs = res || []
        this.ensureProductOptionsFromConfigs()
      } catch (error) {
        this.$message.error(error?.msg || '加载特殊分佣失败')
      } finally {
        this.special.loading = false
      }
    },
    async loadProductOptions (keyword) {
      if (!this.teamLeaderId) return
      this.special.productLoading = true
      try {
        const res = await fetchTeamProducts({
          team_leader_id: this.teamLeaderId,
          keyword: keyword || undefined,
          page: 1,
          per_page: 20
        })
        this.special.productOptions = (res.data || [])
          .map(item => ({
            value: item.product_id,
            label: `#${item.product_id} ${item.title}`
          }))
        this.ensureProductOptionsFromConfigs()
      } catch (error) {
        this.$message.error(error?.msg || '加载商品失败')
      } finally {
        this.special.productLoading = false
      }
    },
    handleProductSearch (keyword) {
      this.loadProductOptions(keyword)
    },
    ensureProductOptionsFromConfigs () {
      const options = new Map(this.special.productOptions.map(item => [item.value, item]))
      this.special.configs.forEach(item => {
        if (!options.has(item.product_id)) {
          options.set(item.product_id, {
            value: item.product_id,
            label: `#${item.product_id} ${item.product_title}`
          })
        }
      })
      this.special.productOptions = Array.from(options.values())
    },
    resetSpecialForm () {
      this.special.form = {
        product_id: undefined,
        sharer_commission: 0
      }
      this.selectedProductConfig = null
      this.initDisplayFormWithDefault()
    },
    editSpecial (record) {
      // 先保存要设置的佣金值
      const sharerValue = this.commissionType === 'percent'
        ? this.toPercent(record.sharer_commission)
        : Number(record.sharer_commission || 0)

      this.special.form = {
        product_id: record.product_id,
        sharer_commission: Number(record.sharer_commission || 0)
      }
      this.ensureProductOptionsFromConfigs()

      // 加载商品配置（但不覆盖佣金值）
      this.loadProductConfigForEdit(record.product_id).then(() => {
        // 配置加载完成后，设置实际的佣金值（覆盖默认值）
        this.special.displayForm.sharer_commission = sharerValue
      })
    },
    // 编辑时加载商品配置（只加载配置，不初始化表单值）
    async loadProductConfigForEdit (productId) {
      this.selectedProductConfig = null
      if (!productId) return

      const cached = this.special.productCache[productId]
      if (cached) {
        this.selectedProductConfig = cached.base_commission || cached.team_commission
        return
      }

      try {
        const res = await fetchTeamProducts({
          team_leader_id: this.teamLeaderId,
          keyword: undefined,
          page: 1,
          per_page: 100
        })
        const product = (res.data || []).find(item => item.product_id === productId)
        if (product) {
          this.special.productCache[productId] = product
          this.selectedProductConfig = product.base_commission || product.team_commission
        }
      } catch (error) {
        // 忽略错误
      }
    },
    async handleSpecialSave () {
      if (!this.teamLeaderId || !this.special.agent) return
      if (!this.special.form.product_id) {
        this.$message.warning('请选择商品')
        return
      }
      // 转换百分比为小数
      let sharerCommission
      if (this.commissionType === 'percent') {
        sharerCommission = this.fromPercent(this.special.displayForm.sharer_commission)
      } else {
        sharerCommission = Number(this.special.displayForm.sharer_commission || 0)
      }
      this.special.submitting = true
      try {
        await upsertTeamMemberProduct(this.special.agent.user_id, {
          team_leader_id: this.teamLeaderId,
          product_id: this.special.form.product_id,
          sharer_commission: sharerCommission
        })
        this.$message.success('保存成功')
        await this.loadSpecialConfigs()
        await this.loadData()
      } catch (error) {
        this.$message.error(error?.msg || '保存失败')
      } finally {
        this.special.submitting = false
      }
    },
    deleteSpecial (record) {
      if (!this.teamLeaderId || !this.special.agent) return
      this.$confirm({
        title: '确认删除该特殊分佣配置？',
        content: record.product_title || `商品 ${record.product_id}`,
        onOk: async () => {
          await deleteTeamMemberProduct(this.special.agent.user_id, record.product_id, {
            team_leader_id: this.teamLeaderId
          })
          this.$message.success('已删除')
          await this.loadSpecialConfigs()
          await this.loadData()
        }
      })
    },
    formatCommissionValue (value) {
      const num = Number(value || 0)
      if (this.commissionType === 'percent') return `${(num * 100).toFixed(2)}%`
      return `￥${this.toAmount(num)}`
    },
    // 获取特殊分佣记录对应的商品佣金配置
    getRecordConfig (record) {
      // 尝试从缓存获取商品配置
      const cached = this.special.productCache[record.product_id]
      if (cached) {
        return cached.team_commission || cached.base_commission || this.currentBaseConfig
      }
      return this.currentBaseConfig
    },
    // 格式化佣金池值（用于tooltip）
    formatPoolValue (record) {
      const config = this.getRecordConfig(record)
      const pool = Number(config.rank_1_commission || 0) + Number(config.rank_2_commission || 0) + Number(config.rank_3_commission || 0)
      if (this.commissionType === 'percent') return `${(pool * 100).toFixed(2)}%`
      return `￥${this.toAmount(pool)}`
    },
    // 格式化一级佣金值（用于tooltip）- 计算实际一级（佣金池 - 特殊分佣 - 二级 - 三级）
    formatRank1Value (record) {
      const config = this.getRecordConfig(record)
      const pool = Number(config.rank_1_commission || 0) + Number(config.rank_2_commission || 0) + Number(config.rank_3_commission || 0)
      const sharer = Number(record.sharer_commission || 0)
      // 根据成员层级计算
      let rank1
      if (this.memberRank === 2) {
        rank1 = pool - sharer - Number(config.rank_3_commission || 0)
      } else {
        rank1 = pool - Number(config.rank_2_commission || 0) - sharer
      }
      if (this.commissionType === 'percent') return `${(rank1 * 100).toFixed(2)}%`
      return `￥${this.toAmount(rank1)}`
    },
    // 格式化二级佣金值（用于tooltip）
    formatRank2Value (record) {
      const config = this.getRecordConfig(record)
      // 如果是二级成员，显示特殊分佣值；否则显示配置值
      const value = this.memberRank === 2 ? Number(record.sharer_commission || 0) : Number(config.rank_2_commission || 0)
      if (this.commissionType === 'percent') return `${(value * 100).toFixed(2)}%`
      return `￥${this.toAmount(value)}`
    },
    // 格式化三级佣金值（用于tooltip）
    formatRank3Value (record) {
      const config = this.getRecordConfig(record)
      // 如果是三级成员，显示特殊分佣值；否则显示配置值
      const value = this.memberRank === 3 ? Number(record.sharer_commission || 0) : Number(config.rank_3_commission || 0)
      if (this.commissionType === 'percent') return `${(value * 100).toFixed(2)}%`
      return `￥${this.toAmount(value)}`
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

.agent-cell {
  .name {
    font-weight: 500;
  }
}

.product-cell {
  display: flex;
  align-items: center;
}

.product-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 10px;
  background: #f5f5f5;
}

.product-info {
  .title {
    font-weight: 500;
  }
  .sub {
    color: #999;
    font-size: 12px;
  }
}

.special-form {
  margin-top: 12px;
}

.unit {
  margin-left: 6px;
  color: #999;
}

.hint {
  margin-top: 12px;
  color: #999;
  font-size: 12px;
}

.commission-value {
  cursor: help;
  border-bottom: 1px dashed #999;
}

.commission-tooltip {
  line-height: 1.8;
}

.commission-preview {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 6px;
  padding: 12px 16px;
  margin: 12px 0;

  .preview-title {
    font-weight: 500;
    margin-bottom: 10px;
    color: #52c41a;
  }

  .preview-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .preview-item {
    display: flex;
    flex-direction: column;
    padding: 8px 12px;
    background: #fff;
    border-radius: 4px;
    min-width: 120px;

    .label {
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
    }

    .value {
      font-size: 16px;
      font-weight: 600;
      color: #333;

      &.danger {
        color: #ff4d4f;
      }
    }

    &.pool {
      border-left: 3px solid #1890ff;
    }

    &.highlight {
      border-left: 3px solid #52c41a;
      background: #f6ffed;
    }

    &.editable {
      border: 2px dashed #52c41a;
      .value {
        color: #52c41a;
        font-weight: 700;
      }
    }

    &.result {
      border-left: 3px solid #722ed1;
    }
  }

  .danger-hint {
    margin-top: 10px;
    color: #ff4d4f;
    font-size: 13px;
  }
}

.form-actions {
  margin-top: 16px;
}
</style>
