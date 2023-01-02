<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
   <!-- <a-alert message="注：秒杀只能抵扣商品金额" banner /> -->
    <div class="table-operator">
      <a-row>
        <a-col :span="6">
          <a-button
            v-if="$auth('/market/seckill/create')"
            type="primary"
            icon="plus"
            @click="handleAdd"
          >新增</a-button>
        </a-col>
        <a-col :span="8" :offset="10">
          <a-input-search
            style="max-width: 300px; min-width: 150px;float: right;"
            v-model="queryParam.search"
            placeholder="请输入限时秒杀商品名称"
            @search="onSearch"
          />
        </a-col>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <!-- 秒杀价格 -->
      <template slot="target_price" slot-scope="text, item">
          <span>¥{{ item.product_sku.price }} -> </span>
          <span class="c-p mlr-2">¥{{ text }}</span>
      </template>
      
      <template slot="duetime" slot-scope="item">
          <span>{{ item.adjust_at }}</span>
          <span v-if="item.turn_back"> ~ {{ moment(item.turn_back.adjust_at).format('HH:mm:ss') }}</span>
      </template>
      <template slot="repeat" slot-scope="item">
         <template v-if="item.every">
          <span>每 {{item.every}} {{item.repeat}}</span>
        </template>
        <a-tag v-else>否</a-tag>
      </template>
      <!-- 状态 -->
      <template slot="is_show" slot-scope="text">
        <a-tag :color="text ? 'green' : ''">{{ text ? '显示' : '隐藏' }}</a-tag>
      </template>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="item">
        <a v-if="$auth('/market/seckill/update')" @click="handleEdit(item)">编辑</a>
        <a v-action:delete @click="handleDelete(item)">删除</a>
      </span>
    </s-table>
    <PriceScheduleEdit ref="EditForm" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/market/seckill'
import * as GoodsApi from '@/api/goods'
import { STable } from '@/components'
import { ApplyRangeEnum, SeckillTypeEnum, ExpireTypeEnum } from '@/common/enum/seckill'
import PriceScheduleEdit from '../../goods/modules/PriceScheduleEdit'
import store from '@/store'
import moment from 'moment'

export default {
  name: 'Index',
  components: {
    STable,
    PriceScheduleEdit,
  },
  data () {
    return {
      // 查询参数
      queryParam: {
        with_turn_back: 'only',
        valid: true,
        area_id: store.getters.areaId,
      },
      // 枚举类
      ApplyRangeEnum,
      SeckillTypeEnum,
      ExpireTypeEnum,
      // 正在加载
      isLoading: false,
      // 表头
      columns: [
        {
          title: '秒杀ID',
          dataIndex: 'id'
        },
        {
          title: '商品名称',
          dataIndex: 'product.title'
        },
        {
          title: '秒杀价格',
          dataIndex: 'target_price',
          scopedSlots: { customRender: 'target_price' }
        },
        {
          title: '秒杀时间范围',
          scopedSlots: { customRender: 'duetime' }
        },
        {
          title: '自动重复',
          scopedSlots: { customRender: 'repeat' }
        },
        {
          title: '状态',
          dataIndex: 'is_show',
          scopedSlots: { customRender: 'is_show' }
        },
        {
          title: '操作',
          width: '180px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.list({ ...param, ...this.queryParam })
          .then(response => {
            return response
          })
      }
    }
  },
  created () {

  },
  methods: {
    moment,
    // 新增记录
    handleAdd () {
      this.$refs.EditForm.create()
    },

    // 编辑记录
    handleEdit (item) {
      this.$refs.EditForm.edit(item)
      // this.$router.push({ path: './update', query: { seckillId: item.id } })
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
          return GoodsApi.deleteScheduledPrice(item.product_id, item.id)
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
    }

  }
}
</script>
