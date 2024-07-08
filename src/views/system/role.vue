<template>
  <div>
    <CustomTable :tableSource="tableSource" ref="Table">
      <template v-slot:customSlot>
        <a-button
          type="primary"
          class="flex justify-center items-center"
          @click="onAdd"
          >新增角色</a-button>
      </template>
      <template #cell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-button type="link" @click="onEdit(record)">编辑</a-button>
          <a-button type="text" danger>
            <a-popconfirm
              title="确认删除该角色吗？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="onDeleteRole(record)">
              删除
            </a-popconfirm>
          </a-button>
          <a-button type="link" @click="onAuthPermission(record)">权限配置</a-button>
          <a-button type="link" @click="onAuthUser(record)">授权用户</a-button>
          <!-- <a-button type="link" @click="onDetail()">测试详情</a-button> -->
        </template>
        <template v-if="column.dataIndex === 'STATUS_TYPE' && column.key !== undefined">
          <div class="flex justify-center items-center">
            <div v-if="record[column.key] === 'ENABLE'" class="text-[#2ba471] border border-[#2ba471] bg-[#e3f9e9] w-24 h-9 flex justify-center items-center rounded">启用</div>
            <div v-else class="text-[#d54941] border border-[#d54941] bg-[#ffedee] w-24 h-9 flex justify-center items-center rounded">停用</div>
          </div>
        </template>
        <template v-if="column.key === 'updateTime'&& column.key !== undefined">
          {{ formatDay(record[column.key]) }}
        </template>
      </template>
    </CustomTable>
    <a-modal
      v-model:open="visible"
      width="600px"
      destroyOnClose
      :title="formState.id ? '编辑角色' : '新增角色'"
      @cancel="closeModel"
      @ok="onSureUpdate"
    >
      <a-form ref="formRef" :model="formState" :rules="rules" v-bind="layout">
        <a-divider></a-divider>
        <a-form-item
          has-feedback
          label="请输入角色名"
          name="roleName"
          class="mt-4 mb-2"
        >
          <a-input
            v-model:value="formState.roleName"
            autocomplete="off"
            class="h-10"
          />
        </a-form-item>
        <a-form-item
          has-feedback
          label="请输入角色描述"
          class="mb-2 mt-4"
        >
          <a-textarea
            v-model:value="formState.roleDescribe"
            class="h-20"
            autosize
            :showCount="false"
          />
        </a-form-item>
      </a-form>
      <a-divider></a-divider>
    </a-modal>
    <a-modal
      v-model:open="visibleUser"
      width="600px"
      destroyOnClose
      title="授权用户"
      :footer="null"
    > 
      <Transfer keyWord="adminNickNameKeyword" :transferSource="transferSource"></Transfer>
    </a-modal>
    <a-modal
      v-model:open="visiblePermission"
      width="600px"
      destroyOnClose
      title="权限配置"
      @ok="onUpdatePermisson"
    > 
      <a-divider></a-divider>
      <a-tree
        v-model:checkedKeys="checkedKeys"
        checkable
        checkStrictly
        :tree-data="treeData"
        @check="onCheckTree"
      >
      </a-tree>
      <a-divider></a-divider>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
// import router from "@/router/index";
const { getRolePage, addRole, deleteRole, getUnauthorizedRoleAdminList, getAuthorizedRoleAdminList, cancelBindAdmin, bindAdmin, updateRole, getRolePermissionNode, updatePermission } = api;
const { successMessage, dayjs } = utils;
const Table = ref();
const visible = ref(false);
const visibleUser = ref(false);
const visiblePermission = ref(false);
const formRef = ref();

let transferSource: TransferSource = {
  api: getUnauthorizedRoleAdminList,
  rightApi: getAuthorizedRoleAdminList,
  query: {},
  key: 'userName',
  transferLeftApi: cancelBindAdmin,
  transferRightApi: bindAdmin
}

let tableSource: TableSource = {
  api: getRolePage,
  query: {},
  searchForms: [
    {
      name: "角色名",
      key: "roleNameKeyword",
      placeholder: "搜索角色名",
    },
  ],
  columns: [
    {
      title: "角色名",
      key: "roleName",
      dataIndex: "roleName",
      align: "center",
    },
    {
      title: "角色描述",
      key: "roleDescribe",
      dataIndex: "roleDescribe",
    },
    {
      title: "状态",
      key: "roleStatus",
      dataIndex: "STATUS_TYPE",
      align: "center",
      width: '10%'
    },
    {
      title: "更新时间",
      key: "updateTime",
      dataIndex: "updateTime",
      align: "center",
      width: '15%'
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: "20%",
      align: "center",
    },
  ],
};

//Form 表单 定义默认值
const defaultFormState = {
  id: 0,
  roleName: "",
  roleDescribe: "",
  roldId: 0
};

const formState = reactive({ ...defaultFormState });

const rules: Query = ref({
  roleName: [{ required: true, message: "请输入角色名", trigger: "change" }],
  roleDescribe: [{ required: true, message: "请输入描述", trigger: "change" }],
});

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 14 },
};

//树状结构data
const treeData: PermissionTree[] = reactive([]);
const checkedKeys = ref<number[]>([]);
const selectedKeys = ref<string[]>([]);

onMounted(() => {
  Table.value.refresh();
});

const formatDay = computed(()=>(date: string)=>{
  return dayjs(date).format('YYYY-MM-DD HH:mm');
})

function closeModel() {
  formRef.value.resetFields();
  visible.value = false;
  Table.value.refresh();
}

//编辑角色
function onSureUpdate() {
  formRef.value
    .validateFields()
    .then(async () => {
      if(formState.roldId){
        await updateRole(formState)
      }else{
        await addRole(formState)
        visible.value = true;
      }
      successMessage(formState.id ? "更新角色成功":"新增角色成功");
      closeModel();
    })
    .catch((e: Error) => {
      console.log(e);
    });
}

//新增角色
function onAdd() {
  Object.assign(formState, defaultFormState);
  visible.value = true;
}

function onEdit(record: Record<string, any>){
  const role = record as Role;

  Object.assign(formState, {roldId: role.id, roleName: role.roleName, roleDescribe: role.roleDescribe});
  visible.value = true;
}

//删除角色
async function onDeleteRole(record: Record<string, any>){
  const role = record as Role;
  
  try{
    await deleteRole({id: role.id});
    Table.value.refresh();
  }catch(e){}
}

//授权用户
function onAuthUser(record: Record<string, any>){
  const role = record as Role;

  transferSource.query = {roleId: role.id};
  visibleUser.value = true;
}

//权限配置
function onAuthPermission(record: Record<string, any>){
  const role = record as Role;

  formState.roldId = role.id;
  queryPermissionNode();
  visiblePermission.value = true;
}


//保存选中的权限ID
function onCheckTree(event: Query){
  selectedKeys.value = event.checked;
}

async function onUpdatePermisson(){
  try{
    await updatePermission({roleId: formState.roldId, permissionIds: selectedKeys.value});
    successMessage('权限配置成功！')
    selectedKeys.value = [];
    visiblePermission.value = false;
  }catch(e){console.log(e)}
}

//查询权限树
async function queryPermissionNode(){
  try{
    treeData.splice(0);

    let data: PermissionList[] = await getRolePermissionNode({id: formState.roldId});
    treeData.push(...convertToTreeData(data))
    checkedKeys.value = getKeysWithTrueFlag(treeData)
  }catch(e){console.log(e)}
}

//递归树状数据
function convertToTreeData(data: PermissionList[]) {
  return data.map((item: PermissionList) => {
    const newItem: PermissionTree = {
        title: item.data.authName,
        key: item.id,
        flag: item.flag,
        children: item.childrenNodes ? convertToTreeData(item.childrenNodes) : []
    };
    return newItem;
  });
}

function getKeysWithTrueFlag(treeData: PermissionTree[]) {
  let keys: number[] = [];

  function traverse(node: PermissionTree) {
      if (node.flag === true) {
          keys.push(node.key);
      }
      if (node.children && node.children.length > 0) {
          node.children.forEach((child: PermissionTree) => traverse(child));
      }
  }

  treeData.forEach((node: PermissionTree) => traverse(node));
  return keys;
}

// function onDetail(){
//   router.replace({path: '/user/roleInfo'})
// }

</script>
    
    