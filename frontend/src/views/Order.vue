<script>
import { onMounted, reactive } from '@vue/runtime-core';
import { axios } from '../plugins';
export default {
  name: 'Order',
  setup() {
    const data = reactive({ orders: [] });

    onMounted(async () => {
      const {
        data: { result }
      } = await axios.get('/order');
      data.orders = result;
    });

    return { data };
  }
};
</script>

<template>
  <div class="container">
    <span class="title">My Order</span>
    <section v-if="data.orders.length === 0">
      <el-empty description="無訂單記錄"></el-empty>
    </section>
    <section v-else>
      <el-card v-for="order in data.orders" :key="order.id">
        <template #header>
          <div class="card__header">
            <div class="title__wrapper">
              <el-image
                style="width: 100px; height: 100px; margin-right: 20px"
                :src="order.restaurant.imageUrl"
                fit="cover"
              ></el-image>
              <span class="title">{{ order.restaurant.name }}</span>
            </div>
            <span v-if="!order.isServed" class="meal__status--primary"
              >餐點製作中，請稍候</span
            >
            <span v-else class="meal__status--success">餐點已完成，可取餐</span>
          </div>
        </template>
        <div class="card__body">
          <div class="title">#{{ order.id }}</div>
          <span class="title">餐點明細</span>
          <div class="cart__details">
            <ol>
              <li v-for="cuisine in order.orderCuisines" :key="cuisine.id">
                {{ cuisine.cuisine.name }}•{{ cuisine.quantity }}
              </li>
            </ol>
          </div>
          <div class="cart__footer">
            <span class="info">
              Order Time:
              {{ new Date(order.created_at).toLocaleString() }}
            </span>
            <span class="bold">Total Amount: NT${{ order.totalAmount }}</span>
          </div>
        </div>
      </el-card>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;

  .title {
    font-size: 24px;
    font-weight: 800;
  }

  section {
    margin: 50px 0;
    width: 65%;

    .el-card {
      margin: 30px 0;
    }

    .card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title__wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .meal__status--primary {
        font-weight: 800;
        color: #226ec5;
      }
      .meal__status--success {
        font-weight: 800;
        color: #31aa5a;
      }
    }

    .cart__details {
      margin: 10px 0;
      padding: 0 50px;
    }

    .cart__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .info {
        font-weight: lighter;
      }
      .bold {
        font-weight: 800;
        font-size: 1.5rem;
      }
    }
  }
}
</style>
