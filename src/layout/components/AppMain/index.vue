<template>
    <section class="app-main">
        <!-- <el-scrollbar>
            <el-table :data="tableData">
              <el-table-column prop="date" label="Date" width="140" />
              <el-table-column prop="name" label="Name" width="120" />
              <el-table-column prop="address" label="Address" />
            </el-table>
          </el-scrollbar> -->
        <!-- <router-view></router-view> -->
        <router-view>
            <template #default="{ Component, route }">
                <transition enter-active-class="animate__animated animate__fadeIn" mode="out-in">
                    <keep-alive>
                        <component :is="Component" :key="route.path" />
                    </keep-alive>
                </transition>
            </template>
        </router-view>
    </section>
</template>