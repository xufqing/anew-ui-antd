import request from 'umi-request';
export async function queryDicts(params) {
  return request('/api/v1/dict/list', {
    params,
  });
}

export async function createDict(params) {
  return request('/api/v1/dict/create', {
    method: 'POST',
    data: params,
  });
}

export async function updateDict(id, params) {
  return request('/api/v1/dict/update/'+ id, {
    method: 'PATCH',
    data: params,
  });
}

export async function deleteDict(params) {
  return request('/api/v1/dict/delete', {
    method: 'DELETE',
    data: params,
  });
}