<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit" :selfUpdate="true">
        <a-tabs :activeKey="tabKey" :tabBarStyle="{marginBottom: '30px'}" @change="handleTabs">
          <a-tab-pane :key="0" tab="基本信息"></a-tab-pane>
          <a-tab-pane :key="1" tab="规格/库存"></a-tab-pane>
          <a-tab-pane :key="2" tab="商品详情"></a-tab-pane>
          <a-tab-pane :key="3" tab="更多设置"></a-tab-pane>
        </a-tabs>
        <div class="tabs-content">
          <!-- 基本信息 -->
          <div class="tab-pane" v-show="tabKey == 0">
            <a-form-item label="商品名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入商品名称"
                v-decorator="['title', {rules: [{required: true, min: 2, message: '请输入至少2个字符'}]}]"
              />
            </a-form-item>
            <a-form-item label="商品类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group v-decorator="['type', {initialValue: $store.getters.storeId ? 'intra-city' : 'physical', rules: [{required: true}]}]" @change="onProductTypeChange">
                <a-radio value="intra-city">同城商品</a-radio>
                <a-radio value="physical">跨地商品</a-radio>
                <a-radio value="travel">旅游线路</a-radio>
                <a-radio value="verification">核销卡券</a-radio>
                <a-radio value="virtual">线下交易</a-radio>
                <a-radio value="course">课程</a-radio>
              </a-radio-group>
            </a-form-item>
            <template v-if="form.getFieldValue('type') === 'course'">
              <a-form-item label="课程媒体类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-radio-group v-decorator="['course_media_type', {initialValue: 'audio', rules: [{required: true, message: '请选择课程媒体类型'}]}]" @change="onCourseMediaTypeChange">
                  <a-radio value="audio">音频</a-radio>
                  <a-radio value="video">视频</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="课程媒体" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <SelectAudio
                  v-if="courseMediaType === 'audio'"
                  collection="course_media"
                  :multiple="false"
                  v-decorator="['course_media_id', {rules: [{required: true, message: '请上传课程音频'}]}]"
                />
                <SelectVideo
                  v-else
                  collection="course_media"
                  :multiple="false"
                  v-decorator="['course_media_id', {rules: [{required: true, message: '请上传课程视频'}]}]"
                />
              </a-form-item>
              <a-form-item label="免费课程" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-checkbox :checked="isCourseFree" @change="onCourseFreeChange">免费</a-checkbox>
                <span class="ml-10 form-item-help">勾选后价格自动设为0</span>
              </a-form-item>
              <a-form-item v-if="!isCourseFree" label="课程价格" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="商品的实际购买金额">
                <a-input-number
                  :min="0"
                  :precision="2"
                  v-decorator="['price', { initialValue: 1, rules: [{ required: true, message: '请输入课程价格' }] }]"
                />
                <span class="ml-10">元</span>
              </a-form-item>
              <a-form-item v-if="!isCourseFree" label="试听时长" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="留空表示不允许试听">
                <a-input-number :min="1" :precision="0" v-decorator="['course_trial_minutes']" />
                <span class="ml-10">分钟</span>
              </a-form-item>
            </template>
            <a-form-item label="商品分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-tree-select
                placeholder="请选择商品分类"
                :dropdownStyle="{ maxHeight: '500px', overflow: 'auto' }"
                :treeData="formData.categoryList"
                treeCheckable
                treeCheckStrictly
                allowClear
                v-decorator="['categorys', {rules: [{required: true, message: '请至少选择1个商品分类'}]}]"
              ></a-tree-select>
              <div class="form-item-help">
                <router-link target="_blank" :to="{ path: '/goods/category/index' }">去新增</router-link>
                <a href="javascript:;" @click="onReloadCategoryList">刷新</a>
              </div>
            </a-form-item>
            <a-form-item
              label="商品图片"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              extra="建议尺寸：750*750像素, 最多上传10张, 可拖拽图片调整顺序, 第1张将作为商品首图"
            >
              <SelectImage
                collection="product_images"
                multiple
                :maxNum="10"
                v-decorator="['image_ids', {rules: [{required: true, message: '请至少上传1张商品图片'}]}]"
              />
            </a-form-item>
            <!-- <a-form-item label="商品编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入商品编码" v-decorator="['goods_no']" />
            </a-form-item> -->
            <a-form-item v-if="form.getFieldValue('type') !== 'course'" label="运费模板" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                style="width: 300px"
                v-decorator="['delivery_id', {rules: [{required: false, message: '请选择运费模板'}]}]"
                placeholder="请选择运费模板"
              >
                <a-select-option
                  v-for="(item, index) in formData.deliveryList"
                  :key="index"
                  :value="item.delivery_id"
                >{{ item.name }}</a-select-option>
              </a-select>
              <div class="form-item-help">
                <router-link
                  target="_blank"
                  :to="{ path: '/setting/delivery/template/create' }"
                >新增模板</router-link>
                <a href="javascript:;" @click="onReloadDeliveryList">刷新</a>
              </div>
            </a-form-item>
            <a-form-item label="商品状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group
                v-decorator="['on_sale', {initialValue: true, rules: [{ required: true }]}]"
              >
                <a-radio :value="true">上架</a-radio>
                <a-radio :value="false">下架</a-radio>
              </a-radio-group>
            </a-form-item>
          </div>

          <!-- 规格/库存 -->
          <div class="tab-pane" v-show="tabKey == 1">
            <a-form-item v-if="form.getFieldValue('type') !== 'course'" label="规格类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group
                v-decorator="['spec_type', { initialValue: 10, rules: [{ required: true }] }]"
                @change="onForceUpdate()"
              >
                <a-radio :value="10">单规格</a-radio>
                <a-tooltip title="保存后可编辑多规格">
                  <a-radio :value="20" disabled>多规格</a-radio>
                </a-tooltip>
              </a-radio-group>
            </a-form-item>
            <!-- 多规格的表单内容 -->
            <div v-show="form.getFieldValue('spec_type') == 20 && form.getFieldValue('type') !== 'course'">
              <MultiSpec ref="MultiSpec" />
            </div>
            <!-- 单规格的表单内容 -->
            <div v-show="form.getFieldValue('spec_type') == 10">
              <a-form-item
                v-if="form.getFieldValue('type') !== 'course'"
                label="商品价格"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                extra="商品的实际购买金额"
              >
                <a-input-number
                  :min="0.01"
                  :precision="2"
                  v-decorator="['price', { initialValue: 1, rules: [{ required: true, message: '请输入商品价格' }] }]"
                />
                <span class="ml-10">元</span>
              </a-form-item>
              <a-form-item
                label="零售价"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                extra="零售价仅用于商品页展示"
              >
                <a-input-number :min="0" :precision="2" v-decorator="['retail_price']" />
                <span class="ml-10">元</span>
              </a-form-item>
              <a-form-item
                label="永辉价"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                extra="永辉价仅用于商品页展示"
              >
                <a-input-number :min="0" :precision="2" v-decorator="['yh_price']" />
                <span class="ml-10">元</span>
              </a-form-item>
              <a-form-item
                label="成本价"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                extra="成本价仅用于计算盈亏"
              >
                <a-input-number :min="0" :precision="2" v-decorator="['cost_price']" />
                <span class="ml-10">元</span>
              </a-form-item>
              <a-form-item
                label="当前库存数量"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                extra="商品的实际库存数量，为0时用户无法下单"
                v-if="form.getFieldValue('type') !== 'course'"
              >
                <a-input-number
                  :min="0"
                  :precision="0"
                  v-decorator="['stock', { initialValue: 100, rules:[{ required: true, message: '请输入库存数量' }] }]"
                />
                <span class="ml-10">件</span>
              </a-form-item>
              <a-form-item
                label="商品重量"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                extra="商品的实际重量，用于计算运费"
                v-if="form.getFieldValue('type') !== 'course'"
              >
                <a-input-number
                  :min="0"
                  v-decorator="['weight', { initialValue: 0, rules:[{ required: false, message: '请输入库存数量' }] }]"
                />
                <span class="ml-10">克 (g)</span>
              </a-form-item>
            </div>
            <a-form-item v-if="form.getFieldValue('type') !== 'course'" label="库存计算方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group
                v-decorator="['deduct_stock_type', {initialValue: 10, rules: [{ required: true }]}]"
              >
                <a-radio :value="10">下单减库存</a-radio>
                <a-radio :value="20">付款减库存</a-radio>
              </a-radio-group>
            </a-form-item>
          </div>

          <!-- 商品详情 -->
          <div class="tab-pane" v-show="tabKey == 2">
            <a-form-item label="商品详情" :labelCol="labelCol" :wrapperCol="{span: 16}">
              <Ueditor collection="desc_images"
                v-decorator="['description', { rules: [{ required: true, message: '商品详情不能为空' }] }]"
              />
            </a-form-item>
          </div>

          <!-- 更多设置 -->
          <div class="tab-pane" v-show="tabKey == 3">
            <a-form-item
              label="主图视频"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              extra="建议视频宽高比19:9，建议时长8-45秒"
            >
              <SelectVideo collection="product_video" :multiple="false" v-decorator="['video_id']" />
            </a-form-item>
            <a-form-item
              label="视频封面"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              extra="建议尺寸：750像素*750像素"
            >
              <SelectImage collection="video_cover" :multiple="false" v-decorator="['video_cover_id']" />
            </a-form-item>
            <a-form-item
              label="商品卖点"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              extra="一句话简述，例如：此款商品美观大方 性价比较高 不容错过"
            >
              <a-input placeholder="请输入商品卖点" v-decorator="['highlight']" />
            </a-form-item>
            <a-form-item label="服务与承诺" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                v-if="formData.serviceList"
                mode="multiple"
                v-decorator="['serviceIds', { initialValue: formData.defaultServiceIds }]"
                placeholder="请选择服务与承诺"
              >
                <a-select-option
                  v-for="(item, index) in formData.serviceList"
                  :key="index"
                  :value="item.service_id"
                >{{ item.name }}</a-select-option>
              </a-select>
              <div class="form-item-help">
                <router-link target="_blank" :to="{ path: '/goods/service/index' }">去新增</router-link>
                <a href="javascript:;" @click="onReloadServiceList">刷新</a>
              </div>
            </a-form-item>
            <a-form-item
              label="初始销量"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              extra="用户端展示的销量 = 初始销量 + 实际销量"
            >
              <a-input-number v-decorator="['sold_inital', {initialValue: 0}]" />
            </a-form-item>

            <a-divider orientation="left">积分设置</a-divider>
            <a-form-item
              label="积分赠送"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              extra="开启后用户购买此商品将获得积分"
            >
              <a-radio-group
                v-decorator="['is_points_gift', {initialValue: 1, rules: [{ required: true }]}]"
              >
                <a-radio :value="1">开启</a-radio>
                <a-radio :value="0">关闭</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              label="积分抵扣"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              extra="开启后用户购买此商品可以使用积分进行抵扣"
            >
              <a-radio-group
                v-decorator="['is_points_discount', {initialValue: 1, rules: [{ required: true }]}]"
              >
                <a-radio :value="1">开启</a-radio>
                <a-radio :value="0">关闭</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-divider orientation="left">会员折扣设置</a-divider>
            <a-form-item
              label="会员折扣"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              extra="开启后会员折扣，会员购买此商品可以享受会员等级折扣价"
            >
              <a-radio-group
                v-decorator="['is_enable_grade', {initialValue: 1, rules: [{ required: true }]}]"
                @change="onForceUpdate(true)"
              >
                <a-radio :value="1">开启</a-radio>
                <a-radio :value="0">关闭</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              v-if="form.getFieldValue('is_enable_grade')"
              label="会员折扣设置"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-radio-group
                v-decorator="['is_alone_grade', { initialValue: 0, rules: [{ required: true }] }]"
                @change="onForceUpdate(true)"
              >
                <a-radio :value="0">默认等级折扣</a-radio>
                <a-radio :value="1">单独设置折扣</a-radio>
              </a-radio-group>
              <!-- 会员等级列表 -->
              <div v-if="form.getFieldValue('is_alone_grade')">
                <a-form-item v-for="item in formData.userGradeList" :key="item.grade_id">
                  <InputNumberGroup
                    :addonBefore="item.name"
                    addonAfter="折"
                    :inputProps="{ min: 0, max: 9.9 }"
                    v-decorator="[`alone_grade_equity[grade_id:${item.grade_id}]`, {
                      initialValue: formData.defaultUserGradeValue[item.grade_id], rules: [{required: true, message: '折扣率不能为空'}]
                    }]"
                  />
                </a-form-item>
              </div>
              <div class="form-item-help">
                <p
                  class="extra"
                  v-if="form.getFieldValue('is_alone_grade')"
                >单独折扣：折扣率范围0.0-9.9，例如: 9.8代表98折，0代表不折扣</p>
                <p class="extra" v-else>默认折扣：默认为用户所属会员等级的折扣率</p>
              </div>
            </a-form-item>
          </div>
        </div>
        <a-form-item class="mt-20" :wrapper-col="{ span: wrapperCol.span, offset: labelCol.span }">
          <a-button type="primary" html-type="submit" :loading="isBtnLoading">提交</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import * as GoodsApi from '@/api/goods'
import { SelectAudio, SelectImage, SelectVideo, Ueditor, InputNumberGroup } from '@/components'
import GoodsModel from '@/common/model/goods/Index'
import MultiSpec from './modules/MultiSpec'
import ChannelEnum from '@/common/enum/file/Channel'

export default {
  components: {
    SelectAudio,
    SelectImage,
    SelectVideo,
    Ueditor,
    InputNumberGroup,
    MultiSpec
  },
  data () {
    return {
      // 默认的标签索引
      tabKey: 0,
      // 标签布局属性
      labelCol: { span: 3 },
      // 输入框布局属性
      wrapperCol: { span: 10 },
      // loading状态
      isLoading: false,
      isBtnLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 表单数据
      formData: GoodsModel.formData,
      channel: ChannelEnum.PRODUCT.value,
      isCourseFree: false,
      // 课程媒体类型（用于控制显示音频/视频选择器）
      courseMediaType: 'audio',
    }
  },
  // 初始化数据
  created () {
    this.isLoading = true
    // 获取form所需的数据
    GoodsModel.getFormData()
      .then(() => {
        this.isLoading = false
      })
  },
  methods: {

    // 手动强制更新页面
    onForceUpdate (bool = false) {
      this.$forceUpdate()
      // bool为true时再执行一次 $forceUpdate, 特殊情况下需执行两次，原因如下：
      // 第一次执行 $forceUpdate时, 新元素绑定v-decorator无法获取到form.getFieldValue
      bool && setTimeout(() => {
        this.$forceUpdate()
      }, 10)
    },

    // 切换tab选项卡
    handleTabs (key) {
      this.tabKey = key
    },

    // 刷新分类列表
    onReloadCategoryList () {
      this.isLoading = true
      GoodsModel.getCategoryList().then(() => {
        this.isLoading = false
      })
    },

    // 刷新服务与承诺列表
    onReloadServiceList () {
      this.isLoading = true
      GoodsModel.getServiceList().then(() => {
        this.isLoading = false
      })
    },

    // 刷新配送模板列表
    onReloadDeliveryList () {
      this.isLoading = true
      GoodsModel.getDeliveryList().then(() => {
        this.isLoading = false
      })
    },
    onProductTypeChange (e) {
      const type = e && e.target ? e.target.value : e
      if (type === 'course') {
        this.form.setFieldsValue({ spec_type: 10, stock: 999999, weight: 0 })
        if (this.isCourseFree) this.form.setFieldsValue({ price: 0 })
      } else {
        this.isCourseFree = false
        this.form.setFieldsValue({ course_trial_minutes: null })
      }
      this.onForceUpdate(true)
    },
    onCourseFreeChange (e) {
      this.isCourseFree = e.target.checked
      if (this.isCourseFree) {
        this.form.setFieldsValue({ price: 0, course_trial_minutes: null })
      }
      this.onForceUpdate(true)
    },
    // 课程媒体类型切换
    onCourseMediaTypeChange (e) {
      this.courseMediaType = e.target.value
      // 切换类型时清空已选择的媒体
      this.form.setFieldsValue({ course_media_id: undefined })
      this.onForceUpdate(true)
    },

    /**
     * 确认按钮
     */
    handleSubmit (e) {
      e.preventDefault()
      // 表单验证
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        // 定位到错误的tab选项卡
        if (errors) {
          this.onTargetTabError(errors)
          return false
        }
        // 验证多规格
        if (values.spec_type === 20) {
          const MultiSpec = this.$refs.MultiSpec
          if (!MultiSpec.verifyForm()) {
            this.tabKey = 1
            return false
          }
          // 记录多规格数据
          values.specData = MultiSpec.getFormSpecData()
          delete values.price
          delete values.stock
        }
        if (values.type === 'course') {
          values.spec_type = 10
          values.stock = values.stock ?? 999999
          values.weight = values.weight ?? 0
          const isFreeCourse = this.isCourseFree || Number(values.price) <= 0
          if (isFreeCourse) {
            values.price = 0
            values.course_trial_minutes = null
          }
        } else {
          delete values.course_media_type
          delete values.course_media_id
          delete values.course_trial_minutes
        }
        // 整理商品分类ID集
        values.category_ids = values.categorys.map(item => item.value)
        delete values.categorys
        // 提交到后端api
        this.onFormSubmit(values)
        return true
      })
    },

    /**
     * 定位到错误的tab选项卡
     */
    onTargetTabError (errors) {
      // 表单字段与tabKey对应关系
      // 只需要必填字段就可
      const tabsFieldsMap = [
        ['title', 'categorys', 'image_ids', 'delivery_id', 'course_media_type', 'course_media_id', 'course_trial_minutes'],
        ['spec_type', 'price'],
        ['content'],
        ['alone_grade_equity', 'first_money', 'second_money', 'third_money']
      ]
      const field = Object.keys(errors).shift()
      for (const key in tabsFieldsMap) {
        if (tabsFieldsMap[key].indexOf(field) > -1) {
          this.tabKey = parseInt(key)
          break
        }
      }
    },

    /**
    * 提交到后端api
    */
    onFormSubmit (values) {
      this.isLoading = true
      this.isBtnLoading = true
      // 只有同城商品才需要 store_id
      if (values.type === 'intra-city') {
        values.store_id = this.$store.getters.storeId
      }
      // Promise.all([
        // Todo
        // GoodsApi.saveSku(this.goodsId, values.specData.skuList),
      // ]).then(() => {
        GoodsApi.add(values)
          .then(result => {
            // 显示提示信息
            this.$message.success('创建成功', 1.5)
            // 跳转到列表页
            setTimeout(() => {
              this.$router.push('./index')
            }, 1500)
          })
          .catch(() => {
            this.isBtnLoading = false
          })
          .finally(() => {
            this.isLoading = false
          })
        // })
    }

  }
}

</script>
<style lang="less" scoped>
@import './style.less';
</style>
