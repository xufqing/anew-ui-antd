import request from 'umi-request';
export async function queryRoles(params) {
  return request('/api/v1/role/list', {
    params,
  });
}

export async function createRole(params) {
  return request('/api/v1/role/create', {
    method: 'POST',
    data: params,
  });
}

export async function getRolePermsByID(id, params) {
  return request('/api/v1/role/perms/'+ id, {
    method: 'POST',
    data: params,
  });
}

export async function updateRole(id, params) {
  return request('/api/v1/role/update/'+ id, {
    method: 'PATCH',
    data: params,
  });
}
export async function updatePermsRole(id, params) {
  return request('/api/v1/role/perms/update/'+ id, {
    method: 'PATCH',
    data: params,
  });
}

export async function deleteRole(params) {
  return request('/api/v1/role/delete', {
    method: 'DELETE',
    data: params,
  });
}