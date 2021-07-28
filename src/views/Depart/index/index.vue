<template>
  <div class="page-root" ref="boxPane">
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <div class="card-header" ref="headerPane">
          <el-button type="primary" size="small" icon="el-icon-refresh" v-on:click="refreshData()">刷新</el-button>
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addTableRow()" v-if="(menuButtonPermit.includes('Depart_add'))&&device==='desktop'">添加部门</el-button>
        </div>
      </div>
      <div class="card-content" ref="tableContent">
        <el-table
          border
          ref="simpleTable"
          :data="tableData"
          tooltip-effect="dark"
          stripe
          style="width: 100%"
          :height="tableHeight"
          row-key="id"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
          <el-table-column
            prop="name"
            label="部门名称"
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
            v-if="(menuButtonPermit.includes('Depart_getdepartrole')||menuButtonPermit.includes('Depart_add')||menuButtonPermit.includes('Depart_edit')||menuButtonPermit.includes('Depart_delete'))&&device==='desktop'"
            :width="operationsWidth"
            align="center"
            fixed="right"
            prop="operations"
            label="操作">
            <template #default="scope">
              <div class="table-button">
                <el-button size="mini" @click="allotRole(scope.row,scope.$index)" v-if="scope.row.is_usering==0&&menuButtonPermit.includes('Depart_getdepartrole')&&scope.row.fid==0">分配角色</el-button>
                <el-button size="mini" @click="addTableRow(scope.row,scope.$index)" v-if="scope.row.is_usering==0&&menuButtonPermit.includes('Depart_add')">添加子部门</el-button>
                <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="scope.row.is_usering==0&&menuButtonPermit.includes('Depart_edit')">编辑</el-button>
                <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="scope.row.is_usering==0&&menuButtonPermit.includes('Depart_delete')" type="info" plain>删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('Depart_add')||menuButtonPermit.includes('Depart_edit'))&&device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" width="480px">
      <el-form :model="dialogForm">
        <div class="item-form">
          <el-form-item label="父级部门：" :label-width="formLabelWidth" v-if="departLevelData.length>0">
            <el-cascader v-model="dialogForm.fid" :options="departLevelData" ref="menuLevel" filterable placeholder="请选择父级部门" :props="{ checkStrictly: true,expandTrigger: 'hover' }" clearable></el-cascader>
          </el-form-item>
          <el-popover
            placement="left"
            width="200"
            trigger="hover"
            content="可为空，为空则为根节点部门">
            <i slot="reference" class="el-icon-s-opportunity"></i>
          </el-popover>
        </div>
        <div class="item-form">
          <el-form-item label="部门名称：" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.name" ref="name"></el-input>
          </el-form-item>
          <el-popover
            placement="left"
            width="200"
            trigger="hover"
            content="部门显示名称，不可为空">
            <i slot="reference" class="el-icon-s-opportunity"></i>
          </el-popover>
        </div>
        <div class="item-form">
            <el-form-item label="备注：" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="dialogForm.remarks" :autosize="{ minRows: 2, maxRows: 4}" ref="remarks"></el-input>
            </el-form-item>
            <el-popover
              placement="left"
              width="200"
              trigger="hover"
              content="部门备注">
              <i slot="reference" class="el-icon-s-opportunity"></i>
            </el-popover>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="分配角色" v-if="(menuButtonPermit.includes('Depart_getdepartrole'))&&device==='desktop'" custom-class="user-dialog" :visible.sync="dialogRoleVisible" width="840px">
      <div class="user-role">
        <div class="role-wrap">
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
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
export default {
  name: 'departIndex',
  data() {
    return {
      menuButtonPermit:[],
      operationsWidth:"",
      tableData:[],
      tableHeight:200,
      dialogFormVisible:false,
      dialogText:"",
      formLabelWidth:"110px",
      departLevelData:[],
      dialogForm:{
        fid:0,
        id:0,
        name:"",
        remarks:"",
      },
      dialogRoleVisible:false,
      roleData:[{key:"",label:""}],
      roleValue:[],
      filterRoleMethod(query, item) {
          if(item.label){
            return item.label.indexOf(query) > -1;
          }
      },
      currentDepartID:0,
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
        $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-30-30-20-3;
        // 49: 分割线高度；30：page-root上下内边距；30：el-card__body上下内边距；20：按钮父级上下内边距；3：上下border
      });
      window.onresize = () => {
          return (() => {
            $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-30-30-20-3;
            // 49: 分割线高度；30：page-root上下内边距；30：el-card__body上下内边距；20：按钮父级上下内边距；3：上下border
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
    // 刷新数据
    refreshData(){
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
      $this.$store.dispatch('depart/departListAction', null).then(response=>{
        if(response){
          if(response.status){
            if(response.data.length>0){
              $this.tableData = $this.dataToTree(response.data,$this);
              var selectData = [];
              $this.tableData.forEach(function(item,index){
                var itemData = {}
                itemData.value = item.id;
                itemData.label = item.name;
                itemData.is_usering = item.is_usering;
                itemData.disabled = item.disabled;
                itemData.children = $this.selectData(item.children,$this);
                selectData.push(itemData);
              });
              $this.departLevelData = selectData;
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
    selectData(data,$this){
      var childrenData = [];
      data.forEach(function(item,index){
        var itemData = {};
        itemData.value = item.id;
        itemData.label = item.name;
        itemData.is_usering = item.is_usering;
        itemData.disabled = item.disabled;
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
        if(item.is_usering == 0){
            item.disabled = false;
          }else{
            item.disabled = true;
          }
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
        console.log(res);
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Depart_index')){
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('Depart_add')){
                operationsWidth+=102;
              }
              if($this.menuButtonPermit.includes('Depart_edit')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('Depart_delete')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('Depart_getdepartrole')){
                operationsWidth+=90;
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
    // 添加表格行数据
    addTableRow(row,index){
      this.dialogFormVisible = true;
      this.dialogText = "添加部门";
      this.resetFormData();
      if(row){
        this.dialogForm.fid = row.id;
      }
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "编辑部门";
      var departLevelData = $this.departLevelData;
      departLevelData.forEach(function(item,index){
        if(item.is_usering==0){
          item.disabled = false;
        }else{
          item.disabled = true;
        }
        if(item.children.length>0){
          $this.resetDisabledDepart(item.children,$this);
        }
      });
      departLevelData.forEach(function(item,index){
        if(row.fid == 0){
          if(item.value == row.id){
            item.disabled = true;
            if(item.children.length>0){
              $this.disabledDepart(item.children,$this);
            }
          }
        }else{
          if(item.children.length>0){
            $this.disabledSonDepart(item.children,row.id,row.fid,$this);
          }
        }
      });
      $this.departLevelData = departLevelData;
      $this.dialogForm.fid = row.fid;
      $this.dialogForm.id = row.id;
      $this.dialogForm.name = row.name;
      $this.dialogForm.remarks = row.remarks;
    },
    // 初始化部门下拉框的禁用状态
    resetDisabledDepart(data,$this){
      data.forEach(function(item,index){
        if(item.is_usering==0){
          item.disabled = false;
        }else{
          item.disabled = true;
        }
        if(item.children.length>0){
          $this.resetDisabledDepart(item.children,$this);
        }
      });
    },
    // 部门编辑禁用设置
    disabledDepart(data,$this){
      data.forEach(function(item,index){
        item.disabled = true;
        if(item.children.length>0){
          $this.disabledDepart(item.children,$this);
        }
      });
    },
    // 部门编辑禁用设置
    disabledSonDepart(data,id,fid,$this){
      data.forEach(function(item,index){
        if(item.value == fid){
          item.disabled = true;
          if(item.children.length>0){
            $this.disabledSonDepart(item.children,id,fid,$this);
          }
        }
        if(item.value == id){
          item.disabled = true;
          if(item.children.length>0){
            $this.disabledDepart(item.children,$this);
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
      formData.id = $this.dialogForm.id;
      formData.fid = Array.isArray($this.dialogForm.fid)?$this.dialogForm.fid.length == 0 ? 0 :$this.dialogForm.fid[$this.dialogForm.fid.length-1]:$this.dialogForm.fid;
      formData.name = $this.dialogForm.name;
      formData.remarks = $this.dialogForm.remarks;
      var pathUrl = "";
      if($this.dialogText=="编辑部门"){
        pathUrl = "depart/departEditAction";
      }else{
        pathUrl = "depart/departAddAction";
      }
      $this.$store.dispatch(pathUrl, formData).then(response=>{
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
      $this.dialogForm.fid = 0;
      $this.dialogForm.id = 0;
      $this.dialogForm.name = "";
      $this.dialogForm.remarks = "";
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.name == ""){
        $this.$message({
            showClose: true,
            message: '错误：部门名称不能为空！',
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
      $this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('depart/departDeleteAction', {id:row.id}).then(response=>{
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
    // 分配角色弹窗
    allotRole(row,index){
      var $this = this;
      $this.currentDepartID = 0;
      $this.roleData= [];
      $this.roleValue=[];
      $this.dialogRoleVisible = true;
      $this.currentDepartID = row.id;
      $this.getAllotedRole();
    },
    // 角色分配保存
    saveRoleData(){
        var $this = this;
        var rolePostData = {};
        rolePostData.id = $this.currentDepartID;
        rolePostData.role_id = $this.roleValue;
        $this.$store.dispatch('depart/departAllotRoleAction', rolePostData).then(response=>{
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
      $this.$store.dispatch('depart/departAllotedRoleAction', {id:$this.currentDepartID}).then(response=>{
        if(response.status){
          console.log(response,"已分配")
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
      $this.$store.dispatch('depart/departCanAllotRoleAction', null).then(response=>{
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
  }
}
</script>
<style lang="scss" scoped>
  .el-tabs{
    display: flex;
    height: 480px;
    overflow: hidden;
    flex-direction: column;
    .grid {
      position: relative;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }

    .icon-item {
      margin: 10px;
      padding: 10px;
      border-radius: 4px;
      height: 105px;
      text-align: center;
      width: 100px;
      float: left;
      font-size: 30px;
      color: #24292e;
      cursor: pointer;
      &.is-active{
        background: #f2f2f2;
      }
    }

    span {
      display: block;
      font-size: 16px;
      margin-top: 10px;
    }

    .disabled {
      pointer-events: none;
    }
  }
  .el-cascader{
      width:100%;
  }
  .form-title{
    width: 110px;
    display: inline-block;
    text-align: right;
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    line-height: 36px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  .item-form.icon{
    padding-right: 76px;
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
  .el-table{
    svg,i[class~="el-cion"]{
      font-size: 20px;
    }
  }
  .user-role{
    width: 100%;
    overflow: hidden;
    height: 400px;
    .role-wrap{
      width: 100%;
      float:right;
      height: 100%;
      overflow: hidden;
      .el-transfer{
          height: 100%;
          overflow: hidden;
          ::v-deep .el-transfer-panel{
            width: 352px!important;
            height: 100%!important;
            .el-checkbox__label{
              position: static;
            }
            .el-transfer-panel__body{
              height: 360px!important;
              overflow: hidden;
              .el-transfer-panel__list.is-filterable{
                height: 298px!important;
              }
            }
          }
          ::v-deep .el-transfer__buttons{
          padding: 0 20px!important;
          width: 96px;
          margin-left:0!important;
          margin-right:0!important;
          .el-button + .el-button{
            margin-left:0!important;
          }
        }
      }
    }
  }
</style>
