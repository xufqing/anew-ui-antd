import request from 'umi-request';
export async function querySSHFile(key, path) {
  return request('/api/v1/host/ssh/ls?key=' + key + '&path=' + path);
}

export async function deleteSSHFile(key, path) {
  return request('/api/v1/host/ssh/rm?key=' + key + '&path=' + path, {
    method: 'DELETE',
  });
}

export async function uploadSSHFile(key, path) {
  return request('/api/v1/host/ssh/upload?key=' + key + '&path=' + path, {
    method: 'POST',
  });
}
