<script>
import { computed, toRaw } from '@vue/runtime-core';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import axios from 'axios';

export default {
  name: 'Cart',
  setup() {
    const store = useStore();
    const router = useRouter();
    const carts = computed(() => store.getters.getCarts);
    const cartsByRestaurant = computed(
      () => store.getters.getCartsByRestaurant
    );

    const handleIncrement = async (cartId) => {
      let updatedQuantity = 0;
      const cartsToRaw = toRaw(carts.value);
      const updatedCarts = cartsToRaw.map((cart) => {
        if (cart.id === cartId) {
          const quantity = cart.quantity + 1;
          updatedQuantity = quantity;
          return { ...cart, quantity };
        }
        return cart;
      });

      try {
        await axios.put(`/cart/${cartId}`, { updatedQuantity });
        store.dispatch('updateCart', updatedCarts);
      } catch (error) {
        ElNotification({
          type: 'error',
          title: 'Failed to edit quantity',
          message: 'Oops! please try again'
        });
      }
    };

    const handleDecrement = async (cartId) => {
      let updatedQuantity = 0;
      const cartsToRaw = toRaw(carts.value);
      const updatedCarts = cartsToRaw.map((cart) => {
        if (cart.id === cartId && cart.quantity !== 1) {
          const quantity = cart.quantity - 1;
          updatedQuantity = quantity;
          return { ...cart, quantity };
        }
        return cart;
      });

      try {
        await axios.put(`/cart/${cartId}`, { updatedQuantity });
        store.dispatch('updateCart', updatedCarts);
      } catch (error) {
        ElNotification({
          type: 'error',
          title: 'Failed to edit quantity',
          message: 'Oops! please try again'
        });
      }
    };

    const handleDelete = async (cartId) => {
      const cartsToRaw = toRaw(carts.value);
      const updatedCarts = cartsToRaw.filter((cart) => cart.id !== cartId);
      try {
        await axios.delete(`/cart/${cartId}`);
        store.dispatch('updateCart', updatedCarts);
      } catch (error) {
        ElNotification({
          type: 'error',
          title: 'Failed to delete cart item',
          message: 'Oops! please try again'
        });
      }
    };

    const handleCheckOut = async (restaurantId) => {
      const cartIds = cartsByRestaurant.value[restaurantId].meals.map(
        (meal) => meal.cartId
      );
      try {
        await axios.post('/cart/checkout', { cartIds, restaurantId });
        store.dispatch('updateCartFromDb');
        router.push('/order');

        ElNotification({
          type: 'success',
          title: 'Your order is processing',
          message: 'Checking your order status in order page!'
        });
      } catch (error) {
        ElNotification({
          type: 'error',
          title: 'Failed to checkout',
          message: 'Oops! please try again'
        });
      }
    };

    return {
      carts,
      cartsByRestaurant,
      handleIncrement,
      handleDecrement,
      handleDelete,
      handleCheckOut
    };
  }
};
</script>

<template>
  <div class="container">
    <span class="title">My Cart</span>
    <el-empty
      v-if="carts.length === 0"
      description="購物車空空如也～"
    ></el-empty>

    <section
      v-else
      v-for="(cart, restaurantId) in cartsByRestaurant"
      :key="restaurantId"
      class="cart__wrapper"
    >
      <span class="title">{{ cart.name }}</span>
      <!-- table -->
      <el-table :data="cart.meals" style="width: 100%" stripe border>
        <el-table-column prop="cuisineName" label="Item Name" align="center" />
        <el-table-column label="Item Price" align="center">
          <template #default="scope"> NT${{ scope.row.price }} </template>
        </el-table-column>
        <el-table-column label="Quantity" align="center">
          <template #default="scope">
            <div class="quantity__column">
              <el-button
                :disabled="scope.row.quantity <= 1"
                type="primary"
                size="mini"
                round
                @click="handleDecrement(scope.row.cartId)"
              >
                -
              </el-button>
              <div>{{ scope.row.quantity }}</div>
              <el-button
                type="primary"
                size="mini"
                round
                @click="handleIncrement(scope.row.cartId)"
              >
                +
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Amount" align="center">
          <template #default="scope">
            NT${{ scope.row.price * scope.row.quantity }}
          </template>
        </el-table-column>
        <el-table-column label="Delete" align="center">
          <template #default="scope">
            <el-button type="danger" @click="handleDelete(scope.row.cartId)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <section class="total__wrapper">
        <div class="total">
          Total: NT${{ cart.totalAmount }}
          <el-divider></el-divider>
          <el-button type="warning" round @click="handleCheckOut(restaurantId)"
            >Checkout</el-button
          >
        </div>
      </section>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 85%;
  margin: 0 auto;

  .title {
    font-size: 25px;
    font-weight: 800;
    margin: 20px 0;
  }

  section {
    margin: 20px 0;
  }

  .el-card {
    width: 100%;
    margin-bottom: 20px;
    .el-card__body {
      width: 100%;
      .card__content {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
      }
    }
  }

  .quantity__column {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    align-items: center;
  }

  .total__wrapper {
    display: flex;
    justify-content: flex-end;
    .total {
      font-size: 40px;
      font-weight: 900;
      padding: 30px 0;

      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
