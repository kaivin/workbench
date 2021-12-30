<template>
  <div class="hxpage region-panel">
    <div class="module-panel">
      <div class="title-view">
        <div class="title">{{language=="中文"?'年度热门地区TOP10':'年度热门国家TOP10'}}</div>
        <div class="unit">{{type == 5?'（单位：分）':'（单位：个）'}}</div>
        <router-link :to="{path:language == '中文'?'/stat/cn/departAnalysis':'/stat/en/departAnalysis',query:{type:type,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}}" tag="a" target="_blank" class="more">详情 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></router-link>
        
        <div class="btn-group">
          <div @click="changeType(4)" class="btn-item" :class="type == 4?'active':''">询盘</div>
          <div @click="changeType(5)" class="btn-item" :class="type == 5?'active':''">成交积分</div>
          <div v-if="language=='英文'" @click="changeType(7)" class="btn-item" :class="type == 7?'active':''">成交个数</div>
        </div>
      </div>
      <div class="chart-view">
        <div class="map-chart">
          <div v-if="language == '中文'" id="regionMapChart" class="chart-canvas"></div>
          <div v-else id="worldRegionMapChart" class="chart-canvas"></div>
        </div>
        <div class="top-ten">
          <div id="topTen" class="chart-canvas"></div>
        </div>
      </div>
      <div class="depart-title"><span>TOP10{{language=="中文"?'地区':'国家'}}部门（{{type == 4?'询盘':type == 5?'成交积分':'成交个数'}}+占比）</span></div>
      <div class="slide-panel" ref="slidePanel" v-on:mouseover="clearTimer($event)" v-on:mouseout="setTimer($event)">
        <div class="slide-box" ref="slideBox" :style="slideStyle">
          <div class="item-slide" :style="itemStyle" v-on:click="clickItem(index)" :class="markIndex===index?'active':''" v-for="(item,index) in currentDepartData">
            <div class="item-box">
              <div class="title-panel" :style="'background:'+item[0].color"><span>NO.{{item[0].index}} {{language == '中文'?item[0].name:item[0].country}}</span></div>
              <div class="depart-list">
                <div class="depart-wrap">
                  <div class="item-depart" v-for="(item1,index1) in item">
                    <div class="txt-name">{{item1.depart}}</div>
                    <div class="txt-value"><span>{{item1.number}}{{type == 5?'分':'个'}}</span></div>
                    <div class="txt-percent">{{item1.percent}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import { Bar} from '@antv/g2plot';
import { worldCountry } from "@/utils/worldCountry";
import { chinaData } from "@/utils/chinaMap";
import {MapInterval,currentColor} from "@/utils/MapColor";
export default {
    name:'demo',
    data(){
      return {
        type:4,//4 询盘  5 成交积分  7 成交个数
        worldRegionMapChart:null,//世界地图
        regionMapChart:null,//中国地图
        pieSourcePlot:null,//热门地区TOP10
        startTime:"",
        endTime:"",
        baseDepart:"",
        contrastDepart:"",
        currentDepartData:[],
        markIndex:10,
        timer:null,
        slideStyle:{},
        itemStyle:{},
        itemWidth:0,
        initName:"",
        initCountry:"",
      }
    },
    props:{
      language:{
        type:String,
        default:"中文"
      },
      provincecountmap:{//询盘地图
          type:Array,
          default:function(){
            return []
          } 
      }, 
      provincescoretmap:{//成交积分地图
        type:Array,
        default:function(){
          return []
        } 
      },
      provincescorenumbertmap:{//成交个数地图
        type:Array,
        default:function(){
          return []
        } 
      },
      regionInquiryCountDepart:{//地区各部门询盘
        type:Array,
        default:function(){
          return []
        } 
      },
      regionDealScoreDepart:{//地区各部门成交积分
        type:Array,
        default:function(){
          return []
        } 
      },
      regionDealCountDepart:{//地区各部门成交个数
        type:Array,
        default:function(){
          return []
        } 
      },
      departList:{
        type:Array,
        default:function(){
          return []
        }
      },
      year:{
        type: Number,
        default: new Date().getFullYear()
      },
    },
    watch:{
      provincecountmap:{
        handler(newval,oldval){
          this.getRuleData();
        },
        deep:true
      },
      type:function(newval,oldval){
        this.getRuleData();
      }
    },
    mounted(){
      var $this = this;
      window.addEventListener('resize',this.echartsSize)
      let slideElement = $this.$refs.slideBox;
      slideElement.addEventListener('transitionend',()=>{
        $this.slideMinMax();
      })
    },
    destroyed(){
      window.removeEventListener('resize',this.echartsSize);
      if(this.myChart){
        this.myChart.dispose();
      }
    },
    methods:{
      goPage(){
        var $this = this;
        var newDate = new Date();
        // var newYear = newDate.getFullYear();
        var newYear = $this.year;
        var startTime = newYear + "/01";
        var endTime = newYear + "/12";
        var baseDepart = "";
        var contrastDepartArr = [];
        this.departList.forEach(function(item,index){
          if(index == 0){
            baseDepart = item.id;
          }else{
            contrastDepartArr.push(item.id);
          }
        });
        var contrastDepart = "";
        if(contrastDepartArr.length>0){
          contrastDepart = contrastDepartArr.join(",");
        }
        $this.startTime = startTime;
        $this.endTime = endTime;
        $this.baseDepart = baseDepart;
        $this.contrastDepart = contrastDepart;
      },
      changeType(val){
        this.type = val;
      },
      // 处理地图数据
      getRuleData(){
        var $this = this;
        $this.goPage();
        let mapCountData = [];
        let currentDepartData = [];
        if(this.type == 4){
          mapCountData = $this.provincecountmap;
          currentDepartData = $this.regionInquiryCountDepart;
        }else if(this.type == 5){
          mapCountData = $this.provincescoretmap;
          currentDepartData = $this.regionDealScoreDepart;
        }else{
          mapCountData = $this.provincescorenumbertmap;
          currentDepartData = $this.regionDealCountDepart;
        }
        if(this.language == '中文'){
          mapCountData = chinaData(mapCountData,"name","number")
          var maxNum=mapCountData[0].value;
          let mapInterval = MapInterval(maxNum);
          currentDepartData.forEach(function(item,index){
            mapCountData.forEach(function(item1){
              if(item[0].province == item1.name){
                item.forEach(function(item2){
                  item2.name = item1.name;
                  item2.index =index+1;
                  item2.depart = item2.departname.substring(2);
                  item2.percent = item2.number==0||item1.value==0?'0%':parseInt(item2.number/item1.value*100)+"%";
                  item2.color = currentColor(item1.value,mapInterval);
                });
              }
            });
          });
          $this.drawCnRegionChart(mapCountData);
        }else{
          mapCountData = worldCountry(mapCountData,"country","number");
          var maxNum=mapCountData[0].value;
          let mapInterval = MapInterval(maxNum);
          currentDepartData.forEach(function(item,index){
            mapCountData.forEach(function(item1){
              if(item[0].country == item1.country){
                item.forEach(function(item2){
                  item2.name = item1.name;
                  item2.index =index+1;
                  item2.depart = item2.departname.substring(2);
                  item2.percent = item2.number==0||item1.value==0?'0%':parseInt(item2.number/item1.value*100)+"%";
                  item2.color = currentColor(item1.value,mapInterval);
                });
              }
            });
          });
          $this.drawEnRegionChart(mapCountData);
        }
        $this.drawTopTen(mapCountData);
        let regionDepartList = [...currentDepartData,...currentDepartData,...currentDepartData]
        $this.currentDepartData = regionDepartList;
        $this.markIndex = 10;
        $this.clearTimer();
        $this.setSize();
        $this.setTimer();
      },
      // 中文地区询盘地图
      drawCnRegionChart(dataArr){
        var $this = this;
        $this.initName = dataArr[0].name;
        var maxNum=dataArr[0].value;
        let mapInterval = MapInterval(maxNum);
        var myChart = $this.$echarts.init(document.getElementById('regionMapChart'));
        var alias = "";
        if($this.type==4){
          alias = "询盘个数";
        }else{
          alias = "成交积分";
        }
        var option = {
          // 提示框组件
          tooltip: {
            trigger: 'item', // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
            // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
            // 使用函数模板  传入的数据值 -> value: number | Array
            backgroundColor:'rgba(255, 255, 255, 0.9)',
            extraCssText: 'box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);',
            showDelay: 0,
            padding:[5,10],
            transitionDuration: 0.2,
            formatter: function (params) {
              if(params.data){
                return `<div class="echarts-tooltip">
                  <div class="tooltip-list">
                    <div class="item-tooltip">
                      <span class="icon" style="background:${params.color}"></span>
                      <span class="name">地区：</span>
                      <div class="num">${params.data.name}</div>
                    </div>
                    <div class="item-tooltip">
                      <span class="icon" style="background:${params.color}"></span>
                      <span class="name">${alias}：</span>
                      <div class="num">${params.data.value}</div>
                    </div>
                  </div>
                </div>`
              }
            },
            textStyle:{
              fontSize:12,
              color:'#333'
            }
          },
          // 视觉映射组件
          visualMap: {
            type: 'piecewise', // continuous 类型为连续型  piecewise 类型为分段型
            pieces:mapInterval.pieces,
            left:0,
            bottom:0,
            zlevel:1,
            // 文本样式
            textStyle: {
              height: 140,
              lineHeight:140,
              fontSize: 12,
              color: '#999'
            },
            realtime: false, // 拖拽时，是否实时更新
            calculable: true, // 是否显示拖拽用的手柄
            // 定义 在选中范围中 的视觉元素
            inRange: {
              color: mapInterval.defaultColor // 图元的颜色
            },
            inverse:true,
            orient:'horizontal',
            itemWidth:9,
            itemHeight:9,
            align:'left',
            textGap:8,
            outOfRange: {
              color: '#eee'
            }
          },
          geo: {
            map: "china",
            roam: false,// 一定要关闭拖拽
            zoom: 1.1,
            label: {
              show: false // 是否显示对应地名
            },
            itemStyle: {
              borderWidth: 0.5, // 描边线宽 为 0 时无描边
              borderColor: '#999', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
              borderType: 'solid', // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
              shadowOffsetY: 8,
              shadowOffsetX: 0,
              shadowColor: 'rgba(128, 217, 248, 1)',
              shadowBlur: 8,
            },
            emphasis: {
              itemStyle:{
                areaColor: "#eee",
                shadowOffsetY: 8,
                shadowOffsetX: 0,
                borderWidth: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
                shadowBlur: 8,
              }
            }
          },
          series: [
            {
              type: 'map', // 类型
              // 系列名称，用于tooltip的显示，legend 的图例筛选 在 setOption 更新数据和配置项时用于指定对应的系列
              map: 'china', // 地图类型
              // 是否开启鼠标缩放和平移漫游 默认不开启 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move' 设置成 true 为都开启
              roam: false,
              zoom:1.1,
              // 自定义地区的名称映射
              // nameMap:worldNameMap(),
              // 图形上的文本标签
              label: {
                show: false // 是否显示对应地名
              },
              // 地图区域的多边形 图形样式
              itemStyle: {
                borderWidth: 0.5, // 描边线宽 为 0 时无描边
                borderColor: '#999', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
                borderType: 'solid' // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
              },
              // 高亮状态下的多边形和标签样式
              emphasis: {
                label: {
                  show: false, // 是否显示标签
                },
                itemStyle: {
                  areaColor: 'yellow', // 地图区域的颜色
                  borderWidth: 0.5, // 描边线宽 为 0 时无描边
                  borderColor: '#999', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
                  borderType: 'solid', // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
                  shadowBlur: 8,
                  borderWidth: 0,
                  shadowColor: "rgba(0, 0, 0, 0.4)"
                }
              },
              // 地图系列中的数据内容数组 数组项可以为单个数值
              data: dataArr
            },
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        this.myChart = myChart;
        let mapCountData = [];
        mapCountData = dataArr.slice(0,10);
        var mapName = [];
        mapCountData.forEach(function(item){
          mapName.push(item.name);
        });
        this.myChart.on('mousemove',function(params){
          $this.clearTimer();
          if(params.data&&mapName.includes(params.data.name)){
            $this.topTenChart.dispatchAction({
              type: 'highlight',
              seriesIndex:0,
              name:params.data.name
            });
          }
        });
        this.myChart.on('mouseout',function(params){
          $this.setTimer();
          if(params.data&&mapName.includes(params.data.name)){
            $this.topTenChart.dispatchAction({
              type: 'downplay',
              seriesIndex:0,
              name:params.data.name
            })
          }
        });
        this.echartsResize = this.myChart.resize();
      },
      // 热门地区TOP10
      drawTopTen(dataArr){
        var $this = this;
        let mapCountData = [];
        mapCountData = dataArr.slice(0,10);
        const maxNum =  mapCountData[0].value;
        const mapInterval = MapInterval(maxNum);
        var topTenChart = $this.$echarts.init(document.getElementById('topTen'));
        var alias = "";
        if($this.type==4){
          alias = "询盘个数";
        }else if($this.type==5){
          alias = "成交积分";
        }else{
          alias = "成交个数";
        }
        var name = "";
        if($this.language=="中文"){
          name = "地区";
        }else{
          name = "国家";
        }
        var option = {
          // 提示框组件
          tooltip: {
            trigger: 'item', // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
            // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
            // 使用函数模板  传入的数据值 -> value: number | Array
            backgroundColor:'rgba(255, 255, 255, 0.9)',
            extraCssText: 'box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);',
            showDelay: 0,
            padding:[5,10],
            transitionDuration: 0.2,
            formatter: function (params) {
              if($this.language == "中文"){
                return `<div class="echarts-tooltip">
                  <div class="tooltip-list">
                    <div class="item-tooltip">
                      <span class="icon" style="background:${params.color}"></span>
                      <span class="name">${name}：</span>
                      <div class="num">${$this.language=="中文"?params.data.name:params.data.country}</div>
                    </div>
                    <div class="item-tooltip">
                      <span class="icon" style="background:${params.color}"></span>
                      <span class="name">${alias}：</span>
                      <div class="num">${params.data.value}</div>
                    </div>
                  </div>
                </div>`
              }else{
                return `<div class="echarts-tooltip">
                  <div class="tooltip-list">
                    <div class="item-tooltip">
                      <span class="icon" style="background:${params.color}"></span>
                      <span class="name">${name}：</span>
                      <div class="num">${$this.language=="中文"?params.data.name:params.data.country}</div>
                    </div>
                    <div class="item-tooltip">
                      <span class="icon" style="background:${params.color}"></span>
                      <span class="name">英文名：</span>
                      <div class="num">${params.data.name}</div>
                    </div>
                    <div class="item-tooltip">
                      <span class="icon" style="background:${params.color}"></span>
                      <span class="name">${alias}：</span>
                      <div class="num">${params.data.value}</div>
                    </div>
                  </div>
                </div>`
              }
            },
            textStyle:{
              fontSize:12,
              color:'#333'
            }
          },
          dataset:{
            source:mapCountData
          },
          grid: { containLabel: true },
          xAxis: { 
            type: 'value',
            scale: true,
            position: 'top',
            splitNumber:2,
            max: function (value) {
              var len = value.max.toString().length;
              if(len>2){
                return (parseInt(value.max/Math.pow(10,len-1))+2)*Math.pow(10,len-1)
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                  color: '#455B77',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              margin: 2,
              textStyle: {
                  color: '#c0e6f9',
              },
            },
            splitLine:{
              lineStyle:{
                color: '#c0e6f9',
                type:'dashed',
                opacity:0.2
              }
            }
          },
          yAxis: { 
            type: 'category',
            inverse:true,
            nameGap: 16,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#455B77',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              rotate:$this.language=="英文"?45:0,
              textStyle: {
                  color: '#c0e6f9',
                  
              },
            },
          },
          visualMap: {
            type: 'piecewise', // continuous 类型为连续型  piecewise 类型为分段型
            pieces:mapInterval.pieces,
            // 文本样式
            textStyle: {
              height: 140,
              lineHeight:140,
              fontSize: 12,
              color: '#999'
            },
            realtime: false, // 拖拽时，是否实时更新
            calculable: true, // 是否显示拖拽用的手柄
            // 定义 在选中范围中 的视觉元素
            inRange: {
              color: mapInterval.defaultColor // 图元的颜色
            },
            inverse:false,
            orient:'horizontal',
            outOfRange: {
              color: '#eee'
            },
            show:false,
          },
          series: [
            {
              type: 'bar',
              encode: {
                // Map the "amount" column to X axis.
                x: 'value',
                // Map the "product" column to Y axis
                y: $this.language=="中文"?'name':'country'
              },
              barWidth:15,
              label: {
                show: true, // 是否显示标签
                position:'right',
                borderWidth:0,
                color: '#c0e6f9',
              },
              // 高亮状态下的多边形和标签样式
              emphasis: {
                itemStyle: {
                  color: 'yellow', // 地图区域的颜色
                }
              },
            }
          ]
        };
        topTenChart.setOption(option);
        this.topTenChart = topTenChart;
        this.topTenChart.on('mousemove',function(params){
          $this.clearTimer();
          $this.myChart.dispatchAction({
            type: 'highlight',
            seriesIndex:0,
            name:params.data.name
          })
        });
        this.topTenChart.on('mouseout',function(params){
          $this.setTimer();
          $this.myChart.dispatchAction({
            type: 'downplay',
            seriesIndex:0,
            name:params.data.name
          })
        });
      },
      // 英文国家地图
      drawEnRegionChart(dataArr){
        var $this = this;
        $this.initName = dataArr[0].name;
        $this.initCountry = dataArr[0].country;
        var maxNum=dataArr[0].value;
        let mapInterval = MapInterval(maxNum);
        var myChart = $this.$echarts.init(document.getElementById('worldRegionMapChart'));
        var alias = "";
        if($this.type==4){
          alias = "询盘个数";
        }else if($this.type==5){
          alias = "成交积分";
        }else{
          alias = "成交个数";
        }
        var option = {
          // 提示框组件
          tooltip: {
            trigger: 'item', // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
            // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
            // 使用函数模板  传入的数据值 -> value: number | Array
            backgroundColor:'rgba(255, 255, 255, 0.9)',
            extraCssText: 'box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);',
            showDelay: 0,
            padding:[5,10],
            transitionDuration: 0.2,
            formatter: function (params) {
                  return `<div class="echarts-tooltip">
                    <div class="tooltip-list">
                      <div class="item-tooltip">
                        <span class="icon" style="background:${params.color}"></span>
                        <span class="name">国家：</span>
                        <div class="num">${params.data.country}</div>
                      </div>
                      <div class="item-tooltip">
                        <span class="icon" style="background:${params.color}"></span>
                        <span class="name">英文名：</span>
                        <div class="num">${params.data.name}</div>
                      </div>
                      <div class="item-tooltip">
                        <span class="icon" style="background:${params.color}"></span>
                        <span class="name">${alias}：</span>
                        <div class="num">${params.data.value}</div>
                      </div>
                    </div>
                  </div>`
            },
            textStyle:{
              fontSize:12,
              color:'#333'
            }
          },
          geo: {
            map: "world",
            roam: false,// 一定要关闭拖拽
            zoom: 1.2,
            label: {
              show: false // 是否显示对应地名
            },
            itemStyle: {
              borderWidth: 0.5, // 描边线宽 为 0 时无描边
              borderColor: '#999', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
              borderType: 'solid', // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
              shadowOffsetY: 8,
              shadowOffsetX: 0,
              shadowColor: 'rgba(128, 217, 248, 1)',
              shadowBlur: 8,
            },
            emphasis: {
              itemStyle:{
                areaColor: "#eee",
                shadowOffsetY: 8,
                shadowOffsetX: -8,
                borderWidth: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          },
          // 视觉映射组件
          visualMap: {
            type: 'piecewise', // continuous 类型为连续型  piecewise 类型为分段型
            // 指定 visualMapContinuous 组件的允许的最小/大值。'min'/'max' 必须用户指定。
            // [visualMap.min, visualMax.max] 形成了视觉映射的『定义域』
            pieces:mapInterval.pieces,
            left:0,
            bottom:0,
            right:0,
            top:'auto',
            // 文本样式
            textStyle: {
              height: 140,
              lineHeight:140,
              fontSize: 12,
              color: '#999'
            },
            realtime: false, // 拖拽时，是否实时更新
            calculable: true, // 是否显示拖拽用的手柄
            // 定义 在选中范围中 的视觉元素
            inRange: {
              color: mapInterval.defaultColor // 图元的颜色
            },
            inverse:true,
            orient:'horizontal',
            itemWidth:9,
            itemHeight:9,
            align:'left',
            textGap:8,
            outOfRange: {
              color: '#eee'
            }
          },
          series: [
            {
              type: 'map', // 类型
              // 系列名称，用于tooltip的显示，legend 的图例筛选 在 setOption 更新数据和配置项时用于指定对应的系列
              map: 'world', // 地图类型
              // 是否开启鼠标缩放和平移漫游 默认不开启 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move' 设置成 true 为都开启
              roam: false,
              zoom:1.2,
              // 自定义地区的名称映射
              // nameMap:worldNameMap(),
              // 图形上的文本标签
              label: {
                show: false // 是否显示对应地名
              },
              // 地图区域的多边形 图形样式
              itemStyle: {
                borderWidth: 0.5, // 描边线宽 为 0 时无描边
                borderColor: '#999', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
                borderType: 'solid' // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
              },
              // 高亮状态下的多边形和标签样式
              emphasis: {
                label: {
                  show: false, // 是否显示标签
                },
                itemStyle: {
                  areaColor: 'yellow', // 地图区域的颜色
                  borderWidth: 0.5, // 描边线宽 为 0 时无描边
                  borderColor: '#999', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
                  borderType: 'solid', // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
                  shadowBlur: 8,
                  borderWidth: 0,
                  shadowColor: "rgba(0, 0, 0, 0.4)"
                }
              },
              // 地图系列中的数据内容数组 数组项可以为单个数值
              data: dataArr
            },
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        this.myChart = myChart;
        let mapCountData = [];
        mapCountData = dataArr.slice(0,10);
        var mapName = [];
        mapCountData.forEach(function(item){
          mapName.push(item.country);
        });
        this.myChart.on('mousemove',function(params){
          $this.clearTimer();
          if(params.data&&mapName.includes(params.data.country)){
            $this.topTenChart.dispatchAction({
              type: 'highlight',
              seriesIndex:0,
              name:params.data.country
            })
          }
        });
        this.myChart.on('mouseout',function(params){
          $this.setTimer();
          if(params.data&&mapName.includes(params.data.country)){
            $this.topTenChart.dispatchAction({
              type: 'downplay',
              seriesIndex:0,
              name:params.data.country
            })
          }
        });
        this.echartsResize = this.myChart.resize();
      },
      echartsSize(){
        if(this.myChart){
          this.myChart.resize();
        }
      },
      // 初始化设置
      setSize(){
        var maxWidth = this.$refs.slidePanel.offsetWidth;
        var itemWidth = parseInt(maxWidth/3.5);
        var totalLength = this.currentDepartData.length;
        var trueWidth = itemWidth*totalLength+30;
        this.slideStyle = {
          width:`${trueWidth}px`,
          'transitionDuration':'0ms',
          'transform':`translate(${-itemWidth*(this.currentDepartData.length/3-1)}px,0)`
        }
        this.itemWidth = itemWidth;
        this.itemStyle = {
          width:`${itemWidth}px`,
        }
        this.myChart.dispatchAction({
          type: 'downplay',
          seriesIndex:0,
        })
        this.topTenChart.dispatchAction({
          type: 'downplay',
          seriesIndex:0,
        })
        this.myChart.dispatchAction({
          type: 'highlight',
          seriesIndex:0,
          name:this.initName
        })
        this.topTenChart.dispatchAction({
          type: 'highlight',
          seriesIndex:0,
          name:this.language=="英文"?this.initCountry:this.initName
        })
      },
      // 轮播项点击事件
      clickItem(index){
        var $this = this;
        $this.markIndex = index;
        $this.slideStyle = Object.assign({},$this.slideStyle,{
          transform:`translate(${-($this.markIndex-1)*$this.itemWidth}px,0)`,
          'transitionDuration':'500ms'
        });
        $this.highLight($this.markIndex);
      },
      // 清除自动轮播
      clearTimer(){
        clearInterval(this.timer);
        this.timer = null;
      },
      // 开启轮播
      setTimer(){
        clearInterval(this.timer);
        this.loop();
      },
      // 自动轮播
      loop(){
        var $this = this;
        $this.timer = setInterval(() => {
          $this.markIndex++;
          $this.slideStyle = Object.assign({},$this.slideStyle,{
            transform:`translate(${-($this.markIndex-1)*$this.itemWidth}px,0)`,
            'transitionDuration':'500ms'
          });
          $this.highLight($this.markIndex);
        }, 2000);
      },
      // 联动高亮
      highLight(idx){
        var $this = this;
        var name = "";
        var country = "";
        $this.currentDepartData.forEach(function(item,index){
          if(index === idx){
            name = item[0].name;
            if($this.language=="英文"){
              country = item[0].country;
            }
          }
        });
        $this.topTenChart.dispatchAction({
          type: 'downplay',
          seriesIndex:0,
        })
        $this.myChart.dispatchAction({
          type: 'downplay',
          seriesIndex:0,
        })
        $this.topTenChart.dispatchAction({
          type: 'highlight',
          seriesIndex:0,
          name:$this.language=="英文"?country:name
        })
        $this.myChart.dispatchAction({
          type: 'highlight',
          seriesIndex:0,
          name:name
        })
      },
      // 无缝轮播临界判断
      slideMinMax(){
        var $this = this;
        if($this.markIndex >= $this.currentDepartData.length/3*2){
          $this.markIndex = 10;
          $this.slideStyle = Object.assign({},$this.slideStyle,{
            transform:`translate(${-$this.itemWidth*($this.markIndex-1)}px,0)`,
            'transitionDuration':'0ms'
          })
        }
        if($this.markIndex <= $this.currentDepartData.length/3-1){
          $this.markIndex = $this.currentDepartData.length/3*2-1;
          $this.slideStyle = Object.assign({},$this.slideStyle,{
            transform:`translate(${-$this.itemWidth*($this.markIndex-1)}px,0)`,
            'transitionDuration':'0ms'
          })
        }
        $this.slideStyle = Object.assign({},$this.slideStyle,{
          'transitionDuration':'0ms'
        })
        if($this.timer===null){
          $this.loop();
        }
      },
    }
}
</script>

<style scoped lang="scss">
</style>