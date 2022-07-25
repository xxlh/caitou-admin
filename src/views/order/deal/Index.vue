<template>
  <a-card :bordered="false">
    <a-spin :spinning="isLoading">
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <!-- 搜索板块 -->
        <a-row class="row-item-search">
          <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
            <a-form-item label="订单查询">
              <a-input style="width: 342px" placeholder="请输入关键词" v-decorator="['search']">
                <a-select
                  slot="addonBefore"
                  v-decorator="['searchType', { initialValue: 'ids' }]"
                  style="width: 100px"
                >
                  <a-select-option
                    v-for="(item, index) in SearchTypeEnum"
                    :key="index"
                    :value="item.value"
                  >{{ item.name }}</a-select-option>
                </a-select>
              </a-input>
            </a-form-item>
            <!-- <a-form-item label="订单来源">
              <a-select v-decorator="['orderSource', { initialValue: -1 }]">
                <a-select-option :value="-1">全部</a-select-option>
                <a-select-option
                  v-for="(item, index) in OrderSourceEnum.data"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item> -->
            <a-form-item label="支付方式">
              <a-select v-decorator="['payment_method', { initialValue: -1 }]">
                <a-select-option :value="-1">全部</a-select-option>
                <a-select-option
                  v-for="(item, index) in PayTypeEnum.data"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
            <!-- <a-form-item label="配送方式">
              <a-select v-decorator="['deliveryType', { initialValue: -1 }]">
                <a-select-option :value="-1">全部</a-select-option>
                <a-select-option
                  v-for="(item, index) in DeliveryTypeEnum.data"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item> -->
            <a-form-item label="下单时间">
              <a-range-picker format="YYYY-MM-DD" v-decorator="['created_between']" />
            </a-form-item>
            <a-form-item class="search-btn">
              <a-button type="primary" icon="search" html-type="submit">搜索</a-button>
            </a-form-item>
            <a-form-item class="search-btn">
              <a-button @click="handleReset">重置</a-button>
            </a-form-item>
          </a-form>
        </a-row>
        <!-- 操作板块 -->
        <!-- <div class="row-item-tab clearfix">
          <a-button icon="download">订单导出</a-button>
          <a-button icon="upload">批量发货</a-button>
        </div>-->
      </div>
      <!-- 列表内容 -->
      <div class="ant-table ant-table-scroll-position-left ant-table-default ant-table-bordered">
        <div class="ant-table-content">
          <div class="ant-table-body">
            <table>
              <thead class="ant-table-thead">
                <tr>
                  <th v-for="(item, index) in columns" :key="index">
                    <span class="ant-table-header-column">
                      <div>
                        <span class="ant-table-column-title">{{ item.title }}</span>
                      </div>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody class="ant-table-tbody">
                <template v-for="(item) in dealList.data">
                  <tr class="order-empty" :key="`order_${item.id}_1`">
                    <td colspan="7"></td>
                  </tr>
                  <tr :key="`order_${item.id}_2`">
                    <td colspan="7">
                      <span class="mr-20">{{ item.created_at }}</span>
                      <span class="mr-20">配送单号：{{ item.id }}</span>
                      <platform-icon :name="item.platform" :showTips="true" />
                    </td>
                  </tr>
                  <tr
                    v-for="(packing, packingIdx) in item.packings"
                    :key="`orderGoods_${item.id}_${packingIdx}`"
                  >
                    <td>
                      <GoodsItem v-if="packing.items.length"
                        :data="{
                          image: packing.items[0].image,
                          imageAlt: '商品图片',
                          title: packing.items[0].title + '...等',
                        }"
                      />
                    </td>
                    <td>
                      <p>共计{{ packing.items.reduce((aggre, cur) => aggre + parseInt(cur.count), 0) }}件商品</p>
                    </td>
                    <td>
                      <a-tooltip>
                        <template slot="title">仓储地址: {{ packing.address.address }}</template>
                        <span style="margin-right: 5px">{{ packing.name }}</span>
                        <a-tag :color="renderOrderStatusColor(packing.status)">{{ OrderStatusEnum[packing.status].name }}</a-tag>
                      </a-tooltip>
                    </td>
                    <template v-if="packingIdx===0">
                      <!-- <td :rowspan="item.items.length">
                        <p>￥{{ item.total_amount }}</p>
                        <p class="c-muted-1">(含运费：￥{{ item.freight }})</p>
                      </td> -->
                      <td :rowspan="item.items.length">
                        <a v-if="item.man && item.man.phone" :href="`tel://${item.man.phone}`">
                          <a-icon type="phone" /> 骑士-{{item.man.name}}
                        </a>
                      </td>
                      <td :rowspan="item.items.length">
                        <a-tooltip>
                          <template slot="title">送达地址: {{ item.address.address }}</template>
                          <a v-if="item.address && item.address.contact_phone" :href="`tel://${item.address.contact_phone}`">
                            <span class="c-p"><a-icon type="phone" /> {{ item.address.contact_name }}</span>
                          </a>
                          <span v-else>{{ item.address.contact_name }}</span>
                        </a-tooltip>
                      </td>
                      <!-- <td :rowspan="item.items.length">
                        <a-tag>{{ PayTypeEnum[item.payment_method].name }}</a-tag>
                      </td> -->
                      <!-- <td :rowspan="item.items.length">
                        <a-tag>{{ DeliveryTypeEnum[item.delivery_type].name }}</a-tag>
                      </td> -->
                      <td :rowspan="item.items.length">
                        <a-tag :color="renderOrderStatusColor(item.status)">{{ OrderStatusEnum[item.status].name }}</a-tag>
                      </td>
                      <td :rowspan="item.items.length">
                        <div class="actions">
                          <router-link
                            v-if="$auth('/order/detail')"
                            :to="{ path: '/order/detail', query: { orderId: item.order_id } }"
                          >详情</router-link>
                          <a
                            v-action:cancel
                            v-if="(
                                [OrderStatusEnum.UNDELIVERED.value,OrderStatusEnum.UNRECEIVED.value].includes(item.status)
                                // && !item.delivery_deal.delivery_man_id
                                && !inArray(item.status, [OrderStatusEnum.CANCELLED.value, OrderStatusEnum.REFUNDING.value])
                            )"
                            @click="handleDeliveryMan(item)"
                          >{{!item.delivery_deal.delivery_man_id ? '分配骑士' : '改派骑士'}}</a>
                          <a v-action:delete @click="handleDelete(item)">删除</a>
                        </div>
                      </td>
                    </template>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <!-- 空状态 -->
          <a-empty v-if="!dealList.data.length" :image="simpleImage" />
        </div>
      </div>
      <!-- 分页器 -->
      <div v-if="dealList.data.length" class="pagination">
        <a-pagination
          :current="page"
          :pageSize="dealList.per_page"
          :total="dealList.total"
          @change="onChangePage"
        />
      </div>
      <DeliveryManForm ref="DeliveryManForm" @handleSubmit="handleRefresh" />
    </a-spin>
  </a-card>
</template>

<script>
import { Empty } from 'ant-design-vue'
import { inArray, assignment } from '@/utils/util'
import * as Api from '@/api/order/deal'
import * as EventApi from '@/api/order/event'
import PlatformIcon from '@/components/PlatformIcon'
import { GoodsItem, UserItem } from '@/components/Table'
import {
  DeliveryTypeEnum,
  OrderSourceEnum,
  OrderStatusEnum,
  PayStatusEnum,
  PayTypeEnum,
  ReceiptStatusEnum
} from '@/common/enum/order'
import { DeliveryManForm } from '../modules'

// 表格字段
const columns = [
  {
    title: '商品信息',
    align: 'center',
    dataIndex: 'items',
    scopedSlots: { customRender: 'goods' }
  },
  {
    title: '数量',
    align: 'center',
    scopedSlots: { customRender: 'unit_price' }
  },
  {
    title: '仓储',
    align: 'center',
    dataIndex: 'store',
    scopedSlots: { customRender: 'store' }
  },
  {
    title: '骑士',
    dataIndex: 'man',
    scopedSlots: { customRender: 'man' }
  },
  {
    title: '送达',
    dataIndex: 'user',
    scopedSlots: { customRender: 'user' }
  },
  // {
  //   title: '支付方式',
  //   dataIndex: 'payment_method',
  //   scopedSlots: { customRender: 'payment_method' }
  // },
  // {
  //   title: '配送方式',
  //   dataIndex: 'delivery_type',
  //   scopedSlots: { customRender: 'delivery_type' }
  // },
  {
    title: '交易状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '180px',
    scopedSlots: { customRender: 'action' }
  }
]

// 搜索关键词类型枚举
const SearchTypeEnum = [
  { name: '配送单号', value: 'ids' },
  { name: '订单号', value: 'order_ids' },
  { name: '骑士名', value: 'man_name' },
  { name: '送达地址', value: 'address' },
]

export default {
  name: 'Index',
  components: {
    PlatformIcon,
    GoodsItem,
    UserItem,
    DeliveryManForm,
  },
  data () {
    return {
      // 订单类型
      dataType: this.getDataType(),
      // 当前表单元素
      searchForm: this.$form.createForm(this),
      // 查询参数
      queryParam: {},
      searchParams: {},
      // 正在加载
      isLoading: false,
      // 表格字段
      columns,
      // 当前页码
      page: 1,
      // 列表数据
      dealList: { data: [], total: 0, per_page: 10 }
    }
  },
  beforeCreate () {
    // 批量给当前实例赋值
    assignment(this, {
      inArray,
      DeliveryTypeEnum,
      OrderSourceEnum,
      OrderStatusEnum,
      PayStatusEnum,
      PayTypeEnum,
      ReceiptStatusEnum,
      SearchTypeEnum,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE
    })
  },
  created () {
    // 初始化页面
    this.init()
  },
  watch: {
    // 监听路由变化
    $route () {
      this.init()
    }
  },
  methods: {

    // 初始化页面
    init () {
      this.dataType = this.getDataType()
      this.searchForm.resetFields()
      this.queryParam = {}
      this.handleRefresh(true)
    },

    // 获取当前标签
    getDataType () {
      return this.$route.path.split('/')[3]
    },

    // 获取列表数据
    getList () {
      const { dataType, queryParam, searchParams, page } = this
      this.isLoading = true
      return Api.list({ status: dataType, ...queryParam, ...searchParams, page })
        .then(response => {
          this.dealList = response
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    // 渲染订单状态标签颜色
    renderOrderStatusColor (orderStatus) {
      const { OrderStatusEnum } = this
      const ColorEnum = {
        [OrderStatusEnum.NORMAL.value]: '',
        [OrderStatusEnum.CANCELLED.value]: 'red',
        [OrderStatusEnum.REFUNDING.value]: 'red',
        [OrderStatusEnum.COMPLETED.value]: 'green',
        [OrderStatusEnum.UNREVIEWED.value]: 'green',
        [OrderStatusEnum.DELIVERED.value]: 'green',
      }
      return ColorEnum[orderStatus]
    },

    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh (bool = false) {
      bool && (this.page = 1)
      this.getList()
    },

    // 确认搜索
    handleSearch (e) {
      e.preventDefault()
      this.searchForm.validateFields((error, values) => {
        if (!error) {
          this.queryParam = { ...this.queryParam, ...values }
          if (this.queryParam.searchType == 'ids') this.searchParams = {ids: this.queryParam.search}
          else if (this.queryParam.searchType == 'order_ids') this.searchParams = {order_ids: this.queryParam.search}
          else if (this.queryParam.searchType == 'man_name') this.searchParams = {man_name: this.queryParam.search}
          else if (this.queryParam.searchType == 'address') this.searchParams = {address: this.queryParam.search}
          delete this.queryParam.search
          delete this.queryParam.searchType
          this.handleRefresh(true)
        }
      })
    },

    // 重置搜索表单
    handleReset () {
      this.searchForm.resetFields()
    },

    // 翻页事件
    onChangePage (current) {
      this.page = current
      this.handleRefresh()
    },

    // 删除记录
    handleDelete (item) {
      const app = this
      const modal = app.$confirm({
        title: '您确定要删除该订单记录吗?',
        content: '删除后不可恢复，请谨慎操作',
        onOk () {
          return EventApi.deleted(item.id)
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

    // 分配骑手
    handleDeliveryMan (record) {
      this.$refs.DeliveryManForm.show(record)
    },

  }
}
</script>
<style lang="less" scoped>
// 分页器
.pagination {
  margin-top: 16px;
  .ant-pagination {
    float: right;
  }
}

.ant-table {
  table {
    border: none;
    border-collapse: collapse;
  }
  .ant-table-thead > tr {
    border: 1px solid #e8e8e8;
  }
  tr.order-empty {
    height: 15px;
    border: 1px solid #fff;
    td {
      padding: 0;
      border-right: none;
      border-left: none;
      background: none !important;
    }
  }
}

.ant-table-thead > tr > th {
  border-right: none;
  border-bottom: none;
  padding: 12px 12px;
  font-weight: bold;
}
.ant-table-tbody > tr > td {
  border-right: 1px solid #e8e8e8;
  border-left: 1px solid #e8e8e8;
  padding: 12px 12px;
  // text-align: center;
}
</style>
