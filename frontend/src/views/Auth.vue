<script>
import { reactive, ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { axios } from '../plugins';
import { ElNotification } from 'element-plus';
export default {
  name: 'Auth',
  setup() {
    const store = useStore();
    const router = useRouter();
    const focusTab = ref('0');
    const loginForm = reactive({
      data: {
        email: '',
        password: ''
      }
    });
    const signupForm = reactive({
      data: {
        email: '',
        password: '',
        confirmPassword: ''
      }
    });
    const button = reactive({
      login: {
        isLoading: false
      },
      signup: {
        isLoading: false
      }
    });

    const handleLogin = async () => {
      button.login.isLoading = true;
      try {
        await axios.post('/user/login', {
          email: loginForm.data.email,
          password: loginForm.data.password
        });

        loginForm.data.email = '';
        loginForm.data.password = '';
        button.login.isLoading = false;
        const { data } = await axios.get('/user/profile');
        store.dispatch('setUserInfo', { ...data.result });
        store.dispatch('setIsAuth', true);
        router.push('/');
      } catch (error) {
        button.login.isLoading = false;
        loginForm.data.password = '';
        let errorMsg = '';
        if (error.response.status === 401) errorMsg = 'Credentails error';
        else errorMsg = error.response.data.reason;
        ElNotification({
          type: 'error',
          title: 'Error',
          message: errorMsg
        });
      }
    };
    const handleSignup = async () => {
      button.signup.isLoading = true;
      try {
        await axios.post('/user/signup', {
          email: signupForm.data.email,
          password: signupForm.data.password,
          confirmPassword: signupForm.data.confirmPassword
        });

        ElNotification({
          type: 'success',
          title: 'Registered successfully',
          message: 'Please login by your new account'
        });

        focusTab.value = '0';
        button.signup.isLoading = false;
        signupForm.data.email = '';
        signupForm.data.password = '';
        signupForm.data.confirmPassword = '';
      } catch (error) {
        button.signup.isLoading = false;
        signupForm.data.password = '';
        signupForm.data.confirmPassword = '';
        ElNotification({
          type: 'error',
          title: 'Error',
          message: error.response.data.reason
        });
      }
    };

    return {
      focusTab,
      button,
      loginForm,
      signupForm,
      handleLogin,
      handleSignup
    };
  }
};
</script>

<template>
  <div class="container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h1 class="header-title">Eco-CourtYard</h1>
        </div>
      </template>

      <el-tabs type="border-card" stretch v-model="focusTab">
        <!-- login tab -->
        <el-tab-pane label="Login">
          <el-form label-position="top" @submit.prevent :model="loginForm.data">
            <el-form-item label="Email">
              <el-input
                type="email"
                v-model="loginForm.data.email"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="Password">
              <el-input
                type="password"
                v-model="loginForm.data.password"
                show-password
                clearable
              ></el-input>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item>
              <el-button
                class="auth-button"
                type="primary"
                round
                :loading="button.login.isLoading"
                @click="handleLogin"
                >Login</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- signup tab -->
        <el-tab-pane label="Signup">
          <el-form
            label-position="top"
            @submit.prevent
            :model="signupForm.data"
          >
            <el-form-item label="Email">
              <el-input
                type="email"
                v-model="signupForm.data.email"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="Password">
              <el-input
                type="password"
                v-model="signupForm.data.password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="Confirm password">
              <el-input
                type="password"
                v-model="signupForm.data.confirmPassword"
                show-password
              ></el-input>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item>
              <el-button
                class="auth-button"
                round
                :loading="button.signup.isLoading"
                @click="handleSignup"
                >Signup</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 60px - 40px);
  display: flex;
  align-items: center;
  justify-content: center;

  .box-card {
    min-width: 350px;
    width: 400px;
    .card-header {
      text-align: center;
      .header-title {
        color: #3d923d;
      }
    }

    .auth-button {
      width: 100%;
    }
  }
}
</style>
