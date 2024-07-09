<template>
    <div class="toolbar">
        <!-- <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px">
                <setting />
            </el-icon>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>View</el-dropdown-item>
                    <el-dropdown-item>Add</el-dropdown-item>
                    <el-dropdown-item>Delete</el-dropdown-item>
                </el-dropdown-menu>
            </template>
</el-dropdown> -->
        <el-space style="font-weight: 400; color:#fff;" :size="size" spacer="|">
            <span style="font-weight: 400; color:#fff;">{{ username }}</span>
            <el-button @click="handleLogout" type="primary">Logout</el-button>
        </el-space>
    </div>
</template>
<script lang="ts" setup>
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import router from "@/router";

import { ref } from 'vue'
import type { ComponentSize } from 'element-plus'
const size = ref<ComponentSize>('default')
const username = ref("");
username.value = localStorage.getItem("username") || "";
const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    // const router = useRouter();
    router.push('/login');
}
</script>