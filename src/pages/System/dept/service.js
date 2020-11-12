import request from 'umi-request';
export async function queryDepts(params) {
  return request('/api/v1/dept/list', {
    params,
  });
}

export async function createDept(params) {
  return request('/api/v1/dept/create', {
    method: 'POST',
    data: params,
  });
}

export async function updateDept(id, params) {
  return request('/api/v1/dept/update/'+ id, {
    method: 'PATCH',
    data: params,
  });
}

export async function deleteDept(params) {
  return request('/api/v1/dept/delete', {
    method: 'DELETE',
    data: params,
  });
}