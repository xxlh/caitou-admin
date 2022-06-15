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
        <a-form-item label="区域名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入区域名称'}]}]" />
        </a-form-item>
        <a-form-item label="选择地区" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <SelectRegion
            placeholder="请选择省市区"
            v-decorator="['cascader', {rules: [{required: true, message: '请选择省市区'}]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import * as Api from '@/api/area'
import { SelectRegion } from '@/components'

export default {
  components: {
    SelectRegion,
  },
  data () {
    return {
      // 对话框标题
      title: '编辑地址',
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
    }
  },
  methods: {

    /**
     * 显示对话框
     */
    edit (record) {
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
      record.cascader = [
        record.province,
        record.city,
        record.district
      ]
      this.$nextTick(() => {
        setFieldsValue(record)
      })
    },

    /**
     * 确认按钮
     */
    handleSubmit (e) {
      e.preventDefault()
      // 表单验证
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
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
    },

    /**
    * 提交到后端api
    */
    onFormSubmit (values) {
      this.confirmLoading = true
      const [province, city, district] = values.cascader
      delete values.cascader
      Api.edit(this.record.id, {...values, province, city, district})
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
    },

  }
}
</script>
