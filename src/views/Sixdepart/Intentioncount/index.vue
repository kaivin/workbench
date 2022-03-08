<template>
  <div class="page-root flex-box no-padding cn-phone-index cn-phone-stat" ref="boxPane">
    <div class="flex-content relative">
      <div class="abs-panel" ref="mainPane">
        <div class="scroll-panel" ref="scrollPane">
          <p class="breadcrumb" ref="breadcrumbPane">
              <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
              <template v-for="item in breadcrumbList">
                <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
                <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
              </template>
          </p>
          <el-card class="box-card scroll-card" shadow="hover">
              <div class="card-content ChinaphoneTwoBox" ref="tableContent">
                  <div class="ChinaphoneTwo buttonTwo">
                    <div class="group-body">
                      <div class="team-panel">

                        <div class="team-header">
                          <span class="require">电话：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllPhone" border size="mini" v-model="checkAllPhone" @change="handleCheckAllPhoneChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedPhone" @change="handleCheckedPhoneChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="item in phoneList" :label="item.id" :key="item.id" border>{{item.phonenumber}}</el-checkbox>
                          </el-checkbox-group>
                        </div>

                        <div class="team-header">
                            <div class="team-headerItem">
                                  <span class="require">时间：</span>
                                  <el-date-picker
                                      v-model="searchData.date"
                                      size="mini"
                                      type="monthrange"
                                      align="right"
                                      value-format = "yyyy-MM"
                                      unlink-panels
                                      range-separator="至"
                                      start-placeholder="开始日期"
                                      end-placeholder="结束日期"
                                      :picker-options="pickerRangeOptions"
                                      :class="searchData.date&&searchData.date.length>0?'el-xzstate':''">
                                  </el-date-picker>              
                            </div>
                        </div>

                        <div class="team-header">
                          <span class="require">分析项：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllItem" border size="mini" v-model="checkAllItem" @change="handleCheckAllItemChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedItem" @change="handleCheckedItemChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="item in resaultShowList" :label="item.value" :key="item.id" border>{{item.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-header WebServerAddEditBtn ChinaphoneTwoBtn">
                      <el-button type="primary" class="updateBtn"  :class="isDisabled?'isDisabled':''" :disabled="isDisabled"  size="small" v-if="menuButtonPermit.includes('Sixdepart_Intentioncount')" v-on:click="getCluesAnalysisData"><i class="svg-i planeWhite" ><svg-icon icon-class="planeWhite" /></i>生成数据</el-button>
                      <el-button type="primary" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                  </div>
              </div>
          </el-card>
          <el-card class="box-card scroll-card cn-phone-result" shadow="hover" v-if="isSearch">
              <div class="card-content ChinaphoneTwoBox" ref="tableContent">
                <div class="cavans-wrapper" id="canvasPane" ref="canvasPane">
                  <el-row :gutter="15">
                    <el-col :md="24" :lg="12" v-if="checkedItem.includes(3)">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>意向率趋势</span><i class="tip">（意向分/总询盘数）</i></div>
                        <div class="chart-body" style="height:400px;">                        
                            <div class="abs-canvas" v-if="searchResult.buypercerter.length>0">
                              <div id="cluesChart1" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div>                     
                        </div>
                      </div>
                    </el-col>
                    <el-col :md="24" :lg="12" v-if="checkedItem.includes(2)">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>意向个数趋势</span></div>
                        <div class="chart-body" style="height:400px;">                              
                            <div class="abs-canvas" v-if="searchResult.buynumbertrend.length>0">
                              <div id="cluesChart2" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div> 
                        </div>
                      </div>
                    </el-col>
                    <el-col :md="24" :lg="12" v-if="checkedItem.includes(1)">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>意向分数趋势</span></div>
                        <div class="chart-body" style="height:400px;">                              
                            <div class="abs-canvas" v-if="searchResult.buyscorertrend.length>0">
                              <div id="cluesChart3" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div> 
                        </div>
                      </div>
                    </el-col>
                    <el-col :md="24" :lg="12" v-if="checkedItem.includes(4)">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>回复率趋势</span></div>
                        <div class="chart-body" style="height:400px;">                              
                            <div class="abs-canvas" v-if="searchResult.replytrend.length>0">
                              <div id="cluesChart4" class="chart-canvas"></div>
                            </div>
                            <div class="nocount" v-else>
                              暂无数据
                            </div> 
                        </div>
                      </div>
                    </el-col>
                    <el-col :xs="24" v-if="checkedItem.includes(5)">
                      <div class="chart-wrapper">
                        <div class="chart-header"><span>组员分析</span></div>
                        <div class="chart-body chartmap-body depsix-table" style="text-align:center;padding:20px">
                            <div class="table-panel">
                              <div class="table-chart">
                                <el-table
                                  border
                                  ref="rankcolTable"
                                  :data="searchResult.ulist"
                                  tooltip-effect="dark"
                                  style="width: 100%;"
                                  row-key="id"
                                  class="depsix_table"
                                  @sort-change="sortBycol"
                                  >
                                  <el-table-column
                                    prop="name"
                                    label="组员"
                                  >
                                  </el-table-column>

                                  <el-table-column align="center" v-for="(item, index) in searchResult.ulist[0].son" :key="index" :label="item.date">
                                      <el-table-column 
                                        label="意向率"
                                        class-name="colitem1"
                                        sortable="custom"
                                        :index="index"
                                      >
                                        <template slot-scope="scope">
                                          <span class="numspan">{{getPercent(scope.row.son[index].percenter)}}</span>
                                        </template>
                                      </el-table-column>
                                      <el-table-column 
                                        label="意向个数"
                                        class-name="colitem2"
                                        sortable="custom"
                                        :index="index"
                                      >
                                        <template slot-scope="scope">
                                          <span class="numspan">{{scope.row.son[index].number}}</span>
                                        </template>
                                      </el-table-column>
                                      <el-table-column 
                                        label="意向分数"
                                        class-name="colitem3"
                                        sortable="custom"
                                        :index="index"
                                      >
                                        <template slot-scope="scope">
                                          <span class="numspan">{{scope.row.son[index].socre}}</span>
                                        </template>
                                      </el-table-column>
                                      <el-table-column 
                                        label="回复率"
                                        class-name="colitem4"
                                        sortable="custom"
                                        :index="index"
                                      >
                                        <template slot-scope="scope">
                                          <span class="numspan">{{getPercent(scope.row.son[index].replypercenter)}}</span>
                                        </template>
                                      </el-table-column>
                                  </el-table-column>
                                  
                                </el-table>
                              </div>
                            </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
          </el-card>
        </div>
      </div>
    </div>
    <el-backtop target=".scroll-panel"></el-backtop>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as echarts from 'echarts';
export default {
  name: 'intentioncount',
  data() {
    return {
      isSearch:false,
      defaultData:{},
      breadcrumbList:[],
      menuButtonPermit:[],
      isAllPhone:false,
      checkAllPhone:false,
      checkedPhone:[],
      phoneList:[],
      searchData:{
        date:[],
      },
      pickerRangeOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()]);
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      searchResult:{
        ulist:[],
        buynumbertrend:[],
        buypercerter:[],
        buyscorertrend:[],
        replytrend:[]
      },
      isDisabled:false,
      chartlist:{
        trendPercentPlot:'',
        trendScorePlot:'',
        trendNumberPlot:'',
        trendReplyPlot:''
      },
      isAllResault: false,
      checkAllResault: false,
      checkedResShow: [],
      resaultShowList:[
        {id:1,value:1,label:"意向分趋势"},
        {id:2,value:2,label:"意向个数趋势"},
        {id:3,value:3,label:"意向率趋势"},
        {id:4,value:4,label:"回复率趋势"},
        {id:5,value:5,label:"组员分析"}
      ],
      isAllItem:false,
      checkAllItem:false,
      checkedItem:[],
      tableTitle:[],
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'sidebar',
      'menuData'
    ]),
    isCollapse() {
      return this.sidebar.opened
    }
  },
  mounted(){
    const $this = this;
    // if(this.sidebar.opened){
    //   $this.$store.dispatch('app/toggleSideBar');
    // }
    window.addEventListener('resize',this.echartsSize)
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
  },
  watch:{
    isCollapse(){
      setTimeout(() => {
        this.echartsSize();
      }, 200)
    }
  },
  methods:{
    // 获取面包屑路径
    getBreadcrumbList(){
      var $this = this;
      var breadcrumbList = [];
      var currentID = ""+$this.$router.currentRoute.meta.id;
      var pageID = 0;
      if(currentID.indexOf('-')!=-1){
        pageID = parseInt(currentID.split("-")[1]);
      }else{
        pageID = parseInt(currentID);
      }
      $this.menuData.forEach(function(item,index){
        if(item.meta.id == pageID){
          var itemData = {};
          itemData.id = item.meta.id;
          itemData.router = item.path;
          itemData.title = item.meta.title;
          breadcrumbList.push(itemData);
        }else{
          if(item.children.length>0){
            item.children.forEach(function(item1,index1){
              if(item1.meta.id == pageID){
                var itemData = {};
                itemData.id = item.meta.id;
                itemData.router = item.path;
                itemData.title = item.meta.title;
                breadcrumbList.push(itemData);
                var itemData2 = {};
                itemData2.id = item1.meta.id;
                itemData2.router = item1.path;
                itemData2.title = item1.meta.title;
                breadcrumbList.push(itemData2);
              }else{
                if(item1.children.length>0){
                  item1.children.forEach(function(item2,index2){
                    if(item2.meta.id == pageID){
                      var itemData = {};
                      itemData.id = item.meta.id;
                      itemData.router = item.path;
                      itemData.title = item.meta.title;
                      breadcrumbList.push(itemData);
                      var itemData2 = {};
                      itemData2.id = item1.meta.id;
                      itemData2.router = item1.path;
                      itemData2.title = item1.meta.title;
                      breadcrumbList.push(itemData2);
                      var itemData3 = {};
                      itemData3.id = item2.meta.id;
                      itemData3.router = item2.path;
                      itemData3.title = item2.meta.title;
                      breadcrumbList.push(itemData3);
                    }
                  });
                }
              }
            });
          }
        }
      });
      $this.breadcrumbList = breadcrumbList;
    },
    // 重置选择项
    resetData(){
      var $this = this;
      $this.isSearch = false;
      $this.isAllPhone=false;
      $this.checkAllPhone=false;
      $this.checkedPhone=[];
      $this.searchData.date=[];
      $this.searchResult.buynumbertrend=[];
      $this.searchResult.buypercerter=[];
      $this.searchResult.buyscorertrend=[];
      $this.searchResult.replytrend=[];
      $this.searchResult.ulist=[];
      $this.isAllResault = false;
      $this.checkAllResault = false;
      $this.checkedResShow = [];
      $this.isAllItem = false;
      $this.checkAllItem = false;
      $this.checkedItem = []
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.getSearchSystemData();
    },
    // 组装搜索接口所需数据
    initSearchData(){
      var $this = this;
      var searchData = {};
      if($this.searchData.date&&$this.searchData.date.length>0){
        searchData.starttime = $this.searchData.date[0];
        searchData.endtime = $this.searchData.date[1];
      }else{
        searchData.starttime = "";
        searchData.endtime = "";
      }
      searchData.phoneid = $this.checkedPhone;
      searchData.type = $this.checkedItem;
      return searchData;
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Sixdepart_Intentioncount')){
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
    // 获取询盘统计的搜索条件数据
    getSearchSystemData(){
      var $this = this;
      $this.$store.dispatch('depsix/intentionPhone').then(response=>{
        if(response){
          if(response.status){
            $this.phoneList = response.phone;
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
    // 获取统计数据
    getCluesAnalysisData(){
      var $this = this;
      if(!$this.isDisabled){
        var searchData = $this.initSearchData();
        if(searchData.phoneid.length == 0){
          $this.$message({
              showClose: true,
              message: '错误：请至少选择一个电话！',
              type: 'error'
          });
          return false;
        }
        if($this.searchData.date.length == 0){
          $this.$message({
              showClose: true,
              message: '错误：请选择查询时间范围！',
              type: 'error'
          });
          return false;
        }
        if(searchData.type.length == 0){
          $this.$message({
              showClose: true,
              message: '错误：请至少选择一个分析项！',
              type: 'error'
          });
          return false;
        }
        $this.isDisabled=true;
        $this.$store.dispatch('depsix/intentionSearch', searchData).then(response=>{
          if(response){
            if(response.status){
              $this.isSearch=true;
              $this.searchResult.buynumbertrend = response.buynumbertrend ? response.buynumbertrend : [];
              $this.searchResult.buypercerter = response.buypercerter ? response.buypercerter : [];
              $this.searchResult.buyscorertrend = response.buyscorertrend ? response.buyscorertrend : [];
              $this.searchResult.replytrend = response.replytrend ? response.replytrend : [];
              $this.searchResult.ulist = response.ulist ? response.ulist : [];
              $this.$nextTick(()=>{
                
                document.getElementById("canvasPane").scrollIntoView({behavior: "smooth"});
                
                if($this.chartlist.trendPercentPlot){
                    $this.chartlist.trendPercentPlot.dispose();
                }
                if($this.checkedItem.includes(3)){
                  $this.drawChart1();
                }
                if($this.chartlist.trendNumberPlot){
                  $this.chartlist.trendNumberPlot.dispose();
                }
                if($this.checkedItem.includes(2)){
                  $this.drawChart2();
                }
                if($this.chartlist.trendScorePlot){
                  $this.chartlist.trendScorePlot.dispose();
                }
                if($this.checkedItem.includes(1)){
                  $this.drawChart3();
                }
                if($this.chartlist.trendReplyPlot){
                  $this.chartlist.trendReplyPlot.dispose();
                }
                if($this.checkedItem.includes(4)){
                  $this.drawChart4();
                }
              });
              setTimeout(()=>{
                $this.isDisabled=false;
              },1000);
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
              setTimeout(()=>{
                $this.isDisabled=false;
              },1000);
            }
          }
        });
      }
    },
    // 电话
    handleCheckAllPhoneChange(e){
      var $this = this;
      if(e){
        var checkedItem = [];
        $this.phoneList.forEach(function(item,index){
          checkedItem.push(item.id);
        });
        $this.checkedPhone = checkedItem;
        $this.checkAllPhone= true;
      }else{
        $this.checkedPhone = [];
        $this.checkAllPhone = false;
      }
      $this.isAllPhone = false;
    },
    handleCheckedPhoneChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.phoneList.length){
          $this.checkAllPhone = true;
        }else{
          $this.checkAllPhone = false;
        }
        if(checkedCount>0&&checkedCount<$this.phoneList.length){
          $this.isAllPhone = true;
        }else{
          $this.isAllPhone = false;
        }
    },
    // 分析项筛选
    handleCheckAllItemChange(e){
      var $this = this;
      if(e){
        var checkedItem = [];
        $this.resaultShowList.forEach(function(item,index){
          checkedItem.push(item.value);
        });
        $this.checkedItem = checkedItem;
        $this.checkAllItem= true;
      }else{
        $this.checkedItem = [];
        $this.checkAllItem = false;
      }
      $this.isAllItem = false;
    },
    handleCheckedItemChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.resaultShowList.length){
          $this.checkAllItem = true;
        }else{
          $this.checkAllItem = false;
        }
        if(checkedCount>0&&checkedCount<$this.resaultShowList.length){
          $this.isAllItem = true;
        }else{
          $this.isAllItem = false;
        }
    },
    // 意向率
    drawChart1(){
      var $this = this;
      if($this.searchResult.buypercerter.length>0){

        var chartDom = document.getElementById('cluesChart1');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          grid:{
            left: '35',
            top:'25',
            right:'15',
            bottom: '25'
          },
          tooltip:{
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "line", 
              lineStyle:{
                color: "#5b8ff9"
              }
            },
            formatter(params){
              var percenter = params[0].data.percenter;
              percenter= percenter==0? percenter:percenter+'%'
              return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
                      <span>${params[0].seriesName}：</span>
                      <span>${percenter}</span>
                    </div>
                  </div>`;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'value',
            axisLabel:{
              color: "#888"
            }
          },
          dataset:{
            source: $this.searchResult.buypercerter,  
          },
          animation: false,
          series: [
            {
              name: "意向率",
              type: 'line',
              symbol:'circle',
              symbolSize: '5',
              label:{
                show: true,
                position: 'top',
                distance: '5',
                formatter: params=>{
                  return params.data.percenter==0 ? params.data.percenter : params.data.percenter.toFixed(2)+'%'
                }
              },
              itemStyle:{
                color: '#fff',
                borderColor: "#0970ff",
                borderWidth: 1
              },
              lineStyle:{
                color: "#0970ff",
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);
        $this.chartlist.trendPercentPlot = myChart;
      }
    },
    // 意向个数
    drawChart2(){
      var $this = this;
      if($this.searchResult.buynumbertrend.length>0){

        var chartDom = document.getElementById('cluesChart2');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          grid:{
            left: '35',
            top:'25',
            right:'15',
            bottom: '25'
          },
          tooltip:{
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "line", 
              lineStyle:{
                color: "#5b8ff9"
              }
            },
            formatter(params){
              return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
                      <span>${params[0].seriesName}：</span>
                      <span>${params[0].data.number}</span>
                    </div>
                  </div>`;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'value',
            axisLabel:{
              color: "#888"
            }
          },
          dataset:{
            source: $this.searchResult.buynumbertrend,  
          },
          animation: false,
          series: [
            {
              name: "意向个数",
              type: 'line',
              symbol:'circle',
              symbolSize: '5',
              label:{
                show: true,
                position: 'top',
                distance: '5',
              },
              itemStyle:{
                color: '#fff',
                borderColor: "#0970ff",
                borderWidth: 1
              },
              lineStyle:{
                color: "#0970ff",
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);
        $this.chartlist.trendNumberPlot = myChart;

      }
    },
    // 意向分数
    drawChart3(){
      var $this = this;
      if($this.searchResult.buyscorertrend.length>0){
        
        var chartDom = document.getElementById('cluesChart3');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          grid:{
            left: '35',
            top:'25',
            right:'15',
            bottom: '25'
          },
          tooltip:{
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "line", 
              lineStyle:{
                color: "#5b8ff9"
              }
            },
            formatter(params){
              return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
                      <span>${params[0].seriesName}：</span>
                      <span>${params[0].data.socre}</span>
                    </div>
                  </div>`;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'value',
            axisLabel:{
              color: "#888"
            }
          },
          dataset:{
            source: $this.searchResult.buyscorertrend,  
          },
          animation: false,
          series: [
            {
              name: "意向分数",
              type: 'line',
              symbol:'circle',
              symbolSize: '5',
              label:{
                show: true,
                position: 'top',
                distance: '5',
              },
              itemStyle:{
                color: '#fff',
                borderColor: "#0970ff",
                borderWidth: 1
              },
              lineStyle:{
                color: "#0970ff",
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);
        $this.chartlist.trendScorePlot = myChart;
      }
    },
    // 回复率
    drawChart4(){
      var $this = this;
      if($this.searchResult.replytrend.length>0){
        var trenddata=[];
        $this.searchResult.replytrend.forEach(function(item){
          var obj={};
          obj.date=item.date;
          obj.percenter=item.percenter;
          obj.number=item.number;
          trenddata.push(obj);
        })
        var chartDom = document.getElementById('cluesChart4');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          grid:{
            left: '35',
            top:'25',
            right:'15',
            bottom: '25'
          },
          tooltip:{
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "line", 
              lineStyle:{
                color: "#5b8ff9"
              }
            },
            formatter(params){
              var percenter = params[0].data.percenter;
              percenter= percenter==0? percenter:percenter.toFixed(2)+'%'
              return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
                      <span>回复率：</span>
                      <span>${percenter}</span>
                    </div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
                      <span>回复个数：</span>
                      <span>${params[0].data.number}</span>
                    </div>
                  </div>`;
            }
          },
          xAxis: {
            type: 'category',
            name: "日期",
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'value',
            axisLabel:{
              color: "#888",
            }
          },
          dataset:{
            source: trenddata,  
          },
          animation: false,
          series: [
            {
              name: "回复率",
              type: 'line',
              symbol:'circle',
              symbolSize: '5',
              label:{
                show: true,
                position: 'top',
                distance: '5',
                formatter: params=>{
                  return params.data.percenter==0 ? params.data.percenter : params.data.percenter.toFixed(2)+'%'
                }
              },
              itemStyle:{
                color: '#fff',
                borderColor: "#0970ff",
                borderWidth: 1
              },
              lineStyle:{
                color: "#0970ff",
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
          ]
        };

        myChart.setOption(option);
        $this.chartlist.trendReplyPlot = myChart;
      }
    },

    // 百分值
    getPercent(num){
      return num==0?num:num+'%'
    },

    sortBycol(data){
        var index = data.column.index;
        var label = data.column.label;
        var rank = data.order=="descending"? 1:2;
        this.getrank(index,label,rank);
    },
    getrank(index,label,rank){
        var $this = this;
        var title = '';
        var row='';
        if(label == '意向率'){
            title='percenter';
        }else if(label == '意向个数'){
            title='number';
        }else if(label == '意向分数'){
            title='socre';
        }else if(label == '回复率'){
            title='replypercenter';
        }
        if(rank == 1){
            $this.searchResult.ulist.sort(function(item1,item2){
                return item2.son[index][title]-item1.son[index][title]
            })
        }else{
            $this.searchResult.ulist.sort(function(item1,item2){
                return item1.son[index][title]-item2.son[index][title]
            })
        }
        $this.$refs.rankcolTable.doLayout();
    },
    echartsSize(){
      var $this = this;
      if($this.chartlist.trendPercentPlot){
        $this.chartlist.trendPercentPlot.resize();
      }
      if($this.chartlist.trendScorePlot){
        $this.chartlist.trendScorePlot.resize();
      }
      if($this.chartlist.trendNumberPlot){
        $this.chartlist.trendNumberPlot.resize();
      }
      if($this.chartlist.trendReplyPlot){
        $this.chartlist.trendReplyPlot.resize();
      }
    },

  },
  destroyed(){
      window.removeEventListener('resize',this.echartsSize);
  }
}
</script>
<style lang="scss" scoped>
.chart-wrapper{
  margin-bottom: 15px;
}
.numspan{
  i{
    font-size: 12px;
    font-style: normal;
  }
}
.el-table .cell{
  text-align:center;
}
.cn-phone-stat .chart-wrapper .chart-header .tip{
  font-size: 14px;
  color:#0970ff;
  font-style: normal;
}
.el-table /deep/ thead.is-group th.el-table__cell{
  background-color: #2d71b5;
  font-weight: normal;
  color: #fff;
}
.el-table--enable-row-hover /deep/ .el-table__body tr:hover > td.el-table__cell {
    background-color: #deebf7;
}
.el-table /deep/ td.el-table__cell.colitem1{
  background-color: #fff4d1;
}
.el-table /deep/ td.el-table__cell.colitem2{
  background-color: #e2f0d9;
}
.el-table /deep/ td.el-table__cell.colitem3{
  background-color: #fbe5d6;
}
.el-table /deep/ td.el-table__cell.colitem4{
  background-color: #ededed;
}
.el-table /deep/ .ascending .sort-caret.ascending{
  border-bottom-color: #e6a700;
}
.el-table /deep/ .descending .sort-caret.descending {
    border-top-color: #e6a700;
}
</style>