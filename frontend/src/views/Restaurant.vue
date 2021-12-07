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
      {{ new Date(info.restaurant.updated_at).toGMTString() }}
    </el-descriptions-item>
  </el-descriptions>

  <!-- order -->
  <section class="section">
    <h1>Order Management</h1>
    <div class="order__wrapper">
      <el-card v-for="order in info.orders" :key="order.id">
        <div class="order__row--wrapper">
          <div class="order__row">
            <div>#{{ order.id }}</div>
            <div>訂購人: {{ order.user }}</div>
            <div>
              <div>
                訂單時間: {{ new Date(order.created_at).toGMTString() }}
              </div>
              <div v-if="order.isServed">
                出餐時間: {{ new Date(order.updated_at).toGMTString() }}
              </div>
            </div>
            <div>總金額: {{ order.totalAmount }}</div>
            <el-button
              :type="order.isServed ? 'success' : 'primary'"
              round
              :disabled="order.isServed"
              @click="handleShipment(order.id)"
              >{{ order.isServed ? '已出餐' : '出餐' }}</el-button
            >
          </div>
          <div class="order__items">
            <span>訂單明細 (共{{ order.orderCuisines.length }}項)</span>
            <ol>
              <li v-for="item in order.orderCuisines" :key="item.id">
                {{ item.cuisine.name }} x {{ item.quantity }}
              </li>
            </ol>
          </div>
        </div>
      </el-card>
    </div>
  </section>

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
      height="100vh"
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
import { ElNotification } from 'element-plus';
export default {
  name: 'Restaurant',
  setup() {
    const store = useStore();
    const userInfo = computed(() => store.getters.getUserInfo);
    const router = useRouter();
    const isReady = ref(false);
    const info = reactive({ restaurant: {}, orders: [] });
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

    const handleShipment = async (orderId) => {
      try {
        await axios.post('/order', { orderId, partial: { isServed: true } });
        info.orders = info.orders.map((order) => {
          if (order.id === orderId)
            return {
              ...order,
              isServed: true,
              updated_at: new Date().toUTCString()
            };
          return order;
        });
        ElNotification({
          type: 'success',
          title: `#${orderId} 已出餐`
        });
      } catch (error) {
        ElNotification({
          type: 'error',
          title: 'Oops, something wrong, please try again'
        });
      }
    };

    onMounted(async () => {
      const { data: restaurant } = await axios.get(
        `/restaurant/${userInfo.value.restaurant.id}`
      );
      info.restaurant = restaurant.result;
      isReady.value = true;

      const { data: orders } = await axios.get(
        `/order/restaurant/${userInfo.value.restaurant.id}`
      );
      info.orders = orders.result;
    });

    return {
      isReady,
      info,
      cuisine,
      handleEditRestaurant,
      handleAddCuisine,
      handleCuisineEdit,
      handleCuisineDelete,
      handleShipment
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

.order__wrapper {
  width: 100%;
  height: 100vh;
  border: 1px solid #ebeef5;
  padding: 10px;
  overflow-y: auto;

  .el-card {
    margin: 20px 0;
  }

  .order__row--wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .order__row {
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-around;
      align-items: center;
    }
    .order__items {
      width: 100%;
      padding: 10px 50px;
    }
  }
}
</style>
