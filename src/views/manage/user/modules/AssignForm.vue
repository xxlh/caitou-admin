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
        <a-form-item
          label="仓储角色"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          extra="后台管理员角色"
        >
          <a-select
            :options="roleList.map(role => ({label:role.name, value:role.name}))"
            :dropdownStyle="{ maxHeight: '500px', overflow: 'auto' }"
            allowClear
            v-decorator="['role', {rules: [{required: true, message: '请至少选择一个角色'}]}]"
          ></a-select>
        </a-form-item>
        <a-form-item label="选择对应仓储" v-show="form.getFieldValue('role') == '仓储管理员'" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="后台登录密码">
          <a-select
            :options="storeList.map(store => ({label:store.name, value:store.id}))"
            :dropdownStyle="{ maxHeight: '500px', overflow: 'auto' }"
            allowClear
            v-decorator="['store_id', {rules: [{required: form.getFieldValue('role') == '仓储管理员', message: '请至少选择一个对应仓储'}]}]"
          ></a-select>
        </a-form-item>
        <a-form-item label="选择对应区域" v-show="form.getFieldValue('role') == '区域管理员'" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="后台登录密码">
          <a-select
            :options="areaList.map(store => ({label:store.name, value:store.id}))"
            :dropdownStyle="{ maxHeight: '500px', overflow: 'auto' }"
            allowClear
            v-decorator="['area_id', {rules: [{required: form.getFieldValue('role') == '区域管理员', message: '请至少选择一个对应仓储'}]}]"
          ></a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import * as UserApi from '@/api/store/user'

export default {
  props: {
    // 角色列表
    roleList: {
      type: Array,
      required: true
    },
    // 仓储列表
    storeList: {
      type: Array,
      required: true
    },
    // 区域列表
    areaList: {
      type: Array,
      required: true
    },
  },
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

      // 角色列表 树状结构
      roleListTreeData: [],
      storeListTreeData: [],
      // 当前记录
      record: {}
    }
  },
  methods: {

    /**
     * 显示对话框
     */
    edit (record) {
      // 显示窗口
      this.title = '编辑管理员'
      this.visible = true
      // 当前管理员记录
      this.record = record
      // 获取角色列表
      record.role && record.role['name'] != '超级管理员' && this.getRoleList()
      // 设置默认值
      this.setFieldsValue()
    },

    /**
     * 设置默认值
     */
    setFieldsValue () {
      const { form: { setFieldsValue }, getCheckedRoleKeys } = this
      this.$nextTick(() => {
        const data = _.pick(this.record, ['username', 'name', 'sort'])
        // data.roles = getCheckedRoleKeys()
        setFieldsValue(data)
      })
    },

    /**
     * 获取角色列表
     */
    getRoleList () {
      const { roleList } = this
      // 格式化角色列表
      // this.roleListTreeData = this.formatTreeData(roleList)
    },

    /**
     * 设置默认选中的角色
     */
    getCheckedRoleKeys () {
      const { roleList, record } = this
      const getCheckedKeys = (list) => {
        let keysArr = []
        list.forEach(item => {
          if (record['roleIds'].includes(item['id'])) {
            keysArr.push({
              label: item['name'],
              value: item['id']
            })
          }
          if (item.children && item.children.length) {
            const childrenArr = getCheckedKeys(item.children)
            childrenArr.length && (keysArr = keysArr.concat(childrenArr))
          }
        })
        return keysArr
      }
      return getCheckedKeys(roleList)
    },

    /**
     * 格式化角色列表
     */
    formatTreeData (list) {
      const data = []
      list.forEach(item => {
        const netItem = {
          title: item.name,
          key: item.id,
          value: item.id
        }
        if (item.children && item.children.length) {
          netItem['children'] = this.formatTreeData(item['children'])
        }
        data.push(netItem)
      })
      return data
    },

    /**
     * 确认按钮
     */
    handleSubmit (e) {
      e.preventDefault()
      // 表单验证
      const { form: { validateFields } } = this
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
      UserApi.assign(this.record['id'], values)
        .then((result) => {
          // 显示成功
          this.$message.success('已分配角色', 1.5)
          // 关闭对话框事件
          this.handleCancel()
          // 通知父端组件提交完成了
          this.$emit('handleSubmit', values)
        })
        .finally((result) => {
          this.confirmLoading = false
        })
    }

  }
}
</script>
