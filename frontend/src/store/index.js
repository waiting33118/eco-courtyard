import { createStore } from 'vuex';

export default createStore({
  state: {
    userInfo: {
      userId: 0,
      email: '',
      username: '',
      haveStore: false,
      isAdmin: false
    },
    isAuthenticated: false
  },
  mutations: {
    setUserInfo(state, payload) {
      state.userInfo.userId = payload.userId;
      state.userInfo.email = payload.email;
      state.userInfo.username = payload.username;
      state.userInfo.haveStore = payload.haveStore;
      state.userInfo.isAdmin = payload.isAdmin;
    },
    setIsAuth(state, isAuth) {
      state.isAuthenticated = isAuth;
    }
  },
  actions: {
    setUserInfo({ commit }, { userId, email, username, haveStore, isAdmin }) {
      commit('setUserInfo', { userId, email, username, haveStore, isAdmin });
    },
    /**
     * @param {boolean} isAuth
     */
    setIsAuth({ commit }, isAuth) {
      commit('setIsAuth', isAuth);
    }
  },
  getters: {
    getUserInfo(state) {
      return state.userInfo;
    },
    getIsAuth(state) {
      return state.isAuthenticated;
    }
  },
  modules: {}
});
