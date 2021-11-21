<template>
  <!-- banner -->
  <img class="banner" :src="info.restaurant.imageUrl" alt="banner" />

  <!-- description -->
  <el-descriptions v-if="isReady" title="Restaurant Info" :column="3" border>
    <template #extra>
      <el-button type="primary" size="medium" round>Edit</el-button>
    </template>
    <el-descriptions-item>
      <template #label> Restaurant name </template>
      {{ info.restaurant.name }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label> Category </template>
      {{ info.restaurant.category.categoryName }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label> Region </template>
      {{ info.restaurant.region.regionName }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label> Start Time </template>
      {{ info.restaurant.startTime }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label> Close Time </template>
      {{ info.restaurant.closeTime }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label> Address </template>
      {{ info.restaurant.address }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label> Last update time </template>
      {{ new Date(info.restaurant.updated_at) }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
import { computed, onMounted, reactive, ref } from '@vue/runtime-core';
import { axios } from '../plugins';
import { useStore } from 'vuex';
export default {
  name: 'Restaurant',
  setup() {
    const store = useStore();
    const userInfo = computed(() => store.getters.getUserInfo);
    const isReady = ref(false);
    const info = reactive({ restaurant: {} });

    onMounted(async () => {
      const { data } = await axios.get(
        `/restaurant/${userInfo.value.restaurant.id}`
      );
      info.restaurant = data.result;
      isReady.value = true;
    });

    return { isReady, info };
  }
};
</script>

<style lang="scss" scoped>
.banner {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
}
</style>
