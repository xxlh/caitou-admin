// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { GoodsItemType } from './data';

/** 获取规则列表 GET /api/rule */
export async function goods(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  sort?: { [key: string]: any },
  filter?: { [key: string]: any },
) {
  return request<{
    data: GoodsItemType[];
    /** 列表的内容总数 */
    total?: number;
  }>('/admin/products', {
    method: 'GET',
    params: {
      page: params.current,
      per_page: params.pageSize,
      order: Object.keys(sort).length ? Object.keys(sort)[0] + (Object.values(sort)[0]=='ascend'?'_asc':'_desc') : null,
      title: params.title,
      on_sale: params.on_sale || filter.on_sale?.join(','),
      category_ids: params.category,
      search: params.search,
      // ...params,
    },
  });
}

export async function getGoods(id:number) {
  return request<{product:GoodsItemType}>(`/admin/products/${id}`, {
    method: 'GET',
  });
}

/** 新建规则 PUT /api/rule */
export async function updateGoods(id:number, data?: { [key: string]: any }) {
  return request<GoodsItemType>(`/admin/products/${id}`, {
    method: 'PATCH',
    data,
  });
}
export async function updateSku(id:number, skuId:number, data?: { [key: string]: any }) {
  return request<TableListItem>(`/admin/products/${id}/sku/${skuId}`, {
    method: 'PATCH',
    data: data,
  });
}

/** 新建规则 POST /api/rule */
export async function addGoods(data?: { [key: string]: any }) {
  return request<GoodsItemType>('/admin/products', {
    method: 'POST',
    data,
  });
}
export async function addGoodsSpec(id:number, data?: { [key: string]: any }) {
  return request<TableListItem>(`/admin/products/${id}/spec`, {
    method: 'POST',
    data: data,
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeGoods(params?: { [ids: string]: any }) {
  return request<Record<string, any>>('/admin/products', {
    method: 'DELETE',
    params: params,
  });
}

/** 拉取类别 */
export async function getGoodsCategories(id:number) {
  return request<Record<string, any>>(`/admin/products/${id}/categories`, {
    method: 'GET',
  });
}
