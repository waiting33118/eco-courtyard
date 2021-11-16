<script>
import Navbar from './components/Navbar.vue';
export default {
  setup() {
    return {};
  },
  components: {
    Navbar
  }
};
</script>

<template>
  <el-container>
    <el-header>
      <navbar />
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

.el-header {
  display: flex;
  align-items: center;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.2);
  background-color: #67af67;
}
</style>
