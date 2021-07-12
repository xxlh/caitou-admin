import { useState } from "react";
import { request } from "umi";

// export type InitialState = Models<'categories'>;

export default () => {
    const [categories, setCategories] = useState([]);
    const getCategories = async (params = {}) => {
        if (categories && categories.length) return categories;
        let cat = await request<Record<string, any>>('/admin/categories', {
          method: 'GET',
          params,
        });
        setCategories(cat.data);
        return cat.data;
    }
    return {categories, setCategories, getCategories}
}