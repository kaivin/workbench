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

                <div class="item-search flex-box">
                    <div class="filter-title"><span class="txt-title">日期：</span></div>
                    <div class="item-list">
                        <div class="item-change">
                            <div class="item-font" v-bind:class="item.isOn?'active':''" v-for="item in dateDimension" v-bind:key="item.value" v-on:click="dimensionChangeHandler(item)">{{item.label}}</div>
                        </div>
                        <div class="item-date">
                            <el-date-picker
                                v-model="searchData.time"
                                type="daterange"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                key="a"
                                size="small"
                                class="date-range"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                >
                            </el-date-picker>
                        </div>
                    </div>
                </div>

                <div class="item-filter flex-box group">
                    <div class="filter-title"><span class="txt-title">账号：</span></div>
                    <div class="filter-content flex-content">
                        <div class="checked_item">
                            <el-checkbox
                            v-model="checkAll"
                            :indeterminate="isIndeterminate"
                            @change="handleCheckAllChange"
                            ><span class="c_tit">全选</span>
                            </el-checkbox>
                            <el-checkbox-group
                            v-model="searchData.name"
                            @change="handleCheckedChange"
                            >
                                <el-checkbox
                                v-for="item in userList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name"
                                >
                                <span class="c_tit">{{item.name}}</span>
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>

                <div class="item-search item-btn">
                    <div class="filter-title" style="opacity: 0; visibility: hidden;"><span class="txt-title">账号：</span></div>
                    <el-button class="search_btn" type="primary" :disabled="isSearchData" @click="getCountData">查询</el-button>
                    <el-button type="info" class="reset_btn" v-on:click="resetData()">重置</el-button>
                </div>

            </div>
        </div>
        <div class="chartShow result-panel">
            <div class="item-change">
                <div class="item-font" :class="nowChart == 1?'active':''" @click="tabChange(1)">详细</div>
                <div class="item-font" :class="nowChart == 2?'active':''" @click="tabChange(2)">占比</div>
            </div>
            <div class="chart_item" v-if="nowChart == 1">
                <div class="search" v-if="isSearchData"><p>请稍候...</p></div>
                <div id="columnChart"></div>
            </div>
            <div class="chart_item" v-if="nowChart == 2">
                <div class="search" v-if="isSearchData"><p>请稍候...</p></div>
                <div id="pieChart"></div>
            </div>
        </div>
    </div>
  </template>
  <script>
  import {mapGetters} from 'vuex';
  import * as echarts from 'echarts';
  import {sortByAsc} from "@/utils/index";
  import {resultData} from "./index.js";
  export default {
    name: 'videocount_count',
    data() {
      return {
          menuButtonPermit:[],         //网页权限字段
          searchData:{
            name:[],
            time: []
          },
          showChart: false,
          columnChart:null,
          pieChart: null,
          isIndeterminate: false,
          checkAll: false,
          isSearchData: false,
          pickerDateRangeOptions: this.$pickerRangeOptions,
          dateDimension:[
            {label:"日",value:"day",isOn:false},
            {label:"周",value:"week",isOn:false},
            {label:"月",value:"month",isOn:false},
          ],
          nowDimension: "day",
          userList: [],
          nowChart: 1,
          chartData: {},
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
        // $this.getUserMenuButtonPermit();
        $this.dateDimension.forEach(item => {
            if(item.value == "day"){
                item.isOn = true;
            }else{
                item.isOn = false;
            }
        })
        $this.getDefaultTime();
        $this.getUserList();
        $this.handleChartData();
      },
      // 获取日期
      getUserList(){
        var $this = this;
        $this.$store.dispatch('videocount/userListData',null).then(res=>{
            if(res.code == 200){
                var resData = [];
                if(res.data && res.data.length > 0){
                    resData = res.data;
                }
                $this.userList = resData;
            }else{
                $this.$message({
                    showClose: true,
                    message: res.msg,
                    type: 'error'
                });
            }
        });
      },
      // 点击选中
      handleCheckedChange(e){
        var $this = this;
        var checkedCount = e.length;
        if(checkedCount === $this.userList.length){
          $this.checkAll = true;
        }else{
          $this.checkAll = false;
        }
        if(checkedCount>0&&checkedCount<$this.userList.length){
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
          $this.userList.forEach((item) =>{
            checkedList.push(item.name);
          })
          $this.searchData.name = checkedList;
          $this.checkAll= true;
        }else{
          $this.searchData.ids = [];
          $this.checkAll= false;
        }
        $this.isIndeterminate = false;
      },
      // 获取统计数据
      getCountData(){
        var $this = this;
        if(!$this.isSearchData){
          if($this.searchData.time.length == 0 ){
            $this.$message({
              showClose: true,
              message: "错误：请选择日期！",
              type: "error",
            });
            return false;
          }else if($this.searchData.name.length === 0){
            $this.$message({
              showClose: true,
              message: "错误：请选择要查询的用户！",
              type: "error",
            });
            return false;
          }
          var formData = {};
          formData.name = $this.searchData.name;
          formData.time = $this.searchData.time.join(" - ");
          $this.isSearchData = true;
          $this.$store.dispatch('videocount/getVideoCountData', formData).then(response=>{
            if(response){
              $this.isSearchData = false;
              if(response.code == 200){
                if(response.data){
                  var resList = []
                  if(response.data.length > 0){
                    resList = response.data;
                  }
                  $this.searchData = resList;
                  $this.handleChartData();
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
                    message: response.msg,
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
      handleChartData(){
        var $this = this;
        var c_name = [];
        var c_data = [];
        var p_name = [];
        var p_data = [];
        resultData.day_word_data.forEach((item,index) => {
          c_name.push(item.day);
          if(item.user_data && item.user_data.length > 0){
            var truescore = [];
            var finishscore = [];
            var sepscore = [];
            var percent = [];
            item.user_data.forEach((sitem, sindex) => {
              if(index == 0){
                p_name.push(sitem.name);
              }
              var trueobj = {};
              trueobj.value = sitem.data.user_effective_score;
              trueobj.all = sitem.data.user_actual_score;
              truescore.push(trueobj);
              var obj = {};
              obj.value = sitem.data.user_actual_score-sitem.data.user_effective_score;
              obj.all = sitem.data.user_actual_score;
              sepscore.push(obj);
              percent.push(Number(sitem.data.user_effective_score*100/sitem.data.user_actual_score).toFixed(1));
            })
            c_data.push(truescore);
            c_data.push(sepscore);
            c_data.push(percent);
          }
        });
        $this.chartData.c_name = c_name;
        $this.chartData.c_data = c_data;
        $this.chartData.p_name = p_name;
        $this.chartData.p_data = p_data;
        $this.tabChange(1);
      },
      drawColumnChart(){
        var $this = this;
        var colorArr = ["#2259e5","#3c6be5", "#3ebea7","#5ed8c2", "#eca12d","#edb257", "#ee4747", "#ed6060","#33abda", "#73c0de","#6ec840", "#91cb74","#f57543","#ff8d61","#9a60b4", "#c088da", "#c20cb8", "#e522db","#c8bc12", "#e5d822", "#3759be", "#5470c6", "#e06430", "#fc8452", "#e2ac34", "#fac858", "#ce3f3f","#ee6666"]
        var chartDom = document.getElementById('columnChart');
        var myChart = echarts.init(chartDom);
        var option;
        var xData = [];
        var series = [];
        if($this.chartData.c_data.length > 0){
          $this.chartData.c_data.forEach((item,index) => {
            var itemObj={};
            var nameindex = Math.floor(index/3);
            itemObj.name = $this.chartData.p_name[nameindex];
            itemObj.data = item;
            // 柱状图
            if(index%3 == 0 || index%3 == 1){
              itemObj.type='bar';
              itemObj.barWidth ="auto";
              if(index%3 == 0){
                itemObj.label={
                  show: true,
                  position: 'insideTop',
                  distance: 10,
                  color: "#fff"
                };
                itemObj.itemStyle={
                  color: colorArr[nameindex*2],
                  borderColor: colorArr[nameindex*2],
                };
              }else{
                itemObj.label={
                  show: true,
                  position: 'top',
                  distance: 5,
                  formatter:function(params){
                    return params.data.all
                  },
                };
                itemObj.itemStyle={
                  color: colorArr[nameindex*2+1],
                  borderColor: colorArr[nameindex*2+1],
                };
              }
              itemObj.stack = "data"+nameindex;
              series.push(itemObj);
            }else if(index%3 == 2){
              // 折线图
              itemObj.smooth=false;
              itemObj.type='line';
              itemObj.lineStyle={
                  width: 1,
                  color: colorArr[nameindex*2], // 线条颜色
              };
              itemObj.itemStyle={
                  color: '#fff',
                  borderColor: colorArr[nameindex*2], // 折点颜色
                  borderWidth: 1
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
              itemObj.animationDuration=2800;
              itemObj.animationEasing='quadraticOut';
              series.push(itemObj);
            }
          })
        }
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
                  if(i%3 == 0 || i%3 == 2){
                    
                    if(i%3 == 0){
                      returnData += `<div class="bar clearfix" style="margin-top:5px">
                        <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[i].borderColor};"></span><span>`;
                        if(params.length > 4){
                          returnData += `${params[i].seriesName}`;
                        }
                      returnData += `实际完成：</span><span>${params[i].data.all}积分</span></div>`;
                      returnData += `<div class="bar clearfix" style="margin-top:5px">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[i].borderColor};"></span><span>`;
                      if(params.length > 4){
                        returnData += `${params[i].seriesName}`;
                      }
                      returnData += `有效完成：</span><span>${params[i].data.value}积分</span></div>`;
                    }
                    if(i%3 == 2){
                      returnData += `<div class="bar clearfix" style="margin-top:5px">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[i-2].borderColor};"></span><span>`;
                      if(params.length > 4){
                        returnData += `${params[i].seriesName}`;
                      }
                      returnData += `完成度：</span><span>${params[i].value}%</span></div>`;
                    }
                  }
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
              data: $this.chartData.c_name,
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
        $this.columnChart = myChart;
      },
      drawPieChart(){
        var $this = this;
        var chartDom = document.getElementById('pieChart');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          tooltip: {
            trigger: 'item',
            formatter(items){
              var tooltext = `<div class="counttoolTip">
              <div class="title">${items.name}</div>
              <div class="bar clearfix">
                ${items.marker}
                <span class="name">${items.seriesName}：</span>
                <span class="num">${items.value}</span>
              </div>
              `;
              return tooltext;
            }
          },
          legend: {
            show: false,
            orient: 'vertical',
            right: 'right',
            top: 'middle',
            itemWidth: 8,
            itemHeight: 8,
            icon: "circle",
          },
          color: ["#2259e5","#3ebea7","#eca12d","#ee4747","#73c0de","#91cb74","#ff8d61","#9a60b4","#e522db","#e5d822","#5470c6","#fc8452","#fac858","#ee6666"],
          animation: false,
          series: [
            {
              name: '增加的积分',
              type: 'pie',
              radius: '60%',
              data: $this.columnData.pie_addList,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label:{
                  normal:{
                      formatter: function(params){
                          var str = '';
                          str = params.name+":"+params.percent.toFixed(1)+"%";
                          return str
                      },
                      position: 'outside',
                      fontSize: 13,
                      color: "#666",
                  }
                },
            }
          ]
        };
        option && myChart.setOption(option);
        $this.pieChart = myChart;
      },
      echartsSize(){
        if(this.columnChart){
            this.columnChart.resize();
        }
        if(this.pieChart){
            this.pieChart.resize();
        }
      },
      resetData(){
        var $this = this;
        $this.searchData.ids = [];
        $this.searchData.time = [];
        $this.checkAll = false;
        if($this.columnChart){
          $this.columnChart.dispose();
        }
        if($this.pieChart){
          $this.pieChart.dispose();
        }
      },
      dimensionChangeHandler(obj){
        var $this = this;
        if(!obj.isOn){
            var dateDimension = $this.dateDimension;
            dateDimension.forEach(function(item){
            if(item.value==obj.value){
                item.isOn = true;
                $this.dateSelected = true;
                $this.nowDimension = item.value;
            }else{
                item.isOn = false;
            }
            });
            $this.dateDimension = dateDimension;
            $this.getDefaultTime();
        }
      },
      getDefaultTime(){
        var $this = this;
        if($this.nowDimension == "day"){
            $this.searchData.time = [new Date().toISOString().slice(0, 10), new Date().toISOString().slice(0, 10)]; 
        }else if($this.nowDimension == "week"){
            const now = new Date();
            const dayOfWeek = now.getDay();
            var deltaDay = 0;
            if(dayOfWeek == 0){
                deltaDay = -6;
            }else{
                deltaDay = 1 - dayOfWeek;
            }
            const monday = new Date(now);
            monday.setDate(now.getDate() + deltaDay);
            const sunday = new Date(now);
            sunday.setDate(monday.getDate() + 6);
            $this.searchData.time = [monday.toISOString().slice(0, 10), sunday.toISOString().slice(0, 10)];
        }else if($this.nowDimension == "month"){
            var date = new Date();
            var year = date.getFullYear().toString();
            var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
            var end = '';
            var start = year + '-' + month + '-01';
            if(month == '12'){
              end = (parseInt(year) + 1) + '-01-01';
            }else{
              end = parseInt(month) + 1>9 ? year + '-' + (parseInt(month) + 1)  + '-01':year + '-0' + (parseInt(month) + 1)  + '-01';
            }
            $this.searchData.time = [start, end];
        }
      },
      weekChange(val) {
        let startTime = new Date(val.getTime()); //开始时间
        let endTime = new Date(val.getTime() + (24 * 60 * 60 * 1000) * 6); //结束时间
        let timeArr = [startTime.toISOString().slice(0, 10), endTime.toISOString().slice(0, 10)];
        return timeArr;
      },
      tabChange(inx){
        var $this = this;
        $this.nowChart = inx;
        if($this.columnChart){
          $this.columnChart.dispose();
        }
        $this.columnChart = null;
        if($this.pieChart){
          $this.pieChart.dispose();
        }
        $this.pieChart = null;
        if(inx == 1){
          setTimeout(() => {
            $this.drawColumnChart();  
          }, 500);
          
        }else{
          setTimeout(() => {
            $this.drawPieChart();
          }, 500);
        }
      },
    }
  }
  </script>
  <style lang="scss" scoped>
  
    .chartShow{
      margin-top: 20px;
      padding: 20px;
      background-color: #fff;
      height: calc(100vh - 364px);
      #pieChart, #columnChart{
        width: 100%;
        height: calc(100vh - 446px);
      }
    }
    .checked_item .c_tit, .checked_item .c_name{
      font-size: 14px;
      display: inline-block;
      height: 28px;
      line-height: 28px;
      color: #1a1a1a;
    }
    .checked_item .el-checkbox{
      min-width: 120px;
      margin: 3px;
    }
    .checked_item .el-checkbox-group{
        display: inline-block;
    }
    .search_btn, .reset_btn{
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
    .item-search{
        margin-bottom: 10px;
        .date-range{
            width: 240px;
        }
    }
    .item-search .filter-title{
        width: 70px;
        display: inline-flex;
        align-items: center;
        .txt-title{
            display: block;
            height: 28px;
            line-height: 28px;
            font-size: 14px;
            color: #666666;
            text-align: left;
        }
    }
    .item-change{
        margin-bottom: 10px;
        .item-font{
            float:left;
            border:1px solid #e1e3ea;
            font-size:13px;
            color:#555555;
            padding:5px 12px;
            line-height:20px;
            margin-left:-1px;
            cursor:pointer;
            &.active,&:hover{
                color:#0970ff;
                border:1px solid #0970ff;
                background:#e0e9ff;
                position:relative;
                z-index:2;
            }
        }
        &:after{
            content: "";
            display: block;
            clear: both;
        }
    }
    .item-filter{
        margin-top: 15px;
        margin-bottom: 5px;
    }
    .item-list{
        .item-change{
            display: inline-flex;
            align-items: center;
            margin-bottom: 0;
            margin-right: 20px;
        }
        .item-date{
            display: inline-flex;
            align-items: center;
        }
    }
    .item-btn{
      margin-bottom: 0px!important;
    }
    .group-index .filter-panel .filter-list{
      padding: 18px 30px 15px;
    }
  </style>