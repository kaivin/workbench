<template>
  <div class="page-root" ref="boxPane">
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <div class="card-header" ref="headerPane">
          <el-button type="primary" size="small" icon="el-icon-refresh" v-on:click="refreshData()">刷新</el-button>
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addTableRow()" v-if="device==='desktop'&&menuButtonPermit.includes('Enphone_productadd')">添加产品</el-button>
        </div>
      </div>
      <div class="search-wrap" ref="searchPane" v-if="device==='desktop'">
        <el-input
          style="width: 200px;margin-right: 10px"
          placeholder="请输入产品名"
          v-model="searchData.name"
          clearable>
        </el-input>
        <el-button class="item-input" type="primary" icon="el-icon-search" @click="searchResult">查询</el-button>
      </div>
      <el-divider v-if="device==='desktop'"><i class="el-icon-goblet-square-full"></i></el-divider>
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
            prop="id"
            label="ID"
            width="50"
            >
          </el-table-column>
          <el-table-column
            prop="name"
            label="产品名"
            min-width="120"
            >
            <template slot-scope="scope">
              <span class="product-span">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="typename"
            label="产品分类"
            min-width="120"
            >
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序"
            width="120"
            >
          </el-table-column>
          <el-table-column
            v-if="(menuButtonPermit.indexOf('Enphone_productedit')||menuButtonPermit.indexOf('Enphone_productdelete'))&&device==='desktop'"
            :width="operationsWidth"
            align="center"
            fixed="right"
            prop="operations"
            label="操作">
            <template #default="scope">
              <div class="table-button">
                <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Enphone_productedit')">编辑</el-button>
                <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Enphone_productdelete')" type="info" plain>删除</el-button>
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
    <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('Enphone_productadd')||menuButtonPermit.includes('Enphone_productedit'))&&device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" width="440px">
      <el-form :model="dialogForm">
        <div class="item-form">
            <el-form-item label="产品名称：" :label-width="formLabelWidth">
                <el-input v-model="dialogForm.name" ref="name"></el-input>
            </el-form-item>
            <el-popover
                placement="left"
                width="200"
                trigger="hover"
                content="产品名称，不可为空">
                <i slot="reference" class="el-icon-s-opportunity"></i>
            </el-popover>
        </div>
        <div class="item-form">
            <el-form-item label="产品分类：" :label-width="formLabelWidth">
                <el-select v-model="dialogForm.typeid" clearable placeholder="请选择分类">
                    <el-option
                        v-for="item in typeList"
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
                content="产品分类，不可为空">
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
                content="产品排序">
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
  name: 'Enphone_productlist',
  data() {
    return {
      menuButtonPermit:[],
      operationsWidth:"",
      tableData:[],
      tableHeight:200,
      dialogFormVisible:false,
      dialogText:"",
      formLabelWidth:"110px",
      levelList:[],
      typeList:[],
      dialogForm:{
        id:0,
        name:"",
        typeid:"",
        productlevel:'',
        sort:"",
      },
      pageSizeList:[15, 30, 50, 100],
      totalDataNum:0,
      searchData:{
          page:1,
          limit:15,
          name:"",
      }
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
        if($this.device === "desktop"){
          $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.searchPane.offsetHeight-$this.$refs.pagePane.offsetHeight-49-30-30-20-3;
          // 49: 分割线高度；30：page-root上下内边距；30：el-card__body上下内边距；20：按钮父级上下内边距；3：上下border
        }else{
          $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-30-30-20-3;
          // 30：page-root上下内边距；30：el-card__body上下内边距；20：按钮父级上下内边距；3：上下border
        }
      });
      window.onresize = () => {
          return (() => {
            if($this.device === "desktop"){
              $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.searchPane.offsetHeight-$this.$refs.pagePane.offsetHeight-49-30-30-20-3;
              // 49: 分割线高度；30：page-root上下内边距；30：el-card__body上下内边距；20：按钮父级上下内边距；3：上下border
            }else{
              $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-30-30-20-3;
              // 30：page-root上下内边距；30：el-card__body上下内边距；20：按钮父级上下内边距；3：上下border
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
      var formData = {};
      formData.page = $this.searchData.page;
      formData.limit = $this.searchData.limit;
      formData.name = $this.searchData.name;
      $this.$store.dispatch('enphone/productListAction', formData).then(response=>{
        if(response){
          if(response.status){
              console.log(response);
            if(response.data.length>0){
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
            if($this.menuButtonPermit.includes('Enphone_productlist')){
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('Enphone_productedit')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('Enphone_productdelete')){
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
      $this.dialogText = "添加产品";
      $this.resetFormData();
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.getSelectData();
      $this.dialogFormVisible = true;
      $this.dialogText = "编辑产品";
      $this.resetFormData();
      $this.dialogForm.id = row.id;
      $this.dialogForm.name = row.name;
      $this.dialogForm.sort = row.sort==0?"":row.sort;
      $this.dialogForm.typeid = row.typeid;
      $this.dialogForm.productlevel = row.productlevel;
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if(!$this.validationForm()){
        return false;
      }
      var formData = {}
      formData.id = $this.dialogForm.id;
      formData.name = $this.dialogForm.name;
      formData.sort = $this.dialogForm.sort;
      formData.typeid = $this.dialogForm.typeid;
      formData.productlevel = $this.dialogForm.productlevel;
      var pathUrl = "";
      if($this.dialogText=="编辑产品"){
        pathUrl = "enphone/productEditAction";
      }else{
        pathUrl = "enphone/productAddAction";
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
      $this.dialogForm.name = "";
      $this.dialogForm.sort = "";
      $this.dialogForm.typeid = "";
      $this.dialogForm.productlevel = "";
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.name == ""){
        $this.$message({
            showClose: true,
            message: '错误：产品名称不能为空！',
            type: 'error'
        });
        $this.$refs['name'].focus();
        return false;
      }
      if($this.dialogForm.typeid == ""){
        $this.$message({
            showClose: true,
            message: '错误：产品分类不能为空！',
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
          $this.$store.dispatch('enphone/productDeleteAction', {id:row.id}).then(response=>{
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
    // 获取产品添加编辑是需要的系统数据
    getSelectData(){
      var $this = this;
      $this.$store.dispatch('enphone/productAddEditDataAction', null).then(response=>{
          if(response.status){
            console.log(response);
            var typeList = [];
            response.type.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              typeList.push(itemData);
            });
            $this.typeList = typeList;
            var levelList = [];
            response.level.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              levelList.push(itemData);
            });
            $this.levelList = levelList;
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
