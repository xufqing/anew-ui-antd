import { queryUserInfo } from '@/services/user';
const UserModel = {
  namespace: 'user',
  state: {
    userInfo: {},
  },
  effects: {
    *getUserInfo(_, { call, put }) {
      const response = yield call(queryUserInfo);
      yield put({
        type: 'saveUserInfo',
        payload: response.data,
      });
    },
  },
  reducers: {
    saveUserInfo(state, action) {
      return { ...state, userInfo: action.payload || {} };
    },
  },
};
export default UserModel;
