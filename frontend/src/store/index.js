import { axios } from '../plugins';
import { createStore } from 'vuex';
import router from '../router';

export default createStore({
  state: {
    userInfo: {
      userId: 0,
      email: '',
      username: '',
      haveStore: false,
      isAdmin: false,
      restaurant: null
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
      state.userInfo.restaurant = payload.restaurant;
    },
    setIsAuth(state, isAuth) {
      state.isAuthenticated = isAuth;
    }
  },
  actions: {
    async setUserInfo({ commit }) {
      try {
        const { data } = await axios.get('/user/profile');
        commit('setUserInfo', { ...data.result });
        commit('setIsAuth', true);
      } catch (error) {
        commit('setUserInfo', {
          userId: '',
          email: '',
          username: '',
          haveStore: false,
          isAdmin: false,
          restaurant: null
        });
        commit('setIsAuth', false);
      }
    },

    async setUserLogout({ commit }) {
      await axios.post('/user/logout');
      commit('setUserInfo', {
        userId: '',
        email: '',
        username: '',
        haveStore: false,
        isAdmin: false,
        restaurant: null
      });
      commit('setIsAuth', false);
    },

    async setRestaurantRegister({ dispatch }, formData) {
      await axios.post('/restaurant/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch('setUserInfo');
      router.push('/');
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
