import request from 'umi-request';
export async function queryUsers(params) {
  return request('/api/v1/user/list', {
    params,
  });
}

export async function createUser(params) {
  return request('/api/v1/user/create', {
    method: 'POST',
    data: params,
  });
}

export async function updateUser(id, params) {
  return request('/api/v1/user/update/'+ id, {
    method: 'PATCH',
    data: params,
  });
}

export async function deleteUser(params) {
  return request('/api/v1/user/delete', {
    method: 'DELETE',
    data: params,
  });
}