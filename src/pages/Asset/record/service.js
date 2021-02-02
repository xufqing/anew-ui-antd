import request from 'umi-request';
export async function queryRecords(params) {
  return request('/api/v1/host/record/list', {
    params,
  });
}

export async function deleteRecord(params) {
  return request('/api/v1/host/record/delete', {
    method: 'DELETE',
    data: params,
  });
}
