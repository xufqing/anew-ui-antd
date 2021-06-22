const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    consoleWin: null,
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
    changeConsoleWin(
      state,
      { payload },
    ) {
      return { ...state, consoleWin: payload };
    },
  },
};
export default GlobalModel;
