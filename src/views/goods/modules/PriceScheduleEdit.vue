<template>
  <a-modal
    :title="title"
    :width="720"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="选择商品" v-show="!goodsId" :labelCol="labelCol" :wrapperCol="wrapperCol">
           <SelectGoods v-decorator="['product_id', { rules: [{ required: true, message: '请选择指定的商品' }] }]" :multiple="false" :disabled="isEditing" :defaultList="containGoodsList" @change="selectGoods" />
        </a-form-item>
        <a-form-item label="选择规格" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['sku_id', {rules: [{required: true, message: '请选择目标规格'}]}]" :options="skusOption" :disabled="isEditing" @change="selectSku" />
        </a-form-item>
        <a-form-item label="调整价格" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['target_dates', {rules: [{required: targetDatesOption.length > 0, message: '请选择对应团期'}]}]" mode="multiple" :options="targetDatesOption" v-show="targetDatesOption.length" style="width:200px" />
          <a-input-number :min="0.01" :precision="2" v-decorator="['target_price', {rules: [{required: true, message: '请输入目标调整的价格'}]}]" /> 元
          <p v-if="form.getFieldValue('sku_id') && skus.length" class="form-item-help">
            <small v-if="!targetDatesOption.length">当前价格：{{skus.find(sku => sku.id == form.getFieldValue('sku_id')).price}}</small>
            <small v-else-if="form.getFieldValue('target_dates') && form.getFieldValue('target_dates').length == 1">当前价格：{{skus.find(sku => sku.id == form.getFieldValue('sku_id')).daily_price[ form.getFieldValue('target_dates')[0] ].price}}</small>
          </p>
        </a-form-item>
        <a-form-item label="调整库存" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch v-model="isChangeStock" />
          <a-input-number v-show="isChangeStock" :min="0" v-decorator="['target_stock']" />
          <p v-if="form.getFieldValue('sku_id') && skus.length" class="form-item-help">
            <small v-if="!targetDatesOption.length">当前库存：{{skus.find(sku => sku.id == form.getFieldValue('sku_id')).stock}}</small>
            <small v-else-if="form.getFieldValue('target_dates') && form.getFieldValue('target_dates').length == 1">当前库存：{{skus.find(sku => sku.id == form.getFieldValue('sku_id')).daily_price[ form.getFieldValue('target_dates')[0] ].stock}}</small>
          </p>
        </a-form-item>
        <a-form-item label="模板" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-model="quickOption" button-style="solid" @change="changeQuickOption">
            <a-radio-button value="every_1_daily_at_6">每天6点场</a-radio-button>
            <a-radio-button value="every_1_daily_at_9">每天9点场</a-radio-button>
            <a-radio-button value="every_1_daily_at_12">每天12点场</a-radio-button>
            <a-radio-button value="every_1_daily_at_16">每天16点场</a-radio-button>
            <a-radio-button value="every_1_daily_at_20">每天20点场</a-radio-button>
            <a-radio-button value="every_1_daily_at_0">每天0点场</a-radio-button>
            <a-radio-button value="">自定义</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="触发日期" v-show="quickOption" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker v-model="adjust_date" @change="changeQuickOption" :allowClear="false" />
        </a-form-item>
        <a-form-item label="触发时间" v-show="!quickOption" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-config-provider :locale="locale">
            <a-date-picker v-decorator="['adjust_at', {rules: [{required: true, message: '请选择触发时间'}]}]" show-time />
          </a-config-provider>
        </a-form-item>
        <a-form-item label="重复触发" v-show="!quickOption" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch v-model="isRepeat" />
          <span v-show="isRepeat"> 每 
            <a-input-number v-decorator="['every']" />
            <a-select v-show="isRepeat" v-decorator="['repeat']" style="width:100px">
              <a-select-option value="daily">天</a-select-option>
              <a-select-option value="weekly">周</a-select-option>
              <a-select-option value="monthly">月</a-select-option>
              <a-select-option value="yearly">年</a-select-option>
            </a-select> 触发
          </span>
        </a-form-item>
        <a-form-item :label="quickOption ? '限时' : '价格库存回改'" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch v-model="isTurnBack" v-show="!quickOption" />
          <span v-show="isTurnBack || quickOption"><a-input-number :min="1" v-decorator="['turn_back_minutes', {initialValue: 60, rules: [{required: !!quickOption, message: '请输入限时分钟数'}]}]" /> {{quickOption ? '分钟' : '分钟后'}}</span>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import * as Api from '@/api/goods'
import { SelectGoods } from '@/components'
import _, { pick, get } from 'lodash'
import moment from 'moment'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';

export default {
  components: {
    SelectGoods,
  },
  props: {
    goodsId: null,
    goodsSkus: PropTypes.array.def([]),
  },
  data () {
    return {
      gId: this.goodsId,
      skus: this.goodsSkus,
      // 对话框标题
      title: '调价修改',
      // 标签布局属性
      labelCol: { span: 7 },
      // 输入框布局属性
      wrapperCol: { span: 13 },
      // modal(对话框)是否可见
      visible: false,
      // modal(对话框)确定按钮 loading
      confirmLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 适用范围：指定的商品
      containGoodsList: [],
      // 当前记录
      record: {},
      selectedSkuId: 0,
      isEditing: false,
      isChangeStock: false,
      isRepeat: false,
      isTurnBack: false,
      quickOption: '',
      adjust_date: moment(),
      locale,
    }
  },
  computed: {
    skusOption() {
      return this.skus.map(sku => ({value:sku.id, label:sku.name}))
    },
    targetDatesOption() {
      let daily_price = this.skus.find(sku => sku.id == this.selectedSkuId)?.daily_price
      return daily_price ? _(daily_price).map((dailyprice, date) => ({value:date, label:date})).value() : []
    },
  },
  methods: {
    /**
     * 显示对话框
     */
    create () {
      // 显示窗口
      this.visible = true
    },
    async edit (record) {
      this.isEditing = true
      // 显示窗口
      this.visible = true
      // 当前记录
      this.record = record
      // 设置默认值
      this.setFieldsValue()
      // 抓取skus
      if (!this.gId) this.gId = record.product_id
      if (!this.skus?.length) {
        const res = await Api.detail(this.gId)
        this.skus = this.$store.getters.storeId ? res.skus.filter(sku => sku.store_id == this.$store.getters.storeId) : res.skus
      }
      // 商品信息
      if (!this.goodsId) await this.getContainGoodsList()
    },

    // 获取指定的商品列表
    async getContainGoodsList () {
      const { record } = this
      const goodsIds = [record.product_id]
      if (goodsIds !== undefined && goodsIds.length) {
        this.isLoading = true
        await Api.listByIds(goodsIds, {store_id: this.$store.getters.storeId})
          .then(result => {
            this.containGoodsList = result.data
          })
          .finally(result => {
            this.isLoading = false
          })
      }
    },

    /**
     * 设置默认值
     */
    setFieldsValue () {
      const { record, form: { setFieldsValue } } = this
      this.$nextTick(() => {
        let data = pick(record, ['product_id', 'target_dates', 'target_price', 'target_stock', 'repeat', 'every', 'adjust_at'])
        data.sku_id = record.product_sku_id
        if (record.turn_back) {
          this.isTurnBack = true
          data.turn_back_minutes = moment(record.turn_back.adjust_at).diff(record.adjust_at, 'minutes')
          this.quickOption = 'every_' + record.every + '_' + record.repeat + '_at_' + moment(record.adjust_at).hour()
          this.adjust_date = moment(record.adjust_at)
        }
        setFieldsValue(data)
      })
      if (record.every && record.repeat) this.isRepeat = true
      this.selectedSkuId = record.product_sku_id
    },

    /**
     * 选择规格
     */
    selectSku (value) {
      this.selectedSkuId = value
    },
    async selectGoods (selectId) {
      if (this.isEditing) return
      this.gId = selectId
      const res = await Api.detail(this.gId)
      this.skus = this.$store.getters.storeId ? res.skus.filter(sku => sku.store_id == this.$store.getters.storeId) : res.skus
      this.selectedSkuId = 0
      this.form.setFieldsValue({sku_id: null})
    },

    /**
     * 修改快速改价模板
     */
    changeQuickOption (e) {
      let every = 1
      let repeat = 'daily'
      let adjust_at = this.adjust_date
      adjust_at.minute(0)
      adjust_at.second(0)
      if (!this.quickOption) return
      else if (this.quickOption == 'every_1_daily_at_6') adjust_at.hour(6)
      else if (this.quickOption == 'every_1_daily_at_9') adjust_at.hour(9)
      else if (this.quickOption == 'every_1_daily_at_12') adjust_at.hour(12)
      else if (this.quickOption == 'every_1_daily_at_16') adjust_at.hour(16)
      else if (this.quickOption == 'every_1_daily_at_20') adjust_at.hour(20)
      else if (this.quickOption == 'every_1_daily_at_0') adjust_at.hour(0)
      else this.quickOption = ''
      this.isRepeat = true
      this.form.setFieldsValue({every, repeat, adjust_at})
    },

    /**
     * 确认按钮
     */
    handleSubmit (e) {
      e.preventDefault()
      // 表单验证
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!this.isChangeStock) values.target_stock = null
        if (values.adjust_at.local) values.adjust_at = values.adjust_at.local().format()
        values.turn_back_seconds = values.turn_back_minutes * 60
        if (!this.quickOption && !this.isTurnBack) values.turn_back_seconds = null
        // 提交到后端api
        !errors && this.onFormSubmit(values)
      })
    },

    /**
     * 关闭对话框事件
     */
    handleCancel () {
      this.gId = null
      this.skus = []
      this.visible = false
      this.form.resetFields()
      this.isEditing = false
      this.isChangeStock = false
      this.isRepeat = false
      this.quickOption = ''
    },

    /**
    * 提交到后端api
    */
    onFormSubmit (values) {
      this.confirmLoading = true
      if (this.isEditing) Api.editScheduledPrice(this.record.product_id, this.record.id, {...values})
        .then((result) => {
          // 显示成功
          this.$message.success('已修改', 1.5)
          // 关闭对话框事件
          this.handleCancel()
          // 通知父端组件提交完成了
          this.$emit('handleSubmit', values)
        })
        .finally(() => {
          this.confirmLoading = false
        })
      else Api.schedulePrice(this.gId, {...values})
        .then((result) => {
          // 显示成功
          this.$message.success('已新增', 1.5)
          // 关闭对话框事件
          this.handleCancel()
          // 通知父端组件提交完成了
          this.$emit('handleSubmit', values)
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
  }
}
</script>
