import request from 'umi-request';
export async function updateUserInfo(id, params) {
  return request('/api/v1/user/info/update/' + id, {
    method: 'PATCH',
    data: params,
  });
}

export async function changePassword(params) {
  return request('/api/v1/user/changePwd', {
    method: 'PUT',
    data: params,
  });
}
