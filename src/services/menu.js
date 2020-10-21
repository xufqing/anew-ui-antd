import request from '@/utils/request';

export async function getMenuTreeData(params) {
  return request('/api/v1/menu/tree');
}
