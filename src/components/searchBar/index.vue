<template>
  <div class="py-4 pb-0">
    <div v-for="(field, idx) in searchForms" :key="idx" class="inline-flex mr-8 mb-8">
      <div v-if="field.type === 'select'" class="flex items-center">
        <span class="mr-4 text-sm">{{ field.name }}</span>
        <a-select
          v-model:value="query[field.key]"
          :placeholder="field.placeholder"
          :options="field.options"
          class="w-52"
          size="large"
        >
        </a-select>
      </div>
      <div v-else-if="field.type === 'date'" class="flex items-center">
        <span class="mr-4 text-sm">{{ field.name }}</span>
        <a-date-picker size="large" v-model:value="query[field.key]" :placeholder="field.placeholder"/>
      </div>
      <div v-else-if="field.type === 'dateRange'" class="flex items-center">
        <span class="mr-4 text-sm">{{ field.name }}</span>
        <a-range-picker size="large" v-model:value="query[field.key]" :placeholder="['开始时间', '结束时间']"/>
      </div>
      <div v-else  class="flex items-center">
        <span class="mr-4">{{ field.name }}</span>
        <a-input :placeholder="field.placeholder" class="h-10 w-52" v-model:value="query[field.key]"></a-input>
      </div>
    </div>
    <div class="inline-flex">
        <a-button class="w-24 flex justify-center items-center border-zinc-400 border-[1px] mr-4" size="large" @click="onReset">重置</a-button>
        <a-button type="primary" class="w-24 flex justify-center items-center border-zinc-400 border-[1px]" size="large" @click="onSearch">搜索</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  searchForms: {
    type: Array<Query>,
    default() {
      return [];
    },
  },
});

const emits = defineEmits(['searchTable']);

let query: Query = reactive({});

function onSearch() {
  emits('searchTable', query);
}

function onReset(){
  for (const field of props.searchForms) {
    query[field.key] = null;
  }
  emits('searchTable');
}

</script>
<style lang="scss" scoped>
</style>