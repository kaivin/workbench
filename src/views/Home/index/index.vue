<template>
  <router-view></router-view>
</template>
<script>
export default {
  name: "Home",
  data() {
    return {
      menuButtonPermit: [],
    };
  },
  created() {
    var $this = this;
    $this.initData();
  },
  methods: {
    // 初始化数据
    initData() {
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit() {
      var $this = this;
      $this.$store.dispatch("api/getMenuButtonPermitAction", {id: $this.$router.currentRoute.meta.id}).then((res) => {
          if (res.status) {
            if (res.data.length > 0) {
              res.data.forEach(function (item, index) {
                $this.menuButtonPermit.push(item.action_route);
              });
              if ($this.menuButtonPermit.includes("Home_index")) {
                //$this.getPermitModules();
              } else {
                $this.$message({
                  showClose: true,
                  message: "未被分配该页面的访问权限",
                  type: "error",
                  duration: 6000,
                });
                $this.$router.push({
                  path: `/401?redirect=${$this.$router.currentRoute.fullPath}`,
                });
              }
            } else {
              $this.$message({
                showClose: true,
                message: "未被分配该页面的访问权限",
                type: "error",
                duration: 6000,
              });
              $this.$router.push({
                path: `/401?redirect=${$this.$router.currentRoute.fullPath}`,
              });
            }
          } else {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "error",
            });
          }
        });
    },
  }
}
</script>

