<template>
  <div class="page-root" ref="boxPane">
      <div class="abs-panel" ref="mainPane">
        <div class="scroll-panel">
            <div class="true-height" ref="scrollPane">
                <el-card class="box-card" shadow="hover">
                  <div slot="header" v-if="canSearch">
                    <div class="card-header WebServerTop" v-if="device==='desktop'" ref="headerPane">
                      <div class="border-wrap post-class" ref="searchPane">
                        <div class="border-row flex-wrap">
                            <div class="border-cell txt-font"><span>语言：</span></div>
                            <div class="border-cell flex-content">
                                <div class="tag-panel">
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
                                <div class="tag-panel">
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
                                <div class="tag-panel">
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
                                      style="width: 229px;margin-right:10px;"
                                      placeholder="输入别名"
                                      v-model="formData.name"
                                      size="small"
                                      clearable>
                                    </el-input>
                                    <el-input
                                      style="width: 229px;margin-right: 5px;"
                                      placeholder="输入ip"
                                      v-model="formData.ip"
                                      size="small"
                                      clearable>
                                    </el-input>
                                    <el-button class="item-input table-icon search" size="small" type="primary" @click="searchResult"><i class="svg-i searchWhite" ><svg-icon icon-class="searchWhite" class-name="disabled" /></i>搜索</el-button>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                    <div class="card-header filter-panel" v-else ref="headerPane">
                      <div class="search-panel">                              
                          <el-input placeholder="输入ip" v-model="formData.ip" class="article-search">
                              <el-button slot="append" @click="searchResult"><span class="search-icon"><svg-icon icon-class="search1" class-name="disabled" /></span></el-button>
                          </el-input>
                      </div>
                      <span class="filter-button" v-on:click="searchDialog()">筛选<i class="svg-i"><svg-icon icon-class="filter" class-name="disabled" /></i></span>
                    </div>
                  </div>
                  <div class="card-content WebServerBom" ref="cardContent">
                    <div class="card-wrap">
                      <el-table
                        ref="simpleTable"
                        :data="tableData"
                        :height="tableHeight"
                        stripe
                        class="SiteTable"
                        style="width: 100%"
                        >
                        <el-table-column
                          type="index"
                          label="序号"
                          align="center"
                          width="50">
                        </el-table-column>
                        <el-table-column
                          prop="id"
                          label="ID"
                          align="center"
                          width="60"
                          >
                        </el-table-column>
                        <el-table-column
                          prop="name"
                          label="别名"
                          align="left"
                          min-width="120"
                          >
                        </el-table-column>
                        <el-table-column
                          prop="useringname"
                          label="用途"
                          width="80"
                          align="center"
                          >
                        </el-table-column>
                        <el-table-column
                          prop="systemname"
                          label="系统"
                          width="80"
                          align="left"
                          >
                        </el-table-column>
                        <el-table-column
                          prop="ip"
                          label="IP"
                          width="160"
                          align="left"
                          >
                          <template #default="scope">
                            <div class="table-link"><span class="link" @click="jumpWebsiteList(scope.row,scope.$index)">{{scope.row.ip}}</span></div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="allip"
                          label="全部IP"
                          min-width="240"
                          align="left"
                          >
                        </el-table-column>
                        <el-table-column
                          prop="adminuser"
                          label="负责人"
                          width="120"
                          align="left"
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
                      <div v-if="totalDataNum>50" class="pagination-panel" ref="pagePane">
                        <el-pagination
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                          :current-page="page"
                          :page-sizes="pageSizeList"
                          :page-size="limit"
                          :pager-count="pagerCount"
                          :layout="device==='mobile'?'prev, pager, next':'total, sizes, prev, pager, next, jumper'"
                          :total="totalDataNum">
                        </el-pagination>
                      </div>
                    </div>
                  </div>
                </el-card>
            </div>
        </div>
      </div>
    <div class="mobile-filter-mask" v-bind:class="openClass?'open':''" v-if="device!=='desktop'" v-on:click="searchDialog()"></div>
    <div class="mobile-filter-dialog flex-box flex-column" v-bind:class="openClass?'open':''" v-if="device!=='desktop'">
      <div class="flex-content">
        <div class="abs-scroll">
          <ul>
            <li>
              <span class="title-panel">语言</span>
              <div class="tag-panel">
                <div class="item-button" v-for="item in languageList" v-bind:key="item.value">
                  <el-button type="primary" v-bind:class="item.isOn?'is-plain':''"  size="small" v-on:click="clickLanguageHandler(item)">{{item.label}}</el-button>
                </div>
              </div>
            </li>
            <li class="column-2">
              <span class="title-panel">用途</span>
              <div class="tag-panel">
                <div class="item-button" v-for="item in useingList" v-bind:key="item.value">
                  <el-tag v-bind:class="item.isOn?'is-plain':''" size="small" v-on:click="clickUseingHandler(item)">{{item.label}}</el-tag>
                </div>
              </div>
            </li>
            <li class="column-2">
              <span class="title-panel">系统</span>
              <div class="tag-panel">
                <div class="item-button" v-for="item in serverList" v-bind:key="item.value">
                  <el-tag v-bind:class="item.isOn?'is-plain':''" size="small" v-on:click="clickSystemHandler(item)">{{item.label}}</el-tag>
                </div>
              </div>
            </li>
            <li>
              <span class="title-panel">别名</span>
              <div class="item-filter">
                <el-input
                  placeholder="输入别名"
                  v-model="formData.name"
                  size="small"
                  clearable>
                </el-input>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <p class="footer-button"><span class="btn-yes" v-on:click="searchResult()">确定</span></p>
    </div>
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
      pagerCount:5,
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
      dialogSearchVisible:false,
      openClass:false,
    }
  },
  computed: {
    ...mapGetters([
      'device'
    ]),
  },
  mounted(){
      const $this = this;
      $this.$nextTick(function () {
        $this.setTableHeight();
      });
      window.onresize = () => {
        return (() => {
          $this.setTableHeight();
        })()
      };
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
      this.$refs.simpleTable.doLayout();
    })
  },
  methods:{
    // 高级筛选
    searchDialog(){
      var $this = this;
      $this.openClass=!$this.openClass;
    },
    // 设置table高度
    setTableHeight(){
      var $this = this;
      $this.tableHeight = "auto";
      $this.$nextTick(()=>{
        var trueHeight = $this.$refs.scrollPane.offsetHeight;
        var headerHeight = $this.$refs.headerPane.offsetHeight+45;
        var screenHeight = $this.$refs.boxPane.offsetHeight;
        console.log(trueHeight,"真实高度");
        console.log(headerHeight,"头部高度");
        console.log(screenHeight,"视窗高度");
        if(trueHeight<=screenHeight){
          $this.tableHeight = screenHeight-headerHeight-30;
        }else{
          if(trueHeight-screenHeight<=headerHeight){
            $this.tableHeight = "auto";
          }else{
            if($this.totalDataNum>100){
              $this.tableHeight = screenHeight - $this.$refs.pagePane.offsetHeight - 30;
            }else{
              $this.tableHeight = screenHeight-30;
            }
          }
        }
        console.log($this.tableHeight,"表格高度");
      });
    },
    // 搜索结果点击事件
    searchResult(){
      var $this = this;
      $this.openClass = false;
      $this.page = 1;
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
            if($this.device === "mobile"){
              $this.openClass = false;
            }
            $this.$nextTick(function () {
              $this.setTableHeight();
            })
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
              item.isOn = false;
              languageList.push(itemData);
            });
            $this.languageList = languageList;
            var serverList = [];
            response.server.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              item.isOn = false;
              serverList.push(itemData);
            });
            $this.serverList = serverList;
            var useingList = [];
            response.usering.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              item.isOn = false;
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
    // 跳转到网站列表页
    jumpWebsiteList(row,index){
      var $this = this;
      if($this.device=="desktop"){
        var routeUrl =  $this.$router.resolve({name:'Website_lists',query:{key:row.ip}});
        window.open(routeUrl.href,'_blank');
      }else{
        $this.$router.push({name:'Website_lists',query:{key:row.ip}});
      }
    },
    // 修改网站数据
    editTableRow(row,index){
      var $this = this;
      var routeUrl =  $this.$router.resolve({name:'webserverAddEdit',query:{webserverID:row.id}});
      window.open(routeUrl.href,'_blank');
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
    // 移动端语言选择事件
    clickLanguageHandler(e){
      var $this = this;
      var languageList = $this.languageList;
      languageList.forEach(function(item,index){
        if(item.value == e.value){
          item.isOn = !item.isOn;
          if(item.isOn){
            $this.formData.language = item.value;
          }else{
            $this.formData.language = "";
          }
        }else{
          item.isOn = false;
        }
      });
      $this.languageList = languageList;
    },
    // 移动端用途选择事件
    clickUseingHandler(e){
      var $this = this;
      var useingList = $this.useingList;
      useingList.forEach(function(item,index){
        if(item.value == e.value){
          item.isOn = !item.isOn;
          if(item.isOn){
            $this.formData.useringid = item.value;
          }else{
            $this.formData.useringid = "";
          }
        }else{
          item.isOn = false;
        }
      });
      $this.useingList = useingList;
    },
    // 移动端系统选择事件
    clickSystemHandler(e){
      var $this = this;
      var serverList = $this.serverList;
      serverList.forEach(function(item,index){
        if(item.value == e.value){
          item.isOn = !item.isOn;
          if(item.isOn){
            $this.formData.systemid = item.value;
          }else{
            $this.formData.systemid = "";
          }
        }else{
          item.isOn = false;
        }
      });
      $this.serverList = serverList;
    },
  }
}
</script>
<style lang="scss" scoped>
</style>