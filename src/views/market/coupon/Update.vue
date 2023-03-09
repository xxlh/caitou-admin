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
          v-show="form.getFieldValue('type') == CouponTypeEnum.FULL_DISCOUNT.value"
          label="减免金额"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input-number
            :min="0.01"
            :precision="2"
            v-decorator="['save_amount', { rules: [{ required: form.getFieldValue('type') == CouponTypeEnum.FULL_DISCOUNT.value, message: '请输入减免金额' }] }]"
          />
          <span class="ml-5">元</span>
        </a-form-item>
        <a-form-item
          v-show="form.getFieldValue('type') == CouponTypeEnum.DISCOUNT.value"
          label="折扣率"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input-number
            :min="0"
            :max="1"
            :precision="2"
            :step="0.05"
            v-decorator="['off_percent', { initialValue: 0, rules: [{ required: form.getFieldValue('type') == CouponTypeEnum.DISCOUNT.value, message: '请输入折扣率' }] }]"
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
              v-decorator="['betweenTime', { initialValue: defaultDate, rules: [{ required: true, message: '请选择有效期范围' }] }]"
              :show-time="{
                hideDisabledOptions: true,
                defaultValue: defaultTime,
              }"
              valueFormat="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-item>
        </a-form-item>
        <a-form-item label="限时领取" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-range-picker v-decorator="['gainBetween', { initialValue: ['',''] }]" :show-time="{defaultValue: defaultTime}" valueFormat="YYYY-MM-DD HH:mm:ss" />
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
            <a-select-option value="after_first_referred">推荐首个新用户</a-select-option>
            <a-select-option value="after_referred">推荐每个新用户</a-select-option>
            <a-select-option value="after_referred_first_order">推荐注册完成下单</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="领取条件" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            mode="multiple"
            placeholder="请选择可领取用户的标签"
            allowClear
            :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
            :options="tagList"
            :filter-option="false"
            @search="searchTags"
            @blur="blurTags"
            v-decorator="['condition.user_tag_ids']"
          ></a-select>
          <InputNumberGroup
            addonBefore="每用户最多领取"
            addonAfter="张"
            :inputProps="{ min: -1, precision: 0 }"
            v-decorator="['max_gain_per_user', { initialValue: 3}]"
          />
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
        <a-form-item label="券适用范围" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['apply_range', { initialValue: 10, rules: [{ required: true }] }]"
          >
            <a-radio :value="10">全场通用</a-radio>
            <a-radio :value="20">指定商品</a-radio>
            <a-radio :value="30">排除商品</a-radio>
          </a-radio-group>
          <a-form-item v-show="form.getFieldValue('apply_range') == 20">
            <a-tree-select
              placeholder="请选择指定的商品分类"
              :dropdownStyle="{ maxHeight: '500px', overflow: 'auto' }"
              :treeData="categoryList"
              treeCheckable
              treeCheckStrictly
              allowClear
              v-decorator="['categorys', { rules: [{required: false, message: '请至少选择1个商品分类'}]}]"
            ></a-tree-select>
            <SelectGoods
              :defaultList="containGoodsList"
              v-decorator="['include_product_ids', { rules: [{ required: false, message: '请选择指定的商品' }] }]"
            />
          </a-form-item>
          <a-form-item v-show="form.getFieldValue('apply_range') == 30">
            <a-tree-select
              placeholder="请选择排除的商品分类"
              :dropdownStyle="{ maxHeight: '500px', overflow: 'auto' }"
              :treeData="categoryList"
              treeCheckable
              treeCheckStrictly
              allowClear
              v-decorator="['exclude_categorys', { rules: [{required: false, message: '请至少选择1个商品分类'}]}]"
            ></a-tree-select>
            <SelectGoods
              :defaultList="excludeGoodsList"
              v-decorator="['exclude_product_ids', { rules: [{ required: false, message: '请选择排除的商品' }] }]"
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
        <!-- <a-form-item label="显示状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', { initialValue: 1, rules: [{ required: true }] }]">
            <a-radio :value="1">显示</a-radio>
            <a-radio :value="0">隐藏</a-radio>
          </a-radio-group>
          <p class="form-item-help">
            <small>如果设为隐藏将不会展示在用户端页面</small>
          </p>
        </a-form-item> -->
        <a-form-item label="优惠券描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea :autoSize="{ minRows: 4 }" v-decorator="['description']" />
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
import { pick, get } from 'lodash'
import * as Api from '@/api/market/coupon'
import * as GoodsApi from '@/api/goods'
import * as TagApi from '@/api/user/tag'
import { isEmpty } from '@/utils/util'
import { InputNumberGroup, SelectGoods } from '@/components'
import { ApplyRangeEnum, CouponTypeEnum, ExpireTypeEnum } from '@/common/enum/coupon'
import CategoryModel from '@/common/model/Category'

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
      categoryList: [],
      tagList: [],
      tagListFirstPage: [],
      // 默认日期范围
      defaultDate: [moment(), moment()],
      defaultTime: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
      // 默认选项
      gainMethod: 'manual',
      // 优惠券ID
      couponId: null,
      // 当前记录
      record: {},
      // 适用范围：指定的商品
      containGoodsList: [],
      excludeGoodsList: [],
      expire_as_hour: false,
    }
  },
  async created () {
    // 记录优惠券ID
    this.couponId = this.$route.query.couponId
    // 获取当前记录
    await this.getDetail()
    // 获取适用范围：指定的商品
    await this.getContainGoodsList()
    await this.getExcludeGoodsList()
    // 获取分类
    this.categoryList = await CategoryModel.getCategoryTreeSelect()
    // 获取标签
    const tags = await TagApi.list({per_page: 99})
    this.tagList = tags.data.map(t => ({label:t.name, value:t.id}))
    this.tagListFirstPage = [...this.tagList]
  },
  methods: {

    // 获取当前记录
    async getDetail () {
      const { couponId } = this
      this.isLoading = true
      await Api.detail(couponId)
        .then(result => {
          // 当前记录
          this.record = result
          // 设置表单默认值
          this.setFieldsValue()
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    // 获取指定的商品列表
    async getContainGoodsList () {
      const { record } = this
      const goodsIds = record.valid_entities.filter(e => e.entity_type == 'App\\Models\\Product' && !e.is_excluded).map(e => e.entity_id)
      if (goodsIds !== undefined && goodsIds.length) {
        this.isLoading = true
        await GoodsApi.listByIds(goodsIds)
          .then(result => {
            this.containGoodsList = result.data
          })
          .finally(result => {
            this.isLoading = false
          })
      }
    },
    async getExcludeGoodsList () {
      const { record } = this
      const goodsIds = record.valid_entities.filter(e => e.entity_type == 'App\\Models\\Product' && e.is_excluded).map(e => e.entity_id)
      if (goodsIds !== undefined && goodsIds.length) {
        this.isLoading = true
        await GoodsApi.listByIds(goodsIds)
          .then(result => {
            this.excludeGoodsList = result.data
          })
          .finally(result => {
            this.isLoading = false
          })
      }
    },

    // 设置表单默认值
    setFieldsValue () {
      const { record, form, $nextTick } = this
      // 设置表单内容
      !isEmpty(form.getFieldsValue()) && $nextTick(() => {
        // 表单数据
        const data = pick(record, [
          'title', 'type', 'save_amount', 'off_percent', 'amount_limit', 'auto_gain_situation',
          'expire_type', 'expires_from_gain', 'apply_range', 'max_gain', 'max_gain_per_user', 'limit_once_every', 'description'
        ])
        // 到期类型
        this.expire_as_hour = data.expires_from_gain.indexOf('hour') != -1 ? true : false
        if (data.expires_from_gain && this.expire_as_hour) data.expire_hour = parseInt(record.expires_from_gain)
        else data.expire_day = parseInt(record.expires_from_gain) || 0
        data.start_day = parseInt(record.starts_from_gain) || 0
        data.betweenTime = this.getBetweenTime(record.starts_at, record.expires_at)
        // 限时领取
        data.gainBetween = this.getBetweenTime(record.gain_from, record.gain_to)
        // 领取方式
        this.gainMethod = record.auto_gain_situation ? 'situation' : 'manual'
        // 条件领取
        data.condition = record.conditions.find(c => 'first') || {}
        data.condition.user_tag_ids = record.conditions.filter(c => c.condition_type == 'App\\Models\\Tag').map(c => c.condition_id)
        // 指定分类
        data.apply_range = record.valid_entities.filter(e => e.is_excluded).length ? 30 : (record.valid_entities.length ? 20 : 10)
        data.categorys = record.valid_entities.filter(e => e.entity_type == 'Rinvex\\Categories\\Models\\Category' && !e.is_excluded).map(e => ({ value: e.entity_id }))
        data.exclude_categorys = record.valid_entities.filter(e => e.entity_type == 'Rinvex\\Categories\\Models\\Category' && e.is_excluded).map(e => ({ value: e.entity_id }))
        // data.include_product_ids = record.valid_entities.filter(e => e.entity_type == 'App\\Models\\Product' && !e.is_excluded).map(e => e.entity_id)  // 通过 getContainGoodsList 方法替代
        // form.getFieldDecorator('categorys')  // v-show替代v-if
        // form.getFieldDecorator('exclude_categorys')  // v-show替代v-if
        // form.getFieldDecorator('include_product_ids')
        form.setFieldsValue(data)
      })
    },

    // 格式化时间范围
    getBetweenTime (start, end) {
      return [start ? moment(new Date(start)) : null, end ? moment(new Date(end)) : null]
    },

    // 标签搜索
    async searchTags (value) {
      const res = await TagApi.list({name: value, per_page: 99})
      this.tagList = [...res.data.map(t => ({label:t.name, value:t.id}))]
    },
    blurTags() {
      this.tagList = [...this.tagListFirstPage]
    },

    // 确认按钮
    handleSubmit (e) {
      e.preventDefault()
      // 表单验证
      const { form: { validateFields }, onFormSubmit } = this
      validateFields((errors, values) => {
        !errors && onFormSubmit(values)
      })
    },

    /**
    * 提交到后端api
    */
    onFormSubmit (values) {
      this.isLoading = true
      this.isBtnLoading = true
      if (!values.off_percent) delete values.off_percent
      // 到期类型
      if (values.expire_type == ExpireTypeEnum.RECEIVE.value) {
        const expire = this.expire_as_hour ? values.expire_hour : values.expire_day
        values.expires_from_gain = `+${expire} ${this.expire_as_hour?'hours':'days'}`
        values.starts_from_gain = values.start_day ? `+${values.start_day} days` : ''
      } else {
        values.starts_at = values.betweenTime[0]
        values.expires_at = values.betweenTime[1]
      }
      values.gain_from = values.gainBetween[0]
      values.gain_to = values.gainBetween[1]
      // 领取方式
      if (this.gainMethod != 'situation') values.auto_gain_situation = null
      // 指定分类
      if (values.apply_range == 30) values.exclude_category_ids = values.exclude_categorys ? values.exclude_categorys.map(item => item.value) : ''
      else if (values.apply_range == 20) {
        values.include_category_ids = values.categorys ? values.categorys.map(item => item.value) : ''
        values.exclude_product_ids = ''
        values.exclude_category_ids = ''
      } else {
        values.include_product_ids = ''
        values.include_category_ids = ''
      }
      const callbackEditRequest = res => {
        Api.edit(this.couponId, values)
          .then(result => {
            // 显示提示信息
            this.$message.success('更新成功', 1.5)
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
      };
      // 限定领取条件
      if (values.condition?.user_tag_ids?.length) {
        Api.set_condition(this.couponId, values.condition).then(callbackEditRequest)
        .catch(e => {
          this.$message.error(e.msg, 3)
          this.isBtnLoading = false
          this.isLoading = false
        })
      } else {
        Api.remove_condition(this.couponId, values).then(callbackEditRequest)
        .catch(e => {
          this.$message.error(e.msg, 3)
          this.isBtnLoading = false
          this.isLoading = false
        })
      }
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
