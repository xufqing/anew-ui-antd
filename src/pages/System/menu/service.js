import request from 'umi-request';
export async function queryMenus(params) {
  return request('/api/v1/menu/list', {
    params,
  });
}

export async function createMenu(params) {
  return request('/api/v1/menu/create', {
    method: 'POST',
    data: params,
  });
}

export async function updateMenu(id, params) {
  return request('/api/v1/menu/update/'+ id, {
    method: 'PATCH',
    data: params,
  });
}

export async function deleteMenu(params) {
  return request('/api/v1/menu/delete', {
    method: 'DELETE',
    data: params,
  });
}