import { defineStore } from 'pinia';
import axios from 'axios';
import { UserInfo } from "@/api/user/model";
import { ElMessage } from 'element-plus';

export const usePostStore = defineStore('postUserStore', {
  state: () => ({
    posts: [] as UserInfo[],
  }),
  getters: {
    getAllPosts: (state) => {
      return state.posts;
    },
  },
  actions: {
    async getPostsAction() {
      try {
        const response = await axios.get(`/api/SysUser/GetSysUsers`);
        this.posts = response.data;
      } catch (error: any) {
        console.error('Error fetching posts:', error);
        ElMessage.error(`Error fetching posts: ${error.response?.data || error.message}`);
      }
    },
    async addPostAction(post: UserInfo) {
      try {
        const response = await axios.post('/api/SysUser/CreateSysUser', post);
        this.posts.unshift(response.data);
        ElMessage.success('User adding successfully');
      } catch (error : any) {
        console.error('Error create posts:', error);
        ElMessage.error(`Error adding post: ${error.response?.data || error.message}`);
      }
    },
    async removePostAction(id: number) {
      try {
        await axios.post(`/api/SysUser/DeleteSysUser?id=${id}`);
        this.posts = this.posts.filter(c => c.id !== id)
        ElMessage.success('User delete successfully');
      } catch (error : any) {
        console.error('Error deleting post:', error);
        ElMessage.error(`Error deleting post: ${error.response?.data || error.message}`);
      }
    },
    async editPostAction(post: UserInfo) {
      try {
        await axios.post(
          `/api/SysUser/UpdateSysUser`,
          post
      );
      const index = this.posts.findIndex(c => c.id === post.id)
      if (index !== -1) {
          this.posts.splice(index, 1, post)
      }
      ElMessage.success('User update successfully');
      } catch (error: any) {
        console.error('Error updating post:', error);
        ElMessage.error(`Error updating post: ${error.response?.data || error.message}`);
      }
    },
  },
});
