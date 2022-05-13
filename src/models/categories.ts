import { useState } from "react";
import { request } from "umi";
import _ from 'lodash/collection';

// export type InitialState = Models<'categories'>;

export default () => {
    const [categories, setCategories] = useState([]);
    const [categoriesByid, setCategoriesByid] = useState([]);
    const getCategories = async (params = {}) => {
        if (categories && categories.length) return categories;
        let cat = await request<Record<string, any>>('/admin/categories', {
          method: 'GET',
          params,
        });
        let catData = _.keyBy(cat, 'id');
        setCategories(cat);
        setCategoriesByid(catData);
        return cat.data;
    }
    return {categories, categoriesByid, setCategories, getCategories}
}