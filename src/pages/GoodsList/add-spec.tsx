import React, { useRef, useState } from 'react';
import { Button, message } from 'antd';
import ProForm, {DrawerForm} from '@ant-design/pro-form';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import _ from 'lodash/collection';
import { addGoods, addGoodsSpec } from './service';


const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

type DataSourceType = {
    rowKey: React.Key;
    id?: number;
    key: string;
    name: string;
    image?: string;
    created_at?: string;
  };
  
export default (props:{goodsId:number, goodsRef:any, addEmptyGoods?:any, setSkuData?:any, fieldProps?:object}) => {
  const formRef = useRef();
  const [specData, setSpecData] = useState<DataSourceType[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    specData.map((item) => item.rowKey),
  );
  const [visible, setVisible] = useState(false);
//   const [keys, setKeys] = useState({});

  const columns: ProColumns<DataSourceType>[] = [
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
          specData.length ? <Button>
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
              await props.goodsRef?.current?.validateFields();
              if (!props.goodsId) await props.addEmptyGoods();
              setVisible(true);
            } catch (error) {
              setVisible(false);
            }
          } else {
            setVisible(false);
          }
        }}
        onFinish={async (values) => {
            let spec = _.groupBy(_.reject(values.spec, s => !s.key||!s.name), 'key');
            let data = await addGoodsSpec(props.goodsId, spec);
            setSpecData(data.specs);
            props.setSkuData(data.skus);
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
        <EditableProTable<DataSourceType>
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