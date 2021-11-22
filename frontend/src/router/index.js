import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
import { computed } from '@vue/reactivity';
import { axios } from '../plugins';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('../views/Maintenance.vue')
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/Cart.vue')
  },
  {
    path: '/restaurant/register',
    name: 'RestaurantRegister',
    component: () => import('../views/RestaurantRegister.vue')
  },
  {
    path: '/restaurant',
    name: 'Restaurant',
    component: () => import('../views/Restaurant.vue')
  },
  {
    path: '/restaurant/edit',
    name: 'RestaurantEdit',
    component: () => import('../views/RestaurantEdit.vue')
  },
  {
    path: '/restaurant/:id',
    name: 'RestaurantDetail'
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

const whiteListRoutes = ['/', '/auth'];
const userIsAuth = computed(() => store.getters.getIsAuth);
const userInfo = computed(() => store.getters.getUserInfo);

router.beforeEach(async (to) => {
  if (whiteListRoutes.includes(to.path)) return true;
  if (!userIsAuth.value) {
    try {
      await axios.get('/user/profile');
    } catch {
      return '/auth';
    }
  }
  if (to.path === '/maintenance' && !userInfo.value.isAdmin) return '/';
  if (to.path === '/restaurant' && !userInfo.value.haveStore)
    return '/restaurant/register';
  return true;
});

export default router;
