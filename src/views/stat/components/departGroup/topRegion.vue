﻿<template>
    <div class="top-chart" :id="'bar-'+idData"></div>
</template>

<script>
import { Bar } from '@antv/g2plot';
export default {
  name: "topRegion",
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
      type: Array,
      default: [],
    },
    idData:{
      type: String,
      default: "",
    },
    aliasData:{
      type: String,
      default: "",
    },
    barHeight:{
      type: Number,
      default: 0,
    },
    isCn:{
      type: Boolean,
      default: true,
    },
  },
  computed:{
    currentData(){
      return this.chartData;
    },
    colorArr(){
      return this.colorData;
    }
  },
  mounted(){
    this.drawBarChart();
  },
  methods:{
    drawBarChart(){
      var $this = this; 
      if(!$this.barPlot){
        const barPlot = new Bar('bar-'+$this.idData, {
        data:$this.currentData,
        xField: 'value',
        yField: $this.isCn?'name':'country',
        seriesField: $this.isCn?'name':'country',
        barWidthRatio: 0.4,
        height: $this.barHeight,
        legend: false,
        appendPadding:[0, 50, 20, 0],
        xAxis:false,
        yAxis:{
          line:null,
          grid:null,
          tickLine:null,
          subTickLine:null
        },
        //color:['#ae1222','#f27042','#f1de5f','#a2bfcd', '#b3b3b3'],
        color:$this.colorArr,
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
            alias: $this.aliasData,
          },
        },
      });
      $this.barPlot = barPlot;
      barPlot.render();
      }
    }
  },
};
</script>

<style></style>