import axios,{  AxiosResponse } from 'axios';
import { Menu } from '@/api/menu/model';

const apiClient = axios.create({
//   baseURL: 'https://localhost:44391/api', // 设置基础URL
  withCredentials: false, // 默认情况下不携带跨域请求的 cookie
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  getSysMenusByUserName(userName:String) : Promise<AxiosResponse< Menu[]>> {
    return apiClient.get(`/api/SysMenu/GetSysMenusByUserName`, {
      params: {
        userName
      }
    });
  },
  getSysMenusIDByRoleId(roleId:number) : Promise<AxiosResponse<number[]>> {
    return apiClient.get(`/api/SysMenu/GetSysMenusIDByRoleId?roleId=${roleId}`);
  },
  updateSysRoleMenus(roleId:number,menusId:number[]) : Promise<AxiosResponse<boolean>>{
    return apiClient.post(`/api/SysMenu/UpdateSysRoleMenus?roleId=${roleId}`, menusId);
  }
};


