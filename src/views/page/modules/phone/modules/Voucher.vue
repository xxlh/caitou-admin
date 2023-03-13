<template>
  <div class="voucher" :style="{'--background': itemStyle.background, '--price-color': itemStyle.priceColor, '--card-background': itemStyle.cardBackground}">
    <div class="discount" :style="{color: itemStyle.priceColor}">
      <div class="ticket" v-if="voucher.save_amount">
        <div class="unit">￥</div>
        <div class="num">{{parseFloat(voucher.save_amount)}}</div>
      </div>
      <div class="ticket" v-else-if="voucher&&(1-voucher.off_percent)*10">
        <div class="num">{{voucher&&(1-voucher.off_percent)*10}}</div>
        <div class="unit">折</div>
      </div>
    </div>
    <div class="content">
      <div class="detail">
        <div class="title">{{voucher.title}}</div>
        <div class="description">{{ voucher.description }}</div>
      </div>
      <div class="button" v-if="!isGained">立即领取</div>
      <div class="button gained" v-else>已领取</div>
      <div class="gap-top"></div>
      <div class="gap-bottom"></div>
    </div>
  </div>
</template>

<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { axios } from '@/utils/request'

// 图片选择器组件
export default {
  name: 'Voucher',
  components: {
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 选中的链接
    value: PropTypes.object.def({}),
    data: PropTypes.object.def({}),
    itemStyle: PropTypes.object.def({}),
  },
  data () {
    return {
      // 已选择的链接
      voucher: this.data,
      isGained: false,
    }
  },
  async created () {
    if (!this.data.id) return
    this.voucher = await axios.get('vouchers/templates/' + this.data.id)
    this.isGained = this.voucher.is_gain
  },
  methods: {
    async gain(id) {
      if (!id) return
      try {
        const res = await post('vouchers', {template_id: id})
        this.isGained = true
      } catch (error) {
        uni.showToast({title:error.msg, icon:'error'})
      }
    }
  }
}
</script>

<style lang="less" scoped>
.voucher{
  flex-wrap: nowrap;
  display: flex;
  overflow: hidden;
  .discount {
    display: flex;
    flex-shrink: 0;
    width: 28%;
    color: #fff;
    background: linear-gradient(to right,#eee1ce,var(--card-background));
    justify-content: center;
    .ticket,.criteria{width: 100%;}
    .ticket {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fc665b;
      .num{
        font-size: 42px;
        font-weight: 600;
      }
      .unit{
        font-size: 24px;
      }
    }
  }
  .content{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    position: relative;
    padding: 3px 4%;
    .detail {
      display: flex;
      flex-direction: column;
      .title{
        width: 90%;
        font-size: 16px;
        line-height: 32px;
        color: #333;
        white-space: nowrap;
      }
      .description {
        font-size: 12px;
      }
    }
    .gap-top, .gap-bottom{
      position: absolute;
      width: 12px;
      height: 12px;
      left: -6px;
      border-radius: 100%;
      background-color: var(--background);
    }
    .gap-top{
      top: -6px;
    }
    .gap-bottom{
      bottom: -6px;
    }
    .discount-left .gap-top, .discount-left .gap-bottom {
      left: auto;
      right: -6px;
    }
    .button {
      height: 28px;
      line-height: 26px;
      padding: 0 10px;
      font-size: 12px;
      border: 1px solid var(--price-color);
      border-radius: 28px;
      background-color: var(--price-color);
      color: #fff;
      &.gained {
        color: var(--price-color);
        background-color: transparent;
      }
    }
  }
}
</style>
