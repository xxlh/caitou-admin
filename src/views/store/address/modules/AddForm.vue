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
        <!-- <a-form-item label="地址类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['type', {initialValue: 10, rules: [{required: true}]}]">
            <a-radio :value="10">发货地址</a-radio>
            <a-radio :value="20">退货地址</a-radio>
          </a-radio-group>
        </a-form-item> -->
        <a-form-item label="仓储名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入仓储名称'}]}]" />
        </a-form-item>
        <a-form-item label="联系人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['contact_name', {rules: [{required: true, message: '请输入联系人姓名'}]}]" />
        </a-form-item>
        <a-form-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['contact_phone', {rules: [{required: true, message: '请输入联系电话'}]}]" />
        </a-form-item>
        <a-form-item label="选择地区" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <SelectRegion
            placeholder="请选择省市区"
            v-decorator="['cascader', {rules: [{required: true, message: '请选择省市区'}]}]"
            @change="onCascaderChange"
          />
        </a-form-item>
        <a-form-item label="地图选点" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{lng}}, {{lat}} <a-button type="primary" @click="openSelectMap">打开地图选择位置</a-button>
          <SelectMapPoint ref="SelectMap" v-model="showMap" :lng="lng" :lat="lat" @complete="onSelectMap" />
        </a-form-item>
        <a-form-item label="详细地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['address', {rules: [{required: true, message: '请输入详细地址'}]}]" />
        </a-form-item>
        <a-form-item label="所属区域" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['area_id', {rules: [{required: false}]}]" :options="areas"></a-select>
        </a-form-item>
        <!-- <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="数字越小越靠前">
          <a-input-number
            :min="0"
            v-decorator="['sort', {initialValue: 100, rules: [{required: true, message: '请输入排序值'}]}]"
          />
        </a-form-item> -->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import * as Api from '@/api/store/address'
import * as AreaApi from '@/api/area'
import { SelectRegion } from '@/components'
import SelectMapPoint from './SelectMapPoint'

export default {
  components: {
    SelectRegion,
    SelectMapPoint,
  },
  data () {
    return {
      // 对话框标题
      title: '新增地址',
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
      // 地图定位
      showMap: false,
      lng: null,
      lat: null,
      // 区域
      areas: [],
      province: '',
    }
  },
  created () {
      // 加载区域
      AreaApi.list({per_page:100}).then(res => {
        this.areas = res.data.map(a => ({value:a.id, label:a.name||`${a.province}_${a.id}`}))
      })
  },
  methods: {

    /**
     * 显示对话框
     */
    add () {
      // 显示窗口
      this.visible = true
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
      Api.add({...values, province, city, district, longitude: this.lng, latitude: this.lat})
        .then((result) => {
          // 显示成功
          this.$message.success('创建成功', 1.5)
          // 关闭对话框事件
          this.handleCancel()
          // 通知父端组件提交完成了
          this.$emit('handleSubmit', values)
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    /**
     * 地图选点
     */
    openSelectMap () {
      this.showMap = true
      const { form: { setFieldsValue, getFieldsValue } } = this
      let record = getFieldsValue()
      this.$refs.SelectMap.onOpen({
        city: record.cascader[1] || record.cascader[0],
        lng: this.lng,
        lat: this.lat,
      })
    },
    onSelectMap (data) {
      const { form: { setFieldsValue, getFieldsValue } } = this
      this.lng = data.lng
      this.lat = data.lat
      let record = getFieldsValue()
      if (!record.address) {
        record.address = data.address
        setFieldsValue(record)
      }
    },

    async onCascaderChange(value) {
      let province = ''
      if (value.length) province = value[0]
      if (province != this.province) {
        let res = await AreaApi.list({province, per_page:100})
        this.areas = res.data.map(a => ({value:a.id, label:a.name||`${a.province}_${a.id}`}))
        this.province = province
      }
    },
  }
}
</script>
