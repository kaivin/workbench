
<template>
    <div class="page-root en-phone-history" ref="boxPane">
        <el-card class="box-card scroll-card no-padding" shadow="hover">
            <div class="card-content" ref="tableContent">
                <el-table
                    ref="simpleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    stripe
                    class="SiteTable"
                    style="width: 100%"
                    :height="tableHeight"
                    row-key="id"
                    >
                    <el-table-column
                        prop="id"
                        label="ID"
                        width="90"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="bname"
                        label="用户"
                        width="100"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="ip"
                        label="IP"
                        width="100"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="enid"
                        label="修改信息ID"
                        width="110"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="loginfo"
                        label="详细记录"
                        min-width="140"
                        >
                        <template slot-scope="scope">
                            <div class="table-text" v-if="scope.row.newinfo">
                                <h3>原始数据：</h3>
                                <p><span v-for="(item,index) in scope.row.oldinfo" v-bind:key="index">{{item}}</span></p>
                                <div class="line"></div>
                                <h3>修改数据：</h3>
                                <p><span v-bind:style="item.isEdit?'color:red;':''" v-for="(item,index) in scope.row.editInfoList" v-bind:key="index">{{item.title}}</span></p>
                            </div>
                            <div class="table-text" v-else>
                              <p>{{scope.row.loginfo}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="addtime"
                        label="时间"
                        width="160"
                        >
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'editHistoryLog',
  data() {
    return {
        menuButtonPermit:[],
        tableHeight:0,
        tableData:[],
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device'
    ]),
  },
  mounted(){
    const $this = this;
    $this.$nextTick(function () {
      $this.tableHeight = $this.$refs.boxPane.offsetHeight-30;
    });
    window.onresize = () => {
        return (() => {
            $this.tableHeight = $this.$refs.boxPane.offsetHeight-30;
        })()
    }
  },
  watch: {
      tableHeight(val) {
        if (!this.timer) {
          this.tableHeight = val
          this.timer = true
          const $this = this
          setTimeout(function() {
            $this.timer = false
          }, 400)
        }
      },
  },
  created(){
    var $this = this;
    $this.initData();
  },
  methods:{
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.$store.dispatch('enphone/customerEditHistoryLogAction', {id:$this.$route.query.ID}).then(response=>{
        if(response){
          if(response.status){
            var tableData = response.data;
            tableData.forEach(function(item,index){
                item.editInfoList = [];
                if(item.newinfo){
                  item.editinfo.forEach(function(item1,index1){
                    var itemData = {};
                    itemData.title = item1;
                    if(item1!==item.oldinfo[index1]){
                      itemData.isEdit = true;
                    }else{
                      itemData.isEdit = false;
                    }
                    item.editInfoList.push(itemData);
                  });
                }
            });
            $this.tableData = tableData;
            console.log(tableData);
          }else{
            if(response.permitstatus&&response.permitstatus==2){
              $this.$message({
                showClose: true,
                message: "未被分配该页面访问权限",
                type: 'error',
                duration:6000
              });
              $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
            }
          }
        }
      });
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Enphone_phoneindex')&&$this.menuButtonPermit.includes('Enphone_enxunlog')){
                if($this.$route.query.ID){
                    $this.initPage();
                }else{
                    $this.$message({
                        showClose: true,
                        message: "未找到对应页面或页面缺失参数",
                        type: 'error',
                        duration:6000
                    });
                    $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
                }
            }else{
              $this.$message({
                showClose: true,
                message: "未被分配该页面的访问权限",
                type: 'error',
                  duration:6000
              });
              $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            }
          }else{
            $this.$message({
              showClose: true,
              message: "未被分配该页面的访问权限",
              type: 'error',
                duration:6000
            });
            $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
          }
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
<style lang="scss" scoped>
</style>
