import _ from 'lodash'
import CategoryModel from '../Category'
import * as GoodsApi from '@/api/goods'
import * as CategoryApi from '@/api/category'
import * as GradeApi from '@/api/user/grade'
import * as ServiceApi from '@/api/goods/service'
import * as DeliveryApi from '@/api/setting/delivery'
import store from '@/store'

/**
 * 商品 model类
 * GoodsModel
 */
export default {

  // 当前商品ID
  goodsId: null,

  // 表单数据
  formData: {
    // 当前商品记录
    goods: {},
    goodsCategories: [],
    // 规格数据
    specs: [],
    skus: [],
    // 分类列表
    categoryList: [],
    // 运费模板
    deliveryList: [],
    // 服务与承诺
    serviceList: [],
    defaultServiceIds: [],
    // 会员等级列表
    userGradeList: [],
    defaultUserGradeValue: {}
  },

  // 获取form所需的数据
  getFormData (goodsId = null) {
    // 记录商品ID (编辑时)
    this.goodsId = goodsId
    return new Promise((resolve, reject) => {
      Promise.all([
        // 获取商品详情信息(编辑时)
        this.getGoodsDetail(goodsId),
        // 获取分类列表
        this.getCategoryList(),
        // 获取运费模板列表
        // this.getDeliveryList(),  // API not supported
        // 获取服务与承诺
        // this.getServiceList(),  // API not supported
        // 获取会员等级列表
        // this.getUserGradeList()  // API not supported
      ]).then(() => {
        // 设置默认数据
        this.setDefaultData()
        resolve({ formData: this.formData })
      })
    })
  },

  // 获取商品详情
  getGoodsDetail (goodsId = null) {
    if (!goodsId) return false
    return new Promise((resolve, reject) => {
      GoodsApi.detail(goodsId)
        .then(result => {
          this.formData.goods = result.product
          this.formData.goodsCategories = result.product.categories
          this.formData.specs = result.specs
          this.formData.skus = result.skus
          resolve()
        })
    })
  },

  // 获取表单默认值(用于form.setFieldsValue的数据)
  getFieldsValue () {
    // 商品详情信息
    const goodsInfo = this.formData.goods
    // 商品基本数据
    const goodsFormData = _.pick(goodsInfo, [
      'title', 'type', 'delivery_id', 'delivery_hours_taking', 'delivery_days_taking', 'delivery_latest', 'on_sale',
      'description', 'highlight', 'serviceIds', 'sold_inital', 'is_points_gift',
      'is_points_discount', 'is_enable_grade', 'is_alone_grade'
    ])
    // 格式化categoryIds
    goodsFormData.categorys = this.formatCategoryIds(this.formData.goodsCategories)
    // 判断单规格还是多规格
    const currentStoreSkus = this.formData.goods.type == 'intra-city' ? this.formData.skus.filter(sku => sku.store_id == store.getters.storeId || !store.getters.storeId) : this.formData.skus
    goodsFormData.spec_type = currentStoreSkus.length > 1 ? 20 : 10
    // 单规格数据
    const skuOne = _.pick(currentStoreSkus[0], ['price', 'retail_price', 'yh_price', 'cost_price', 'stock', 'weight', 'no'])
    // 配送时限
    if (goodsFormData.delivery_hours_taking) goodsFormData.delivery_taking = 'hours'
    if (goodsFormData.delivery_days_taking) goodsFormData.delivery_taking = 'days'
    return {
      ...goodsFormData,
      ...skuOne
    }
  },

  /**
   * 格式化categoryIds (用于表单元素选中)
   * @param {*} categoryIds
   */
  formatCategoryIds (categories) {
    return categories.map(c => { return { value: c.id } })
  },

  // 获取分类列表
  getCategoryList () {
    return new Promise((resolve, reject) => {
      CategoryModel.getCategoryTreeSelect()
        .then(list => {
          this.formData.categoryList = list
          resolve()
        })
    })
  },

  // 获取运费模板列表
  getDeliveryList () {
    return new Promise((resolve, reject) => {
      DeliveryApi.all()
        .then(result => {
          this.formData.deliveryList = result.data.list
          resolve()
        })
    })
  },

  // 获取服务与承诺
  getServiceList () {
    return new Promise((resolve, reject) => {
      ServiceApi.all()
        .then(result => {
          this.formData.serviceList = result.data.list
          resolve()
        })
    })
  },

  // 获取会员等级列表
  getUserGradeList () {
    return new Promise((resolve, reject) => {
      GradeApi.all({ status: 1 })
        .then(result => {
          this.formData.userGradeList = result.data.list
          resolve()
        })
    })
  },

  // 设置默认的数据(无法用于form.setFieldsValue的数据)
  setDefaultData () {
    // 默认的商品服务与承诺
    this.setDefaultServiceIds()
    // 默认的等级折扣
    this.setDefaultUserGradeValue()
  },

  // 默认的商品服务与承诺
  setDefaultServiceIds () {
    // 服务与承诺列表
    const serviceList = this.formData.serviceList
    if (!this.goodsId) {
      // 默认选中的id集
      const defaultServiceItems = serviceList.filter(item => item.is_default)
      this.formData.defaultServiceIds = defaultServiceItems.map(item => item.service_id)
    }
  },

  // 默认的等级折扣
  setDefaultUserGradeValue () {
    // 会员等级列表
    const userGradeList = this.formData.userGradeList
    // 单独设置折扣的配置 (已保存的)
    const aloneGradeEquity = (this.goodsId && this.formData.goods.alone_grade_equity)
      ? this.formData.goods.alone_grade_equity : {}
    // 生成的默认数据
    const defaultData = {}
    userGradeList.forEach(item => {
      defaultData[item.grade_id] = aloneGradeEquity[item.grade_id] || item.equity.discount
    })
    this.formData.defaultUserGradeValue = { ...defaultData }
  }

}
