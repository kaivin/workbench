<template>
  <div class="page-root" ref="boxPane">
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <div class="card-header" ref="headerPane">
          <el-button type="primary" size="small" icon="el-icon-refresh" v-on:click="refreshData()">刷新</el-button>
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addTableRow()" v-if="device==='desktop'&&menuButtonPermit.includes('Enphone_phoneadd')">添加电话</el-button>
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
          style="width: 100%"
          :height="tableHeight"
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
            prop="typename"
            label="分类"
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
    </el-card>
    <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('Enphone_phoneadd')||menuButtonPermit.includes('Enphone_phoneedit'))&&device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" width="480px">
      <el-form :model="dialogForm">
        <div class="item-form">
          <el-form-item label="电话号码：" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.phonenumber" ref="phonenumber"></el-input>
          </el-form-item>
          <el-popover
            placement="left"
            width="200"
            trigger="hover"
            content="座机或手机号，不可为空">
            <i slot="reference" class="el-icon-s-opportunity"></i>
          </el-popover>
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
          <el-popover
            placement="left"
            width="200"
            trigger="hover"
            content="电话所属推广品牌">
            <i slot="reference" class="el-icon-s-opportunity"></i>
          </el-popover>
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
          <el-popover
            placement="left"
            width="200"
            trigger="hover"
            content="电话归属的部门">
            <i slot="reference" class="el-icon-s-opportunity"></i>
          </el-popover>
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
          <el-popover
            placement="left"
            width="200"
            trigger="hover"
            content="电话具体负责人">
            <i slot="reference" class="el-icon-s-opportunity"></i>
          </el-popover>
        </div>
        <div class="item-form">
          <el-form-item label="别名：" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.othername" ref="othername"></el-input>
          </el-form-item>
          <el-popover
            placement="left"
            width="200"
            trigger="hover"
            content="无具体负责人时，作为显示使用">
            <i slot="reference" class="el-icon-s-opportunity"></i>
          </el-popover>
        </div>
        <div class="item-form">
          <el-form-item label="排序：" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.sort" ref="sort"></el-input>
          </el-form-item>
          <el-popover
            placement="left"
            width="200"
            trigger="hover"
            content="电话列表中可进行排序">
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
    <el-dialog :title="roleDialogText" v-if="(menuButtonPermit.includes('Enphone_getenphonereadrole')||menuButtonPermit.includes('Enphone_getenphonewriterole'))&&device==='desktop'" custom-class="user-dialog" :visible.sync="dialogRoleVisible" width="840px">
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
    <el-dialog :title="domainDialogText" v-if="(menuButtonPermit.includes('Enphone_getphonedomain'))&&device==='desktop'" custom-class="user-dialog" :visible.sync="dialogDomainVisible" width="840px">
      <div class="user-role">
        <div class="role-wrap">
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
      });
      window.onresize = () => {
          return (() => {
              $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-30-30-20-3;
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
      $this.$store.dispatch('enphone/phoneListAction', null).then(response=>{
        if(response){
          if(response.status){
              console.log(response);
            if(response.data.length>0){
              $this.tableData = response.data;
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
            $this.dialogFormVisible = false;
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
              itemData.label = item.name;
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
      $this.$store.dispatch('enphone/userCanAllotDomainAction', null).then(response=>{
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
  }
}
</script>
<style lang="scss" scoped>
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
.el-select{
  display: block;
}
</style>
