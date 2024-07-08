/**
 * 项目看板路由配置
 */
export default{
    path: "/video",
    name: 'video',
    meta: { title: "视频" },
    component: () => import("@/views/layout.vue"),
    children: [
      {
        path: 'manage',
        name: 'manage',
        component: () =>import("@/views/video/index.vue"),
        meta: {
          breadcrumb: [
            {
              label: '视频',
              value: null
            }
          ]
        }
      }
    ]
  };
  