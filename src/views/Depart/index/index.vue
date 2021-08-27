<template>
  <div class="page-root" ref="boxPane">
    <el-card class="box-card" shadow="hover">
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
    <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('Depart_add')||menuButtonPermit.includes('Depart_edit'))&&device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" :before-close="handleClose" width="480px">
      <el-form :model="dialogForm">
        <div class="item-form">
          <el-form-item label="父级部门：" :label-width="formLabelWidth" v-if="departLevelData.length>0">
            <el-cascader v-model="dialogForm.fid" :options="departLevelData" ref="menuLevel" filterable placeholder="请选择父级部门" :props="{ checkStrictly: true,expandTrigger: 'hover' }" clearable></el-cascader>
          </el-form-item>
        </div>
        <div class="item-form">
          <el-form-item label="部门名称：" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.name" ref="name"></el-input>
          </el-form-item>
        </div>
        <div class="item-form">
            <el-form-item label="备注：" :label-width="formLabelWidth">
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
    <el-dialog title="分配角色" v-if="(menuButtonPermit.includes('Depart_getdepartrole'))&&device==='desktop'" custom-class="transfer-dialog" :visible.sync="dialogRoleVisible" width="840px">
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
      'device',
      'addDepart'
    ]),
    isAdd() {
      return this.addDepart
    }
  },
  mounted(){
      const $this = this;
      this.$nextTick(function () {
        $this.tableHeight = $this.$refs.boxPane.offsetHeight-30;
      });
      window.onresize = () => {
          return (() => {
            $this.tableHeight = $this.$refs.boxPane.offsetHeight-30;
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
    // 关闭添加部门弹窗
    handleClose(){
      var $this = this;
      $this.dialogFormVisible = false;
      $this.$store.dispatch('app/closeDepart');
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
</style>
