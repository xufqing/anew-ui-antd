import request from 'umi-request';
export async function queryRoles(params) {
  return request('/api/v1/role/list', {
    params,
  });
}