import { defineStore } from 'pinia';
import axios from 'axios';
import { Menu } from "@/api/menu/model";
import { SelectTreeModel } from "@/model/model";
import { ElMessage } from 'element-plus';

export const usePostStore = defineStore('postStore', {
  state: () => ({
    posts: [] as Menu[],
  }),
  getters: {
    getAllPosts: (state) => {
      return state.posts;
    },
  },
  actions: {
    async getPostsAction() {
      try {
        const response = await axios.get('/api/SysMenu/GetSysMenusTree');
        this.posts = response.data;
      } catch (error:any) {
        console.error('Error fetching posts:', error);
        ElMessage.error(`Error adding post: ${error.response?.data || error.message}`);
      }
    },
    async addPostAction(post: Menu) {
      try {
        const response = await axios.post('/api/SysMenu/CreateSysMenu', post);
        this.posts.unshift(response.data);
        ElMessage.success('adding successfully');
      } catch (error:any) {
        console.error('Error fetching posts:', error);
        ElMessage.error(`Error adding post: ${error.response?.data || error.message}`);
      }
    },
    async removePostAction(id: number) {
      try {
        await axios.post(`/api/SysMenu/DeleteSysMenu?id=${id}`);
        this.posts = this.posts.filter(c => c.id !== id)
        ElMessage.success('delete successfully');
      } catch (error:any) {
        console.error('Error deleting post:', error);
        ElMessage.error(`Error adding post: ${error.response?.data || error.message}`);
      }
    },
    async editPostAction(post: Menu) {
      try {
        await axios.post(
          `/api/SysMenu/UpdateSysMenu`,
          post
      );
      const index = this.posts.findIndex(c => c.id === post.id)
      if (index !== -1) {
          this.posts.splice(index, 1, post)
      }
      ElMessage.success('update successfully');
      } catch (error:any) {
        console.error('Error updating post:', error);
        ElMessage.error(`Error adding post: ${error.response?.data || error.message}`);
      }
    },
  },
});

export const menusChildren = (data: Menu[]) => {
  const children: SelectTreeModel[] = [];
  for (let i = 0; i < data.length; i++) {
      children.push(
          {
              value: data[i].id,
              label: data[i].name,
              children: menusChildren(data[i].children as Menu[]),
          }
      );
  }
  return children;
}