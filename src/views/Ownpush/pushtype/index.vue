<template>
  <div class="page-root" ref="boxPane">
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <div class="card-header" ref="headerPane">
          <el-button type="primary" size="small" icon="el-icon-refresh" v-on:click="refreshData()">刷新</el-button>
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addTableRow()" v-if="device==='desktop'&&menuButtonPermit.includes('Ownpush_pushtypeadd')">添加渠道</el-button>
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
          >
            <el-table-column
                type="index"
                label="序号"
                width="50">
            </el-table-column>
            <el-table-column
                prop="name"
                label="渠道名"
                min-width="120"
                >
            </el-table-column>
            <el-table-column
                v-if="(menuButtonPermit.indexOf('Ownpush_pushtypeedit'))&&device==='desktop'"
                :width="operationsWidth"
                align="center"
                fixed="right"
                prop="operations"
                label="操作">
                <template #default="scope">
                <div class="table-button">
                    <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Ownpush_pushtypeedit')">编辑</el-button>
                </div>
                </template>
            </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('Ownpush_pushtypeadd')||menuButtonPermit.includes('Ownpush_pushtypeedit'))&&device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" width="480px">
      <el-form :model="dialogForm">
        <div class="item-form">
            <el-form-item label="渠道名称：" :label-width="formLabelWidth">
                <el-input v-model="dialogForm.name" ref="name"></el-input>
            </el-form-item>
            <el-popover
                placement="left"
                width="200"
                trigger="hover"
                content="渠道名称，不可为空">
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
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Ownpush_pushtype',
  data() {
    return {
      menuButtonPermit:[],
      operationsWidth:"",
      tableData:[],
      tableHeight:200,
      dialogFormVisible:false,
      dialogText:"",
      formLabelWidth:"110px",
      dialogForm:{
        id:0,
        name:"",
      },
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
      $this.$store.dispatch('ownpush/cnChannelListAction', null).then(response=>{
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
            if($this.menuButtonPermit.includes('Ownpush_pushtype')){
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('Ownpush_pushtypeedit')){
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
      $this.dialogFormVisible = true;
      $this.dialogText = "添加渠道";
      $this.resetFormData();
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "编辑渠道";
      $this.resetFormData();
      $this.dialogForm.id = row.id;
      $this.dialogForm.name = row.name;
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if(!$this.validationForm()){
        return false;
      }
      var pathUrl = "";
      if($this.dialogText=="编辑渠道"){
        pathUrl = "ownpush/cnChannelEditAction";
      }else{
        pathUrl = "ownpush/cnChannelAddAction";
      }
      $this.$store.dispatch(pathUrl, $this.dialogForm).then(response=>{
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
      $this.dialogForm.id = 0
      $this.dialogForm.name = '';
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.name == ""){
        $this.$message({
            showClose: true,
            message: '错误：渠道名称不能为空！',
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
      $this.$confirm('是否确认删除该渠道?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('ownpush/cnChannelDeleteAction', {id:row.id}).then(response=>{
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
  }
}
</script>
<style lang="scss" scoped>
.item-form.icon{
  padding-right: 76px;
}

.item-form-group {
  width: 100%;
  &:before,
  &:after {
    content: "";
    display: table;
  }
  &:after {
    clear: both;
  }
  .item-form {
    width: 50%;
    float: left;
  }
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
  .el-table{
    svg,i[class~="el-cion"]{
      font-size: 20px;
    }
  }
  .el-select{
      display: block;
  }
  .product-span{
      i{
          font-style: normal;
          font-weight: bold;
      }
      &.level_1{
          i{color:#B3315F};
      }
      &.level_2{
          i{
              color: #130CB7;
          }
      }
      &.level_3{
          i{
              color: #6a6a6b;
          }
      }
  }
</style>
