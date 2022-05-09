<template>
  <div>
    <a-form-item label="规格键值" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <div v-if="!multiSpecData.specList.length" class="form-item-help" style="line-height: 36px">
        <small>添加规格键值后设置每个规格的价格！</small>
      </div>
      <a-button v-if="!isSpecLocked" class="spec-group-add-btn" :icon="multiSpecData.specList.length ? 'edit' : 'plus'" @click="isShowSpecEditor=true">
        {{multiSpecData.specList.length ? '编辑规格键值' : '添加规格键值'}}
      </a-button>
      <!-- 编辑规格键值 -->
      <a-drawer
        title="规格键值编辑"
        placement="right"
        :closable="false"
        :visible="isShowSpecEditor"
        :after-visible-change="specVisibleChange"
        :width="640"
      >
        <a-table
          rowKey="id"
          class="spec-list"
          :columns="multiSpecData.specColumns"
          :dataSource="multiSpecData.specList"
          :scroll="{ x: true }"
          :pagination="false"
          bordered
        >
          <!-- 规格键名 -->
          <template slot="key" slot-scope="text, item">
            <a-auto-complete v-model="item.key" :data-source="specKeys" placeholder="输入新键或选择已有" />
          </template>
          <!-- 规格键值 -->
          <template slot="name" slot-scope="text, item">
            <a-input v-model="item.name" size="small" />
          </template>
          <!-- 要求提交字段 -->
          <template slot="request_field_ids" slot-scope="text, item">
            <a-select mode="multiple" v-model="item.request_field_ids" placeholder="Please select" :style="{width:'100%'}">
              <a-select-option v-for="field in multiSpecData.fields" :key="field.id">
                {{ field.name }}
              </a-select-option>
            </a-select>
          </template>
          <!-- 操作 -->
          <template slot="actions" slot-scope="text, record">
            <a-popconfirm v-if="multiSpecData.specList.length" title="确定删除?" @confirm="() => MultiSpecModel.handleDeleteSpec(record.id)">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
        <a-button class="editable-add-btn" block @click="() => MultiSpecModel.handleAddSpec()">新增一条</a-button>
        <div
          :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
          }"
        >
          <a-button :style="{ marginRight: '8px' }" @click="isShowSpecEditor=false">取消</a-button>
          <a-button type="primary" @click="() => handleSaveSpecs()" :loading="isSavingSpec">保存</a-button>
        </div>
      </a-drawer>
    </a-form-item>
    <!-- 规格价格库存设置 -->
    <a-form-item
      v-show="multiSpecData.skuList.length"
      label="规格数据"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <!-- 批量设置 -->
      <div v-if="multiSpecData.skuList.length > 1" class="sku-batch">
        <span class="title">批量设置:</span>
        <a-input-number
          v-model="multiSpecData.skuBatchForm.price"
          placeholder="商品价格"
          :min="0.01"
          :precision="2"
        />
        <a-input-number
          v-model="multiSpecData.skuBatchForm.retail_price"
          placeholder="零售价格"
          :min="0"
          :precision="2"
        />
        <a-input-number
          v-model="multiSpecData.skuBatchForm.yonghui_price"
          placeholder="永辉价格"
          :min="0"
          :precision="2"
        />
        <a-input-number
          v-model="multiSpecData.skuBatchForm.cost_price"
          placeholder="成本价格"
          :min="0"
          :precision="2"
        />
        <a-input-number
          v-model="multiSpecData.skuBatchForm.stock"
          placeholder="库存数量"
          :min="0"
          :precision="0"
        />
        <a-input-number
          v-model="multiSpecData.skuBatchForm.weight"
          placeholder="商品重量"
          :min="0"
          :precision="2"
        />
        <!-- <a-input v-model="multiSpecData.skuBatchForm.no" placeholder="sku编码" /> -->
        <a-button @click="handleSkuBatch">立即设置</a-button>
      </div>
      <!-- sku列表table -->
      <a-table
        class="sku-list"
        :columns="multiSpecData.skuColumns"
        :dataSource="multiSpecData.skuList"
        :scroll="{ x: true }"
        :pagination="false"
        bordered
      >
        <!-- 预览图 -->
        <template slot="image" slot-scope="text, item">
          <SelectImage
            :channel="channel"
            :channel_id="item.id"
            collection="sku_image"
            v-model="item.image_id"
            :defaultList="item.image ? [item.image] : []"
            :width="50"
          />
        </template>
        <!-- 商品价格 -->
        <template slot="price" slot-scope="text, item">
          <a-input-number v-model="item.price" size="small" :min="0.01" :precision="2" />
        </template>
        <!-- 零售价格 -->
        <template slot="retail_price" slot-scope="text, item">
          <a-input-number v-model="item.retail_price" size="small" :min="0" :precision="2" />
        </template>
        <!-- 永辉价格 -->
        <template slot="yonghui_price" slot-scope="text, item">
          <a-input-number v-model="item.yonghui_price" size="small" :min="0" :precision="2" />
        </template>
        <!-- 成本价格 -->
        <template slot="cost_price" slot-scope="text, item">
          <a-input-number v-model="item.cost_price" size="small" :min="0" :precision="2" />
        </template>
        <!-- 库存数量 -->
        <template slot="stock" slot-scope="text, item">
          <a-input-number v-model="item.stock" size="small" :min="0" :precision="0" />
        </template>
        <!-- 商品重量 -->
        <template slot="weight" slot-scope="text, item">
          <a-input-number v-model="item.weight" size="small" :min="0" :precision="2" />
        </template>
        <!-- sku编码 -->
        <template slot="no" slot-scope="text, item">
          <a-input v-model="item.no" size="small" />
        </template>
      </a-table>
    </a-form-item>
  </div>
</template>

<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import MultiSpecModel from '@/common/model/goods/MultiSpec'
import { SelectImage } from '@/components'
import * as GoodsApi from '@/api/goods'
import ChannelEnum from '@/common/enum/file/Channel'

export default {
  components: {
    SelectImage
  },
  props: {
    goodsId: null,
    // 默认的规格列表
    defaultSpecList: PropTypes.array.def([]),
    // 默认的SKU列表
    defaultSkuList: PropTypes.array.def([]),
    // 商品规格是否锁定(锁定状态下不允许编辑规格)
    isSpecLocked: PropTypes.bool.def(false)
  },
  data () {
    return {
      // 标签布局属性
      labelCol: { span: 3 },
      // 输入框布局属性
      wrapperCol: { span: 21 },
      isShowSpecEditor: false,
      // 商品多规格模型
      MultiSpecModel: new MultiSpecModel(),
      // MultiSpecModel: Object,
      multiSpecData: {
        // 规格列表
        specList: [],
        // SKU列表
        skuList: []
      },
      channel: ChannelEnum.SKU.value,
      fields: [],
      isSavingSpec: false,
    }
  },
  watch: {
    defaultSpecList (val) {
      if (val.length && this.MultiSpecModel.isEmpty()) {
        this.getData()
      }
    }
  },
  computed: {
    specKeys () {
      return _(this.multiSpecData.specList).map('key').uniq().value().filter(k => k != '')
    }
  },
  // 初始化数据
  created () {
    // 获取规格及SKU信息
    this.getData()
  },
  methods: {

    // 获取规格及SKU信息(展示)
    getData () {
      const { defaultSpecList, defaultSkuList } = this
      this.multiSpecData = this.MultiSpecModel.getData(defaultSpecList, defaultSkuList)
    },

    // 获取规格及SKU信息(表单提交)
    getFormSpecData () {
      return this.MultiSpecModel.getFormSpecData()
    },

    // 保存规格键值
    async handleSaveSpecs() {
      this.isSavingSpec = true
      let data = _(this.multiSpecData.specList).filter('key').groupBy('key').value();
      let result = await GoodsApi.saveSpec(this.goodsId, data)
      this.multiSpecData.skuList = result.skus
      this.MultiSpecModel.onUpdate(false)
      this.isSavingSpec = false
      this.isShowSpecEditor = false
    },

    // 批量设置sku事件
    handleSkuBatch () {
      this.MultiSpecModel.handleSkuBatch()
    },

    // 验证多规格表单
    verifyForm () {
      if (!this.MultiSpecModel.verifyForm()) {
        this.$message.error(this.MultiSpecModel.getError(), 2)
        return false
      }
      return true
    },

    // 打开spec编辑窗时加载字段列表
    async specVisibleChange(v) {
      if (v) await this.MultiSpecModel.getFields();
    },

    // 报错

  }
}

</script>
<style lang="less" scoped>
// 商品多规格
.spec-group {
  width: 895px;
  margin-bottom: 15px;
  line-height: normal;

  .ant-input {
    height: 28px;
    padding: 4px 11px;
    font-size: @font-size-base;
    line-height: 1.5;

    &::placeholder {
      font-size: @font-size-base;
    }
  }

  .form-item-help {
    line-height: 36px;
  }

  .spec-group-item {
    background: #f4f5f9;
    padding: 7px 12px;
    line-height: 28px;

    .group-item-input {
      float: left;
      width: 180px;
    }

    .group-item-delete {
      font-size: 12px;
      float: right;
    }
  }

  .spec-value {
    background: #fbfbfb;
    padding: 8px 35px;

    .spec-value-add,
    .spec-value-item {
      float: left;
      margin-bottom: 6px;
      margin-top: 6px;
    }

    .spec-value-add {
      height: 28px;
      line-height: 28px;

      a {
        font-size: 12px;
      }
    }

    .spec-value-item {
      position: relative;
      margin-right: 20px;

      .value-item-input {
        width: 186px;
      }

      &:hover {
        .icon-close {
          display: block;
        }
      }

      .icon-close {
        display: none;
        position: absolute;
        top: -8px;
        right: -8px;
        cursor: pointer;
        font-size: 16px;
        color: #7d7d7d;
      }
    }
  }
}

// 添加规格按钮
.spec-group-add-btn {
  font-size: @font-size-base;
}

// 批量设置sku
.sku-batch {
  line-height: 40px;
  margin-bottom: 12px;
  .title {
    line-height: 28px;
    margin-right: 15px;
    font-size: @font-size-base;
  }
  /deep/.ant-input,
  /deep/.ant-input-number {
    width: 120px;
    margin-right: 15px;
  }
  /deep/.ant-input {
    width: 140px;
  }
}

// sku列表
.sku-list {
  width: 895px;
  /deep/.ant-table-thead > tr > th,
  /deep/.ant-table-tbody > tr > td {
    white-space: nowrap;
  }
  /deep/.ant-table-tbody > tr > td {
    padding: 12px 18px;
  }

  /deep/.ant-input-sm,
  /deep/.ant-input-number-sm {
    height: 28px;
  }
  /deep/.ant-input-number-sm input {
    height: 26px;
  }
}
</style>
