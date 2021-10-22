import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Tabs, Typography } from 'antd';
import { BetaSchemaForm } from '@ant-design/pro-form';
import { WechatTemplate } from './data';
const { TabPane } = Tabs;
const { Text } = Typography;


const AddNotify = (props:{goodsType:string}) => {
    const { getTemplates } = useModel('notifyTemplates');
    const [templates, setTemplates] = useState<WechatTemplate[]>([]);

    useEffect(() => {
        (async () => {
            const templates = await getTemplates();
            if (templates[props.goodsType]) setTemplates(templates[props.goodsType]);
        })()
    }, []);

    return (<>
        <Tabs defaultActiveKey="1">
            {templates.map(template => 
            <TabPane tab={template.title} key={template.id}>
                <Text type="secondary">{template.description}</Text>
                <BetaSchemaForm
                    trigger={<a>点击我</a>}
                    layoutType="Embed"
                    onFinish={async (values) => {
                    console.log('onFinish', values);
                    }}
                    columns={[{
                        valueType: 'group',
                        columns: template.data.map(data => ({
                            title: data.name,
                            dataIndex: ['notifications', template.key, data.key],
                            valueType: data.type,
                            width: data.name=='温馨提醒' ? "lg" : "sm",
                            fieldProps: {
                                ...(data.max>0 ? {data: data.max} : {}),
                                disabled: data.value ? true : false,
                                ...(data.value ? {placeholder:'用户下单时提交'} : {}),
                            },
                        }))
                    }]}
                />
            </TabPane>
            )}
        </Tabs>
        {!templates || !templates.length &&
        <Text type="secondary">暂无可用消息推送</Text>
        }
    </>)
};

export default AddNotify;