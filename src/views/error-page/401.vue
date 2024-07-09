<template>
    <div class="errPage-container">
        <el-row>
            <el-col :span="12">
                <h1 class="text-jumbo text-ginormous">Oops! 页面</h1> 
                <h2>你没有权限去该页面</h2>
                <h6>如有不满请联系你领导</h6>
                <ul class="list-unstyled">
                    <li>或者你可以去:</li>
                    <li class="link-type">
                        <router-link to="/dashboard"> 回首页 </router-link>
                    </li>
                </ul>
            </el-col>
        </el-row>
    </div>
</template>

<style lang="scss" scoped>
.errPage-container {
    width: 800px;
    max-width: 100%;
    margin: 100px auto;

    .pan-back-btn {
        color: #fff;
        background: #008489;
        border: none !important;
    }

    .pan-gif {
        display: block;
        margin: 0 auto;
    }

    .pan-img {
        display: block;
        width: 100%;
        margin: 0 auto;
    }

    .text-jumbo {
        font-size: 60px;
        font-weight: 700;
        color: #484848;
    }

    .list-unstyled {
        font-size: 14px;

        li {
            padding-bottom: 5px;
        }

        a {
            color: #008489;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}
</style>
