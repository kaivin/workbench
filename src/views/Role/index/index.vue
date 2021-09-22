<template>
  <div class="page-root" ref="boxPane">
      <div class="abs-panel" ref="mainPane">
          <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
              <div class="true-height" ref="scrollPane">
                  <p class="breadcrumb" ref="breadcrumbPane">
                      <router-link class="breadcrumb-link" to="/">首页</router-link>
                      <template v-for="item in breadcrumbList">
                        <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id"><b>-</b><span>{{item.title}}</span></router-link>
                      </template>
                  </p>
                  <el-card class="box-card" shadow="hover">
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
                              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                              >
                              <el-table-column
                                prop="name"
                                label="角色名"
                                min-width="200"
                                >
                              </el-table-column>
                              <el-table-column
                                prop="remarks"
                                label="备注"
                                min-width="200"
                                >
                              </el-table-column>
                              <el-table-column
                                v-if="(menuButtonPermit.includes('Role_add')||menuButtonPermit.includes('Role_getuser')||menuButtonPermit.includes('Role_getpermit')||menuButtonPermit.includes('Role_gettypepermit')||menuButtonPermit.includes('Role_edit')||menuButtonPermit.includes('Role_delete'))&&device==='desktop'"
                                align="center"
                                fixed="right"
                                prop="operations"
                                label="操作"
                                :width="operationsWidth">
                                <template #default="scope">
                                  <div class="table-button">
                                    <el-button size="mini" @click="addTableRow(scope.row,scope.$index)" v-if="scope.row.issuper!=1&&menuButtonPermit.includes('Role_add')">添加子角色</el-button>
                                    <el-button size="mini" @click="allotUser(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Role_getuser')">分配用户</el-button>
                                    <el-button size="mini" @click="allotPermit(scope.row,scope.$index)" v-if="scope.row.issuper!=1&&menuButtonPermit.includes('Role_getpermit')">分配菜单权限</el-button>
                                    <el-button size="mini" @click="allotPostPermit(scope.row,scope.$index)" v-if="scope.row.issuper!=1&&menuButtonPermit.includes('Role_gettypepermit')">分配论坛权限</el-button>
                                    <el-button size="mini" @click="allotWorkOrderPermit(scope.row,scope.$index)" v-if="scope.row.issuper!=1&&menuButtonPermit.includes('Role_getworktypepermit')">分配工单权限</el-button>
                                    <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="scope.row.issuper!=1&&menuButtonPermit.includes('Role_edit')">编辑</el-button>
                                    <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="scope.row.issuper!=1&&menuButtonPermit.includes('Role_delete')" type="info" plain>删除</el-button>
                                  </div>
                                </template>
                              </el-table-column>
                            </el-table>
                        </div>
                        <div class="out_box fixed" v-if="scrollPosition.maxScrollWidth>0&&scrollPosition.isPC" :style="'left:'+scrollPosition.left+'px;width:'+scrollPosition.width+'px;bottom:'+scrollPosition.fixedBottom+'px;'" ref="out_box">
                            <div class="in_box" @mousedown="mouseDownHandler" :style="'left:'+scrollPosition.insetLeft+'px;width:'+scrollPosition.insetWidth+'px;'" ref="in_box" ></div>
                        </div>
                    </div>
                  </el-card>
              </div>
          </div>
      </div>
    <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('Role_add')||menuButtonPermit.includes('Role_edit'))&&device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" :before-close="handleClose" width="480px">
      <el-form :model="dialogForm">
        <div class="item-form">
          <el-form-item label="父级角色：" :label-width="formLabelWidth" v-if="roleLevelData.length>0">
            <el-cascader v-model="dialogForm.f_id" :options="roleLevelData" ref="menuLevel" filterable placeholder="请选择父级角色" :props="{ checkStrictly: true,expandTrigger: 'hover' }" clearable></el-cascader>
          </el-form-item>
        </div>
        <div class="item-form">
          <el-form-item label="角色名称：" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.name" ref="name"></el-input>
          </el-form-item>
        </div>
        <div class="item-form" v-if="menuButtonPermit.includes('Role_getroledepart')">
          <el-form-item label="部门权限：" :label-width="formLabelWidth" v-if="departLevelData.length>0">
            <el-cascader v-model="dialogForm.role_depart" :options="departLevelData" ref="departLevel" placeholder="请选择部门" :props="{ checkStrictly: true,expandTrigger: 'hover',multiple:true }" :collapse-tags="true" clearable></el-cascader>
          </el-form-item>
        </div>
        <div class="item-form" v-if="menuButtonPermit.includes('Role_readdepartwebsite')">
          <el-form-item label="网站管理：" :label-width="formLabelWidth">
            <el-select
              v-model="dialogForm.readdepartwebsite"
              multiple
              collapse-tags
              placeholder="请选择">
              <el-option
                v-for="item in websiteDepart"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item-form-group itemwebmsg" v-if="menuButtonPermit.includes('Role_getwebmsg')">
          <el-form-item label="留言管理：" :label-width="formLabelWidth">
            <div class="item-form">
                <el-select
                  v-model="dialogForm.readwebmsglangauge"
                  multiple
                  collapse-tags
                  placeholder="语言选择">
                  <el-option
                    v-for="item in webmsglangauge"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </div>
            <div class="item-form">
                <el-select
                  v-model="dialogForm.readwebmsgbrand"
                  multiple
                  collapse-tags
                  placeholder="品牌选择">
                  <el-option
                    v-for="item in webmsgbrand"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </div>
          </el-form-item>
        </div>
        <div class="item-form">
            <el-form-item label="角色备注：" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="dialogForm.remarks" :autosize="{ minRows: 2, maxRows: 4}" ref="remarks"></el-input>
            </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="saveData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog :title="permitTitle" v-if="(menuButtonPermit.includes('Role_getpermit'))&&device==='desktop'" custom-class="transfer-2-dialog" :visible.sync="dialogPermitVisible" width="916px">
      <div class="transfer-panel">
        <div class="list-panel">
          <div class="title-panel">菜单列表</div>
          <div class="list-wrap">
            <el-tree
              :data="menuTreeData"
              show-checkbox
              node-key="id"
              ref="tree"
              :props="defaultProps"
              @check-change="handleMenuCheckChange">
            </el-tree>
          </div>
        </div>
        <div class="button-panel"><el-button type="primary" v-on:click="getCheckedKeys"><i class="el-icon-arrow-right"></i></el-button></div>
        <div class="transfer-wrap">
          <el-transfer 
            v-model="permitValue" 
            :data="permitData"
            :titles="['待分配权限', '已分配权限']"
            filterable
            :filter-method="filterPermitMethod"
            filter-placeholder="请输入权限关键字"
          ></el-transfer>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogPermitVisible = false">取 消</el-button>
          <el-button type="primary" @click="savePermitData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog :title="userTitle" v-if="(menuButtonPermit.includes('Role_getuser'))&&device==='desktop'" custom-class="transfer-dialog" :visible.sync="dialogUserVisible" width="840px">
      <div class="transfer-panel">
        <div class="transfer-wrap">
          <el-transfer 
            v-model="userValue" 
            :data="userData"
            :titles="['可分配用户', '已分配用户']"
            filterable
            :filter-method="filterUserMethod"
            filter-placeholder="请输入用户关键字"
          ></el-transfer>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogUserVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveUserData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog :title="postTitle" v-if="(menuButtonPermit.includes('Role_gettypepermit'))&&device==='desktop'" custom-class="transfer-2-dialog" :visible.sync="dialogPostVisible" width="916px">
      <div class="transfer-panel">
        <div class="list-panel">
          <div class="title-panel">论坛栏目列表</div>
          <div class="list-wrap">
            <el-tree
              :data="postData"
              show-checkbox
              node-key="id"
              ref="postTree"
              :props="defaultPostProps"
              @check-change="handlePostCheckChange">
            </el-tree>
          </div>
        </div>
        <div class="button-panel"><el-button type="primary" v-on:click="getPostCheckedKeys"><i class="el-icon-arrow-right"></i></el-button></div>
        <div class="transfer-wrap">
          <el-transfer 
            v-model="postPermitValue" 
            :data="postPermitData"
            :titles="['待分配权限', '已分配权限']"
            filterable
            :filter-method="filterPostPermitMethod"
            filter-placeholder="请输入权限关键字"
          ></el-transfer>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogPostVisible = false">取 消</el-button>
          <el-button type="primary" @click="savePostData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog :title="workOrderTitle" v-if="(menuButtonPermit.includes('Role_getworktypepermit'))&&device==='desktop'" custom-class="transfer-dialog" :visible.sync="dialogWorkOrderVisible" width="840px">
      <div class="transfer-panel">
        <div class="transfer-wrap">
          <el-transfer 
            v-model="workOrderValue" 
            :data="workOrderData"
            :titles="['可分配权限', '已分配权限']"
            filterable
            :filter-method="filterWorkOrderMethod"
            filter-placeholder="请输入工单权限关键字"
          ></el-transfer>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogWorkOrderVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveWorkOrderData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Role_index',
  data() {
    return {
      breadcrumbList:[],
      menuButtonPermit:[],
      operationsWidth:"",
      tableData:[],
      tableHeight:200,
      dialogFormVisible:false,
      dialogText:"",
      formLabelWidth:"110px",
      roleLevelData:[],
      departLevelData:[],
      websiteDepart:[],      
      webmsglangauge:[],
      webmsgbrand:[],
      dialogForm:{
        role_depart:[],
        f_id:0,
        id:0,
        name:"",
        readdepartwebsite:[],
        remarks:"",
        readwebmsglangauge:[],
        readwebmsgbrand:[],
      },
      dialogPermitVisible:false,
      dialogUserVisible:false,
      menuTreeData:[],
      permitData:[{key:"",label:""}],
      permitValue:[],
      permitingData:[],
      currentRoleID:0,
      currentRoleName:"",
      filterPermitMethod(query, item) {
          if(item.label){
            return item.label.indexOf(query) > -1;
          }
      },
      filterUserMethod(query, item) {
          if(item.label){
            return item.label.indexOf(query) > -1;
          }
      },
      filterDepartMethod(query, item) {
          if(item.label){
            return item.label.indexOf(query) > -1;
          }
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      userData:[{key:"",label:""}],
      userValue:[],
      permitTitle:"分配权限",
      userTitle:"分配用户",
      postTitle:"分配论坛管理权限",
      dialogPostVisible:false,
      postData:[],
      postPermitData:[{key:"",label:""}],
      postPermitValue:[],
      filterPostPermitMethod(query, item) {
          if(item.label){
            return item.label.indexOf(query) > -1;
          }
      },
      defaultPostProps: {
        children: 'children',
        label: 'label'
      },
      workOrderTitle:"分配工单权限",
      dialogWorkOrderVisible:false,
      filterWorkOrderMethod(query, item) {
          if(item.label){
            return item.label.indexOf(query) > -1;
          }
      },
      workOrderData:[{key:"",label:""}],
      workOrderValue:[],
      scrollPosition:{
        width:0,
        left:0,
        fixedBottom: 15,
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
    }
  },
  computed: {
    ...mapGetters([
      'device',
      'addRole',
      'sidebar',
      'menuData'
    ]),
    isOpen() {
      return this.sidebar.opened;
    },
    isAdd() {
      return this.addRole
    }
  },
  mounted(){
      const $this = this;
      this.$nextTick(function () {
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
      // 监听竖向滚动条滚动事件
      window.addEventListener('scroll',this.handleScroll,true);
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
      console.log($this.breadcrumbList,"面包屑数据");
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
      var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      $this.tableHeight = screenHeight-breadcrumbHeight-30;
      $this.getBrowserType();
        setTimeout(function() {
          $this.setScrollDom();
      }, 400);
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 获取角色列表数据
    getRoleList(){
      var $this = this;
      $this.$store.dispatch('role/roleListAction', null).then(response=>{
        if(response){
          if(response.status){
            if(response.data.length>0){
              $this.tableData = $this.dataToTree(response.data,$this);
              var selectData = [];
              $this.tableData.forEach(function(item,index){
                var itemData = {}
                itemData.value = item.id;
                itemData.label = item.name;
                itemData.disabled = false;
                itemData.children = $this.selectData(item.children,$this);
                selectData.push(itemData);
              });
              $this.roleLevelData = selectData;
            }else{
              $this.tableData = [];
            }
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
    // 角色转化属性菜单
    selectData(data,$this){
      var childrenData = [];
      data.forEach(function(item,index){
        var itemData = {};
        itemData.value = item.id;
        itemData.label = item.name;
        itemData.children = $this.selectData(item.children,$this);
        childrenData.push(itemData);
      });
      return childrenData;
    },
    // 角色树形菜单
    dataToTree(data,$this){
        var parents = data.filter(function (item) {
            return item.f_id == 0;
        });
        var children = data.filter(function (item) {
            return item.f_id != 0;
        });
        $this.convert(parents, children,$this);
        return parents;
    },
    // 角色树形菜单转化
    convert(parents,children,$this){
      parents.forEach(function (item) {
        item.children = [];
        children.forEach(function (current, index) {
            if (current.f_id === item.id) {
                var temp = JSON.parse(JSON.stringify(children));// 将获得的子集json格式化
                temp.splice(index, 1);// 删除子集中已匹配项
                item.children.push(current);
                $this.convert([current], temp,$this);// 递归
            }
        });
      });
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          console.log(res,"操作权限")
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Role_index')){
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('Role_add')){
                operationsWidth+=102;
              }
              if($this.menuButtonPermit.includes('Role_getuser')){
                operationsWidth+=90;
              }
              if($this.menuButtonPermit.includes('Role_getpermit')){
                operationsWidth+=114;
              }
              if($this.menuButtonPermit.includes('Role_gettypepermit')){
                operationsWidth+=114;
              }
              if($this.menuButtonPermit.includes('Role_getworktypepermit')){
                operationsWidth+=114;
              }
              if($this.menuButtonPermit.includes('Role_edit')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('Role_delete')){
                operationsWidth+=66;
              }
              $this.operationsWidth = "" + operationsWidth;
              $this.getRoleList();
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
    // 关闭添加角色弹窗
    handleClose(){
      var $this = this;
      $this.dialogFormVisible = false;
      $this.$store.dispatch('app/closeRole');
    },
    // 添加表格行数据
    addTableRow(row,index){
      this.dialogFormVisible = true;
      this.resetFormData();
      this.getDepartList();
      if(row){
        this.dialogText = "添加子角色";
        this.dialogForm.f_id = row.id;
      }else{
        this.dialogText = "添加角色";
      }
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "编辑角色";
      $this.getDepartList();
      var roleLevelData = $this.roleLevelData;
      roleLevelData.forEach(function(item,index){
        item.disabled = false;
        if(item.children.length>0){
          $this.resetDisabledRole(item.children,$this);
        }
      });
      roleLevelData.forEach(function(item,index){
        if(row.f_id == 0){
          if(item.value == row.id){
            item.disabled = true;
            if(item.children.length>0){
              $this.disabledRole(item.children,$this);
            }
          }
        }else{
          if(item.children.length>0){
            $this.disabledSonRole(item.children,row.id,row.f_id,$this);
          }
        }
      });
      $this.roleLevelData = roleLevelData;
      var departID = [];
      if($this.menuButtonPermit.includes('Role_getroledepart')){
        if(row.role_depart){
          if(row.role_depart.indexOf("|")!=-1){
            var departArr = row.role_depart.split("|");
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
            if(row.role_depart.indexOf(",")!=-1){
                var itemData = row.role_depart.split(",");
                var itemArr = []
                itemData.forEach(function(item1,index1){
                  itemArr.push(parseInt(item1));
                });
                departID.push(itemArr);
              }else{
                var itemArr = []
                itemArr.push(parseInt(row.role_depart));
                departID.push(itemArr);
              }
          }
        }
      }
      $this.dialogForm.role_depart = departID;
      $this.dialogForm.f_id = row.f_id;
      $this.dialogForm.id = row.id;
      $this.dialogForm.name = row.name;
      if($this.menuButtonPermit.includes('Role_readdepartwebsite')){
        var websiteDepart = [];
        if(row.readdepartwebsite&&row.readdepartwebsite!=''){
          if(row.readdepartwebsite.indexOf(",")!=-1){
            var idArr = row.readdepartwebsite.split(",");
            idArr.forEach(function(item,index){
              websiteDepart.push(parseInt(item));
            });
          }else{
            websiteDepart = [parseInt(row.readdepartwebsite)];
          }
        }else{
          websiteDepart = [];
        }
        $this.dialogForm.readdepartwebsite = websiteDepart;
      }
      if($this.menuButtonPermit.includes('Role_getwebmsg')){
        var webmsglangauge = [];
        if(row.readwebmsglangauge&&row.readwebmsglangauge!=''){
          if(row.readwebmsglangauge.indexOf(",")!=-1){
            var idArr = row.readwebmsglangauge.split(",");
            idArr.forEach(function(item,index){
              webmsglangauge.push(parseInt(item));
            });
          }else{
            webmsglangauge = [parseInt(row.readwebmsglangauge)];
          }
        }else{
          webmsglangauge = [];
        }
        $this.dialogForm.readwebmsglangauge = webmsglangauge;
        var webmsgbrand = [];
        if(row.readwebmsgbrand&&row.readwebmsgbrand!=''){
          if(row.readwebmsgbrand.indexOf(",")!=-1){
            var idArr = row.readwebmsgbrand.split(",");
            idArr.forEach(function(item,index){
              webmsgbrand.push(parseInt(item));
            });
          }else{
            webmsgbrand = [parseInt(row.readwebmsgbrand)];
          }
        }else{
          webmsgbrand = [];
        }
        $this.dialogForm.readwebmsgbrand = webmsgbrand;
      }
      $this.dialogForm.remarks = row.remarks;
    },
    // 初始化部门下拉框的禁用状态
    resetDisabledRole(data,$this){
      data.forEach(function(item,index){
        item.disabled = false;
        if(item.children.length>0){
          $this.resetDisabledRole(item.children,$this);
        }
      });
    },
    // 部门编辑禁用设置
    disabledRole(data,$this){
      data.forEach(function(item,index){
        item.disabled = true;
        if(item.children.length>0){
          $this.disabledRole(item.children,$this);
        }
      });
    },
    // 部门编辑禁用设置
    disabledSonRole(data,id,fid,$this){
      data.forEach(function(item,index){
        if(item.value == fid){
          item.disabled = true;
          if(item.children.length>0){
            $this.disabledSonRole(item.children,id,fid,$this);
          }
        }
        if(item.value == id){
          item.disabled = true;
          if(item.children.length>0){
            $this.disabledRole(item.children,$this);
          }
        }
      });
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if(!$this.validationForm()){
        return false;
      }
      var formData = {}
      if($this.menuButtonPermit.includes('Role_getroledepart')){
        var departID = [];
        $this.dialogForm.role_depart.forEach(function(item,index){
          var itemData = item.join(",");
          departID.push(itemData);
        });
        var departData = departID.join("|");
        formData.role_depart = departData;
      }
      formData.id = $this.dialogForm.id;
      formData.f_id = Array.isArray($this.dialogForm.f_id)?$this.dialogForm.f_id.length == 0 ? 0 :$this.dialogForm.f_id[$this.dialogForm.f_id.length-1]:$this.dialogForm.f_id;
      formData.name = $this.dialogForm.name;
      if($this.menuButtonPermit.includes('Role_readdepartwebsite')){
        formData.readdepartwebsite = $this.dialogForm.readdepartwebsite;
      }
      formData.remarks = $this.dialogForm.remarks;
      if($this.menuButtonPermit.includes('Role_getwebmsg')){
        formData.readwebmsglangauge = $this.dialogForm.readwebmsglangauge;
        formData.readwebmsgbrand = $this.dialogForm.readwebmsgbrand;
      }
      var pathUrl = "";
      if($this.dialogText=="编辑角色"){
        pathUrl = "role/roleEditAction";
      }else{
        pathUrl = "role/roleAddAction";
      }
      $this.$store.dispatch(pathUrl, formData).then(response=>{
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
            $this.handleClose();
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
      $this.dialogForm.role_depart = [];
      $this.dialogForm.f_id = 0;
      $this.dialogForm.id = 0;
      $this.dialogForm.name = "";
      $this.dialogForm.readdepartwebsite = [];
      $this.dialogForm.remarks = "";
      $this.dialogForm.readwebmsglangauge = [];
      $this.dialogForm.readwebmsgbrand = [];
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.name == ""){
        $this.$message({
            showClose: true,
            message: '错误：角色名称不能为空！',
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
      $this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('role/roleDeleteAction', {id:row.id}).then(response=>{
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
    // 分配权限弹窗
    allotPermit(row,index){
      var $this = this;
      $this.resetPermitData();
      $this.dialogPermitVisible = true;
      $this.permitTitle =  "给 " + row.name + " 分配权限";
      $this.currentRoleID = row.id;
      $this.currentRoleName = row.name;
      $this.getMenuData();
      $this.getRolePermited(row.id);
    },
    // 重置分配权限数据
    resetPermitData(){
      var $this = this;
      $this.currentRoleID = 0;
      $this.currentRoleName = "";
      $this.permitData = [];
      $this.permitValue = [];
      $this.menuTreeData = [];
    },
    // 重置分配用户数据
    resetUserData(){
      var $this = this;
      $this.currentRoleID = 0;
      $this.currentRoleName = "";
      $this.userData = [];
      $this.userValue = [];
    },
    // 分配用户弹窗
    allotUser(row,index){
      var $this = this;
      $this.resetUserData();
      $this.dialogUserVisible = true;
      $this.userTitle = "给 " + row.name + " 分配用户";
      $this.currentRoleID = row.id;
      $this.currentRoleName = row.name;
      $this.getAllotedUser();
      
    },
    // 获取当前角色已分配的用户数据
    getAllotedUser(){
      var $this = this;
      $this.$store.dispatch('role/roleUserAction', {id:$this.currentRoleID}).then(response=>{
        if(response.status){
          var roleUserData = [];
          var selectedRoleUserData = [];
          if(response.data.length>0){
            response.data.forEach(function(item,index){
              var itemData = {};
              var depart = "";
              var postionname = "";
              var workname = "";
              if(item.depart.indexOf("|")!=-1){
                depart = item.depart.split("|")[0];
              }else{
                depart = item.depart;
              }
              if(item.postionname){
                postionname = item.postionname;
              }
              if(item.workname){
                workname = item.workname;
              }
              itemData.key = item.id;
              itemData.label = depart+"-"+postionname+"-"+workname+"-"+item.name;
              itemData.disabled = false;
              roleUserData.push(itemData);
              selectedRoleUserData.push(item.id);
            });
            $this.userData = roleUserData;
            $this.userValue = selectedRoleUserData;
          }
          $this.getAllotingUser();
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 获取登录用户对当前角色可分配的用户数据
    getAllotingUser(){
      var $this = this;
      var userData = [];
      if($this.userData.length>0){
        $this.userData.forEach(function(item,index){
          userData.push(item.key);
        });
      }
      var userDataNow = $this.userData;
      var userIngData = [];
      $this.$store.dispatch('api/getUserAction', null).then(response=>{
        if(response.status){
          if(response.data.length>0){
            if(userDataNow.length>0){
              response.data.forEach(function(item,index){
                userIngData.push(item.id);
              });
              userDataNow.forEach(function(item,index){
                if(userIngData.includes(item.key)){
                  item.disabled = false;
                }else{
                  item.disabled = true;
                }
              });
            }
            response.data.forEach(function(item,index){
              if(!userData.includes(item.id)){
                var itemData = {};
                var depart = "";
                var postionname = "";
                var workname = "";
                if(item.depart.indexOf("|")!=-1){
                  depart = item.depart.split("|")[0];
                }else{
                  depart = item.depart;
                }
                if(item.postionname){
                  postionname = item.postionname;
                }
                if(item.workname){
                  workname = item.workname;
                }
                itemData.key = item.id;
                itemData.label = depart+"-"+postionname+"-"+workname+"-"+item.name;
                itemData.disabled = false;
                userDataNow.push(itemData);
              }
            });
            $this.userData = userDataNow;
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
    // 权限分配保存
    savePermitData(){
      var $this = this;
      var permitPostData = {};
      permitPostData.rid = $this.currentRoleID;
      permitPostData.name = $this.currentRoleName;
      permitPostData.permit = $this.permitValue;
      $this.$store.dispatch('role/rolePermitAction', permitPostData).then(response=>{
        if(response.status){
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'success'
          });
          $this.dialogPermitVisible = false;
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
    // 用户分配保存
    saveUserData(){
      var $this = this;
      var userPostData = {};
      userPostData.rid = $this.currentRoleID;
      userPostData.uid = $this.userValue;
      $this.$store.dispatch('role/roleAllotUserAction', userPostData).then(response=>{
        if(response.status){
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'success'
          });
          $this.dialogUserVisible = false;
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
    handleMenuCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    // 获取当前被选中的树节点数组
    getCheckedKeys() {
        var $this = this;
        var selectedData = $this.$refs.tree.getCheckedKeys();
        var str = selectedData.toString();
        var permitDataNow = [];
        $this.permitData.forEach(function(item,index){
          if($this.permitValue.includes(item.key)){
            permitDataNow.push(item);
          }
        });
        $this.$store.dispatch('api/menuPermitAction', {ids:str}).then(response=>{
          if(response.status){
            if(response.data.length>0){
              response.data.forEach(function(item,index){
                if(!$this.permitValue.includes(item.pid)){
                  var itemData = {};
                  itemData.key = item.pid;
                  itemData.label = item.pname;
                  itemData.disabled = false;
                  permitDataNow.push(itemData);
                }
              });
              $this.permitData = permitDataNow;
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
    // 获取菜单数据
    getMenuData(){
      var $this = this;
      $this.$store.dispatch('api/getRouteAction', null).then(response=>{
        if(response.status){
          if(response.data.length>0){
            var menuData = $this.menuDataToTree(response.data,$this);
            var selectData = [];
            menuData.forEach(function(item,index){
              var itemData = {}
              itemData.id = item.id;
              itemData.label = item.name;
              itemData.children = $this.menuSelectData(item.children,$this);
              selectData.push(itemData);
            });
            $this.menuTreeData = selectData;
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
    // 获取当前角色已拥有的权限数据
    getRolePermited(id){
      var $this = this;
      $this.$store.dispatch('role/rolePermitedAction', {id:id}).then(response=>{
        if(response.status){
          var rolePermitData = [];
          var selectedRolePermitData = [];
          if(response.data.length>0){
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.key = item.pid;
              itemData.label = item.permitname;
              itemData.disabled = false;
              rolePermitData.push(itemData);
              selectedRolePermitData.push(item.pid);
            });
            $this.permitData = rolePermitData;
            $this.permitValue = selectedRolePermitData;
          }
          $this.getUserAllotPermitData();
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 获取当前登录用户可分配的权限数据
    getUserAllotPermitData(){
      var $this = this;
      $this.$store.dispatch('role/rolePermitingAction', null).then(response=>{
        if(response){
          if(response.status){
            if(response.data.length>0){
              var resData = []
              response.data.forEach(function(item,index){
                if(item.permit.length>0){
                  item.permit.forEach(function(item1,index1){
                    resData.push(item1.pid);
                  });
                }
              });
              var permitDataNow = $this.permitData;
              if(permitDataNow.length>0){
                permitDataNow.forEach(function(item,index){
                  if(!resData.includes(item.key)){
                    item.disabled = true;
                  }
                });
              }
              $this.permitData = permitDataNow;
            }
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
    menuSelectData(data,$this){
      var childrenData = [];
      data.forEach(function(item,index){
        var itemData = {};
        itemData.id = item.id;
        itemData.label = item.name;
        itemData.children = $this.menuSelectData(item.children,$this);
        childrenData.push(itemData);
      });
      return childrenData;
    },
    // 树形菜单
    menuDataToTree(data,$this){
        var parents = data.filter(function (item) {
            return item.uid == 0;
        });
        var children = data.filter(function (item) {
            return item.uid != 0;
        });
        $this.menuConvert(parents, children,$this);
        return parents;
    },
    // 树形菜单转化
    menuConvert(parents,children,$this){
      parents.forEach(function (item) {
        item.children = [];
        children.forEach(function (current, index) {
            if (current.uid === item.id) {
                var temp = JSON.parse(JSON.stringify(children));// 将获得的子集json格式化
                temp.splice(index, 1);// 删除子集中已匹配项
                item.children.push(current);
                $this.menuConvert([current], temp,$this);// 递归
            }
        });
      });
    },
    // 获取部门数据
    getDepartList(){
      var $this = this;
      $this.$store.dispatch('user/userCanDepartAction', null).then(response=>{
          if(response.status){
            if(response.data.length>0){
              var departData = $this.departDataToTree(response.data,$this);
              var websiteDepart = [];
              var selectData = [];
              var noDepart = {value:0,label:"无部门网站"}
              websiteDepart.push(noDepart);
              departData.forEach(function(item,index){
                var itemData = {}
                itemData.value = item.id;
                itemData.label = item.name;
                websiteDepart.push(itemData);
                itemData.children = $this.departSelectData(item.children,$this);
                selectData.push(itemData);
              });
              $this.departLevelData = selectData;
              $this.websiteDepart = websiteDepart;
              var webmsglangauge=[];
              response.language.forEach(function(item,index){
                var itemData = {}
                itemData.value = item.id;
                itemData.label = item.languagename;
                webmsglangauge.push(itemData);
              });
              $this.webmsglangauge = webmsglangauge;
              var webmsgbrand=[];
              response.brand.forEach(function(item,index){
                var itemData = {}
                itemData.value = item.id;
                itemData.label = item.brandname;
                webmsgbrand.push(itemData);
              });
              $this.webmsgbrand = webmsgbrand;
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
    // 部门属性菜单转化
    departSelectData(data,$this){
      var childrenData = [];
      data.forEach(function(item,index){
        var itemData = {};
        itemData.value = item.id;
        itemData.label = item.name;
        itemData.children = $this.departSelectData(item.children,$this);
        childrenData.push(itemData);
      });
      return childrenData;
    },
    // 部门树形菜单
    departDataToTree(data,$this){
        var parents = data.filter(function (item) {
            return item.fid == 0;
        });
        var children = data.filter(function (item) {
            return item.fid != 0;
        });
        $this.departConvert(parents, children,$this);
        return parents;
    },
    // 部门树形菜单转化
    departConvert(parents,children,$this){
      parents.forEach(function (item) {
        item.children = [];
        children.forEach(function (current, index) {
            if (current.fid === item.id) {
                var temp = JSON.parse(JSON.stringify(children));// 将获得的子集json格式化
                temp.splice(index, 1);// 删除子集中已匹配项
                item.children.push(current);
                $this.departConvert([current], temp,$this);// 递归
            }
        });
      });
    },
    // 分配权限弹窗
    allotPostPermit(row,index){
      var $this = this;
      $this.resetPostData();
      $this.dialogPostVisible = true;
      $this.postTitle =  "给 " + row.name + " 分配论坛管理权限";
      $this.currentRoleID = row.id;
      $this.currentRoleName = row.name;
      $this.getPostData();
      $this.getRolePostPermited(row.id);
    },
    // 重置分配权限数据
    resetPostData(){
      var $this = this;
      $this.currentRoleID = 0;
      $this.currentRoleName = "";
      $this.postPermitData = [];
      $this.postPermitValue = [];
      $this.postData = [];
    },
    // 论坛管理权限分配保存
    savePostData(){
      var $this = this;
      var permitPostData = {};
      permitPostData.id = $this.currentRoleID;
      permitPostData.typepermitid = $this.postPermitValue;
      $this.$store.dispatch('role/roleAllotPostPermitAction', permitPostData).then(response=>{
        if(response.status){
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'success'
          });
          $this.dialogPostVisible = false;
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
    handlePostCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    // 获取当前被选中的树节点数组
    getPostCheckedKeys() {
        var $this = this;
        var selectedData = $this.$refs.postTree.getCheckedKeys();
        var str = selectedData.toString();
        var postPermitDataNow = [];
        $this.postPermitData.forEach(function(item,index){
          if($this.postPermitValue.includes(item.key)){
            postPermitDataNow.push(item);
          }
        });
        $this.$store.dispatch('role/canAllotPostPermitAction', {ids:str}).then(response=>{
          if(response.status){
            if(response.data.length>0){
              response.data.forEach(function(item,index){
                if(!$this.postPermitValue.includes(item.id)){
                  var itemData = {};
                  itemData.key = item.id;
                  itemData.label = item.permitname;
                  itemData.disabled = false;
                  postPermitDataNow.push(itemData);
                }
              });
              $this.postPermitData = postPermitDataNow;
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
    // 获取论坛栏目数据
    getPostData(){
      var $this = this;
      $this.$store.dispatch('role/userCanAllotPostAction', null).then(response=>{
        if(response){
          if(response.status){
            var menuData = [];
            response.data.forEach(function(item,index){
              if(item.fid != 0){
                menuData.push(item);
              }
            });
            var selectData = [];
            menuData.forEach(function(item,index){
              var itemData = {}
              itemData.id = item.id;
              itemData.label = item.typename;
              selectData.push(itemData);
            });
            $this.postData = selectData;
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
    // 获取当前角色已拥有的论坛栏目权限数据
    getRolePostPermited(id){
      var $this = this;
      $this.$store.dispatch('role/roleAllotedPostPermitAction', {id:id}).then(response=>{
        if(response.status){
          var rolePostPermitData = [];
          var selectedRolePostPermitData = [];
          console.log(response,"已分配权限")
          if(response.data.length>0){
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.key = item.id;
              itemData.label = item.permitname;
              itemData.disabled = false;
              rolePostPermitData.push(itemData);
              selectedRolePostPermitData.push(item.id);
            });
            $this.postPermitData = rolePostPermitData;
            $this.postPermitValue = selectedRolePostPermitData;
          }
          $this.getUserAllotPostPermitData();
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 获取当前登录用户可分配的权限数据
    getUserAllotPostPermitData(){
      var $this = this;
      $this.$store.dispatch('role/userCanAllotPostAllPermitAction', null).then(response=>{
        if(response){
          if(response.status){
            if(response.data.length>0){
              var resData = []
              response.data.forEach(function(item,index){
                resData.push(item.id);
              });
              var postPermitDataNow = $this.postPermitData;
              if(postPermitDataNow.length>0){
                postPermitDataNow.forEach(function(item,index){
                  if(!resData.includes(item.key)){
                    item.disabled = true;
                  }
                });
              }
              $this.postPermitData = postPermitDataNow;
            }
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
    // 重置分配工单数据
    resetWorkOrderData(){
      var $this = this;
      $this.currentRoleID = 0;
      $this.currentRoleName = "";
      $this.workOrderData = [];
      $this.workOrderValue = [];
    },
    // 分配工单权限弹窗
    allotWorkOrderPermit(row,index){
      var $this = this;
      $this.resetWorkOrderData();
      $this.dialogWorkOrderVisible = true;
      $this.workOrderTitle = "给 " + row.name + " 分配工单权限";
      $this.currentRoleID = row.id;
      $this.currentRoleName = row.name;
      $this.getAllotedWorkOrder();
      
    },
    // 获取当前角色已分配的工单权限数据
    getAllotedWorkOrder(){
      var $this = this;
      $this.$store.dispatch('role/roleWorkOrderAction', {id:$this.currentRoleID}).then(response=>{
        console.log(response,"已分配工单权限");
        if(response.status){
          var roleWorkOrderData = [];
          var selectedRoleWorkOrderData = [];
          if(response.data.length>0){
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.key = item.id;
              itemData.label = item.permitname;
              itemData.disabled = false;
              roleWorkOrderData.push(itemData);
              selectedRoleWorkOrderData.push(item.id);
            });
            $this.workOrderData = roleWorkOrderData;
            $this.workOrderValue = selectedRoleWorkOrderData;
          }
          $this.getAllotingWorkOrder();
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 获取登录用户对当前角色可分配的工单权限数据
    getAllotingWorkOrder(){
      var $this = this;
      var workOrderData = [];
      if($this.workOrderData.length>0){
        $this.workOrderData.forEach(function(item,index){
          workOrderData.push(item.key);
        });
      }
      var workOrderDataNow = $this.workOrderData;
      var workOrderIngData = [];
      $this.$store.dispatch('role/getWorkOrderAction', {ids:"1"}).then(response=>{
        console.log(response,"可分配工单权限");
        if(response.status){
          if(response.data.length>0){
            if(workOrderDataNow.length>0){
              response.data.forEach(function(item,index){
                workOrderIngData.push(item.id);
              });
              workOrderDataNow.forEach(function(item,index){
                if(workOrderIngData.includes(item.key)){
                  item.disabled = false;
                }else{
                  item.disabled = true;
                }
              });
            }
            response.data.forEach(function(item,index){
              if(!workOrderData.includes(item.id)){
                var itemData = {};
                itemData.key = item.id;
                itemData.label = item.permitname;
                itemData.disabled = false;
                workOrderDataNow.push(itemData);
              }
            });
            $this.workOrderData = workOrderDataNow;
          }
          $this.getUserAllotWorkOrderPermitData();
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 获取当前登录用户可分配的工单权限数据
    getUserAllotWorkOrderPermitData(){
      var $this = this;
      $this.$store.dispatch('role/userCanAllotWorkOrderAllPermitAction', null).then(response=>{
        if(response){
          if(response.status){
            if(response.data.length>0){
              var resData = []
              response.data.forEach(function(item,index){
                resData.push(item.id);
              });
              var workOrderDataNow = $this.workOrderData;
              if(workOrderDataNow.length>0){
                workOrderDataNow.forEach(function(item,index){
                  if(!resData.includes(item.key)){
                    item.disabled = true;
                  }
                });
              }
              $this.workOrderData = workOrderDataNow;
            }
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
    // 工单权限分配保存
    saveWorkOrderData(){
      var $this = this;
      var workOrderData = {};
      workOrderData.id = $this.currentRoleID;
      workOrderData.typepermitid = $this.workOrderValue;
      $this.$store.dispatch('role/roleAllotWorkOrderAction', workOrderData).then(response=>{
        if(response.status){
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'success'
          });
          $this.dialogWorkOrderVisible = false;
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
         $this.scrollTable.fixedTopHeight = $this.$refs.headerPane.offsetHeight+$this.$refs.breadcrumbPane.offsetHeight+15;
      }else{
         $this.scrollTable.fixedTopHeight=$this.$refs.breadcrumbPane.offsetHeight+15;
      }
      $this.scrollTable.tableHeaderFixedDom = tableHeaderFixedDom;
      if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
         $this.scrollTable.tableFixedRightDom = tableFixedRightDom;
      }
      var fixedHeaderObj = $this.scrollTable.tableHeaderFixedDom.getBoundingClientRect();
      // 获取表格头的高度
      $this.scrollTable.tableheaderHeight = fixedHeaderObj.height;
      if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
         var fixedRightObj = $this.scrollTable.tableFixedRightDom.getBoundingClientRect();
         // 获取右侧固定列的总宽度
         $this.scrollTable.fixedRightWidth = fixedRightObj.width;
      }
      var tableObj = $this.scrollTable.scrollDom.getBoundingClientRect();
      $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+$this.scrollTable.tableheaderHeight+60+15;
      $this.scrollTable.clientHeight = document.documentElement.clientHeight;
      // 头部固定情况下视窗宽高改变，需要重新设置的一些宽高
      if($this.scrollPosition.isFixed){
        var tableHeaderStyle = "width:"+$this.scrollPosition.width+"px;";
        $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
        document.querySelector(".table-mask").style = tableHeaderStyle;
        var tableStyle3 = "width:"+$this.scrollTable.fixedRightWidth+"px;";        
        if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
          document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
        }
        $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+60+15;
      }
    },
    // 竖向滚动条滚动事件
    handleScroll(event){
      var $this = this;
      if(!$this.scrollPosition.isMouseDown&&event.target.className=="scroll-panel"){// 非鼠标按下状态，为竖向滚动条触发的滚动事件
        var scrTop = event.target.scrollTop;
        var tableFixedRightDom = document.querySelector(".SiteTable .el-table__fixed-right");
        if(scrTop>=$this.scrollTable.fixedTopHeight){// 头部需要固定
          $this.scrollPosition.isFixed = true;
          var tableHeaderStyle = "width:"+$this.scrollPosition.width+"px;"
          $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
          document.querySelector(".table-mask").style = tableHeaderStyle;
          var tableStyle1 = "padding-top:"+$this.scrollTable.tableheaderHeight+"px;";
          var tableStyle2 = "top:"+$this.scrollTable.tableheaderHeight+"px;";
          var tableStyle3 = "width:"+$this.scrollTable.fixedRightWidth+"px;";
          document.querySelector(".SiteTable .el-table__body-wrapper").style=tableStyle1;
          
          if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-body-wrapper").style=tableStyle2;
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
          }
        }else{// 头部需要变为正常
          $this.scrollPosition.isFixed = false;
          var tableHeaderStyle = "width:100%";
          $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
          var tableStyle1 = "padding-top:0";
          document.querySelector(".SiteTable .el-table__body-wrapper").style=tableStyle1;
          var tableStyle3 = "width:auto";
          if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
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
