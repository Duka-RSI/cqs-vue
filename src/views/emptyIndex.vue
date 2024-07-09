<template>
    <div class="app-container">
        <div class="search-container">
            <el-form ref="queryFormRef" :inline="true">
                <el-form-item label="Search" prop="keywords">
                    <el-input v-model="searchQuery" placeholder="Role Name"
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
                    <span style="margin-right:10px; font-size:30px; font-weight: bold">Role List</span>
                    <el-button type="primary" @click="openDialog">Add</el-button>
                </div>
            </template>
            <el-table :data="pagedDatas" style="width: 100%">
                <el-table-column fixed prop="id" label="ID"></el-table-column>
                <el-table-column fixed prop="name" label="name"></el-table-column>
                <el-table-column fixed prop="code" label="code"></el-table-column>
                <el-table-column fixed prop="sort" label="sort"></el-table-column>
                <el-table-column fixed prop="status" label="status"></el-table-column>
                <el-table-column fixed prop="dataScope" label="dataScope"></el-table-column>
                <el-table-column fixed prop="deleted" label="deleted"></el-table-column>
                <el-table-column prop="createTime" label="createTime"></el-table-column>
                <el-table-column prop="updateTime" label="updateTime"></el-table-column>
                <el-table-column fixed="right" label="操作" min-width="135">
                    <template #default="scope">
                        <div class="action-buttons">
                            <el-button size="small" type="success" @click="editFunction(scope.row)">edit</el-button>
                            <el-button size="small" type="danger" @click="deleteFunction(scope.row)">delete</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :total="totalDatas" :page-size="pageSize"
                :current-page="currentPage" @current-change="handlePageChange" />
        </el-card>
        <!-- 新增、編輯 -->
        <el-dialog v-model="dialogFormVisible" title="Role" width="500">
            <el-form :model="currentData">
                <el-form-item label="name">
                    <el-input v-model="currentData.name"></el-input>
                </el-form-item>
                <el-form-item label="code">
                    <el-input v-model="currentData.code"></el-input>
                </el-form-item>
                <el-form-item label="sort">
                    <el-input v-model="currentData.sort"></el-input>
                </el-form-item>
                <el-form-item label="status">
                    <el-input v-model="currentData.status"></el-input>
                </el-form-item>
                <el-form-item label="datascopes">
                    <el-input v-model="currentData.datascopes"></el-input>
                </el-form-item>
                <el-form-item label="deleted">
                    <el-input v-model="currentData.deleted"></el-input>
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
import { usePostStore } from '@/stores/RoleStore';
import { ElMessageBox, ElMessage } from 'element-plus';
import { RoleModel as modelType } from "@/api/role/model";

const emptyModelInfo: modelType = {
    id: 0,
    name: '',
    code: '',
    sort: 0,
    status: 0,
    datascopes: 0,
    deleted: 0,
    createTime: '',
    updateTime: '',
};

const postStore = usePostStore();

// 新增、編輯 dialog
const dialogFormVisible = ref(false)

// 查詢字
const searchQuery = ref('');

// 頁數
const currentData = ref<modelType>({ ...emptyModelInfo });
const currentPage = ref(1);
const pageSize = ref(5);

const menus = ref<modelType[]>(postStore.getAllPosts);

const handlePageChange = (page: number) => {
    currentPage.value = page;
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


const openDialog = () => {
    currentData.value = emptyModelInfo;
    dialogFormVisible.value = true;
};




const editFunction = (modelType: modelType) => {
    currentData.value = { ...modelType };
    dialogFormVisible.value = true;
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
        console.error('Error deleting Role:', error);
    }
    // await postStore.getPostsAction();
};


const saveMenu = async () => {
    // 確保 tinyint 和 bigint 屬性為數字類型
    currentData.value.status = Number(currentData.value.status);
    currentData.value.datascopes = Number(currentData.value.datascopes);
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