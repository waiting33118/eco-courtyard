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
      restaurant: null,
      carts: []
    },
    isAuthenticated: false
  },

  actions: {
    async setUserInfo({ commit }) {
      try {
        const { data } = await axios.get('/user/profile');
        commit('setUserInfo', { ...data.result });
        commit('setIsAuth', true);
      } catch {
        commit('setUserInfo', {
          userId: '',
          email: '',
          username: '',
          haveStore: false,
          isAdmin: false,
          restaurant: null,
          carts: []
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
        restaurant: null,
        carts: []
      });
      commit('setIsAuth', false);
    },

    async setRestaurantRegister({ dispatch }, formData) {
      await axios.post('/restaurant/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch('setUserInfo');
      router.push('/');
    },

    async setProductToCart({ commit, state }, product) {
      const index = state.userInfo.carts.findIndex(
        (item) => item.cuisine?.id === product.id
      );

      if (index === -1) {
        try {
          const {
            data: { result }
          } = await axios.post('/cart', {
            cuisineId: product.id,
            quantity: product.quantity
          });
          commit('setNewProductToCart', {
            ...product,
            cuisine: result.cuisine
          });
          return true;
        } catch {
          return false;
        }
      }

      const updatedQuantity =
        state.userInfo.carts[index].quantity + product.quantity;
      try {
        await axios.post('/cart', {
          cuisineId: product.id,
          quantity: updatedQuantity
        });
        commit('updateSpecificCartProduct', {
          targetIndex: index,
          updatedQuantity
        });
        return true;
      } catch {
        return false;
      }
    },

    async updateCartFromDb({ commit }) {
      const { data } = await axios.get('/cart');
      commit('updateCart', data.result);
    },

    updateCart({ commit }, newCarts) {
      commit('updateCart', newCarts);
    }
  },

  mutations: {
    setUserInfo(state, payload) {
      state.userInfo.userId = payload.userId;
      state.userInfo.email = payload.email;
      state.userInfo.username = payload.username;
      state.userInfo.haveStore = payload.haveStore;
      state.userInfo.isAdmin = payload.isAdmin;
      state.userInfo.restaurant = payload.restaurant;
      state.userInfo.carts = payload.carts;
    },

    setIsAuth(state, isAuth) {
      state.isAuthenticated = isAuth;
    },

    setNewProductToCart(state, product) {
      state.userInfo.carts.push(product);
    },

    updateSpecificCartProduct(state, { targetIndex, updatedQuantity }) {
      state.userInfo.carts[targetIndex].quantity = updatedQuantity;
    },

    updateCart(state, carts) {
      state.userInfo.carts = carts;
    }
  },

  getters: {
    getUserInfo(state) {
      return state.userInfo;
    },

    getIsAuth(state) {
      return state.isAuthenticated;
    },

    getCarts(state) {
      return state.userInfo.carts;
    }
  },
  modules: {}
});
