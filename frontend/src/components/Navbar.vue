<template>
  <div class="container">
    <router-link to="/" class="title"><h1>Eco-courtyard</h1></router-link>
    <div>
      <router-link to="/maintenance">Admin</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar'
};
</script>

<style lang="scss" scoped>
.title {
  text-decoration: none;
  color: #3d923d;
}

.container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
