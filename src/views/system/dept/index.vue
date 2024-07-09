<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :inline="true">
        <el-form-item label="Search" prop="keywords">
          <el-input v-model="searchQuery" placeholder="Deptarment Name"
            style="width: 200px; margin-right: 10px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="searchFunction">reset</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span style="margin-right:10px; font-size:30px; font-weight: bold">Department List</span>
          <el-button type="primary" @click="openDialog(0)">Add</el-button>
        </div>
      </template>
      <el-table :data="pagedDatas" row-key="id" style="width: 100%">
        <!-- <el-table-column fixed prop="id" label="ID"></el-table-column> -->
        <el-table-column fixed prop="name" label="name"></el-table-column>
        <!-- <el-table-column fixed prop="parentId" label="parentId"></el-table-column>
        <el-table-column fixed prop="treePath" label="treePath"></el-table-column> -->
        <el-table-column fixed prop="sort" label="sort"></el-table-column>
        <el-table-column fixed prop="status" label="status">
          <template #default="{ row }">
            {{ row.status ? '正常' : '禁用' }}
          </template>
        </el-table-column>
        <!-- <el-table-column fixed prop="deleted" label="deleted">
          <template #default="{ row }">
            {{ row.deleted ? 'Yes' : 'No' }}
          </template>
        </el-table-column> -->
        <el-table-column prop="createTime" label="createTime"></el-table-column>
        <el-table-column prop="updateTime" label="updateTime"></el-table-column>
        <el-table-column fixed="right" label="operate" min-width="135">
          <template #default="scope">
            <div class="action-buttons">
              <el-button size="small" type="primary" @click="openDialog(scope.row.id)">Add</el-button>
              <el-button size="small" type="success" @click="editFunction(scope.row)">edit</el-button>
              <el-button size="small" type="danger" @click="deleteFunction(scope.row)">delete</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next" :total="totalDatas" :page-size="pageSize" :current-page="currentPage"
        @current-change="handlePageChange" />
    </el-card>
    <!-- 新增、編輯 -->
    <el-dialog v-model="dialogFormVisible" title="Department" width="500" @close="resetForm">
      <el-form :model="currentData" :rules="formRules" ref="currentDataRef">
        <el-form-item label="parentId">
          <!-- <el-input v-model="currentData.parentId"></el-input> -->
          <el-tree-select v-model="currentData.parentId" :data="topDepartments" :render-after-expand="false"
            check-strictly show-checkbox style="width: 240px" />
        </el-form-item>
        <el-form-item prop="name" label="name">
          <el-input v-model="currentData.name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="treePath">
          <el-input v-model="currentData.treePath"></el-input>
        </el-form-item> -->
        <el-form-item label="sort">
          <!-- <el-input v-model="currentData.sort"></el-input> -->
          <el-input-number v-model="currentData.sort" controls-position="right" style="width: 100px" :min="0" />
        </el-form-item>
        <el-form-item label="status">
          <!-- <el-input v-model="currentData.status"></el-input> -->
          <el-radio-group v-model="currentData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="deleted">
          <!-- <el-input v-model="currentData.deleted"></el-input> -->
          <el-select v-model="currentData.deleted">
            <el-option v-for="item in yesNoList" :key="item.id" :value="item.id" :label="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveMenu">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, h, computed } from 'vue'
import { usePostStore } from '@/stores/DeptStore';
import { deptsChildren } from "@/stores/DeptStore";
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import { DeptModel as modelType } from "@/api/dept/model";
import { yseNoList, SelectTreeModel } from "@/model/model";
import deptApi from '@/api/dept/deptApi';

const emptyModelInfo: modelType = {
  id: 0,
  name: '',
  parentId: 0,
  treePath: '',
  sort: 0,
  status: 1,
  deleted: 0,
  createTime: '',
  updateTime: '',
  createBy: 0,
  updateBy: 0,
  children: [],
};

const yesNoList = ref(yseNoList);
const topDepartments = ref<SelectTreeModel[]>([]);
const postStore = usePostStore();

// 新增、編輯 dialog
const dialogFormVisible = ref(false)

// 查詢字
const searchQuery = ref('');

// 頁數
const currentData = ref<modelType>({ ...emptyModelInfo });
const currentPage = ref(1);
const pageSize = ref(5);

const currentDataRef = ref<FormInstance>(); // 表單ref
//驗證規則
const formRules =
{
  name: [
    {
      required: true,
      trigger: "blur",
      message: "請輸入部門名稱",
    },
    {
      min: 2,
      trigger: "blur",
      message: "部門名稱不能少於2個字",
    },
  ]
}

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const resetForm = () => {
  currentDataRef.value?.resetFields();
};

const filteredDatas = computed(() => {
  return postStore.posts.filter(data =>
    (data.name?.includes(searchQuery.value) ?? false)
  );
});

const pagedDatas = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  // return postStore.posts.slice(start, end);
  return filteredDatas.value.slice(start, start + pageSize.value);
});

const totalDatas = computed(() => filteredDatas.value.length);

const searchFunction = () => {
  currentPage.value = 1; // 每次搜索时重置为第一页
  searchQuery.value = "";
};

onMounted(() => {
  postStore.getPostsAction();
});


const openDialog = (deptId: number) => {
  currentData.value = { ...emptyModelInfo };
  dialogFormVisible.value = true;
  if (deptId > 0) {
    currentData.value.parentId = deptId;
  }
  updateTopDepartments();
};


const editFunction = (modelType: modelType) => {
  currentData.value = { ...modelType };
  dialogFormVisible.value = true;
  updateTopDepartments();
};

const updateTopDepartments = async () => {
  topDepartments.value = await getParentDept(0);
  // getParentDept(currentData.value.parentId).then((departments) => {
  //   topDepartments.value = departments;
  // });
};

const getParentDept = async (parentId: number): Promise<SelectTreeModel[]> => {
  try {
    const departments: SelectTreeModel[] = [];
    await deptApi.getSysDeptsTreeById(parentId)
      .then((res) => {
        // departments.value = res.data;
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].status === 0) continue;
          departments.push({
            value: res.data[i].id,
            label: res.data[i].name,
            children: deptsChildren(res.data[i].children),
          });
        }
      });
    return departments;
  }
  catch (error) {
    console.error('Error getParentDept:', error);
    return [];
  }
};

const deleteFunction = async (modelType: modelType) => {
  try {
    // await postStore.removePostAction(menu.id);
    const deleteAction = async () => {
      try {
        await postStore.removePostAction(modelType.id);
      } catch (error) {
        console.error('Error deleting menu:', error);
      }
      await postStore.getPostsAction();
    }

    const confirmDelete = () => {
      ElMessageBox({
        title: 'Message',
        message: h('p', null, [
          h('span', null, 'confirm delete?'),
        ]),
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.showCancelButton = false,
              instance.confirmButtonLoading = true
            instance.confirmButtonText = 'Loading...';
            deleteAction();
            instance.confirmButtonLoading = false;
            done();
          } else {
            done()
          }
        },
      }).then((action) => {
        ElMessage({
          type: 'info',
          message: `action: ${action}`,
        })
      })
    }

    confirmDelete();

  } catch (error) {
    console.error('Error deleting Dept:', error);
  }
  // await postStore.getPostsAction();
};


const saveMenu = async () => {
  currentDataRef.value?.validate(async (valid) => {
    if (!valid) return;
    // 確保 tinyint 和 bigint 屬性為數字類型
    currentData.value.parentId = Number(currentData.value.parentId);
    currentData.value.sort = Number(currentData.value.sort);
    currentData.value.status = Number(currentData.value.status);
    currentData.value.deleted = Number(currentData.value.deleted);
    const now = new Date();
    currentData.value.updateTime = now.toISOString();

    if (currentData.value.id) {
      try {
        await postStore.editPostAction(currentData.value);
      } catch (error) {
        console.error('Error updating Dept:', error);
      }
    } else {
      try {
        currentData.value.createTime = now.toISOString();
        await postStore.addPostAction(currentData.value);
      } catch (error) {
        console.error('Error adding Dept:', error);
      }
    }
    dialogFormVisible.value = false;
    await postStore.getPostsAction();
  });
};

</script>
<style scoped>
/* .el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
} */

/* 调整按钮之间的间距 */
.action-buttons {
  display: flex;
  gap: 10px;
}
</style>