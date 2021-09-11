<template>
  <div class="page-root SaleCard" ref="boxPane">
    <el-card class="box-card" shadow="hover">
      <div slot="header">      
        <div class="card-header SaleCard" v-if="device==='desktop'" ref="headerPane">
            <div class="search-wrap Compart-search-wrap" ref="searchPane">          
                <div class="item-search" style="width:200px;">                              
                      <el-date-picker v-model="searchData.time" format="yyyy 年 MM 月" value-format="yyyy-MM" type="month" size="small" placeholder="选择月"></el-date-picker>
                </div>
                <div class="item-search">
                  <el-button class="item-input" size="small" type="primary" icon="el-icon-search" @click="searchResult">查询</el-button>
                </div>
            </div>
        </div>
        <div class="card-header filter-panel Compart-search-wrap" v-else ref="headerPane">
          <div class="search-panel">
               <el-date-picker v-model="searchData.time" format="yyyy 年 MM 月" value-format="yyyy-MM" type="month" size="small" placeholder="选择月"></el-date-picker>
              <el-button slot="append" @click="searchResult"><span class="search-icon"><svg-icon icon-class="search1" class-name="disabled" /></span></el-button>
          </div>
        </div>
      </div>
      <div class="card-content" ref="tableContent">
            <el-table
                ref="simpleTable"
                :data="tableData"
                tooltip-effect="dark"
                stripe
                class="SiteTable EntableColor"
                style="width: 100%"
                row-key="id"
                >
                <el-table-column
                prop="id"
                label="ID"
                width="50"
                align="center"
                >
                </el-table-column>
                <el-table-column
                prop="deptName"
                label="部门"
                >
                </el-table-column>
                <el-table-column
                prop="mtime"
                label="时间"
                >
                </el-table-column>
                <el-table-column
                prop="level"
                label="等级"
                >
                </el-table-column>
                <el-table-column
                prop="snumber"
                label="成交数量"
                >
                </el-table-column>
                <el-table-column
                prop="score"
                label="几分数"
                >
                </el-table-column>
                <el-table-column
                prop="a_number"
                label="A的数量"
                >
                </el-table-column>
                <el-table-column
                  v-if="(menuButtonPermit.indexOf('Compare_edit')||menuButtonPermit.indexOf('Compare_delete'))&&device==='desktop'"
                  :width="operationsWidth"
                  align="center"
                  fixed="right"
                  prop="operations"
                  label="操作">
                  <template #default="scope">
                    <div class="table-button">
                      <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Compare_edit')">编辑</el-button>
                      <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Compare_delete')" type="info" plain>删除</el-button>
                    </div>
                  </template>
                </el-table-column>
            </el-table>
      </div>
      <div class="pagination-panel" v-if="totalDataNum>15" ref="pagePane">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchData.page"
          :page-sizes="pageSizeList"
          :page-size="searchData.limit"
          :pager-count="pagerCount"
          :layout="device==='mobile'?'prev, pager, next':'total, sizes, prev, pager, next, jumper'"
          :total="totalDataNum">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('Compare_add')||menuButtonPermit.includes('Compare_edit'))&&device==='desktop'" custom-class="add-edit-dialog" :before-close="handleClose" :visible.sync="dialogFormVisible" width="440px">
      <el-form :model="dialogForm">
        <div class="item-form Compart-time-width">
            <el-form-item label="添加时间：" :label-width="formLabelWidth">
                 <el-date-picker v-model="dialogForm.mtime" style="widht:100%" format="yyyy 年 MM 月" value-format="yyyy-MM" type="month" size="small" placeholder="选择月"></el-date-picker>
            </el-form-item>
        </div>
        <div class="item-form Compart-time-width">
            <el-form-item label="部门：" :label-width="formLabelWidth">
                <el-select v-model="dialogForm.dept_id" clearable placeholder="请选择部门">
                    <el-option
                        v-for="item in deptList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="item-form">
            <el-form-item label="等级：" :label-width="formLabelWidth">
                <el-select v-model="dialogForm.level" clearable placeholder="请选择等级">
                    <el-option
                        v-for="item in levelList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="item-form">
            <el-form-item label="成交数量：" :label-width="formLabelWidth">
                <el-input v-model="dialogForm.snumber"></el-input>
            </el-form-item>
        </div>
        <div class="item-form">
            <el-form-item label="积分数：" :label-width="formLabelWidth">
                <el-input v-model="dialogForm.score"></el-input>
            </el-form-item>
        </div>
        <div class="item-form">
            <el-form-item label="A的数量：" :label-width="formLabelWidth">
                <el-input v-model="dialogForm.a_number"></el-input>
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
  name: 'Compare_lists',
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
        dept_id:"",
        mtime:"",
        level:"",
        snumber:"",
        score:"",
        a_number:"",
      },
      pageSizeList:[15,30,60,120],
      totalDataNum:0,
      searchData:{
        page:1,
        limit:15,
        time:"",
      },
      deptList:[],
      levelList:[
        {label:'不及格',value:'不及格'},
        {label:'合格',value:'合格'},
        {label:'中等',value:'中等'},
        {label:'优秀',value:'优秀'},
      ]
    }
  },
  computed: {
    ...mapGetters([
      'device',
      'addCompareList'
    ]),
    isAdd() {
      return this.addCompareList
    }
  },
  mounted(){
      const $this = this;
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
  },
  created(){
    var $this = this;
    $this.initData();
  },
  updated(){
    this.$nextTick(() => {
      this.setTableHeight();
      this.$refs.simpleTable.doLayout();
    })
  },
  methods:{
    // 设置table高度
    setTableHeight(){
      var $this = this;
      if($this.totalDataNum >15){
        if($this.device==="desktop"){
          $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-75;
        }else{
          $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-15;
        }
      }else{
        if($this.device==="desktop"){
          $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-75;
        }else{
          $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-15;
        }
      }
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
      $this.dealData();
    },
    // 搜索点击事件
    searchResult(){
      var $this = this;
      $this.searchData.page = 1;
      $this.initPage();
    },
    // 初始化部门数据
    dealData(){
      var $this = this;
      $this.$store.dispatch('Compare/deparDealListChooseAction', null).then(response=>{
        if(response){
          if(response.status){
            console.log(response,"部门");
            if(response.data.length>0){
                var deptList = [];
                response.data.forEach(function(item,index){
                  var itemData = {};
                  itemData.value = item.id;
                  itemData.label = item.name;
                  deptList.push(itemData);
                });
                $this.deptList = deptList;
            }else{
              $this.deptList=[]
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
    // 重组搜索数据
    restearch(){
      var $this = this;
      var formData = {};
      formData.page = $this.searchData.page;
      formData.limit = $this.searchData.limit;
      if($this.searchData.time&&$this.searchData.time!=''){
        formData.time = $this.searchData.time;
      }
      return formData;
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      var formData = $this.restearch();
      $this.$store.dispatch('Compare/deparDealListAction', formData).then(response=>{
        if(response){
          if(response.status){
            console.log(response,'初始化搜索数据');
            if(response.data.length>0){
                response.data.forEach(function(item){
                   $this.deptList.forEach(function(items){
                     if(item.dept_id==items.value){
                       item.deptName=items.label
                     }
                   });
                });              
                $this.tableData = response.data;
                $this.totalDataNum = response.allcount;
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
            if($this.menuButtonPermit.includes('Compare_lists')){
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('Compare_edit')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('Compare_delete')){
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
    // 关闭添加分类弹窗
    handleClose(){
      var $this = this;
      $this.dialogFormVisible = false;
      $this.$store.dispatch('app/closeCompareList');
    },
    // 添加表格行数据
    addTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "添加部门成交";
      $this.resetFormData();
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "编辑部门成交";
      $this.resetFormData();
      $this.dialogForm.id = row.id;
      $this.dialogForm.dept_id = row.dept_id;
      $this.dialogForm.mtime = row.mtime;
      $this.dialogForm.level = row.level;
      $this.dialogForm.snumber = row.snumber;
      $this.dialogForm.score = row.score;
      $this.dialogForm.a_number = row.a_number;
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if(!$this.validationForm()){
        return false;
      }
      var formData = {}
      if($this.dialogForm.id&&$this.dialogForm.id!=0){
          formData.id = $this.dialogForm.id;
      }
      formData.dept_id = $this.dialogForm.dept_id;
      formData.mtime = $this.dialogForm.mtime;
      formData.level = $this.dialogForm.level;
      formData.snumber = $this.dialogForm.snumber;
      formData.score = $this.dialogForm.score;
      formData.a_number = $this.dialogForm.a_number;
      var pathUrl = "";
      if($this.dialogText=="编辑部门成交"){
        pathUrl = "Compare/deparDealEditAction";
      }else{
        pathUrl = "Compare/deparDealListAddAction";
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
      $this.dialogForm.dept_id = "";
      $this.dialogForm.mtime = "";
      $this.dialogForm.level = "";
      $this.dialogForm.snumber = "";
      $this.dialogForm.score = "";
      $this.dialogForm.a_number = "";
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.mtime == ""){
        $this.$message({
            showClose: true,
            message: '错误：添加时间不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.dialogForm.dept_id == ""){
        $this.$message({
            showClose: true,
            message: '错误：部门不能为空！',
            type: 'error'
        });
        return false;
      }
      return true;
    },
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      $this.$confirm('是否确认删除该产品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('Compare/deparDealDelAction', {id:row.id}).then(response=>{
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
  }
}
</script>
<style lang="scss" scoped>
</style>