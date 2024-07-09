<template>
    <div class="app-container">
        <div class="search-container">
            <el-form ref="queryFormRef" :inline="true">
                <el-form-item label="Search" prop="keywords">
                    <el-input v-model="searchQuery" placeholder="name、 path、component"
                        style="width: 200px; margin-right: 10px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" @click="searchMenus">reset</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-card shadow="never">
            <template #header>
                <div class="card-header">
                    <span style="margin-right:10px; font-size:30px; font-weight: bold">Menu List</span>
                    <el-button type="primary" @click="openDialog(0)">Add</el-button>
                </div>
            </template>
            <el-table :data="pagedMenus" row-key="id" style="width: 100%">
                <!-- <el-table-column fixed prop="id" label="ID"></el-table-column> -->
                <el-table-column fixed prop="name" label="name"></el-table-column>
                <el-table-column prop="type" label="type">
                    <template #default="scope">
                        <el-tag v-if="scope.row.type === 2" type="warning">catalog</el-tag>
                        <el-tag v-if="scope.row.type === 1" type="success">menue</el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed prop="path" label="path"></el-table-column>
                <el-table-column fixed prop="component" label="component"></el-table-column>
                <!-- <el-table-column prop="parentId" label="parentId"></el-table-column> -->
                <!-- <el-table-column prop="treePath" label="treePath"></el-table-column> -->
                <!-- <el-table-column prop="perm" label="perm"></el-table-column> -->
                <!-- <el-table-column prop="alwaysShow" label="alwaysShow"></el-table-column>
                <el-table-column prop="keepAlive" label="keepAlive"></el-table-column>
                <el-table-column prop="visible" label="visible"></el-table-column>
                <el-table-column prop="sort" label="sort"></el-table-column>
                <el-table-column prop="icon" label="icon"></el-table-column>
                <el-table-column prop="redirect" label="redirect"></el-table-column> -->
                <!-- <el-table-column prop="createTime" label="createTime"></el-table-column>
                <el-table-column prop="updateTime" label="updateTime"></el-table-column>
                <el-table-column prop="params" label="params"></el-table-column> -->
                <el-table-column fixed="right" label="operate" min-width="135">
                    <template #default="scope">
                        <div class="action-buttons">
                            <el-button size="small" type="primary" @click="openDialog(scope.row.id)">Add</el-button>
                            <el-button size="small" type="success" @click="editMenu(scope.row)">edit</el-button>
                            <el-button size="small" type="danger" @click="deleteMenu(scope.row)">delete</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :total="totalMenus" :page-size="pageSize"
                :current-page="currentPage" @current-change="handlePageChange" />
        </el-card>
        <!-- 新增、編輯 -->
        <el-dialog v-model="dialogFormVisible" title="Menu" width="500" @close="resetForm">
            <el-form :model="currentMenu" :rules="formRules" ref="currentDataRef">
                <el-form-item v-if="currentMenu.type === 1" prop="parentId" label="parentId">
                    <!-- <el-input v-model="currentMenu.parentId"></el-input> -->
                    <el-tree-select v-model="currentMenu.parentId" :data="topmenus" :render-after-expand="false"
                        check-strictly show-checkbox style="width: 240px" />
                </el-form-item>
                <el-form-item prop="name" label="name">
                    <el-input v-model="currentMenu.name"></el-input>
                </el-form-item>
                <el-form-item prop="type" label="type">
                    <!-- <el-input v-model="currentMenu.type"></el-input> -->
                    <el-radio-group v-model="currentMenu.type" @change="handleMenuTypeChange">
                        <el-radio :label="2">目录</el-radio>
                        <el-radio :label="1">菜单</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="path" label="path">
                    <el-input v-model="currentMenu.path"></el-input>
                </el-form-item>
                <el-form-item v-if="currentMenu.type === 1" prop="component" label="component">
                    <el-input v-model="currentMenu.component"></el-input>
                </el-form-item>
                <!-- <el-form-item label="treePath">
                    <el-input v-model="currentMenu.treePath"></el-input>
                </el-form-item> 
                <el-form-item label="perm">
                    <el-input v-model="currentMenu.perm"></el-input>
                </el-form-item>-->

                <el-form-item label="alwaysShow">
                    <!-- <el-input v-model="currentMenu.alwaysShow"></el-input> -->
                    <el-radio-group v-model="currentMenu.alwaysShow">
                        <el-radio :label="true">Yes</el-radio>
                        <el-radio :label="false">No</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="keepAlive">
                    <!-- <el-input v-model="currentMenu.keepAlive"></el-input> -->
                    <el-radio-group v-model="currentMenu.keepAlive">
                        <el-radio :label="true">Yes</el-radio>
                        <el-radio :label="false">No</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="visible">
                    <!-- <el-input v-model="currentMenu.visible"></el-input> -->
                    <el-radio-group v-model="currentMenu.visible">
                        <el-radio :label="true">顯示</el-radio>
                        <el-radio :label="false">隱藏</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="sort">
                    <!-- <el-input v-model="currentMenu.sort"></el-input> -->
                    <el-input-number v-model="currentMenu.sort" controls-position="right" style="width: 100px"
                        :min="0" />
                </el-form-item>
                <el-form-item label="icon">
                    <el-input v-model="currentMenu.icon"></el-input>
                </el-form-item>
                <!-- <el-form-item label="redirect">
                    <el-input v-model="currentMenu.redirect"></el-input>
                </el-form-item>
                <el-form-item label="params">
                    <el-input v-model="currentMenu.params"></el-input>
                </el-form-item> -->
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
import { usePostStore, menusChildren } from '@/stores/MenuStore';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import { Menu } from "@/api/menu/model";
import { SelectTreeModel } from "@/model/model";

const emptyMenu: Menu = {
    id: 0,
    name: '',
    path: '',
    component: '',
    parentId: 0,
    treePath: '',
    type: 0,
    perm: '',
    alwaysShow: 0,
    keepAlive: 0,
    visible: 0,
    sort: 0,
    icon: '',
    redirect: '',
    createTime: '',
    updateTime: '',
    params: '',
    children: [],
};

const postStore = usePostStore();

// 新增、編輯 dialog
const dialogFormVisible = ref(false)

// 查詢字
const searchQuery = ref('');

// 頁數
const currentMenu = ref<Menu>({ ...emptyMenu });
const currentPage = ref(1);
const pageSize = ref(5);

const topmenus = ref<SelectTreeModel[]>([]);

const currentDataRef = ref<FormInstance>(); // 表單ref
//驗證規則
const formRules =
{
    name: [
        {
            required: true,
            trigger: "blur",
            message: "請輸入名稱",
        },
        {
            min: 2,
            trigger: "blur",
            message: "名稱不能少於2個字",
        },
    ],
    type: [
        {
            //type值大於0
            validator: (rule: any, value: any, callback: any) => {
                if (value > 0) {
                    return callback();
                }
                return callback(new Error('請選擇類型'));
            }
            ,
            trigger: "blur"
        },
    ],
    parentId: [
        {
            validator: (rule: any, value: any, callback: any) => {
                if (currentMenu.value.type === 1 && value === 0) {
                    return callback(new Error('請選擇父級菜單'));
                }
                return callback();
            },
            trigger: "blur"
        }
    ],
    component: [
        {
            required: true,
            trigger: "blur",
            message: "請輸入組件",
        },
        {
            min: 2,
            trigger: "blur",
            message: "組件不能少於2個字",
        },
    ],
    path: [
        {
            required: true,
            trigger: "blur",
            message: "請輸入路徑",
        },
        {
            min: 2,
            trigger: "blur",
            message: "路徑不能少於2個字",
        },
    ],

}

const resetForm = () => {
    currentDataRef.value?.resetFields();
};

function handleMenuTypeChange() {
    //目錄
    if (currentMenu.value.type === 2) {
        currentMenu.value.parentId = 0;
        currentMenu.value.component = "Layout";
    }
}

const handlePageChange = (page: number) => {
    currentPage.value = page;
};

const filteredMenus = computed(() => {
    return postStore.posts.filter(menu =>
        (menu.name?.includes(searchQuery.value) ?? false) ||
        (menu.path?.includes(searchQuery.value) ?? false) ||
        (menu.component?.includes(searchQuery.value) ?? false)
    );
});

const pagedMenus = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    // return postStore.posts.slice(start, end);
    return filteredMenus.value.slice(start, start + pageSize.value);
});

const totalMenus = computed(() => filteredMenus.value.length);

const searchMenus = () => {
    currentPage.value = 1; // 每次搜索时重置为第一页
    searchQuery.value = "";
};

onMounted(() => {
    postStore.getPostsAction();
});


const openDialog = (menuId: number) => {
    currentMenu.value = { ...emptyMenu };
    dialogFormVisible.value = true;
    if (menuId > 0) {
        currentMenu.value.parentId = menuId;
        currentMenu.value.type = 1;
    }
    getParentMenu();
};



const editMenu = (menu: Menu) => {
    currentMenu.value = { ...menu };
    dialogFormVisible.value = true;
    getParentMenu();
};



const getParentMenu = () => {
    topmenus.value = [];
    postStore.getAllPosts.forEach((menu) => {
        //目錄
        if (menu.type === 2) {
            topmenus.value.push({
                value: menu.id,
                label: menu.name,
                children: menusChildren(menu.children),
            });
            // topmenus.value.push(menu);
        }
    });
}

const deleteMenu = async (menu: Menu) => {
    try {
        // await postStore.removePostAction(menu.id);
        const deleteAction = async () => {
            try {
                await postStore.removePostAction(menu.id);
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
        console.error('Error deleting menu:', error);
    }
    // await postStore.getPostsAction();
};


const saveMenu = async () => {
    currentDataRef.value?.validate(async (valid) => {
        if (!valid) return;
        // 確保 tinyint 和 bigint 屬性為數字類型
        currentMenu.value.parentId = Number(currentMenu.value.parentId);
        currentMenu.value.type = Number(currentMenu.value.type);
        currentMenu.value.alwaysShow = Number(currentMenu.value.alwaysShow);
        currentMenu.value.keepAlive = Number(currentMenu.value.keepAlive);
        currentMenu.value.visible = Number(currentMenu.value.visible);
        currentMenu.value.sort = Number(currentMenu.value.sort);
        const now = new Date();
        currentMenu.value.updateTime = now.toISOString();

        if (currentMenu.value.id) {
            try {
                await postStore.editPostAction(currentMenu.value);
            } catch (error) {
                console.error('Error updating menu:', error);
            }
        } else {
            try {
                currentMenu.value.createTime = now.toISOString();
                await postStore.addPostAction(currentMenu.value);
            } catch (error) {
                console.error('Error adding menu:', error);
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