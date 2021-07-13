import React, { useRef, useState } from 'react';
import { Button, message } from 'antd';
import ProForm, {
  DrawerForm,
  ProFormText,
  ProFormSelect,
  ProFormDigit,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import { addGoods } from './service';
import { TableListItem } from './data';
import AddSpec from './add-spec';
import PicturesWall from './add-pic';
// 引入编辑器组件
import BraftEditor, { MediaType } from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import uploadFn from '@/utils/upload'
import { useModel } from 'umi';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';

/**
 * 添加节点
 *
 * @param fields
 */
 const handleAdd = async (fields: TableListItem) => {
    const hide = message.loading('正在添加');
  
    try {
      await addGoods({ ...fields });
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error(error?.data?.msg ? error?.data?.msg : '添加失败请重试！');
      return false;
    }
};

type SkuDataSourceType = {
  id?: React.Key;
  name?: string;
  spec_ids: string;
  created_at?: string;
};
const skuColumns: ProColumns<SkuDataSourceType>[] = [
  {
    title: '规格组合',
    dataIndex: 'key',
    editable: false,
  },
  {
    title: '别称',
    dataIndex: 'name',
  },
  {
    title: '价格',
    dataIndex: 'price',
    valueType: 'money',
  },
  {
    title: '库存',
    dataIndex: 'price',
    valueType: 'digit',
  },
  {
    title: '操作',
    valueType: 'option',
  },
];


export default () => {
  const formRef = useRef();
  const [editorState, setEditorState] = useState(BraftEditor.createEditorState(null));
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { getCategories, setCategories } = useModel('categories');
  const [firstCategories, setFirstCategories] = useState([]);
  const [secondCategories, setSecondCategories] = useState([]);
  const [skuData, setSkuData] = useState([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    skuData.map((item) => item.rowKey),
  );
  const [goodsId, setGoodsId] = useState(0);
  
  const onVisibleChange = async (visible:boolean) => {
      if (!visible) return;
      /* 查询类别 */
      let categories = await getCategories();
      setFirstCategories(categories.map((cat:any) => {
          return {label: cat.name, value: cat.id};
      }));
  }
//   const submitContent = async () => {
//     // 在编辑器获得焦点时按下ctrl+s会执行此方法
//     // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
//     const htmlContent = editorState.toHTML()
//     const result = await saveEditorContent(htmlContent)
//     }
  const cosUploadFn = (param:any) => {
      uploadFn({
          path: `${currentUser?.id}`, // Todo: +/分类id
          hashFilename: true,
          ...param,
          success: (data:any) => {
              param.success({
                  url: `//${data?.Location}`,
                  meta: {
                      id: param.libraryId,
                      title: param.file?.name,
                      alt: param.file?.name,
                  }
              });
          }
      })
  }

  const addEmptyGoods = async () => {
    let goodsData = formRef?.current?.getFieldsValue();
    let goods = await addGoods({draft: true, title: goodsData?.title||' ', price: goodsData?.price||0, stock: goodsData?.stock||0});
    if (goods?.code && goods?.code != 200) throw new Error("Failed to add goods!");
    setGoodsId(goods?.id);
  }

  return (
    <DrawerForm<TableListItem>
      title="添加商品"
      formRef={formRef}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          添加商品
        </Button>
      }
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
      }}
      onVisibleChange={onVisibleChange}
      onFinish={handleAdd}
    >
      <ProForm.Group>
        <ProFormText
          name="title"
          width="xl"
          label="商品标题"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
          required={true}
          rules={[{ required: true, message: '请输入商品标题！' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          options={firstCategories}
          width="sm"
          name="useMode"
          label="商品分类"
        />
        {skuData.length==0 && <>
        <ProFormDigit width="xs" name="price" label="商品价格" />
        <ProFormDigit width="xs" name="stock" label="商品库存" />
        </>}
        <AddSpec goodsId={goodsId} goodsRef={formRef} addEmptyGoods={addEmptyGoods} setSkuData={setSkuData} />
        {skuData.length>0 &&
        <ProForm.Item
          name="sku"
          initialValue={skuData}
          trigger="onValuesChange"
        >
          <EditableProTable<SkuDataSourceType>
            rowKey="id"
            toolBarRender={false}
            columns={skuColumns}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              position: 'bottom',
              record: () => ({
                id: Date.now(),
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
        </ProForm.Item>}
      </ProForm.Group>
      <ProForm.Group>
        <ProForm.Item name="images">
          <PicturesWall />
        </ProForm.Item>
      </ProForm.Group>
      <ProForm.Group>
        <ProForm.Item name="description">
            <BraftEditor
                value={editorState}
                onChange={setEditorState}
                // onSave={submitContent}
                media={{ uploadFn: cosUploadFn }}
            />
        </ProForm.Item>
        {/* <div>{editorState.toHTML()}</div> */}
      </ProForm.Group>
    </DrawerForm>
  );
};