<template>
    <div class="proAccountBox">
        <div class="proAccountTit">
             <h3>{{currentDate.title}}</h3>
             <p class="btn-group">
                <span @click="changeType(0)" class="btn-item" :class="type == 0?'active':''">成交个数</span>
                <span @click="changeType(1)" class="btn-item" :class="type == 1?'active':''">成交积分</span>
             </p>
        </div>
        <div class="item-map">
            <div class="map-panel"  :style="['width:'+currentDate.mapWidth,'height:'+currentDate.mapHeight]">
                 <div class="map-chart" :id="'map-'+currentDate.randomStr"></div>
            </div>
            <div class="region-rank" :style="'width:'+currentDate.mapWidth">
                <div class="txt-header"><strong>{{currentDate.topTitle}}</strong></div>
                <div class="bar-chart">
                    <div class="top-chart" :id="'bar-'+currentDate.randomStr"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Bar} from '@antv/g2plot';
import { worldCountry } from "@/utils/worldCountry";
import {MapInterval,TopTenColor} from "@/utils/MapColor";
export default {
  name: "proMapChart",
  data:function() {
    return {
      type:0,
      worldRegionMapChart:null,//世界地图
      pieSourcePlot:null,//热门地区TOP10
      currentDate:this.worldMapArr[0],
    };
  },
  props: {
    worldMapArr:{
        type:Array,
        default:function(){
            return []
        } 
    }
  },
  watch:{
    type:function(newval,oldval){
      this.getRuleData();
    }
  },
  mounted(){
    window.addEventListener('resize',this.echartsSize)
    this.getRuleData();
  },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.myChart){
      this.myChart.dispose();
    }
  },
  methods:{
      changeType(val){
        this.type = val;
        if(this.myChart){
          this.myChart.dispose();
        }
      },
      // 处理地图数据
      getRuleData(){
        var $this = this;
        var mapCountData={};
        if($this.type == 0){
          $this.currentDate = $this.worldMapArr[0];
          mapCountData.randomStr=$this.currentDate.randomStr;
          mapCountData.itemArr = worldCountry($this.currentDate.itemArr,"country","number");
        }
        if($this.type == 1){
          $this.currentDate = $this.worldMapArr[1];
          mapCountData.randomStr=$this.currentDate.randomStr;
          mapCountData.itemArr = worldCountry($this.currentDate.itemArr,"country","number");
        }
        $this.$nextTick(function () {
            $this.drawBarChart(mapCountData);
            $this.drawMapChart(mapCountData);
        });
      },
      drawBarChart(dataArr){
        var $this = this;
        if($this.pieSourcePlot&&!$this.pieSourcePlot.chart.destroyed){
          $this.pieSourcePlot.destroy();
        }
        let mapCountData = [];
        mapCountData = dataArr.itemArr.slice(0,10);
        const maxNum =  mapCountData[0].value;
        const mapInterval = MapInterval(maxNum);
        const topTenColor = TopTenColor(mapCountData,mapInterval);
        if(mapCountData.length>0){
          const pieSourcePlot = new Bar('bar-'+dataArr.randomStr, {
          data:mapCountData,
          xField: 'value',
          yField: 'country',
          seriesField: 'country',
          barWidthRatio: 0.4,
          height: 270,
          legend: false,
          appendPadding:[0, 30, 0, 0],
          xAxis:false,
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
      drawMapChart(dataArr){
        var $this = this;
        var maxNum=dataArr.itemArr[0].value;
        let mapInterval = MapInterval(maxNum);
        var myChart = $this.$echarts.init(document.getElementById('map-'+dataArr.randomStr));
        var alias = "";
        if($this.type==0){
          alias = "成交个数";
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
              data: dataArr.itemArr
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
  },
};
</script>

<style></style>