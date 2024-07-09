import { defineStore } from 'pinia';
import axios from 'axios';
import { RoleModel as typemodel } from "@/api/role/model";
import { ElMessage } from 'element-plus';

export const usePostStore = defineStore('postRoleStore', {
  state: () => ({
    posts: [] as typemodel[],
  }),
  getters: {
    getAllPosts: (state) => {
      return state.posts;
    },
  },
  actions: {
    async getPostsAction() {
      try {
        const response = await axios.get(`/api/SysRole/GetSysRoles`);
        this.posts = response.data;
      } catch (error:any) {
        console.error('Error fetching posts:', error);
        ElMessage.error(`Error adding post: ${error.response?.data || error.message}`);
      }
    },
    async addPostAction(post: typemodel) {
      try {
        const response = await axios.post('/api/SysRole/CreateSysRole', post);
        this.posts.unshift(response.data);
        ElMessage.success('adding successfully');
      } catch (error:any) {
        console.error('Error fetching posts:', error);
        ElMessage.error(`Error adding post: ${error.response?.data || error.message}`);
      }
    },
    async removePostAction(id: number) {
      try {
        await axios.post(`/api/SysRole/DeleteSysRole?id=${id}`);
        this.posts = this.posts.filter(c => c.id !== id)
        ElMessage.success('delete successfully');
      } catch (error:any) {
        console.error('Error deleting post:', error);
        ElMessage.error(`Error adding post: ${error.response?.data || error.message}`);
      }
    },
    async editPostAction(post: typemodel) {
      try {
        await axios.post(
          `/api/SysRole/UpdateSysRole`,
          post
      );
      const index = this.posts.findIndex(c => c.id === post.id)
      if (index !== -1) {
          this.posts.splice(index, 1, post)
          ElMessage.success('update successfully');
      }
      } catch (error:any) {
        console.error('Error updating post:', error);
        ElMessage.error(`Error adding post: ${error.response?.data || error.message}`);
      }
    },
  },
});
