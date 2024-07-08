<template>
  <div class="h-80 pt-4 pb-4">
    <a-row class="h-full">
      <a-col :span="10">
        <div
          class="border border-[#d9d9d9] h-full p-4 box-border relative rounded"
        >
          <div class="flex">
            <a-checkbox v-model:checked="leftChecked" @change="onChangeAll('left')"></a-checkbox>
            <a-input
              v-model:value="leftSearchValue"
              class="ml-2"
              :placeholder="leftPlaceholder"
              @input="getDataSource"
            ></a-input>
          </div>
          <div class="absolute left-4 right-0 top-14 bottom-0 overflow-scroll">
            <div v-for="item in dataSource" :key="item.id" class="h-8 mt-2">
              <a-checkbox v-model:checked="item.checked" @change="onChangeOption('left')">{{
                item[transferSource.key]
              }}</a-checkbox>
            </div>
            <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" v-if="!dataSource.length"/>
          </div>
        </div>
      </a-col>
      <a-col :span="4">
        <div class="flex justify-center items-center h-full flex-col">
          <div
            class="border border-[#d9d9d9] w-7 h-7 rounded flex justify-center items-center cursor-pointer"
            @click="onTransferLeft"
          >
            <LeftOutlined />
          </div>
          <div
            class="border border-[#d9d9d9] w-7 h-7 rounded mt-4 flex justify-center items-center cursor-pointer"
            @click="onTransferRight"
          >
            <RightOutlined />
          </div>
        </div>
      </a-col>
      <a-col :span="10">
        <div
          class="border border-[#d9d9d9] h-full p-4 box-border relative rounded"
        >
          <div class="flex">
            <a-checkbox v-model:checked="rightChecked" @change="onChangeAll('right')"></a-checkbox>
            <a-input
              class="ml-2"
              :placeholder="rightPlaceholder"
              @input="getRightDataSource"
              v-model:value="rightSearchValue"
            ></a-input>
          </div>
          <div class="absolute left-4 right-0 top-14 bottom-0 overflow-scroll">
            <div v-for="item in rightDataSource" :key="item.id" class="h-8 mt-2">
              <a-checkbox v-model:checked="item.checked"  @change="onChangeOption('right')">{{ item[transferSource.key] }}</a-checkbox
              >
            </div>
            <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" v-if="!rightDataSource.length"/>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
const { successMessage, Empty } = utils;
let leftChecked = ref(false);
let rightChecked = ref(false);
let leftSearchValue = ref("");
let rightSearchValue = ref("");

const props = defineProps({
  transferSource: {
    type: Object as () => TransferSource,
    default() {
      return {};
    },
  },
  leftPlaceholder: {
    type: String,
    default: "请输入搜索名称",
  },
  rightPlaceholder: {
    type: String,
    default: "请输入搜索名称",
  },
  keyWord: {
    type: String,
    default: "",
  }
});

//数据源
const dataSource: AdminUser[] = reactive([]);
//右侧数据源
const rightDataSource: AdminUser[] = reactive([]);

onMounted(() => {
  getDataSource();
  getRightDataSource();
});

//选择全部
function onChangeAll(type: string){
  if(type === 'left'){
    dataSource.map((v: AdminUser) => {
      v.checked = leftChecked.value;
    });
  }else{
    rightDataSource.map((v: AdminUser) => {
      v.checked = rightChecked.value;
    });
  }
}

function onChangeOption(type: string){
  if(type === 'left'){
    leftChecked.value = dataSource.every((v: AdminUser) => v.checked);
  }else{
    rightChecked.value = rightDataSource.every((v: AdminUser) => v.checked);
  }
}

//获取数据源
async function getDataSource() {
  try {
    dataSource.splice(0);
    leftChecked.value = false;

    let data = await props.transferSource.api({
      pageNo: 1,
      pageSize: 50,
      [props.keyWord]: leftSearchValue.value,
      ...props.transferSource.query
    });
    data.records.map((v: AdminUser) => {
      v.checked = false;
    });
    dataSource.push(...data.records);
  } catch (e) {}
}

async function getRightDataSource() {
  try {
    rightDataSource.splice(0);
    rightChecked.value = false;

    let data = await props.transferSource.rightApi({
      ...props.transferSource.query,
      pageNo: 1,
      pageSize: 50,
      [props.keyWord]: rightSearchValue.value
    });
    data.records.map((v: AdminUser) => {
      v.checked = false;
    });
    rightDataSource.push(...data.records);
  } catch (e) {}
}

//移动至左侧
async function onTransferLeft(){
  try{
    await props.transferSource.transferLeftApi({...props.transferSource.query, adminIdList: rightDataSource.filter(v => v.checked).map(v => v.id)});
    await getDataSource();
    await getRightDataSource();
    successMessage('数据移动成功!')
  }catch(e){}
}


//移动至右侧
async function onTransferRight(){
  try{
    await props.transferSource.transferRightApi({...props.transferSource.query, adminIdList: dataSource.filter(v => v.checked).map(v => v.id)});
    await getDataSource();
    await getRightDataSource();
    successMessage('数据移动成功!')
  }catch(e){}
}

</script>