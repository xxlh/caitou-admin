import { Button, message, Input, Drawer, FormInstance } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { getOrders, removeGoods } from './service';
import type { OrderItemType, TableListPagination } from './data';
import { useModel } from 'umi';
import { useEffect } from 'react';
import _ from 'lodash/collection';

/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: OrderItemType[]) => {
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

const OrderList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const editRef = useRef()
  const [currentRow, setCurrentRow] = useState<OrderItemType>();
  const [selectedRowsState, setSelectedRows] = useState<OrderItemType[]>([]);
  const params:any = {};
  const { getCategories } = useModel('categories');
  const [firstCategories, setFirstCategories] = useState({'':'全部分类'});
  /** 国际化配置 */

  const columns: ProColumns<OrderItemType>[] = [
    {
      title: '订单编号',
      dataIndex: 'no',
      tip: '商品no是唯一的 key',
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
      title: '购买用户',
      dataIndex: 'user_nickname',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '总价',
      dataIndex: 'total_amount',
      sorter: true,
      hideInSearch: true,
      hideInForm: true,
      renderText: (val: string) => `¥${val}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      filters: true,
      // onFilter: true,
      valueEnum: {
        unpaid: '未支付',
        undelivered: '未发货',
        unreceived: '待收货',
        unreviewed: '待评价',
        refunding: '申请退款',
        canceled: '订单取消',
        completed: '订单完成',
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
            editRef.current.open(record?.id);
            setCurrentRow(record);
          }}
        >
          编辑
        </a>,
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
      <ProTable<OrderItemType, TableListPagination>
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
        params={params}
        request={getOrders}
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
          <ProDescriptions<OrderItemType>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<OrderItemType>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default OrderList;
