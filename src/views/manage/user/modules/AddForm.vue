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
        <a-form-item label="管理员姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', {rules: [{required: true, min: 2, message: '请输入至少2个字符'}]}]"
          />
        </a-form-item>
        <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="后台登录用户名">
          <a-input
            v-decorator="['username', {rules: [{required: true, min: 3, message: '请输入至少4个字符'}]}]"
          />
        </a-form-item>
        <a-form-item label="用户密码" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="后台登录密码">
          <a-input
            type="password"
            v-decorator="['password', {rules: [
              {required: true, min: 6, message: '请输入至少6个字符'}
            ]}]"
          />
        </a-form-item>
        <a-form-item label="确认密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="password"
            v-decorator="['password_confirm', {rules: [
              {required: true, message: '请输入确认密码'},
              {validator: compareToFirstPassword}
            ]}]"
          />
        </a-form-item>
        <a-form-item label="手机" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['phone', {rules: [{required: true, message: '请输入手机号'}]}]"
          />
        </a-form-item>
        <a-form-item label="邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['email', {initialValue: null}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import * as Api from '@/api/store/user'

export default {
  data () {
    return {
      // 对话框标题
      title: '',
      // 标签布局属性
      labelCol: {
        span: 7
      },
      // 输入框布局属性
      wrapperCol: {
        span: 13
      },
      // modal(对话框)是否可见
      visible: false,
      // modal(对话框)确定按钮 loading
      confirmLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
    }
  },
  methods: {

    /**
     * 显示对话框
     */
    add () {
      this.title = '新增管理员'
      this.visible = true
    },

    /**
     * 确认按钮
     */
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields } } = this
      // 表单验证
      validateFields((errors, values) => {
        // 整理角色id
        if (values.roles) {
          values.roles = values.roles.map(item => item.value)
        }
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
     * 验证确认密码是否一致
     */
    compareToFirstPassword (rule, value, callback) {
      const { form } = this
      if (value && value !== form.getFieldValue('password')) {
        return new Error('您输入的确认密码不一致')
      }
      return true
    },

    /**
    * 提交到后端api
    */
    onFormSubmit (values) {
      this.confirmLoading = true
      Api.add(values)
        .then((result) => {
           // 显示成功
          this.$message.success('添加成功', 1.5)
          // 关闭对话框
          this.handleCancel()
          // 通知父端组件提交完成了
          this.$emit('handleSubmit', values)
        })
        .catch(err => this.$message.success(err.message, 1.5))
        .finally((result) => {
          this.confirmLoading = false
        })
    }

  }
}
</script>
