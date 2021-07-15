import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Button, message } from 'antd';
import ProForm, {
  DrawerForm,
  ProFormText,
  ProFormSelect,
  ProFormDigit,
  DrawerFormProps,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import { addGoods, getGoods, getGoodsCategories, updateGoods, updateSku } from './service';
import { GoodsItemType, SkuDataType, SpecDataType } from './data';
import AddSpec from './add-spec';
import PicturesWall from './add-pic';
// 引入编辑器组件
import BraftEditor, { MediaType } from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import uploadFn from '@/utils/upload'
import { useModel } from 'umi';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import _ from 'lodash/collection';




export default forwardRef((props: {goodsId?:number, fieldProps?:DrawerFormProps}, ref:any) => {
  const formRef = useRef();
  const [visible, setVisible] = useState<boolean>(false);
  const [editorState, setEditorState] = useState(BraftEditor.createEditorState(null));
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [goodsId, setGoodsId] = useState(0);
  const [skuData, setSkuData] = useState<SkuDataType[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [specData, setSpecData] = useState<SpecDataType[]>([]);
  const { categoriesByid, getCategories } = useModel('categories');
  const [firstCategories, setFirstCategories] = useState([]);
  const [secondCategories, setSecondCategories] = useState([]);
  const [categoriesDefault, setCategoriesDefault] = useState([]);

  const initiateGoodsData = async () => {
    const id = goodsId || props.goodsId;
    if (!id) return;
    if (!goodsId) setGoodsId(props.goodsId || 0);
    try {
      let goodsData = await getGoods(id);
      formRef?.current?.setFieldsValue(goodsData?.product);
      setSkuData(goodsData?.skus?.map(sku => {
        if (typeof sku.own_spec == 'object') sku.own_spec = _.map(sku.own_spec, (v,k) => `${k}: ${v}`).join('\n');
        return sku;
      }));
      setSpecData(goodsData?.specs);
      let categories = await getGoodsCategories(id);
      setCategoriesDefault(categories.map((cat:any) => cat.id));
    } catch (error) {
      message.error(error?.data?.msg);
    }
  }
  
  const onVisibleChange = async (visible:boolean) => {
    if (visible) {
      await initiateGoodsData();
      /* 查询类别 */
      let categories = await getCategories();
      setFirstCategories(categories.map((cat:any) => {
        return {label: cat.name, value: cat.id};
      }));
      // 拉取所有二级分类项，提供给DefaultValue的id识别
      let secondCat:any = [];
      categories.map((cat:any) => {
        cat?.children?.map((c:any) => secondCat.push({label: c.name, value: c.id}));
      });
      setSecondCategories(secondCat);
      setVisible(true);
    } else {
      setVisible(false);
      setGoodsId(0);
      setSkuData([]);
      setSpecData([]);
      setFirstCategories([]);
      setSecondCategories([]);
      setCategoriesDefault([]);
    }
  }

  const handleAdd = async (fields: GoodsItemType) => {
    const hide = message.loading('正在添加');

    try {
      if (goodsId) await updateGoods(goodsId, { ...fields });
      else await addGoods({ ...fields });
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error(error?.data?.msg ? error?.data?.msg : '添加失败请重试！');
      return false;
    }
  };

  const submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    if (!goodsId) return false;
    try {
      const htmlContent = editorState.toHTML()
      await updateGoods(goodsId, { description: htmlContent });
    } catch (e) {
      message.error(e?.data?.msg)
    }
  }
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

  useImperativeHandle(ref,() => ({
    open(id:number) {
      setGoodsId(id);
      setVisible(true);
    },
  }), []);

  const skuColumns: ProColumns<SkuDataType>[] = [
    {
      title: '规格组合',
      dataIndex: 'own_spec',
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
      dataIndex: 'stock',
      valueType: 'digit',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >编辑</a>,
      ],
    },
  ];


  return (
    <DrawerForm<GoodsItemType>
      title={goodsId ? "编辑商品" : "添加商品"}
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
      visible={visible}
      onVisibleChange={onVisibleChange}
      onFinish={handleAdd}
      {...props.fieldProps}
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
          label="商品分类"
          fieldProps={{
            onChange(v, o) {
              setSecondCategories(categoriesByid[v]?.children?.map((cat:any) => {
                return {label: cat.name, value: cat.id};
              }));
            },
          }}
        />
        {(secondCategories.length>0 || formRef?.current?.getFieldValue('categories')?.length>0) &&
        <ProFormSelect
          options={secondCategories}
          width="sm"
          name="categories"
          label="子分类"
          mode="multiple"
          fieldProps={{defaultValue:categoriesDefault}}
        />
        }
        {skuData.length==0 && <>
        <ProFormDigit width="xs" name="price" label="商品价格" />
        <ProFormDigit width="xs" name="stock" label="商品库存" />
        </>}
        <AddSpec goodsId={goodsId} goodsRef={formRef} addEmptyGoods={addEmptyGoods} skuData={skuData} setSkuData={setSkuData} specData={specData} />
        {skuData.length>0 &&
        <ProForm.Item
          name="sku"
          initialValue={skuData}
          trigger="onValuesChange"
        >
          <EditableProTable<SkuDataType>
            rowKey="id"
            toolBarRender={false}
            columns={skuColumns}
            recordCreatorProps={false}
            editable={{
              type: 'multiple',
              editableKeys,
              onChange: setEditableRowKeys,
              actionRender: (row, _, dom) => {
                return [dom.save, dom.cancel];
              },
              onSave: async (rowKey, data, row) => {
                try {
                  await updateSku(goodsId, rowKey, data);
                } catch (error) {
                  message.error(error?.data?.msg);
                  throw new Error(error?.data?.msg);
                }
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
                onSave={submitContent}
                media={{ uploadFn: cosUploadFn }}
            />
        </ProForm.Item>
        {/* <div>{editorState.toHTML()}</div> */}
      </ProForm.Group>
    </DrawerForm>
  );
});