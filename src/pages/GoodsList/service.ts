// @ts-ignore
/* eslint-disable */
import { request, useModel } from 'umi';
import { GoodsItem, TableListItem } from './data';

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
    data: GoodsItem[];
    /** 列表的内容总数 */
    total?: number;
  }>('/admin/products', {
    method: 'GET',
    params: {
      page: params.current,
      per_page: params.pageSize,
      order: sort ? Object.keys(sort)[0] + (Object.values(sort)[0]=='ascend'?'_asc':'_desc') : null,
      title: params.title,
      on_sale: params.on_sale || filter.on_sale?.join(','),
      search: params.search,
      // ...params,
    },
  });
}

export async function getGoods(id:number) {
  return request<{product:GoodsItem}>(`/admin/products/${id}`, {
    method: 'GET',
  });
}

/** 新建规则 PUT /api/rule */
export async function updateGoods(id:number, data?: { [key: string]: any }) {
  return request<GoodsItem>(`/admin/products/${id}`, {
    method: 'PATCH',
    data: data,
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
  return request<GoodsItem>('/admin/products', {
    method: 'POST',
    data: {
      ...data,
      images: data?.images?.map((img:any) => img?.url),
      description: data?.description?.toHTML()
    },
  });
}
export async function addGoodsSpec(id:number, data?: { [key: string]: any }) {
  return request<TableListItem>(`/admin/products/${id}/spec`, {
    method: 'POST',
    data: data,
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 拉取类别 */
export async function getGoodsCategories(id:number) {
  return request<Record<string, any>>(`/admin/products/${id}/categories`, {
    method: 'GET',
  });
}
