import React, { useRef, useState, useEffect } from 'react';
import { Button, message, Calendar, Badge, Popconfirm } from 'antd';
import ProForm, {DrawerForm, ModalForm, ProFormDateRangePicker, ProFormSelect} from '@ant-design/pro-form';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { getDailyprice, removeDailyprice, setDailyprice } from './service';
import { DailypriceItemType, SkuDataType, SpecDataType } from './data';
import { useModel } from 'umi';
import moment, { Moment } from 'moment';
import './goods.css'

  
export default (props:{goodsId:number, skuData:SkuDataType[], onOpen?:()=>Promise<any>, onComplete?:(data:Record<string, DailypriceItemType[]>)=>void, fieldProps?:object}) => {
  const formRef = useRef();
  const [dailypriceData, setDailypriceData] = useState<Record<string, DailypriceItemType[]>>({});
  const [enableDailyprice, setEnableDailyprice] = useState(false);
  const [forceRefreshCalendar, setForceRefreshCalendar] = useState(11);
  const [visible, setVisible] = useState(false);
  const [weekdaysValue, setWeekdaysValue] = useState<Array<string|number>>(['daily']);
  const [purgeConfirmLoading, setPurgeConfirmLoading] = React.useState(false);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    props.skuData.map(sku => sku.id),
  );

  const dateCellRender = (date:Moment) => {
    const dateString = date.format('YYYY-MM-DD');
    if (! dailypriceData[dateString]) return;
      
    return (
      <ul className="events" key={forceRefreshCalendar}>
        {dailypriceData[dateString].map(item => (
        <li key={item.sku_id}><Badge status="default" text={`¥${item.price} (${item.sku_name}')`} /></li>
        ))}
      </ul>
    );
  }

  const skuColumns: ProColumns<SkuDataType>[] = [
    {
      title: '规格',
      dataIndex: 'name',
      editable: false,
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
  ];

  const bulkUpdate = async (values: {dailypriceItem:SkuDataType[], daterange:Array<string>, weekdays:Array<string>}) => {
    if (!values.daterange || !values.daterange[0] || !values.daterange[1]) {message.error('需要起止时间'); return false;}
    if (!weekdaysValue || !weekdaysValue.length) {message.error('需要限定时间'); return false}

    let weekdays = new Set(weekdaysValue);
    let dailypriceItem = values.dailypriceItem.map(sku => ({
      sku_id: sku.id,
      price: sku.price,
      stock: sku.stock,
      sku_name: sku.name
    }));
    let curDate = moment(values.daterange[0]);
    while (curDate <= moment(values.daterange[1])) {
      if (weekdays.has('daily')) {
        dailypriceData[curDate.format('YYYY-MM-DD')] = dailypriceItem;
      } else if (weekdays.has('clean')) {
        delete dailypriceData[curDate.format('YYYY-MM-DD')];
      } else {
        if (weekdays.has(curDate.day())) dailypriceData[curDate.format('YYYY-MM-DD')] = dailypriceItem;
      }
      curDate.add(1, 'days');
    }

    setForceRefreshCalendar(Math.random()) // Todo: 为什么加这行就自动刷新日历
    setDailypriceData(dailypriceData);
    message.success('已刷新日历价格！');
    return true;
  }

  const submit = async () => {
    await setDailyprice(props.goodsId, dailypriceData||{});
    props?.onComplete?.(dailypriceData||{});
    message.success('配置完成！价格将以价格日历为准～');
    return true;
  }

  const purge = async () => {
    await removeDailyprice(props.goodsId);
    setDailypriceData({});
    message.success('已清空团期！价格将以规格配置为准～');
    return true;
  }
  

  useEffect(() => {
    (async () => {
        props.skuData.map(sku => {
          if (sku.daily_price) setEnableDailyprice(true);
        })
    })()
  }, [props.skuData]);

  return (  
    <DrawerForm
      title="配置团期价格"
      formRef={formRef}
      key={props.goodsId}
      trigger={
        enableDailyprice || JSON.stringify(dailypriceData) != '{}' ? <Button type="primary">
              <EditOutlined /> 配置团期价格
          </Button> : <Button>
              <PlusOutlined /> 启用团期价格
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
            if (!dailypriceData || JSON.stringify(dailypriceData) == '{}') {
              let dailypriceData = await getDailyprice(props.goodsId);
              setDailypriceData(dailypriceData);
            }
            setEditableRowKeys(props.skuData.map(sku => sku.id))
            if (!visible) setVisible(true);
          } catch (error) {
            if (visible) setVisible(false);
          }
        } else {
          if (visible) setVisible(false);
        }
      }}
      onFinish={submit}
      {...props.fieldProps}
    >
      <ModalForm
        trigger={
          <Button type="primary">
            <PlusOutlined />
            批量更新价格
          </Button>
        }
        onFinish={bulkUpdate}
        layout="horizontal"
      >
        <ProForm.Group>
          <ProFormDateRangePicker
            name="daterange"
            label="有效发团区间"
            width="md"
            initialValue={[moment().format('YYYY-MM-DD'), moment().add(3,'months').format('YYYY-MM-DD')]}
          />
          <ProFormSelect
            name="weekdays"
            label="限定发团时间"
            width="xs"
            mode="multiple"
            options={[
              {value: 'daily', label: '每天'},
              {value: 1, label: '周一'},
              {value: 2, label: '周二'},
              {value: 3, label: '周三'},
              {value: 4, label: '周四'},
              {value: 5, label: '周五'},
              {value: 6, label: '周六'},
              {value: 0, label: '周日'},
              {value: 'clean', label: '不发团'},
            ]}
            initialValue={["daily"]}
            fieldProps={{
              value: weekdaysValue,
              onChange: (value) => {
                if (value.length && value[value.length-1] == 'daily') value = ['daily'];
                else if (value.length && value[value.length-1] == 'clean') value = ['clean'];
                else {
                  let Value = new Set(value);
                  Value.delete('daily');
                  Value.delete('clean');
                  value = Array.from(Value);
                }
                setWeekdaysValue(value);
              }
            }}
          />
        </ProForm.Group>
        <ProForm.Item
          name="dailypriceItem"
          initialValue={props.skuData}
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
            }}
          />
        </ProForm.Item>
      </ModalForm>

      <Popconfirm
        title="清空团期后价格库存将以规格配置为准！"
        onConfirm={async e => {
          setPurgeConfirmLoading(true);
          let result = await purge();
          if (result && visible) setVisible(false);
        }}
      >
        <Button type="primary" danger loading={purgeConfirmLoading} style={{float:'right'}}>清除价格日历</Button>
      </Popconfirm>

      <Calendar dateCellRender={dateCellRender} />
    </DrawerForm>
  );
};