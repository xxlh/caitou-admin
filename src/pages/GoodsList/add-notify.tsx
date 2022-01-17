import { ReactNode, useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Tabs, Typography, Layout, Button } from 'antd';
import { BetaSchemaForm } from '@ant-design/pro-form';
import { WechatTemplate } from './data';
import _ from 'lodash/collection';
const { Content } = Layout;
const { TabPane } = Tabs;
const { Text } = Typography;


const AddNotify = (props:{goodsType:string, enableDailyprice?:boolean, children?:ReactNode}) => {
    const { templates, getTemplates } = useModel('notifyTemplates');

    useEffect(() => {
        (async () => {
            await getTemplates();
        })()
    }, []);

    return (<>
        {templates[props.goodsType] && templates[props.goodsType].length ?
        <Tabs defaultActiveKey="1">
            {templates[props.goodsType]?.map?.(template => 
            <TabPane tab={template.title} key={template.id} style={{position: 'relative'}}>
                <Content style={_.filter(template.data, d => d.value&&d.value.indexOf('{consumeDate}')!=-1).length && !props.enableDailyprice ? {filter:'blur(3px)' } : {}}>
                    <Text type="secondary">{template.description}</Text>
                    <BetaSchemaForm
                        trigger={<a>点击我</a>}
                        layoutType="Embed"
                        onFinish={async (values) => {
                        console.log('onFinish', values);
                        }}
                        columns={[{
                            valueType: 'group',
                            columns: template.data.map(data => {
                                return {
                                    title: data.name,
                                    dataIndex: ['notifications', template.key, data.key],
                                    valueType: data.type,
                                    width: data.name=='温馨提醒' ? "lg" : "sm",
                                    fieldProps: {
                                        ...(data.max>0 ? {data: data.max} : {}),
                                        disabled: data.value ? true : false,
                                        ...(data.value ? {placeholder:'用户下单时提交'} : {}),
                                    },
                                };
                            })
                        }]}
                    />
                </Content>
                <div
                    hidden={! (_.filter(template.data, d => d.value&&d.value.indexOf('{consumeDate}')!=-1).length && !props.enableDailyprice)}
                    style={{
                        display: 'flex',	// 使用flex布局
                        position: 'absolute',	// 绝对定位
                        top: '0px',	// 距离父级元素顶部0像素
                        left: '0px',	// 距离父级元素左侧0像素
                        zIndex: 10,	// 遮罩层的堆叠层级（只要设置的比被遮罩元素高就行）
                        height: '100%',	// 与父级元素同高
                        width: '100%',	// 与父级元素同宽
                        background: 'rgba(255,255,255,0.2)',	// 半透明背景
                        textAlign: 'center',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                    }}
                >
                    {props.children ||
                        <Button>配置团期后生效</Button>
                    }
                </div>
            </TabPane>
            )}
        </Tabs> : 
        <Text type="secondary">暂无可用消息推送</Text>
        }
    </>)
};

export default AddNotify;