import request from 'umi-request';
export async function queryConnections(params) {
  return request('/api/v1/host/connection/list', {
    params,
  });
}

export async function deleteConnection(params) {
  return request('/api/v1/host/connection/delete', {
    method: 'DELETE',
    data: params,
  });
}