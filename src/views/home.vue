<template>
  <div>
    <a-row type="flex" class="w-screen h-screen">
      <a-col flex="130px">
        <div class="w-full h-full bg-cover bg-no-repeat bg-[url('@/assets/image/leftMenu-bg.png')] flex flex-col items-center">
          <img class="size-[54px] mt-[30px]" />
          <div class="ml-[20px]">
            <div class="mt-[26px] flex items-center cursor-pointer" :class="{select: menuIndex === index}" v-for="(menu, index) in mainMenus" :key="menu.id" @click="onChangeMainMenu(index)">
              <img :src="menuIcon(menu.data.icon, menuIndex === index)" class="mr-2"/>
              <span class="text-[14px]"  :style="{ color: menuIndex === index ? '#fff' : '#000' }">{{ menu.data.authName }}</span>
            </div>
          </div>
        </div>
      </a-col>
      <a-col flex="auto">
        <div class="absolute h-full left-[-14px] right-0 z-10 rounded-t-2xl bg-white flex flex-col">
          <div class="w-full h-[73px] relative border-b-[0.8px]">
            <a-row>
              <a-col :span="18" class="ml-[118px]">
                <a-tabs :activeKey="activeKey" hide-add type="editable-card" class="mt-8" @edit="onEdit" @tabClick="onTabChange">
                  <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="panes.length > 1">
                  </a-tab-pane>
                </a-tabs>
              </a-col>
            </a-row>
            <a-popover placement="bottom">
              <template #content>
                <p class="pt-3 pb-4 text-xm cursor-pointer" @click="visible = true">修改密码</p>
                <p class="pb-3 text-xm cursor-pointer" @click="onLogOut">退出登录</p>
              </template>
              <div class="absolute right-9 top-8 flex items-center text-xm font-normal"><span class="mr-2">Admin</span><DownOutlined /></div>
            </a-popover>
          </div>
          <a-row class="flex flex-1">
            <a-col flex="118px" class="flex flex-col items-center">
              <div class="mt-[17px] px-[11px] text-[13px] py-[8px] flex w-11/12 cursor-pointer" :class="{subBg: subMenuIndex === idx}" v-for="(subMenu, idx) in subMenus" :key="subMenu.id" @click="onChangeSubMenu(idx, subMenu.data.path, subMenu.data.authName)">
                <span :style="{ color: subMenuIndex === idx ? '#3978f7' : '#737f93' }">{{ subMenu.data.authName }}</span>
              </div>
              <a-divider type="vertical" style="background-color: #eee" class="h-full absolute right-0 m-0"/>
            </a-col>
            <a-col flex="auto" class="flex box-border p-4">
              <div class="absolute inset-x-4 inset-y-4 overflow-auto right-0">
                <router-view v-slot="{ Component }">
                  <keep-alive>
                    <component :is="Component" />
                  </keep-alive>
                </router-view>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
    <a-modal v-model:open="visible" width="500px" destroyOnClose title="修改密码" @cancel="onCancelModal" @ok="onSureUpdate">
      <a-divider></a-divider>
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        v-bind="layout"
      >
        <a-form-item has-feedback label="请输入旧密码" name="oldPass"  class="mt-4 mb-2">
          <a-input v-model:value="formState.oldPass" autocomplete="off" class="h-10"/>
        </a-form-item>
        <a-form-item has-feedback label="请输入新密码" name="pass" class="mb-2">
          <a-input v-model:value="formState.pass" autocomplete="off" class="h-10"/>
        </a-form-item>
        <a-form-item has-feedback label="请确认新密码" name="checkPass" class="mb-0">
          <a-input v-model:value="formState.checkPass" class="h-10" autocomplete="off" />
        </a-form-item>
      </a-form>
      <a-divider></a-divider>
    </a-modal>
  </div>
  </template>
<script lang="ts" setup>
import { DownOutlined } from '@ant-design/icons-vue';
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
const { authLogout, changePassword } = api;
const { successMessage, validataorPassword } = utils

const router = useRouter();  
const formRef = ref();
let visible = ref(false);
//当前选中的主菜单序号
let menuIndex = ref(0);
//选中子菜单序号
let subMenuIndex = ref(0);
//主菜单
let mainMenus: Array<PermissionList> = reactive([]);
//悬浮Tab菜单栏
let panes:Array<PaneMenu> = reactive([]);
let activeKey = ref();
//Form 表单
const formState: FormState = reactive({
  oldPass: '',
  pass: '',
  checkPass: ''
});

//form表单校验
let validatePass = async () => {
  if (formState.pass === '') {
    return Promise.reject('请输入新密码！');
  } else if (!validataorPassword(formState.pass)){
    return Promise.reject('同时包含英文字母、数字和符号');
  } else {
    if (formState.checkPass !== '') {
      formRef.value.validateFields('checkPass');
    }
    return Promise.resolve();
  }
};
let validateConfirmPass = async () => {
  console.log(validataorPassword(formState.checkPass))
  if (formState.checkPass === '') {
    return Promise.reject('请输入确认密码！');
  } else if (!validataorPassword(formState.checkPass)){
    return Promise.reject('同时包含英文字母、数字和符号');
  } else if (formState.checkPass !== formState.pass) {
    return Promise.reject("两次密码输入不一致!");
  } else {
    return Promise.resolve();
  }
};

const rules: Query = ref({
  oldPass: [{ required: true, message: '请输入旧密码', trigger: 'change' }],
  pass: [{ required: true, validator: validatePass, trigger: 'change' }],
  checkPass: [{  required: true, validator: validateConfirmPass, trigger: 'change' }]
});

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 14 },
};

const subMenus = computed(()=>{
  if(!mainMenus.length)return [];
  return mainMenus[menuIndex.value].childrenNodes;
})

const menuIcon = computed(()=>(icon: string, select: boolean)=>{
  if (icon === 'm-system') {
    if(select){
      return new URL('@/assets/image/menu/m-system-select.png', import.meta.url).href;
    }
    return new URL('@/assets/image/menu/m-system.png', import.meta.url).href;
  }
  return '';
})

//动态缓存
watch(
  activeKey,
  () => {
    if(activeKey.value){
      sessionStorage.setItem('activeKey', activeKey.value);
    }
  },
  { immediate: true }
)

watch(
  panes,
  () => {
    if(panes.length){
      sessionStorage.setItem('tabMenus', JSON.stringify(panes));
    }
  },
  { immediate: true }
)

onMounted(()=>{
  doMenus();

  router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (from.path !== '/' && mainMenus.length && to.name !== 'login') {
      //优先判断to路径是否是第二级
      const exist = mainMenus.some((main: PermissionList) => 
        main.childrenNodes.some((v: PermissionList) => v.data.path === to.path)
      );
      if(!exist){
        // 找出 from.path 在 mainMenus 中的下标
        const mainIndex = mainMenus.findIndex((main: PermissionList) => 
          main.childrenNodes.some((v: PermissionList) => v.data.path === from.path)
        );

        const childrenNodeIndex = mainMenus[mainIndex].childrenNodes.findIndex((v: PermissionList) => v.data.path === from.path);

        //刷新悬浮菜单
        if(panes.findIndex((v: PaneMenu)=>v.key === to.path) === -1){
          if (to.meta && to.meta.breadcrumb && Array.isArray(to.meta.breadcrumb) && to.meta.breadcrumb.length > 0) {
            panes.push({ 
              title: to.meta.breadcrumb[0].label, 
              key: to.path, 
              mainPath: mainMenus[mainIndex].data.path, 
              subPath: mainMenus[mainIndex].childrenNodes[childrenNodeIndex].data.path 
            });
          }
        }
        activeKey.value = to.path;
      }
    }
    next();
  });
})

//删除菜单
function onEdit(targetKey: any){
  let index = panes.findIndex(v=>v.key === targetKey);

  if(activeKey.value === targetKey){
    if(index > 0){
      activeKey.value = panes[index - 1].key;
    }else{
      activeKey.value = panes[index + 1].key;
    }

    mainMenus.map((main:PermissionList, index: number)=>{
      if(main.childrenNodes.findIndex((v:PermissionList)=>v.data.path === activeKey.value) !== -1){
        menuIndex.value = index;
        subMenuIndex.value = mainMenus[index].childrenNodes.findIndex((v:PermissionList)=>v.data.path === activeKey.value);

        sessionStorage.setItem('mainMenu', mainMenus[index].data.path);
        sessionStorage.setItem('subMenu', activeKey.value);
      }
    })
    router.replace({path: activeKey.value});
  }
  panes.splice(index, 1);
}

//切换浮动菜单
function onTabChange(key: any) {
  //优先判断key是否是第二级菜单
  const exist = mainMenus.some((main: PermissionList) => 
    main.childrenNodes.some((v: PermissionList) => v.data.path === key)
  );

  if (exist) {
    activeKey.value = key;
    router.replace({ path: key });

    mainMenus.some((main: PermissionList, index: number) => {
      const subIndex = main.childrenNodes.findIndex((v: PermissionList) => v.data.path === key);
      if (subIndex !== -1) {
        menuIndex.value = index;
        subMenuIndex.value = subIndex;

        sessionStorage.setItem('mainMenu', mainMenus[index].data.path);
        sessionStorage.setItem('subMenu', key);
        return true; // 提前退出循环
      }
    });
  } else {
    panes.forEach((pane: PaneMenu) => {
      if (pane.key === key && pane.mainPath !== undefined && pane.subPath !== undefined) {
        activeKey.value = key;
        router.replace({ path: key });

        mainMenus.some((main: PermissionList, index: number) => {
          if (main.data.path === pane.mainPath) {
            const subPath = pane.subPath || ''; // Using empty string as a default value

            menuIndex.value = index;
            subMenuIndex.value = main.childrenNodes.findIndex((v: PermissionList) => v.data.path === subPath);

            sessionStorage.setItem('mainMenu', mainMenus[index].data.path);
            sessionStorage.setItem('subMenu', subPath);
            return true; // 提前退出循环
          }
        });
      }
    });
  }
}

//切换主菜单
function onChangeMainMenu(key: number){
  debugger
  menuIndex.value = key;
  subMenuIndex.value = 0;
  sessionStorage.setItem('mainMenu', mainMenus[key].data.path);
  //切换子菜单
  let path = mainMenus[key].childrenNodes[0].data.path;
  sessionStorage.setItem('subMenu', path);
  
  activeKey.value = path;

  if(panes.findIndex((v:PaneMenu)=>v.key === path) === -1){
    panes.push({key: path, title: mainMenus[key].childrenNodes[0].data.authName})
  }
  router.replace({path});
}

//切换子菜单
function onChangeSubMenu(idx: number, path: string, authName: string){
  subMenuIndex.value = idx;
  sessionStorage.setItem('subMenu', path);
  activeKey.value = path;

  if(panes.findIndex((v:PaneMenu)=>v.key === path) === -1){
    panes.push({key: path, title: authName})
  }
  router.replace({path});
  
}

//登出
async function onLogOut(){
  try{
    await authLogout(sessionStorage.getItem('loginId'))
    sessionStorage.clear();
    router.replace({name: 'login'});
  }catch(e){}
}

function onSureUpdate(){
  //校验输入密码
  formRef.value.validateFields().then(async()=>{
    try{
      await changePassword(sessionStorage.getItem('loginId'), formState.oldPass, formState.checkPass);
      successMessage("密码修改成功");
      visible.value = false;
      onLogOut();
    }catch(e){}
  }).catch((e:Error)=>{
    console.log(e)
  })
}

function onCancelModal(){
  formRef.value.resetFields();
}

//处理菜单
function doMenus(){
  const permissonMenus = sessionStorage.getItem('permissonMenus') as string;
  if (permissonMenus) {
    let menus = JSON.parse(permissonMenus);
    if(!menus.length)return;

    mainMenus.push(...menus);

    //查询缓存最近保存的路由
    if(sessionStorage.getItem('mainMenu')){
      menuIndex.value = mainMenus.findIndex((v:PermissionList)=>v.data.path === sessionStorage.getItem('mainMenu'));
      subMenuIndex.value = mainMenus[menuIndex.value].childrenNodes.findIndex((v:PermissionList)=>v.data.path === sessionStorage.getItem('subMenu'));
    }
    //保存初始化位置
    sessionStorage.setItem('mainMenu', mainMenus[menuIndex.value].data.path);
    sessionStorage.setItem('subMenu', mainMenus[menuIndex.value].childrenNodes[subMenuIndex.value].data.path);

    //初始化选中菜单
    if(sessionStorage.getItem('tabMenus')){
      panes.push(...JSON.parse(sessionStorage.getItem('tabMenus') as string));

      if(sessionStorage.getItem('activeKey')){
        activeKey.value = sessionStorage.getItem('activeKey');
      }
    }else{
      activeKey.value = mainMenus[menuIndex.value].childrenNodes[subMenuIndex.value].data.path;
      panes.push({ title: mainMenus[menuIndex.value].childrenNodes[subMenuIndex.value].data.authName, key: mainMenus[menuIndex.value].childrenNodes[subMenuIndex.value].data.path });
    }
  }
}

</script>
<style>
.ant-tabs-nav{
  margin-bottom: 0px !important;
}
.ant-tabs-nav::before{
  border-bottom: unset !important;
}
.select{
  background: url('@/assets/image/menu-selectBox.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 94px;
  height: 76px;
  padding-left: 10px;
  margin-left: -10px;
}
.subBg{
  background: #f2f7ff;
  border-radius: 6px;
}
</style>