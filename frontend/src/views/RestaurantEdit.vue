<script>
import { computed, reactive, ref, toRaw } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { axios } from '../plugins';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
  name: 'RestaurantEdit',
  setup() {
    const store = useStore();
    const router = useRouter();
    const getUserfromStore = computed(() => store.getters.getUserInfo);
    const formEl = ref(null);
    let fileObject = null;
    const form = reactive({
      selectedCategory: '',
      selectedRegion: '',
      name: '',
      address: '',
      startTime: '',
      closeTime: ''
    });

    const fetchData = reactive({
      categories: [],
      regions: []
    });

    const formIsSubmitting = ref(false);
    // TODO:
    const handleFormSubmit = async (formElement) => {
      formIsSubmitting.value = true;
      // convert to origin object
      const originFormdata = toRaw(form);
      // create FormData instance
      const formData = new FormData(formElement.value);
      // add text fields into formdata instance
      for (let data in originFormdata) {
        formData.append(data, originFormdata[data]);
      }
      if (fileObject !== null) {
        formData.append('image', fileObject);
      }

      store.dispatch('setRestaurantRegister', formData);
      formIsSubmitting.value = false;
    };

    const handleImageUpload = (e) => {
      fileObject = e.target.files[0];
    };

    const handleCancelEdit = () => {
      router.push('/restaurant');
    };

    onMounted(async () => {
      const { data: categories } = await axios.get('/category');
      fetchData.categories = categories.result;
      const { data: regions } = await axios.get('/region');
      fetchData.regions = regions.result;
      const {
        data: { result }
      } = await axios.get(
        `/restaurant/${getUserfromStore.value.restaurant.id}`
      );
      form.name = result.name;
      form.address = result.address;
      form.startTime = result.startTime;
      form.closeTime = result.closeTime;
      form.selectedCategory = result.category.id;
      form.selectedRegion = result.region.id;
    });

    return {
      formEl,
      form,
      formIsSubmitting,
      fetchData,
      handleFormSubmit,
      handleCancelEdit,
      handleImageUpload
    };
  }
};
</script>

<template>
  <div class="container">
    <h1 class="title">Edit Restaurant</h1>
    <el-form class="form" :model="form" ref="formEl">
      <!-- restaurant name -->
      <el-form-item label="Restaurant Name:">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <!-- restaurant address -->
      <el-form-item label="Restaurant Address:">
        <el-input v-model="form.address"></el-input>
      </el-form-item>

      <!-- category select -->
      <el-form-item label="Category: ">
        <el-select
          v-model="form.selectedCategory"
          placeholder="Choose your food category"
        >
          <el-option
            v-for="category in fetchData.categories"
            :key="category.id"
            :label="category.categoryName"
            :value="category.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <!-- region select -->
      <el-form-item label="Region:">
        <el-select
          v-model="form.selectedRegion"
          placeholder="Choose your food region"
        >
          <el-option
            v-for="region in fetchData.regions"
            :key="region.id"
            :label="region.regionName"
            :value="region.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <!-- activity time -->
      <el-form-item label="Activity time:">
        <el-col>
          <el-time-select
            v-model="form.startTime"
            placeholder="Start time"
            start="00:00"
            step="00:15"
            end="23:45"
          >
          </el-time-select>
        </el-col>
        <el-col>-</el-col>
        <el-col>
          <el-time-select
            v-model="form.closeTime"
            placeholder="Close time"
            start="00:00"
            step="00:15"
            end="23:45"
          >
          </el-time-select>
        </el-col>
      </el-form-item>

      <!-- upload image -->
      <el-form-item label="Upload Restaurant Image (1 picture only):">
        <input
          type="file"
          name="image"
          accept="image/*"
          @change="handleImageUpload"
        />
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-button round native-type="button" @click="handleCancelEdit"
              >Cancel</el-button
            >
          </el-col>
          <el-col :span="12">
            <el-button
              type="primary"
              round
              native-type="button"
              :loading="formIsSubmitting"
              @click="handleFormSubmit(formEl)"
              >Submit</el-button
            >
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .form {
    width: 60%;

    .el-select {
      width: 100%;
    }

    .el-button {
      width: 100%;
    }
  }
}
</style>
