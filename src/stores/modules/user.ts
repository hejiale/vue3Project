// 定义 Store
export const userStore = defineStore("user", () => {
  const userId: Ref<number> = ref(0);
  const userInfo: Object = reactive({});

  const setUserId = async (val: number) => {
    userId.value = val;
    Object.assign(userInfo, { name: "测试" });
  };

  return {
    userId,
    userInfo,
    setUserId,
  };
});
