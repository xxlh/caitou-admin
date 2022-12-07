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
        <a-form-item label="选择规格" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['sku_id', {rules: [{required: true, message: '请选择目标规格'}]}]" :options="skusOption" :disabled="isEditing" @change="selectSku" />
        </a-form-item>
        <a-form-item label="调整价格" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['target_dates', {rules: [{required: true, message: '请选择对应团期'}]}]" mode="multiple" :options="targetDatesOption" v-show="targetDatesOption.length" style="width:200px" />
          <a-input-number :min="0.01" :precision="2" v-decorator="['target_price', {rules: [{required: true, message: '请输入目标调整的价格'}]}]" /> 元
        </a-form-item>
        <a-form-item label="模板" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-model="quickOption" button-style="solid" @change="changeQuickOption">
            <a-radio-button value="every_1_daily_at_6">每天6点场</a-radio-button>
            <a-radio-button value="every_1_daily_at_9">每天9点场</a-radio-button>
            <a-radio-button value="every_1_daily_at_12">每天12点场</a-radio-button>
            <a-radio-button value="every_1_daily_at_16">每天16点场</a-radio-button>
            <a-radio-button value="every_1_daily_at_0">每天0点场</a-radio-button>
            <a-radio-button value="">自定义</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="限时" v-show="quickOption" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number :min="1" v-decorator="['turn_back_minutes', {initialValue: 60, rules: [{required: !!quickOption, message: '请输入限时分钟数'}]}]" /> 分钟
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
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import * as Api from '@/api/goods'
import _ from 'lodash'
import moment from 'moment'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';

export default {
  components: {
  },
  props: {
    goodsId: null,
    skus: PropTypes.array.def([]),
  },
  data () {
    return {
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
      // 当前记录
      record: {},
      selectedSkuId: 0,
      isEditing: false,
      isRepeat: false,
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
    edit (record) {
      this.isEditing = true
      // 显示窗口
      this.visible = true
      // 当前记录
      this.record = record
      // 设置默认值
      this.setFieldsValue()
    },

    /**
     * 设置默认值
     */
    setFieldsValue () {
      const { record, form: { setFieldsValue } } = this
      record.sku_id = record.product_sku_id
      this.$nextTick(() => {
        // setFieldsValue(pick(record, ['name', 'contact_name', 'contact_phone', 'province', 'city', 'district', 'address', 'sort']))
        if (record.turn_back) {
          record.turn_back_minutes = moment(record.turn_back.adjust_at).diff(record.adjust_at, 'minutes')
          this.quickOption = 'every_' + record.every + '_' + record.repeat + '_at_' + moment(record.adjust_at).hour()
          this.adjust_date = moment(record.adjust_at)
        }
        setFieldsValue(record)
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
      else if (this.quickOption == 'every6') adjust_at.hour(6)
      else if (this.quickOption == 'every9') adjust_at.hour(9)
      else if (this.quickOption == 'every12') adjust_at.hour(12)
      else if (this.quickOption == 'every16') adjust_at.hour(16)
      else if (this.quickOption == 'every0') adjust_at.hour(0)
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
        if (values.adjust_at.local) values.adjust_at = values.adjust_at.local().format()
        values.turn_back_seconds = values.turn_back_minutes * 60
        // 提交到后端api
        !errors && this.onFormSubmit(values)
      })
    },

    /**
     * 关闭对话框事件
     */
    handleCancel () {
      this.visible = false
      this.form.resetFields()
      this.isEditing = false
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
      else Api.schedulePrice(this.goodsId, {...values})
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
