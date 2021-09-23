<template>
  <div class="errPage-container">
    <div class="scroll-panel">
      <div class="main-content">
        <el-row>
          <el-col :md="12">
            <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
          </el-col>
          <el-col :md="12">
            <h2>暂无该页面访问权限</h2>
            <h3>如有疑问，可联系管理员</h3>
            <ul class="list-unstyled">
              <li>或者你可以去:</li>
              <li class="link-type">
                <router-link to="/">首页</router-link>
              </li>
              <li class="link-type">
                <a href="javascript:void(0);" v-on:click="logout">重新登录</a>
              </li>
            </ul>
          </el-col>
        </el-row>
        <el-dialog :visible="dialogVisible">
          <img :src="ewizardClap" class="pan-img">
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
// import errGif from '@/assets/401_images/401.gif'

export default {
  name: 'Page401',
  data() {
    return {
      errGif: require('@/assets/401_images/401.gif') + '?' + +new Date(),
      ewizardClap: require('@/assets/401_images/401.gif'),
      dialogVisible: false,
      isLoading:null,
    }
  },
    created(){
      this.loadingFun();
      this.isLoading.close();
    },
  methods: {
      // loading自定义
      loadingFun(){
      var $this = this;
      $this.isLoading = $this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
      });
      },
    // 退出登录
    async logout() {
        var $this = this;
        await $this.$store.dispatch('login/logoutAction').then(response=>{
          if(response.status){
            $this.$router.push(`/login`)
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
        });
    },
  }
}
</script>

<style lang="scss">
</style>
