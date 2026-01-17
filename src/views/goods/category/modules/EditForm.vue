<template>
  <a-modal
    title="编辑商品分类"
    :width="720"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', {rules: [{required: true, min: 2, message: '请输入至少2个字符'}]}]"
          />
        </a-form-item>
        <a-form-item label="上级分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-tree-select
            :treeData="categoryListTree"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            allowClear
            v-decorator="['parent_id']"
          />
        </a-form-item>
        <a-form-item label="分类图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <SelectImage
            :channel="channel"
            :channel_id="record.id"
            collection="category_image"
            :defaultList="record.image ? [record.image] : []"
            v-decorator="['image_id']"
          />
        </a-form-item>
        <a-form-item label="分类描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['description', {rules: [{required: false, min: 2, message: '请输入至少2个字符'}]}]"
          />
        </a-form-item>
        <a-form-item label="分类标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['slug', {rules: [{required: true, min: 2, message: '请输入至少2个字符'}]}]"
          />
        </a-form-item>
        <a-divider>分销配置</a-divider>
        <a-form-item label="开启分销" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch v-decorator="['is_distributable', { valuePropName: 'checked', initialValue: true }]" />
        </a-form-item>
        <a-form-item v-if="showDistributionFields" label="佣金类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['commission_type']" placeholder="系统默认">
            <a-select-option value="">系统默认</a-select-option>
            <a-select-option value="percent">按比例</a-select-option>
            <a-select-option value="fixed">固定金额</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="showDistributionFields" label="一级佣金" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['rank_1_commission']"
            :min="0"
            :max="commissionPercentMax"
            :precision="4"
            style="width: 200px"
          />
          <span class="ant-form-text">{{ commissionUnit }}</span>
        </a-form-item>
        <a-form-item v-if="showDistributionFields" label="二级佣金" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['rank_2_commission']"
            :min="0"
            :max="commissionPercentMax"
            :precision="4"
            style="width: 200px"
          />
          <span class="ant-form-text">{{ commissionUnit }}</span>
        </a-form-item>
        <a-form-item v-if="showDistributionFields" label="三级佣金" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['rank_3_commission']"
            :min="0"
            :max="commissionPercentMax"
            :precision="4"
            style="width: 200px"
          />
          <span class="ant-form-text">{{ commissionUnit }}</span>
        </a-form-item>
        <!-- [已废弃] is_limit_area 字段已被区域的 is_intracity 属性替代，此配置项不再使用
        <a-form-item label="同城配送商品分类" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="仅展示当前配送区域商品">
          <a-radio-group v-decorator="['is_limit_area', { initialValue: $store.getters.storeId ? true : false, rules: [{ required: true }] }]">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        -->
        <!-- <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="用户端是否展示">
          <a-radio-group v-decorator="['status', { initialValue: 1, rules: [{ required: true }] }]">
            <a-radio :value="1">显示</a-radio>
            <a-radio :value="0">隐藏</a-radio>
          </a-radio-group>
        </a-form-item> -->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import * as Api from '@/api/category'
import { SelectImage } from '@/components'
import CategoryModel from '@/common/model/Category'
import ChannelEnum from '@/common/enum/file/Channel'

export default {
  components: {
    SelectImage
  },
  props: {
    // 分类列表
    categoryList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      // 对话框标题
      title: '',
      // 标签布局属性
      labelCol: { span: 7 },
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
      // 上级分类列表
      categoryListTree: [],
      // 当前记录
      record: {},
      channel: ChannelEnum.CATEGORY.value,
    }
  },
  computed: {
    showDistributionFields () {
      return this.form.getFieldValue('is_distributable') !== false
    },
    commissionUnit () {
      return this.form.getFieldValue('commission_type') === 'percent' ? '比例(0-1)' : '元'
    },
    commissionPercentMax () {
      return this.form.getFieldValue('commission_type') === 'percent' ? 1 : undefined
    }
  },
  methods: {

    /**
     * 显示对话框
     */
    edit (record) {
      // 显示窗口
      this.visible = true
      // 当前分类记录
      this.record = record
      // 获取分类列表
      this.getCategoryList()
      // 设置默认值
      this.setFieldsValue()
    },

    /**
     * 设置默认值
     */
    setFieldsValue () {
      const { record, form: { setFieldsValue } } = this
      // 设置表单内容 (is_limit_area 已废弃，不再设置)
      this.$nextTick(() => {
        const data = _.pick(record, [
          'name',
          'parent_id',
          'image_id',
          'status',
          'description',
          'slug',
          'is_distributable',
          'commission_type',
          'rank_1_commission',
          'rank_2_commission',
          'rank_3_commission'
        ])
        if (data.is_distributable === undefined || data.is_distributable === null) data.is_distributable = true
        if (!data.commission_type) data.commission_type = ''
        setFieldsValue(data)
      })
    },

    /**
     * 获取分类列表
     */
    getCategoryList () {
      const { categoryList } = this
      // 格式化分类列表
      const selectList = CategoryModel.formatTreeData(categoryList)
      // 顶级分类
      this.categoryListTree = [{
        title: '顶级分类',
        key: 0,
        value: 0
      }].concat(selectList)
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
        if (!errors) {
          this.onFormSubmit(values)
        }
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
      if (!values.parent_id) delete values.parent_id;
      this.confirmLoading = true
      if (values.commission_type === '') values.commission_type = null
      if (values.commission_type === 'percent') {
        const sum = Number(values.rank_1_commission || 0) +
          Number(values.rank_2_commission || 0) +
          Number(values.rank_3_commission || 0)
        if (sum > 1) {
          this.$message.error('佣金比例总和不能超过100%')
          this.confirmLoading = false
          return
        }
      }
      Api.edit(this.record['id'], values)
        .then((result) => {
          // 显示成功
          this.$message.success('更新成功', 1.5)
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

<style lang="less" scoped>
.ant-form-text {
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.45);
}
</style>
