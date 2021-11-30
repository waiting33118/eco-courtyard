<script>
import { computed } from '@vue/reactivity';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { onMounted } from '@vue/runtime-core';

export default {
  name: 'Navbar',
  setup() {
    const store = useStore();
    const router = useRouter();
    const userIsAuth = computed(() => store.getters.getIsAuth);
    const userInfo = computed(() => store.getters.getUserInfo);

    const handleLogout = () => {
      store.dispatch('setUserLogout');
      router.push('/auth');
    };

    onMounted(() => store.dispatch('setUserInfo'));

    return {
      userIsAuth,
      userInfo,
      handleLogout
    };
  }
};
</script>

<template>
  <div class="container">
    <router-link to="/" class="title"><h1>Eco-courtyard</h1></router-link>

    <el-menu
      mode="horizontal"
      background-color="transparent"
      class="menu"
      :ellipsis="false"
      default-active="/"
      text-color="#ffffff"
      active-text-color="#184d19"
      hover-background-color="transparent"
      router
    >
      <span class="greet" v-if="userIsAuth"
        >Hello, {{ userInfo.username }}</span
      >
      <el-menu-item v-if="!userIsAuth" index="/auth">Login/Signup</el-menu-item>

      <el-menu-item index="/cart">
        <div class="cart__wrapper">
          <el-badge
            v-if="userInfo.carts.length > 0"
            :value="userInfo.carts.length"
            type="primary"
          ></el-badge>
          Cart
        </div>
      </el-menu-item>

      <el-menu-item v-if="userIsAuth" index="/restaurant"
        >Restaurant</el-menu-item
      >
      <el-menu-item v-if="userIsAuth && userInfo.isAdmin" index="/maintenance"
        >Admin</el-menu-item
      >
      <span class="logout" v-if="userIsAuth" @click="handleLogout">Logout</span>
    </el-menu>
  </div>
</template>

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

  .menu {
    height: 100%;

    .greet {
      color: #ffffff;
      line-height: 60px;
      padding: 0 10px;
      user-select: none;
    }

    .logout {
      color: #ffffff;
      line-height: 60px;
      user-select: none;
      cursor: pointer;
      padding: 0 10px;
    }
  }

  .cart__wrapper {
    position: relative;

    .el-badge {
      position: absolute;
      left: 25px;
      top: -33px;
    }
  }
}
</style>
