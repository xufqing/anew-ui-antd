import request from 'umi-request';
export async function queryHosts(params) {
  return request('/api/v1/host/list', {
    params,
  });
}

export async function queryHostByID(id) {
  return request('/api/v1/host/info/' + id)
}

export async function createHost(params) {
  return request('/api/v1/host/create', {
    method: 'POST',
    data: params,
  });
}

export async function updateHost(id, params) {
  return request('/api/v1/host/update/'+ id, {
    method: 'PATCH',
    data: params,
  });
}

export async function deleteHost(params) {
  return request('/api/v1/host/delete', {
    method: 'DELETE',
    data: params,
  });
}