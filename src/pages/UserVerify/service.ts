import request from '@/utils/request';
import { TableListParams, TableListItem } from './data.d';

export async function queryRoom(params?: TableListParams) {
  params && (params.plot_id = 1);
  params.page = params.current;
  return request('/admin/user', {
    params: {
      ...params,
      method: 'selectUser',
    },
  });
}

export async function removeUserVerify(id: number) {
	//  params && (params.plot_id = 1);
	return request('/admin/user/'+ id + '/verify', {
	  method: 'delete',
	  params: {
		// ...params,
		method: 'removeUserVerify',
	  },
	});
  }

