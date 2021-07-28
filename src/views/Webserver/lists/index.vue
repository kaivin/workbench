<template>
  <div class="page-root" ref="boxPane">
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <div class="card-header" ref="headerPane">
          <el-button type="primary" size="small" icon="el-icon-refresh" v-on:click="refreshData()">刷新</el-button>
          <el-button type="primary" size="small" icon="el-icon-document-add" v-on:click="addTableRow()" v-if="menuButtonPermit.includes('Webserver_add')&&device==='desktop'">添加服务器</el-button>
          <el-button type="primary" size="small" icon="el-icon-search" v-on:click="searchDialog()" v-if="device!='desktop'">高级查询</el-button>
        </div>
      </div>
      <div class="card-content" ref="cardContent">
        <div class="border-wrap post-class" ref="searchPane" v-if="canSearch&&device==='desktop'">
          <div class="border-row flex-wrap">
              <div class="border-cell txt-font"><span>语言：</span></div>
              <div class="border-cell flex-content">
                  <div class="tag-panel" style="padding:5px;">
                      <el-select v-model="formData.language" size="small" clearable placeholder="请选择">
                        <el-option
                          v-for="item in languageList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </div>
              </div>
              <div class="border-cell txt-font"><span>用途：</span></div>
              <div class="border-cell flex-content">
                  <div class="tag-panel" style="padding:5px;">
                      <el-select v-model="formData.useringid" size="small" clearable placeholder="请选择">
                        <el-option
                          v-for="item in useingList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </div>
              </div>
              <div class="border-cell txt-font"><span>系统：</span></div>
              <div class="border-cell flex-content">
                  <div class="tag-panel" style="padding:5px;">
                      <el-select v-model="formData.systemid" size="small" clearable placeholder="请选择">
                        <el-option
                          v-for="item in serverList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </div>
              </div>
          </div>
          <div class="border-row flex-wrap">
              <div class="border-cell txt-font"><span>IP/别名：</span></div>
              <div class="border-cell flex-content">
                  <div class="tag-panel">
                      <el-input
                        style="width: 200px;margin: 5px;"
                        placeholder="输入别名"
                        v-model="formData.name"
                        size="small"
                        clearable>
                      </el-input>
                      <el-input
                        style="width: 200px;margin: 5px;"
                        placeholder="输入ip"
                        v-model="formData.ip"
                        size="small"
                        clearable>
                      </el-input>
                      <el-button class="item-input" size="small" type="primary" icon="el-icon-search" @click="searchResult">搜索</el-button>
                  </div>
              </div>
          </div>
        </div>
        <el-divider v-if="canSearch&&device==='desktop'"><i class="el-icon-goblet-square-full"></i></el-divider>
        <div class="card-wrap">
          <div v-if="totalDataNum>50" class="pagination-panel top-page" ref="pagePane">
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
          <el-table
            border
            ref="simpleTable"
            :data="tableData"
            :height="tableHeight"
            stripe
            style="width: 100%"
            >
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="id"
              label="ID"
              width="60"
              >
            </el-table-column>
            <el-table-column
              prop="name"
              label="别名"
              min-width="120"
              >
            </el-table-column>
            <el-table-column
              prop="useringname"
              label="用途"
              width="80"
              >
            </el-table-column>
            <el-table-column
              prop="systemname"
              label="系统"
              width="80"
              >
            </el-table-column>
            <el-table-column
              prop="ip"
              label="IP"
              width="160"
              >
              <template #default="scope">
                <div class="table-link"><span class="link" @click="jumpWebsiteList(scope.row,scope.$index)">{{scope.row.ip}}</span></div>
              </template>
            </el-table-column>
            <el-table-column
              prop="allip"
              label="全部IP"
              min-width="240"
              >
            </el-table-column>
            <el-table-column
              prop="adminuser"
              label="负责人"
              width="120"
              >
            </el-table-column>
            <el-table-column
              v-if="(menuButtonPermit.includes('Webserver_edit')||menuButtonPermit.includes('Webserver_delete'))&&device==='desktop'"
              :width="operationsWidth"
              align="center"
              fixed="right"
              label="操作">
              <template #default="scope">
                <el-button v-if="scope.row.editshow===1" size="mini" @click="editTableRow(scope.row,scope.$index)">编辑</el-button>
                <el-button v-if="scope.row.deletepermit===1" size="mini" @click="deleteTableRow(scope.row,scope.$index)" type="info" plain>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="totalDataNum>50" class="pagination-panel" ref="pagePane2">
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
      </div>
    </el-card>
    <el-dialog title="高级查询" v-if="device==='mobile'" custom-class="search-dialog block-search" :visible.sync="dialogSearchVisible">
      <div class="search-dialog-wrap">
        <div class="item-search">
          <el-select v-model="formData.language" size="small" clearable placeholder="请选择语言">
            <el-option
              v-for="item in languageList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="item-search">
          <el-select v-model="formData.useringid" size="small" clearable placeholder="请选择用途">
            <el-option
              v-for="item in useingList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="item-search">
          <el-select v-model="formData.systemid" size="small" clearable placeholder="请选择系统">
            <el-option
              v-for="item in serverList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="item-search">
          <el-input
            placeholder="输入别名"
            v-model="formData.name"
            size="small"
            clearable>
          </el-input>
        </div>
        <div class="item-search">
          <el-input
            placeholder="输入ip"
            v-model="formData.ip"
            size="small"
            clearable>
          </el-input>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogSearchVisible = false">取 消</el-button>
          <el-button type="primary" @click="searchResult">查询</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Webserver_lists',
  data() {
    return {
      tableHeight:200,
      operationsWidth:"",
      menuButtonPermit:[],
      tableData:[],
      page:1,
      limit:50,
      pageSizeList:[50, 100, 150, 200],
      totalDataNum:0,
      serverList:[],
      useingList:[],
      languageList:[],
      canSearch:true,
      formData:{
        ip:"",
        systemid:"",
        language:"",
        name:"",
        useringid:"",
      },
      dialogSearchVisible:false
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
        if($this.device=="desktop"){
          if($this.totalDataNum>50){
            $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.searchPane.offsetHeight-$this.$refs.pagePane.offsetHeight*2-49-30-30-25;
          }else{
            $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.searchPane.offsetHeight-49-30-30-25;
          }
          //49: 分割线高度；30：el-card__body上下内边距； 30：page-root上下内边距；20：按钮父级上下内边距；
        }else{
          if($this.totalDataNum>50){
            $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight*2-30-30-25;
          }else{
            $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-30-30-25;
          }
        }
      });
      window.onresize = () => {
          return (() => {
            if($this.device=="desktop"){
              if($this.totalDataNum>50){
                $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.searchPane.offsetHeight-$this.$refs.pagePane.offsetHeight*2-49-30-30-25;
              }else{
                $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.searchPane.offsetHeight-49-30-30-25;
              }
            }else{
              if($this.totalDataNum>50){
                $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight*2-30-30-25;
              }else{
                $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-30-30-25;
              }
            }
            // 30：page-root上下内边距；20：按钮父级上下内边距；
          })()
      };
  },
  watch: {
      scrollHeight(val) {
        if (!this.timer) {
          this.scrollHeight = val
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
    // 搜索结果点击事件
    searchResult(){
      var $this = this;
      $this.dialogSearchVisible = false;
      $this.getWebsiteListData();
    },
    // 刷新当前页面
    refreshData(){
      var $this = this;
      $this.getWebsiteListData();
    },
    // 初始化页面数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            console.log(res.data,"操作权限");
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Webserver_lists')){
              var operationsWidth = 20;
              if($this.menuButtonPermit.includes("Webserver_edit")){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes("Webserver_delete")){
                operationsWidth+=66;
              }
              $this.operationsWidth = "" + operationsWidth;
              $this.getSearchItemData();
            }else{
              $this.$message({
                showClose: true,
                message: "未被分配服务器管理查看权限",
                type: 'error',
                duration:6000
              });
              $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            }
          }else{
            $this.$message({
              showClose: true,
              message: "未被分配服务器管理查看权限",
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
    // 获取服务器列表数据
    getWebsiteListData(){
      var $this = this;
      if($this.$route.query.IP&&$this.formData.ip==""){
        $this.formData.ip = $this.$route.query.IP
      }
      var formData = {};
      formData.page = $this.page;
      formData.limit = $this.limit;
      formData.name = $this.formData.name;
      formData.language = $this.formData.language;
      formData.useringid = $this.formData.useringid;
      formData.systemid = $this.formData.systemid;
      formData.ip = $this.formData.ip;
      $this.$store.dispatch('webserver/webserverListAction', formData).then(response=>{
        if(response){
          if(response.status){
            console.log(response,"服务器列表");
            $this.tableData = response.data;
            $this.totalDataNum = response.allcount;
            $this.canSearch = response.searchshow?true:false;
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
    // 获取查询相关展示数据
    getSearchItemData(){
      var $this = this;
      $this.$store.dispatch('webserver/webserverSelectDataAction', null).then(response=>{
        if(response){
          if(response.status){
            console.log(response,"查询条件数据");
            var languageList = [];
            response.language.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.languagename;
              languageList.push(itemData);
            });
            $this.languageList = languageList;
            var serverList = [];
            response.server.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              serverList.push(itemData);
            });
            $this.serverList = serverList;
            var useingList = [];
            response.usering.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              useingList.push(itemData);
            });
            $this.useingList = useingList;
            $this.getWebsiteListData();
          }else{
            $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
            });
          }
        }
      });
    },
    // 跳转到网站日志列表页
    jumpWebsiteList(row,index){
      var $this = this;
      $this.$router.push({name:'Website_lists',query:{key:row.ip}});
    },
    // 修改网站数据
    editTableRow(row,index){
      var $this = this;
      $this.$router.push({name:'webserverAddEdit',query:{webserverID:row.id}});
    },
    // 重置搜索条件
    resetSearchData(){
      var $this = this;
      $this.formData.ip="";
      $this.formData.name=null;
      $this.formData.language=null;
      $this.formData.useringid=null;
      $this.formData.systemid=null;
      $this.limit = 50;
      $this.page = 1;
    },
    // 每页显示条数改变事件
    handleSizeChange(val) {
      this.limit = val;
      this.initData();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      this.page = val;
      this.initData();
    },
    // 添加表格行数据
    addTableRow(row,index){
      var $this = this;
      $this.$router.push({name:'webserverAddEdit'});
    },
    // 保存添加网站数据
    saveWebsiteAddData(){
      var $this = this;
      if(!$this.validationForm()){
        return false;
      }
      $this.$store.dispatch('website/websiteAddAction', $this.dialogForm).then(response=>{
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
            $this.dialogFormVisible = false;
            $this.initData();
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 重置添加数据表单
    resetFormData(){
      var $this = this;
      $this.dialogForm.brand = "";
      $this.dialogForm.language = "";
      $this.dialogForm.domain = "";
      $this.dialogForm.weblink = "";
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.brand == ""){
        $this.$message({
            showClose: true,
            message: '错误：网站品牌不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.dialogForm.language == ""){
        $this.$message({
            showClose: true,
            message: '错误：网站语种不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.dialogForm.domain == ""){
        $this.$message({
            showClose: true,
            message: '错误：主域名不能为空！',
            type: 'error'
        });
        $this.$refs['domain'].focus();
        return false;
      }
      return true;
    },
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      $this.$confirm('此操作将删除该服务器, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('webserver/webserverDeleteAction', {id:row.id}).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.getWebsiteListData();
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
    // 移动端查询弹窗事件
    searchDialog(){
      var $this = this;
      $this.dialogSearchVisible = true;
    },
  }
}
</script>
<style lang="scss" scoped>
.page-root{
    ::v-deep .search-dialog{
      height: 400px!important;
    }
  }
.post-class{
  .txt-font{
    width: 100px;
  }
}
.card-wrap{
  .pagination-panel{
    overflow: hidden;
  }
  .pagination-panel.top-page{
    .el-pagination{
      margin-top:0;
      margin-bottom:10px;
    }
  }
}
.table-link{
  .link{
    color: $--color-primary;
    margin: 0 5px;
    line-height: 24px;
    cursor: pointer;
  }
}
.table-tag{
  .el-tag{
    margin: 1px;
  }
}
.table-name{
  span{
    display: inline-block;
    width: 100%;
    line-height: 24px;
    text-align: center;
  }
}
.el-select{
  display: block;
}
.item-form{
    padding-right: 30px;
    position: relative;
    .icon-button{
      width: 36px;
      height: 36px;
      position: absolute;
      top:0;
      right: 30px;
      border: 1px solid #C0C4CC;
      border-radius: 4px;
      text-align: center;
      line-height: 34px;
      font-size: 18px;
      color: #999;
      cursor: pointer;
    }
    >span{
      display: block;
      width: 30px;
      height: 36px;
      position: absolute;
      right:0;
      top:0;
      text-align: center;
      line-height: 36px;
      font-size: 14px;
      cursor: pointer;
      color: #bbb;
    }
    &:before,
    &:after {
      content: "";
      display: table;
    }
    &:after {
      clear: both;
    }
  }
.item-form-group{
  width: 100%;
  &:before,
  &:after {
    content: "";
    display: table;
  }
  &:after {
    clear: both;
  }
  .item-form-3{
    width: 180px;
    float:left;
    padding-right: 30px;
    position: relative;
    &:before,
    &:after {
      content: "";
      display: table;
    }
    &:after {
      clear: both;
    }
    >span{
      display: block;
      width: 30px;
      height: 36px;
      position: absolute;
      right:0;
      top:0;
      text-align: center;
      line-height: 36px;
      font-size: 14px;
      cursor: pointer;
      color: #bbb;
    }
  }
  .item-form{
    width: 50%;
    float:left;
    }
}
</style>