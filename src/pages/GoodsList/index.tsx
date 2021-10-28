import { Button, message, Popover, Typography, Drawer, FormInstance, Spin } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { getQRcode, goods, removeGoods } from './service';
import type { GoodsItemType } from './data';
import AddGoods from './add';
import { useModel } from 'umi';
import { useEffect } from 'react';
import _ from 'lodash/collection';
const { Text } = Typography;

/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: GoodsItemType[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeGoods({
      ids: selectedRows.map((row) => row.id).join(','),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const GoodsList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const editRef = useRef<FormInstance>();
  const [currentRow, setCurrentRow] = useState<GoodsItemType>();
  const [selectedRowsState, setSelectedRows] = useState<GoodsItemType[]>([]);
  const params:any = {};
  const { categoriesByid, getCategories } = useModel('categories');
  const [firstCategories, setFirstCategories] = useState({'':'全部分类'});
  const [linkCopied, setLinkCopied] = useState<Set<number>>(new Set([]));
  const [QRcode, setQRcode] = useState<Record<number, string>>({});

  const columns: ProColumns<GoodsItemType>[] = [
    {
      title: '商品名称',
      dataIndex: 'title',
      tip: '商品名称是唯一的 key',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
      sorter: true,
      hideInSearch: true,
      hideInForm: true,
      renderText: (val: string) => `¥${val}`,
    },
    {
      title: '销量',
      dataIndex: 'sold_count',
      sorter: true,
      hideInSearch: true,
      hideInForm: true,
      renderText: (val: string) => `${val}`,
    },
    {
      title: '评价',
      dataIndex: 'rating',
      sorter: true,
      hideInSearch: true,
      hideInForm: true,
      renderText: (val: string) => `${val}`,
    },
    {
      title: '分类',
      dataIndex: 'category',
      hideInTable: true,
      hideInForm: true,
      filters: true,
      // onFilter: true,
      valueEnum: firstCategories,
    },
    {
      title: '状态',
      dataIndex: 'on_sale',
      hideInForm: true,
      filters: true,
      // onFilter: true,
      valueEnum: {
        true: {
          text: '在售',
          status: true,
        },
        false: {
          text: '下架',
          status: false,
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={(e) => {
            editRef?.current?.open(record?.id);
            setCurrentRow(record);
          }}
        >
          编辑
        </a>,
        <Popover title={
          <Text code copyable ellipsis style={{width:120}}>{'pages/goods/goods?id='+record.id}</Text>
        } content={<div style={{textAlign:"center"}}>
          {QRcode[record.id] &&
          (QRcode[record.id]=='loading' ? <Spin size="small" /> :
          <img src={QRcode[record.id]} width="100" height="100" />)
        }
        </div>} onVisibleChange={async v => {
          if (!v) return;
          if (QRcode[record.id]) return;
          let qrcode = {...QRcode}; // React刷新state需要改变地址，改子元素无效
          qrcode[record.id] = 'loading';
          setQRcode(qrcode);
          let QRcodeData = await getQRcode('pages/goods/goods?id=' + record.id);
          qrcode = {...QRcode};
          qrcode[record.id] = QRcodeData.base64;
          setQRcode(qrcode);
        }}>
          <Button type="link" onClick={e => {
            // Todo: 调用Text的copy操作
            // setLinkCopied(new Set([record.id]));
          }}>{linkCopied.has(record.id)?'已复制':'链接'}</Button>
        </Popover>,
      ],
    },
  ];

  useEffect(() => {
    (async () => {
      let categories = await getCategories();
      setFirstCategories({
        ...firstCategories,
        ..._.keyBy(_.map(categories, c => ({text:c.name, id:c.id})), 'id'),
      });
    })()
  }, [])


  return (
    <PageContainer>
      <ProTable<GoodsItemType, API.PageParams>
        // headerTitle="所有商品"
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolbar={{
          search: {
            onSearch: (value: string) => {
              params.search=value;
              formRef.current?.submit();
            },
          },
        }}
        toolBarRender={() => [
          <AddGoods ref={editRef} onComplete={() => {
            actionRef.current?.reload();
          }} />,
        ]}
        params={params}
        request={goods}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          {/* <Button type="primary">批量上架</Button> */}
        </FooterToolbar>
      )}

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<GoodsItemType>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<GoodsItemType>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default GoodsList;
