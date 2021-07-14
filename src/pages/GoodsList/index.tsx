import { Button, message, Input, Drawer, FormInstance } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { goods, updateRule, removeRule } from './service';
import type { TableListItem, TableListPagination } from './data';
import AddGoods from './add';

/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
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

const TableList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const editRef = useRef()
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const params:any = {bb:1};
  /** 国际化配置 */

  const columns: ProColumns<TableListItem>[] = [
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
            editRef.current.open(record?.id);
            setCurrentRow(record);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  // const onAddGoodsVisibleChange = async (visible:boolean) => {
  //   if (visible) {
  //     /* 查询类别 */
  //     let categories = await getCategories();
  //     setFirstCategories(categories.map((cat:any) => {
  //         return {label: cat.name, value: cat.id};
  //     }));
  //   } else {
      
  //   }
  // }

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        // headerTitle="所有商品"
        actionRef={actionRef}
        formRef={formRef}
        rowKey="key"
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
          <AddGoods ref={editRef} />,
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
              项 &nbsp;&nbsp;
              <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万
              </span>
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
          <Button type="primary">批量审批</Button>
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
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;