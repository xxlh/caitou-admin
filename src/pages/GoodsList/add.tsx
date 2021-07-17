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
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [editorState, setEditorState] = useState(BraftEditor.createEditorState(null));
  const [goodsId, setGoodsId] = useState(0);
  const [goodsData, setGoodsData] = useState<GoodsItemType>({});
  const [skuData, setSkuData] = useState<SkuDataType[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [specData, setSpecData] = useState<SpecDataType[]>([]);
  const { categoriesByid, getCategories } = useModel('categories');
  const [firstCategoryId, setFirstCategoryId] = useState([]);
  const [firstCategories, setFirstCategories] = useState([]);
  const [secondCategories, setSecondCategories] = useState([]);
  const [categoriesDefault, setCategoriesDefault] = useState([]);

  const onVisibleChange = async (visible:boolean) => {
    if (visible) {
      const hide = message.loading('正在添加');
      try {
        /* 查询商品数据 */
        let goodsCategories;
        const id = goodsId || props.goodsId;
        if (id) {
          if (!goodsId) setGoodsId(props.goodsId || 0);
          let goods = await getGoods(id);
          goods.product.description = BraftEditor.createEditorState(goods?.product?.description);
          formRef?.current?.setFieldsValue(goods?.product);
          setGoodsData(goods.product);
          setSkuData(goods?.skus?.map(sku => {
            if (typeof sku.own_spec == 'object') sku.own_spec = _.map(sku.own_spec, (v,k) => `${k}: ${v}`).join('\n');
            return sku;
          }));
          setSpecData(goods?.specs);
          goodsCategories = await getGoodsCategories(id);
          setCategoriesDefault(goodsCategories?.map((cat:any) => cat.id));
        }
        /* 查询类别 */
        let categories = await getCategories();
        setFirstCategories(categories.map((cat:any) => {
          return {label: cat.name, value: cat.id};
        }));
        // 拉取所有二级分类项，提供给DefaultValue的id识别
        let allCatChildren:any = [];
        categories.map((cat:any) => {
          cat?.children?.map((c:any) => allCatChildren.push({label: c.name, value: c.id}));
        });
        setSecondCategories(allCatChildren);
        // 选中一级分类
        let firstCatId = goodsCategories?.[0]?.parent_id || goodsCategories?.[0]?.id;
        if (id && firstCatId) {
          setFirstCategoryId(firstCatId);
          setSecondCategories(_.keyBy(categories, 'id')[firstCatId]?.children?.map((cat:any) => {
            return {label: cat.name, value: cat.id};
          }));
        }
      } catch (error) {
        message.error(error?.data?.msg);
      }
      setVisible(true);
      hide();
    } else {
      setVisible(false);
      setGoodsId(0);
      setGoodsData({});
      setSkuData([]);
      setSpecData([]);
      setFirstCategories([]);
      setSecondCategories([]);
      setCategoriesDefault([]);
      setEditorState(BraftEditor.createEditorState(null));
    }
  }

  const submit = async (fields: GoodsItemType) => {
    const hide = message.loading('正在添加');

    try {
      if (typeof fields?.images == 'object') fields.images = fields?.images?.map((img:any) => img?.url||('http://'+img?.response?.Location));
      fields.description = fields.description?.toHTML();
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
    let formData = formRef?.current?.getFieldsValue();
    let goods = await addGoods({draft: true, title: formData?.title||' ', price: formData?.price||0, stock: formData?.stock||0});
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
      onFinish={submit}
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
            value: firstCategoryId,
            onChange(v, o) {
              setFirstCategoryId(v);
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
          label="子类别"
          mode="multiple"
          fieldProps={{defaultValue:categoriesDefault}}
        />
        }
        {skuData.length==0 && <>
        <ProFormDigit width="xs" name="price" label="商品价格" required={true} rules={[{ required: true, message: '请输入价格！' }]} />
        <ProFormDigit width="xs" name="stock" label="商品库存" required={true} rules={[{ required: true, message: '请输入库存！' }]} />
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
          <PicturesWall fileList={(goodsData.images||[]).map((url:string, k:number) => ({id:k, url:url}))} />
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
        <div>{editorState.toHTML()}</div>
      </ProForm.Group>
    </DrawerForm>
  );
});