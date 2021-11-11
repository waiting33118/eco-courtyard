<script>
import { onMounted, reactive, ref } from '@vue/runtime-core';
import { axios } from '../plugins';
export default {
  name: 'Maintenance',
  setup() {
    const table = reactive({
      category: [],
      region: []
    });
    const dialog = reactive({
      title: 'Edit',
      visible: false,
      placeholder: ''
    });
    const editCache = reactive({
      editType: '',
      newName: '',
      currentEditId: 0,
      index: 0
    });
    const newCategoryName = ref('');
    const newRegionName = ref('');

    // Dialog
    const handleBeforeClose = () => {
      dialog.visible = false;
    };

    // Category
    const handleCategoryEdit = (index, row) => {
      dialog.visible = true;
      dialog.title = 'Edit category';
      dialog.placeholder = 'new category name';
      const { id, categoryName } = row;
      editCache.newName = categoryName;
      editCache.currentEditId = id;
      editCache.index = index;
      editCache.editType = 'category';
    };

    const handleCategoryChange = async () => {
      dialog.visible = false;
      table.category[editCache.index].categoryName = editCache.newName;
      await axios.put(`/category/${editCache.currentEditId}`, {
        newCategoryName: editCache.newName
      });
    };

    const handleCategoryAdd = async () => {
      const { data } = await axios.post(`/category`, {
        categoryName: newCategoryName.value
      });
      const newCategory = {
        id: data.result.id,
        categoryName: data.result.categoryName
      };
      table.category.push(newCategory);
      newCategoryName.value = '';
    };

    const handleCategoryDelete = async (deleteIndex, row) => {
      const { id } = row;
      table.category = table.category.filter(
        (item, index) => index !== deleteIndex
      );
      await axios.delete(`/category/${id}`);
    };

    // Region

    const handleRegionAdd = async () => {
      const { data } = await axios.post(`/region`, {
        regionName: newRegionName.value
      });
      const newRegion = {
        id: data.result.id,
        regionName: data.result.regionName
      };
      table.region.push(newRegion);
      newRegionName.value = '';
    };

    const handleRegionEdit = (index, row) => {
      dialog.visible = true;
      dialog.title = 'Edit region';
      dialog.placeholder = 'new region name';
      const { id, regionName } = row;
      editCache.newName = regionName;
      editCache.currentEditId = id;
      editCache.index = index;
      editCache.editType = 'region';
    };

    const handleRegionChange = async () => {
      dialog.visible = false;
      table.region[editCache.index].regionName = editCache.newName;
      await axios.put(`/region/${editCache.currentEditId}`, {
        newRegionName: editCache.newName
      });
    };

    const handleRegionDelete = async (deleteIndex, row) => {
      const { id } = row;
      table.region = table.region.filter(
        (item, index) => index !== deleteIndex
      );
      await axios.delete(`/region/${id}`);
    };

    onMounted(async () => {
      const { data: categoryData } = await axios.get('/category');
      const { data: regionData } = await axios.get('/region');
      table.category = categoryData.result;
      table.region = regionData.result;
    });

    return {
      table,
      dialog,
      editCache,
      newCategoryName,
      newRegionName,
      handleBeforeClose,
      handleCategoryEdit,
      handleCategoryChange,
      handleCategoryAdd,
      handleCategoryDelete,
      handleRegionAdd,
      handleRegionEdit,
      handleRegionChange,
      handleRegionDelete
    };
  }
};
</script>

<template>
  <!-- dialog -->
  <el-dialog
    v-model="dialog.visible"
    :title="dialog.title"
    width="50%"
    :before-close="handleBeforeClose"
  >
    <el-input v-model="editCache.currentEditId" disabled>
      <template #prepend>ID</template>
    </el-input>
    <el-input
      v-model="editCache.newName"
      :placeholder="dialog.placeholder"
      clearable
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleBeforeClose">Cancel</el-button>
        <el-button
          v-if="editCache.editType === 'category'"
          type="primary"
          @click="handleCategoryChange"
          >Save</el-button
        >
        <el-button
          v-else-if="editCache.editType === 'region'"
          type="primary"
          @click="handleRegionChange"
          >Save</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- category -->
  <section class="section">
    <h1>Category</h1>
    <div class="wrapper">
      <el-input
        v-model="newCategoryName"
        placeholder="Add new category"
        class="add"
        clearable
      />
      <el-button type="primary" round @click="handleCategoryAdd">Add</el-button>
    </div>
    <el-table
      :data="table.category"
      style="width: 100%"
      stripe
      border
      height="300"
    >
      <el-table-column prop="id" label="ID" align="center" />
      <el-table-column
        prop="categoryName"
        label="Category Name"
        align="center"
      />
      <el-table-column prop="operations" label="operations" align="center">
        <template #default="scope">
          <el-button
            size="mini"
            @click="handleCategoryEdit(scope.$index, scope.row)"
            >Edit</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleCategoryDelete(scope.$index, scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </section>

  <!-- region -->
  <section class="section">
    <h1>Region</h1>
    <div class="wrapper">
      <el-input
        v-model="newRegionName"
        placeholder="Add new region"
        class="add"
        clearable
      />
      <el-button type="primary" round @click="handleRegionAdd">Add</el-button>
    </div>
    <el-table
      :data="table.region"
      style="width: 100%"
      stripe
      border
      height="300"
    >
      <el-table-column prop="id" label="ID" align="center" />
      <el-table-column prop="regionName" label="Region Name" align="center" />
      <el-table-column prop="operations" label="operations" align="center">
        <template #default="scope">
          <el-button
            size="mini"
            @click="handleRegionEdit(scope.$index, scope.row)"
            >Edit</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleRegionDelete(scope.$index, scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<style lang="scss" scoped>
.section {
  margin-bottom: 10px;
}
.wrapper {
  margin-bottom: 10px;
  .add {
    width: 300px;
    margin-right: 10px;
  }
}
</style>
