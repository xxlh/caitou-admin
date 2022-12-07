<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <!-- 搜索板块 -->
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="助力标题">
            <a-input v-decorator="['couponName']" placeholder="请输入助力标题" />
          </a-form-item>
          <a-form-item label="会员ID">
            <a-input v-decorator="['user_id']" placeholder="请输入会员ID" />
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
      <template slot="coupon_type" slot-scope="text">
        <a-tag>{{ CouponTypeEnum[text].name }}</a-tag>
      </template>
      <!-- 最低消费金额 -->
      <template slot="count" slot-scope="text, item">
        <a-popover placement="right">
          <p class="c-p">{{ text }}</p>
          <template slot="content">
            <div v-for="teammate in item.teammates"><UserItem :user="teammate" /></div>
          </template>
        </a-popover>
      </template>
      <!-- 状态 -->
      <template slot="status" slot-scope="item">
        <span v-if="item.is_done"><a-tag color="green">成功</a-tag></span>
        <span v-else-if="moment(item.valid_before) < moment()"><a-tag>已超时</a-tag></span>
        <span v-else>还剩{{ moment(item.valid_before).diff(moment(), 'minutes') }}分钟</span>
      </template>
    </s-table>
  </a-card>
</template>

<script>
import * as Api from '@/api/market/assistance'
import { STable, UserItem } from '@/components/Table'
import { CouponTypeEnum } from '@/common/enum/coupon'
import moment from 'moment'

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
          title: '助力标题',
          dataIndex: 'template.name'
        },
        {
          title: '已助力次数',
          dataIndex: 'count',
          scopedSlots: { customRender: 'count' }
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '领取时间',
          dataIndex: 'created_at'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.log({ ...param, ...this.queryParam })
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
