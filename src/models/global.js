const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
  },
  effects: {
    
  },
  reducers: {
    changeLayoutCollapsed(
      state = {
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },
  },
};
export default GlobalModel;
