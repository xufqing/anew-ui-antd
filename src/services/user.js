import request from '@/utils/request';

export async function queryUserInfo() {
  return request('/api/v1/user/info',{
    method: 'POST',
  });
}