/**
 * 项目看板路由配置
 */
export default{
  path: "/user",
  name: 'user',
  meta: { title: "用户" },
  component: () => import("@/views/layout.vue"),
  children: [
    {
      path: 'list',
      name: 'list',
      component: () =>import("@/views/system/user.vue"),
      meta: {
        breadcrumb: [
          {
            label: '用户',
            value: null
          }
        ]
      }
    },
    {
      path: 'menuPermission',
      name: 'menuPermission',
      component: () =>import("@/views/system/menu.vue"),
      meta: {
        breadcrumb: [
          {
            label: '菜单权限',
            value: null
          }
        ]
      }
    },
    {
      path: 'role',
      name: 'role',
      component: () =>import("@/views/system/role.vue"),
      meta: {
        breadcrumb: [
          {
            label: '角色',
            value: null
          }
        ]
      }
    },
    {
      path: 'roleInfo',
      name: 'roleInfo',
      component: () =>import("@/views/system/roleInfo.vue"),
      meta: {
        breadcrumb: [
          {
            label: '角色详情',
            value: null
          }
        ]
      }
    }
  ]
};
