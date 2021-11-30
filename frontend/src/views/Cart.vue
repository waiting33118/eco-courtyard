<script>
import { computed, toRaw } from '@vue/runtime-core';
import { useStore } from 'vuex';
import { ElNotification } from 'element-plus';
import axios from 'axios';
export default {
  name: 'Cart',
  setup() {
    const store = useStore();
    store.dispatch('updateCartFromDb');
    const carts = computed(() => store.getters.getCarts);
    const totalAmount = computed(() =>
      carts.value.reduce((sum, cart) => {
        return sum + cart.quantity * cart.cuisine.price;
      }, 0)
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

    const handleCheckOut = async () => {
      const cartsToRaw = toRaw(carts.value);
      const cartIds = cartsToRaw.map((cart) => cart.id);
      try {
        await axios.post('/cart/checkout', { cartIds });
        // TODO: clear vuex carts
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
      totalAmount,
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

    <section v-else class="cart__wrapper">
      <!-- table -->
      <el-table :data="carts" style="width: 100%" stripe border>
        <el-table-column
          prop="cuisine.restaurant.name"
          label="Store name"
          align="center"
        />
        <el-table-column prop="cuisine.name" label="Item Name" align="center" />
        <el-table-column label="Item Price" align="center">
          <template #default="scope">
            NT${{ scope.row.cuisine.price }}
          </template>
        </el-table-column>
        <el-table-column label="Quantity" align="center">
          <template #default="scope">
            <div class="quantity__column">
              <el-button
                :disabled="scope.row.quantity <= 1"
                type="primary"
                size="mini"
                round
                @click="handleDecrement(scope.row.id)"
              >
                -
              </el-button>
              <div>{{ scope.row.quantity }}</div>
              <el-button
                type="primary"
                size="mini"
                round
                @click="handleIncrement(scope.row.id)"
              >
                +
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Amount" align="center">
          <template #default="scope">
            NT${{ scope.row.cuisine.price * scope.row.quantity }}
          </template>
        </el-table-column>
        <el-table-column label="Delete" align="center">
          <template #default="scope">
            <el-button type="danger" @click="handleDelete(scope.row.id)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <section class="total__wrapper">
        <div class="total">
          Total: NT${{ totalAmount }}
          <el-divider></el-divider>
          <el-button type="warning" round @click="handleCheckOut"
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
