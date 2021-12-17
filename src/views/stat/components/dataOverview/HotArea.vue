<template>
  <div class="hxpage">
    <div class="module-top">
      <div class="title-view">
        <div class="title">{{language=="中文"?'年度热门地区TOP10':'年度热门国家TOP10'}}</div>
        <div class="unit">{{type == 1?'（单位：分）':'（单位：个）'}}</div>
        <router-link :to="{path:language == '中文'?'/stat/cn/departAnalysis':'/stat/en/departAnalysis',query:{type:type,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}}" tag="a" target="_blank" class="more">详情 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></router-link>
        <div class="btn-group">
          <div @click="changeType(4)" class="btn-item" :class="type == 4?'active':''">询盘</div>
          <div @click="changeType(5)" class="btn-item" :class="type == 5?'active':''">成交积分</div>
          <div v-if="language=='英文'" @click="changeType(7)" class="btn-item" :class="type == 7?'active':''">成交个数</div>
        </div>
      </div>
      <div class="rowTwoOneItem">
        <div class="map-chart">
          <div v-if="language == '中文'" id="regionMapChart" class="chart-canvas"></div>
          <div v-else id="worldRegionMapChart" class="chart-canvas"></div>
        </div>
        <div class="top-ten">
          <div id="topTen" class="chart-canva"></div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import { Bar} from '@antv/g2plot';
import { worldCountry } from "@/utils/worldCountry";
import { chinaData } from "@/utils/chinaMap";
import {MapInterval,TopTenColor} from "@/utils/MapColor";
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
      departList:{
        type:Array,
        default:function(){
          return []
        }
      }
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
      window.addEventListener('resize',this.echartsSize)
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
        var newYear = newDate.getFullYear();
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
        if(this.type == 4){
          mapCountData = $this.provincecountmap;
        }else if(this.type == 5){
          mapCountData = $this.provincescoretmap;
        }else{
          mapCountData = $this.provincescorenumbertmap;
        }
        if(this.language == '中文'){
          mapCountData = chinaData(mapCountData,"name","number")
          $this.drawCnRegionChart(mapCountData);
        }else{
          mapCountData = worldCountry(mapCountData,"country","number");
          $this.drawEnRegionChart(mapCountData);
        }
        $this.drawTopTen(mapCountData);
      },
      // 中文地区询盘地图
      drawCnRegionChart(dataArr){
        var $this = this;
        var maxNum=dataArr[0].value;
        let mapInterval = MapInterval(maxNum);
        var myChart = $this.$echarts.init(document.getElementById('regionMapChart'));
        var alias = "";
        if($this.type==0){
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
              color: '#333'
            },
            realtime: false, // 拖拽时，是否实时更新
            calculable: true, // 是否显示拖拽用的手柄
            // 定义 在选中范围中 的视觉元素
            inRange: {
              color: mapInterval.defaultColor // 图元的颜色
            },
            inverse:false,
            orient:'vertical',
            itemWidth:9,
            itemHeight:9,
            align:'left',
            textGap:8,
            outOfRange: {
              color: '#eee'
            }
          },
          // geo: {
          //   map: "china",
          //   roam: false,// 一定要关闭拖拽
          //   zoom: 1.2,
          //   label: {
          //     normal: {
          //       show: false, //关闭省份名展示
          //       fontSize: "10",
          //       color: "rgba(0,0,0,0.7)"
          //     },
          //     emphasis: {
          //       show: false
          //     }
          //   },
          //   itemStyle: {
          //     normal: {
          //       areaColor: "#0d0059",
          //       borderColor: "#389dff",
          //       borderWidth: 1, //设置外层边框
          //       shadowBlur: 3,
          //       shadowOffsetY: 3,
          //       shadowOffsetX: 0,
          //       shadowColor: "#01012a"
          //     },
          //     emphasis: {
          //       areaColor: "#184cff",
          //       shadowOffsetX: 0,
          //       shadowOffsetY: 0,
          //       shadowBlur: 3,
          //       borderWidth: 0,
          //       shadowColor: "rgba(0, 0, 0, 0.5)"
          //     }
          //   }
          // },
          series: [
            {
              type: 'map', // 类型
              // 系列名称，用于tooltip的显示，legend 的图例筛选 在 setOption 更新数据和配置项时用于指定对应的系列
              map: 'china', // 地图类型
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
                  borderType: 'solid' // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
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
        this.echartsResize = this.myChart.resize();
      },
      // 热门地区TOP10
      drawTopTen(dataArr){
        var $this = this;
        if($this.pieSourcePlot&&!$this.pieSourcePlot.destroyed){
          $this.pieSourcePlot.destroy();
        }
        let mapCountData = [];
        mapCountData = dataArr.slice(0,10);
        const maxNum =  mapCountData[0].value;
        const mapInterval = MapInterval(maxNum);
        const topTenColor = TopTenColor(mapCountData,mapInterval);
        if(mapCountData.length>0){
          const pieSourcePlot = new Bar('topTen', {
          data:mapCountData,
          xField: 'value',
          yField: $this.language =='中文'?'name':'country',
          seriesField: $this.language =='中文'?'name':'country',
          barWidthRatio: 0.4,
          height: 202,
          legend: false,
          appendPadding:[0, 30, 0, 0],
          xAxis:{
            grid: {
              line: {
                style: {
                  stroke: "#cccccc",
                  lineWidth: 1,
                  lineDash: [3, 2],
                  strokeOpacity: 0.3,
                  shadowColor: null,
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                },
              },
            },
            line:null,
          },
          yAxis:{
            line:null,
            grid:null,
            tickLine:null,
            subTickLine:null
          },
          color:topTenColor,
          label: {
            style: {
              fill: '#999999',
              opacity: 1,
              fontSize: 12
            },
            position: 'right',
            offset:10,
          },
          meta: {
            name: {
              alias: '地区',
            },
            number: {
              alias: $this.type == 0?'数量':'积分'
            },
          },
        });
        $this.pieSourcePlot = pieSourcePlot;
        pieSourcePlot.render();
        }
      },
      // 英文国家地图
      drawEnRegionChart(dataArr){
        var $this = this;
        var maxNum=dataArr[0].value;
        let mapInterval = MapInterval(maxNum);
        var myChart = $this.$echarts.init(document.getElementById('worldRegionMapChart'));
        var alias = "";
        if($this.type==0){
          alias = "询盘个数";
        }else if($this.type==1){
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
              color: '#333'
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
                  borderType: 'solid' // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
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
        this.echartsResize = this.myChart.resize();
      },
      echartsSize(){
        if(this.myChart){
          this.myChart.resize();
        }
      },
    }
}
</script>

<style scoped lang="scss">
.hxpage{
  background: #fff;
  .module-top{
    padding: 15px;
  }
  .title-view{
    height: 24px;
    line-height: 24px;
    margin-bottom: 10px;
    padding: 0 15px;
    .title{
      font-size: 14px;
      color: #1a1a1a;
      float: left;
      margin-right: 4px;
      font-weight: bold;
      span{
        font-size: 12px;
        color: #a1a1a1;
        font-weight: normal;
        margin-left: 10px;
      }
    }
    .unit{
      font-size: 12px;
      color: #a1a1a1;
      float: left;
    }
    .more{
      font-size: 12px;
      color: #a1a1a1;
      float: right;
      cursor: pointer;
      position: relative;
      top: -1px;
      .svg-i{
        font-size: 10px;
        color: #a1a1a1;
        vertical-align: 1px;
      }
    }
    .btn-group{
      float: right;
      margin-right: 20px;
      display: flex;
      .btn-item{
        padding: 0 10px;
        height: 24px;
        text-align: center;
        line-height: 22px;
        border: 1px solid #e1e3ea;
        color: #9ea5af;
        font-size: 12px;
        box-sizing: border-box;
        cursor: pointer;
        margin-left: -1px;
        position: relative;
        &:hover{
          color: #496bf2;
          border: 1px solid #496bf2;
          z-index: 1;
        }
      }
      .active{
        border: 1px solid #496bf2;
        background:#496bf2;
        color: #fff;
        z-index: 1;
        &:hover{
          color: #fff;
        }
      }
    }
  }
  .contrast-view{
    height: 40px;
    margin-bottom: 15px;
    .redtext{
      float: left;
      font-size: 26px;
      color: #eb3737;
      font-weight: bold;
      margin-right: 15px;
    }
    .redright{
      float: left;
      .conname{
        font-size: 12px;
        line-height: 20px;
        color: #999999;
      }
      .num{
        font-size: 12px;
        line-height: 20px;
        padding-left: 12px;
        position: relative;
      }
      .up{
        color: #f25e5e;
        &:before{
          content: '↑';
          position: absolute;
          left: 0;
          font-size: 12px;
          line-height: 12px;
          top: 3px;
          
        }
      }
      .down{
        color: #2dbb4c;
        &:before{
          content: '↓';
          position: absolute;
          left: 0;
          font-size: 12px;
          line-height: 12px;
          top: 3px;
          
        }
      }
    }
  }
  .chart-top{
    height: 68px;
  }
  .module-bottom{
    padding: 20px 30px;
  }
  .map-chart{
    float: left;
    width: 54%;
    .chart-canvas{
      height: 242px;
      line-height: 242px;
      div{
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
  .top-ten{
    float: right;
    width: 46%;
    .chart-canva{
      height: 242px;
    }
  }
  
}
</style>