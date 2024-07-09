<template>
    <div class="app-container">
        <div class="search-container">
            <el-form ref="queryFormRef" :inline="true">
                <el-form-item label="Search" prop="keywords">
                    <el-input v-model="searchQuery" placeholder="username"
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
                    <span style="margin-right:10px; font-size:30px; font-weight: bold">User List</span>
                    <el-button type="primary" @click="openDialog">Add</el-button>
                </div>
            </template>
            <el-table :data="pagedDatas" style="width: 100%">
                <el-table-column fixed prop="id" label="ID"></el-table-column>
                <el-table-column fixed prop="username" label="username" sortable></el-table-column>
                <el-table-column fixed prop="password" label="password">
                    <template #default="scope">
                        <input type="password" v-model="scope.row.password" style="border: none;" />
                    </template>
                </el-table-column>
                <el-table-column fixed prop="roleName" label="roleName" sortable> </el-table-column>
                <el-table-column fixed prop="deptName" label="deptName" sortable></el-table-column>
                <!-- <el-table-column fixed prop="deptId" label="deptId"></el-table-column> -->
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
                <el-table-column fixed prop="adusername" label="adusername"></el-table-column>
                <el-table-column prop="createTime" label="createTime"></el-table-column>
                <el-table-column prop="updateTime" label="updateTime"></el-table-column>
                <el-table-column fixed="right" label="operate" min-width="135">
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
        <el-dialog v-model="dialogFormVisible" title="User" width="500" @close="resetForm">
            <el-form :model="currentData" :rules="formRules" ref="currentDataRef" label-width="100px">
                <el-form-item prop="username" label="username">
                    <el-input v-model="currentData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="password">
                    <el-input v-model="currentData.password" type="password" :readonly="!isnonReadonly"></el-input>
                    <el-button @click="showpasswordDialog" type="warning"
                        v-show="!isnonReadonly">resetPassword</el-button>
                </el-form-item>
                <el-form-item label="roleid">
                    <el-select v-model="currentData.roleId" placeholder="請選擇角色">
                        <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="deptId">
                    <!-- <el-input v-model="currentData.deptId"></el-input> -->
                    <el-tree-select v-model="currentData.deptId" :data="departments" :render-after-expand="false"
                        check-strictly show-checkbox style="width: 240px" />
                </el-form-item>
                <el-form-item label="status">
                    <el-radio-group v-model="currentData.status">
                        <el-radio :label="1">正常</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="deleted">
                    <el-select v-model="currentData.deleted">
                        <el-option v-for="item in yesNoList" :key="item.id" :value="item.id"
                            :label="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="ADusername">
                    <el-input v-model="currentData.adusername"></el-input>
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
        <!-- resetpassword -->
        <el-dialog v-model="resetpasswordDialogVisible" title="Password" width="500" align-center>
            <el-form :model="currentData" :rules="formRules" ref="currentDataRef" label-width="100px">
                <span>Please input new password</span>
                <el-form-item prop="password" label="password">
                    <el-input v-model="currentData.password" type="password"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="resetpasswordDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="resetPassword(currentData.id, currentData.password)">
                        Confirm
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, h, computed, watch } from 'vue'
import { usePostStore } from '@/stores/UserStore';
import { deptsChildren } from "@/stores/DeptStore";
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import { UserInfo } from "@/api/user/model";
import { SelectTreeModel } from "@/model/model";
import { RoleModel } from "@/api/role/model";
import { yseNoList } from "@/model/model";
import { usePostStore as rolePostStore } from '@/stores/RoleStore';
import depApi from "@/api/dept/deptApi";
import userApi from "@/api/user/userApi";


const emptyUserInfo: UserInfo = {
    id: 0,
    username: '',
    password: '',
    deptId: 0,
    deptName: '',
    roleId: 0,
    roleName: '',
    status: 1,
    deleted: 0,
    createTime: '',
    updateTime: '',
    adusername: '',

};

const yesNoList = ref(yseNoList);

const departments = ref<SelectTreeModel[]>([]);
const roles = ref<RoleModel[]>([]);
const postroleStore = rolePostStore();
const postStore = usePostStore();

// 新增、編輯 dialog
const dialogFormVisible = ref(false)
const resetpasswordDialogVisible = ref(false)
// 查詢字
const searchQuery = ref('');

// 頁數
const currentData = ref<UserInfo>({ ...emptyUserInfo });
const currentPage = ref(1);
const pageSize = ref(5);


const currentDataRef = ref<FormInstance>(); // 表單ref
//驗證規則
const formRules =
{
    username: [
        {
            required: true,
            trigger: "blur",
            message: "請輸入帳號",
        },
    ],
    password: [
        {
            required: true,
            trigger: "blur",
            message: "請輸入密碼",
        },
        {
            min: 4,
            message: "請輸入4位數密碼",
            trigger: "blur",
        },
    ],
}

const resetPassword = (userId: number, password: string) => {
    userApi.ResetSysUserPassword(userId, password);
    ElMessage.success('Reset password successfully');
    resetpasswordDialogVisible.value = false;
};

const showpasswordDialog = () => {
    currentData.value.password = '';
    resetpasswordDialogVisible.value = true;
}
const isnonReadonly = computed(() => currentData.value.id === 0);

const resetForm = () => {
    currentDataRef.value?.resetFields();
};

const handlePageChange = (page: number) => {
    currentPage.value = page;
};

const filteredDatas = computed(() => {
    return postStore.posts.filter(data =>
        (data.username?.includes(searchQuery.value) ?? false) ||
        (data.adusername?.includes(searchQuery.value) ?? false)
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
    postroleStore.getPostsAction();
    //api取得資料，塞回departments
    depApi.getSysDeptsTree().then((res) => {
        // departments.value = res.data;
        for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].status === 0) continue;
            departments.value.push(
                {
                    value: res.data[i].id,
                    label: res.data[i].name,
                    children: deptsChildren(res.data[i].children),
                }
            );
        }
    }).catch((error) => {
        console.error('Error getting departments:', error);
    });

});


// watch store中的數據變化
watch(
    [() => postroleStore.getAllPosts.filter((role) => role.status === 1)],
    ([newRoles]) => {
        roles.value = newRoles;
    }
);

const openDialog = () => {
    currentData.value = { ...emptyUserInfo };
    dialogFormVisible.value = true;
};




const editFunction = (menu: UserInfo) => {
    currentData.value = { ...menu };
    dialogFormVisible.value = true;
};

const deleteFunction = async (menu: UserInfo) => {
    try {
        // await postStore.removePostAction(menu.id);
        const deleteAction = async () => {
            try {
                await postStore.removePostAction(menu.id);
            } catch (error: any) {
                console.error('Error deleting menu:', error);
                ElMessage.error(`Error delete user: ${error.response?.data || error.message}`);
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
        console.error('Error deleting menu:', error);
    }
    // await postStore.getPostsAction();
};


const saveMenu = async () => {
    currentDataRef.value?.validate(async (valid) => {
        if (!valid) return;
        // 確保 tinyint 和 bigint 屬性為數字類型
        currentData.value.roleId = Number(currentData.value.roleId);
        currentData.value.deptId = Number(currentData.value.deptId);
        currentData.value.status = Number(currentData.value.status);
        currentData.value.deleted = Number(currentData.value.deleted);
        const now = new Date();
        currentData.value.updateTime = now.toISOString();

        if (currentData.value.id) {
            try {
                await postStore.editPostAction(currentData.value);
            } catch (error: any) {
                console.error('Error updating user:', error);
                ElMessage.error(`Error updating user: ${error.response?.data || error.message}`);
            }
        } else {
            try {
                currentData.value.createTime = now.toISOString();
                await postStore.addPostAction(currentData.value);
            } catch (error: any) {
                console.error('Error adding user:', error);
                ElMessage.error(`Error adding user: ${error.response?.data || error.message}`);
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