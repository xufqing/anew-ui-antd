import request from 'umi-request';
export async function queryGroups(params) {
  return request('/api/v1/host/group/list', {
    params,
  });
}

export async function createGroup(params) {
  return request('/api/v1/host/group/create', {
    method: 'POST',
    data: params,
  });
}

export async function updateGroup(id, params) {
  return request('/api/v1/host/group/update/'+ id, {
    method: 'PATCH',
    data: params,
  });
}

export async function deleteGroup(params) {
  return request('/api/v1/host/group/delete', {
    method: 'DELETE',
    data: params,
  });
}