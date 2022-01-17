import { WechatTemplate } from "@/pages/GoodsList/data";
import { useState } from "react";
import { request } from "umi";
import { WechatTemplateDataType } from "./data";

export default () => {
    const [templates, setTemplates] = useState<Record<string,WechatTemplateDataType[]>>({});
    const getTemplates = async (params = {}) => {
        if (templates && templates.length) return templates;
        let res = await request<Record<string, WechatTemplate[]>>('/admin/wechat/notifications', {
          method: 'GET',
          params,
        });
        setTemplates(res);
        return res;
    }
    return {templates, setTemplates, getTemplates}
}