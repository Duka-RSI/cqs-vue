import { createRouter, createWebHashHistory, RouteRecordRaw  } from 'vue-router'
import {Menu as MenuItem} from "@/api/menu/model"
import api from "@/api/menu/menuApi"

export const Layout = () => import("@/layout/index.vue");

interface MyModules {
  [key: string]: () => Promise<any>;
}
const modules:MyModules = {
  '../views/system/user/index.vue': () => import('../views/system/user/index.vue'),
  '../views/system/role/index.vue': () => import('../views/system/role/index.vue'),
  '../views/system/menu/index.vue': () => import('../views/system/menu/index.vue'),
  '../views/system/dept/index.vue': () => import('../views/system/dept/index.vue'),
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Layout,
    meta: { hidden: false, title: '首頁', icon: 'homepage',requiresAuth: true,},
    children:[
    ]     
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("@/views/login/index.vue"),
    meta: { 
      // requiresAuth: true,
      hidden: true,
     }
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401.vue"),
    meta: { hidden: true },
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/error-page/404.vue"),
    meta: { hidden: true },
  },
]

const loadComponent = (component: string) => {
  return () => import(/* @vite-ignore */ `${component}`)
  // return () => import(`../views/${component}.vue`);
};


const router = createRouter({
  history: createWebHashHistory(),
  routes : routes
})

const generateRoutes = (menuData: MenuItem[]): RouteRecordRaw[] => {
  return menuData.map(item => {
    const route: RouteRecordRaw = {
      path: item.path,
      name: item.name,
      // component: item.component === 'Layout' ? Layout : loadComponent(item.component),
component: item.component === 'Layout' ? Layout : modules[item.component],
      children: item.children.length > 0 ? generateRoutes(item.children) : undefined,
      meta: {
        requiresAuth: true,
        title: item.name,
        icon: item.icon,
        // visible: true,
        // sort: item.sort,
      },
    };
    return route;
  });
};

const menuItems: MenuItem[]=[];
const dynamicRoutes: RouteRecordRaw[] = [];
const username= localStorage.getItem("username") || "";
if(username != ""){(async () => {
  const response = await api.getSysMenusByUserName(username);
  const menuItems: MenuItem[] = response.data;
//  const dynamicRoutes = generateRoutes(menuItems);
//  // // 动态添加子路由到父路由 "/"
// dynamicRoutes.forEach(route => {
//   router.addRoute('Home', route);
// });
router.addRoute({
  path: '/',
  children: generateRoutes(menuItems)
});
})();

}


//檢視登錄
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export { generateRoutes };
export default router;
