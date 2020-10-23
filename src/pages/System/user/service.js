import request from 'umi-request';
export async function queryUsers(params) {
  return request('/api/v1/user/list', {
    params,
  });
}
