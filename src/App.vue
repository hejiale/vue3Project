<template>
  <div>
    <a-config-provider :locale="zhCN">
      <Home v-if="!isLogin"></Home>
      <router-view v-else/>
    </a-config-provider>
  </div>
</template>
<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import Home from "@/views/home.vue"

const route = useRoute();

const isLogin = computed(()=>{
  return route.name === null || route.name === 'login'; 
})

onMounted(async () => {
  // bus.on('jumpMain',()=>{
  //   isLogin.value = true;
  // })
});

</script>
<style lang="scss" scoped>

</style>
