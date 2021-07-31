import React, { useRef, useState } from 'react';
import { Button, message } from 'antd';
import ProForm, {DrawerForm} from '@ant-design/pro-form';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import _ from 'lodash/collection';
import { addGoods, addGoodsSpec } from './service';
import { SkuDataType, SpecDataType } from './data';

  
export default (props:{goodsId:number, skuData?:any, specData?:SpecDataType[], onOpen?:()=>Promise<any>, onComplete?:(data:{specs:SpecDataType[],skus:SkuDataType[]})=>void, fieldProps?:object}) => {
  const formRef = useRef();
  const [specData, setSpecData] = useState<SpecDataType[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    specData.map((item) => item.rowKey),
  );
  const [visible, setVisible] = useState(false);
//   const [keys, setKeys] = useState({});

  const columns: ProColumns<SpecDataType>[] = [
    {
      title: '规格类别',
      dataIndex: 'key',
    //   key: 'key',
    //   valueType: 'select',
    //   fieldProps: {
    //     showSearch: true,
    //     onSearch: (value:string) => {
    //         console.log(value);
    //         let k = _.map(formRef?.current?.getFieldsFormatValue()?.spec, 'key');
    //         console.log(k);
    //         setKeys({
    //             ...k,
    //             value,
    //         });
            
    //     }
    //   },
    //   valueEnum: keys,
    },
    {
      title: '规格名称',
      dataIndex: 'name',
    },
    {
      title: '缩略图',
      dataIndex: 'image',
      valueType: 'avatar',
    },
    {
      title: '操作',
      valueType: 'option',
    },
  ];

  return (  
    <DrawerForm
        title="添加商品规格"
        formRef={formRef}
        trigger={
          specData.length||props?.specData?.length ? <Button>
                <EditOutlined /> 编辑商品规格
            </Button> : <Button>
                <PlusOutlined /> 添加商品规格
            </Button>
        }
        drawerProps={{
            forceRender: true,
            destroyOnClose: true,
        }}
        visible={visible}
        onVisibleChange={async show => {
          if (show) {
            try {
              await props?.onOpen?.();
              if (!specData?.length) {
                let spec = props?.specData || [];
                spec = spec.map(s => {s.rowKey=s.id||Math.random();return s;})
                setSpecData(spec);
                setEditableRowKeys(spec.map(s => s.rowKey));
              }
              if (!visible) setVisible(true);
            } catch (error) {
              if (visible) setVisible(false);
            }
          } else {
            setSpecData([]);
            if (visible) setVisible(false);
          }
        }}
        onFinish={async (values) => {
            let spec = _.groupBy(_.reject(values.spec, s => !s.key||!s.name), 'key');
            let data = await addGoodsSpec(props.goodsId, spec);
            setSpecData(data.specs);
            props?.onComplete?.(data);
            message.success('添加成功！继续设置价格库存～');
            return true;
        }}
        {...props.fieldProps}
    >
      <ProForm.Item
        name="spec"
        initialValue={specData}
        trigger="onValuesChange"
      >
        <EditableProTable<SpecDataType>
          rowKey="rowKey"
          toolBarRender={false}
          columns={columns}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            position: 'bottom',
            record: () => ({
              rowKey: Date.now(),
            }),
          }}
          editable={{
            type: 'multiple',
            editableKeys,
            onChange: setEditableRowKeys,
            actionRender: (row, _, dom) => {
              return [dom.delete];
            },
          }}
        />
      </ProForm.Item>
    </DrawerForm>
  );
};