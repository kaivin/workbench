<template>
  <div class="page-root white-ip" ref="boxPane">
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <div class="card-header" ref="headerPane">
          <div class="search-wrap" ref="searchPane" v-if="device==='desktop'">
            <div class="item-search">
                <el-input
                    class="input-panel"
                    size="small"
                    placeholder="请输入IP"
                    v-model="ip"
                    clearable>
                </el-input>
            </div>
            <div class="item-search">
              <el-button class="item-input" type="primary" size="small" icon="el-icon-search" @click="searchResult">查询</el-button>
            </div>
            <div class="item-search">
              <el-button class="item-input" :disabled="isDisabled" type="primary" size="small" @click="deleteTableRow">批量删除</el-button>
            </div>
          </div>
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
            @selection-change="handleSelectionChange"
            >
            <el-table-column
                type="selection"
                align="center"
                width="48">
            </el-table-column>
          <el-table-column
            prop="id"
            label="ID"
            width="80"
            >
          </el-table-column>
          <el-table-column
            prop="ip"
            label="IP"
            min-width="200"
            >
          </el-table-column>
          <el-table-column
            v-if="(menuButtonPermit.includes('Webmsg_editip')||menuButtonPermit.includes('Webmsg_ipdelete'))&&device==='desktop'"
            :width="operationsWidth"
            align="center"
            fixed="right"
            prop="operations"
            label="操作">
            <template #default="scope">
              <div class="table-button">
                <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Webmsg_editip')">编辑</el-button>
                <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Webmsg_ipdelete')" type="info" plain>删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-panel" ref="pagePane">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="pageSizeList"
          :page-size="limit"
          :layout="device==='mobile'?'sizes, jumper':'total, sizes, prev, pager, next, jumper'"
          :total="totalDataNum">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('Webmsg_addip')||menuButtonPermit.includes('Webmsg_editip'))&&device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" :before-close="handleClose" width="480px">
      <el-form :model="dialogForm">
        <div class="item-form">
          <el-form-item label="IP白名单：" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="dialogForm.ip" placeholder="多个ip用|分隔" ref="ip" v-if="dialogForm.id==0"></el-input>
            <el-input v-model="dialogForm.ip" ref="ip" v-else></el-input>
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
  name: 'webmsg_whiteip',
  data() {
    return {
        ip:"",
        page:1,
        limit:20,
        pageSizeList:[20, 50, 100, 200],
        totalDataNum:0,
        menuButtonPermit:[],
        tableData:[],
        tableHeight:200,
        operationsWidth:"160",
        dialogFormVisible:false,
        dialogText:"",
        formLabelWidth:"110px",
        dialogForm:{
            id:0,
            ip:"",
        },
        isDisabled:true,
        selectedData:[]
    }
  },
  computed: {
    ...mapGetters([
      'device',
      'addWebMsgIp'
    ]),
    isAdd() {
      return this.addWebMsgIp
    }
  },
  mounted(){
      const $this = this;
      this.$nextTick(function () {
        $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-30-30-15;
      });
      window.onresize = () => {
          return (() => {
            $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-30-30-15;
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
      // 查询结果
      searchResult(){
          var $this = this;
          $this.initPage();
      },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
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
            if(!$this.menuButtonPermit.includes('Webmsg_whiteip')){
              $this.$message({
                showClose: true,
                message: "未被分配该页面的访问权限",
                type: 'error',
                duration:6000
              });
              $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            }else{
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('Webmsg_editip')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('Webmsg_ipdelete')){
                operationsWidth+=66;
              }
              $this.operationsWidth = "" + operationsWidth;
              $this.initPage();
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
    // 页面初始化
    initPage(){
      var $this = this;
      var searchData = {};
      searchData.page = $this.page;
      searchData.limit = $this.limit;
      searchData.ip = $this.ip;
      $this.$store.dispatch('webmsg/webMsgWhiteIpListAction', searchData).then(response=>{
        if(response){
          if(response.status){
            console.log(response.data)
            $this.totalDataNum = response.allcount;
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
    // 关闭添加电话弹窗
    handleClose(){
      var $this = this;
      $this.dialogFormVisible = false;
      $this.$store.dispatch('app/closeWebMsgIp');
    },
    // 添加表格行数据
    addTableRow(row,index){
      this.dialogFormVisible = true;
      this.dialogText = "添加IP白名单";
      this.resetFormData();
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "修改IP";
      $this.dialogForm.id = row.id;
      $this.dialogForm.ip = row.ip;
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if(!$this.validationForm()){
        return false;
      }
      var formData = {}
      formData.id = $this.dialogForm.id;
      formData.ip = $this.dialogForm.ip;
      var pathUrl = "";
      if($this.dialogText=="修改IP"){
        pathUrl = "webmsg/webMsgWhiteIpEditAction";
      }else{
        pathUrl = "webmsg/webMsgWhiteIpAddAction";
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
      $this.dialogForm.ip = "";
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.ip == ""){
        $this.$message({
            showClose: true,
            message: '错误：白名单不能为空！',
            type: 'error'
        });
        return false;
      }
      return true;
    },
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      var resultData = {};
      resultData.id =[];
      if(row.id){
          resultData.id = [row.id];
      }else{
          if($this.selectedData.length>0){
              $this.selectedData.forEach(function(item,index){
                  resultData.id.push(item.id);
              });
          }
      }
      if(resultData.id.length>0){
        $this.$confirm(' 是否删除该IP?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            $this.$store.dispatch('webmsg/webMsgWhiteIpDeleteAction', resultData).then(response=>{
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
      }
    },
    // 每页显示条数改变事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val;
      this.initPage();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.initPage();
    },
    // 表格多选改变事件
    handleSelectionChange(val) {
        var $this = this;
        $this.selectedData = val;
        console.log(val);
        if($this.selectedData.length>0){
          $this.isDisabled = false;
        }else{
          $this.isDisabled = true;
        }
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
