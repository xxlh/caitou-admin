<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row>
        <a-col :span="5">
          <a-button v-action:create type="primary" icon="plus" @click="handleAdd">新增</a-button>
        </a-col>
        <a-col class="flex flex-x-end" :span="11" :offset="8">
          <SelectRegion
            placeholder="请选择省市区"
            v-model="cascader"
            @change="onCascaderChange"
          />
        </a-col>
      </a-row>
    </div>
        <a-layout>
          <a-layout-sider mode="inline" :inline-collapsed="true" :collapsed="true" >
            <a-menu
              v-model="selectedKeys"
              @click="switchArea"
            >
              <a-menu-item v-for="area in areasById" :key="area.id">
                <a-icon type="environment" /> {{area.name}}
                <span>- {{area.city}} {{area.district}}</span>
              </a-menu-item>
            </a-menu>
          </a-layout-sider>
          <a-layout class="area-edit">
            <div id="map" :style="{height:'500px'}"></div>
            <a-card class="floating-controller" :bodyStyle="{display: 'flex', flexDirection: 'column'}">
              <a-button type='default' @click="handleEdit">区域信息</a-button>
              <a-button type='primary' @click="saveArea">保存路径</a-button>
              <div class="plain-button" size="large">
                <a-button type='default' icon="plus" @click="createPath"></a-button>
                <a-button type='danger' ghost icon="delete" @click="removePath"></a-button>
              </div>
            </a-card>
          </a-layout>
        </a-layout>
    <AddForm ref="AddForm" @handleSubmit="initData" />
    <EditForm ref="EditForm" @handleSubmit="initData" />
  </a-card>
</template>

<script>
import * as Api from '@/api/area'
import { STable } from '@/components'
import { AddForm, EditForm } from './modules'
import { SelectRegion } from '@/components'
import AMapLoader from "@amap/amap-jsapi-loader";
import _ from 'lodash'

export default {
  name: 'Index',
  components: {
    STable,
    AddForm,
    EditForm,
    SelectRegion,
  },
  data () {
    return {
      areasById: [],
      selectedKeys: [],
      // 查询参数
      queryParam: {per_page: 100},
      cascader: [],
      // 正在加载
      isLoading: false,
      // 地图
      Amap: null,
      map: {},
      polyEditor: null,
      polygons: [],
      // 表头
      columns: [
        {
          title: '所属区域ID',
          dataIndex: 'delivery_area_id'
        },
        {
          title: '仓储名',
          dataIndex: 'name'
        },
        {
          title: '联系人姓名',
          dataIndex: 'contact_name'
        },
        {
          title: '联系电话',
          dataIndex: 'contact_phone'
        },
        {
          title: '详细地址',
          dataIndex: 'full_address',
          scopedSlots: { customRender: 'full_address' }
        },
        {
          title: '评分',
          dataIndex: 'rating'
        },
        {
          title: '添加时间',
          dataIndex: 'created_at'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '180px',
          scopedSlots: { customRender: 'action' }
        }
      ],
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
      plugins: ['AMap.PolygonEditor'] //插件列表
    })
      // 初始化地图区域
    this.map = new this.AMap.Map("map", {
      // zoom: 16.8
    })
    this.polyEditor = new AMap.PolygonEditor(this.map);
    this.polyEditor.on('add', data => {
      let polygon = data.target;
      this.polygons.push(polygon);
      this.polyEditor.addAdsorbPolygons(polygon);
      polygon.on('dblclick', () => {
        this.polyEditor.setTarget(polygon);
        this.polyEditor.open();
      })
    });

    // 加载数据到地图
    await this.initData()
  },
  methods: {
    // 加载数据方法 必须为 Promise 对象
    async initData () {
      let res = await  Api.list(this.queryParam)
        .then(response => {
          return response
        })
      this.areasById = _(res.data).keyBy('id').value()
      if (res.data.length) {
        const currentAreaId = this.selectedKeys[0];
        let defaultSelectedArea = this.areasById[currentAreaId] || res.data[0];
        this.selectedKeys = [defaultSelectedArea.id]
        this.loadPaths(defaultSelectedArea.paths);
      } else {
        this.map.clearMap();
        this.polyEditor.close();
      }
    },
    /**
     * 新增记录
     */
    handleAdd () {
      this.$refs.AddForm.add()
    },

    /**
     * 编辑记录
     */
    handleEdit () {
      const areaId = this.selectedKeys[0];
      if (!areaId) {this.$message.error('当前未选中区域'); return;}
      this.$refs.EditForm.edit(this.areasById[areaId])
    },
    saveArea () {
      const areaId = this.selectedKeys[0];
      if (!areaId) {this.$message.error('当前未选中区域'); return;}
      this.polyEditor?.close?.();
      let paths = this.polygons.map(polygon => polygon.getPath()).filter(p => p.length);
      
      Api.edit(areaId, {paths}).then(res => {
        this.areasById[areaId].paths = paths;
        this.$message.success('更新成功', 1.5);
      }).catch(e => {
        this.$message.error(e.msg, 3);
      })
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
          return Api.deleted(item.id)
            .then((result) => {
              app.$this.$message.success('已删除', 1.5)
              app.handleRefresh()
            })
            .finally(result => {
              modal.destroy()
            })
        }
      })
    },
    
    onCascaderChange(value) {
      const [province, city, district] = value
      this.queryParam = {...this.queryParam, province, city, district}
      this.initData()
    },

    /**
     * 区域切换
     */
    switchArea (menu) {
      this.loadPaths(this.areasById[menu.key].paths, this.areasById[menu.key].district || this.areasById[menu.key].city || this.areasById[menu.key].province)
    },

    /**
     * 路径编辑
     */
    loadPaths (paths, city) {
      if (!this.map) {this.$message.error('map还未完全加载，请刷新重试！'); return;}
      this.map.clearMap();
      this.polyEditor.close();
      if (!paths || !paths.length) {
        this.$message.error('暂无路径数据！');
        this.map.setCity(city);
        return;
      }

      // 加载区域路径绘制
      this.polygons = paths.map(path => new AMap.Polygon({path}));  // 需要每个坐标值为number，string会造成无法点击（已在后端存储时做处理）
      this.map.add(this.polygons);
      this.map.setFitView();
      
      // 编辑路径
      this.polyEditor.addAdsorbPolygons(this.polygons);
      this.polygons.forEach(polygon => polygon.on('dblclick', () => {
        this.polyEditor.setTarget(polygon);
        this.polyEditor.open();
      }));
      this.polyEditor.setTarget(this.polygons[0]);
      this.polyEditor.open();
    },
    createPath () {
      this.polyEditor.close();
      this.polyEditor.setTarget();
      this.polyEditor.open();
    },
    removePath () {
      let polygon = this.polyEditor.getTarget();
      this.map.remove(polygon);
      this.polyEditor.close();
      this.polygons = this.polygons.filter(p => p != polygon);
    },
  }
}
</script>

<style lang="less" scoped>
.area-edit {
  position: relative;

  .floating-controller {
    position: absolute;
    top: 30px;
    right: 30px;
    display: flex;
    flex-direction: column;

    button {
      margin: 5px 0;
    }

    .plain-button {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  }
}
</style>