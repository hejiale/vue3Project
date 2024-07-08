
/**
 * 定义空对象
 */
interface Query {
  [key: string]: any;
}

/**
 * 列表
 */
interface TableSource {
  api: Function;
  query?: Object;
  searchForms?: Array<any>;
  columns: Array<any>;
}

/**
 * 穿梭控件
 */
interface TransferSource {
  api: Function;
  query: Object;
  rightApi: Function,
  key: Any;
  transferLeftApi: Function;
  transferRightApi: Function;
}

/**
 * 菜单权限
 */
interface Permission {
  authCode: string;
  authName: string;
  authType: 'BUTTON'; // 假设 authType 是一个固定的字符串 'BUTTON'
  icon: string;
  id: number;
  key: number;
  level: number;
  parentId: number;
  parentName: string;
  path: string;
  sortNo: number;
}

interface PermissionList {
  childrenNodes: PermissionList[];
  data: Permission,
  id: number;
  flag: boolean;
}

interface PermissionTree {
  title: string,
  key: number,
  flag: boolean,
  children: PermissionTree[]
}

interface PermissonNodeTree {
  id: number;
  key: number;
  parentId: number;
  parentName: string;
  authName: string;
  authCode: string;
  path: string;
  icon: string;
  authType: string;
  sortNo: number;
  level: number;
  children?: PermissonNodeTree[];
}

/**
 * 悬浮菜单
 */
interface PaneMenu {
  title: string,
  key: string,
  mainPath?: string,
  subPath?: string
}

interface FormState {
  oldPass: string,
  pass: string,
  checkPass: string
}

/**
 * 用户
 */
interface AdminUser {
  adminStatus: 'DISABLE' | 'ENABLE',
  createTime: Date,
  gender: 'MALE' | 'FEMALE',
  id: number,
  isDelete: boolean,
  latestLoginTime: Date,
  nickName: string,
  password: string,
  phone: string,
  updateTime: Date,
  userName: string,
  checked: boolean,
  [key: string]: any
}

interface UpdateAdmin {
  password: string,
}

interface ShowInfo {
  userName: string,
  nickName: string,
  passWord: string
}

/**
 * 登录信息
 */
interface AuthLoginResponse {
  saToken: string;
  id: string;
}

/**
 * 角色列表
 */
interface Role {
  createTime: string,
  id: number,
  roleDescribe: string,
  roleName: string,
  roleStatus: string,
  updateTime: string
}
