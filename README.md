## 项目简介
AIFactory  新架构

### 技术栈
- 前端框架：(Vue3 + TS + tailwindcss + vue-hooks-plus)
- 状态管理：[pinia](https://pinia.vuejs.org/zh/)
- 组件 AntDesign https://next.antdv.com/components/overview-cn
  
## 资料说明
AIFactory  AI工厂批量视频拼音转化多国语言


### 📗 接口文档
需要安装VPN 部署在物理机。
Swagger
http://10.29.70.8:32518/api/swagger-ui/#/

### 📦 项目源码
阿里云 云效
https://codeup.aliyun.com/66690e5ddba1fd117e80ca7a/Frontend/AIFactory-frontend/tree/master





1. 安装nvm node版本控制器   调整node版本 18.18.0  
   GitHub地址 (如果更新地址自行查找)

   **必须安装在默认目录下 否则不能全局使用nvm命令
   https://github.com/coreybutler/nvm-windows/releases

   安装完成后 再执行一下命令
```shell
nvm install 18.18.0
nvm use 18.18.0
node -v   
```

2. 安装依赖
```shell
npm install -g yarn
yarn install
```

3. 运行程序
```shell
yarn run dev

4. 清除缓存 手动删除 node_modules文件夹
```shell
yarn cache clean


### 工程结构解析
```

├── dist                       # 打包文件夹（可删除重新打包）
├── src                        # 源代码
│   ├── api                    # 接口文件
│   ├── components             # 全局组件
│   ├── hooks                  # 组件共用方法集
│   ├── stores                 # 全局 pinia store
│       └── index.ts           # store 入口
│   ├── types                  # 类型声明文件
│       └── auto-imports.d.ts  # 全局自动引入vue声明
│   ├── assets                 # 类型声明文件
│       └── index.scss         # 全局sass样式调用
│   ├── router                 # 路由文件
│       └── index.ts           
│   ├── views                  # 页面文件
│       └──            
│   ├── utils                  # 全局方法
│      ├── index.ts            # 工具类方法
│      ├── filter.ts           # 过滤工具类方法
│      └── http.ts             # 请求类方法
│   ├── App.vue                # 入口页面
│   ├── main.ts                # Vue初始化入口文件
├── .gitignore                 # git 忽略文件
├── index.html                 # H5 端首页
├── package.json               # package.json 依赖
├── tsconfig.json              # typescript 配置
├── tsconfig.node.json         # typescript 在node环境中的配置
├── tailwind.config            # 全局引用样式的css的配置
├── .env.dev                   # 测试环境配置
├── .env.pro                   # 生产环境配置
└── vite.config.ts             # vite 配置
```
