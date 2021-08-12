<template>
  <div class="page-root user-index" ref="boxPane">
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <div class="card-header" ref="headerPane">
          <div class="search-wrap" ref="searchPane" v-if="device==='desktop'">
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
                clearable>
              </el-input>
            </div>
            <div class="item-search">
              <el-button class="item-input" type="primary" size="small" icon="el-icon-search" @click="searchResult">查询</el-button>
            </div>
          </div>
          <el-button type="primary" size="small" icon="el-icon-search" @click="openSearchDialog()" v-if="device==='mobile'">高级查询</el-button>
        </div>
      </div>
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
            min-width="180"
            >
          </el-table-column>
          <el-table-column
            prop="login_ip"
            label="最近登录IP"
            width="130"
            >
          </el-table-column>
          <el-table-column
            prop="login_time"
            label="最近登录时间"
            width="160"
            >
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="备注"
            min-width="220"
            >
          </el-table-column>
          <el-table-column
            v-if="(menuButtonPermit.includes('User_getrole')||menuButtonPermit.includes('User_resetpwd')||menuButtonPermit.indexOf('User_edit')||menuButtonPermit.indexOf('User_delete'))&&device==='desktop'"
            :width="operationsWidth"
            align="center"
            fixed="right"
            prop="operations"
            label="操作">
            <template #default="scope">
              <div class="table-button">
                <el-button size="mini" @click="allotRole(scope.row,scope.$index)" v-if="menuButtonPermit.includes('User_getrole')">分配角色</el-button>
                <el-button size="mini" @click="resetPassword(scope.row,scope.$index)" v-if="menuButtonPermit.includes('User_resetpwd')">重置密码</el-button>
                <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('User_edit')">编辑</el-button>
                <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('User_delete')&&scope.row.is_delete==1" type="info" plain>启用</el-button>
                <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('User_delete')&&scope.row.is_delete==0" type="info" plain>禁用</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-panel" ref="pagePane">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchData.page"
          :page-sizes="pageSizeList"
          :page-size="searchData.limit"
          :layout="device==='mobile'?'sizes, jumper':'total, sizes, prev, pager, next, jumper'"
          :total="totalDataNum">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('User_add')||menuButtonPermit.includes('User_edit'))&&device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" :before-close="handleClose" width="680px">
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
            <el-form-item label="部门：" :label-width="formLabelWidth" v-if="departLevelData.length>0">
              <el-cascader v-model="dialogForm.deptid_othername" :options="departLevelData" ref="departLevel" placeholder="请选择部门" :props="{ checkStrictly: true,expandTrigger: 'hover',multiple:true }" :collapse-tags="true" clearable></el-cascader>
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
          <el-button type="primary" @click="saveData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="分配角色" v-if="(menuButtonPermit.includes('User_getrole'))&&device==='desktop'" custom-class="transfer-dialog" :visible.sync="dialogRoleVisible" width="840px">
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
          <el-button type="primary" @click="saveAddRoleData" v-if="dialogFormVisible">确 定</el-button>
          <el-button type="primary" @click="saveRoleData" v-else>确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="高级查询" v-if="device==='mobile'" custom-class="search-dialog block-search" :visible.sync="dialogSearchVisible">
      <div class="search-dialog-wrap">
        <div class="item-search">
          <el-select v-model="searchData.is_delete" clearable placeholder="请选择用户状态">
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
            placeholder="请输入真实姓名关键字"
            v-model="searchData.uname"
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
import { validEmail,validPhone } from '@/utils/validate';
import { mapGetters } from 'vuex'
export default {
  name: 'userIndex',
  data() {
    return {
      menuButtonPermit:[],
      operationsWidth:"",
      tableData:[],
      tableHeight:200,
      searchData:{
          uname:"",
          page:1,
          limit:10,
          dept_id:0,
          is_delete:"",
      },
      userStatus:[
        {label:"激活用户",value:0},
        {label:"封禁用户",value:1}
      ],
      pageSizeList:[10, 20, 50, 100],
      totalDataNum:0,
      dialogFormVisible:false,
      dialogText:"",
      formLabelWidth:"110px",
      departLevelData:[],
      worknameList:[],
      postionList:[],
      dialogForm:{
        deptid_othername:[],
        role_id:[],
        id:0,
        name:"",
        remarks:"",
        phone:"",
        email:"",
        postion_id:"",
        workname_id:""
      },
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
      dialogSearchVisible:false
    }
  },
  computed: {
    ...mapGetters([
      'device',
      'addUser'
    ]),
    isAdd() {
      return this.addUser
    }
  },
  mounted(){
      const $this = this;
      this.$nextTick(function () {
        if($this.device === "desktop"){
          $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-40-20;
        }else{
          $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-40-20;
        }
      });
      window.onresize = () => {
          return (() => {
            if($this.device === "desktop"){
              $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-40-20;
            }else{
              $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-40-20;
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
      isAdd(e){
        if(e){
          this.addTableRow();
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
    // 移动端查询弹窗事件
    openSearchDialog(){
      var $this = this;
      $this.dialogSearchVisible = true;
      $this.resetSearchData();
    },
    // 搜索点击事件
    searchResult(){
      this.searchData.page = 1;
      this.initPage();
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
            if($this.device === "mobile"){
              $this.dialogSearchVisible = false;
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
            console.log(res.data,"操作权限")
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
      $this.dialogFormVisible = true;
      $this.dialogText = "添加用户";
      $this.resetFormData();
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.getWorkNameList();
      $this.getPostionNameList();
      $this.dialogFormVisible = true;
      $this.dialogText = "编辑用户";
      $this.resetFormData();
      console.log(row);
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
      $this.dialogForm.postion_id = row.postion_id==0?'':row.postion_id;
      $this.dialogForm.workname_id = row.workname_id==0?'':row.workname_id;
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if(!$this.validationForm()){
        return false;
      }
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
      formData.deptid_othername = departData;
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
          }
      });
    },
    // 重置搜索数据
    resetSearchData(){
      var $this = this;
      $this.searchData.uname = "";
      $this.searchData.page = 1;
      $this.searchData.limit = 10;
      $this.searchData.dept_id = 0;
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
      $this.dialogForm.postion_id = "";
      $this.dialogForm.workname_id = "";
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
      if($this.dialogForm.phone != ""){
        if(!validPhone($this.dialogForm.phone)){
          $this.$message({
              showClose: true,
              message: '错误：手机号格式不正确！',
              type: 'error'
          });
          $this.$refs['phone'].focus();
          return false;
        }
      }
      if($this.dialogForm.email != ""){
        if(!validEmail($this.dialogForm.email)){
          $this.$message({
              showClose: true,
              message: '错误：邮箱格式不正确！',
              type: 'error'
          });
          $this.$refs['email'].focus();
          return false;
        }
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
            message: '已取消'+tips
          });          
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
        $this.dialogForm.role_id = $this.roleValue;
        $this.dialogRoleVisible = false;
    },
    // 角色分配保存
    saveRoleData(){
        var $this = this;
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
          }
        });
    },
    // 获取当前用户已分配的角色数据
    getAllotedRole(){
      var $this = this;
      $this.$store.dispatch('user/userAllotedRoleAction', {id:$this.currentUserID}).then(response=>{
        if(response.status){
          console.log(response,"已分配")
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
          console.log(response,"可分配")
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
      console.log(`每页 ${val} 条`);
      this.searchData.limit = val;
      this.initPage();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.searchData.page = val;
      this.initPage();
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
  }
}
</script>
<style lang="scss" scoped>
</style>
