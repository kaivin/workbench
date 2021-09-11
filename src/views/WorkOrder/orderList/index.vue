<template>
    <div class="page-root flex-box no-padding work-order-index" ref="boxPane">
        <div class="sub-router">
            <el-scrollbar wrap-class="scrollbar-wrapper">
                <ul class="sub-router-list">
                    <li v-if="menuButtonPermit.includes('Worksaccpet_waitwork')" v-bind:class="currentStatus === 'receive'?'active':''" v-on:click="jumpLink('receive')"><span>待接收</span><b>({{defaultData.receiveNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Worksaccpet_waitdealwork')" v-bind:class="currentStatus === 'allot'?'active':''" v-on:click="jumpLink('allot')"><span>待分配</span><b>({{defaultData.allotNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Worksaccpet_allwork')" v-bind:class="currentStatus === 'alloted'?'active':''" v-on:click="jumpLink('alloted')"><span>所有已分配</span><b>({{defaultData.allotedNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Worksaccpet_personwork')" v-bind:class="currentStatus === 'person'?'active':''" v-on:click="jumpLink('person')" style="margin-top:32px;"><span>个人已分配</span><b>({{defaultData.personNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Worksaccpet_makeingwork')" v-bind:class="currentStatus === 'doing'?'active':''" v-on:click="jumpLink('doing')"><span>进行中</span><b>({{defaultData.doingNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Worksaccpet_hasfinish')" v-bind:class="currentStatus === 'done'?'active':''" v-on:click="jumpLink('done')"><span>已完成</span><b>({{defaultData.doneNum}})</b></li>
                    <li v-if="menuButtonPermit.includes('Worksaccpet_workcount')" v-bind:class="currentStatus === 'stat'?'active':''" v-on:click="jumpLink('stat')" style="margin-top:32px;"><span>数据统计</span></li>
                </ul>
            </el-scrollbar>
        </div>
        <div class="flex-content relative">
            <div class="abs-panel" ref="mainPane">
                <div class="scroll-panel">
                  <div class="true-height" ref="scrollPane">
                    <el-card class="box-card scroll-card" shadow="hover">
                        <div slot="header" v-if="currentStatus=='person'||currentStatus=='alloted'||currentStatus=='doing'||currentStatus=='done'||currentStatus=='stat'">
                            <div class="card-header" ref="headerPane">
                                <div class="search-wrap">
                                    <div class="item-search" style="width:150px;" v-if="currentStatus!='stat'">
                                        <el-select v-model="searchData.timetype" size="small" clearable placeholder="请选择时间类型">
                                            <el-option
                                                v-for="item in timeTypeList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="item-search" style="width: 240px;">
                                      <el-date-picker
                                          v-model="searchData.date"
                                          class="date-range"
                                          type="daterange"
                                          align="right"
                                          value-format = "yyyy-MM-dd"
                                          unlink-panels
                                          range-separator="至"
                                          start-placeholder="开始日期"
                                          end-placeholder="结束日期"
                                          size="small"
                                          :picker-options="pickerRangeOptions">
                                      </el-date-picker>
                                    </div>
                                    <div class="item-search">
                                        <el-button class="item-input" size="small" type="primary" icon="el-icon-search" @click="searchResult">查询</el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-content" ref="tableContent">
                            <el-table
                                ref="simpleTable"
                                key="a"
                                :data="tableData"
                                tooltip-effect="dark"
                                stripe
                                class="SiteTable"
                                style="width: 100%"
                                :height="minHeight"
                                row-key="id"
                                v-if="currentStatus=='stat'"
                                >
                                <el-table-column
                                    prop="name"
                                    label="姓名"
                                    width="100">
                                </el-table-column>
                                <el-table-column
                                    prop="depart"
                                    align="left"
                                    label="部门"
                                    width="160"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="departgroup"
                                    align="left"
                                    label="小组"
                                    min-width="160"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="workingcount"
                                    label="进行中工单数"
                                    width="150"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="finishcount"
                                    label="已完成工单数"
                                    width="150"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="outtimecount"
                                    label="已逾期工单数"
                                    width="150"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="allcount"
                                    label="总工单数"
                                    width="150"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="hasscore"
                                    label="已获得积分"
                                    width="120"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="allscorre"
                                    label="总积分"
                                    width="120"
                                    >
                                </el-table-column>
                            </el-table>
                            <el-table
                                ref="simpleTable"
                                key="b"
                                :data="tableData"
                                tooltip-effect="dark"
                                stripe
                                class="SiteTable"
                                style="width: 100%"
                                :height="minHeight"
                                row-key="id"
                                v-else
                                >
                                <el-table-column
                                    prop="username"
                                    label="发布人"
                                    width="100">
                                </el-table-column>
                                <el-table-column
                                    prop="title"
                                    label="工单标题"
                                    min-width="200"
                                    >
                                    <template slot-scope="scope">
                                      <div class="order-title" v-bind:class="scope.row.worktimestatus==2?'time-out':''" v-on:click="jumpArticle(scope.row.id)">
                                        <span>{{scope.row.title}}</span><strong v-if="scope.row.worktimestatus==2">已逾期</strong>
                                      </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="tags"
                                    align="left"
                                    label="标签"
                                    width="160"
                                    >
                                    <template #default="scope">
                                        <div class="table-tag">
                                        <el-tag :style="{background:item.color,borderColor:item.color,color:'#ffffff'}" size="small" v-for="(item,index) in scope.row.tagList" v-bind:key="index">{{item.tag}}</el-tag>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="addtime"
                                    label="开始时间"
                                    width="150"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="endtime"
                                    label="截止时间"
                                    width="150"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="status"
                                    label="工单状态"
                                    width="80"
                                    >
                                    <template #default="scope">
                                      <div class="table-tag">
                                        <el-tag size="small" type="success" v-if="currentStatus == 'receive'">待接单</el-tag>
                                        <el-tag size="small" type="success" v-if="currentStatus == 'allot'">待分配</el-tag>
                                        <el-tag size="small" type="success" v-if="currentStatus != 'allot'&&scope.row.workstatus == 0">进行中</el-tag>
                                        <el-tag size="small" type="primary" v-if="scope.row.workstatus == 1">审核中</el-tag>
                                        <el-tag size="small" type="warning" v-if="scope.row.workstatus == 2">已驳回</el-tag>
                                        <el-tag size="small" type="success" v-if="scope.row.workstatus == 3">已完成</el-tag>
                                      </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="orgscore"
                                    label="总积分"
                                    width="80"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="receivescore"
                                    label="已认领积分"
                                    width="100"
                                    >
                                    <template slot-scope="scope">
                                        <span>{{currentStatus=='receive'?scope.row.receivescore:scope.row.score}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    v-if="currentStatus=='receive'"
                                    prop="ownScore"
                                    label="认领积分"
                                    width="90">
                                    <template slot-scope="scope">
                                        <div class="table-input">
                                            <el-input size="small" v-model="scope.row.ownScore"></el-input>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    v-if="currentStatus=='allot'"
                                    prop="ownScore"
                                    label="负责人"
                                    width="120">
                                    <template slot-scope="scope">
                                        <div class="table-input">
                                            <el-select v-model="scope.row.dealuserid" size="small" clearable placeholder="负责人">
                                              <el-option
                                                  v-for="item in userList"
                                                  :key="item.value"
                                                  :label="item.label"
                                                  :value="item.value">
                                              </el-option>
                                          </el-select>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    v-if="(menuButtonPermit.includes('Worksaccpet_confirmwork')||menuButtonPermit.includes('Worksaccpet_confirmdeal')||menuButtonPermit.includes('Worksaccpet_backwork')||menuButtonPermit.includes('Worksaccpet_confirmfinish')||menuButtonPermit.includes('Worksaccpet_workcancel'))&&device==='desktop'&&(currentStatus=='receive'||currentStatus=='allot'||currentStatus=='alloted'||currentStatus=='person'||currentStatus=='doing')"
                                    :width="operationsWidth"
                                    align="center"
                                    fixed="right"
                                    prop="operations"
                                    label="操作">
                                    <template #default="scope">
                                      <div class="table-button">
                                          <el-button size="mini" @click="receiveTableRow(scope.row,scope.$index)" v-if="currentStatus=='receive'&&menuButtonPermit.includes('Worksaccpet_confirmwork')">认领工单</el-button>
                                          <el-button size="mini" @click="cancelTableRow(scope.row,scope.$index)" v-if="currentStatus!='receive'&&(scope.row.workstatus!=1&&scope.row.workstatus!=3)&&menuButtonPermit.includes('Worksaccpet_backwork')">工单退回</el-button>
                                          <el-button size="mini" @click="confirmAllotTableRow(scope.row,scope.$index)" v-if="currentStatus=='allot'&&menuButtonPermit.includes('Worksaccpet_confirmdeal')">确认分配</el-button>
                                          <el-button size="mini" @click="confirmDoneTableRow(scope.row,scope.$index)" v-if="(currentStatus=='alloted'||currentStatus=='person'||currentStatus=='doing')&&scope.row.workstatus!=1&&scope.row.workstatus!=3&&(scope.row.status==2||scope.row.status==5)&&menuButtonPermit.includes('Worksaccpet_confirmfinish')">提交审核</el-button>
                                          <el-button size="mini" @click="undoTableRow(scope.row,scope.$index)" v-if="(currentStatus=='alloted'||currentStatus=='person'||currentStatus=='doing')&&(scope.row.workstatus!=1&&scope.row.workstatus!=3)&&menuButtonPermit.includes('Worksaccpet_workcancel')">撤销分配</el-button>
                                      </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div v-if="totalDataNum>50" class="pagination-panel" ref="pagePane">
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
                  </div>
                  <el-backtop target=".scroll-panel"></el-backtop>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { isNumber } from '@/utils/validate';
export default {
  name: 'WorkOrder_orderList',
  data() {
    return {
        operationsWidth:"",
        currentStatus:"person",
        status:1,
        menuButtonPermit:[],
        minHeight:"auto",
        tableData:[],
        statData:[],
        page:1,
        limit:50,
        pageSizeList:[50, 100, 150, 200],
        totalDataNum:0,
        userList:[],
        searchData:{
            date:[],
            timetype:"",
        },
        timeTypeList:[
          {label:"按接单时间",value:2},
          {label:"按分配时间",value:1},
        ],
        defaultData:{
          receiveNum:0,
          allotedNum:0,
          allotNum:0,
          personNum:0,
          doingNum:0,
          doneNum:0,
        },
        isDisabled:true,
        selectedData:[],
        permitStatus:[],
        isLoading:false,
        pickerRangeOptions: {
          shortcuts: [{
            text: '最近一旬',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 9);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device',
    ]),
  },
  mounted(){
    const $this = this;
    $this.$nextTick(function () {
      this.setHeight();
    });
    window.onresize = () => {
        return (() => {
            this.setHeight();
        })()
    }
  },
    watch: {
      minHeight(val) {
        if (!this.timer) {
          this.minHeight = val
          this.timer = true
          const $this = this
          setTimeout(function() {
            $this.timer = false
          }, 400)
        }
      },
        //监听相同路由下参数变化的时候，从而实现异步刷新
        '$route'(to,from) {
            var $this = this;
            $this.initData();
        },
    },
    updated(){
      var $this = this;
      $this.$nextTick(() => {
        $this.$refs.simpleTable.doLayout()
      });
    },
  created(){
    var $this = this;
    $this.initData();
  },
  methods:{
    // 设置table高度
    setHeight(){
      var $this = this;
      $this.minHeight = "auto";
      $this.$nextTick(()=>{
        var trueHeight = $this.$refs.scrollPane.offsetHeight;
        var headerHeight = 0;
        if($this.$refs.headerPane){
          headerHeight = $this.$refs.headerPane.offsetHeight+45;
        }
        var screenHeight = $this.$refs.boxPane.offsetHeight;
        console.log(trueHeight,"真实高度");
        console.log(headerHeight,"头部高度");
        console.log(screenHeight,"视窗高度");
        if(trueHeight<=screenHeight){
          $this.minHeight = screenHeight-headerHeight-30;
        }else{
          if(trueHeight-screenHeight<=headerHeight){
            $this.minHeight = "auto";
          }else{
            if($this.totalDataNum>50){
              $this.minHeight = screenHeight - $this.$refs.pagePane.offsetHeight - 30;
            }else{
              $this.minHeight = screenHeight - 30;
            }
          }
        }
        console.log($this.minHeight,"表格高度");
      });
    },
    // 搜索结果
    searchResult(){
      var $this = this;
      $this.getCurrentStatusData();
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.isLoading = true;
      $this.getUserMenuButtonPermit();
    },
    // 获取当前状态分类的数据
    getCurrentStatusData(){
      var $this = this;
      var searchData = {};
      var pathUrl = "";
      if($this.currentStatus==="receive"){
        pathUrl = "worksaccpet/receiveWorkOrderDataAction";
      }else if($this.currentStatus==="allot"){
        pathUrl = "worksaccpet/allotWorkOrderDataAction";
      }else if($this.currentStatus==="alloted"){
        pathUrl = "worksaccpet/allotedWorkOrderDataAction";
      }else if($this.currentStatus==="person"){
        pathUrl = "worksaccpet/personWorkOrderDataAction";
      }else if($this.currentStatus==="doing"){
        pathUrl = "worksaccpet/doingWorkOrderDataAction";
      }else if($this.currentStatus==="done"){
        pathUrl = "worksaccpet/doneWorkOrderDataAction";
      }else{
        pathUrl = "worksaccpet/statWorkOrderDataAction";
      }
      if($this.currentStatus==="alloted"||$this.currentStatus==="person"||$this.currentStatus==="doing"||$this.currentStatus==="done"){
        searchData.page = $this.page;
        searchData.limit = $this.limit;
        searchData.timetype = $this.searchData.timetype;
        if($this.searchData.date&&$this.searchData.date.length>0){
            searchData.starttime = $this.searchData.date[0];
            searchData.endtime = $this.searchData.date[1];
        }else{
            searchData.starttime = "";
            searchData.endtime = "";
        }
      }else if($this.currentStatus==="stat"){
        if($this.searchData.date&&$this.searchData.date.length>0){
            searchData.starttime = $this.searchData.date[0];
            searchData.endtime = $this.searchData.date[1];
        }else{
            searchData.starttime = "";
            searchData.endtime = "";
        }
      }else{
          searchData = null
      }
      $this.$store.dispatch(pathUrl, searchData).then(response=>{
        if(response){
          if(response.status){
            var tableData = response.data;
            if($this.currentStatus==="stat"){
              console.log(tableData,"统计数据");
            }else{
              tableData.forEach(function(item,index){
                item.ownScore = "";
                item.tagList = [];
                if(item.tags&&item.tags != ""){
                  if(item.tags.indexOf("|")!=-1){
                    var tagArr = item.tags.split("|");
                    tagArr.forEach(function(item1,index1){
                      var itemData = {};
                      if(item1.indexOf("-")!=-1){
                        itemData.tag = item1.split("-")[0];
                        itemData.color = item1.split("-")[1];
                      }else{
                        itemData.tag = item1;
                        itemData.color = "#1b3f75";
                      }
                      item.tagList.push(itemData);
                    });
                  }else{
                    var itemData = {};
                    if(item.tags.indexOf("-")!=-1){
                      itemData.tag = item.tags.split("-")[0];
                      itemData.color = item.tags.split("-")[1];
                    }else{
                      itemData.tag = item.tags;
                      itemData.color = "#1b3f75";
                    }
                    item.tagList.push(itemData);
                  }
                }
                if($this.currentStatus == "allot"){
                  if(item.dealuserid == 0){
                    item.dealuserid = "";
                  }
                }
              });
              if($this.currentStatus==="alloted"||$this.currentStatus==="person"||$this.currentStatus==="doing"||$this.currentStatus==="done"){
                  $this.totalDataNum = response.allcount;
              }else{
                  $this.totalDataNum = 0;
              }
            }
            $this.tableData = tableData;
            $this.isLoading = false;
            $this.$nextTick(()=>{
              $this.setHeight();
            });
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
        }else{
          $this.isLoading = false;
        }
      });
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.isLoading = true;
      $this.$store.dispatch('worksaccpet/workOrderPublicDataAction', null).then(response=>{
        if(response){
          if(response.status){
            $this.defaultData.receiveNum = response.waitcount;
            $this.defaultData.allotNum = response.waitdealcount;
            $this.defaultData.allotedNum = response.hasdealcount;
            $this.defaultData.personNum = response.personcount;
            $this.defaultData.doingNum = response.makeingcount;
            $this.defaultData.doneNum = response.hasfinishcount;
            if($this.currentStatus=="allot"){
              $this.getWorkOrderUser();
            }else{
              $this.getCurrentStatusData();
            }
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
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          console.log(res,'请求权限')
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
              if(item.action_route=="Worksaccpet_waitwork"){
                $this.permitStatus.push("receive");
              }
              if(item.action_route=="Worksaccpet_waitdealwork"){
                $this.permitStatus.push("allot");
              }
              if(item.action_route=="Worksaccpet_allwork"){
                $this.permitStatus.push("alloted");
              }
              if(item.action_route=="Worksaccpet_personwork"){
                $this.permitStatus.push("person");
              }
              if(item.action_route=="Worksaccpet_makeingwork"){
                $this.permitStatus.push("doing");
              }
              if(item.action_route=="Worksaccpet_hasfinish"){
                $this.permitStatus.push("done");
              }
              if(item.action_route=="Worksaccpet_workcount"){
                $this.permitStatus.push("stat");
              }
            });
            if($this.menuButtonPermit.includes('Worksaccpet_commoncount')&&$this.menuButtonPermit.includes('WorkOrder_orderList')&&$this.permitStatus.length>0){
              if($this.$route.query.Status){
                if($this.permitStatus.includes($this.$route.query.Status)){
                  $this.currentStatus = $this.$route.query.Status;
                  var operationsWidth = 22;
                  if($this.currentStatus=="receive"){
                    if($this.menuButtonPermit.includes('Worksaccpet_confirmwork')){
                        operationsWidth+=90;
                    }
                  }else if($this.currentStatus=="allot"){
                    if($this.menuButtonPermit.includes('Worksaccpet_backwork')){
                        operationsWidth+=90;
                    }
                    if($this.menuButtonPermit.includes('Worksaccpet_confirmdeal')){
                        operationsWidth+=90;
                    }
                  }else if($this.currentStatus=="alloted"||$this.currentStatus=="person"||$this.currentStatus=="doing"){
                    if($this.menuButtonPermit.includes('Worksaccpet_backwork')){
                        operationsWidth+=90;
                    }
                    if($this.menuButtonPermit.includes('Worksaccpet_confirmfinish')){
                        operationsWidth+=90;
                    }
                    if($this.menuButtonPermit.includes('Worksaccpet_workcancel')){
                        operationsWidth+=90;
                    }
                  }
                  $this.operationsWidth = "" + operationsWidth;
                  $this.initPage();
                }else{
                  $this.$router.push({path:'/WorkOrder/orderList',query:{Status:$this.permitStatus[0]}});
                }
              }else{
                  $this.$message({
                      showClose: true,
                      message: "未找到对应页面或页面缺失参数",
                      type: 'error',
                      duration:6000
                  });
                  $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
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
    // 每页显示条数改变事件
    handleSizeChange(val) {
      this.limit = val;
      this.getCurrentStatusData();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      this.page = val;
      this.getCurrentStatusData();
    },
    // 跳转到详情
    jumpArticle(id){
      var $this = this;
      var routeUrl =  $this.$router.resolve({path:'/WorkOrder/workInfo',query:{ID:id}});
      window.open(routeUrl.href,'_blank');
    },
    // 页面自跳转
    jumpLink(status){
        var $this = this;
        $this.resetSearchData();
        if($this.currentStatus==status){
          $this.initPage();
        }else{
          $this.$router.push({path:'/WorkOrder/orderList',query:{Status:status}});
        }
    },
    // 工单退回
    cancelTableRow(row,index){
      var $this = this;
      var resultData = {};
      resultData.id = row.id;
      $this.$confirm('是否确认退回工单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        $this.$store.dispatch('worksaccpet/backWorkOrderAction', resultData).then(response=>{
            if(response){
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
            }
        });
      }).catch(() => {
          $this.$message({
            type: 'info',
            message: '已取消'
          });          
      });
    },
    // 认领工单
    receiveTableRow(row,index){
        var $this = this;
        if(row.ownScore==""){
            $this.$message({
                showClose: true,
                message: '错误：认领积分不能为空！',
                type: 'error'
            });
            return false;
        }
        if(!isNumber(row.ownScore)){
            $this.$message({
                showClose: true,
                message: '错误：认领积分只能输入数字！',
                type: 'error'
            });
            return false;
        }
        var resultData = {};
        resultData.work_id = row.id;
        resultData.score = row.ownScore;
        $this.$store.dispatch('worksaccpet/receiveWorkOrderAction', resultData).then(response=>{
            if(response){
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
            }
        });
    },
    // 确认分配工单
    confirmAllotTableRow(row,index){
      var $this = this;
      if(row.dealuserid==""){
          $this.$message({
              showClose: true,
              message: '错误：请先分配具体负责人！',
              type: 'error'
          });
          return false;
      }
      var resultData = {};
      resultData.ids = [row.id];
      resultData.dealuserid = row.dealuserid;
      $this.$store.dispatch('worksaccpet/confirmWorkOrderAction', resultData).then(response=>{
          if(response){
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
          }
      });
    },
    // 撤销分配
    undoTableRow(row,index){
      var $this = this;
      var resultData = {};
      resultData.ids = [row.id];
      $this.$confirm('是否确认撤销分配?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        $this.$store.dispatch('worksaccpet/undoWorkOrderAction', resultData).then(response=>{
            if(response){
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
            }
        });
      }).catch(() => {
          $this.$message({
            type: 'info',
            message: '已取消'
          });          
      });
    },
    // 提交审核
    confirmDoneTableRow(row,index){
      var $this = this;
      $this.$store.dispatch('worksaccpet/confirmDoneWorkOrderAction', {id:row.id}).then(response=>{
          if(response){
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
          }
      });
    },
    // 表格多选改变事件
    handleSelectionChange(val) {
        var $this = this;
        $this.selectedData = val;
        if($this.selectedData.length>0){
          $this.isDisabled = false;
        }else{
          $this.isDisabled = true;
        }
    },
    // 重置搜索条件
    resetSearchData(){
      var $this = this;
      $this.searchData.date = [];
      $this.searchData.timetype = "";
      $this.page = 1;
      $this.limit = 50;
    },
    // 获取工单具体负责人数据
    getWorkOrderUser(){
      var $this = this;
      $this.$store.dispatch('worksaccpet/workOrderUserListAction', null).then(response=>{
        if(response){
          if(response.status){
            var userList = [];
            response.data.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              userList.push(itemData);
            });
            $this.userList = userList;
            $this.getCurrentStatusData();
            console.log(response,"工单负责人数据");
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
  }
}
</script>
<style lang="scss" scoped>
</style>
