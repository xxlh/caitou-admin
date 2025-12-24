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
        <a-form-item label="支持同城配送" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="开启后该区域可展示同城配送商品">
          <a-radio-group v-decorator="['is_intracity', {initialValue: true, rules: [{required: true}]}]">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="筛选分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['isFilter', {initialValue: categories.length ? 'filter' : 'all', rules: [{required: true}]}]">
                <a-radio value="all">全部展示</a-radio>
                <a-radio value="filter">部分展示</a-radio>
              </a-radio-group>
          <a-tree-select
            v-show="form.getFieldValue('isFilter') == 'filter'"
            placeholder="请选择商品分类"
            :dropdownStyle="{ maxHeight: '500px', overflow: 'auto' }"
            :treeData="categoryList"
            treeCheckable
            treeCheckStrictly
            allowClear
            v-decorator="['category_values']"
          ></a-tree-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import * as Api from '@/api/area'
import { SelectRegion } from '@/components'
import CategoryModel from '@/common/model/Category'

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
      // 分类
      categories: [],
      categoryList: [],
      // 分类数据加载状态
      categoriesLoading: false,
    }
  },
  methods: {

    /**
     * 显示对话框
     */
    async edit (record) {
      // 显示窗口
      this.visible = true
      // 当前记录
      this.record = record
      // 重置分类相关状态
      this.categories = []
      this.categoryList = []
      this.categoriesLoading = true
      // 先设置基础信息（区域名称、省市区等），用户可以立即看到
      this.setFieldsValue()
      // 异步加载分类数据，加载完成后更新分类相关字段
      this.loadCategoriesData(record)
    },

    /**
     * 异步加载分类数据
     */
    async loadCategoriesData (record) {
      try {
        // 并行加载分类筛选和分类树
        const [categories, categoryList] = await Promise.all([
          Api.getCategories(record.id),
          CategoryModel.getCategoryTreeSelect()
        ])
        this.categories = categories
        this.categoryList = categoryList
        // 更新分类相关字段
        const categoryValues = categories.map(c => ({ value: c.id }))
        this.$nextTick(() => {
          this.form.setFieldsValue({
            isFilter: categories.length ? 'filter' : 'all',
            category_values: categoryValues
          })
        })
      } finally {
        this.categoriesLoading = false
      }
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
      if (values.isFilter == 'all') values.category_ids = []
      else values.category_ids = values.category_values.map(item => item.value)
      delete values.isFilter
      delete values.category_values
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
