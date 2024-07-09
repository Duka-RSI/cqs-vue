<template>
    <div>
        <el-row justify="center">
            <span>
                <h1 style="margin-top: 2em; color: #777;font-size: 32px;font-weight: 400;text-align: center; ">
                    COSTSHEET
                    QUOTATION SYSTEM
                    (CQS)</h1>
            </span>
        </el-row>
    </div>
    <div class="login-container">
        <div>
            <el-card class="!border-none !bg-transparent !rounded-4% w-100 <sm:w-85">
                <el-form ref="loginFormRef" class="login-form" :model="loginData" :rules="loginRules">
                    <div class="text-center relative">
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <img src="@/assets/images/rsi.png" alt="logo" class="logo" />
                            </el-col>
                            <el-col :span="10">
                                <!-- <h>CQS</h> -->
                            </el-col>
                        </el-row>
                    </div>
                    <el-form-item prop="username">
                        <div class="flex-y-center w-full">
                            <el-icon>
                                <User />
                            </el-icon>
                            <el-input placeholder="請輸入用戶名" name="username" type="text" v-model="loginData.username" />
                        </div>
                    </el-form-item>

                    <el-form-item prop="password">
                        <div class="flex-y-center w-full">
                            <el-icon>
                                <lock />
                            </el-icon>
                            <el-input placeholder="請輸入密碼" name="password" type="password" v-model="loginData.password"
                                @keyup.enter="handleLogin" />
                            <span class="show-pwd">
                            </span>
                        </div>
                    </el-form-item>
                    <!-- <el-form-item class="code-box">
                        <span class="icon-container">
                            <i class="el-icon-tickets"></i>
                        </span>
                        <el-input placeholder="圖形驗證碼" class="code-input" maxlength="4">
                        </el-input>
                        <div class="code-img"></div>
                    </el-form-item> -->
                    <el-button type="primary" style="width: 100%; margin-bottom: 30px;" :loading="loading"
                        @click.prevent="handleLogin">Login</el-button>
                </el-form>
            </el-card>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { LoginData } from "@/api/user/model";
import type { FormInstance } from "element-plus";
import router, { generateRoutes } from "@/router";
import { ElForm, ElMessage } from "element-plus/es"
import userApi from "@/api/user/userApi"
import axios from 'axios';
import api from "@/api/menu/menuApi"

const loading = ref(false); // 按钮loading
const loginData = ref<LoginData>({
    username: "",
    password: "",
});




/** 登录 */
const loginFormRef = ref<FormInstance>(); // 登录表单ref

//驗證規則
const loginRules = {
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
};

async function ADloginUser() {
    try {
        const response = await axios.get(`http://192.168.134.25:8089/api/AD/GetUserAD`, {
            withCredentials: true  // 允许携带凭据（cookie）
        });
        loginData.value.username = response.data.name; // 将API返回的name字段赋值给userName
        loginData.value.password = response.data.password;
    }
    catch (error) {
        console.log(error)
    }
}

async function getSysUserByLogin() {
    try {
        const response = await userApi.getSysUserByLogin(loginData.value.username, loginData.value.password);
        if (response) {
            localStorage.setItem('isAuthenticated', "true")
            localStorage.setItem('username', loginData.value.username)

            const menuResponse = await api.getSysMenusByUserName(loginData.value.username);
            const menuItems = menuResponse.data;

            const dynamicRoutes = generateRoutes(menuItems);

            //移除現有的動態路由
            router.getRoutes().forEach(route => {
                if (route.name && route.name !== 'Home' && route.name !== 'Login') {
                    router.removeRoute(route.name);
                }
            });

            // // 动态添加新路由
            // dynamicRoutes.forEach(route => {
            //     router.addRoute('Home', route);
            // });

            //添加新路由
            router.addRoute({
                path: '/',
                children: dynamicRoutes
            });


            // 重定向到主页
            router.push({ path: '/' });

        }
    }
    catch (error) {
        console.log(error)
        ElMessage.error('Incorrect username or password')
    }
}

function handleLogin() {
    try {
        loginFormRef.value?.validate(async (valid) => {
            if (valid) {
                loading.value = true;
                getSysUserByLogin()
                loading.value = false;
            }
        });
    }
    catch (error) {
        console.log(error)
    } finally {
        loading.value = false;
    }
}



onMounted(() => {
    ADloginUser();
});

</script>

<style lang="scss" scoped>
.login-container {
    // @apply wh-full flex-center;

    // .login-form {
    //     padding: 30px 10px;
    // }

    display: flex;
    justify-content: center;
    align-items: center;
    height: 40vh;
}


.el-form-item {
    background: var(--el-input-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 5px;
}

:deep(.el-input) {
    .el-input__wrapper {
        padding: 0;
        background-color: transparent;
        box-shadow: none;

        &.is-focus,
        &:hover {
            box-shadow: none !important;
        }

        input:-webkit-autofill {
            /* 通过延时渲染背景色变相去除背景颜色 */
            transition: background-color 1000s ease-in-out 0s;
        }
    }
}
</style>