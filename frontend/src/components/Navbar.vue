<template>
  <div class="container">
    <router-link to="/" class="title"><h1>Eco-courtyard</h1></router-link>
    <div>
      <span v-if="userIsAuth">Hello, {{ userInfo.username }}</span>
      <el-divider v-if="!userIsAuth" direction="vertical"></el-divider>
      <router-link v-if="!userIsAuth" to="/auth">Login/SignUp</router-link>
      <el-divider direction="vertical"></el-divider>
      <router-link to="/cart">Cart</router-link>
      <el-divider v-if="userIsAuth" direction="vertical"></el-divider>
      <router-link v-if="userIsAuth" to="/restaurant">Restaurant</router-link>
      <el-divider v-if="userInfo.isAdmin" direction="vertical"></el-divider>
      <router-link v-if="userInfo.isAdmin" to="/maintenance">Admin</router-link>
      <el-divider v-if="userIsAuth" direction="vertical"></el-divider>
      <el-button v-if="userIsAuth" size="mini" @click="handleLogout"
        >Logout</el-button
      >
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/reactivity';
import { useStore } from 'vuex';
import axios from '../plugins/axios';
import { useRouter } from 'vue-router';
import { onMounted } from '@vue/runtime-core';

export default {
  name: 'Navbar',
  setup() {
    const store = useStore();
    const router = useRouter();
    const userIsAuth = computed(() => store.getters.getIsAuth);
    const userInfo = computed(() => store.getters.getUserInfo);

    const handleLogout = async () => {
      try {
        await axios.post('/user/logout');
        store.dispatch('setIsAuth', false);
        store.dispatch('setUserInfo', {
          userId: '',
          email: '',
          username: '',
          haveStore: '',
          isAdmin: ''
        });
        router.push('/auth');
      } catch (error) {
        router.push('/auth');
      }
    };

    onMounted(async () => {
      try {
        const { data } = await axios.get('/user/profile');
        store.dispatch('setUserInfo', { ...data.result });
        store.dispatch('setIsAuth', true);
      } catch {
        store.dispatch('setIsAuth', false);
      }
    });

    return {
      userIsAuth,
      userInfo,
      handleLogout
    };
  }
};
</script>

<style lang="scss" scoped>
.title {
  text-decoration: none;
  color: #ffffff;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
