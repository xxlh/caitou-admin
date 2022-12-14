<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-row>
        <a-col :span="5">
          <a-button v-action:add type="default" icon="plus" @click="handleAdd">新增</a-button>
        </a-col>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :showPagination="false"
    >
      <!-- 执行频率 -->
      <span slot="frequence" slot-scope="text, item">
        <p v-if="text" class="twoline-hide">每 {{ text }} {{item.repeat}}</p>
        <p v-else>执行一次</p>
      </span>
      <!-- 状态 -->
      <span slot="status" slot-scope="text, item">
        <a-tag v-if="!text && new Date(item.adjust_at) < new Date()" color="red">执行失败</a-tag>
        <a-tag v-else-if="!text">待执行</a-tag>
        <a-tag v-else-if="item.every" color="blue">已执行{{item.logs ? item.logs.length : 'n'}}次</a-tag>
        <a-tag v-else color="green">已调价</a-tag>
      </span>
      <!-- 价格回改 -->
      <span slot="turn_back" slot-scope="text, item">
        <a-tag v-if="!text">否</a-tag>
        <a-tag v-else-if="!text.done_at && new Date(text.adjust_at) < new Date()" color="red">回改失败</a-tag>
        <a-tag v-else-if="!text.done_at">待回改</a-tag>
        <a-tag v-else-if="(text.every && item.product_sku.price != text.target_price)" color="blue">待回改</a-tag>
        <a-tag v-else color="green">已回改</a-tag>
      </span>
      <!-- 操作 -->
      <span slot="action" slot-scope="text, item">
        <a v-action:edit style="margin-right: 8px;" @click="handleEdit(item)">编辑</a>
        <a v-action:delete @click="handleDelete(item)">删除</a>
      </span>
    </s-table>
    <PriceScheduleEdit ref="EditForm" :goodsId="goodsId" :goodsSkus="storeSkus" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/goods'
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { STable } from '@/components'
import { SelectRegion } from '@/components'
import PriceScheduleEdit from './PriceScheduleEdit'

export default {
  name: 'PriceSchedule',
  components: {
    STable,
    SelectRegion,
    PriceScheduleEdit,
},
  props: {
    goodsId: null,
    skus: PropTypes.array.def([]),
  },
  data () {
    return {
      // 查询参数
      queryParam: {with_turn_back: true},
      cascader: [],
      // 正在加载
      isLoading: false,
      // 表头
      columns: [
        {
          title: '规格名称',
          dataIndex: 'product_sku.name'
        },
        {
          title: '当前价格',
          dataIndex: 'product_sku.price'
        },
        {
          title: '即将调价',
          dataIndex: 'target_price'
        },
        {
          title: '调价时间',
          dataIndex: 'adjust_at'
        },
        {
          title: '执行频率',
          dataIndex: 'every',
          scopedSlots: { customRender: 'frequence' }
        },
        {
          title: '执行状态',
          dataIndex: 'done_at',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '价格回改',
          dataIndex: 'turn_back',
          scopedSlots: { customRender: 'turn_back' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '180px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.getScheduledPrice(this.goodsId, { ...param, ...this.queryParam, store_id: this.$store.getters.storeId })
          .then(response => {
            return {data: response}
          })
      }
    }
  },
  computed: {
    storeSkus() {
      return this.$store.getters.storeId ? this.skus.filter(sku => sku.store_id == this.$store.getters.storeId) : this.skus
    }
  },
  methods: {

    /**
     * 新增记录
     */
    handleAdd () {
      this.$refs.EditForm.create()
    },

    /**
     * 编辑记录
     */
    handleEdit (item) {
      this.$refs.EditForm.edit(item)
    },

    /**
     * 删除记录
     */
    handleDelete (item) {
      const app = this
      const modal = this.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk () {
          return Api.deleteScheduledPrice(app.goodsId, item.id)
            .then((result) => {
              app.$message.success('已删除', 1.5)
              app.handleRefresh()
            })
            .finally(result => {
              modal.destroy()
            })
        }
      })
    },

    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh (bool = false) {
      this.$refs.table.refresh(bool)
    },

    /**
     * 检索查询
     */
    onSearch () {
      this.handleRefresh(true)
    },
    onCascaderChange(value) {
      const [province, city, district] = value
      this.queryParam = {...this.queryParam, province, city, district}
      this.handleRefresh(true)
    },

  }
}
</script>
