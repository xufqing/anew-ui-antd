/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { normal } from '@/components/Notification';

const notice = normal;
/**
 * 异常处理程序
 */

const errorHandler = (error) => {
  const { response } = error;
  if (response && response.status) {
    const res = response.json();
    res.then((data) => {
      if (data.code !== 200) {
        notice.error(data.message);
      }
    });
  } else if (!response) {
    notice.error('您的网络发生异常，无法连接服务器');
  }

  return response;
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

// 全局response拦截器
request.interceptors.response.use(async (response) => {
  const data = await response.clone().json();
  if (data && data.code === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
    localStorage.removeItem('anew-authority');
    localStorage.removeItem('user');
    (() => {
      routerRedux.replace({
        pathname: '/login',
      });
    })();
  }
  if (data && !data.status) {
    const error = new Error(response.message);
    error.name = response.code;
    error.response = response;
    throw error;
  }
  return response;
});
// 全局request拦截器
request.interceptors.request.use(async (url, options) => {
  const token = localStorage.getItem('token');
  if (token && url !== '/api/auth/login') {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return {
      url: url,
      options: { ...options, headers: headers, interceptors: true },
    };
  }
  return { url: url, options: options, interceptors: true };
});
export default request;
