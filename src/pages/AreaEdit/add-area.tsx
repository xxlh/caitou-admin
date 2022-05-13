import React, { useRef, useState, useEffect, ReactNode } from 'react';
import { Button, message, Calendar, Badge, Popconfirm, Cascader, Space } from 'antd';
import ProForm, {DrawerForm, ModalForm, ProFormDateRangePicker, ProFormSelect, ProFormText} from '@ant-design/pro-form';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import cityData from "./city";
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader';
import { request } from 'umi';

  
export default (props:{areaId?:number, areaData?:AreaType, plain?:boolean, onOpen?:()=>Promise<any>, onComplete?:(data:AreaType)=>void}) => {
  const [province, setProvince] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const cityChange = (values:CascaderValueType, options:CascaderOptionType[]|undefined) => {
    setProvince(options[0]?.label);
    setCity(options[1]?.label);
    setDistrict(options[2]?.label);
  }
  const submit = async (values: {name?:string}) => {
    let data = {
      name: values.name,
      province,
      city,
      district,
    };
    if (props.areaId) {
      let res = await request(`/admin/areas/` + props.areaId, {
        method: 'PATCH',
        data,
      });
      props.onComplete?.(res);
    } else {
      let res = await request(`/admin/areas`, {
        method: 'POST',
        data,
      });
      props.onComplete?.(res);
    }
    return true;
  }

  return (  
    <ModalForm
      trigger={
        props.plain ?
          <Button icon={<EditOutlined />} style={{borderRadius:'50%'}}></Button> :
          <Button type="primary" icon={<PlusOutlined />}>新增区域</Button>
      }
      onFinish={submit}
      layout="horizontal"
      width='md'
    >
      <ProFormText label="区域名" name="name" width="md" initialValue={props.areaData?.name} />
      <ProForm.Item label="所属城市">
        <Cascader options={cityData} placeholder="请选择城市" onChange={cityChange} changeOnSelect defaultValue={[props.areaData?.province, props.areaData?.city, props.areaData?.district]} />
      </ProForm.Item>
    </ModalForm>
  );
};