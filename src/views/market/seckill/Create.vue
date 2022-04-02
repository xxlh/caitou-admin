<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        
        <a-form-item label="秒杀范围" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-form-item>
            <SelectGoodsSku
              :defaultList="containGoodsList"
              v-decorator="['apply_range_config.applyGoodsIds', { initialValue: [], rules: [{ required: true, message: '请选择指定的商品' }] }]"
            />
          </a-form-item>
        </a-form-item>
        
        <!-- <a-form-item
          label="秒杀价格"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input-number
            :min="0.01"
            :precision="2"
            v-decorator="['seckil_price', { rules: [{ required: true, message: '请输入秒杀价格' }] }]"
          />
          <span class="ml-5">元</span>
        </a-form-item> -->
     
        <a-form-item label="到期类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
        
          <a-form-item  class="expire_type-20">
            <a-range-picker 
             :showTime="{defaultValue:[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}"
              format="YYYY-MM-DD HH:mm:ss"
              v-decorator="['betweenTime', { initialValue: defaultDate, rules: [{ required: true, message: '请选择有效期范围' }] }]"
            />
          </a-form-item>
        </a-form-item>
        
        <a-form-item label="显示状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', { initialValue: 1, rules: [{ required: true }] }]">
            <a-radio :value="1">显示</a-radio>
            <a-radio :value="0">隐藏</a-radio>
          </a-radio-group>
          <p class="form-item-help">
            <small>如果设为隐藏将不会展示在用户端页面</small>
          </p>
        </a-form-item>
        <a-form-item label="秒杀描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea :autoSize="{ minRows: 4 }" v-decorator="['describe']" />
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="数字越小越靠前">
          <a-input-number
            :min="0"
            v-decorator="['sort', {initialValue: 100, rules:[{required: true, message: '请输入排序值'}]}]"
          />
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
import * as Api from '@/api/market/seckill'
import { InputNumberGroup, SelectGoodsSku } from '@/components'
import { ApplyRangeEnum, SeckillTypeEnum, ExpireTypeEnum } from '@/common/enum/seckill'

export default {
  components: {
    SelectGoodsSku,
    InputNumberGroup
  },
  data () {
    return {
      // 枚举类
      ApplyRangeEnum,
      SeckillTypeEnum,
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
      // 适用范围：指定的商品
      containGoodsList: []
    }
  },
  created () {
    this.$nextTick(() => {
      this.$forceUpdate()
    })
  },
  methods: {
     moment,
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
      Api.add({ form: values })
        .then(result => {
          // 显示提示信息
          this.$message.success(result.message, 1.5)
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
