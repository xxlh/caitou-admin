import { WechatTemplate } from "@/pages/GoodsList/data";
import { useState } from "react";
import { request } from "umi";

export default () => {
    const [templates, setTemplates] = useState([]);
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