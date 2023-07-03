<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-alert message="注：助力券只能抵扣商品金额，最多优惠到0.02元，不能抵扣运费" banner />
    <div class="table-operator">
      <a-row>
        <a-col :span="6">
          <a-button
            v-if="$auth('vouchers.create')"
            type="primary"
            icon="plus"
            @click="handleAdd"
          >新增</a-button>
        </a-col>
        <a-col :span="8" :offset="10">
          <a-input-search
            style="max-width: 300px; min-width: 150px;float: right;"
            v-model="queryParam.search"
            placeholder="请输入优惠券名称"
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
      <!-- 奖励类型 -->
      <template slot="award" slot-scope="text, item">
        <a-tooltip v-if="(item.award_type=='App\\Models\\VoucherTemplate' && item.award)" :title="item.award.title">
          <a-tag>赠送优惠券</a-tag>
        </a-tooltip>
        <a-tag v-if="item.award_amount">赠送金额￥{{item.award_amount}}</a-tag>
        <template v-if="!item.award_amount && !item.award">无</template>
      </template>
      <template slot="award_teammate" slot-scope="text, item">
        <a-tooltip v-if="item.award_teammate_type=='App\\Models\\VoucherTemplate' && item.award_teammate" :title="item.award_teammate.title">
          <a-tag>赠送优惠券</a-tag>
        </a-tooltip>
        <a-tag v-else-if="item.award_teammate_amount">赠送金额￥{{item.award_teammate_amount}}</a-tag>
        <template v-else>无</template>
      </template>
      <!-- 新人助力 -->
      <template slot="is_need_new" slot-scope="text">
        {{ text ? '是' : '否' }}
      </template>
      <!-- 发起频率 -->
      <template slot="limit_once_every" slot-scope="text">
        <template v-if="text == 'day'">每天一次</template>
        <template v-else-if="text == 'week'">每周一次</template>
        <template v-else-if="text == 'month'">每月一次</template>
      </template>
      <!-- 状态 -->
      <template slot="is_active" slot-scope="text">
        <a-tag :color="text ? 'green' : ''">{{ text ? '可用' : '禁用' }}</a-tag>
      </template>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="item">
        <a v-if="$auth('vouchers.update')" @click="handleEdit(item)">编辑</a>
        <a v-action:delete @click="handleDelete(item)">删除</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import * as Api from '@/api/market/assistance'
import { STable } from '@/components'
import { ApplyRangeEnum, CouponTypeEnum, ExpireTypeEnum } from '@/common/enum/coupon'
import store from '@/store'

export default {
  name: 'Index',
  components: {
    STable
  },
  data () {
    return {
      // 查询参数
      queryParam: {
        area_id: store.getters.areaId,
      },
      // 枚举类
      ApplyRangeEnum,
      CouponTypeEnum,
      ExpireTypeEnum,
      // 正在加载
      isLoading: false,
      // 表头
      columns: [
        {
          title: '助力模版ID',
          dataIndex: 'id'
        },
        {
          title: '助力标题',
          dataIndex: 'name'
        },
        {
          title: '奖励',
          dataIndex: 'award_amount',
          scopedSlots: { customRender: 'award' }
        },
        {
          title: '助力者奖励',
          dataIndex: 'award_teammate_amount',
          scopedSlots: { customRender: 'award_teammate' }
        },
        {
          title: '需要助力数',
          dataIndex: 'needs',
        },
        {
          title: '是否新人助力',
          dataIndex: 'is_need_new',
          scopedSlots: { customRender: 'is_need_new' }
        },
        {
          title: '用户发起频率',
          dataIndex: 'limit_once_every',
          scopedSlots: { customRender: 'limit_once_every' }
        },
        // {
        //   title: '发放总数量',
        //   dataIndex: 'total_num'
        // },
        {
          title: '已助力次数',
          dataIndex: 'success_count'
        },
        {
          title: '状态',
          dataIndex: 'is_active',
          scopedSlots: { customRender: 'is_active' }
        },
        {
          title: '添加时间',
          dataIndex: 'created_at'
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

    // 新增记录
    handleAdd () {
      this.$router.push('./create')
    },

    // 编辑记录
    handleEdit (item) {
      this.$router.push({ path: './update', query: { id: item.id } })
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
          return Api.deleted( item.id )
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
