<template>
  <a-modal :visible="value" title="请点击地图选择对应位置" @ok="handleOk" @cancel="handleCancel" :forceRender="true" wrap-class-name="full-modal" width="100%">
    <div id="map"></div>
  </a-modal>
</template>

<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import AMapLoader from "@amap/amap-jsapi-loader";
import { message } from 'ant-design-vue';

// 省市区级联选择器组件
export default {
  name: 'SelectMapPoint',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // v-model 指定选中项
    value: PropTypes.bool.def(),
    lng: PropTypes.any.def(),
    lat: PropTypes.any.def(),
  },
  data () {
    return {
      AMap: null,
      map: {},
      marker: null,
      city: null,
      longitude: null,
      latitude: null,
      address: null,
    }
  },
  async created () {
    // 获取地区数据
    window._AMapSecurityConfig= {
      securityJsCode:'cc376bf07ec7a861cbfada9c7de5b86f',
    }
    this.AMap = await AMapLoader.load({
      key: "8eed729112431178d5b9adaff42b33c1", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.Geocoder'] //插件列表
    })
    // this.$nextTick(() => {
      this.map = new this.AMap.Map("map", {
        // zoom: 16.8
      })
      if (this.city) this.map.setCity(this.city)
      this.map.on('click', e => {
        if (this.marker) this.map.remove(this.marker)
        this.longitude = e.lnglat.getLng()
        this.latitude = e.lnglat.getLat()
        this.marker = new this.AMap.Marker({
          position: new this.AMap.LngLat(this.longitude, this.latitude),
        })
        this.map.add(this.marker);
      })
      if (this.lng && this.lat) {
        if (this.marker) this.map.remove(this.marker)
        this.marker = new this.AMap.Marker({
          position: new this.AMap.LngLat(this.lng, this.lat),
        })
        this.map.add(this.marker);
      }
    // })
  },
  // destroyed () {
  //   console.log(this.marker);
  //   this.map.remove(this.marker)
  //   this.marker = null
  // },
  methods: {
    // 触发change事件
    onOpen (data) {
      if (!map) return;
      this.city = data.city || this.city
      this.lng = data.lng || this.lng
      this.lat = data.lat || this.lat
      if (this.city) this.map.setCity(this.city)
      if (this.lng && this.lat) {
        if (this.marker) this.map.remove(this.marker)
        this.marker = new this.AMap.Marker({
          position: new this.AMap.LngLat(this.lng, this.lat),
        })
        this.map.add(this.marker);
      } else {
        if (this.marker) this.map.remove(this.marker)
      }
    },
    handleOk (e) {
      if (!this.longitude || !this.latitude) {
        message.error('请先点击地图选择点', 3)
        return false
      }
      if (!this.AMap) message.error('地图尚未初始化，请稍后或刷新重试', 3)
      var geocoder = new this.AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        // city: '010'
      })
      geocoder.getAddress([this.longitude, this.latitude], (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          // result为对应的地理位置详细信息
          let addrC = result?.regeocode?.addressComponent
          this.address = addrC.township + addrC.street + addrC.streetNumber
          if (!this.address) this.address = result?.regeocode?.formattedAddress
        }
        this.$emit('change', false)
        this.$emit('complete', {
          lng: this.longitude,
          lat: this.latitude,
          address: this.address,
        })
      })
    },
    handleCancel (e) {
      this.$emit('change', false)
    },
  }
}
</script>

<style lang="less" scoped>
#map {
  height: 500px;
}

.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
