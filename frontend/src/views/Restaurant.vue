<template>
  <!-- banner -->
  <img class="banner" :src="info.restaurant.imageUrl" alt="banner" />

  <!-- description -->
  <el-descriptions v-if="isReady" title="Restaurant Info" :column="3" border>
    <template #extra>
      <el-button
        type="primary"
        size="medium"
        round
        @click="handleEditRestaurant"
      >
        Edit
      </el-button>
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

  <!-- cuisine table-->
  <section class="section">
    <h1>Cuisine Management</h1>
    <el-row :gutter="5">
      <el-col :span="4">
        <el-input
          v-model="cuisine.name"
          placeholder="Add New Cuisine"
          clearable
        />
      </el-col>
      <el-col :span="4">
        <el-input
          type="number"
          v-model="cuisine.price"
          placeholder="Cuisine Price"
        />
      </el-col>
      <el-col :span="4">
        <el-button type="primary" round @click="handleAddCuisine"
          >Add</el-button
        >
      </el-col>
    </el-row>

    <el-table
      :data="info.restaurant.cuisines"
      style="width: 100%"
      stripe
      border
      height="500"
    >
      <el-table-column prop="id" label="ID" align="center" />
      <el-table-column prop="name" label="Cuisine Name" align="center" />
      <el-table-column prop="price" label="Price" align="center" />
      <el-table-column prop="operations" label="operations" align="center">
        <template #default="scope">
          <el-button
            size="mini"
            @click="handleCuisineEdit(scope.$index, scope.row)"
            >Edit</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleCuisineDelete(scope.$index, scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import { computed, onMounted, reactive, ref } from '@vue/runtime-core';
import { axios } from '../plugins';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
  name: 'Restaurant',
  setup() {
    const store = useStore();
    const userInfo = computed(() => store.getters.getUserInfo);
    const router = useRouter();
    const isReady = ref(false);
    const info = reactive({ restaurant: {} });
    const cuisine = reactive({ name: '', price: '' });

    const handleEditRestaurant = () => {
      router.push('/restaurant/edit');
    };

    const handleAddCuisine = async () => {
      const { data } = await axios.post('/cuisine', {
        cuisineName: cuisine.name,
        price: cuisine.price
      });
      const { id, name, price } = data.result;
      info.restaurant.cuisines.push({ id, name, price });
      cuisine.name = '';
      cuisine.price = '';
    };

    // TODO:
    const handleCuisineEdit = (index, row) => {};
    // TODO:
    const handleCuisineDelete = (index, row) => {};

    onMounted(async () => {
      const { data } = await axios.get(
        `/restaurant/${userInfo.value.restaurant.id}`
      );
      info.restaurant = data.result;
      isReady.value = true;
    });

    return {
      isReady,
      info,
      cuisine,
      handleEditRestaurant,
      handleAddCuisine,
      handleCuisineEdit,
      handleCuisineDelete
    };
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

.section {
  margin-top: 20px;

  .el-table {
    margin-top: 20px;
  }
}
</style>
