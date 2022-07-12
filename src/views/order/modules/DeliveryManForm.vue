<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :isLoading="isLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="isLoading">
      <a-form :form="form">
        <a-form-item label="菜头骑士" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['man_id', { rules: [{ required: true, message: '请选择骑士' }] }]"
            placeholder="请选择骑士"
          >
            <a-select-option
              v-for="item in menList"
              :key="item.id"
              :value="item.id"
            >{{ item.name }}</a-select-option>
          </a-select>
          <div class="form-item-help">
            <router-link target="_blank" :to="{ path: '/setting/delivery/man/index' }">菜头骑士管理</router-link>
          </div>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import * as DealApi from '@/api/order/deal'
import * as ManApi from '@/api/order/man'

export default {
  data () {
    return {
      // 对话框标题
      title: '分配骑士',
      // 标签布局属性
      labelCol: { span: 7 },
      // 输入框布局属性
      wrapperCol: { span: 13 },
      // modal(对话框)是否可见
      visible: false,
      // modal(对话框)确定按钮 loading
      isLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 物流公司列表
      menList: [],
      // 当前记录
      record: {}
    }
  },
  created () {
    // 获取骑手列表
    this.getMenList()
  },
  methods: {

    /**
     * 显示对话框
     */
    show (record) {
      // 显示窗口
      this.visible = true
      // 当前记录
      this.record = record
    },

    // 获取物流公司列表
    getMenList () {
      this.isLoading = true
      ManApi.list({per_page: 99, area_id: this.$store.getters.areaId})
        .then(result => {
          this.menList = result.data
        })
        .finally(() => {
          this.isLoading = false
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
      this.isLoading = true
      DealApi.allocate(this.record.delivery_deal.id, values)
        .then((result) => {
          // 显示成功
          this.$message.success('已分配', 1.5)
          // 关闭对话框事件
          this.handleCancel()
          // 通知父端组件提交完成了
          this.$emit('handleSubmit', values)
        })
        .catch(e => {
          this.$message.error(e.msg, 3)
        })
        .finally(() => {
          this.isLoading = false
        })
    }

  }
}
</script>
