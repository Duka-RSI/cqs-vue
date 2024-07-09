import axios,{  AxiosResponse }  from 'axios';
import { DeptModel } from '@/api/dept/model';


const apiClient = axios.create({
//   baseURL: 'https://localhost:44391/api', // 设置基础URL
  withCredentials: false, // 默认情况下不携带跨域请求的 cookie
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  getSysDeptsTree() :Promise<AxiosResponse<DeptModel[]>>{
    return apiClient.get(`/api/Sysdept/GetSysDeptsTree`);
  },

  getSysDeptsTreeById(parentId:number) :Promise<AxiosResponse<DeptModel[]>>{
    return apiClient.get(`/api/Sysdept/GetSysDeptsTreeById?deptId=${parentId}`);
  },

};
