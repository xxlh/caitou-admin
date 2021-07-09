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
import PicturesWall from './new-pic';
// 引入编辑器组件
import BraftEditor, { MediaType } from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import uploadFn from '@/utils/upload'
import { useModel } from 'umi';

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
      message.error('添加失败请重试！');
      return false;
    }
  };

export default () => {
  const formRef = useRef();
  const [editorState, setEditorState] = useState<any>(BraftEditor.createEditorState(null));
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
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
        <ProFormDigit width="sm" name="price" label="商品价格" />
        <ProFormSelect
          options={[
            {
              value: 'chapter',
              label: '盖章后生效',
            },
          ]}
          width="xs"
          name="useMode"
          label="商品分类"
        />
      </ProForm.Group>
      <ProForm.Group>
          <PicturesWall />
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