
  
  // /**
  //  * 用户查询对象类型
  //  */
  // export interface UserQuery {
  //   keywords?: string;
  //   status?: number;
  //   deptId?: number;
  //   startTime?: string;
  //   endTime?: string;
  // }
  
  // /**
  //  * 用户分页对象
  //  */
  // export interface UserPageVO {
  //   /**
  //    * 用户头像地址
  //    */
  //   // avatar?: string;
  //   /**
  //    * 创建时间
  //    */
  //   createTime?: Date;
  //   /**
  //    * 部门名称
  //    */
  //   deptName?: string;
  //   /**
  //    * 用户邮箱
  //    */
  //   // email?: string;
  //   /**
  //    * 性别
  //    */
  //   // genderLabel?: string;
  //   /**
  //    * 用户ID
  //    */
  //   id?: number;
  //   /**
  //    * 手机号
  //    */
  //   // mobile?: string;
  //   /**
  //    * 用户昵称
  //    */
  //   // nickname?: string;
  //   /**
  //    * 角色名称，多个使用英文逗号(,)分割
  //    */
  //   roleNames?: string;
  //   /**
  //    * 用户状态(1:启用;0:禁用)
  //    */
  //   status?: number;
  //   /**
  //    * 用户名
  //    */
  //   username?: string;
  // }
  
  // /**
  //  * 用户表单类型
  //  */
  // export interface UserForm {
  //   /**
  //    * 用户头像
  //    */
  //   avatar?: string;
  //   /**
  //    * 部门ID
  //    */
  //   deptId?: number;
  //   /**
  //    * 邮箱
  //    */
  //   email?: string;
  //   /**
  //    * 性别
  //    */
  //   gender?: number;
  //   /**
  //    * 用户ID
  //    */
  //   id?: number;
  //   mobile?: string;
  //   /**
  //    * 昵称
  //    */
  //   nickname?: string;
  //   /**
  //    * 角色ID集合
  //    */
  //   roleIds?: number[];
  //   /**
  //    * 用户状态(1:正常;0:禁用)
  //    */
  //   status?: number;
  //   /**
  //    * 用户名
  //    */
  //   username?: string;
  // }


  export interface LoginData {
    /**
     * 用户名
     */
    username: string;
    /**
     * 密码
     */
    password: string;
  
    // /**
    //  * 验证码缓存key
    //  */
    // captchaKey?: string;
  
    // /**
    //  * 验证码
    //  */
    // captchaCode?: string;
  }

  /**
 * 登录用户信息
 */
export interface UserInfo {
  id: number;
  username: string;
  password: string;
  deptId?: number;
  deptName?: string;
  roleId?: number;
  roleName?: string;
  status?: number;
  deleted?: number;
  createTime?: string;
  updateTime?: string;
  adusername?: string;
  // nickname?: string;
  // avatar?: string;
  // roles: string[];
  // perms: string[];
}
  