import axios,{  AxiosResponse } from 'axios';

const apiClient = axios.create({
//   baseURL: 'https://localhost:44391/api', // 设置基础URL
  withCredentials: false, // 默认情况下不携带跨域请求的 cookie
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  ADLogin() {
    return apiClient.get(`/api/AD/GetUser`);
  },

  getSysUserByLogin(userName:string,password:string) : Promise<AxiosResponse<any[]>> {
    return apiClient.get(`/api/SysUser/GetSysUserByLogin`, {
      params: {
        userName,
        password
      }
    });
  },

  ResetSysUserPassword(userId:number,password:string): Promise<AxiosResponse<any[]>> {
    return apiClient.post(`/api/SysUser/ResetSysUserPassword?id=${userId}&password=${password}`);
  },

};
