import { defineStore } from 'pinia';
import axios from 'axios';
import { DeptModel } from "@/api/dept/model";
import { SelectTreeModel } from "@/model/model";
import { ElMessage } from 'element-plus';

export const usePostStore = defineStore('postDeptStore', {
  state: () => ({
    posts: [] as DeptModel[],
  }),
  getters: {
    getAllPosts: (state) => {
      return state.posts;
    },
  },
  actions: {
    async getPostsAction() {
      try {
        const response = await axios.get(`/api/Sysdept/GetSysDeptsTree`);
        this.posts = response.data;
      } catch (error:any) {
        console.error('Error fetching posts:', error);
        ElMessage.error(`Error adding post: ${error.response?.data || error.message}`);
      }
    },
    async addPostAction(post: DeptModel) {
      try {
        const response = await axios.post('/api/Sysdept/CreateSysDept', post);
        this.posts.unshift(response.data);
        ElMessage.success('adding successfully');
      } catch (error: any) {
        console.error('Error fetching posts:', error);
        ElMessage.error(`Error adding post: ${error.response?.data || error.message}`);
      }
    },
    async removePostAction(id: number) {
      try {
        await axios.post(`/api/Sysdept/DeleteSysDept?id=${id}`);
        this.posts = this.posts.filter(c => c.id !== id)
        ElMessage.success('delete successfully');
      } catch (error:any) {
        console.error('Error deleting post:', error);
        ElMessage.error(`Error deleting post: ${error.response?.data || error.message}`);
      }
    },
    async editPostAction(post: DeptModel) {
      try {
        await axios.post(
          `/api/Sysdept/UpdateSysDept`,
          post
      );
      const index = this.posts.findIndex(c => c.id === post.id)
      if (index !== -1) {
          this.posts.splice(index, 1, post)
      }
      ElMessage.success('update successfully');
      } catch (error:any) {
        console.error('Error updating post:', error);
        ElMessage.error(`Error deleting post: ${error.response?.data || error.message}`);
      }
    },
  },
});

export const deptsChildren = (data: DeptModel[]) => {
  const children: SelectTreeModel[] = [];
  for (let i = 0; i < data.length; i++) {
      children.push(
          {
              value: data[i].id,
              label: data[i].name,
              children: deptsChildren(data[i].children as DeptModel[]),
          }
      );
  }
  return children;
}
