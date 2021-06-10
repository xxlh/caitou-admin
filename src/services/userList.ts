// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取规则列表 GET /api/rule */
export async function userList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.UserList>('/admin/user', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/user */
export async function updateUser(options?: { [key: string]: any }) {
  return request<API.UserListItem>('/api/user', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/user */
export async function addUser(options?: { [key: string]: any }) {
  return request<API.UserListItem>('/api/user', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/user */
export async function removeUser(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/user', {
    method: 'DELETE',
    ...(options || {}),
  });
}
