import { stringify } from 'querystring';
import { history } from 'umi';
import { AccountLogin,AccountLogout } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(AccountLogin, payload);

      if (response.status === true && response.code === 200) {
        yield put({
          type: 'changeLoginStatus',
          payload: response.data,
        }); // Login successfully
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('expires', response.data.expires);
        const userInfo = {
          id:response.data.id,
          username:response.data.username,
          name:response.data.name,
          avatar:response.data.avatar
        }
        localStorage.setItem('user',  JSON.stringify(userInfo));
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');
      }
    },

    *logout({ payload }, { call, put })  {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
      localStorage.removeItem('expires');
      localStorage.removeItem('anew-authority');
      localStorage.removeItem('user');
      yield call(AccountLogout, payload);
      localStorage.removeItem('token');
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
