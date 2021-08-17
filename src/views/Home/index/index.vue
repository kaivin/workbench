<template>
  <div class="page-root scroll-panel home-index" ref="boxPane">
    <el-card class="box-card scroll-card" shadow="hover">
      <div class="card-content" ref="tableContent">
        <el-table
          ref="simpleTable"
          :data="tableData"
          class="SiteTable homeTable"
          style="width: 100%"
          :default-expand-all="true"
          :indent="0"
          row-key="id"
          :tree-props="{children: 'article', hasChildren: 'hasChildren'}"
          :span-method="arraySpanMethod"
          >
          <el-table-column
            prop="typename"
            label="所属栏目"
            width="120"
            >
            <template #default="scope">
              <div class="table-title" v-if="scope.row.article"><strong>{{scope.row.groupname}}：</strong><strong>（{{scope.row.number}}）条新消息！</strong></div>
              <div class="table-type" v-else>
                <span v-if="scope.row.type==1">{{scope.row.domain}} [{{scope.row.website_id}}]</span>
                <span v-else>{{scope.row.typename}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="文章标题"
            min-width="240"
            >
            <template #default="scope">
              <div class="table-title article-title" v-on:click="jumpArticle(scope.row)">
                <span :style="{color:scope.row.titlecolor?scope.row.titlecolor:''}">{{scope.row.title}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="is_new"
            label="更新类型"
            width="80"
            align="center"
            >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.is_new === 0 ? 'primary' : 'warning'"
                disable-transitions>{{scope.row.is_new === 0?"新增":"修改"}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="updatetime"
            label="更新时间"
            width="160"
            >
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Home',
  data() {
    return {
      menuButtonPermit:[],
      tableData:[],
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device'
    ]),
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
      // $this.initPage();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        console.log(res);
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Home_index')){
              $this.initPage();
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
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.$store.dispatch("api/getNewPostArticleAction", null).then((response) => {
        if (response) {
          if (response.status) {
            console.log(response.data,"最新消息");
            $this.tableData = response.data;
          } else {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "error",
            });
          }
        }
      });
    },
    // 表格合并行
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.article) {
        return [1, 4];
      }
    },
    // 跳转到文章详情
    jumpArticle(row){
      var $this = this;
      var routeUrl = "";
      if(row.type==1){
        routeUrl =  $this.$router.resolve({path:'/Website/logInfo',query:{logID:row.id,websiteID:row.website_id,website:row.domain}});
      }else{
        routeUrl =  $this.$router.resolve({path:'/Article/info',query:{id:row.id}});
      }
      window.open(routeUrl.href,'_blank');
    }
  }
}
</script>
<style lang="scss" scoped>
</style>