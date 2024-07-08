<template>
  <div>
    <CustomTable :tableSource="tableSource" ref="Table">
      <template v-slot:customSlot>
        <a-button type="primary" class="flex justify-center items-center" @click="onAdd">新增用户</a-button>
      </template>
      <template #cell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-button type="link" class="mr-4" @click="onEdit(record)">编辑</a-button>
          <a-button type="text" danger class="mr-4" v-if="record.adminStatus === 'DISABLE'">
            <a-popconfirm
              title="确认启用该用户吗？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="onEnable(record)">
              启用
            </a-popconfirm>
          </a-button>
          <a-button type="text" danger class="mr-4" v-else>
            <a-popconfirm
              title="确认停用该用户吗？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="onDisable(record)">
              停用
            </a-popconfirm>
          </a-button>
          <a-button type="text" class="text-[#999]">
            <a-popconfirm
              title="确认重置该用户密码吗？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="onReset(record)">
              重置密码
            </a-popconfirm>
          </a-button>
        </template>
        <template v-if="column.dataIndex === 'GENDER_TYPE'&& column.key !== undefined">
          {{ enumName(column.dataIndex, record[column.key]) }}
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
    <a-modal v-model:open="visible" width="600px" destroyOnClose :title="formState.id ?'编辑人员':'新增人员'" @cancel="closeModel" @ok="onSureUpdate">
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        v-bind="layout"
      >
        <a-divider></a-divider>
        <a-form-item has-feedback label="请输入用户名" name="userName"  class="mt-4 mb-2">
          <a-input v-model:value="formState.userName" autocomplete="off" class="h-10"/>
        </a-form-item>
        <a-form-item has-feedback label="请输入姓名" name="nickName" class="mb-2 mt-4">
          <a-input v-model:value="formState.nickName" autocomplete="off" class="h-10"/>
        </a-form-item>
        <a-form-item has-feedback label="请输入手机号" name="phone" class="mb-0 mt-4">
          <a-input v-model:value="formState.phone" class="h-10" autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="请选择性别" name="gender" class="mb-0 mt-4">
          <a-radio-group v-model:value="formState.gender" button-style="solid">
            <a-radio-button value="MALE">男</a-radio-button>
            <a-radio-button value="FEMALE">女</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-form>
      <a-divider></a-divider>
    </a-modal>
    <a-modal v-model:open="visibleInfo" width="500px" title="用户信息" destroyOnClose @ok="visibleInfo = false">
      <a-divider />
      <div class="flex flex-col">
        <span>用户名：{{ showInfo.userName }}</span>
        <span class="mt-4">姓名：{{ showInfo.nickName }}</span>
        <span class="mt-4">密码：{{ showInfo.passWord }}</span>
      </div>
      <a-divider />
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
const { getAdminPage, generateAdmin, disableAdmin, enableAdmin, resetPassword, updateAdmin } = api;
const { successMessage, validatorPhone, Modal, dayjs } = utils;

//新增成功后的展示用户信息
let showInfo: ShowInfo = reactive({
  userName: '',
  nickName: '',
  passWord: ''
});

const Table = ref();
const visible = ref(false);
const visibleInfo = ref(false);
const formRef = ref();

let tableSource: TableSource = {
  api: getAdminPage,
  query: {},
  searchForms: [
    {
      name: "用户名",
      key: "userNameKeyword",
      placeholder: "搜索名字",
    },
    {
      name: "姓名",
      key: "nickNameKeyword",
      placeholder: "搜索姓名",
    },
    {
      name: "手机号",
      key: "phoneKeyword",
      placeholder: "搜索手机号",
    }
  ],
  columns: [
    {
      title: "用户名",
      key: "userName",
      dataIndex: "userName",
      align: 'center'
    },
    {
      title: "姓名",
      key: "nickName",
      dataIndex: "nickName",
      align: 'center'
    },
    {
      title: "手机号",
      key: "phone",
      dataIndex: "phone",
      align: 'center'
    },
    {
      title: "性别",
      key: "gender",
      dataIndex: "GENDER_TYPE",
      align: 'center'
    },
    {
      title: "状态",
      key: "adminStatus",
      dataIndex: "STATUS_TYPE",
      align: 'center'
    },
    {
      title: "更新时间",
      key: "updateTime",
      dataIndex: "updateTime",
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
      align: 'center'
    },
  ]
};

//Form 表单 定义默认值
const defaultFormState = {
  id: null,
  userName: '',
  phone: '',
  nickName: '',
  gender: ''
};

const formState = reactive({ ...defaultFormState });

//校验手机号
const validatePhone = async () => {
  if (formState.phone === '') {
    return Promise.reject('请输入手机号');
  } else {
    if (!validatorPhone(formState.phone)) {
      return Promise.reject('手机号格式有误！');
    }
    return Promise.resolve();
  }
};

const rules: Query = ref({
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  userName: [{ required: true, message: '请输入用户名', trigger: 'change' }],
  nickName: [{ required: true, message: '请输入昵称', trigger: 'change' }],
  phone: [{  required: true, validator: validatePhone, trigger: 'change' }]
});

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 14 },
};

const enumName = computed(()=>(enumType:string, value:string)=>{
  return getEnumName(enumType, value);
})

const formatDay = computed(()=>(date: string)=>{
  return dayjs(date).format('YYYY-MM-DD HH:mm');
})

onMounted(()=>{
  Table.value.refresh();
})

//新增用户
function onAdd(){
  Object.assign(formState, defaultFormState);
  visible.value = true;
}

//编辑用户
function onEdit(record: Record<string, any>){
  const user = record as AdminUser;
  visible.value = true;
  Object.assign(formState, user);
}


//新增用户
function onSureUpdate(){
  formRef.value.validateFields().then(async()=>{
    if(formState.id){
      await updateAdmin(formState)
    }else{
      let data: UpdateAdmin = await generateAdmin(formState)
      visibleInfo.value = true;
      Object.assign(showInfo, {userName: formState.userName, nickName: formState.nickName, passWord: data.password})
    }
    successMessage(formState.id ? "更新用户成功":"新增用户成功");
    closeModel();    
  }).catch((e:Error)=>{
    console.log(e)
  })
}

function closeModel(){
  formRef.value.resetFields();
  visible.value = false;
  Table.value.refresh();
}

//启用
async function onEnable(record: Record<string, any>){
  const user = record as AdminUser;
  try{
    await enableAdmin({id: user.id})
    successMessage("启用成功");
    Table.value.refresh();
  }catch(e){}
}

//停用
async function onDisable(record: Record<string, any>){
  const user = record as AdminUser;
  try{
    await disableAdmin({id: user.id})
    successMessage("停用成功");
    Table.value.refresh();   
  }catch(e){}
}

//重置密码
async function onReset(record: Record<string, any>) {
  const user = record as AdminUser;

  try{
    let data: UpdateAdmin = await resetPassword({id: user.id})
    Modal.info({
      title: '重置新密码',
      content: h('div', {}, [
        h('p', data.password)
      ]),
      onOk() {
      },
    });
    successMessage("重置成功");
  }catch(e){}
}
</script>
  
  