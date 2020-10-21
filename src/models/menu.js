import { getMenuTreeData } from '@/services/menu';
const MenuModel = {
  namespace: 'menu',
  state: {
    menuData:{},
  },
  effects: {
    *getMenuTree({ payload }, { put, call }) {
      const response = yield call(getMenuTreeData, payload);
      yield put({
        type: 'saveMenuData',
        payload: response.data,
      }); // Get Menu successfully
    },
  },
  reducers: {
    saveMenuData(state, { payload }) {
      return { ...state, menuData: payload };
    },
  },
};
export default MenuModel;
