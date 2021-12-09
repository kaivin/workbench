<template>
    <div class="map-chart" :id="'map-'+idData"></div>
</template>

<script>
import { G2 } from '@antv/g2plot';
import DataSet from '@antv/data-set';
import {MapColor} from "@/utils/MapColor"
export default {
  name: "wordMapChart",
  data:function() {
    return {
      parentData:{},
    };
  },
  props: {
    chartData: {
      type: Array,
      default:[],
    },
    colorData:{
      type: Object,
      default: function () {
        return {};
      },
    },
    idData:{
      type: String,
      default: "",
    },
    aliasData:{
      type: String,
      default: "",
    },
    mapWidth:{
      type: Number,
      default: 0,
    },
    mapHeight:{
      type: Number,
      default: 0,
    },
  },
  computed:{
    currentData(){
      return this.chartData;
    },
  },
  watch: {
    colorData:{
      handler(newValue, oldValue) {
        this.parentData = newValue;
        // if(this.regionMapChart&&!this.regionMapChart.destroyed){
        //   this.regionMapChart.destroy();
        // }
        // this.drawMapChart();
      },
      deep: true,
      immediate:true
    },
  },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.myChart){
      this.myChart.dispose();
    }
  },
  mounted(){
    window.addEventListener('resize',this.echartsSize)
    this.drawMapChart();
  },
  methods:{
    drawMapChart(){
      var $this = this; 
      var myChart = $this.$echarts.init(document.getElementById('map-'+$this.idData));
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
                      <span class="name">数量：</span>
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
          pieces:$this.colorData.pieces,
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
            color: $this.colorData.defaultColor // 图元的颜色
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
            data: $this.currentData
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