<template>
  <el-carousel height="350px" trigger="click" :interval="5000" type="card">
    <el-carousel-item v-for="image in data.images" :key="image.id"
      ><el-image
        style="width: 100%; height: 100%"
        :src="image.url"
        fit="cover"
      ></el-image
    ></el-carousel-item>
  </el-carousel>

  <div class="restaurant">
    <el-row :gutter="10">
      <!-- aside -->
      <el-col :span="6">
        <div class="counter__wrapper">
          <span class="counter">共 {{ data.restaurants.length }} 家餐廳</span>
        </div>
      </el-col>

      <!-- cards -->
      <el-col :span="18">
        <el-row :gutter="20">
          <el-col v-for="res in data.restaurants" :key="res.id" :span="8">
            <router-link class="link" :to="`/restaurant/${res.id}`">
              <el-card :body-style="{ padding: '0px' }">
                <el-image
                  style="width: 100%; height: 200px"
                  :src="res.imageUrl"
                  fit="cover"
                ></el-image>
                <div class="card__content">
                  <span class="title">{{ res.name }}</span>
                  <div class="card__content--info">
                    <el-tag size="mini" class="tag">{{
                      res.category.categoryName
                    }}</el-tag>
                    <el-tag size="mini" class="tag">{{
                      res.region.regionName
                    }}</el-tag>
                  </div>
                </div>
              </el-card>
            </router-link>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { axios } from '../plugins';
export default {
  name: 'Home',
  setup() {
    const data = reactive({
      images: [
        {
          id: 0,
          url: 'https://i.imgur.com/7VnVqbq.jpg'
        },
        {
          id: 1,
          url: 'https://i.imgur.com/4WLL9AV.jpg'
        },
        {
          id: 2,
          url: 'https://i.imgur.com/IYYQRLJ.jpg'
        },
        {
          id: 3,
          url: 'https://i.imgur.com/otpl2XE.jpg'
        },
        {
          id: 4,
          url: 'https://i.imgur.com/7jshXBX.jpg'
        },
        {
          id: 5,
          url: 'https://i.imgur.com/lnTU2uD.jpg'
        }
      ],
      restaurants: []
    });

    onMounted(async () => {
      const { data: restaurants } = await axios.get('/restaurant');
      data.restaurants = restaurants.result;
    });

    return { data };
  }
};
</script>

<style lang="scss" scoped>
.el-image,
.el-card {
  border-radius: 10px;
}

.counter__wrapper {
  width: 100%;
  text-align: center;
  .counter {
    font-size: 25px;
  }
}

.restaurant {
  width: 100%;
  margin-top: 20px;

  .link {
    text-decoration: none;
  }

  .el-card {
    margin-bottom: 23px;
  }

  .card__content {
    padding: 10px;
    display: flex;
    flex-flow: column nowrap;

    .title {
      font-size: 16px;
      font-weight: 700;
    }

    .card__content--info {
      display: flex;
      justify-content: right;
      margin: 5px 0;
    }

    .tag {
      margin-right: 8px;
    }
  }
}
</style>
