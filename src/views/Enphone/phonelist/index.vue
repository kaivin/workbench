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
                                >
                                <el-table-column
                                  prop="id"
                                  label="ID"
                                  width="50"
                                  >
                                </el-table-column>
                                <el-table-column
                                  prop="phonenumber"
                                  label="电话"
                                  min-width="160"
                                  >
                                </el-table-column>
                                <el-table-column
                                  prop="departname"
                                  label="部门"
                                  width="120"
                                  >
                                </el-table-column>
                                <el-table-column
                                  prop="brandname"
                                  label="品牌"
                                  width="90"
                                  >
                                </el-table-column>
                                <el-table-column
                                  prop="othername"
                                  label="别名"
                                  min-width="120"
                                  >
                                </el-table-column>
                                <el-table-column
                                  prop="user"
                                  label="负责人"
                                  min-width="160"
                                  >
                                </el-table-column>
                                <el-table-column
                                  prop="sort"
                                  label="排序"
                                  width="80"
                                  >
                                </el-table-column>
                                <el-table-column
                                  v-if="(menuButtonPermit.includes('Enphone_getenphonereadrole')||menuButtonPermit.includes('Enphone_getenphonewriterole')||menuButtonPermit.includes('Enphone_getphonedomain')||menuButtonPermit.indexOf('Enphone_phoneedit')||menuButtonPermit.indexOf('Enphone_phonedelete'))&&device==='desktop'"
                                  :width="operationsWidth"
                                  align="center"
                                  fixed="right"
                                  prop="operations"
                                  label="操作">
                                  <template #default="scope">
                                    <div class="table-button">
                                      <el-button size="mini" @click="allotReadRole(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Enphone_getenphonereadrole')">分配可读角色</el-button>
                                      <el-button size="mini" @click="allotWriteRole(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Enphone_getenphonewriterole')">分配可写角色</el-button>
                                      <el-button size="mini" @click="allotDomain(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Enphone_getphonedomain')">绑定域名</el-button>
                                      <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Enphone_phoneedit')">编辑</el-button>
                                      <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Enphone_phonedelete')" type="info" plain>{{scope.row.is_delete?'激活':'禁用'}}</el-button>
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
    <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('Enphone_phoneadd')||menuButtonPermit.includes('Enphone_phoneedit'))&&device==='desktop'" custom-class="add-edit-dialog" :before-close="handleClose" :visible.sync="dialogFormVisible" width="480px">
      <el-form :model="dialogForm">
        <div class="item-form">
          <el-form-item label="电话号码：" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.phonenumber" ref="phonenumber"></el-input>
          </el-form-item>
        </div>
        <div class="item-form">
          <el-form-item label="品牌：" :label-width="formLabelWidth">
            <el-select v-model="dialogForm.brand_id" clearable placeholder="请选择品牌">
              <el-option
                v-for="item in brandList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item-form">
          <el-form-item label="部门：" :label-width="formLabelWidth">
            <el-select v-model="dialogForm.dept_id" clearable placeholder="请选择部门">
              <el-option
                v-for="item in departList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item-form">
          <el-form-item label="负责人：" :label-width="formLabelWidth">
            <el-select v-model="dialogForm.userid" filterable clearable collapse-tags multiple placeholder="请选择负责人">
              <el-option
                v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item-form">
          <el-form-item label="别名：" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.othername" ref="othername"></el-input>
          </el-form-item>
        </div>
        <div class="item-form">
          <el-form-item label="排序：" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.sort" ref="sort"></el-input>
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
    <el-dialog :title="roleDialogText" v-if="(menuButtonPermit.includes('Enphone_getenphonereadrole')||menuButtonPermit.includes('Enphone_getenphonewriterole'))&&device==='desktop'" custom-class="transfer-dialog" :visible.sync="dialogRoleVisible" width="840px">
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
          <el-button type="primary" @click="saveRoleData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog :title="domainDialogText" v-if="(menuButtonPermit.includes('Enphone_getphonedomain'))&&device==='desktop'" custom-class="transfer-dialog" :visible.sync="dialogDomainVisible" width="840px">
      <div class="transfer-panel">
        <div class="transfer-wrap">
          <el-transfer 
            v-model="domainValue" 
            :data="domainData"
            :titles="['可分配域名', '已分配域名']"
            filterable
            :filter-method="filterDomainMethod"
            filter-placeholder="请输入域名关键字"
          ></el-transfer>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogDomainVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveDomainData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Enphone_phonelist',
  data() {
    return {
      breadcrumbList:[],
      isDelete:true,
      menuButtonPermit:[],
      operationsWidth:"",
      tableData:[],
      tableHeight:200,
      dialogFormVisible:false,
      dialogText:"",
      formLabelWidth:"110px",
      departList:[],
      userList:[],
      brandList:[],
      dialogForm:{
        id:0,
        phonenumber:"",
        userid:[],
        brand_id:"",
        othername:"",
        dept_id:"",
        sort:"",
      },
      dialogRoleVisible:false,
      roleData:[{key:"",label:""}],
      roleValue:[],
      filterRoleMethod(query, item) {
          if(item.label){
            return item.label.indexOf(query) > -1;
          }
      },
      currentID:0,
      isRead:false,
      roleDialogText:"",
      dialogDomainVisible:false,
      domainData:[{key:"",label:""}],
      domainValue:[],
      filterDomainMethod(query, item) {
          if(item.label){
            return item.label.indexOf(query) > -1;
          }
      },
      domainDialogText:"",
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
      'addEnPhone',
      'sidebar',
      'menuData'
    ]),
    isOpen() {
      return this.sidebar.opened;
    },
    isAdd() {
      return this.addEnPhone
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
    // 设置高度
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
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.$store.dispatch('enphone/phoneListAction', null).then(response=>{
        if(response){
          if(response.status){
              console.log(response);
            if(response.data.length>0){
              $this.tableData = response.data;
            }else{
              $this.tableData = [];
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
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            console.log(res.data,"操作权限")
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Enphone_phonelist')){
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('Enphone_getenphonereadrole')){
                operationsWidth+=114;
              }
              if($this.menuButtonPermit.includes('Enphone_getenphonewriterole')){
                operationsWidth+=114;
              }
              if($this.menuButtonPermit.includes('Enphone_getphonedomain')){
                operationsWidth+=90;
              }
              if($this.menuButtonPermit.includes('Enphone_phoneedit')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('Enphone_phonedelete')){
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
    // 关闭添加电话弹窗
    handleClose(){
      var $this = this;
      $this.dialogFormVisible = false;
      $this.$store.dispatch('app/closeEnPhone');
    },
    // 添加表格行数据
    addTableRow(row,index){
      var $this = this;
      $this.getSelectData();
      $this.dialogFormVisible = true;
      $this.dialogText = "添加电话";
      $this.resetFormData();
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.getSelectData();
      $this.dialogFormVisible = true;
      $this.dialogText = "编辑电话";
      $this.resetFormData();
      var userID = [];
      if(row.userid){
        if(row.userid.indexOf(",")!=-1){
          var userArr = row.userid.split(",");
          userArr.forEach(function(item,index){
            userID.push(parseInt(item));
          });
        }else{
          userID.push(parseInt(row.userid));
        }
      }
      $this.dialogForm.id = row.id;
      $this.dialogForm.phonenumber = row.phonenumber;
      $this.dialogForm.userid = userID;
      $this.dialogForm.brand_id = row.brand_id;
      $this.dialogForm.othername = row.othername;
      $this.dialogForm.dept_id = row.dept_id;
      $this.dialogForm.sort = row.sort==0?'':row.sort;
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if(!$this.validationForm()){
        return false;
      }
      var formData = {}
      formData.id = $this.dialogForm.id;
      formData.phonenumber = $this.dialogForm.phonenumber;
      formData.userid = $this.dialogForm.userid;
      formData.brand_id = $this.dialogForm.brand_id;
      formData.othername = $this.dialogForm.othername;
      formData.dept_id = $this.dialogForm.dept_id;
      formData.sort = $this.dialogForm.sort;
      var pathUrl = "";
      if($this.dialogText=="编辑电话"){
        pathUrl = "enphone/phoneEditAction";
      }else{
        pathUrl = "enphone/phoneAddAction";
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
          }
      });
    },
    // 重置添加数据表单
    resetFormData(){
      var $this = this;
      $this.dialogForm.id = 0;
      $this.dialogForm.userid = [];
      $this.dialogForm.phonenumber = "";
      $this.dialogForm.brand_id = "";
      $this.dialogForm.othername = "";
      $this.dialogForm.dept_id = "";
      $this.dialogForm.sort = "";
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.phonenumber == ""){
        $this.$message({
            showClose: true,
            message: '错误：电话不能为空！',
            type: 'error'
        });
        $this.$refs['phonenumber'].focus();
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
      $this.$confirm('是否确认'+tips+'该电话?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('enphone/phoneDeleteAction', {id:row.id}).then(response=>{
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
            message: '已取消'+tips
          });          
      });
    },
    // 获取电话添加编辑是需要的系统数据
    getSelectData(){
      var $this = this;
      $this.$store.dispatch('enphone/phoneAddEditDataAction', null).then(response=>{
          if(response.status){
            console.log(response);
            var departList = [];
            response.depart.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              departList.push(itemData);
            });
            $this.departList = departList;
            var userList = [];
            response.user.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name+"["+item.id+"]";
              userList.push(itemData);
            });
            $this.userList = userList;
            var brandList = [];
            response.brand.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.brandname;
              brandList.push(itemData);
            });
            $this.brandList = brandList;
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 可读权限分配角色弹窗
    allotReadRole(row,index){
      var $this = this;
      $this.roleData= [];
      $this.roleValue=[];
      $this.dialogRoleVisible = true;
      $this.currentID = row.id;
      $this.isRead = true;
      $this.roleDialogText="给 "+row.phonenumber+" 分配可读角色";
      $this.getAllotedReadRole();
    },
    // 可写权限分配角色弹窗
    allotWriteRole(row,index){
      var $this = this;
      $this.roleData= [];
      $this.roleValue=[];
      $this.dialogRoleVisible = true;
      $this.currentID = row.id;
      $this.isRead = false;
      $this.roleDialogText="给 "+row.phonenumber+" 分配可写角色";
      $this.getAllotedWriteRole();
    },
    // 角色分配保存
    saveRoleData(){
        var $this = this;
        var rolePhoneData = {};
        rolePhoneData.enphone_id = $this.currentID;
        rolePhoneData.role_id = $this.roleValue;
        var pathUrl = "";
        if($this.isRead){
          pathUrl = "enphone/phoneAllotReadRoleAction";
        }else{
          pathUrl = "enphone/phoneAllotWriteRoleAction";
        }
        $this.$store.dispatch(pathUrl, rolePhoneData).then(response=>{
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
            $this.dialogRoleVisible = false;
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
    // 获取当前字段可读权限已分配的角色数据
    getAllotedReadRole(){
      var $this = this;
      $this.$store.dispatch('enphone/phoneAllotedReadRoleAction', {enphone_id:$this.currentID}).then(response=>{
        console.log(response);
        if(response.status){
          var roleUserData = [];
          var selectedRoleUserData = [];
          if(response.data.length>0){
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.key = item.rid;
              itemData.label = item.pathname;
              itemData.disabled = false;
              roleUserData.push(itemData);
              selectedRoleUserData.push(item.rid);
            });
          }
          $this.roleData = roleUserData;
          $this.roleValue = selectedRoleUserData;
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
    // 获取当前字段可写权限已分配的角色数据
    getAllotedWriteRole(){
      var $this = this;
      $this.$store.dispatch('enphone/phoneAllotedWriteRoleAction', {enphone_id:$this.currentID}).then(response=>{
        console.log(response);
        if(response.status){
          var roleUserData = [];
          var selectedRoleUserData = [];
          if(response.data.length>0){
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.key = item.rid;
              itemData.label = item.pathname;
              itemData.disabled = false;
              roleUserData.push(itemData);
              selectedRoleUserData.push(item.rid);
            });
          }
          $this.roleData = roleUserData;
          $this.roleValue = selectedRoleUserData;
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
    // 电话绑定域名弹窗
    allotDomain(row,index){
      var $this = this;
      $this.domainData= [];
      $this.domainValue=[];
      $this.dialogDomainVisible = true;
      $this.currentID = row.id;
      $this.domainDialogText="给 "+row.phonenumber+" 绑定域名";
      $this.getAllotedDomain();
    },
    // 电话绑定域名保存
    saveDomainData(){
        var $this = this;
        var domainPhoneData = {};
        domainPhoneData.phoneid = $this.currentID;
        domainPhoneData.domain_id = $this.domainValue;
        $this.$store.dispatch("enphone/phoneAllotDomainAction", domainPhoneData).then(response=>{
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
            $this.dialogDomainVisible = false;
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
    // 获取当前电话已绑定的域名
    getAllotedDomain(){
      var $this = this;
      $this.$store.dispatch('enphone/phoneAllotedDomainAction', {phoneid:$this.currentID}).then(response=>{
        console.log(response);
        if(response.status){
          var phoneDomainData = [];
          var selectedPhoneDomainData = [];
          if(response.data.length>0){
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.key = item.id;
              itemData.label = item.domain;
              itemData.disabled = false;
              phoneDomainData.push(itemData);
              selectedPhoneDomainData.push(item.id);
            });
          }
          $this.domainData = phoneDomainData;
          $this.domainValue = selectedPhoneDomainData;
          $this.getAllotingDomain();
        }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 获取当前登录用户可操作的域名
    getAllotingDomain(){
      var $this = this;
      var domainData = [];
      if($this.domainData.length>0){
        $this.domainData.forEach(function(item,index){
          domainData.push(item.key);
        });
      }
      var domainDataNow = $this.domainData;
      var domainIngData = [];
      $this.$store.dispatch('enphone/userCanAllotDomainAction', {phoneid:$this.currentID}).then(response=>{
        if(response.status){
          if(response.data.length>0){
            if(domainDataNow.length>0){
              response.data.forEach(function(item,index){
                domainIngData.push(item.id);
              });
              domainDataNow.forEach(function(item,index){
                item.disabled = false;
              });
            }
            response.data.forEach(function(item,index){
              if(!domainData.includes(item.id)){
                var itemData = {};
                itemData.key = item.id;
                itemData.label = item.domain;
                itemData.disabled = false;
                domainDataNow.push(itemData);
              }
            });
            $this.domainData = domainDataNow;
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
