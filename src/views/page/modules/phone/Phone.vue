<template>
  <div class="phone-content">
    <!-- 顶部导航栏 -->
    <div
      class="phone-top optional"
      :class="{ selected: 'page' === selectedIndex, [data.page.style.titleTextColor]: true }"
      :style="{ backgroundColor: data.page.style.titleBackgroundColor }"
      @click="handelClickItem('page')"
    >
      <p
        class="title"
        :style="{ color: data.page.style.titleTextColor }"
      >{{ data.page.params.title }}</p>
    </div>
    <!-- 内容区域 -->
    <div class="phone-main">
      <draggable
        :list="data.items"
        class="content"
        @update="handelDragItem"
        v-bind="{ animation: 120, filter: '.undrag' }"
      >
        <!-- 内容元素 -->
        <div
          class="devise-item optional"
          v-for="(item, index) in data.items"
          :key="index"
          @click="handelClickItem(index)"
          :class="{ selected: index === selectedIndex, undrag: inArray(item.type, undragList) }"
          :style="renderItemStyle(item)"
        >
          <!-- 图片轮播 -->
          <div v-if="item.type == 'banner'" class="diy-banner">
            <img
              v-for="(dataItem, dataIdx) in item.data"
              :key="`${index}_${dataIdx}_img`"
              v-show="dataIdx <= 1"
              :src="dataItem.imgUrl"
            />
            <div class="dots" :class="item.style.btnShape">
              <div
                v-for="(dataItem, dataIdx) in item.data"
                :key="`${index}_${dataIdx}_dots`"
                :style="{ background: item.style.btnColor }"
                class="dots-item"
              ></div>
            </div>
          </div>

          <!-- 图片组 -->
          <div
            v-else-if="item.type == 'image'"
            class="diy-image"
            :style="{ paddingBottom: item.style.paddingTop + 'px', background: item.style.background}"
          >
            <div
              class="item-image"
              v-for="(dataItm, dataIdx) in item.data"
              :key="`${index}_${dataIdx}`"
              :style="{ padding: `${item.style.paddingTop}px ${item.style.paddingLeft}px 0` }"
            >
              <img :src="dataItm.imgUrl" />
            </div>
          </div>

          <!-- 图片橱窗 -->
          <div
            v-else-if="item.type == 'window'"
            class="diy-window"
            :style="{ background: item.style.background, padding: `${item.style.paddingTop}px ${item.style.paddingLeft}px` }"
          >
            <ul
              v-if="item.style.layout > -1"
              class="data-list clearfix"
              :class="`avg-sm-${item.style.layout}`"
            >
              <li
                v-for="(window, dataIdx) in item.data"
                :key="`${index}_${dataIdx}`"
                class="data-item"
                :style="{ padding: `${item.style.paddingTop}px ${item.style.paddingLeft}px` }"
              >
                <div class="item-image">
                  <img :src="window.imgUrl" />
                </div>
              </li>
            </ul>
            <div class="display" v-else>
              <div
                class="display-left"
                :style="{ padding: `${item.style.paddingTop}px ${item.style.paddingLeft}px` }"
              >
                <img :src="item.data[0].imgUrl" />
              </div>
              <div class="display-right">
                <div
                  v-if="item.data.length >= 2"
                  class="display-right1"
                  :style="{ padding: `${item.style.paddingTop}px ${item.style.paddingLeft}px` }"
                >
                  <img :src="item.data[1].imgUrl" />
                </div>
                <div class="display-right2">
                  <div
                    v-if="item.data.length >= 3"
                    class="left"
                    :style="{ padding: `${item.style.paddingTop}px ${item.style.paddingLeft}px` }"
                  >
                    <img :src="item.data[2].imgUrl" />
                  </div>
                  <div
                    v-if="item.data.length >= 4"
                    class="right"
                    :style="{ padding: `${item.style.paddingTop}px ${item.style.paddingLeft}px` }"
                  >
                    <img :src="item.data[3].imgUrl" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 视频组 -->
          <div
            v-else-if="item.type == 'video'"
            class="diy-video"
            :style="{ padding: `${item.style.paddingTop}px 0` }"
          >
            <video
              :style="{ height: `${item.style.height}px` }"
              :src="item.params.videoUrl"
              :poster="item.params.poster"
              controls
            >您的浏览器不支持 video 标签</video>
          </div>

          <!-- 文章组 -->
          <div v-else-if="item.type == 'article'" class="diy-article">
            <div class="diy-article">
              <div
                class="article-item"
                v-for="(dataItm, dataIdx) in (item.params.source == 'choice' ? item.data : item.defaultData)"
                :key="`${index}_${dataIdx}`"
                :class="`show-type__${dataItm.show_type}`"
              >
                <!-- 小图模式 -->
                <template v-if="dataItm.show_type == 10">
                  <div class="article-item__left flex-box">
                    <div class="article-item__title twolist-hidden">
                      <span class="article-title">{{ dataItm.title }}</span>
                    </div>
                    <div class="article-item__footer">
                      <span class="article-views">{{ dataItm.views_num }}次浏览</span>
                    </div>
                  </div>
                  <div class="article-item__image">
                    <img :src="dataItm.image" alt />
                  </div>
                </template>
                <!-- 大图模式 -->
                <template v-if="dataItm.show_type == 20">
                  <div class="article-item__title">
                    <span class="article-title">{{ dataItm.title }}</span>
                  </div>
                  <div class="article-item__image">
                    <img :src="dataItm.image" />
                  </div>
                  <div class="article-item__footer">
                    <span class="article-views">{{ dataItm.views_num }}次浏览</span>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- 搜索栏 -->
          <div v-else-if="item.type == 'search'" class="diy-search">
            <div class="inner" :class="item.style.searchStyle">
              <div class="search-input" :style="{ textAlign: item.style.textAlign }">
                <a-icon class="search-icon" :component="Icon.search" />
                <span>{{ item.params.placeholder }}</span>
              </div>
            </div>
          </div>

          <!-- 店铺公告 -->
          <div
            v-else-if="item.type == 'notice'"
            class="diy-notice"
            :style="{ padding: `${item.style.paddingTop}px 0` }"
          >
            <div
              class="notice-body"
              :style="{ background: item.style.background, color: item.style.textColor }"
            >
              <div class="notice__icon">
                <a-icon class="notice-icon" :component="Icon.volumeFill" />
              </div>
              <div class="notice__text flex-box oneline-hide">
                <span>{{ item.params.text }}</span>
              </div>
            </div>
          </div>

          <!-- 导航组 -->
          <div
            v-else-if="item.type == 'navBar'"
            class="diy-navBar"
            :style="{ padding: `${item.style.paddingTop}px 0`, background: item.style.background, color: item.style.textColor }"
          >
            <ul class="data-list clearfix" :class="`avg-sm-${item.style.rowsNum}`">
              <li
                class="item-nav"
                v-for="(dataItm, dataIdx) in item.data"
                :key="`${index}_${dataIdx}`"
              >
                <div class="item-image">
                  <img :src="dataItm.imgUrl" />
                </div>
                <p class="item-text oneline-hide">{{ dataItm.text }}</p>
              </li>
            </ul>
          </div>

          <!-- 优惠券 -->
          <div
            v-else-if="item.type == 'voucher'"
            class="diy-voucher"
            :style="{ padding: `5px 1vw`, background: item.style.background }"
          >
            <Voucher :data="item.data" :itemStyle="item.style" />
          </div>

          <!-- 商品组 -->
          <div
            v-else-if="item.type == 'goods'"
            class="diy-goods"
            :style="{ background: item.style.background }"
          >
            <ul
              class="goods-list clearfix"
              :class="['display__' + item.style.display, 'column__' + item.style.column]"
            >
              <li
                class="goods-item"
                v-for="(dataItm, dataIdx) in (item.params.source == 'choice' ? item.data : item.defaultData)"
                :key="`${index}_${dataIdx}`"
              >
                <!-- 单列商品 -->
                <template v-if="item.style.column == 1">
                  <div class="flex">
                    <!-- 商品图片 -->
                    <div class="goods-item_left">
                      <img :src="dataItm.image" />
                    </div>
                    <div class="goods-item_right">
                      <!-- 商品名称 -->
                      <div
                        v-if="item.style.show.includes('title')"
                        class="goods-item_title twolist-hidden"
                      >
                        <span>{{ dataItm.title }}</span>
                      </div>
                      <div class="goods-item_desc">
                        <!-- 商品卖点 -->
                        <div
                          v-if="item.style.show.includes('highlight')"
                          class="desc-selling_point oneline-hide"
                        >
                          <span>{{ dataItm.highlight }}</span>
                        </div>
                        <!-- 商品销量 -->
                        <div
                          v-if="item.style.show.includes('sold_total')"
                          class="desc-goods_sales oneline-hide"
                        >
                          <span>已售{{ dataItm.sold_total }}件</span>
                        </div>
                        <!-- 商品价格 -->
                        <div class="desc_footer">
                          <span v-if="item.style.show.includes('price')" class="price_x">
                            <span class="small-unit">¥</span>
                            <span>{{ dataItm.price_lowest }}</span>
                          </span>
                          <span
                            class="price_y"
                            v-if="item.style.show.includes('retail_price') && dataItm.retail_price > 0"
                          >¥{{ dataItm.retail_price }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <!-- 两列三列 -->
                <template v-else>
                  <div class="goods-image">
                    <img :src="dataItm.image" />
                  </div>
                  <div class="detail">
                    <p
                      v-if="item.style.show.includes('title')"
                      class="goods-name twolist-hidden"
                    >{{ dataItm.title }}</p>
                    <p class="detail-price">
                      <span v-if="item.style.show.includes('price')" class="goods-price">
                        <span class="small-unit">¥</span>
                        <span>{{ dataItm.price_lowest }}</span>
                      </span>
                      <span
                        v-if="item.style.show.includes('retail_price') && dataItm.retail_price > 0"
                        class="line-price"
                      >
                        <span class="small-unit">¥</span>
                        <span>{{ dataItm.retail_price }}</span>
                      </span>
                    </p>
                  </div>
                </template>
              </li>
            </ul>
          </div>

          <!-- 限时抢购 -->
          <div
            v-else-if="item.type == 'timeLimited'"
            class="diy-goods"
            :style="{ background: item.style.background }"
          >
            <a-tabs>
              <a-tab-pane v-for="(dataList,date) in item.data" :key="date" :tab="date">
                <ul
                  class="goods-list clearfix"
                  :class="['display__' + item.style.display, 'column__' + item.style.column]"
                >
                  <li
                    class="goods-item"
                    v-for="(dataItm, dataIdx) in dataList"
                    :key="`${index}_${dataIdx}`"
                  >
                    <!-- 单列商品 -->
                    <template v-if="item.style.column == 1">
                      <div class="flex">
                        <!-- 商品图片 -->
                        <div class="goods-item_left">
                          <img :src="dataItm.image" />
                        </div>
                        <div class="goods-item_right">
                          <!-- 商品名称 -->
                          <div
                            v-if="item.style.show.includes('title')"
                            class="goods-item_title twolist-hidden"
                          >
                            <span>{{ dataItm.title }}</span>
                          </div>
                          <div class="goods-item_desc">
                            <!-- 商品卖点 -->
                            <div
                              v-if="item.style.show.includes('highlight')"
                              class="desc-selling_point oneline-hide"
                            >
                              <span>{{ dataItm.highlight }}</span>
                            </div>
                            <!-- 商品销量 -->
                            <div
                              v-if="item.style.show.includes('sold_total')"
                              class="desc-goods_sales oneline-hide"
                            >
                              <span>已售{{ dataItm.sold_total }}件</span>
                            </div>
                            <!-- 商品价格 -->
                            <div class="desc_footer">
                              <span v-if="item.style.show.includes('price')" class="price_x">
                                <span class="small-unit">¥</span>
                                <span>{{ dataItm.price_lowest }}</span>
                              </span>
                              <span
                                class="price_y"
                                v-if="item.style.show.includes('retail_price') && dataItm.retail_price > 0"
                              >¥{{ dataItm.retail_price }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                    <!-- 两列三列 -->
                    <template v-else>
                      <div class="goods-image">
                        <img :src="dataItm.image" />
                      </div>
                      <div class="detail">
                        <p
                          v-if="item.style.show.includes('title')"
                          class="goods-name twolist-hidden"
                        >{{ dataItm.title }}</p>
                        <p class="detail-price">
                          <span v-if="item.style.show.includes('price')" class="goods-price">
                            <span class="small-unit">¥</span>
                            <span>{{ dataItm.price_lowest }}</span>
                          </span>
                          <span
                            v-if="item.style.show.includes('retail_price') && dataItm.retail_price > 0"
                            class="line-price"
                          >
                            <span class="small-unit">¥</span>
                            <span>{{ dataItm.retail_price }}</span>
                          </span>
                        </p>
                      </div>
                    </template>
                  </li>
                </ul>
              </a-tab-pane>
            </a-tabs>
          </div>

          <!-- 商品预览 -->
          <div
            v-else-if="item.type == 'goodsPreview'"
            class="diy-goods-preview"
            :style="{ background: item.style.background }"
          >
            <div class="preview-title" :style="{backgroundImage: item.style.titleBackgroundGradient ? `linear-gradient(to bottom, ${item.style.titleBackground}, ${item.style.background})` : item.style.titleBackground}">
              <div>
                <img v-if="item.params.titleImage" :src="item.params.titleImage" />
                <h3 v-else :style="{color: item.style.titleColor}">{{ item.params.title }}</h3>
              </div>
              <span v-if="item.params.moreText">{{ item.params.moreText }} ></span>
            </div>
            <ul class="goods-list clearfix">
              <li class="goods-item" v-for="(dataItm, dataIdx) in item.data" :key="`${index}_${dataIdx}`">
                <div class="goods-image">
                  <img :src="dataItm.image" />
                </div>
                <div class="detail">
                  <p
                    v-if="item.style.show.includes('title')"
                    class="goods-name twolist-hidden"
                  >{{ dataItm.title }}</p>
                  <p v-if="item.style.show.includes('price')" class="goods-price">
                    <span class="small-unit">¥</span>
                    <span>{{ dataItm.price_lowest }}</span>
                  </p>
                  <p
                    v-if="item.style.show.includes('retail_price') && dataItm.retail_price > 0"
                    class="retail-price"
                  >
                    <span class="small-unit">¥</span>
                    <span>{{ dataItm.retail_price }}</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <!-- 辅助空白 -->
          <div
            v-else-if="item.type == 'blank'"
            class="diy-blank"
            :style="{ height: `${item.style.height}px` , background: item.style.background }"
          ></div>

          <!-- 辅助线 -->
          <div
            v-else-if="item.type == 'guide'"
            class="diy-guide"
            :style="{ padding: `${item.style.paddingTop}px 0`, background: item.style.background }"
          >
            <p
              class="line"
              :style="{
                borderTopWidth: item.style.lineHeight + 'px',
                borderTopColor: item.style.lineColor,
                borderTopStyle: item.style.lineStyle
              }"
            ></p>
          </div>

          <!-- 在线客服 -->
          <div
            v-else-if="item.type == 'service'"
            class="diy-service"
            :style="{ opacity: item.style.opacity / 100 }"
          >
            <div class="service-icon">
              <img :src="item.params.image" alt />
            </div>
          </div>

          <!-- 富文本 -->
          <div
            v-else-if="item.type == 'richText'"
            class="diy-richText"
            :style="{ background: item.style.background, padding: `${item.style.paddingTop}px ${item.style.paddingLeft}px` }"
            v-html="item.params.content"
          ></div>

          <!-- 一级分类导航 -->
          <div
            v-else-if="item.type == 'categoryNav'"
            class="diy-category-nav"
            :style="{ background: item.style.backgroundColor || '#fff', padding: `${item.style.paddingTop || 0}px 0 ${item.style.paddingBottom || 0}px` }"
          >
            <div class="category-nav-preview">
              <div class="nav-scroll">
                <div class="nav-item" v-for="i in 5" :key="i">
                  <div class="nav-icon"></div>
                  <div class="nav-text">分类{{ i }}</div>
                </div>
              </div>
              <div v-if="item.params.showExpandButton !== false" class="nav-expand-btn">
                <span>展</span>
                <span>开</span>
              </div>
            </div>
          </div>

          <!-- 二级分类导航 -->
          <div
            v-else-if="item.type == 'categorySubNav'"
            class="diy-category-subnav"
            :style="{ 
              background: item.style.backgroundColor || '#f5f5f5', 
              width: (item.style.width || 160) + 'px',
              padding: `${item.style.paddingTop || 0}px 0 ${item.style.paddingBottom || 0}px`,
              minHeight: '200px'
            }"
          >
            <div class="subnav-preview">
              <div class="subnav-item" v-for="i in 6" :key="i" :class="{ active: i === 1 }">
                <div class="subnav-dot"></div>
                <div class="subnav-text">子分类{{ i }}</div>
              </div>
            </div>
          </div>

          <!-- 分类商品列表 -->
          <div
            v-else-if="item.type == 'categoryProductList'"
            class="diy-category-product-list"
            :style="{ 
              background: item.style.backgroundColor || '#fff',
              padding: `${item.style.paddingTop || 0}px ${item.style.paddingLeft || 0}px ${item.style.paddingBottom || 0}px ${item.style.paddingRight || 0}px`
            }"
          >
            <!-- 筛选器和排序条 -->
            <div v-if="item.params.showFilter || item.params.showSort" class="filter-bar-preview">
              <div v-if="item.params.showFilter" class="filter-item-preview">
                <span>全部</span>
                <span class="arrow">▼</span>
              </div>
              <div v-if="item.params.showSort" class="sort-bar-preview">
                <span class="sort-item" :class="{ active: true }">默认</span>
                <span class="sort-item">价格</span>
                <span class="sort-item">销量</span>
              </div>
            </div>
            <!-- 广告位 -->
            <div v-if="item.params.showAd && item.params.adImage" class="ad-preview">
              <img :src="item.params.adImage" alt="广告" />
            </div>
            <!-- 商品列表 -->
            <div class="goods-list-preview" :class="['display__' + (item.style.display || 'list'), 'column__' + (item.style.column || 2)]">
              <div 
                class="goods-item-preview" 
                v-for="i in (item.style.column == 1 ? 3 : (item.style.column == 2 ? 4 : 6))" 
                :key="i"
              >
                <div class="goods-image-preview">
                  <div class="placeholder-img"></div>
                </div>
                <div class="goods-detail-preview">
                  <div v-if="item.style.show && item.style.show.includes('title')" class="goods-title-preview">
                    商品名称示例文字
                  </div>
                  <div class="goods-price-preview" :style="{ color: item.style.priceColor || '#289a2d' }">
                    <span class="price-unit">¥</span>
                    <span>99.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 删除操作 -->
          <div class="btn-edit-del">
            <div class="btn-del" @click="handleDeleleItem(index)">删除</div>
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import draggable from 'vuedraggable'
import { inArray } from '@/utils/util'
import * as Icon from './icon'
import Voucher from './modules/Voucher'

// 禁止拖拽的组件
const undragList = ['service']

export default {
  props: {
    // 页面数据
    data: PropTypes.object.def({}),
    // 当前选中的元素索引
    selectedIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(0)
  },
  components: {
    draggable,
    Voucher,
  },
  data () {
    return {
      // 禁止拖拽的组件
      undragList
    }
  },
  beforeCreate () {
    this.Icon = Icon
    this.inArray = inArray
  },
  methods: {

    /**
     * 拖动diy元素更新当前索引
     * @param e
     */
    handelDragItem (e) {
      this.$emit('onEditer', e.newIndex)
    },

    /**
     * 点击当前选中的Diy元素
     * @param index
     */
    handelClickItem (index) {
      this.$emit('onEditer', index)
    },

    /**
     * 删除当前选中的Diy元素
     * @param index
     */
    handleDeleleItem (index) {
      this.$emit('onDeleleItem', index)
    },

    // 渲染组件外层容器的样式
    renderItemStyle (item) {
      if (item.type === 'service') {
        return {
          position: 'absolute',
          right: item.style.right + '%',
          bottom: item.style.bottom + '%'
        }
      }
      return {}
    }

  }
}
</script>
<style lang="less" scoped>
@import './style.less';
</style>
