import Axios from "axios";
import { AxiosResponse } from 'axios';

export default {
  /**
   * 系统-登录
   */
  async authLogin(name: string, password: string) {
    const response: AxiosResponse<AuthLoginResponse> = await Axios.post("/admin/Login", {usernameOrPhone: name, password});
    return response.data;
  },
  /**
   * 系统-admin-用户权限获得
   */
  async getAdminPermission(id: unknown) {
    const response: AxiosResponse<PermissionList[]> =  await Axios.post("/admin/getAdminPermission", {id});
    return response.data;
  },
  /**
   * 系统-修改密码
   */
  async changePassword(id: unknown, originalPassword: string, password: string) {
    return  await Axios.post("/admin/changePassword", {id, originalPassword, password});
  },
  /**
   * 系统-登出
   */
  async authLogout(id: unknown) {
    return await Axios.post("/admin/Logout", {id});
  },
  /**
   * admin-获取page列表
   */
  async getAdminPage(paramer: unknown) {
    const response: AxiosResponse<AdminUser> = await Axios.post("/admin/getAdminPage", paramer);
    return response.data;
  },
  /**
   * 管理员-新增
   */
  async generateAdmin(paramer: unknown) {
    const response: AxiosResponse<UpdateAdmin> = await Axios.post("/admin/generateAdmin", paramer);
    return response.data;
  },
  /**
   * 管理员-更新admin信息
   */
  async updateAdmin(paramer: unknown) {
    return await Axios.post("/admin/updateAdmin", paramer);
  },
  /**
   * 管理员-停用
   */
  async disableAdmin(paramer: unknown) {
    return await Axios.post("/admin/disableAdmin", paramer);
  },
  /**
   * 管理员-启用
   */
  async enableAdmin(paramer: unknown) {
    return await Axios.post("/admin/enableAdmin", paramer);
  },
  /**
   * 管理员-重置密码
   */
  async resetPassword(paramer: unknown) {
    const response: AxiosResponse<UpdateAdmin> = await Axios.post("/admin/resetPassword", paramer);
    return response.data;
  },
  /**
   * role-获取page列表
   */
  async getRolePage(paramer: unknown) {
    const response: AxiosResponse<Role> =  await Axios.post("/role/getRolePage", paramer);
    return response.data;
  },
  /**
   * 管理员-添加新角色
   */
  async addRole(paramer: unknown) {
    return await Axios.post("/role/addRole", paramer);
  },
  /**
   * 管理员-修改角色
   */
  async updateRole(paramer: unknown) {
    return await Axios.post("/role/updateRole", paramer);
  },
  /**
   * 管理员-删除角色
   */
  async deleteRole(paramer: unknown) {
    return await Axios.post("/role/deleteRole", paramer);
  },
  /**
   * 管理员-获取未授权用户
   */
  async getUnauthorizedRoleAdminList(paramer: unknown) {
    const response: AxiosResponse<AdminUser> =  await Axios.post("/role/getUnauthorizedRoleAdminPage", paramer);
    return response.data;
  },
  /**
   * 管理员-获取授权用户
   */
  async getAuthorizedRoleAdminList(paramer: unknown) {
    const response: AxiosResponse<AdminUser> = await Axios.post("/role/getAuthorizedRoleAdminPage", paramer);
    return response.data;
  },
  /**
   * 管理员-授权用户
   */
  async bindAdmin(paramer: unknown) {
    return await Axios.post("/role/bindAdmin", paramer);
  },
  /**
   * 管理员-取消授权用户
   */
  async cancelBindAdmin(paramer: unknown) {
    return await Axios.post("/role/cancelBindAdmin", paramer);
  },
  /**
   * 管理员-获取权限列表
   */
  async getPermissionNode(paramer: unknown) {
    const response: AxiosResponse<PermissionList[]> = await Axios.post("/permission/getPermissionNode", paramer);
    return response.data;
  },
  /**
   * 管理员-新增权限
   */
  async addPermission(paramer: unknown) {
    return await Axios.post("/permission/addPermission", paramer);
  },
  /**
   * 管理员-编辑权限
   */
  async editPermission(paramer: unknown) {
    return await Axios.post("/permission/updatePermission", paramer);
  },
  /**
   * 管理员-删除权限
   */
  async deletePermission(paramer: unknown) {
    return await Axios.post("/permission/deletePermission", paramer);
  },
  /**
   * 管理员-role-角色获取权限Node
   */
  async getRolePermissionNode(paramer: unknown) {
    const response: AxiosResponse<PermissionList[]> =  await Axios.post("/role/getRolePermissionNode", paramer);
    return response.data;
  },
  /**
   * 管理员-role-配置权限
   */
  async updatePermission(paramer: unknown) {
    return await Axios.post("/role/updatePermission", paramer);
  }
};
