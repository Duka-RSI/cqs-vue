<template>
    <el-container class="layout-container-demo">
        <el-header style="text-align: right; font-size: 20px; ">
            <el-row :gutter="24">
                <el-col :span="20" style="text-align: left;">
                    <h1 style="font-weight: 400;color:" class="logo-title">COSTSHEET
                        QUOTATION SYSTEM
                        (CQS)</h1>
                </el-col>
                <el-col :span="4">
                    <settings></settings>
                </el-col>
            </el-row>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse ? '50px' : '200px'">
                <sidebar class="sidebar-container" @collapse-change="handleCollapseChange"></sidebar>
            </el-aside>
            <el-main :class="{ 'main-expanded': isCollapse }">
                <appMain></appMain>
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts" setup>
import appMain from './components/AppMain/index.vue'
import settings from './components/Settings/index.vue'
import sidebar from './components/Sidebar/index.vue'
import { ref } from 'vue'

const isCollapse = ref(false)
const handleCollapseChange = (collapseStatus: boolean) => {
    console.log('Collapse status changed:', collapseStatus)
    isCollapse.value = collapseStatus
}
</script>

<style lang="scss" scoped>
.el-main {
    transition: margin-left 0.28s;
}

.main-expanded {
    margin-left: 64px; // 折叠後寬度
}

.sidebar-container {
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    transition: width 0.28s;
    text-align: center;
}

.logo-title {
    flex-shrink: 0;
    /* 防止容器在空间不足时缩小 */
    margin-left: 10px;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
}

.layout-container-demo .el-header {
    position: relative;
    background-color: #438EB9;
    color: var(--el-text-color-primary);

}

.layout-container-demo .el-aside {
    color: var(--el-text-color-primary);
}

.layout-container-demo .el-menu {
    border-right: none;
}


.layout-container-demo .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
}
</style>
