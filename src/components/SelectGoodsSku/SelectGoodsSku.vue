<template>
  <div>
    <a-button @click="handleSelectGoods">选择商品@157</a-button>
    <a-table
      v-show="selectedItems.length"
      class="table-goodsList"
      rowKey="goods_id"
      :columns="columns"
      :dataSource="selectedItems"
      :pagination="false"
    >
      <!-- 商品信息 -->
      <template slot="item" slot-scope="item">
        <GoodsItemSku
          :data="{
            image: item.goods_image,
            imageAlt: '商品图片',
            title: item.goods_name,
            subtitle: `¥${item.goods_price_min}`,
            spec_type:item.spec_type,
            skuList:item.skuList
          }"
          :subTitleColor="true"
        />
      </template>
      
      <div slot="goods_price"  slot-scope="item" class="goodsSkuPrice">
        
         <div class="goodsSku-line clearfix" v-for="(props, idx) in item.skuList" :key="idx">
            <!-- 规格列表-->
            <div class="goodsSkuPrice-item">
              <span v-for="(props2, idx2) in props.goods_props" :key="idx2">{{ props2.value.name }}，</span>
            </div>
            <!-- 规格金额-->
            <div class="goodsSkuPrice-input">
              
               <a-form-item>
                 规格ID：{{props.id}};  商品价格：{{props.goods_price}}元<br>
                秒杀价格：¥<!-- <a-input-number
                    :min="0.01"
                    :precision="2"
                    v-decorator="[`seckil_price2eeee[${idx2}]`, {validateTrigger: [ 'blur'], rules: [{ required: true, message: '请输入秒杀价格' }] }]"
                  /> -->
                   <!-- <a-input-number>渲染不出来数字 -->
                  <a-input
                  placeholder="请输入金额"
                  v-decorator="[ `seckilSku_price.'${props.id}'`, {validateTrigger: [ 'blur'], rules: [{ required: true, message: '请输入秒杀价格' }] }]"  @change="(e) => {e.target.value = e.target.value.replace(/[^1-9.]/g,'')}"/>
                  
                </a-form-item>
               
            </div>
            
            
            
          </div>
         
      </div>
      
      <!-- 操作项 -->
      <span slot="action" slot-scope="text, item, index">
        <a v-action:delete @click="handleDeleteItem(index)">删除</a>
      </span>
    </a-table>
    <GoodsModal
      ref="GoodsModal"
      :multiple="multiple"
      :maxNum="maxNum"
      :defaultList="selectedItems"
      @handleSubmit="handleSelectGoodsSubmit"
    />
  </div>
</template>

<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import cloneDeep from 'lodash.clonedeep'
import { GoodsModal } from '@/components/Modal'
import { GoodsItemSku } from '@/components/Table'

const columns = [
  {
    title: '商品ID',
    dataIndex: 'goods_id'
  },
  {
    title: '商品信息',
    scopedSlots: { customRender: 'item' }
  },
  {
    title: '商品价格',
     scopedSlots: { customRender: 'goods_price' }
  },
  {
    title: '库存总量',
    dataIndex: 'stock_total'
  },
  {
    title: '操作',
    width: '180px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

// 商品选择器组件
export default {
  name: 'SelectGoodsSku',
  components: {
    GoodsModal,
    GoodsItemSku
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 多选模式, 如果false为单选
    multiple: PropTypes.bool.def(true),
    // 最大选择的数量限制, multiple模式下有效
    maxNum: PropTypes.integer.def(100),
    // 默认选中的商品
    defaultList: PropTypes.array.def([])
  },
  data () {
    return {
      columns,
      // 已选择的商品列表
      selectedItems: [],
      // 已选择的商品ID集
      selectedGoodsIds: []
    }
  },
  watch: {
    // 设置默认数据
    defaultList: {
      // 首次加载的时候执行函数
      immediate: true,
      handler (val) {
        const { selectedItems } = this
        if (val.length && !selectedItems.length) {
          this.onUpdate(cloneDeep(val))
        }
      }
    }
  },
  created () {
  },
  methods: {

    // 更新数据
    onUpdate (selectedItems) {
      if (this.multiple || !selectedItems.length) {
        // 多选模式
        this.selectedItems = selectedItems
        this.selectedGoodsIds = selectedItems.map(item => item.goods_id)
      } else {
        // 单选模式
        const single = selectedItems[selectedItems.length - 1]
        this.selectedItems = [single]
        this.selectedGoodsIds = [single.goods_id]
      }
      this.onChange()
    },

    // 打开商品选择器
    handleSelectGoods () {
      this.$refs.GoodsModal.handle()
    },

    // 商品库modal确认回调
    handleSelectGoodsSubmit (result) {
      const { selectedItems } = result
      this.onUpdate(cloneDeep(selectedItems))
    },

    // 删除商品
    handleDeleteItem (index) {
      const { selectedItems } = this
      selectedItems.splice(index, 1)
      this.onUpdate(selectedItems)
    },

    // 触发change事件
    onChange () {
      const { multiple, selectedGoodsIds } = this
      const sGoodsIds = multiple ? selectedGoodsIds : (selectedGoodsIds.length ? selectedGoodsIds[0] : undefined)
      return this.$emit('change', sGoodsIds)
    }

  }
}
</script>

<style lang="less" scoped>
// 商品信息
.table-goodsList {
  margin-top: 10px;
  min-width: 620px;
}
.goodsSkuPrice{
  margin-top: 10px;
  min-width: 320px;
  
  .goodsSku-line{
    display: flex;
    flex-direction: column;
    .goodsSkuPrice-input{
      width:100px;
    }
    .goodsSkuPrice-item{
      
          display: flex;
      span{
          max-width: 100px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          display: flex;
          align-items: center;
      }
    }
    
  }
  
}
</style>
