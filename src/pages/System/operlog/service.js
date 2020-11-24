import request from 'umi-request';
export async function queryOperlogs(params) {
  return request('/api/v1/operlog/list', {
    params,
  });
}

export async function deleteOperlog(params) {
  return request('/api/v1/operlog/delete', {
    method: 'DELETE',
    data: params,
  });
}