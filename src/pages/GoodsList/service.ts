// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
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
export async function addGoods(params?: { [key: string]: any }) {
  return request<TableListItem>('/admin/products', {
    method: 'POST',
    params: {
      ...params,
      description: params.description.toHTML()
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
