// @ts-ignore
/* eslint-disable */
import { request, useModel } from 'umi';
import { TableListItem } from './data';

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
    data: TableListItem[];
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

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<TableListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addGoods(data?: { [key: string]: any }) {
  return request<TableListItem>('/admin/products', {
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
  // const { categories, fetchCategories } = useModel('categories');
export async function getCategories(params?: { [key: string]: any }) {
  return request<Record<string, any>>('/admin/categories', {
    method: 'GET',
    params,
  });
}
