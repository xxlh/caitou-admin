<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-alert message="注：秒杀券只能抵扣商品金额，最多优惠到0.02元，不能抵扣运费" banner />
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
            placeholder="请输入限时秒杀名称"
            @search="onSearch"
          />
        </a-col>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="seckill_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
  
      <!-- 商品价格 -->
      <template slot="goods_price_min" slot-scope="item">
        <span class="c-p mlr-2">{{ item.goods_price_min }}</span>
        <span>元</span>
      </template>
      
      <template slot="duetime" slot-scope="item">
         <template>
          <span>{{ item.start_time }} ~ {{ item.end_time }}</span>
        </template>
      </template>
      
      <!-- 优惠方式 -->
      <template slot="seckil_price" slot-scope="item">
          <span class="c-p mlr-2">{{ item.seckil_price }}</span>
          <span>元</span>
      </template>
      <!-- 状态 -->
      <template slot="status" slot-scope="text">
        <a-tag :color="text ? 'green' : ''">{{ text ? '显示' : '隐藏' }}</a-tag>
      </template>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="item">
        <a v-if="$auth('/market/seckill/update')" @click="handleEdit(item)">编辑</a>
        <a v-action:delete @click="handleDelete(item)">删除</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import * as Api from '@/api/market/seckill'
import { STable } from '@/components'
import { ApplyRangeEnum, SeckillTypeEnum, ExpireTypeEnum } from '@/common/enum/seckill'

export default {
  name: 'Index',
  components: {
    STable
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
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
          dataIndex: 'seckill_id'
        },
        {
          title: '商品名称',
          dataIndex: 'goods_name'
        },
        {
          title: '秒杀时间范围',
          scopedSlots: { customRender: 'duetime' }
        },
        {
          title: '商品价格',
          scopedSlots: { customRender: 'goods_price_min' }
        },
        {
          title: '秒杀价格',
          scopedSlots: { customRender: 'seckil_price' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '添加时间',
          dataIndex: 'create_time'
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
            return response.data.list
          })
      }
    }
  },
  created () {

  },
  methods: {

    // 新增记录
    handleAdd () {
      this.$router.push('./create')
    },

    // 编辑记录
    handleEdit (item) {
      this.$router.push({ path: './update', query: { seckillId: item.seckill_id } })
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
          return Api.deleted({ seckillId: item.seckill_id })
            .then((result) => {
              app.$message.success(result.message, 1.5)
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
