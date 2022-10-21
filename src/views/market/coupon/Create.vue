<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="优惠券名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入优惠券名称"
            v-decorator="['title', { rules: [{ required: true, min: 2, message: '请输入至少2个字符' }] }]"
          />
        </a-form-item>
        <a-form-item label="优惠券类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['type', { initialValue: 'discount', rules: [{ required: true }] }]"
          >
            <a-radio value="discount">满减券</a-radio>
            <a-radio value="percent">折扣券</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="form.getFieldValue('type') == CouponTypeEnum.FULL_DISCOUNT.value"
          label="减免金额"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input-number
            :min="0.01"
            :precision="2"
            v-decorator="['save_amount', { rules: [{ required: true, message: '请输入减免金额' }] }]"
          />
          <span class="ml-5">元</span>
        </a-form-item>
        <a-form-item
          v-if="form.getFieldValue('type') == CouponTypeEnum.DISCOUNT.value"
          label="折扣率"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input-number
            :min="0"
            :max="1"
            :precision="2"
            :step="0.05"
            v-decorator="['off_percent', { initialValue: 0, rules: [{ required: true, message: '请输入折扣率' }] }]"
          />
          <p class="form-item-help">
            <small>折扣率范围 0-0.99，0.2代表打8折，0代表不折扣</small>
          </p>
        </a-form-item>
        <a-form-item label="最低消费金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0.01"
            :precision="2"
            v-decorator="['amount_limit', { rules: [{ required: true, message: '请输入最低消费金额' }] }]"
          />
          <span class="ml-5">元</span>
        </a-form-item>
        <a-form-item label="到期类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['expire_type', { initialValue: ExpireTypeEnum.RECEIVE.value, rules: [{ required: true }] }]"
          >
            <a-radio :value="ExpireTypeEnum.RECEIVE.value">领取后生效</a-radio>
            <a-radio :value="ExpireTypeEnum.FIXED_TIME.value">固定生效时段</a-radio>
          </a-radio-group>
          <a-form-item v-show="form.getFieldValue('expire_type') == ExpireTypeEnum.RECEIVE.value" class="expire_type-10">
            <InputNumberGroup
              addonBefore="生效于"
              addonAfter="天后"
              :inputProps="{ min: 0, precision: 0 }"
              v-decorator="['start_day', { initialValue: 0, rules: [{ required: true, message: '请输入自领取起几天后开始生效' }] }]"
            />
            <InputNumberGroup v-show="!expire_as_hour"
              addonBefore="有效期"
              addonAfter="天"
              :inputProps="{ min: 1, precision: 0 }"
              v-decorator="['expire_day', { initialValue: 7, rules: [{ required: true, message: '请输入自领取起有效天数' }] }]"
            />
            <InputNumberGroup v-show="expire_as_hour"
              addonBefore="有效期"
              addonAfter="小时"
              :inputProps="{ min: 1, precision: 0 }"
              v-decorator="['expire_hour', { initialValue: 3, rules: [{ required: true, message: '请输入自领取起有效小时数' }] }]"
            />
            <a @click="expire_as_hour=!expire_as_hour">切换</a>
          </a-form-item>
          <a-form-item v-show="form.getFieldValue('expire_type') == ExpireTypeEnum.FIXED_TIME.value" class="expire_type-20">
            <a-range-picker
              v-decorator="['betweenTime', { initialValue: defaultTime, rules: [{ required: true, message: '请选择有效期范围' }] }]"
              show-time
            />
          </a-form-item>
        </a-form-item>
        <a-form-item label="限时领取" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-range-picker v-decorator="['gainBetween', { initialValue: ['',''] }]" :show-time="{defaultValue: defaultTime}" />
        </a-form-item>
        <a-form-item label="领取方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-model="gainMethod">
            <a-radio value="manual">用户手动领取</a-radio>
            <a-radio value="situation">场景自动获得</a-radio>
          </a-radio-group>
          <a-select v-show="gainMethod == 'situation'"
            placeholder="请选择自动触发领取的场景"
            v-decorator="['auto_gain_situation', { initialValue: 'after_launching' }]"
            style="width: 150px"
          >
            <a-select-option value="after_launching">App启动时</a-select-option>
            <a-select-option value="after_new_order">线上下单后</a-select-option>
            <a-select-option value="after_new_ontheway">顺路单下单后</a-select-option>
            <a-select-option value="after_registered">新用户</a-select-option>
            <a-select-option value="after_registered_2_day">新用户次日</a-select-option>
            <a-select-option value="after_registered_3_day">新用户第3天</a-select-option>
            <a-select-option value="after_registered_4_day">新用户第4天</a-select-option>
            <a-select-option value="after_registered_5_day">新用户第5天</a-select-option>
            <a-select-option value="after_registered_6_day">新用户第6天</a-select-option>
            <a-select-option value="after_registered_7_day">新用户第7天</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="券适用范围" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['apply_range', { initialValue: 10, rules: [{ required: true }] }]"
          >
            <a-radio :value="10">全场通用</a-radio>
            <a-radio :value="20">指定商品</a-radio>
          </a-radio-group>
          <a-form-item v-if="form.getFieldValue('apply_range') == 20">
            <SelectGoods
              :defaultList="containGoodsList"
              v-decorator="['apply_range_config.applyGoodsIds', { initialValue: [], rules: [{ required: true, message: '请选择指定的商品' }] }]"
            />
          </a-form-item>
        </a-form-item>
        <a-form-item label="发放总数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="-1"
            :precision="0"
            v-decorator="['max_gain', { initialValue: -1, rules: [{ required: true, message: '请输入发放总数量' }] }]"
          />
          <span class="ml-5">张</span>
          <p class="form-item-help">
            <small>发放的优惠券总数量，-1为不限制</small>
          </p>
        </a-form-item>
        <a-form-item label="优惠券描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea :autoSize="{ minRows: 4 }" v-decorator="['description']" />
        </a-form-item>
        <a-form-item class="mt-20" :wrapper-col="{ span: wrapperCol.span, offset: labelCol.span }">
          <a-button type="primary" html-type="submit" :loading="isBtnLoading">提交</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import moment from 'moment'
import * as Api from '@/api/market/coupon'
import { InputNumberGroup, SelectGoods } from '@/components'
import { ApplyRangeEnum, CouponTypeEnum, ExpireTypeEnum } from '@/common/enum/coupon'

export default {
  components: {
    SelectGoods,
    InputNumberGroup
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
      // 默认日期范围
      defaultDate: [moment(), moment()],
      defaultTime: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
      // 默认选项
      gainMethod: 'manual',
      // 适用范围：指定的商品
      containGoodsList: [],
      expire_as_hour: false,
    }
  },
  created () {
    this.$nextTick(() => {
      this.$forceUpdate()
    })
  },
  methods: {

    // 确认按钮
    handleSubmit (e) {
      e.preventDefault()
      // 表单验证
      const { form: { validateFields }, onFormSubmit } = this
      validateFields((errors, values) => {
        !errors && onFormSubmit(values)
      })
    },

    // 提交到后端api
    onFormSubmit (values) {
      this.isLoading = true
      this.isBtnLoading = true
      // 到期类型
      if (values.expire_type == ExpireTypeEnum.RECEIVE.value) {
        const expire = this.expire_as_hour ? values.expire_hour : values.expire_day
        values.expires_from_gain = `+${expire} ${this.expire_as_hour?'hours':'days'}`
        values.starts_from_gain = values.start_day ? `+${values.start_day} days` : null
      } else {
        values.starts_at = values.betweenTime[0]
        values.expires_at = values.betweenTime[1]
      }
      values.gain_from = values.gainBetween[0]
      values.gain_to = values.gainBetween[1]
      // 领取方式
      if (this.gainMethod != 'situation') values.auto_gain_situation = null
      Api.add(values)
        .then(result => {
          // 显示提示信息
          this.$message.success('已添加', 1.5)
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
