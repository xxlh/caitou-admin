<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="助力标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入助力标题"
            v-decorator="['name', { rules: [{ required: true, min: 2, message: '请输入至少2个字符' }] }]"
          />
        </a-form-item>
        <a-form-item label="助力图" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <SelectImage
            collection="assist_image"
            v-decorator="['image_id']"
          />
          <p class="form-item-help">
            <small>建议200x200的奖励图</small>
          </p>
        </a-form-item>
        <a-form-item
          label="成功奖励"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <p>
            <a-select
              placeholder="请选择奖励的优惠券"
              allowClear
              :options="couponList"
              :filter-option="false"
              v-decorator="['award_id', { rules: [{required: true}] }]"
              :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
              style="width: 200px"
            ></a-select>
          </p>
          <p>
            <span class="ml-5">同时奖励现金：</span>
            <a-input-number
              :min="0"
              :precision="2"
              v-decorator="['award_amount', { initialValue: 0 }]"
            />
            <span>元</span>
          </p>
        </a-form-item>
        <a-form-item label="对助力者奖励" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-model="isAwardTeamate">
            <a-radio :value="false">不奖励</a-radio>
            <a-radio :value="true">奖励</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-show="isAwardTeamate"
          label="助力者奖励"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <p>
            <a-select
              placeholder="请选择奖励的优惠券"
              allowClear
              :options="couponList"
              :filter-option="false"
              v-decorator="['award_teammate_id']"
              :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
              style="width: 200px"
            ></a-select>
          </p>
          <p>
            <span class="ml-5">同时奖励现金：</span>
            <a-input-number
              :min="0"
              :precision="2"
              v-decorator="['award_teammate_amount', { initialValue: 0 }]"
            />
            <span>元</span>
          </p>
          <p class="form-item-help">
            <small>每个帮忙助力用户在助力的同时获得奖励</small>
          </p>
        </a-form-item>
        <a-form-item label="需要助力数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="-1"
            :precision="0"
            v-decorator="['needs', { initialValue: 2, rules: [{ required: true, message: '请输入成功助力的需要助力数' }] }]"
          />
          <span class="ml-5">位用户</span>
          <p>
            <a-radio-group v-decorator="['is_need_new', { initialValue: 0}]">
              <a-radio :value="0">不限制</a-radio>
              <a-radio :value="1">新用户</a-radio>
            </a-radio-group>
          </p>
        </a-form-item>
        <a-form-item label="限时助力" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="-1"
            :precision="0"
            v-decorator="['hour_limited', { initialValue: 3, rules: [{ required: true, message: '请输入助力限制的小时数' }] }]"
          />
          <span class="ml-5">小时</span>
        </a-form-item>
        <a-form-item label="限制同城" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['is_city_limited', { initialValue: 1}]">
            <a-radio :value="0">不限制</a-radio>
            <a-radio :value="1">只允许同城可配送区用户助力</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="周期限制" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span class="ant-input-group-wrapper" style="width: auto">
            <span class="ant-input-wrapper ant-input-group">
              <span class="ant-input-group-addon">每</span>
              <a-select
                placeholder="限制每xx时段领取一张"
                v-decorator="['limit_once_every']"
                style="width: 150px"
              >
                <a-select-option value="day">天</a-select-option>
                <a-select-option value="week">周</a-select-option>
                <a-select-option value="month">月</a-select-option>
                <a-select-option :value="null">不限</a-select-option>
              </a-select>
              <span class="ant-input-group-addon">限领取一张</span>
            </span>
          </span>
        </a-form-item>
        <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['is_active', { initialValue: 1, rules: [{ required: true }] }]">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
          <p class="form-item-help">
            <small>如果设为隐藏将不会展示在用户端页面</small>
          </p>
        </a-form-item>
        <!-- <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="数字越小越靠前">
          <a-input-number
            :min="0"
            v-decorator="['sort', {initialValue: 100, rules:[{required: true, message: '请输入排序值'}]}]"
          />
        </a-form-item> -->
        <a-form-item class="mt-20" :wrapper-col="{ span: wrapperCol.span, offset: labelCol.span }">
          <a-button type="primary" html-type="submit" :loading="isBtnLoading">提交</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import moment from 'moment'
import * as Api from '@/api/market/assistance'
import * as CouponApi from '@/api/market/coupon'
import { InputNumberGroup, SelectImage } from '@/components'
import { ApplyRangeEnum, CouponTypeEnum, ExpireTypeEnum } from '@/common/enum/coupon'

export default {
  components: {
    InputNumberGroup,
    SelectImage,
  },
  data () {
    return {
      // 枚举类
      ApplyRangeEnum,
      CouponTypeEnum,
      ExpireTypeEnum,
      // 正在加载
      isLoading: false,
      isBtnLoading: false,
      // 标签布局属性
      labelCol: { span: 3 },
      // 输入框布局属性
      wrapperCol: { span: 10 },
      // 当前表单元素
      form: this.$form.createForm(this),
      // 奖励的优惠券列表
      couponList: [],
      isAwardTeamate: false,
    }
  },
  async created () {
    this.$nextTick(() => {
      this.$forceUpdate()
    })
    // 获取优惠券列表
    const coupons = await CouponApi.list({per_page: 99})
    this.couponList = coupons.data.map(t => ({label:`${t.id}. ${t.title}`, value:t.id}))
  },
  methods: {

    // 确认按钮
    handleSubmit (e) {
      e.preventDefault()
      // 表单验证
      const { form: { validateFields }, onFormSubmit } = this
      validateFields((errors, values) => {
        if (!values.award_teammate_id) values.award_teammate_id = 0
        if (!this.isAwardTeamate) values.award_teammate_id = 0
        if (!this.isAwardTeamate) values.award_teammate_amount = null
        !errors && onFormSubmit(values)
      })
    },

    // 提交到后端api
    onFormSubmit (values) {
      this.isLoading = true
      this.isBtnLoading = true
      Api.add(values)
        .then(result => {
          // 显示提示信息
          this.$message.success('添加成功', 1.5)
          // 跳转到列表页
          setTimeout(() => {
            this.$router.push('./index')
          }, 1500)
        })
        .catch(() => {
          this.isBtnLoading = false
        })
        .finally(result => {
          this.isLoading = false
        })
    }

  }
}
</script>
<style lang="less" scoped>
.ant-form-item {
  .ant-form-item {
    margin-bottom: 0;
  }
}
</style>
