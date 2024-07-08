<template>
  <div class="pr-4">
    <a-button type="primary" class="float-right mb-4" @click="onAddMainMenu">
      新增权限
    </a-button>
    <a-table :columns="columns" :data-source="dataSource" bordered :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-button type="link" @click="onAddSubMenu(record)" class="mr-4" v-if="record.level < 3">{{ record.level === 1 ? '添加子菜单':'添加子项' }} </a-button>
          <a-button type="link" @click="onUpdateMenu(record)" class="mr-4">编辑</a-button>
          <a-button type="link" danger>
            <a-popconfirm
              title="确认删除该菜单吗？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="onDeleteMenu(record)">
              删除
            </a-popconfirm>
          </a-button>
        </template>
      </template>
    </a-table>
    <a-modal
      v-model:open="visible"
      width="600px"
      destroyOnClose
      :title="formState.id ? '编辑权限' : '新增权限'"
      @cancel="closeModel"
      @ok="onSureUpdate"
    >
      <a-divider></a-divider>
      <a-form ref="formRef" :model="formState" :rules="rules" v-bind="layout">
        <a-form-item label="关联父级菜单" name="parentName" class="mb-2" v-if="formState.parentName">
          <a-input v-model:value="formState.parentName" disabled class="h-10" />
        </a-form-item>
        <a-form-item label="菜单名称" name="authName" class="mb-2">
          <a-input v-model:value="formState.authName" autocomplete="off" class="h-10" />
        </a-form-item>
        <a-form-item label="路由参数" name="path" class="mb-2">
          <a-input v-model:value="formState.path" autocomplete="off" class="h-10" />
        </a-form-item>
        <a-form-item label="权限标识" name="authCode" class="mb-2">
          <a-input v-model:value="formState.authCode" autocomplete="off" class="h-10" />
        </a-form-item>
        <a-form-item label="排序号" name="sortNo" class="mb-2">
          <a-input v-model:value="formState.sortNo" autocomplete="off" class="h-10" />
        </a-form-item>
        <a-form-item label="图标" class="mb-2">
          <a-input v-model:value="formState.icon" autocomplete="off" class="h-10" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
const { getPermissionNode, addPermission, editPermission, deletePermission } = api;

const formRef = ref();
const defaultFormState = {
  id: null,
  authName: "",
  path: "",
  sortNo: '',
  icon: '',
  authCode: '',
  authType: 'PAGE',
  parentId: 0,
  parentName: '',
  level: 1,
  permissionId: null
};

const formState = reactive({ ...defaultFormState });

const rules: Query = ref({
  authName: [{ required: true, message: "请输入菜单名称", trigger: "change" }],
  path: [{ required: true, message: "请输入路由参数", trigger: "change" }],
  authCode: [{ required: true, message: "请输入权限标识", trigger: "change" }],
  sortNo: [{ required: true, message: "请输入排序号", trigger: "change" }]
});

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 14 },
};

const visible = ref(false);

const columns: Array<Query> = reactive([
  { title: '菜单名', dataIndex: 'authName', key: 'authName' },
  { title: '路由参数', dataIndex: 'path', key: 'path', align: 'center' },
  { title: '权限标识', dataIndex: 'authCode', key: 'authCode', align: 'center' },
  { title: '排序号', dataIndex: 'sortNo', key: 'sortNo', align: 'center' },
  { title: '图标', dataIndex: 'icon', key: 'icon', align: 'center' },
  { title: '操作', dataIndex: 'operation', key: 'operation', align: 'center' },
]);

const dataSource: PermissonNodeTree[] = reactive([]);

onMounted(() => {
  queryPermissionMenus();
});

function onAddMainMenu() {
  Object.assign(formState, defaultFormState);
  visible.value = true;
}

function closeModel() {
  formRef.value.resetFields();
  visible.value = false;
  queryPermissionMenus();
}

function onUpdateMenu(record: Record<string, any>) {
  let permisson = record as PermissonNodeTree;

  Object.assign(formState, {...permisson, ...{permissionId: permisson.id}});
  visible.value = true;
}

function onAddSubMenu(record: Record<string, any>) {
  let permisson = record as PermissonNodeTree;

  Object.assign(formState, defaultFormState);
  formState.parentId = permisson.id;
  formState.level = permisson.level + 1;
  formState.parentName = permisson.authName;
  visible.value = true;
}

async function onDeleteMenu(record: Record<string, any>) {
  let permisson = record as PermissonNodeTree;
  try{
    await deletePermission({id: permisson.id});
    queryPermissionMenus();
  }catch(e){}
}

function onSureUpdate() {
  formRef.value
    .validateFields()
    .then(async () => {
      if (formState.id) {
        await editPermission(formState);
      } else {
        await addPermission(formState);
      }
      closeModel();
    })
    .catch((e: Error) => {
      console.log(e);
    });
}

async function queryPermissionMenus() {
  try {
    dataSource.splice(0);
    let data: PermissionList[] = await getPermissionNode({});
    dataSource.push(...transformToTree(data));
  } catch (e) {
    console.error(e);
  }
}

function transformToTree(data: PermissionList[]): PermissonNodeTree[] {
  return data.map((item: PermissionList) => {
    const { id, data, childrenNodes } = item;
    const { parentId, parentName, authName, authCode, path, icon, authType, sortNo, level } = data;
    
    if(childrenNodes && childrenNodes.length){
      return {
        id,
        key: id,
        parentId,
        parentName,
        authName,
        authCode,
        path,
        icon,
        authType,
        sortNo,
        level,
        children: transformToTree(childrenNodes)
      };
    }else{
      return {
        id,
        key: id,
        parentId,
        parentName,
        authName,
        authCode,
        path,
        icon,
        authType,
        sortNo,
        level
      };
    }
  });
}
</script>