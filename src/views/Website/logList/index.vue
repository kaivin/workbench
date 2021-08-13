<template>
  <div class="page-root" ref="boxPane">
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <div class="card-header" ref="headerPane">
            <h2 class="log-header">{{website}} 工作日志</h2>
        </div>
      </div>
      <div class="card-content" ref="tableContent">
        <el-table
          border
          ref="simpleTable"
          :data="tableData"
          tooltip-effect="dark"
          stripe
          class="SiteTable"
          :height="tableHeight"
          row-key="id"
          >
          <el-table-column
            prop="createname"
            label="添加人"
            width="120"
            >
            <template #default="scope">
                <div class="table-title">
                <span v-if="scope.row.is_hidename==0">{{scope.row.createname}}</span>
                <span v-else>匿名</span>
                </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            min-width="240"
            >
            <template #default="scope">
                <div class="table-title" v-on:click="jumpArticle(scope.row.id)">
                    <i class="svg-i"><svg-icon v-if="scope.row.is_top" icon-class="top" class-name="disabled" /></i><span :style="{color:scope.row.titlecolor?scope.row.titlecolor:''}">{{scope.row.title}}</span>
                </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="tags"
            label="标签"
            min-width="160"
            >
            <template #default="scope">
                <div class="table-tag">
                <el-tag :style="{background:item.color,borderColor:item.color,color:'#ffffff'}" size="small" v-for="item in scope.row.tagList" v-bind:key="item.tag">{{item.tag}}</el-tag>
                </div>
            </template>
            </el-table-column>
            <el-table-column
                prop="remarks"
                label="备注"
                min-width="180"
                >
            </el-table-column>
            <el-table-column
                prop="hits"
                label="点击"
                width="80"
                >
                <template #default="scope">
                    <div class="table-hit">
                    <span>{{scope.row.hits==0?'':scope.row.hits}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="commentnumber"
                label="评论"
                width="100"
                >
                <template #default="scope">
                    <div class="table-comment">
                    <span>{{scope.row.commentnumber==0?'':scope.row.commentnumber+"条评论"}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="addtime"
                label="添加时间"
                width="160"
                >
            </el-table-column>
            <el-table-column
                prop="updatetime"
                label="修改时间"
                width="160"
                >
            </el-table-column>
          <el-table-column
            v-if="(menuButtonPermit.includes('Website_logedit')||menuButtonPermit.includes('Website_logdelete'))&&device==='desktop'"
            :width="operationsWidth"
            align="center"
            fixed="right"
            prop="operations"
            label="操作">
            <template #default="scope">
                <el-button size="mini" v-if="menuButtonPermit.includes('Website_logedit')" @click="editTableRow(scope.row,scope.$index)">修改</el-button>
                <el-button size="mini" v-if="menuButtonPermit.includes('Website_logdelete')&&scope.row.deleteshow" @click="deleteTableRow(scope.row,scope.$index)" type="info" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="totalDataNum>50" class="pagination-panel" ref="pagePane">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="pageSizeList"
            :page-size="limit"
            :layout="device==='mobile'?'sizes, jumper':'total, sizes, prev, pager, next, jumper'"
            :total="totalDataNum">
            </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
export default {
  name: 'websiteLogList',
  data() {
    return {
      menuButtonPermit:[],
      operationsWidth:"",
      tableData:[],
      tableHeight:200,
      page:1,
      limit:50,
      pageSizeList:[50, 100, 150, 200],
      totalDataNum:0,
      formLabelWidth:"110px",
      dialogForm:{
        fid:"",
        id:0,
        typename:"",
        sort:"",
      },
      dialogRoleVisible:false,
      websiteID:0,
      website:""
    }
  },
  computed: {
    ...mapGetters([
      'device'
    ]),
  },
  mounted(){
      const $this = this;
      this.$nextTick(function () {
        if($this.totalDataNum>50){
          $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-20;
          // 49: 分割线高度；30：page-root上下内边距；30：el-card__body上下内边距；20：按钮父级上下内边距；3：上下border
        }else{
          $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-40-20;
          // 49: 分割线高度；30：page-root上下内边距；30：el-card__body上下内边距；20：按钮父级上下内边距；3：上下border
        }
      });
      window.onresize = () => {
          return (() => {
            if($this.totalDataNum>50){
              $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-20;
              // 49: 分割线高度；30：page-root上下内边距；30：el-card__body上下内边距；20：按钮父级上下内边距；3：上下border
            }else{
              $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-40-20;
              // 49: 分割线高度；30：page-root上下内边距；30：el-card__body上下内边距；20：按钮父级上下内边距；3：上下border
            }
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
  updated(){
    this.$nextTick(() => {
      this.$refs.simpleTable.doLayout()
    })
  },
  methods:{
    // 初始化数据
    initData(){
        var $this = this;
        $this.getUserMenuButtonPermit();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        console.log(res);
        if(res.status){
            console.log(res,"权限")
            if(res.data.length>0){
                res.data.forEach(function(item,index){
                    $this.menuButtonPermit.push(item.action_route);
                });
                if($this.menuButtonPermit.includes('Website_loglist')){
                  var operationsWidth = 20;
                  if($this.menuButtonPermit.includes("Website_logedit")){
                    operationsWidth+=66;
                  }
                  if($this.menuButtonPermit.includes("Website_logdelete")){
                    operationsWidth+=66;
                  }
                  $this.operationsWidth = "" + operationsWidth;
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
      if($this.$route.query.websiteID){
          $this.websiteID = $this.$route.query.websiteID;
          $this.website = $this.$route.query.website;
          var formData = {};
          formData.limit = $this.limit;
          formData.page = $this.page;
          formData.website_id = $this.$route.query.websiteID;
          $this.$store.dispatch('website/websiteLogListAction', formData).then(response=>{
              if(response){
                  console.log(response,"日志数据");
                  if(response.status){
                      response.data.forEach(function(item,index){
                          item.tagList = [];
                          if(item.tags != ""){
                              if(item.tags.indexOf("|")!=-1){
                              var tagArr = item.tags.split("|");
                              tagArr.forEach(function(item1,index1){
                                  var itemData = {};
                                  if(item1.indexOf("-")!=-1){
                                  itemData.tag = item1.split("-")[0];
                                  itemData.color = item1.split("-")[1];
                                  }else{
                                  itemData.tag = item1;
                                  itemData.color = "#1b3f75";
                                  }
                                  item.tagList.push(itemData);
                              });
                              }else{
                              var itemData = {};
                              if(item.tags.indexOf("-")!=-1){
                                  itemData.tag = item.tags.split("-")[0];
                                  itemData.color = item.tags.split("-")[1];
                              }else{
                                  itemData.tag = item.tags;
                                  itemData.color = "#1b3f75";
                              }
                              item.tagList.push(itemData);
                              }
                          }
                      });
                      $this.tableData = response.data;
                      $this.totalDataNum = response.allcount;
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
      }else{
        $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
      }
    },
    // 添加表格行数据
    addTableRow(){
      var $this = this;
      $this.$router.push({path:'/Website/logAddEdit',query:{websiteID:$this.websiteID,website:$this.website}});
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.$router.push({path:'/Website/logAddEdit',query:{logID:row.id,websiteID:$this.websiteID,website:$this.website}});
    },
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      $this.$confirm('是否确认删除该日志?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('website/websiteLogDeleteAction', {id:row.id}).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.initData();
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
            }
          });
      }).catch(() => {
          $this.$message({
            type: 'info',
            message: '已取消删除'
          });          
      });
    },
    // 每页显示条数改变事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val;
      this.initData();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.initData();
    },
    // 跳转到文章详情
    jumpArticle(id){
      var $this = this;
      $this.$router.push({path:'/Website/logInfo',query:{logID:id,websiteID:$this.websiteID,website:$this.website}});
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
