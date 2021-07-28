<template>
  <div class="page-root" ref="boxPane">
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <div class="card-header" ref="headerPane">
          <el-button type="primary" size="small" icon="el-icon-refresh" v-on:click="refreshData()">刷新</el-button>
          <el-button type="primary" size="small" icon="el-icon-search" @click="openSearchDialog()" v-if="device==='mobile'">高级查询</el-button>
        </div>
      </div>
      <div class="search-wrap" ref="searchPane" v-if="device==='desktop'">
        <el-date-picker
            class="date-picker"
            v-model="searchData.date"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <el-input
            style="width: 190px;margin: 0 10px"
            placeholder="请输入真实姓名关键字"
            v-model="searchData.uname"
            clearable>
        </el-input>
        <el-select v-model="searchData.action" filterable clearable placeholder="请选择操作动作" style="width:190px;margin-right: 10px">
            <el-option
                v-for="item in actionList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
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
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
          <el-table-column
            prop="user"
            label="操作者"
            min-width="200"
            >
          </el-table-column>
          <el-table-column
            prop="actionname"
            label="操作动作"
            min-width="180"
            >
          </el-table-column>
          <el-table-column
            prop="action_url"
            label="链接"
            min-width="180"
            >
          </el-table-column>
          <el-table-column
            prop="createtime"
            label="操作时间"
            width="160"
            >
          </el-table-column>
          <el-table-column
            prop="login_ip"
            label="登录ip"
            width="130"
            >
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
    <el-dialog title="高级查询" v-if="device==='mobile'" custom-class="search-dialog block-search" :visible.sync="dialogSearchVisible">
      <div class="search-dialog-wrap">
        <div class="item-search">
          <el-date-picker
              v-model="searchData.startDate"
              popper-class="new-date"
              type="datetime"
              placeholder="选择开始时间"
              value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </div>
        <div class="item-search">
          <el-date-picker
              v-model="searchData.endDate"
              popper-class="new-date"
              type="datetime"
              placeholder="选择结束时间"
              value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </div>
        <div class="item-search">
          <el-input
              placeholder="请输入真实姓名关键字"
              v-model="searchData.uname"
              clearable>
          </el-input>
        </div>
        <div class="item-search">
          <el-select v-model="searchData.action" filterable clearable placeholder="请选择操作动作">
              <el-option
                  v-for="item in actionList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
          </el-select>
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
import { mapGetters } from 'vuex'
export default {
  name: 'Logs_index',
  data() {
    return {
      menuButtonPermit:[],
      tableData:[],
      tableHeight:200,
      searchData:{
          uname:"",
          page:1,
          limit:50,
          action:"",
          date:"",
          startDate:"",
          endDate:""
      },
      pageSizeList:[50, 100, 150, 200],
      totalDataNum:0,
      actionList:[],
      dialogSearchVisible:false
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
  methods:{
    // 刷新数据
    refreshData(){
      this.resetSearchData();
      this.initPage();
    },
    // 移动端查询弹窗事件
    openSearchDialog(){
      var $this = this;
      $this.dialogSearchVisible = true;
      $this.resetSearchData();
    },
    // 搜索点击事件
    searchResult(){
      var $this = this;
      $this.searchData.page = 1;
      var isSearch = true;
      if($this.device==="mobile"){
        if(($this.searchData.startDate==""&&$this.searchData.endDate!="")||($this.searchData.startDate!=""&&$this.searchData.endDate=="")){
          isSearch = false;
        }else{
          if($this.searchData.startDate!=""&&$this.searchData.endDate!=""){
            if(!$this.compareDate($this.searchData.startDate,$this.searchData.endDate)){
              isSearch = false;
            }
          }
        }
      }
      if(!isSearch){
        if($this.searchData.startDate==""&&$this.searchData.endDate!=""){
          $this.$alert('结束时间不为空时开始时间不能为空', '警告', {
            confirmButtonText: '确定',
          });
        }
        if($this.searchData.startDate!=""&&$this.searchData.endDate==""){
          $this.$alert('开始时间不为空时结束时间不能为空', '警告', {
            confirmButtonText: '确定',
          });
        }
        if($this.searchData.startDate!=""&&$this.searchData.endDate!=""){
          $this.$alert('开始时间不能大于结束时间', '警告', {
            confirmButtonText: '确定',
          });
        }
        return false;
      }
      $this.initData();
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
      formData.limit = $this.searchData.limit;
      formData.uname = $this.searchData.uname;
      var action = "";
      $this.actionList.forEach(function(item,index){
          if(item.value==$this.searchData.action){
            action = item.label;
          }
      });
      formData.action = action;
      if($this.device === "mobile"){
        formData.starttime = $this.searchData.startDate;
        formData.endtime = $this.searchData.endDate;
      }else{
        if($this.searchData.date!=''){
          formData.starttime = $this.searchData.date[0];
          formData.endtime = $this.searchData.date[1];
        }else{
          formData.starttime = "";
          formData.endtime = "";
        }
      }
      $this.$store.dispatch('logs/logsListAction', formData).then(response=>{
          if(response){
            if(response.status){
              if(response.data){
                $this.tableData = response.data;
                $this.totalDataNum = response.allcount;
                if($this.device==="mobile"){
                  $this.dialogSearchVisible = false;
                }
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
        console.log(res);
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Logs_index')){
              $this.getActionList();
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
    // 获取所有操作动作数据
    getActionList(){
        var $this = this;
        $this.$store.dispatch('logs/logsActionAction', null).then(response=>{
          if(response){
            if(response.status){
              if(response.data.length>0){
                  var actionList = [];
                  response.data.forEach(function(item,index){
                      var itemData = {};
                      itemData.value = item.action_route;
                      itemData.label = item.name;
                      actionList.push(itemData);
                  });
                  $this.actionList = actionList;
              }
              $this.initPage();
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
            }
          }
      });
    },
    // 重置搜索数据
    resetSearchData(){
      var $this = this;
      $this.searchData.uname = "";
      $this.searchData.page = 1;
      $this.searchData.limit = 50;
      $this.searchData.action = "";
      $this.searchData.date = "";
      $this.searchData.startDate = "";
      $this.searchData.endDate = "";
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
    // 比较两个时间的先后
    compareDate(date1,date2){
      var oDate1 = new Date(date1);
      var oDate2 = new Date(date2);
      if(oDate1.getTime() > oDate2.getTime()){
          return false;
      }else{
          return true;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .page-root{
    ::v-deep .search-dialog{
      height: 370px!important;
    }
  }
  .date-picker{
    vertical-align: top;
  }
</style>
