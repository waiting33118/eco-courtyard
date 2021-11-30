<script>
import { computed, reactive, ref } from '@vue/reactivity';
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from '@vue/runtime-core';
import { axios } from '../plugins';
import { useStore } from 'vuex';
import { ElNotification } from 'element-plus';
export default {
  name: 'RestaurantDetail',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const isReady = ref(false);
    const info = reactive({ restaurant: {} });
    const drawer = reactive({
      isOpen: false,
      id: '',
      title: '',
      price: '',
      quantity: 1
    });
    const getUserAuth = computed(() => store.getters.getIsAuth);

    const clearDrawer = () => {
      drawer.id = '';
      drawer.title = '';
      drawer.price = '';
      drawer.quantity = 1;
    };

    const handleAddCuisine = async (cuisineId, cuisineName, cuisinePrice) => {
      // check login status
      if (!getUserAuth.value) {
        router.push('/auth');
        ElNotification({
          type: 'warning',
          title: 'Login required',
          message: 'Please login first before order meals'
        });
        return;
      }

      // cache selected cuisine in drawer
      drawer.id = cuisineId;
      drawer.title = cuisineName;
      drawer.price = cuisinePrice;
      drawer.isOpen = true;
    };

    const handleAddToCart = async () => {
      const condition = await store.dispatch('setProductToCart', {
        id: drawer.id,
        quantity: drawer.quantity
      });

      if (condition) {
        ElNotification({
          type: 'success',
          title: 'Success',
          message: 'Add Item to cart'
        });
      } else {
        ElNotification({
          type: 'error',
          title: 'Failed to add items to cart',
          message: 'Oops! please try again'
        });
      }

      clearDrawer();
      drawer.isOpen = false;
    };

    onMounted(async () => {
      const { data } = await axios.get(
        `/restaurant/${route.params.restaurantId}`
      );
      info.restaurant = data.result;
      isReady.value = true;
    });

    return {
      info,
      isReady,
      drawer,
      handleAddCuisine,
      handleAddToCart,
      clearDrawer
    };
  }
};
</script>

<template>
  <!-- drawer -->
  <el-drawer
    v-model="drawer.isOpen"
    :title="`選購餐點 - ${drawer.title}`"
    @closed="clearDrawer"
  >
    <el-row>
      <el-col :span="8">Item</el-col>
      <el-col :span="8">Price</el-col>
      <el-col :span="8">Quantity</el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        {{ drawer.title }}
      </el-col>
      <el-col :span="8"> NT${{ drawer.price }} </el-col>
      <el-col :span="8"> x {{ drawer.quantity }} </el-col>
    </el-row>
    <el-divider></el-divider>
    <div class="drawer__counter">
      <span>Total: NT$ {{ drawer.price * drawer.quantity }}</span>
    </div>

    <div class="drawer__control">
      <el-input-number v-model="drawer.quantity" :min="1" size="medium" />
      <el-button type="primary" round @click="handleAddToCart">
        Add To Cart
      </el-button>
    </div>
  </el-drawer>

  <!-- banner -->
  <img class="banner" :src="info.restaurant.imageUrl" alt="banner" />

  <!-- description -->
  <el-descriptions v-if="isReady" title="Restaurant Info" :column="3" border>
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
  </el-descriptions>

  <!-- products -->
  <section>
    <span class="section__title">Products</span>
    <el-row :gutter="10">
      <el-col
        v-for="cuisine in info.restaurant.cuisines"
        :key="cuisine.id"
        :span="6"
      >
        <el-card
          shadow="hover"
          @click="handleAddCuisine(cuisine.id, cuisine.name, cuisine.price)"
        >
          <div class="card__wrapper">
            <div class="card__content">
              <span>{{ cuisine.name }}</span>
              <span>NT ${{ cuisine.price }}</span>
            </div>
            <img src="../assets/add_to_cart.png" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<style lang="scss" scoped>
.banner {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
}

section {
  margin-top: 20px;

  .section__title {
    font-size: 20px;
    font-weight: 700;
  }

  .el-card {
    border-radius: 10px;
    margin-top: 10px;
    cursor: pointer;
    user-select: none;

    .card__wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .card__content {
        display: flex;
        flex-flow: column nowrap;
        height: 100px;
        justify-content: space-between;
      }

      img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        object-position: center;
      }
    }
  }

  .el-button {
    width: 100%;
    margin-left: 5px;
  }

  .el-drawer {
    .el-row {
      margin-bottom: 10px;
    }

    .drawer__counter {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      padding: 10px;
    }

    .drawer__control {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 10px;
    }
  }
}
</style>
