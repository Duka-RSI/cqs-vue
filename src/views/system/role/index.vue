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
                <el-table-column fixed prop="id" label="ID" sortable></el-table-column>
                <el-table-column fixed prop="name" label="name" sortable></el-table-column>
                <el-table-column fixed prop="status" label="status" sortable>
                    <template #default="{ row }">
                        {{ row.status ? '正常' : '禁用' }}
                    </template>
                </el-table-column>
                <el-table-column fixed prop="deleted" label="deleted" sortable>
                    <template #default="{ row }">
                        {{ row.deleted ? 'Yes' : 'No' }}
                    </template>
                </el-table-column>
                <el-table-column fixed prop="sort" label="sort" sortable></el-table-column>
                <el-table-column prop="createTime" label="createTime"></el-table-column>
                <el-table-column prop="updateTime" label="updateTime"></el-table-column>
                <el-table-column fixed="right" label="操作" min-width="135">
                    <template #default="scope">
                        <div class="action-buttons">
                            <el-button size="small" type="warning"
                                @click="editPermissionFunction(scope.row)">permission</el-button>
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
        <el-dialog v-model="dialogFormVisible" title="Role" width="500" @close="resetForm">
            <el-form :model="currentData" :rules="formRules" ref="currentDataRef">
                <el-form-item prop="name" label="name">
                    <el-input v-model="currentData.name"></el-input>
                </el-form-item>
                <!-- <el-form-item label="code">
                    <el-input v-model="currentData.code"></el-input>
                </el-form-item> -->
                <el-form-item label="sort">
                    <el-input-number v-model="currentData.sort" controls-position="right" style="width: 100px"
                        :min="0" />
                </el-form-item>
                <el-form-item label="status">
                    <el-radio-group v-model="currentData.status">
                        <el-radio :label="1">正常</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- <el-form-item label="datascopes">
                    <el-input v-model="currentData.datascopes"></el-input>
                </el-form-item> -->
                <el-form-item label="deleted">
                    <el-select v-model="currentData.deleted">
                        <el-option v-for="item in yesNoList" :key="item.id" :value="item.id"
                            :label="item.value"></el-option>
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

        <!-- 權限設定 -->
        <el-dialog v-model="dialogPermissionFormVisible" title="Permission" width="500">
            <el-form :model="currentData">
                <el-scrollbar max-height="600px">
                    <el-tree :data="menus" show-checkbox default-expand-all ref="menuRef" node-key="value">
                    </el-tree>

                </el-scrollbar>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogPermissionFormVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="handleRoleMenuSubmit">
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
import { usePostStore as menuPostStore, menusChildren } from '@/stores/MenuStore';
import { ElMessageBox, FormInstance, ElTree, ElMessage } from 'element-plus';
import { RoleModel as modelType } from "@/api/role/model";
import { yseNoList, SelectTreeModel } from "@/model/model";
import menuApi from "@/api/menu/menuApi";
// import { Menu } from '@/api/menu/model';


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

const yesNoList = ref(yseNoList);
const postStore = usePostStore();
const menupostStore = menuPostStore();

// 新增、編輯 dialog
const dialogFormVisible = ref(false)
// 權限設定 dialog
const dialogPermissionFormVisible = ref(false)

// 查詢字
const searchQuery = ref('');

// 頁數
const currentData = ref<modelType>({ ...emptyModelInfo });
const currentPage = ref(1);
const pageSize = ref(5);

const menus = ref<SelectTreeModel[]>([]);
const menuRef = ref(ElTree);
const currentDataRef = ref<FormInstance>(); // 表單ref

//驗證規則
const formRules =
{
    name: [
        {
            required: true,
            message: '請輸入名稱',
            trigger: 'blur'
        },
    ],
};

const resetForm = () => {
    currentDataRef.value?.resetFields();
};

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


const editPermissionFunction = async (modelType: modelType) => {
    currentData.value = { ...modelType };
    menus.value = [];
    await menupostStore.getPostsAction()
        .then((data) => {
            for (const menu of menupostStore.posts) {
                if (menu.type === 2) {
                    menus.value.push({
                        value: menu.id,
                        label: menu.name,
                        children: menusChildren(menu.children),
                    });
                }
            }
        });

    menuApi.getSysMenusIDByRoleId(currentData.value.id)
        .then((res) => {
            res.data.forEach((id: number) =>
                menuRef.value.setChecked(id, true, false)
            );
        });

    dialogPermissionFormVisible.value = true;
};

const handleRoleMenuSubmit = async () => {
    try {
        const checkedMenuIds: number[] = menuRef.value
            .getCheckedNodes(false, true)
            .map((node: any) => node.value);
        await menuApi.updateSysRoleMenus(currentData.value.id, checkedMenuIds)
            .then((res) => {
                ElMessage.success("permission Success");
                dialogPermissionFormVisible.value = false;
            });
    } catch (error: any) {
        ElMessage.error('Error updating permission:', error);
    }
}

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
                // ElMessage({
                //     type: 'info',
                //     message: `action: ${action}`,
                // })
            })
        }

        confirmDelete();

    } catch (error) {
        console.error('Error deleting Role:', error);
    }
    // await postStore.getPostsAction();
};


const saveMenu = async () => {
    currentDataRef.value?.validate(async (valid) => {
        if (!valid) return;
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