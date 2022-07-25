<template>
  <div>
    <!-- 加载中 -->
    <a-spin :spinning="isLoading" />
    <!-- 订单内容 -->
    <div v-if="!isLoading" class="order-content">
      <!-- 订单进度步骤条 -->
      <a-card :bordered="false">
        <div class="order-progress" :class="`progress-${progress}`">
          <ul>
            <li>
              <span>下单时间</span>
              <div class="tip">{{ record.created_at }}</div>
            </li>
            <li>
              <span>付款</span>
              <div
                v-if="!!record.paid_at"
                class="tip"
              >付款于 {{ record.paid_at }}</div>
            </li>
            <li>
              <span>发货</span>
              <!-- <div
                v-if="record.delivery_status == DeliveryStatusEnum.UNRECEIVED.value"
                class="tip"
              >发货于 {{ record.delivery_time }}</div> -->
            </li>
            <li>
              <span>收货</span>
              <!-- <div
                v-if="record.receipt_status == ReceiptStatusEnum.REVIEWING.value"
                class="tip"
              >收货于 {{ record.receipt_time }}</div> -->
            </li>
            <li>
              <span>完成</span>
              <div
                v-if="record.status == OrderStatusEnum.COMPLETED.value"
                class="tip"
              >完成于 {{ record.receipt_time }}</div>
            </li>
          </ul>
        </div>
      </a-card>
      <!-- 配送单进度步骤条 -->
      <a-card v-if="deal" :bordered="false">
        <a-steps :current="dealProgress">
          <a-step title="仓储打包中" :description="`共 ${deal.packings.length} 家仓储在打包`" />
          <a-step title="打包完成" :description="deal.packed_at" />
          <a-step title="骑手到仓储点" :description="deal.arrived_at" />
          <a-step title="配送中" :description="dealProgress >= 3 ? `于 ${deal.fetched_at} 取到所有货品` : ''" />
          <a-step title="已送达" :description="deal.delivered_at" />
          <a-step title="已评价" :description="deal.reviewed_at" />
        </a-steps>
      </a-card>

      <!-- 订单信息 -->
      <a-card class="mt-20" :bordered="false">
        <!-- 订单操作 -->
        <template v-if="record.status != OrderStatusEnum.CANCELLED.value">
          <div class="ant-descriptions-title">订单操作</div>
          <!-- 提示栏 -->
          <div class="alerts mt-10 mb-15">
            <a-alert
              v-if="record.status== OrderStatusEnum.REFUNDING.value"
              message="当前买家已付款并申请取消订单，请审核是否同意，如同意则自动退回付款金额（原路退款）并关闭订单。"
              banner
            />
          </div>
          <!-- 操作栏 -->
          <div class="actions clearfix mt-10">
            <div class="action-item" v-if="$auth('/order/detail.updatePrice')">
              <a-button
                v-if="!record.paid_at"
                @click="handleUpdatePrice"
              >订单改价</a-button>
            </div>
            <div class="action-item" v-if="$auth('/order/list/all.deliver')">
              <template v-if="deal">
                <a-button
                  v-if="(
                    record.paid_at
                      && [OrderStatusEnum.UNDELIVERED.value,OrderStatusEnum.UNRECEIVED.value].includes(record.status)
                      // && !deal.delivery_man_id
                      && !inArray(record.status, [OrderStatusEnum.CANCELLED.value, OrderStatusEnum.REFUNDING.value])
                  )"
                  :type="!deal.delivery_man_id ? 'primary' : 'default'"
                  @click="handleDeliveryMan(record)"
                >{{!deal.delivery_man_id ? '分配骑士' : '改派骑士'}}</a-button>
              </template>
              <template v-else>
                <a-button
                  v-if="(
                    record.paid_at
                      // && record.delivery_type == DeliveryTypeEnum.EXPRESS.value
                      && record.delivery_status == DeliveryStatusEnum.NOT_DELIVERED.value
                      && !inArray(record.status, [OrderStatusEnum.CANCELLED.value, OrderStatusEnum.REFUNDING.value])
                  )"
                  type="primary"
                  @click="handleDelivery"
                >发货</a-button>
              </template>
            </div>
            <div class="action-item" v-if="$auth('/order/list/all.cancel')">
              <a-button
                v-if="record.status == OrderStatusEnum.REFUNDING.value"
                type="primary"
                @click="handleCancel"
              >审核取消订单</a-button>
            </div>
          </div>
          <a-divider class="o-divider" />
        </template>
        <!-- 订单信息 -->
        <a-descriptions title="订单信息">
          <a-descriptions-item label="订单号">{{ record.no }}</a-descriptions-item>
          <a-descriptions-item label="支付方式">
            <a-tag color="green">{{ PayTypeEnum[record.payment_method].name }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="实付款金额">￥{{ record.total_amount }}</a-descriptions-item>
          <a-descriptions-item label="配送方式">
            <!-- <a-tag color="green">{{ DeliveryTypeEnum[record.delivery_type].name }}</a-tag> -->
          </a-descriptions-item>
          <a-descriptions-item label="运费金额">￥{{ record.freight }}</a-descriptions-item>
          <a-descriptions-item label="订单状态">
            <a-tag
              :color="renderOrderStatusColor(record.status)"
            >{{ OrderStatusEnum[record.status].name }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="买家信息">
            <a-tooltip>
              <template slot="title">会员ID: {{ user.id }}</template>
              <span class="c-p">{{ user.nickname }}</span>
            </a-tooltip>
          </a-descriptions-item>
          <a-descriptions-item label="买家留言">
            <strong v-if="record.remark">{{ record.remark }}</strong>
            <span v-else>--</span>
          </a-descriptions-item>
          <a-descriptions-item v-if="deal" label="仓储信息">
            <a-tooltip v-for="packing in deal.packings" :key="packing.id" style="margin-right: 10px">
              <template slot="title">仓储地址: {{ packing.address.address }}</template>
              <a v-if="packing.store && packing.store.contact_phone" :href="`tel://${packing.store.contact_phone}`">
                <span class="c-p"><a-icon type="phone" /> {{ packing.name }}</span>
              </a>
              <span v-else>{{ packing.name }}</span>
            </a-tooltip>
          </a-descriptions-item>
          <a-descriptions-item v-if="deal" label="骑手信息">
            <a-tooltip v-if="deal.man" :title="deal.man && deal.man.phone">
              <a v-if="deal.man.phone" :href="`tel://${deal.man.phone}`">
                <a-icon type="phone" /> 骑士-{{deal.man.name}}
              </a>
              <span v-else>骑士-{{deal.man.name}}</span>
            </a-tooltip>
            <span v-else>(尚未分配骑士)</span>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- 商品信息 -->
      <a-card class="mt-20" :bordered="false">
        <div class="ant-descriptions-title">订单商品</div>
        <div class="goods-list">
          <a-table
            rowKey="id"
            :columns="goodsColumns"
            :dataSource="record.items"
            :pagination="false"
          >
            <!-- 商品信息 -->
            <template slot="goodsInfo" slot-scope="text, item">
              <GoodsItem
                :data="{
                  image: item.image || item.product.image,
                  imageAlt: '商品图片',
                  title: item.product.title,
                  goodsProps: item.product.generic_spec
                }"
              />
            </template>
            <!-- 商品编码 -->
            <span slot="no" slot-scope="text">{{ text ? text : '--' }}</span>
            <!-- 单价	 -->
            <template slot="price" slot-scope="text, item">
              <p :class="{ 'f-through': item.is_user_grade }">￥{{ text }}</p>
              <p v-if="item.is_user_grade">
                <a-tooltip>
                  <template slot="title">
                    <span class="f-13">会员等级折扣价</span>
                  </template>
                  <strong>会员价：</strong>
                  <span>￥{{ item.grade_goods_price }}</span>
                </a-tooltip>
              </p>
            </template>
            <!-- 购买数量	 -->
            <span slot="count" slot-scope="text">x{{ text }}</span>
            <!-- 商品总价 -->
            <span slot="total_price" slot-scope="text, item">￥{{ item.price * item.count }}</span>
              <template slot="store" slot-scope="text, item">
              <a-tooltip v-if="packingByStoreId[ item.product_sku.store_id ]">
                  <template slot="title">
                    <div class="f-13">仓储电话：{{packingByStoreId[ item.product_sku.store_id ].store.contact_phone}}</div>
                    <div class="f-13">骑士电话：{{deal.man.phone}}</div>
                  </template>
                  <span class="c-p">{{ packingByStoreId[ item.product_sku.store_id ].name }}</span>
                  <a-tag :color="renderOrderStatusColor(packingByStoreId[ item.product_sku.store_id ].status)" style="margin-left: 5px">{{ OrderStatusEnum[ packingByStoreId[ item.product_sku.store_id ].status ].name }}</a-tag>
              </a-tooltip>
            </template>
          </a-table>
          <!-- 订单价格明细 -->
          <div class="order-price">
            <table class="fl-r">
              <tbody>
                <tr>
                  <td>订单总额：</td>
                  <td>￥{{ record.total_amount }}</td>
                </tr>
                <tr v-if="record.discount > 0">
                  <td>优惠券抵扣：</td>
                  <td>-￥{{ record.discount }}</td>
                </tr>
                <tr v-if="record.points_money > 0">
                  <td>积分抵扣：</td>
                  <td>-￥{{ record.points_money }}</td>
                </tr>
                <!-- <tr v-if="record.update_price.value != 0">
                  <td>商家改价：</td>
                  <td>{{ record.update_price.symbol }}￥{{ record.update_price.value }}</td>
                </tr> -->
                <tr>
                  <td>运费金额：</td>
                  <td>+￥{{ record.freight }}</td>
                </tr>
                <tr>
                  <td>实付款金额：</td>
                  <td>
                    <strong>￥{{ record.total_amount }}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </a-card>

      <!-- 快递配送 -->
      <a-card
        v-if="record.delivery_type == DeliveryTypeEnum.EXPRESS.value"
        class="mt-20"
        :bordered="false"
      >
        <!-- 收货信息 -->
        <a-descriptions title="收货信息">
          <a-descriptions-item label="收货人姓名">{{ record.address.name }}</a-descriptions-item>
          <a-descriptions-item label="联系电话">{{ record.address.phone }}</a-descriptions-item>
          <a-descriptions-item label="收货地区">
            {{ record.address.region.province }}
            {{ record.address.region.city }}
            {{ record.address.region.region }}
          </a-descriptions-item>
          <a-descriptions-item label="详细地址">{{ record.address.detail }}</a-descriptions-item>
        </a-descriptions>
        <!-- 发货信息 -->
        <template
          v-if="(
            record.paid_at
              && record.delivery_status == DeliveryStatusEnum.UNRECEIVED.value
              && !inArray(record.status, [OrderStatusEnum.CANCELLED.value, OrderStatusEnum.REFUNDING.value])
          )"
        >
          <a-divider class="o-divider" />
          <a-descriptions title="发货信息">
            <a-descriptions-item label="物流公司">{{ record.express.express_name }}</a-descriptions-item>
            <a-descriptions-item label="物流单号">{{ record.express_no }}</a-descriptions-item>
            <a-descriptions-item label="发货状态">
              <a-tag
                :color="record.delivery_status == DeliveryStatusEnum.UNRECEIVED.value ? 'green' : ''"
              >{{ DeliveryStatusEnum[record.delivery_status].name }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="发货时间">{{ record.delivery_time }}</a-descriptions-item>
          </a-descriptions>
        </template>
      </a-card>

    </div>
    <DeliveryForm ref="DeliveryForm" @handleSubmit="handleRefresh" />
    <DeliveryManForm ref="DeliveryManForm" @handleSubmit="handleRefresh" />
    <CancelForm ref="CancelForm" @handleSubmit="handleRefresh" />
    <PriceForm ref="PriceForm" @handleSubmit="handleRefresh" />
  </div>
</template>

<script>
import { inArray } from '@/utils/util'
import * as Api from '@/api/order'
import { GoodsItem, UserItem } from '@/components/Table'
import { DeliveryForm, CancelForm, PriceForm, DeliveryManForm } from './modules'
import {
  DeliveryStatusEnum,
  DeliveryTypeEnum,
  OrderSourceEnum,
  OrderStatusEnum,
  PayStatusEnum,
  PayTypeEnum,
  ReceiptStatusEnum
} from '@/common/enum/order'

// 商品内容表头
const goodsColumns = [
  {
    title: '商品信息',
    scopedSlots: { customRender: 'goodsInfo' }
  },
  {
    title: '商品编码',
    dataIndex: 'product_sku.no',
    scopedSlots: { customRender: 'no' }
  },
  {
    title: '重量(Kg)',
    dataIndex: 'product_sku.weight',
    scopedSlots: { customRender: 'goods_weight' }
  },
  {
    title: '单价',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '购买数量',
    dataIndex: 'count',
    scopedSlots: { customRender: 'count' }
  },
  {
    title: '商品总价',
    dataIndex: 'total_price',
    scopedSlots: { customRender: 'total_price' }
  }
]
const goodsColumns_Packings = [
  {
    title: '仓储点',
    dataIndex: 'store',
    scopedSlots: { customRender: 'store' }
  }
]

export default {
  name: 'Index',
  components: {
    GoodsItem,
    UserItem,
    DeliveryForm,
    DeliveryManForm,
    CancelForm,
    PriceForm
  },
  data () {
    return {
      // 枚举类
      DeliveryStatusEnum,
      DeliveryTypeEnum,
      OrderSourceEnum,
      OrderStatusEnum,
      PayStatusEnum,
      PayTypeEnum,
      ReceiptStatusEnum,
      // 外部方法
      inArray,
      // 正在加载
      isLoading: true,
      // 订单ID
      orderId: null,
      // 订单详情
      record: {},
      deal: {},
      user: {},
      reviews: {},
      packingByStoreId: {},
      // 订单步骤位置
      progress: 2,
      dealProgress: 0,
      // 商品内容表头
      goodsColumns
    }
  },
  created () {
    // 记录订单ID
    this.orderId = this.$route.query.orderId
    // 刷新页面
    this.handleRefresh()
  },
  methods: {

    // 刷新页面
    handleRefresh () {
      // 获取当前记录
      this.getDetail()
    },

    // 获取当前记录
    getDetail () {
      const { orderId } = this
      this.isLoading = true
      Api.detail(orderId)
        .then(result => {
          // 当前记录
          this.record = result.order
          this.deal = result.delivery_deal
          this.user = result.user
          this.reviews = result.reviews
          // 初始化数据
          this.initData()
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    // 初始化数据
    initData () {
      // 步骤条位置
      this.initProgress()
      // 增加每个商品打包状态列
      if (this.deal) this.goodsColumns.push(...goodsColumns_Packings)
      // 仓储数据
      if (this.deal) this.packingByStoreId = _(this.deal.packings).keyBy('store_id').value()
    },

    // 步骤条位置
    initProgress () {
      const { record, deal } = this
      this.progress = 2
      record.paid_at && (this.progress += 1)
      record.ship_status === DeliveryStatusEnum.NOT_DELIVERED.value && (this.progress += 1)
      record.ship_status === ReceiptStatusEnum.RECEIVED.value && (this.progress += 1)
      // 配送单进度
      if (deal) {
        deal.status == 'packing' && (this.dealProgress = 0)
        deal.status == 'packed' && (this.dealProgress = 1)
        deal.status == 'arrived' && (this.dealProgress = 2)
        deal.status == 'delivering' && (this.dealProgress = 3)
        deal.status == 'delivered' && (this.dealProgress = 4)
        deal.status == 'completed' && (this.dealProgress = 5)
      }
    },

    // 渲染订单状态标签颜色
    renderOrderStatusColor (orderStatus) {
      const { OrderStatusEnum } = this
      const ColorEnum = {
        [OrderStatusEnum.NORMAL.value]: '',
        [OrderStatusEnum.CANCELLED.value]: 'red',
        [OrderStatusEnum.REFUNDING.value]: 'red',
        [OrderStatusEnum.COMPLETED.value]: 'green'
      }
      return ColorEnum[orderStatus]
    },

    // 订单发货
    handleDelivery () {
      const { record } = this
      this.$refs.DeliveryForm.show(record)
    },
    // 分配骑手
    handleDeliveryMan (record) {
      this.$refs.DeliveryManForm.show(record)
    },

    // 审核取消订单
    handleCancel () {
      const { record } = this
      this.$refs.CancelForm.show(record)
    },

    // 订单改价
    handleUpdatePrice () {
      const { record } = this
      this.$refs.PriceForm.show(record)
    }

  }
}
</script>
<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';
// 订单详情页
.order-content {
  margin-bottom: 70px;

  /deep/.ant-descriptions-item > span {
    vertical-align: middle;
  }

  // 分割线
  .o-divider {
    margin-bottom: 32px;
  }

  // 步骤条
  .order-progress {
    height: 26px;
    line-height: 26px;
    background: #f8f8f8;
    border-radius: 13px;
    font-size: 14px;
    text-align: center;
    position: relative;

    &:before,
    &:after {
      content: '';
      position: absolute;
      z-index: 2;
      left: 0;
      top: 0;
      bottom: 0;
      border-radius: 13px;
      background: @primary-color;
    }

    &:after {
      background: ~`colorPalette('@{primary-color}', 3) `;
      z-index: 1;
    }

    &.progress-1 {
      &:before {
        width: 0;
      }

      &:after {
        width: 20%;
      }
    }

    &.progress-2 {
      &:before {
        width: 20%;
      }

      &:after {
        width: 40%;
      }
    }

    &.progress-3 {
      &:before {
        width: 40%;
      }

      &:after {
        width: 60%;
      }
    }

    &.progress-4 {
      &:before {
        width: 60%;
      }

      &:after {
        width: 80%;
      }
    }

    &.progress-5 {
      &:before {
        width: 100%;
      }

      &:after {
        width: 100%;
      }

      li {
        &:nth-child(5) {
          color: #fff;
        }
      }
    }

    li {
      width: 20%;
      float: left;
      border-radius: 13px;
      position: relative;
      z-index: 3;
    }

    .tip {
      font-size: 12px;
      padding-top: 10px;
      color: #8c8c8c;
    }

    &.progress-1 li:nth-child(1),
    &.progress-2 li:nth-child(1),
    &.progress-3 li:nth-child(1),
    &.progress-4 li:nth-child(1),
    &.progress-5 li:nth-child(1) {
      color: #fff;
    }

    &.progress-2 li:nth-child(2),
    &.progress-3 li:nth-child(2),
    &.progress-4 li:nth-child(2),
    &.progress-5 li:nth-child(2) {
      color: #fff;
    }

    &.progress-3 li:nth-child(3),
    &.progress-4 li:nth-child(3),
    &.progress-5 li:nth-child(3) {
      color: #fff;
    }

    &.progress-4 li:nth-child(4),
    &.progress-5 li:nth-child(4) {
      color: #fff;
    }
  }
  // 商品列表
  .goods-list {
    /deep/table {
      table-layout: auto;
    }
    .order-price {
      padding: 8px 20px;
      text-align: right;
    }
  }
  // 操作栏
  .actions {
    .action-item {
      float: left;
      margin-right: 8px;
    }
  }
}
</style>
