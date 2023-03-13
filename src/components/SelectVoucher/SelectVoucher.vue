<template>
  <div class="select-vouchers">
    <div class="data-preview clearfix">
        <div v-for="(item, index) in selectedItems" :key="index" class="data-item">
          <a-icon
            class="icon-close"
            theme="filled"
            type="close-circle"
            @click="handleDeleteItem(index)"
          />
          <a-tooltip>
            <template slot="title">
              <span class="f-12">{{ item.description }}</span>
            </template>
              <a-tag :color="item.type == 'disoucnt' ? 'yellow' : 'orange'">{{ item.type_name }}</a-tag>
              <span>{{ item.title }}</span>
          </a-tooltip>
        </div>
    </div>
    <div class="data-add">
      <a-button icon="plus" @click="handleSelectVouchers()">选择优惠券</a-button>
    </div>
    <VoucherModal
      ref="VoucherModal"
      :multiple="multiple"
      :maxNum="maxNum"
      :defaultList="selectedItems"
      :params="params"
      @handleSubmit="handleSelectVouchersSubmit"
    />
  </div>
</template>

<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import cloneDeep from 'lodash.clonedeep'
import draggable from 'vuedraggable'
import { pick } from 'lodash'
import { VoucherModal } from '@/components/Modal'

// 图片选择器组件
export default {
  name: 'SelectVoucher',
  components: {
    VoucherModal,
    draggable
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 最大选择的数量限制, multiple模式下有效
    multiple: PropTypes.bool.def(true),
    maxNum: PropTypes.integer.def(100),
    // 默认选中的优惠券
    defaultList: PropTypes.array.def([]),
    // 选中的优惠券ID
    value: null,
    // 参数
    params: [],
  },
  data () {
    return {
      // 已选择的优惠券列表
      selectedItems: []
    }
  },
  watch: {
    // 设置默认数据
    defaultList: {
      // 首次加载的时候执行函数
      immediate: true,
      handler (val) {
        const { selectedItems } = this
        console.log(val, selectedItems);
        if (val.length && !selectedItems.length) {
          this.onUpdate(val)
        }
      }
    }
  },
  created () {
  },
  methods: {

    // 更新已选择的数据 selectedItems
    onUpdate (selectedItems) {
      console.log(selectedItems);
      if (this.multiple || !selectedItems.length) {
        // 多选模式
        this.selectedItems = selectedItems
      } else {
        // 单选模式
        const single = selectedItems[selectedItems.length - 1]
        this.selectedItems = [single]
      }
      this.onChange()
    },

    // 打开优惠券选择器
    handleSelectVouchers () {
      this.$refs.VoucherModal.handle()
    },

    // 优惠券库modal确认回调
    handleSelectVouchersSubmit (result) {
      const { selectedItems } = result
      this.onUpdate(selectedItems)
    },

    // 删除优惠券
    handleDeleteItem (index) {
      const { selectedItems } = this
      selectedItems.splice(index, 1)
      this.onUpdate(selectedItems)
    },

    // 触发change事件
    onChange () {
      const { selectedItems, multiple } = this
      const sIds = multiple ? selectedItems.map(item => item.id) : (selectedItems.length ? selectedItems[0].id : undefined)
      return this.$emit('change', sIds)
    }

  }
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';
.select-vouchers {
  display: flex;
}
.data-preview {
  display: flex;
  flex-direction: column;
  .data-item {
    margin: 10px;
    background: #f7fafc;
    position: relative;
    border-radius: 3px;
    cursor: move;
    &:hover {
      .icon-close {
        display: block;
      }
    }
  }
  .icon-close {
    display: none;
    position: absolute;
    top: -8px;
    right: -8px;
    cursor: pointer;
    font-size: 16px;
    color: #c5c5c5;
    &:hover {
      color: #7d7d7d;
    }
  }
  .item-inner {
    padding: 10px;
    background: #f7fafc;
  }
}

// 新增数据
.data-add {
  margin-top: 10px;

  button {
    width: 100%;
    color: @primary-color;
    height: 40px;
    border-radius: 5px;
    font-size: 12px;
    border-color: #cccccc21;

    &:hover {
      border-color: @primary-color;
    }
  }
}
</style>
