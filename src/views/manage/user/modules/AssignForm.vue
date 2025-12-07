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
        <a-form-item 
          label="选择对应仓储" 
          v-show="form.getFieldValue('role') == '仓储管理员'" 
          :labelCol="labelCol" 
          :wrapperCol="wrapperCol" 
          extra="可以选择多个仓储，该管理员将管理所选的所有仓储"
        >
          <a-select
            mode="multiple"
            :options="storeList.map(store => ({label:store.name, value:store.id}))"
            :dropdownStyle="{ maxHeight: '500px', overflow: 'auto' }"
            placeholder="请选择一个或多个仓储"
            allowClear
            showSearch
            :filterOption="(input, option) => option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0"
            v-decorator="['store_ids', {rules: [{required: form.getFieldValue('role') == '仓储管理员', message: '请至少选择一个仓储', type: 'array'}]}]"
          />
        </a-form-item>
        <a-form-item label="选择对应区域" v-show="form.getFieldValue('role') == '区域管理员'" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="后台登录密码">
          <a-select
            :options="areaList.map(store => ({label:store.name, value:store.id}))"
            :dropdownStyle="{ maxHeight: '500px', overflow: 'auto' }"
            allowClear
            v-decorator="['area_id', {rules: [{required: form.getFieldValue('role') == '区域管理员', message: '请至少选择一个对应仓储'}]}]"
          ></a-select>
        </a-form-item>
        <a-form-item 
          label="可管理的分销员" 
          v-show="form.getFieldValue('role') == '分销管理员'" 
          :labelCol="labelCol" 
          :wrapperCol="wrapperCol" 
          extra="可以选择多个最上级分销员，该管理员将管理所选的分销员及其团队；不选择则管理全部分销员"
        >
          <a-select
            mode="multiple"
            :options="agentList.map(agent => ({label: `${agent.user_nickname || '未命名'} (ID: ${agent.user_id})`, value: agent.user_id}))"
            :dropdownStyle="{ maxHeight: '500px', overflow: 'auto' }"
            placeholder="全部"
            allowClear
            showSearch
            :loading="agentLoading"
            :filterOption="(input, option) => option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0"
            :notFoundContent="agentLoading ? '正在加载分销员列表...' : (agentList.length === 0 ? '还没有最上级分销员' : '未找到匹配的分销员')"
            v-decorator="['agent_ids', {rules: [{type: 'array'}]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import * as UserApi from '@/api/store/user'
import { fetchAgents, assignAgentsToManager, fetchManagerAgents } from '@/api/distribution/index'

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
      form: this.$form.createForm(this, {
        onValuesChange: (props, values) => {
          // 当角色改变为"分销管理员"时，加载分销员列表
          if (values.role === '分销管理员' && this.agentList.length === 0) {
            this.loadAgents()
          }
        }
      }),

      // 角色列表 树状结构
      roleListTreeData: [],
      storeListTreeData: [],
      // 当前记录
      record: {},
      
      // 分销员相关
      agentList: [],          // 所有可选分销员列表
      agentLoading: false     // 加载状态
    }
  },
  methods: {

    /**
     * 显示对话框
     */
    async edit (record) {
      // 显示窗口
      this.title = '编辑管理员'
      this.visible = true
      // 当前管理员记录
      this.record = record
      // 获取角色列表
      record.role && record.role['name'] != '超级管理员' && this.getRoleList()
      
      // 如果是分销管理员，加载分销员列表和已分配的分销员
      if (record.roles?.some(r => r.name === '分销管理员')) {
        await this.loadAgents()
        await this.loadAssignedAgents(record.id)
      }
      
      // 设置默认值
      this.setFieldsValue()
    },
    
    /**
     * 关闭对话框时重置数据
     */
    handleCancel () {
      this.visible = false
      this.form.resetFields()
      // 清空分销员相关数据
      this.agentList = []
    },

    /**
     * 设置默认值
     */
    setFieldsValue () {
      const { form: { setFieldsValue }, getCheckedRoleKeys } = this
      this.$nextTick(() => {
        const data = _.pick(this.record, ['username', 'name', 'sort'])
        
        // 设置角色
        const currentRole = this.record.roles?.find(r => 
          ['仓储管理员', '区域管理员', '分销管理员'].includes(r.name)
        )
        if (currentRole) {
          data.role = currentRole.name
          
          // 如果是仓储管理员，设置仓储ID列表
          if (currentRole.name === '仓储管理员') {
            const storeIds = this.record.roles
              ?.filter(r => r.name === '仓储管理员')
              .map(r => r.store_id)
              .filter(id => id != null)
            if (storeIds && storeIds.length > 0) {
              data.store_ids = storeIds
            }
          }
          
          // 如果是区域管理员，设置区域ID
          if (currentRole.name === '区域管理员' && currentRole.area_id) {
            data.area_id = currentRole.area_id
          }
          
          // 如果是分销管理员，设置已分配的分销员ID列表
          if (currentRole.name === '分销管理员' && this.record.agent_ids) {
            data.agent_ids = this.record.agent_ids
          }
        }
        
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
    async onFormSubmit (values) {
      this.confirmLoading = true
      try {
        // 先分配角色
        // 注意：仓储管理员现在支持多选(store_ids数组)
        // 后端需要修改以支持多仓储分配
        // 参考：MULTI_STORE_ADMIN_IMPLEMENTATION.md
        await UserApi.assign(this.record['id'], values)
        
        // 如果是分销管理员，额外分配可管理的分销员
        // 注意：如果 agent_ids 为空数组或未定义，代表管理全部分销员
        if (values.role === '分销管理员') {
          await assignAgentsToManager(this.record['id'], {
            agent_ids: values.agent_ids || []
          })
        }
        
        // 显示成功
        this.$message.success('已分配角色', 1.5)
        // 关闭对话框事件
        this.handleCancel()
        // 通知父端组件提交完成了
        this.$emit('handleSubmit', values)
      } catch (error) {
        this.$message.error(error?.msg || '分配失败')
      } finally {
        this.confirmLoading = false
      }
    },

    /**
     * 加载所有分销员列表（只加载最上级的分销员：first_leader 为空且 first_members_count > 0）
     */
    async loadAgents () {
      this.agentLoading = true
      try {
        const res = await fetchAgents({ 
          top_level_only: 1,  // 后端筛选最上级分销员
          per_page: 999 
        })
        this.agentList = (res.data || []).map(agent => ({
          key: agent.user_id.toString(),
          user_id: agent.user_id,
          user_nickname: agent.user_nickname,
          level: agent.level,
          first_members_count: agent.first_members_count || 0
        }))
      } catch (error) {
        this.$message.error('加载分销员列表失败')
        console.error('Load agents error:', error)
      } finally {
        this.agentLoading = false
      }
    },

    /**
     * 加载已分配的分销员
     */
    async loadAssignedAgents (memberId) {
      try {
        const res = await fetchManagerAgents(memberId, { per_page: 999 })
        const agentIds = (res.data || []).map(item => item.agent_id)
        // 将已分配的分销员ID存储到 record 中，稍后在 setFieldsValue 中使用
        this.record.agent_ids = agentIds
      } catch (error) {
        // 如果没有分配过，可能会404，这是正常的
        console.log('Load assigned agents info:', error)
        this.record.agent_ids = []
      }
    }

  }
}
</script>
