<template>
  <div>
    <SearchBar
      :searchForms="tableSource.searchForms"
      @searchTable="onSearchList"
    ></SearchBar>
    <div class="pt-4 pb-6 flex justify-between">
        <span class="text-2xl font-bold">数据列表</span>
        <div class="mr-4">
          <slot name="customSlot"></slot>
        </div>
    </div>
    <a-table
      class="mr-4"
      bordered
      :loading="loading"
      :columns="tableSource.columns"
      :data-source="dataSource"
      :pagination="false"
    >
    <template #bodyCell="{ column, text, record }">
      <slot name="cell" :column="column" :text="text" :record="record"></slot>
    </template>
    </a-table>
    <a-pagination hideOnSinglePage v-model:current="current" :total="pagination.total" show-less-items @change="handleTableChange" class="mt-4 float-right"/>
  </div>
</template>
<script lang="ts" setup>
let dataSource: Array<Query> = reactive([]);
let pageNo = ref(1);
let loading = ref(true);
let current = ref(1);
let pagination = reactive({total: 0});

const props = defineProps({
  tableSource: {
    type: Object as () => TableSource,
    default() {
      return {
        searchForms: [],
        columns: [],
      };
    },
  },
  pageSize: {
    type: Number,
    default: 10,
  },
});

/**
 * 暴露方法
 */
defineExpose({ refresh });

/**
 * 请求列表
 */
async function refresh() {
  pageNo.value = 1;
  current.value = 1;
  loadData();
}

/**
 * 搜索查询
 */
function onSearchList(event: Query) {
  console.log(event);
  pageNo.value = 1;
  props.tableSource.query = event;
  current.value = 1;
  loadData();
}

/**
 * 分页查询
 */
function handleTableChange(event: number) {
  pageNo.value = event;
  loadData();
}

async function loadData(){
  loading.value = true;
  dataSource.splice(0);
  
  const data = await props.tableSource.api({
    pageNo: pageNo.value,
    pageSize: props.pageSize,
    ...props.tableSource.query
  });

  // if (data.records && data.records.length) {
  //   data.records.forEach((record:any) => {
  //     Object.keys(record).forEach((key:string) => {
  //       props.tableSource.columns.forEach((column) => {
  //         if (column.key === key && column.enumName) {
  //           record[key] = getEnumName(column.enumName, record[key]);
  //         }
  //       });
  //     });
  //   });
  // }
  pagination.total =  data.total;

  setTimeout(()=>{
    dataSource.push(...data.records);
    loading.value = false;
  },500)
}
</script>
    
    