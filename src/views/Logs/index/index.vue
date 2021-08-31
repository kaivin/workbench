<template>
  <div class="page-root logs-index" ref="boxPane">
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <div class="card-header" v-if="device==='desktop'" ref="headerPane">
          <div class="search-wrap" ref="searchPane">
            <div class="item-search">
              <el-date-picker
                  class="date-picker"
                  size="small"
                  v-model="searchData.date"
                  type="datetimerange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
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
              <el-select v-model="searchData.action" size="small" filterable clearable placeholder="请选择操作动作" class="select-panel">
                  <el-option
                      v-for="item in actionList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
              </el-select>
            </div>
            <div class="item-search">
              <el-button class="item-input" type="primary" size="small" icon="el-icon-search" @click="searchResult">查询</el-button>
            </div>
          </div>
        </div>
        <div class="card-header filter-panel" v-else ref="headerPane">
            <div class="search-panel">                              
              <el-select v-model="searchData.action" size="small" @change="actionChangeHandler" style="display:block;" filterable clearable placeholder="请选择操作动作">
                <el-option
                    v-for="item in actionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </div>
            <span class="filter-button" v-on:click="searchDialog()">筛选<i class="svg-i"><svg-icon icon-class="filter" class-name="disabled" /></i></span>
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
      <div class="pagination-panel" v-if="totalDataNum>50" ref="pagePane">
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
    <div class="mobile-filter-mask" v-bind:class="openClass?'open':''" v-if="device!=='desktop'" v-on:click="searchDialog()"></div>
    <div class="mobile-filter-dialog flex-box flex-column" v-bind:class="openClass?'open':''" v-if="device!=='desktop'">
      <div class="flex-content">
        <div class="abs-scroll">
          <ul>
            <li>
              <div class="item-li">
                <span class="title-panel">开始时间</span>
                <div class="item-filter">
                  <el-date-picker
                    v-model="searchData.startDate"
                    size="small"
                    type="datetime"
                    placeholder="选择开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </div>
              </div>
              <div class="item-li">
                <span class="title-panel">结束时间</span>
                <div class="item-filter">
                  <el-date-picker
                    v-model="searchData.endDate"
                    size="small"
                    type="datetime"
                    placeholder="选择结束时间"
                    value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </div>
              </div>
              <div class="item-li">
                <span class="title-panel">真实姓名</span>
                <div class="item-filter">
                  <el-input
                      placeholder="请输入真实姓名关键字"
                      size="small"
                      v-model="searchData.uname"
                      clearable>
                  </el-input>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <p class="footer-button"><span class="btn-yes" v-on:click="searchResult()">确定</span></p>
    </div>
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
      pagerCount:5,
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
      dialogSearchVisible:false,
      openClass:false,
    }
  },
  computed: {
    ...mapGetters([
      'device'
    ]),
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
  updated(){
    var $this = this;
    $this.$nextTick(() => {
      $this.setTableHeight();
    });
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
    // 高级筛选
    searchDialog(){
      var $this = this;
      $this.openClass=!$this.openClass;
    },
    // 设置table高度
    setTableHeight(){
      var $this = this;
      if($this.totalDataNum >50){
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
      $this.initPage();
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
                  $this.openClass = false;
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
                var permitList = [];
                  var actionList = [];
                  response.data.forEach(function(item,index){
                    if(!permitList.includes(item.action_route)){
                      var itemData = {};
                      itemData.value = item.action_route;
                      itemData.label = item.name;
                      actionList.push(itemData);
                      permitList.push(item.action_route);
                    }
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
    },
    // 选择动作切换事件
    actionChangeHandler(e){
      var $this = this;
      console.log(e);
      $this.searchResult();
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
