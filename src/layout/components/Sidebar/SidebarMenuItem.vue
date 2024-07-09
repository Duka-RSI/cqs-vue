<template>
    <template v-if="route.children && route.children.length">
        <el-sub-menu class="submenu-title-noDropdown" :index="parentPath + route.path" :key="route.path">
            <template #title>
                <!-- <el-icon :class="route.meta?.icon">
                    <component :is="route.meta?.icon" />
                </el-icon> -->
                <el-icon :class="route.meta?.icon">
                    <iconify-icon :icon="route.meta?.icon" />
                </el-icon>
                <span>{{ route.meta?.title }}</span>
            </template>
            <template v-for=" child  in  route.children ">
                <SidebarMenuItem class="submenu-title-noDropdown" :route="child"
                    :parentPath="parentPath + route.path + '/'" />
            </template>
        </el-sub-menu>
    </template>
    <el-menu-item v-else :index="parentPath + route.path" :key="route.path" class="submenu-title-noDropdown">
        <el-icon :class="route.meta?.icon">
            <iconify-icon :icon="route.meta?.icon" />
        </el-icon>
        <router-link :to="parentPath + route.path">
            {{ route.meta.title }}
        </router-link>
        <!-- <span>{{ parentPath + route.path + ": " + route.name }}</span> -->
    </el-menu-item>
</template>

<script setup>
const props = defineProps({
    route: {
        type: Object,
        required: true
    },
    parentPath: {
        type: String,
        required: true,
        default: ''
    }
})
</script>
<style lang="scss" scoped>
.submenu-title-noDropdown {
    position: relative;
    background-color: #FFFFFF;
    color: var(--el-text-color-primary);
}

.el-icon {
    display: flex;
    align-items: center;
}
</style>
