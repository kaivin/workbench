<template>
  <div class="page-root user-index" ref="boxPane">
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
                      <div class="search-wrap" ref="searchPane">
                        <div class="item-search">
                          <el-cascader v-model="searchData.dept_id" size="small" class="cascader-panel" :options="departLevelData" ref="menuLevel" filterable placeholder="请选择部门" :props="{ checkStrictly: true,expandTrigger: 'hover' }" clearable></el-cascader>
                        </div>
                        <div class="item-search">
                          <el-select v-model="searchData.is_delete" size="small" clearable placeholder="请选择用户状态" class="select-panel">
                            <el-option
                              v-for="item in userStatus"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </div>
                        <div class="item-search">
                          <el-input
                            class="input-panel"
                            size="small"
                            placeholder="请输入真实姓名关键字"
                            v-model="searchData.uname"
                            @keyup.enter.native="searchResult"
                            clearable>
                          </el-input>
                        </div>
                        <div class="item-search">
                          <el-button class="item-input" :class="isDisabled?'isDisabled':''" :disabled="isDisabled" type="primary" size="small" icon="el-icon-search" @click="searchResult">查询</el-button>
                          <el-button type="info" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-content" ref="tableContent">
                      <div class="table-wrapper" v-bind:class="scrollPosition.isFixed?'fixed-table':''">
                          <div class="table-mask"></div>
                          <el-table
                            ref="simpleTable"
                            :data="tableData"
                            tooltip-effect="dark"
                            stripe
                            class="SiteTable"
                            style="width: 100%"
                            :style="'min-height:'+tableHeight+'px;'"
                            row-key="id"
                            >
                            <el-table-column
                              prop="id"
                              label="ID"
                              width="50"
                              fixed="left"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="name"
                              label="真实姓名"
                              width="100"
                              fixed="left"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="username"
                              label="用户名"
                              width="120"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="depart"
                              label="部门"
                              width="90"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="level"
                              label="职称"
                              width="120"
                              >
                              <template slot-scope="scope">
                                <span v-bind:class="'JobLevel_'+scope.row.level" v-if="scope.row.level&&scope.row.level!=7"></span>
                                <span class="JobLevel_" v-else></span>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="workname"
                              label="职位"
                              width="80"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="role"
                              label="角色"
                              min-width="160"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="phone"
                              label="手机号"
                              width="120"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="email"
                              label="邮箱"
                              min-width="150"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="login_ip"
                              label="最近登录IP"
                              width="100"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="login_time"
                              label="最近登录时间"
                              width="150"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="remarks"
                              label="备注"
                              min-width="80"
                              >
                            </el-table-column>
                            <el-table-column
                              v-if="(menuButtonPermit.includes('User_getrole')||menuButtonPermit.includes('User_resetpwd')||menuButtonPermit.indexOf('User_edit')||menuButtonPermit.indexOf('User_delete'))"
                              :width="operationsWidth"
                              align="center"
                              fixed="right"
                              prop="operations"
                              label="操作">
                              <template #default="scope">
                                <div class="table-button">
                                  <el-button size="mini" @click="userLogin(scope.row,scope.$index)" v-if="menuButtonPermit.includes('User_tabuser')">用户登陆</el-button>
                                  <el-button size="mini" @click="allotRole(scope.row,scope.$index)" v-if="menuButtonPermit.includes('User_getrole')">分配角色</el-button>
                                  <el-button size="mini" @click="resetPassword(scope.row,scope.$index)" v-if="menuButtonPermit.includes('User_resetpwd')">重置密码</el-button>
                                  <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('User_edit')">编辑</el-button>
                                  <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('User_delete')&&scope.row.is_delete==1" type="info" plain>启用</el-button>
                                  <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('User_delete')&&scope.row.is_delete==0" type="info" plain>禁用</el-button>
                                  <el-button size="mini" @click="showHideTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('User_showhide')">{{scope.row.user_show==1?'显示':'隐藏'}}</el-button>
                                </div>
                              </template>
                            </el-table-column>
                          </el-table>
                      </div>
                      <div class="out_box fixed" v-if="scrollPosition.maxScrollWidth>0&&scrollPosition.isPC" :style="'left:'+scrollPosition.left+'px;width:'+scrollPosition.width+'px;bottom:'+scrollPosition.fixedBottom+'px;'" ref="out_box">
                          <div class="in_box" @mousedown="mouseDownHandler" :style="'left:'+scrollPosition.insetLeft+'px;width:'+scrollPosition.insetWidth+'px;'" ref="in_box" ></div>
                      </div>
                  </div>
                  <div class="pagination-panel" v-if="totalDataNum>20" ref="pagePane">
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
      <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('User_add')||menuButtonPermit.includes('User_edit'))" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" :before-close="handleClose" width="680px">
        <el-form :model="dialogForm">
          <div class="item-form-group">
            <div class="item-form">
              <el-form-item label="真实姓名：" :label-width="formLabelWidth">
                <el-input v-model="dialogForm.name" ref="name"></el-input>
              </el-form-item>
            </div>
            <div class="item-form">
              <el-form-item label="手机号：" :label-width="formLabelWidth">
                <el-input v-model="dialogForm.phone" ref="phone"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="item-form-group">
            <div class="item-form">
              <el-form-item label="邮箱：" :label-width="formLabelWidth">
                <el-input v-model="dialogForm.email" ref="email"></el-input>
              </el-form-item>
            </div>
            <div class="item-form">
              <el-form-item label="所属品牌：" :label-width="formLabelWidth">
                <el-select v-model="dialogForm.SellerIndustryGroup" clearable placeholder="请选择品牌">
                  <el-option
                    v-for="item in brandList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="item-form-group">
            <div class="item-form">
              <el-form-item label="职位：" :label-width="formLabelWidth">
                <el-select v-model="dialogForm.workname_id" clearable placeholder="请选择职位">
                  <el-option
                    v-for="item in worknameList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item-form">
              <el-form-item label="职称：" :label-width="formLabelWidth">
                <el-select v-model="dialogForm.postion_id" clearable placeholder="请选择职称">
                  <el-option
                    v-for="item in postionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="item-form userType">
              <label class="el-form-item__label" style="width: 110px;">用户类型：</label>
              <el-radio-group v-model="dialogForm.issales">
                <el-radio
                    v-for="item in issalesList"
                    :key="item.value"
                    :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
          </div>
          <div class="item-form">
            <el-form-item label="部门：" :label-width="formLabelWidth" v-if="departLevelData.length>0">
              <el-cascader v-model="dialogForm.deptid_othername" :options="departLevelData" ref="departLevel" placeholder="请选择部门" :props="{ checkStrictly: true,expandTrigger: 'hover',multiple:true }" :collapse-tags="true" clearable></el-cascader>
            </el-form-item>
          </div>
          <div class="item-form">
              <el-form-item label="备注：" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="dialogForm.remarks" :autosize="{ minRows: 2, maxRows: 4}" ref="remarks"></el-input>
              </el-form-item>
          </div>
          <div class="item-form" style="width: 240px;">
              <el-form-item label="分配角色：" :label-width="formLabelWidth">
                <el-button type="primary" @click="allotRole(0,0)">分配角色</el-button>
              </el-form-item>
          </div>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" :class="isSaveData?'isDisabled':''" :disabled="isSaveData" @click="saveData">确 定</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog title="分配角色" v-if="(menuButtonPermit.includes('User_getrole'))" custom-class="transfer-dialog" :visible.sync="dialogRoleVisible" width="840px">
        <div class="transfer-panel">
          <div class="transfer-wrap">
            <el-transfer 
              v-model="roleValue" 
              :data="roleData"
              :titles="['可分配角色', '已分配角色']"
              filterable
              :filter-method="filterRoleMethod"
              filter-placeholder="请输入角色关键字"
            ></el-transfer>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogRoleVisible = false">取 消</el-button>
            <el-button type="primary" :class="isSaveAddRoleData?'isDisabled':''" :disabled="isSaveAddRoleData" @click="saveAddRoleData" v-if="dialogFormVisible">确 定</el-button>
            <el-button type="primary" :class="isSaveRoleData?'isDisabled':''" :disabled="isSaveRoleData" @click="saveRoleData" v-else>确 定</el-button>
          </span>
        </template>
      </el-dialog>
  </div>
</template>
<script>
import router from '@/router'
import { mapGetters } from 'vuex'
export default {
  name: 'userIndex',
  data() {
    return {
      breadcrumbList:[],
      menuButtonPermit:[],
      operationsWidth:"",
      tableData:[],
      tableHeight:200,
      searchData:{
          uname:"",
          page:1,
          limit:20,
          dept_id:0,
          is_delete:"",
      },
      userStatus:[
        {label:"激活用户",value:0,isOn:false},
        {label:"封禁用户",value:1,isOn:false}
      ],
      pageSizeList:[20, 50, 100],
      totalDataNum:0,
      pagerCount:5,
      dialogFormVisible:false,
      dialogText:"",
      formLabelWidth:"120px",
      departLevelData:[],
      worknameList:[],
      postionList:[],
      brandList:[],
      dialogForm:{
        deptid_othername:[],
        role_id:[],
        id:0,
        name:"",
        remarks:"",
        phone:"",
        email:"",
        postion_id:"",
        workname_id:"",
        issales:1,
        SellerIndustryGroup:'',
      },
      issalesList:[
        {label:"正常",value:1},
        {label:"业务员",value:2},
      ],
      dialogRoleVisible:false,
      roleData:[{key:"",label:""}],
      roleValue:[],
      filterRoleMethod(query, item) {
          if(item.label){
            return item.label.indexOf(query) > -1;
          }
      },
      currentUserID:0,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogSearchVisible:false,
      scrollPosition:{
        width:0,
        left:0,
        fixedBottom: 20,
        insetWidth:0,
        oldInsetLeft:0,
        insetLeft:0,
        ratio:0,
        startPageX:0,
        maxScrollWidth:0,
        isMouseDown:false,
        isPC:true,
        isFixed:false,
      },
      scrollTable:{
        scrollDom:null,
        tableHeaderFixedDom:null,
        tableFixedRightDom:null,
        fixedTopHeight:0,
        tableheaderHeight:0,
        fixedRightWidth:0,
        tableBottom:0,
        clientHeight:0,
      },
      isSaveData:false,
      isDisabled:false,
      isSaveRoleData:false,
    }
  },
  computed: {
    ...mapGetters([
      'addUser',
      'sidebar',
      'menuData'
    ]),
    isOpen() {
      return this.sidebar.opened;
    },
    isAdd() {
      return this.addUser
    }
  },
  mounted(){
      const $this = this;
      if(!$this.sidebar.opened){
        $this.$store.dispatch('app/toggleSideBar');
      };
      // 监听竖向滚动条滚动事件
      window.addEventListener('scroll',this.handleScroll,true);
      $this.$nextTick(function () {
        $this.setTableHeight();
      });
      window.onresize = () => {
        return (() => {
          $this.setTableHeight();
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
      isAdd(e){
        if(e){
          this.addTableRow();
        }
      },
      isOpen(e){
        this.setTableHeight();
      },
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
  },
  updated(){
    this.$nextTick(() => {
      this.$refs.simpleTable.doLayout();
    })
  },
  destroyed(){
    window.removeEventListener('scroll', this.handleScroll,true);//监听页面滚动事件
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
    // 判断浏览器类型
    getBrowserType(){
      var ua =  navigator.userAgent;
      if(ua){
        if(ua.indexOf('Mobile')!=-1){
          this.scrollPosition.isPC = false;
        }else{
          this.scrollPosition.isPC = true;
        }
      }else{
        this.scrollPosition.isPC = true;
      }
    },
    // 设置table高度
    setTableHeight(){
      var $this = this;
      $this.tableHeight = 0;      
      var headerHeight = $this.$refs.headerPane.offsetHeight+45;
      var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      $this.tableHeight = screenHeight-headerHeight-breadcrumbHeight-40;
      $this.getBrowserType();
        setTimeout(function() {
          $this.setScrollDom();
      }, 400);
    },
    // 搜索点击事件
    searchResult(){
      var $this = this;
      if(!$this.isDisabled){
        $this.isDisabled=true;
        $this.searchData.page = 1;
        $this.initPage();
      }
    },
    // 重置表单
    resetData(){
        var $this = this;
        $this.searchData.uname='';
        $this.searchData.page=1;
        $this.searchData.limit=20;
        $this.searchData.dept_id=0;
        $this.searchData.is_delete='';
        $this.searchResult();
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      var formData = {}
      formData.page = $this.searchData.page;
      formData.dept_id = Array.isArray($this.searchData.dept_id)?$this.searchData.dept_id[$this.searchData.dept_id.length-1]:$this.searchData.dept_id;
      formData.uname = $this.searchData.uname;
      formData.limit = $this.searchData.limit;
      if($this.searchData.is_delete!=''){
        formData.is_delete = $this.searchData.is_delete;
      }
      if($this.searchData.is_delete===0){
        formData.is_delete = $this.searchData.is_delete;
      }
      document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
      $this.$store.dispatch('user/userListAction', formData).then(response=>{
        if(response){
          if(response.status){
            if(response.data.length>0){
              var res = response.data;
              res.forEach(function(item,index){
                item.workname_id = parseInt(item.workname_id);
                item.postion_id = parseInt(item.postion_id);
              })
              $this.tableData = res;
            }else{
              $this.tableData = [];
            }
            $this.totalDataNum = response.allcount;
            setTimeout(()=>{
              $this.isDisabled=false;
              $this.isSaveData=false;
              $this.isSaveRoleData=false;
            },1000);
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
              setTimeout(()=>{
                $this.isDisabled=false;
                $this.isSaveData=false;
                $this.isSaveRoleData=false;
              },1000);
            }
          }
        }
      });
    },
    selectData(data,$this){
      var childrenData = [];
      data.forEach(function(item,index){
        var itemData = {};
        itemData.value = item.id;
        itemData.label = item.name;
        if(item.is_usering == 0){
          itemData.disabled = false;
        }else{
          itemData.disabled = true;
        }
        itemData.children = $this.selectData(item.children,$this);
        childrenData.push(itemData);
      });
      return childrenData;
    },
    // 树形菜单
    dataToTree(data,$this){
        var parents = data.filter(function (item) {
            return item.fid == 0;
        });
        var children = data.filter(function (item) {
            return item.fid != 0;
        });
        $this.convert(parents, children,$this);
        return parents;
    },
    // 树形菜单转化
    convert(parents,children,$this){
      parents.forEach(function (item) {
        item.children = [];
        children.forEach(function (current, index) {
            if (current.fid === item.id) {
                var temp = JSON.parse(JSON.stringify(children)); // 将获得的子集json格式化
                temp.splice(index, 1); // 删除子集中已匹配项
                item.children.push(current);
                $this.convert([current], temp,$this); // 递归
            }
        });
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
            if($this.menuButtonPermit.includes('User_index')){
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('User_resetpwd')){
                operationsWidth+=90;
              }
              if($this.menuButtonPermit.includes('User_edit')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('User_delete')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('User_getrole')){
                operationsWidth+=90;
              }
              if($this.menuButtonPermit.includes('User_showhide')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('User_tabuser')){
                operationsWidth+=90;
              }
              $this.operationsWidth = "" + operationsWidth;
              $this.getDepartList();
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
    // 关闭添加用户弹窗
    handleClose(){
      var $this = this;
      $this.dialogFormVisible = false;
      $this.$store.dispatch('app/closeUser');
    },
    // 添加表格行数据
    addTableRow(row,index){
      var $this = this;
      $this.getWorkNameList();
      $this.getPostionNameList();
      $this.getBrandList();
      $this.dialogFormVisible = true;
      $this.dialogText = "添加用户";
      $this.resetFormData();
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.getWorkNameList();
      $this.getPostionNameList();
      $this.getBrandList();
      $this.dialogFormVisible = true;
      $this.dialogText = "编辑用户";
      $this.resetFormData();
      var departID = [];
      if(row.deptid_othername){
        if(row.deptid_othername.indexOf("|")!=-1){
          var departArr = row.deptid_othername.split("|");
          departArr.forEach(function(item,index){
            if(item.indexOf(",")!=-1){
              var itemData = item.split(",");
              var itemArr = [];
              itemData.forEach(function(item1,index1){
                itemArr.push(parseInt(item1));
              });
              departID.push(itemArr);
            }else{
              var itemArr = []
              itemArr.push(parseInt(item));
              departID.push(itemArr);
            }
          });
        }else{
          if(row.deptid_othername.indexOf(",")!=-1){
              var itemData = row.deptid_othername.split(",");
              var itemArr = []
              itemData.forEach(function(item1,index1){
                itemArr.push(parseInt(item1));
              });
              departID.push(itemArr);
            }else{
              var itemArr = []
              itemArr.push(parseInt(row.deptid_othername));
              departID.push(itemArr);
            }
        }
      }
      $this.dialogForm.deptid_othername = departID;
      $this.dialogForm.role_id = row.role_id;
      $this.dialogForm.id = row.id;
      $this.dialogForm.name = row.name;
      $this.dialogForm.remarks = row.remarks;
      $this.dialogForm.phone = row.phone;
      $this.dialogForm.email = row.email;
      $this.dialogForm.issales = row.issales;
      $this.dialogForm.postion_id = row.postion_id==0?'':row.postion_id;
      $this.dialogForm.workname_id = row.workname_id==0?'':row.workname_id;
      $this.dialogForm.SellerIndustryGroup = row.SellerIndustryGroup==0?'':row.SellerIndustryGroup;
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if(!$this.isSaveData){
        if(!$this.validationForm()){
          return false;
        }
        $this.isSaveData=true;
        var formData = {}
        var departID = [];
        $this.dialogForm.deptid_othername.forEach(function(item,index){
          var itemData = item.join(",");
          departID.push(itemData);
        });
        var departData = departID.join("|");
        formData.id = $this.dialogForm.id;
        formData.phone = $this.dialogForm.phone;
        formData.email = $this.dialogForm.email;
        formData.name = $this.dialogForm.name;
        formData.remarks = $this.dialogForm.remarks;
        formData.workname_id = $this.dialogForm.workname_id;
        formData.postion_id = $this.dialogForm.postion_id;
        formData.role_id = $this.dialogForm.role_id;
        formData.issales = $this.dialogForm.issales;
        formData.deptid_othername = departData;
        formData.SellerIndustryGroup = $this.dialogForm.SellerIndustryGroup;
        var pathUrl = "";
        if($this.dialogText=="编辑用户"){
          pathUrl = "user/userEditAction";
        }else{
          pathUrl = "user/userAddAction";
        }
        $this.$store.dispatch(pathUrl, formData).then(response=>{
            if(response.status){
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
                $this.isSaveData=false;
              },1000);
            }
        });
      }
    },
    // 重置搜索数据
    resetSearchData(){
      var $this = this;
      $this.searchData.uname = "";
      $this.searchData.page = 1;
      $this.searchData.limit = 10;
      $this.searchData.dept_id = 0;
      $this.searchData.is_delete = "";
    },
    // 重置添加数据表单
    resetFormData(){
      var $this = this;
      $this.dialogForm.deptid_othername = [];
      $this.dialogForm.role_id = [];
      $this.dialogForm.id = 0;
      $this.dialogForm.name = "";
      $this.dialogForm.remarks = "";
      $this.dialogForm.phone = "";
      $this.dialogForm.email = "";
      $this.dialogForm.issales = 1;
      $this.dialogForm.postion_id = "";
      $this.dialogForm.workname_id = "";
      $this.dialogForm.SellerIndustryGroup = "";
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.name == ""){
        $this.$message({
            showClose: true,
            message: '错误：真实姓名不能为空！',
            type: 'error'
        });
        $this.$refs['name'].focus();
        return false;
      }
      return true;
    },
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      var tips = "";
      if(row.is_delete){
        tips = "激活";
      }else{
        tips = "禁用";
      }
      $this.$confirm('是否确认'+tips+'该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('user/userDeleteAction', {id:row.id}).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.resetSearchData();
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
            message: '已取消'+tips
          });          
      });
    },
    // 删除表格行
    showHideTableRow(row,index){
      var $this = this;
      $this.$store.dispatch('user/userShowHideAction', {id:row.id}).then(response=>{
        if(response.status){
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'success'
          });
          $this.resetSearchData();
          $this.initPage();
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 重置密码
    resetPassword(row,index){
      var $this = this;
      $this.$confirm('是否确认重置密码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('user/userResetPwdAction', {id:row.id}).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
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
            message: '已取消重置密码'
          });          
      });
    },
    // 分配角色弹窗
    allotRole(row,index){
      var $this = this;
      $this.currentUserID = 0;
      $this.roleData= [];
      $this.roleValue=[];
      $this.dialogRoleVisible = true;
      if(row==0){
        if($this.dialogForm.id == 0){
            if($this.roleValue.length==0){
              $this.getAllotingRole();
            }
        }else{
          $this.currentUserID = $this.dialogForm.id;
          $this.getAllotedRole();
        }
      }else{
        $this.currentUserID = row.id;
        $this.getAllotedRole();
      }
    },
    // 添加用户时保存角色分配
    saveAddRoleData(){
        var $this = this;
        if(!$this.isSaveAddRoleData){
          if($this.roleValue.length==0){
            $this.$message({
              showClose: true,
              message: "您并未给用户分配任何角色",
              type: 'warning'
            });
          }else{
            $this.$message({
              showClose: true,
              message: "已成功分配角色",
              type: 'success'
            });
          }
          $this.isSaveAddRoleData=true;
          $this.dialogForm.role_id = $this.roleValue;
          $this.dialogRoleVisible = false;
          setTimeout(()=>{
            $this.isSaveAddRoleData=false;
          },1000);
        }
    },
    // 角色分配保存
    saveRoleData(){
        var $this = this;
        if(!$this.isSaveRoleData){
          $this.isSaveRoleData=true;
          var rolePostData = {};
          rolePostData.id = $this.currentUserID;
          rolePostData.role_id = $this.roleValue;
          $this.$store.dispatch('user/userAllotRoleAction', rolePostData).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.dialogRoleVisible = false;
              $this.initData();
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
              setTimeout(()=>{
                $this.isSaveRoleData=false;
              },1000);
            }
          });
        }
    },
    // 获取当前用户已分配的角色数据
    getAllotedRole(){
      var $this = this;
      $this.$store.dispatch('user/userAllotedRoleAction', {id:$this.currentUserID}).then(response=>{
        if(response.status){
          var roleUserData = [];
          var selectedRoleUserData = [];
          if(response.data.length>0){
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.key = item.id;
              itemData.label = item.pathname;
              itemData.disabled = false;
              roleUserData.push(itemData);
              selectedRoleUserData.push(item.id);
            });
            $this.roleData = roleUserData;
            $this.roleValue = selectedRoleUserData;
          }
          $this.getAllotingRole();
        }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 获取当前登录用户可分配的角色数据
    getAllotingRole(){
      var $this = this;
      var roleData = [];
      if($this.roleData.length>0){
        $this.roleData.forEach(function(item,index){
          roleData.push(item.key);
        });
      }
      var roleDataNow = $this.roleData;
      var roleIngData = [];
      $this.$store.dispatch('user/userCanAllotRoleAction', null).then(response=>{
        if(response.status){
          if(response.data.length>0){
            if(roleDataNow.length>0){
              response.data.forEach(function(item,index){
                roleIngData.push(item.id);
              });
              roleDataNow.forEach(function(item,index){
                if(roleIngData.includes(item.key)){
                  item.disabled = false;
                }else{
                  item.disabled = true;
                }
              });
            }
            response.data.forEach(function(item,index){
              if(!roleData.includes(item.id)){
                var itemData = {};
                itemData.key = item.id;
                itemData.label = item.pathname;
                itemData.disabled = false;
                roleDataNow.push(itemData);
              }
            });
            $this.roleData = roleDataNow;
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
    // 切换用户登陆
    userLogin(row,index){
      var $this = this;
      $this.$store.dispatch('user/changeUserLoginAction', {id:row.id}).then(response=>{
        if(response.status){
          $this.$store.dispatch('login/changeLogin', response).then(res=>{
            if(res.status){
              $this.$store.dispatch('api/getRouteAction').then(res1=>{
                if(res1.status){
                  if(res1.data.length>0){
                    $this.$store.dispatch('permission/generateRoutes', res1.data).then(res2=>{
                      if(res2.length>0){
                        // router.addRoutes(res2);
                        // router.addRoutes([{path: '*',name:'error404',redirect:"/404",meta: {title: '404', icon: null,hidden:true,keepAlive:false }}]);
                        var homeRedirect = "";
                        if(response.data.issales==2){
                          homeRedirect = '/Sales/index?Status=personcount';
                        }else{
                          if(response.data.id==533||response.data.id==1112){
                              homeRedirect = '/stat/cn/targetShow';
                          }else if(response.haschtarget == 1){
                              homeRedirect = '/welcome?status=1';
                          }else if(response.hasentarget == 1){
                              homeRedirect = '/welcome?status=2';
                          }else{
                              homeRedirect = '/Home/index' ;
                          }
                        }
                        var routeUrl =  $this.$router.resolve({path: homeRedirect });
                        window.open(routeUrl.href,'_self');
                      }
                    });
                  }
                }else{
                  $this.$message({
                    message: response.info,
                    type: 'error',
                    duration: 5 * 1000
                  });
                  $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
                }
              });
            }
          });
        }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 获取部门数据
    getBrandList(){
      var $this = this;
      $this.$store.dispatch('user/getBrandListAction', null).then(response=>{
        if(response.status){
          if(response.data.length>0){
            var brandList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.brandname;
              brandList.push(itemData);
            });
            $this.brandList = brandList;
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
    // 获取部门数据
    getDepartList(){
      var $this = this;
      $this.$store.dispatch('user/userCanDepartAction', null).then(response=>{
          if(response.status){
            if(response.data.length>0){
              var departData = $this.dataToTree(response.data,$this);
              var selectData = [];
              departData.forEach(function(item,index){
                var itemData = {}
                itemData.value = item.id;
                itemData.label = item.name;
                itemData.isOn = false;
                if(item.is_usering == 0){
                  itemData.disabled = false;
                }else{
                  itemData.disabled = true;
                }
                itemData.children = $this.selectData(item.children,$this);
                selectData.push(itemData);
              });
              $this.departLevelData = selectData;
              $this.initPage();
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
    // 获取职位数据
    getWorkNameList(){
      var $this = this;
      $this.$store.dispatch('api/getWorkNameAction', null).then(response=>{
        if(response.status){
          if(response.data.length>0){
            var workList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.workname;
              workList.push(itemData);
            });
            $this.worknameList = workList;
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
    // 获取职称数据
    getPostionNameList(){
      var $this = this;
      $this.$store.dispatch('api/getPostionNameAction', null).then(response=>{
        if(response.status){
          if(response.data.length>0){
            var dataList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.postionname;
              dataList.push(itemData);
            });
            $this.postionList = dataList;
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
    // 设置横向滚动条相关DOM数据
    setScrollDom(){
      var $this = this;
      $this.scrollPosition.insetLeft = 0;
      $this.scrollPosition.oldInsetLeft = 0;
      // 表格真实宽度（可能超出屏幕）
      var scrollWidth = $this.$refs.simpleTable.bodyWrapper.scrollWidth;
      // 表格可见宽度（屏幕内宽度）
      var maxWidth = $this.$refs.simpleTable.bodyWrapper.clientWidth;
      // 获取表格的位置信息（距离视窗左边的位置信息）
      var rectOBJ = $this.$refs.simpleTable.$el.getBoundingClientRect();
      // 获取距离视窗左边的宽度
      var leftWidth = rectOBJ.left;
      // 根据百分比算出滚动条滑块的宽度
      var insetWidth = parseInt(maxWidth/scrollWidth*maxWidth);
      // 算出滚动条与视口比例（滚动条滚动1像素视口需要滚动多少像素）
      var ratio = (scrollWidth - maxWidth) / (maxWidth - insetWidth);
      var scrollDom = document.querySelector(".SiteTable .el-table__body-wrapper");
      var tableHeaderFixedDom = document.querySelector(".SiteTable .el-table__header-wrapper");
      var tableFixedRightDom = document.querySelector(".SiteTable .el-table__fixed-right");
      var tableFixedLeftDom = document.querySelector(".el-table__fixed");
      $this.scrollPosition.width = maxWidth;
      $this.scrollPosition.left = leftWidth;
      $this.scrollPosition.insetWidth = insetWidth;
      $this.scrollPosition.ratio = parseFloat(ratio);
      $this.scrollPosition.maxScrollWidth = maxWidth - insetWidth;
      $this.scrollTable.scrollDom = scrollDom;
      // 视窗改变时，让自定义滚动条的位置与真实滚动条滚动的位置相吻合
      $this.scrollPosition.insetLeft = $this.scrollTable.scrollDom.scrollLeft/$this.scrollPosition.ratio;
      // 获取表格头吸顶需滚动的高度
      if($this.$refs.headerPane){
         $this.scrollTable.fixedTopHeight = $this.$refs.headerPane.offsetHeight+$this.$refs.breadcrumbPane.offsetHeight+15+20+44;
      }else{
         $this.scrollTable.fixedTopHeight=$this.$refs.breadcrumbPane.offsetHeight+15+20+44;
      }
      $this.scrollTable.tableHeaderFixedDom = tableHeaderFixedDom;
      if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
         $this.scrollTable.tableFixedRightDom = tableFixedRightDom;
      }
      if(tableFixedLeftDom&&tableFixedLeftDom!=null&&tableFixedLeftDom!=undefined){
         $this.scrollTable.tableFixedLeftDom = tableFixedLeftDom;
      }
      var fixedHeaderObj = $this.scrollTable.tableHeaderFixedDom.getBoundingClientRect();
      // 获取表格头的高度
      $this.scrollTable.tableheaderHeight = fixedHeaderObj.height;
      if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
         var fixedRightObj = $this.scrollTable.tableFixedRightDom.getBoundingClientRect();
         // 获取右侧固定列的总宽度
         $this.scrollTable.fixedRightWidth = fixedRightObj.width;
      }
      if(tableFixedLeftDom&&tableFixedLeftDom!=null&&tableFixedLeftDom!=undefined){
         var fixedLeftObj = $this.scrollTable.tableFixedLeftDom.getBoundingClientRect();
         // 获取左侧侧固定列的总宽度
         $this.scrollTable.fixedLeftWidth = fixedLeftObj.width;
      }
      var tableObj = $this.scrollTable.scrollDom.getBoundingClientRect();
      $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+$this.scrollTable.tableheaderHeight+54+20;
      $this.scrollTable.clientHeight = document.documentElement.clientHeight;
      // 头部固定情况下视窗宽高改变，需要重新设置的一些宽高
      if($this.scrollPosition.isFixed){
        var tableHeaderStyle = "width:"+$this.scrollPosition.width+"px;";
        $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
        document.querySelector(".table-mask").style = tableHeaderStyle;
        var tableStyle3 = "width:"+$this.scrollTable.fixedRightWidth+"px;";
        var tableStyle4 = "width:"+$this.scrollTable.fixedLeftWidth+"px;";
        if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
          document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
        }
        if(tableFixedLeftDom&&tableFixedLeftDom!=null&&tableFixedLeftDom!=undefined){
          document.querySelector(".SiteTable .el-table__fixed .el-table__fixed-header-wrapper").style=tableStyle4;
        }
        $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+54+20;
      }
      // 视窗宽高改变时需要设置默认滚动条的位置
      if($this.totalDataNum>20){
        var scrTop = $this.$refs.scrollDom.scrollTop;
        if(scrTop+$this.scrollTable.clientHeight>=$this.scrollTable.tableBottom-20){
          $this.scrollPosition.fixedBottom = scrTop+$this.scrollTable.clientHeight-$this.scrollTable.tableBottom-10;
        }else{
          $this.scrollPosition.fixedBottom = 20;
        }
      }
    },
    // 竖向滚动条滚动事件
    handleScroll(event){
      var $this = this;
      if(!$this.scrollPosition.isMouseDown&&event.target.className=="scroll-panel"){// 非鼠标按下状态，为竖向滚动条触发的滚动事件
        var scrTop = event.target.scrollTop;
        var tableFixedRightDom = document.querySelector(".SiteTable .el-table__fixed-right");
        var tableFixedLeftDom = document.querySelector(".SiteTable .el-table__fixed");
        if(scrTop>=$this.scrollTable.fixedTopHeight){// 头部需要固定
          $this.scrollPosition.isFixed = true;
          var tableHeaderStyle = "width:"+$this.scrollPosition.width+"px;"
          $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
          document.querySelector(".table-mask").style = tableHeaderStyle;
          var tableStyle1 = "padding-top:"+$this.scrollTable.tableheaderHeight+"px;";
          var tableStyle2 = "top:"+$this.scrollTable.tableheaderHeight+"px;";
          var tableStyle3 = "width:"+$this.scrollTable.fixedRightWidth+"px;";
          var tableStyle4 = "width:"+$this.scrollTable.fixedLeftWidth+"px;";
          document.querySelector(".SiteTable .el-table__body-wrapper").style=tableStyle1;
          if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-body-wrapper").style=tableStyle2;
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
          }
          if(tableFixedLeftDom&&tableFixedLeftDom!=null&&tableFixedLeftDom!=undefined){
            document.querySelector(".SiteTable .el-table__fixed .el-table__fixed-body-wrapper").style=tableStyle2;
            document.querySelector(".SiteTable .el-table__fixed .el-table__fixed-header-wrapper").style=tableStyle4;
          }
        }else{// 头部需要变为正常
          $this.scrollPosition.isFixed = false;
          var tableHeaderStyle = "width:100%";
          $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
          var tableStyle1 = "padding-top:0";
          document.querySelector(".SiteTable .el-table__body-wrapper").style=tableStyle1;
          var tableStyle3 = "width:auto";
          var tableStyle4 = "width:auto";
          if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
          }
          if(tableFixedLeftDom&&tableFixedLeftDom!=null&&tableFixedLeftDom!=undefined){
            document.querySelector(".SiteTable .el-table__fixed .el-table__fixed-header-wrapper").style=tableStyle4;
          }
        }
        if($this.totalDataNum>20){
          if(scrTop+$this.scrollTable.clientHeight>=$this.scrollTable.tableBottom-20){
            $this.scrollPosition.fixedBottom = scrTop+$this.scrollTable.clientHeight-$this.scrollTable.tableBottom-10;
          }else{
            $this.scrollPosition.fixedBottom = 20;
          }
        }
      }
    },
    // 监听横向滚动条鼠标按下事件
    mouseDownHandler(e){
      this.crossMoveStartHandler(e);
      window.addEventListener('mousemove',this.crossMoveingHandler);
      window.addEventListener('mouseup',this.crossMoveEndHandler);
    },
    // 横向滚动条移动开始事件
    crossMoveStartHandler(e){
      var $this = this;
      $this.scrollPosition.isMouseDown = true;
      $this.scrollPosition.startPageX = e.pageX;
    },
    // 横向滚动条鼠标移动事件
    crossMoveingHandler(e){
      var $this = this;
      if($this.scrollPosition.isMouseDown){// 只在鼠标按下时监听鼠标移动事件
        var moveLeft = e.pageX - $this.scrollPosition.startPageX;
        var scrollWidth = 0;
        // 判断本次鼠标按下后鼠标移动的距离 大于0为向右移动
        if(moveLeft>0){
          // 本次移动距离+历史已移动距离如果大于最大能移动距离，说明向右已经滚动到头
          if(moveLeft+$this.scrollPosition.oldInsetLeft>=$this.scrollPosition.maxScrollWidth){
            scrollWidth = $this.scrollPosition.maxScrollWidth;
          }else{
            scrollWidth = moveLeft+$this.scrollPosition.oldInsetLeft;
          }
        }else if(moveLeft<0){
          // 小于0为向左移动
          // 本次移动距离+历史已移动距离，如果小于0，说明向左移动已经到头
          if(moveLeft+$this.scrollPosition.oldInsetLeft<0){
            scrollWidth = 0;
          }else{
            scrollWidth = moveLeft+$this.scrollPosition.oldInsetLeft;
          }
        }else{// 鼠标按下后，未移动
          scrollWidth = $this.scrollPosition.insetLeft;
        }
        // 计算得出本次移动+历史移动总距离
        // 自定义滚动条位置改变
        $this.scrollPosition.insetLeft = scrollWidth;
        // 真实滚动条滚动距离 = 自定义滚动条滚动距离*自定义滚动条与真实滚动条的滚动比
        $this.scrollTable.scrollDom.scrollLeft = scrollWidth*$this.scrollPosition.ratio;
        e.preventDefault();
      }
    },
    // 横向滚动条移动结束事件
    crossMoveEndHandler(e){
      var $this = this;
      $this.scrollPosition.isMouseDown = false;
      $this.scrollPosition.startPageX = 0;
      $this.scrollPosition.oldInsetLeft = $this.scrollPosition.insetLeft;
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
