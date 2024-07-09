<template>
    <el-scrollbar>
        <el-menu :collapse="isCollapse" @collapse-change="handleCollapse">
            <template v-for="route in  visibleRoutes " :key="route.path" :index="route.path">
                <div v-if="route.children && route.children.length && route.meta?.icon != ''" :index="route.path"
                    :key="route.path">
                    <SidebarMenuItem :route="route" :key="route.path" :parent-path="''" />
                </div>
            </template>
        </el-menu>
        <el-button @click="handleCollapse">
            <span v-if="isCollapse">
                <el-icon>
                    <DArrowRight />
                </el-icon>
            </span>
            <span v-else>
                <el-icon>
                    <DArrowLeft />
                </el-icon>
            </span>
        </el-button>
    </el-scrollbar>
</template>

<script lang="ts" setup>
import { Menu as IconMenu, Message, Setting, Menu, DArrowRight, DArrowLeft } from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import SidebarMenuItem from './SidebarMenuItem.vue'

const isCollapse = ref(false)
const emits = defineEmits(['collapse-change'])

const handleCollapse = () => {
    isCollapse.value = !isCollapse.value
    console.log('Sidebar collapsed:', isCollapse.value)
    emits('collapse-change', isCollapse.value)
}

const router = useRouter()
const visibleRoutes = computed(() => {
    //排除login页面
    return router.getRoutes().filter((route) => route.path !== '/login' && route.meta?.hidden !== true);
})
</script>

<style lang="scss" scoped>
.submenu-title-noDropdown {
    position: relative;
    background-color: #fafafa;
    color: var(--el-text-color-primary);
}

.submenu-title {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
}
</style>
