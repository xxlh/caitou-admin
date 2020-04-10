import { message, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { queryRoom } from './service';
import { TableListParams, TableListItem } from './data.d';
import { removeUserVerify } from './service';

const query = async (params?: TableListParams) => {
  const success = await queryRoom(params);
  return success;
};
interface BillProps {
  dispatch: Dispatch<AnyAction>;
  loadBill?: boolean;
}
const TableList: React.FC<BillProps> = props => {
//   const { billDetailRes = {}, loadBill } = props;
//   const { unpay_total, charges, bills } = billDetailRes;

  const [sorter, setSorter] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '楼号',
      dataIndex: 'building_number',
    },
    {
      title: '户号',
      dataIndex: 'room_number',
	},
	{
		title: '微信名',
		dataIndex: 'nickname',
	},
    {
      title: '名字',
      dataIndex: 'realname',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
	},
	{
		title: '是否户主',
		dataIndex: 'is_householder',
		valueEnum: {
			0: {text: '否'},
			1: {text: '是'}
		}
	},
    {
      title: '认证级别',
      dataIndex: 'verify_level',
	  valueEnum: {
			0: {text: '未认证'},
			1: {text: '可查物业费'},
			2: {text: '可消费物业余额'}
		}
	},
	{
		title: '注册时间',
		dataIndex: 'first_login',
		valueType: 'dateTime',
		sorter: true,
	  },
	
    {
      title: '单元',
      dataIndex: 'unit_number',
    },
    
    {
      title: '操作',
      dataIndex: 'option',
	  valueType: 'option',
      render: (_, record) => (
		<Popconfirm title="是否清除认证?" onConfirm={ async () => {
			try {
				console.log(actionRef);
					await removeUserVerify(parseInt(record.id));
				if (actionRef.current) {
					actionRef.current.reload();
					}
			} catch (error) {
				message.error('数据清除失败请重试！');
			}
		}} >
		<a>清除认证</a>
	  </Popconfirm>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="筛选信息"
        actionRef={actionRef}
        rowKey="key"
        onChange={(_, _filter, _sorter) => {
          if (_sorter.field && _sorter.order) setSorter(`${_sorter.field}_${_sorter.order}`);
        }}
        params={{
          sorter,
        }}
        request={params => query(params)}
        columns={columns}
      />
      
    </PageHeaderWrapper>
  );
};

// export default connect(({ loading, bill }: ConnectState) => ({
//   loadBill: loading.effects['bill/queryBillDetail'],
//   billDetailRes: bill.billDetail,
// }))(TableList);
export default TableList;