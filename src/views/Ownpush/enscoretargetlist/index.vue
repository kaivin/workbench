<template>
  <div class="page-root" ref="boxPane">
      <div class="abs-panel" ref="mainPane">
          <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
              <div class="true-height" ref="scrollPane">              
                  <p class="breadcrumb" ref="breadcrumbPane">
                    <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
                    <template v-for="item in breadcrumbList">
                      <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
                      <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
                    </template>
                  </p>
                  <el-card class="box-card" shadow="hover">

                    <div slot="header">
                        <div class="card-header" ref="headerPane">
                            <div class="search-wrap aimSearch" ref="searchPane">
                                <div class="aimTitle">时间选择：</div>
                                <div class="item-search">
                                    <el-date-picker
                                        v-model="searchDate"
                                        type="monthrange"
                                        format="yyyy-MM"
                                        value-format="yyyy-MM"
                                        key="b"
                                        size="mini"
                                        class="date-range"
                                        range-separator="～"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                </div>
                                <div class="item-search">
                                    <el-button class="item-input" type="primary" size="small" icon="el-icon-search" @click="initPage">查询</el-button>
                                    <el-button class="item-input" type="warning" size="small" icon="el-icon-refresh-right" @click="resetTable">重置</el-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-content" ref="tableContent">
                      <div class="table-wrapper">
                          <div class="table-mask"></div>
                          <el-table
                            ref="simpleTable"
                            :data="tableData"
                            class="SiteTable"
                            style="width: 100%"
                            row-key="id"
                            stripe
                            :style="'min-height:'+tableHeight+'px;'"
                            >
                            <el-table-column
                              type="index"
                              label="序号"
                              width="180"
                              align="center"
                            >
                            </el-table-column>
                            <el-table-column
                              prop="starttime"
                              label="开始时间"
                              align="center"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="endtime"
                              label="截止时间"
                              align="center"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="scoretarget"
                              label="季度目标分数"
                              align="center"
                              >
                            </el-table-column>
                            <el-table-column
                              v-if="(menuButtonPermit.indexOf('Ownpush_enscoretargetedit'))"
                              align="center"
                              fixed="right"
                              prop="operations"
                              label="操作">
                              <template #default="scope">
                                <div class="table-button">
                                  <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Ownpush_enscoretargetedit')">编辑</el-button>
                                  <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Ownpush_enscoretargetdelete')">删除</el-button>
                                </div>
                              </template>
                            </el-table-column>
                          </el-table>
                      </div>
                    </div>

                    <div class="pagination-panel"  ref="pagePane">
                      <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="searchData.page"
                        :page-sizes="pageSizeList"
                        :page-size="searchData.limit"
                        :pager-count="pagerCount"
                        :layout="'total, sizes, prev, pager, next, jumper'"
                        :total="totalDataNum">
                      </el-pagination>
                    </div>

                  </el-card>
              </div>
          </div>
      </div>
      <el-backtop target=".scroll-panel"></el-backtop>
      <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('Ownpush_enscoretargetadd')||menuButtonPermit.includes('Ownpush_enscoretargetedit'))" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" :before-close="handleClose" width="386px" center>
        <el-form :model="dialogForm">
            <el-form-item label="开始时间：" :label-width="formLabelWidth">
                <el-date-picker type="month" format="yyyy-MM" value-format="yyyy-MM" placeholder="选择开始时间" v-model="dialogForm.starttime" ref="starttime"></el-date-picker>
            </el-form-item>
            <el-form-item label="截止时间：" :label-width="formLabelWidth">
                <el-date-picker type="month" format="yyyy-MM" value-format="yyyy-MM" placeholder="选择结束时间" v-model="dialogForm.endtime" ref="endtime"></el-date-picker>
            </el-form-item>
            <el-form-item label="目标分数：" :label-width="formLabelWidth">
                <el-input v-model="dialogForm.scoretarget" ref="scoretarget" style="width:220px"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" :class="isDisabled?'isDisabled':''" :disabled="isDisabled" @click="saveData">确 定</el-button>
          </span>
        </template>
      </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Ownpush_index',
  data() {
    return {
      breadcrumbList:[],
      menuButtonPermit:[],
      tableData:[],
      tableHeight:200,
      dialogFormVisible:false,
      dialogText:"",
      formLabelWidth:"100px",
      dialogForm:{
        id:0,
        starttime:"",
        endtime:"",
        scoretarget:0
      },
      isLoading:null,
      isDisabled:false,
      searchDate:[],
      searchData:{
        page:1,
        limit: 20,
        starttime:"",
        endtime:""
      },
      pageSizeList:[20,40, 60, 80, 100],
      totalDataNum:0,
      pagerCount:5,
    }
  },
  computed: {
    ...mapGetters([
      'addenAimScore',
      'sidebar',
      'menuData'
    ]),
    isAdd() {
      return this.addenAimScore
    },
    isOpen() {
      return this.sidebar.opened;
    },
  },
  watch: {
    isAdd(e){
      if(e){
        this.addTableRow();
      }
    },
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
  },
  mounted(){
    var $this = this;
    window.onresize = () => {
      return (() => {
        $this.setTableHeight();
      })()
    }
  },
  updated(){
    this.$nextTick(() => {
      this.$refs.simpleTable.doLayout();
    })
  },
  methods:{
    // 获取面包屑路径
    getBreadcrumbList(){
      var $this = this;
      var breadcrumbList = [];
      var currentID = ""+$this.$router.currentRoute.meta.id;
      var pageID = 0;
      if(currentID.indexOf('-')!=-1){
        pageID = parseInt(currentID.split("-")[1]);
      }else{
        pageID = parseInt(currentID);
      }
      $this.menuData.forEach(function(item,index){
        if(item.meta.id == pageID){
          var itemData = {};
          itemData.id = item.meta.id;
          itemData.router = item.path;
          itemData.title = item.meta.title;
          breadcrumbList.push(itemData);
        }else{
          if(item.children.length>0){
            item.children.forEach(function(item1,index1){
              if(item1.meta.id == pageID){
                var itemData = {};
                itemData.id = item.meta.id;
                itemData.router = item.path;
                itemData.title = item.meta.title;
                breadcrumbList.push(itemData);
                var itemData2 = {};
                itemData2.id = item1.meta.id;
                itemData2.router = item1.path;
                itemData2.title = item1.meta.title;
                breadcrumbList.push(itemData2);
              }else{
                if(item1.children.length>0){
                  item1.children.forEach(function(item2,index2){
                    if(item2.meta.id == pageID){
                      var itemData = {};
                      itemData.id = item.meta.id;
                      itemData.router = item.path;
                      itemData.title = item.meta.title;
                      breadcrumbList.push(itemData);
                      var itemData2 = {};
                      itemData2.id = item1.meta.id;
                      itemData2.router = item1.path;
                      itemData2.title = item1.meta.title;
                      breadcrumbList.push(itemData2);
                      var itemData3 = {};
                      itemData3.id = item2.meta.id;
                      itemData3.router = item2.path;
                      itemData3.title = item2.meta.title;
                      breadcrumbList.push(itemData3);
                    }
                  });
                }
              }
            });
          }
        }
      });
      $this.breadcrumbList = breadcrumbList;
    },
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
    // 初始化数据
    initData(){
      var $this = this;
      $this.loadingFun();
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;   
      if($this.searchDate.length > 0){
        $this.searchData.starttime = $this.searchDate[0];
        $this.searchData.endtime = $this.searchDate[1]; 
      }      
      $this.$store.dispatch('ownaim/getenScoreList', $this.searchData).then(response=>{
        if(response){
          if(response.status){
            $this.totalDataNum = response.allcount;
            $this.tableData = response.data;
            $this.isLoading.close();
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
              setTimeout(()=>{
                $this.isDisabled=false;
              },1000);
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
            if($this.menuButtonPermit.includes('Ownpush_enscoretargetlist')){
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
    // 关闭添加部门弹窗
    handleClose(){
      var $this = this;
      $this.dialogFormVisible = false;
      $this.$store.dispatch('app/closeenAimScore');
    },
    // 添加表格行数据
    addTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "添加目标";
      $this.resetFormData();
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "编辑目标";
      $this.resetFormData();
      $this.dialogForm.id = row.id;
      $this.dialogForm.starttime = row.starttime;
      $this.dialogForm.endtime = row.endtime;
      $this.dialogForm.scoretarget = row.scoretarget;
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if(!$this.isDisabled){
        if(!$this.validationForm()){
          return false;
        }
        $this.isDisabled=true;
        var pathUrl = "";
        if($this.dialogText=="添加目标"){
          pathUrl = "ownaim/addEnScore";
        }else{
          pathUrl = "ownaim/editEnScore";
        }
        $this.$store.dispatch(pathUrl, $this.dialogForm).then(response=>{
            if(response.status){
              $this.isDisabled=false;
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.handleClose();
              $this.initPage();
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
              setTimeout(()=>{
                $this.isDisabled=false;
              },1000);
            }
        });
      }
    },
    // 重置添加数据表单
    resetFormData(){
      var $this = this;
      $this.dialogForm.id = 0
      $this.dialogForm.starttime = '';
      $this.dialogForm.endtime = '';
      $this.dialogForm.scoretarget = '';
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.starttime == ""){
        $this.$message({
            showClose: true,
            message: '错误：开始时间不能为空！',
            type: 'error'
        });
        $this.$refs['starttime'].focus();
        return false;
      }
      if($this.dialogForm.endtime == ""){
        $this.$message({
            showClose: true,
            message: '错误：结束时间不能为空！',
            type: 'error'
        });
        $this.$refs['endtime'].focus();
        return false;
      }
      if( $this.dialogForm.scoretarget == "" || $this.dialogForm.scoretarget == 0){
        $this.$message({
            showClose: true,
            message: '错误：目标积分不能为空！',
            type: 'error'
        });
        $this.$refs['scoretarget'].focus();
        return false;
      }
      return true;
    },
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      $this.$confirm('是否确认删除该目标?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('ownaim/deleteEnScore', {id:row.id}).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.initPage();
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
      this.searchData.limit = val;
      this.searchData.page = 1;
      this.initPage();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      this.searchData.page = val;
      this.initPage();
    },
    // 设置高度
    setTableHeight(){
      var $this = this;
      $this.tableHeight = 0; 
      var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;     
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      $this.tableHeight = screenHeight-breadcrumbHeight-40;
    },
    // 重置搜索
    resetTable(){
      var $this = this;
      $this.searchData.starttime="";
      $this.searchData.endtime="";
      $this.searchDate=[];
      $this.initPage();
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
