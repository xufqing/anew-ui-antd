import request from 'umi-request';
export async function queryApis(params) {
  return request('/api/v1/api/list', {
    params,
  });
}

export async function createApi(params) {
  return request('/api/v1/api/create', {
    method: 'POST',
    data: params,
  });
}

export async function updateApi(id, params) {
  return request('/api/v1/api/update/'+ id, {
    method: 'PATCH',
    data: params,
  });
}

export async function deleteApi(params) {
  return request('/api/v1/api/delete', {
    method: 'DELETE',
    data: params,
  });
}