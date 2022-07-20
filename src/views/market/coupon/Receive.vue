<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <!-- 搜索板块 -->
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="优惠券编号">
            <a-input v-decorator="['code']" placeholder="请输入优惠券名称" />
          </a-form-item>
          <a-form-item label="会员ID">
            <a-input v-decorator="['user_id']" placeholder="请输入会员ID" />
          </a-form-item>
          <a-form-item label="是否过期">
            <a-select :default-value="null" v-decorator="['is_expired']" placeholder="筛选过期优惠券">
              <a-select-option :value="null">全部</a-select-option>
              <a-select-option :value="false">未过期</a-select-option>
              <a-select-option :value="true">已过期</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="领取时间">
            <a-range-picker format="YYYY-MM-DD" v-decorator="['created_between']" />
          </a-form-item>
          <a-form-item class="search-btn">
            <a-button type="primary" icon="search" html-type="submit">搜索</a-button>
          </a-form-item>
        </a-form>
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
      <!-- 会员信息 -->
      <template slot="user" slot-scope="item">
        <UserItem :user="item" />
      </template>
      <!-- 优惠券类型 -->
      <template slot="type" slot-scope="text">
        <a-tag>{{ CouponTypeEnum[text].name }}</a-tag>
      </template>
      <!-- 最低消费金额 -->
      <template slot="min_price" slot-scope="text">
        <p class="c-p">{{ text }}</p>
      </template>
      <!-- 优惠方式 -->
      <template slot="discount" slot-scope="item">
        <template v-if="item.type == CouponTypeEnum.FULL_DISCOUNT.value">
          <span>立减</span>
          <span class="c-p mlr-2">{{ item.metadata.save_amount }}</span>
          <span>元</span>
        </template>
        <template v-if="item.type == CouponTypeEnum.DISCOUNT.value">
          <span>打</span>
          <span class="c-p mlr-2">{{ (1-item.metadata.off_percent)*10 }}</span>
          <span>折</span>
        </template>
      </template>
      <!-- 有效期 -->
      <template slot="duetime" slot-scope="item">
        <template v-if="item.expire_type == ExpireTypeEnum.RECEIVE.value">
          <span>领取</span>
          <span class="c-p mlr-2">{{ item.expire_day }}</span>
          <span>天内有效</span>
        </template>
        <template v-if="item.expire_type == ExpireTypeEnum.FIXED_TIME.value">
          <span>{{ item.start_time }} ~ {{ item.end_time }}</span>
        </template>
      </template>
    </s-table>
  </a-card>
</template>

<script>
import * as Api from '@/api/market/coupon'
import { STable, UserItem } from '@/components/Table'
import { CouponTypeEnum } from '@/common/enum/coupon'

export default {
  name: 'Index',
  components: {
    STable,
    UserItem
  },
  data () {
    return {
      // 当前表单元素
      searchForm: this.$form.createForm(this),
      // 查询参数
      queryParam: {},
      // 枚举类
      CouponTypeEnum,
      // 正在加载
      isLoading: false,
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: '会员信息',
          dataIndex: 'user',
          scopedSlots: { customRender: 'user' }
        },
        {
          title: '优惠券码',
          dataIndex: 'code'
        },
        {
          title: '优惠券类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '最低消费金额 (元)',
          dataIndex: 'metadata.amount_limit',
          scopedSlots: { customRender: 'min_price' }
        },
        {
          title: '优惠方式',
          scopedSlots: { customRender: 'discount' }
        },
        {
          title: '有效期',
          dataIndex: 'expires_at',
          // scopedSlots: { customRender: 'duetime' }
        },
        {
          title: '领取时间',
          dataIndex: 'created_at'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.receive({ ...param, ...this.queryParam })
          .then(response => {
            return response
          })
      }
    }
  },
  created () {

  },
  methods: {

    /**
    * 刷新列表
    * @param Boolean bool 强制刷新到第一页
    */
    handleRefresh (bool = false) {
      this.$refs.table.refresh(bool)
    },

    // 确认搜索
    handleSearch (e) {
      e.preventDefault()
      this.searchForm.validateFields((error, values) => {
        if (!error) {
          this.queryParam = { ...this.queryParam, ...values }
          this.handleRefresh(true)
        }
      })
    }

  }
}
</script>
