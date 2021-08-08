import { useState } from "react";
import { request } from "umi";

export default () => {
    const [fields, setFields] = useState([]);
    const getFields = async (params = {}) => {
        if (fields && fields.length) return fields;
        let res = await request<Record<string, any>>('/admin/fields', {
          method: 'GET',
          params,
        });
        setFields(res);
        return res;
    }
    return {fields, setFields, getFields}
}