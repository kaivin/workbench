<template>
  <div class="page-root scroll-panel group-index" ref="boxPane"> 
    <p class="breadcrumb" ref="breadcrumbPane">
      <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
      <template v-for="item in breadcrumbList">
        <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
        <span v-else class="breadcrumb-link" v-bind:key="'last-' + item.id"><b>-</b><span>{{item.title}}</span></span>
      </template>
    </p>
    <div class="filter-panel" ref="filterbox">
      <div class="filter-list">
        <div class="item-search">
          <div class="filter-title"><span class="txt-title">开始日期：</span></div>
          <el-select v-model="searchData.start_num" size="small" clearable placeholder="请选择开始日期" class="select-panel">
              <el-option
                  v-for="item in timeList"
                  :key="item.num"
                  :label="item.addtime"
                  :value="item.num">
              </el-option>
          </el-select>
          <div class="filter-title" style="margin-left:50px"><span class="txt-title">结束日期：</span></div>
          <el-select v-model="searchData.end_num" size="small" clearable placeholder="请选择开始日期" class="select-panel">
              <el-option
                  v-for="item in timeList"
                  :key="item.num"
                  :label="item.addtime"
                  :value="item.num">
              </el-option>
          </el-select>
        </div>
        <div class="item-filter flex-box group">
          <div class="filter-title"><span class="txt-title">账号：</span></div>
          <!-- <div class="filter-content flex-content">
            <div class="checked_item">
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
                ><span class="c_tit">全选</span>
              </el-checkbox>
              <el-checkbox-group
                v-model="searchData.ids"
                @change="handleCheckedChange"
              >
                  <el-checkbox
                    v-for="item in groupList"
                    :key="item.id"
                    :label="item.id"
                    :value="item.id"
                    >
                    <span class="c_tit">{{item.name}}</span><b  class="c_name">[{{item.uname}}]</b>
                  </el-checkbox>
              </el-checkbox-group>
              <el-button class="search_btn" type="primary" :disabled="isSearchData" @click="getDouyinCountData">查询</el-button>
            </div>
          </div> -->
          <div class="filter-content flex-content">
            <div class="item-list group">
              <div class="item-checkbox" v-bind:class="checkAll?'active':''" @click="checkAllData"><i></i><span>全选</span></div>
              <div class="item-checkbox" v-bind:class="item.isOn?'active':''" v-for="item in groupList" v-bind:key="item.id" v-on:click="groupChangeHandler(item.id)">
                <span><i></i><span>{{item.name}}</span><b>[{{item.uname}}]</b> </span>
              </div>
            </div>
            <el-button class="search_btn" type="primary" :disabled="isSearchData" @click="getDouyinCountData">查询</el-button>
            <el-button type="info" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="chartShow result-panel">
        <div class="search" v-if="isSearchData"><p>请稍候...</p></div>
        <div id="chart"></div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
import * as echarts from 'echarts';
import {sortByAsc} from "@/utils/index"
export default {
  name: 'Douyin_doucounttwo',
  data() {
    return {
        menuButtonPermit:[],         //网页权限字段
        searchData:{
          ids:[],
          start_num: "",
          end_num: ""
        },
        scorelist:[],
        showChart: false,
        myChart:null,
        groupList: [],
        isIndeterminate: false,
        checkAll: false,
        isSearchData: false,
        timeList: [],
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'menuData'
    ]),
    isOpen() {
      return this.sidebar.opened;
    },
  },
  created() {
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
  },
  mounted(){
    const $this = this;
    window.addEventListener('resize',$this.echartsSize);
  },
  destroyed(){
    const $this = this;
    window.removeEventListener('resize', $this.echartsSize);
  },
  methods: {
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
    // 判断浏览器类型
    getBrowserType(){
      var ua =  navigator.userAgent;
      if(ua){
        if(ua.indexOf('Mobile')!=-1){
          this.scrollPosition.isPC = false;
        }else{
          this.scrollPosition.isPC = true;
        }
      }else{
        this.scrollPosition.isPC = true;
      }
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.data.length>0){
          var permitData = [];
          res.data.forEach(function(item,index){
            permitData.push(item.action_route);
          });
          if(permitData.includes('Douyin_doucounttwo')){
              $this.getDouyinTime();
              $this.getDepartList();
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
      });
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 获取日期
    getDouyinTime(){
      var $this = this;
      $this.$store.dispatch('douyin/douyinCountTime',null).then(res=>{
        if(res.status){
          $this.timeList = res.data;
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 获取部门列表
    getDepartList(){
      var $this = this;
      $this.$store.dispatch('douyin/douyinDepartlist', null).then(response=>{
        if(response){
          if(response.status){
            if(response.data){
              if(response.data.length > 0){
                var resList = [];
                response.data.forEach(item => {
                  var obj = {};
                  obj.id = item.id;
                  obj.name = item.name;
                  obj.uname = item.uname;
                  obj.department = item.department;
                  obj.isOn = false;
                  resList.push(obj);
                })
              }
              $this.groupList = resList;
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
              setTimeout(()=>{
                $this.isSearchResult=false;
                $this.isSaveData=false;
              },1000);
            }
          }
        }
      });
    },
    // 点击选中
    handleCheckedChange(e){
      var $this = this;
      var checkedCount = e.length;
      if(checkedCount === $this.groupList.length){
        $this.checkAll = true;
      }else{
        $this.checkAll = false;
      }
      if(checkedCount>0&&checkedCount<$this.groupList.length){
        $this.isIndeterminate = true;
      }else{
        $this.isIndeterminate = false;
      }
    },
    // 全选
    handleCheckAllChange(e){
      var $this = this;
      var checkedList = [];
      if(e){
        $this.groupList.forEach((item) =>{
          checkedList.push(item.id);
        })
        $this.searchData.ids = checkedList;
        $this.checkAll= true;
      }else{
        $this.searchData.ids = [];
        $this.checkAll= false;
      }
      $this.isIndeterminate = false;
    },
    // 小组点击事件
    groupChangeHandler(id){
      var $this = this;
      var groupList = $this.groupList;
      var selectedID = [];
      groupList.forEach(function(item,index){
        if(item.id == id){
          item.isOn = !item.isOn;
        }
        if(item.isOn){
          selectedID.push(item.id);
        }
      });
      if(selectedID.length === $this.groupList.length ){
        $this.checkAll = true
      }else{
        $this.checkAll = false
      }
      $this.groupList = groupList;
      $this.searchData.ids = selectedID;
    },
    checkAllData(){
      var $this = this;
      if($this.checkAll){
        $this.checkAll = false;
        var groupList = $this.groupList;
        groupList.forEach(function(item,index){
          item.isOn = false;
        });
        $this.groupList = groupList;
        $this.searchData.ids = [];
      }else{
        $this.checkAll = true;
        var groupList = $this.groupList;
        var selectedID = [];
        groupList.forEach(function(item,index){
          item.isOn = true;
          selectedID.push(item.id);
        });
        $this.groupList = groupList;
        $this.searchData.ids = selectedID;
      }
      
    },
    // 获取抖音数据
    getDouyinCountData(){
      var $this = this;
      if(!$this.isSearchData){
        if($this.searchData.start_num == "" ){
          $this.$message({
            showClose: true,
            message: "错误：请选择开始日期！",
            type: "error",
          });
          return false;
        }else if($this.searchData.end_num == "" ){
          $this.$message({
            showClose: true,
            message: "错误：请选择结束日期！",
            type: "error",
          });
          return false;
        }else if($this.searchData.end_num < $this.searchData.start_num ){
          $this.$message({
            showClose: true,
            message: "错误：请核对开始、结束日期！",
            type: "error",
          });
          return false;
        }else if($this.searchData.ids.length === 0){
          $this.$message({
            showClose: true,
            message: "错误：请选择要查询的账号！",
            type: "error",
          });
          return false;
        }
        var formData = {};
        formData.ids = $this.searchData.ids;
        formData.start_num = $this.searchData.start_num;
        formData.end_num = $this.searchData.end_num;
        $this.isSearchData = true;
        $this.$store.dispatch('douyin/douyinCountData', formData).then(response=>{
          if(response){
            $this.isSearchData = false;
            if(response.status){
              if(response.data){
                var resList = []
                if(response.data.length > 0){
                  resList = response.data;
                }
                $this.scorelist = resList;
                if($this.myChart){
                  $this.myChart.dispose();
                  $this.drawAreaChart();
                }else{
                  $this.drawAreaChart();
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
                setTimeout(()=>{
                  $this.isSearchResult=false;
                  $this.isSaveData=false;
                },1000);
              }
            }
          }
        });
      }
    },
    drawAreaChart(){
      var $this = this;
      if($this.scorelist.length>0){
        var totalNum = 0;
        $this.scorelist.forEach((item, index) => {
          if(index === 0){
            totalNum = item.score_trend.length
          }
          if(item.score_trend && item.score_trend.length > 0){
            item.score_trend = item.score_trend.sort(sortByAsc("num"));
          }
        })
        if(totalNum > 0){
          var colorArr = ["#2259e5","#3ebea7","#eca12d","#ee4747","#73c0de","#91cb74","#ff8d61","#9a60b4","#e522db","#e5d822","#5470c6","#fc8452","#fac858","#ee6666"]
          var chartDom = document.getElementById('chart');
          var myChart = echarts.init(chartDom);
          var option;
          var xData = [];
          var series = [];
          var dataset = [];
          if($this.scorelist.length > 1){
            // 获取总值
            var totalObj={};
            totalObj.smooth=false;
            totalObj.type='line';
            totalObj.name = "总积分";
            totalObj.label={
              show: true,
              position: 'top'
            }
            totalObj.lineStyle={
                width: 1,
                color: "#fe3a33", // 线条颜色
            };
            totalObj.itemStyle={
                color: '#fff',
                borderColor: "#fe3a33", // 折点颜色
                borderWidth: 1
            };
            totalObj.areaStyle={
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#fe3a33",
                      opacity:1
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 255, 255, 0)",
                    }
                  ]),
                  opacity:0.3
            };
            totalObj.emphasis={
              lineStyle: {
                width: 2,	// hover时的折线宽度
              },
              itemStyle:{
                borderWidth: 2
              }
            };
            totalObj.symbolSize=5;
            totalObj.symbol='circle';
            totalObj.data=[];
            
            for(var i = 0; i< totalNum; i++){
              var tobj = {
                value: 0,
                one_number: 0,
                two_number: 0,
                three_number: 0,
                four_number: 0
              }
              $this.scorelist.forEach((item, index) => {
                tobj.value += Number(item.score_trend[i].score);
                tobj.one_number += Number(item.score_trend[i].one_number);
                tobj.two_number += Number(item.score_trend[i].two_number);
                tobj.three_number += Number(item.score_trend[i].three_number);
                tobj.four_number += Number(item.score_trend[i].four_number);
              })
              tobj.value = tobj.value.toFixed(1);
              totalObj.data.push(tobj)
            }
            totalObj.animationDuration=2800;
            totalObj.animationEasing='quadraticOut';
            series.push(totalObj);
          }
          // 组装每个值
          $this.scorelist.forEach((item,index) => {
            var itemObj={};
            itemObj.smooth=false;
            itemObj.type='line';
            itemObj.name = item.name;
            itemObj.label={
              show: true,
              position: 'top'
            }
            itemObj.lineStyle={
                width: 1,
                color: colorArr[index%14], // 线条颜色
            };
            itemObj.itemStyle={
                color: '#fff',
                borderColor: colorArr[index%14], // 折点颜色
                borderWidth: 1
            };
            itemObj.areaStyle={
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: colorArr[index%14],
                      opacity:1
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 255, 255, 0)",
                    }
                  ]),
                  opacity:0.3
            };
            itemObj.emphasis={
              lineStyle: {
                width: 2,	// hover时的折线宽度
              },
              itemStyle:{
                borderWidth: 2
              }
            };
            itemObj.symbolSize=5;
            itemObj.symbol='circle';
            itemObj.data=[];
            if(item.score_trend && item.score_trend.length > 0){
              item.score_trend.forEach((sitem, sindex) => {
                if(index === 0){
                  xData.push(sitem.addtime);
                }
                var obj = {}
                obj.value = sitem.score;
                obj.one_number = sitem.one_number;
                obj.two_number = sitem.two_number;
                obj.three_number = sitem.three_number;
                obj.four_number = sitem.four_number;
                itemObj.data.push(obj);
              })
            }
            itemObj.animationDuration=2800;
            itemObj.animationEasing='quadraticOut';
            series.push(itemObj);
          });
          option = {
            tooltip: {
                backgroundColor:'rgba(255,255,255,0.95)',
                trigger: "axis",
                textStyle:{
                  fontSize:'12',
                  color: '#666'
                },
                formatter(params){
                  let returnData = `<div class="toolDiv">
                      <div class="tooltitle">${params[0].name}</div>`;
                  for (let i = 0; i < params.length; i++) {
                      returnData += `<div class="bar clearfix" style="margin-top:5px">
                        <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[i].borderColor};"></span>
                        <span>${params[i].seriesName}：</span>
                        <span>积分：${params[i].value}</span>
                        </div>
                        <div class="bar clearfix">
                        <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;"></span>
                        <span style="opacity: 0; vibisity: hidden;"> ${params[i].seriesName}：</span>
                        <span>数量：</span>
                        <span>${params[i].data.one_number}<span style="color: #999"> (1-5名)</span></span>
                        <span style="margin-left: 10px;">${params[i].data.two_number}<span style="color: #999"> (6-10名)</span></span>
                        <span style="margin-left: 10px;">${params[i].data.three_number}<span style="color: #999"> (11-15名)</span></span>
                        <span style="margin-left: 10px;">${params[i].data.four_number}<span style="color: #999"> (16-20名)</span></span>
                        </div>
                        `;
                  }
                  returnData +=`</div>`;
                  return returnData;
              }
            },
            grid: {
                top:60,
                right:52,
                bottom:40,
                left:52,
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xData,
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLine:{
                    show: true,
                    lineStyle:{
                        type: [4, 0],
                        dashOffset: 3,
                        color: '#e5e5e5',
                        opacity: 1,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                    }
                },
                axisLabel: {
                    interval:1,
                    color: "#555",
                    fontSize: "12",
                    lineHeight: 18,
                },
            },
            yAxis:{
                type: 'value',
                position: 'left',
                axisLine:{
                    show: true,
                    lineStyle:{
                        type: [4, 0],
                        dashOffset: 3,
                        color: '#e0e0e0',
                        opacity: 1,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                    }
                },
            },
            animation: false,
            series:series,
          };
          option && myChart.setOption(option);
          $this.myChart = myChart;
        }
      }
    },
    // 曲线图
    drawAreaChart2(){
      var $this = this;
      if($this.scorelist.length>0){
        var chartDom = document.getElementById('chart');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          grid:{
            left: '45',
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
            textStyle:{
                fontSize:12,
                color: '#666'
            },
            formatter(params){
              return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
                      <span>${params[0].seriesName}：</span>
                      <span>${params[0].data.user_data}</span>
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
            source: $this.scorelist,  
          },
          animation: false,
          series: [
            {
              name: "积分",
              type: 'line',
              symbol: 'circle',
              symbolSize: '5',
              label:{
                show: true,
                position: 'top',
                distance: '5'
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
        $this.myChart = myChart;
      }
    },
    echartsSize(){
      if(this.myChart){
          this.myChart.resize();
      }
    },
    resetData(){
      var $this = this;
      $this.searchData.ids = [];
      $this.searchData.start_num = "";
      $this.searchData.end_num = "";
      var groupList = $this.groupList;
      groupList.forEach(function(item,index){
          item.isOn = false;
      });
      $this.groupList = groupList;
      if($this.myChart){
        $this.myChart.dispose();
      }
    }
  }
}
</script>
<style lang="scss" scoped>

  .chartShow{
    margin-top: 20px;
    padding: 20px;
    background-color: #fff;
    #chart{
      height: 600px;
    }
  }
  .checked_item .c_tit, .checked_item .c_name{
    font-size: 14px;
    display: inline-block;
    height: 28px;
    line-height: 28px;
    color: #1a1a1a;
  }
  .checked_item .c_name {
    font-weight: normal;
    color: #808080;
    margin-left: 4px;
  }
  .checked_item .el-checkbox{
    min-width: 280px;
    margin: 3px;
  }
  .checked_item .is-checked .c_tit, .checked_item .is-checked .c_name{
    color: #0970ff;
  }
  .group-index .filter-panel .filter-list .item-filter.group .filter-content .item-list.group .item-checkbox{
    min-width: 280px;
  }
  @media screen and (min-width: 2400px){
    .chartShow{
      height: calc(100vh - 367px);
      #chart{
        height: calc(100vh - 407px);
      }
    }
  }
  .search_btn{
    padding-top: 8px;
    padding-bottom: 8px;
    margin-top: 10px;
  }
  .result-panel{
  position: relative;
  .search,.no-data{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    font-size: 14px;
    line-height: 2;
    text-align: center;
    p{
      position: absolute;
      left: 0;
      width: 100%;
      top: 50%;
      margin-top: -20px;
    }
  }
  .search p{
    color: #999
  }
}
.group-index .filter-panel .filter-list .item-filter .filter-content .item-list .item-checkbox .icon_chart{
  margin-left: 10px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #0970ff;
  cursor: pointer;
  display: inline-block;
  vertical-align: top;
  margin-top: 4px;
  font-size: 16px;
  i{
    font-size: 16px;
  }
}
.item-search{
  margin-bottom: 10px;
}
.item-search .filter-title{
  width: 70px;
  display:inline-block;
  .txt-title{
    display: block;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    color: #666666;
    text-align: left;
  }
}
</style>