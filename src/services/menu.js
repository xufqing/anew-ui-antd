import request from '@/utils/request';

export async function getMenuTreeData() {
  return request('/api/v1/menu/tree');
}
