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
          >
          <el-table-column
            prop="pushname"
            label="账户名"
            min-width="180"
            >
          </el-table-column>
          <el-table-column
            prop="pushpwd"
            label="账户密码"
            min-width="120"
            >
          </el-table-column>
          <el-table-column
            prop="pushbrand"
            label="品牌"
            width="80"
            :filters="filterBrandList"
            :filter-method="filterBrandHandler"
            >
          </el-table-column>
          <el-table-column
            prop="pushtypename"
            label="渠道"
            min-width="160"
            >
            <template #default="scope">
                <div class="table-tag">
                    <el-tag type="primary" v-for="(item,index) in scope.row.channel" v-bind:key="index">{{item}}</el-tag>
                </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="pushlanguage"
            label="推广语言"
            width="100"
            :filters="filterLanguageList"
            :filter-method="filterLanguageHandler"
            >
          </el-table-column>
          <el-table-column
            prop="uname"
            label="负责人"
            width="150"
            :filters="filterUserList"
            :filter-method="filterUserHandler"
            >
            <template #default="scope">
                <div class="table-tag">
                    <el-tag type="primary" v-for="(item,index) in scope.row.user" v-bind:key="index">{{item}}</el-tag>
                </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="pushphone"
            label="绑定电话"
            width="160"
            >
          </el-table-column>
          <el-table-column
            prop="pushemail"
            label="绑定邮箱"
            min-width="120"
            >
          </el-table-column>
          <!-- <el-table-column
            prop="overmoney"
            label="账户余额"
            min-width="120"
            >
          </el-table-column> -->
          <el-table-column
            prop="pushupdatetime"
            label="更新时间"
            width="180"
            >
          </el-table-column>
          <el-table-column
            prop="pushstatus"
            label="状态"
            width="70"
            :filters="filterStatusList"
            :filter-method="filterStatusHandler"
            >
             <template #default="scope">
                <div class="table-tag">
                    <el-tag type="success" v-if="scope.row.pushstatus==1">在推</el-tag>
                    <el-tag type="warning" v-else-if="scope.row.pushstatus==2">停推</el-tag>
                    <el-tag type="danger" v-else>销户</el-tag>
                </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="(menuButtonPermit.indexOf('Ownpush_pushedit'))&&device==='desktop'"
            :width="operationsWidth"
            align="center"
            fixed="right"
            prop="operations"
            label="操作">
            <template #default="scope">
              <div class="table-button">
                <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Ownpush_pushedit')">编辑</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('Ownpush_pushadd')||menuButtonPermit.includes('Ownpush_pushedit'))&&device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" :before-close="handleClose" width="720px">
      <el-form :model="dialogForm">
        <div class="item-form-group">
          <div class="item-form">
              <el-form-item label="账户名称：" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.pushname" ref="pushname"></el-input>
              </el-form-item>
          </div>
          <div class="item-form">
              <el-form-item label="账户密码：" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.pushpwd" ref="pushpwd"></el-input>
              </el-form-item>
          </div>
        </div>
        <div class="item-form-group">
          <div class="item-form">
              <el-form-item label="绑定电话：" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.pushphone" ref="pushphone"></el-input>
              </el-form-item>
          </div>
          <div class="item-form">
              <el-form-item label="绑定邮箱：" :label-width="formLabelWidth">
                  <el-input v-model="dialogForm.pushemail" ref="pushemail"></el-input>
              </el-form-item>
          </div>
        </div>
        <div class="item-form-group">
          <div class="item-form">
              <el-form-item label="所属品牌：" :label-width="formLabelWidth">
                  <el-select v-model="dialogForm.pushbrand" clearable placeholder="请选择品牌">
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
              <el-form-item label="负责人：" :label-width="formLabelWidth">
                  <el-select v-model="dialogForm.pushuser_id" clearable multiple collapse-tags placeholder="请选择负责人">
                      <el-option
                          v-for="item in userList"
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
              <el-form-item label="账户类型：" :label-width="formLabelWidth">
                  <el-select v-model="dialogForm.pushlanguage" clearable placeholder="请选择账户类型">
                      <el-option
                          v-for="item in languageList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                  </el-select>
              </el-form-item>
          </div>
          <div class="item-form">
              <el-form-item label="账户状态：" :label-width="formLabelWidth">
                  <el-select v-model="dialogForm.pushstatus" clearable placeholder="请选择账户状态">
                      <el-option
                          v-for="item in statusList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                  </el-select>
              </el-form-item>
          </div>
        </div>
        <!-- <div class="item-form">
            <el-form-item label="归属账户：" :label-width="formLabelWidth">
              <el-select v-model="dialogForm.account_id" filterable clearabl placeholder="请选择归属账户">
                  <el-option
                      v-for="item in accountList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
        </div> -->
        <div class="item-form">
            <el-form-item label="所属渠道：" :label-width="formLabelWidth">
              <el-select v-model="dialogForm.pushtype" filterable clearable multiple collapse-tags placeholder="请选择渠道">
                  <el-option
                      v-for="item in channelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
        </div>
        <div class="item-form">
            <el-form-item label="当前余额：" :label-width="formLabelWidth">
                <el-input v-model="dialogForm.overmoney" ref="overmoney"></el-input>
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
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Ownpush_index',
  data() {
    return {
      menuButtonPermit:[],
      operationsWidth:"",
      tableData:[],
      tableHeight:200,
      dialogFormVisible:false,
      dialogText:"",
      formLabelWidth:"110px",
      userList:[],
      channelList:[],
      accountList:[],
      brandList:[
          {label:"红星",value:"红星"},
          {label:"中德",value:"中德"},
          {label:"富特",value:"富特"},
      ],
      languageList:[
          {label:"中文",value:"中文"},
          {label:"英文",value:"英文"},
      ],
      statusList:[
          {label:"在推",value:1},
          {label:"停推",value:2},
          {label:"销户",value:3},
      ],
      dialogForm:{
        id:0,
        pushname:"",
        pushpwd:"",
        pushphone:"",
        pushemail:"",
        pushbrand:"",
        pushuser_id:[],
        pushlanguage:"",
        pushstatus:'',
        pushtype:[],
        overmoney:"",
        // account_id:"",
      },
      filterBrandList:[
        {text:'红星',value:'红星'},
        {text:'中德',value:'中德'},
        {text:'富特',value:'富特'},
      ],
      filterLanguageList:[
        {text:'中文',value:'中文'},
        {text:'英文',value:'英文'},
      ],
      filterUserList:[
        {text:'',value:''}
      ],
      filterStatusList:[
        {text:'在推',value:'在推'},
        {text:'停推',value:'停推'},
        {text:'销户',value:'销户'},
      ],
    }
  },
  computed: {
    ...mapGetters([
      'device',
      'addPromotedAccount'
    ]),
    isAdd() {
      return this.addPromotedAccount
    }
  },
  mounted(){
      const $this = this;
      this.$nextTick(function () {
         if($this.device==="desktop"){
          $this.tableHeight = $this.$refs.boxPane.offsetHeight-30;
        }else{
          $this.tableHeight = $this.$refs.boxPane.offsetHeight;
        }
      });
      window.onresize = () => {
          return (() => {
            if($this.device==="desktop"){
              $this.tableHeight = $this.$refs.boxPane.offsetHeight-30;
            }else{
              $this.tableHeight = $this.$refs.boxPane.offsetHeight;
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
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.$store.dispatch('ownpush/accountListAction', null).then(response=>{
        if(response){
          if(response.status){
              console.log(response);
            if(response.data.length>0){
              var resData = response.data;
              var userArr = [];
              var accountList = [];
              resData.forEach(function(item,index){
                if(!userArr.includes(item.uname)){
                  userArr.push(item.uname);
                }
                var itemData = {};
                itemData.value = item.id;
                itemData.label = item.pushname;
                accountList.push(itemData);
              });
              $this.accountList = accountList;
              var userList = [];
              userArr.forEach(function(item,index){
                var itemData = {};
                itemData.text = item;
                itemData.value = item;
                userList.push(itemData);
              });
              $this.filterUserList = userList;
              response.data.forEach(function(item,index){
                item.overmoney = item.overmoney.toFixed(2);
                item.channel = [];
                if(item.pushtypename&&item.pushtypename!=""){
                  if(item.pushtypename.indexOf("|")!=-1){
                    var channelArr = item.pushtypename.split("|");
                    channelArr.forEach(function(item1,index1){
                      item.channel.push(item1);
                    });
                  }else{
                    item.channel.push(item.pushtypename);
                  }
                }
                item.user = [];
                if(item.uname&&item.uname!=""){
                  if(item.uname.indexOf(",")!=-1){
                    var userArr = item.uname.split(",");
                    userArr.forEach(function(item1,index1){
                      item.user.push(item1);
                    });
                  }else{
                    item.user.push(item.uname);
                  }
                }
              });
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
            if($this.menuButtonPermit.includes('Ownpush_index')){
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('Ownpush_pushedit')){
                operationsWidth+=66;
              }
              $this.operationsWidth = "" + operationsWidth;
              $this.getSelectData();
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
      $this.$store.dispatch('app/closePromotedAccount');
    },
    // 添加表格行数据
    addTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "添加账户";
      $this.resetFormData();
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "编辑账户";
      $this.resetFormData();
      $this.dialogForm.id = row.id;
      $this.dialogForm.pushname = row.pushname;
      $this.dialogForm.pushpwd = row.pushpwd;
      $this.dialogForm.pushphone = row.pushphone;
      $this.dialogForm.pushemail = row.pushemail;
      $this.dialogForm.pushbrand = row.pushbrand;
      $this.dialogForm.pushuser_id = row.pushuser_id;
      $this.dialogForm.pushlanguage = row.pushlanguage;
      $this.dialogForm.pushstatus = row.pushstatus;
      $this.dialogForm.overmoney = row.overmoney;
      // $this.dialogForm.account_id = row.account_id;
      var pushtype = [];
      if(row.pushtype&&row.pushtype!=""){
        if(row.pushtype.indexOf(",")!=-1){
          var channelArr = row.pushtype.split(",");
          channelArr.forEach(function(item,index){
            pushtype.push(parseInt(item));
          });
        }else{
          pushtype.push(parseInt(row.pushtype));
        }
      }
      $this.dialogForm.pushtype = pushtype;
      var pushuser_id = [];
      if(row.pushuser_id&&row.pushuser_id!=""){
        if(row.pushuser_id.indexOf(",")!=-1){
          var userArr = row.pushuser_id.split(",");
          userArr.forEach(function(item,index){
            pushuser_id.push(parseInt(item));
          });
        }else{
          pushuser_id.push(parseInt(row.pushuser_id));
        }
      }
      $this.dialogForm.pushuser_id = pushuser_id;
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if(!$this.validationForm()){
        return false;
      }
      var pathUrl = "";
      if($this.dialogText=="编辑账户"){
        pathUrl = "ownpush/accountEditAction";
      }else{
        pathUrl = "ownpush/accountAddAction";
      }
      $this.$store.dispatch(pathUrl, $this.dialogForm).then(response=>{
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
      $this.dialogForm.id = 0
      $this.dialogForm.pushname = '';
      $this.dialogForm.pushpwd = '';
      $this.dialogForm.pushphone = '';
      $this.dialogForm.pushemail = '';
      $this.dialogForm.pushbrand = '';
      $this.dialogForm.pushuser_id = [];
      $this.dialogForm.pushlanguage = '';
      $this.dialogForm.pushstatus = '';
      $this.dialogForm.overmoney = "";
      $this.dialogForm.pushtype=[]
      // $this.dialogForm.account_id = "";
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.pushname == ""){
        $this.$message({
            showClose: true,
            message: '错误：账户名称不能为空！',
            type: 'error'
        });
        $this.$refs['pushname'].focus();
        return false;
      }
      if($this.dialogForm.pushpwd == ""){
        $this.$message({
            showClose: true,
            message: '错误：账户密码不能为空！',
            type: 'error'
        });
        $this.$refs['pushpwd'].focus();
        return false;
      }
      if($this.dialogForm.pushphone == ""){
        $this.$message({
            showClose: true,
            message: '错误：绑定电话不能为空！',
            type: 'error'
        });
        $this.$refs['pushphone'].focus();
        return false;
      }
      return true;
    },
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      $this.$confirm('是否确认删除该账户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('ownpush/accountDeleteAction', {id:row.id}).then(response=>{
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
    // 获取产品添加编辑是需要的系统数据
    getSelectData(){
      var $this = this;
      $this.$store.dispatch('ownpush/userListAction', null).then(response=>{
          if(response.status){
            console.log(response);
            var userList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              userList.push(itemData);
            });
            $this.userList = userList;
            $this.getChannelData();
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 获取添加数据时的渠道选择数据
    getChannelData(){
      var $this = this;
      $this.$store.dispatch('ownpush/cnChannelListAction', null).then(response=>{
          if(response.status){
            console.log(response);
            var channelList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              channelList.push(itemData);
            });
            $this.channelList = channelList;
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
    filterBrandHandler(value,row,column){
      return row.pushbrand === value;
    },
    filterLanguageHandler(value,row,column){
      return row.pushlanguage === value;
    },
    filterUserHandler(value,row,column){
      return row.uname === value;
    },
    filterStatusHandler(value,row,column){
      return row.pushstatus === value;
    },
    // 获取合计数据
    getSummaries(param) {
      var $this = this;
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (index === 1||index === 6||index === 9||index === 10) {
            sums[index] = '-';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            if(index === 8){
              sums[index] = sums[index].toFixed(2);
            }
          } else {
            sums[index] = '-';
          }
        });
        return sums;
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
