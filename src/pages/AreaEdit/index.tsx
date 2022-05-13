import { DeleteOutlined, EditOutlined, EnvironmentOutlined, PieChartOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Card, Cascader, Space, Menu, Layout } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import cityData from "./city";
import { request } from 'umi';
import AddArea from './add-area';
import _ from 'lodash';

// 高德地图密钥
window._AMapSecurityConfig = {
  securityJsCode:'cc376bf07ec7a861cbfada9c7de5b86f',
}
import AMapLoader from "@amap/amap-jsapi-loader";
let map = null;
let polyEditor = null;
let polygons = [];

const TableList: React.FC = () => {
  const [areasById, setAreasById] = useState<Record<string, AreaType>>({});
  const [currentAreaId, setCurrentAreaId] = useState<number>();
  // const [polygons, setPolygons] = useState<[]>([]);  // state在useEffect(fun, [])中绑定的事件延迟执行时 取不到最新值 https://zhuanlan.zhihu.com/p/84697185
  const [province, setProvince] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<Array<string>>([]);
  const cityChange = async (values:Array<string>, options:Array<any>) => {
    // setProvince(options[0]?.label);
    // setCity(options[1]?.label);
    // setDistrict(options[2]?.label);
    let res = await request<{data:AreaType[]}>(`/admin/areas`, {method: 'GET', params:{
      province: options[0]?.label,
      city: options[1]?.label,
      district: options[2]?.label,
      pageSize: 50,
    }});
    setAreasById(_(res.data).keyBy('id').value());
    if (map) map.setCity(options[2]?.label || options[1]?.label || options[0]?.label);
    if (res.data.length) {
      setSelectedMenuKeys([res.data[0].id+'']);
      setCurrentAreaId(res.data[0].id);
      // setTimeout(() => {
        addPaths(res.data[0].paths);
      // }, 2000);
    }
  }
  const createPath = () => {
    polyEditor.close();
    polyEditor.setTarget();
    polyEditor.open();
  }
  const removePath = () => {
    let polygon = polyEditor.getTarget();
    map.remove(polygon);
    polyEditor.close();
    polygons = polygons.filter(p => p != polygon);
  }
  const saveArea = () => {
    if (!currentAreaId) {message.error('当前未选中区域'); return;}
    polyEditor?.close?.();
    let paths = polygons.map(polygon => polygon.getPath()).filter(p => p.length);
    
    request(`/admin/areas/` + currentAreaId, {
      method: 'PATCH',
      data: {paths},
    }).then(res => {
      areasById[currentAreaId].paths = paths;
      message.success('更新成功');
    }).catch(e => {
      message.error(e.msg);
    })
  }
  const switchArea = (menu:any) => {
    let areaById = _(areasById).keyBy('id').value();
    setSelectedMenuKeys([menu.key]);
    setCurrentAreaId(menu.key);
    addPaths(areaById[menu.key].paths, true);
  }
  const addPaths = (paths:[], fitView?:boolean) => {
    if (!map || !polyEditor) {message.error('map还未完全加载，请刷新重试！'); return;}
    map.clearMap();
    polyEditor.close();
    if (!paths || !paths.map) {message.error('暂无路径数据！'); polygons=[]; return;}

    // 加载区域路径绘制
    polygons = paths.map((path:any) => new AMap.Polygon({path}));
    map.add(polygons);
    if (fitView) map.setFitView();
    
    // 编辑路径
    polyEditor.addAdsorbPolygons(polygons);
    polygons.forEach((polygon:any) => polygon.on('dblclick', () => {
      polyEditor.setTarget(polygon);
      polyEditor.open();
    }));
    polyEditor.setTarget(polygons[0]);
    polyEditor.open();
  }
  const onAddArea = (area:AreaType) => {
    areasById[area.id] = area;
    setAreasById(areasById);
    setSelectedMenuKeys([area.id+'']);
    setCurrentAreaId(area.id);
    polygons = [];
    if (map) map.setCity(area.district || area.city || area.province);
    if (map) map.clearMap();
    if (polyEditor) createPath();
  }
  

  useEffect(() => {
    (async () => {
      const [areaData, AMap] = await Promise.all([request<{data:AreaType[]}>(`/admin/areas`, {params: {pageSize:50}}), AMapLoader.load({
        key: "8eed729112431178d5b9adaff42b33c1", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.PolygonEditor'] //插件列表
      })]);
      setAreasById(_(areaData.data).keyBy('id').value());
      
      // 初始化地图区域
      map = new AMap.Map("map", {
        // zoom: 16.8
      });
      polyEditor = new AMap.PolygonEditor(map);
      polyEditor.on('add', function (data:any) {
        let polygon = data.target;
        polygons.push(polygon);
        polyEditor.addAdsorbPolygons(polygon);
        polygon.on('dblclick', () => {
          polyEditor.setTarget(polygon);
          polyEditor.open();
        })
      });
      if (areaData.data.length) {
        let defaultSelectedArea = areaData.data[0];
        setSelectedMenuKeys([defaultSelectedArea.id+'']);
        setCurrentAreaId(defaultSelectedArea.id);
        addPaths(defaultSelectedArea.paths, true);
      }
    })()
  }, []);
  return (
    <PageContainer>
      <Card>
        <Cascader options={cityData} placeholder="请选择城市" onChange={cityChange} changeOnSelect />
        <div style={{float:'right'}}><AddArea onComplete={onAddArea} /></div>
      </Card>
      <Card>
        <Layout>
          <Layout.Sider collapsed={true}>
            <Menu
              selectedKeys={selectedMenuKeys}
              onSelect={switchArea}
            >
              {Object.values(areasById).map?.(area => 
                <Menu.Item key={area.id} icon={<EnvironmentOutlined />}>
                  {area.name || area.id} <AddArea key={area.id} areaId={area.id} areaData={area} plain={true} onComplete={area => {
                    areasById[area.id] = area;
                    setAreasById({...areasById});
                  }} />
                </Menu.Item>
              )}
            </Menu>
          </Layout.Sider>
          <Layout>
            <div id="map" style={{height:500}}></div>
            <Card style={{position:'absolute', top:30, right:30}}>
              <Space style={{display:'flex', flexDirection:'column'}}>
                <Button type='primary' onClick={saveArea}>保存路径</Button>
                <Space size="large" style={{width:'100%', display:'flex', justifyContent:'space-between'}}>
                  <Button type='default' icon={<PlusOutlined />} onClick={createPath}></Button>
                  <Button type='default' icon={<DeleteOutlined />} danger onClick={removePath}></Button>
                </Space>
              </Space>
            </Card>
              {/* <Button class="btn" onclick="createPolygon()" style="margin-bottom: 5px">新建</Button>
              <Button class="btn" onclick="polyEditor.open()" style="margin-bottom: 5px">开始编辑</Button>
              <Button class="btn" onclick="polyEditor.close()">结束编辑</Button> */}
          </Layout>
        </Layout>
      </Card>
    </PageContainer>
  );
};

export default TableList;
