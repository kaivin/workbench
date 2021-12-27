<template>
  <div class="enquirieTrendBox">
    <div id="cluesChart" class="chart-canvas"></div>
    <div class="trendlegend">
      <span class="legendItem1">{{routTagname}}</span>
      <span class="legendItem2">平均值</span>
    </div>
  </div>
</template>

<script>
import { Area } from "@antv/g2plot";
export default {
  name: "demo",
  data() {
    return {};
  },
  props: {
    enquirieList:{
      type: Array,
      default: function () {
        return [];
      },
    },
    routTagname:{
      type: String,
      default: function () {
        return "";
      },
    },
  },
  watch:{
    enquirieList:{
        handler(val,oldval){
            this.drawAreaTrendChart();
        },
        deep:true
    }
  },
  created() {
    
  },
  methods: {
    // 近30天询盘统计趋势图
    drawAreaTrendChart() {
      var $this = this;
      if ($this.enquirieList.length > 0) {
        if ($this.areaTrendPlot && !$this.areaTrendPlot.chart.destroyed) {
          $this.areaTrendPlot.chart.destroy();
        }
        const areaTrendPlot = new Area("cluesChart", {
            data: $this.enquirieList,
            xField: "time",
            yField: "number",
            isStack: false,
            startOnZero:false,
            color: ["#6b9afa", "#316afa"],
            appendPadding: [15, 0, 0, 0],
            meta: {
                time: {
                   range: [0, 1],
                },
            },
            yAxis:{
                tickCount:3,
                line:{
                    style:{
                        stroke: '#e9e9e9',
                    }
                },
                grid:{
                    line:{
                        style:{
                            stroke: '#f2f2f2',
                            lineWidth: 1,
                            lineDash: [5,1],
                        }
                    }
                },
                label: {
                    style:{
                        lineHeight:18,
                        fill:'#555555',
                    }
                },
            },
            xAxis: {
                tickCount:15,
                line:{
                    style:{
                        stroke: '#e9e9e9',
                    }
                },
                label: {
                    style:{
                        lineHeight:20,
                        fill:'#555',
                    }
                },
            },
            point: {
              size: 3,
              shape: "circle",
              style: (res) => {
                var obj = {
                  opacity: 0.5,
                  stroke: "#6392ec",
                  fill: "#fff",
                };
                return obj;
              },
            },
            tooltip: {
              formatter: (datum) => {
                return { name:$this.routTagname, value: datum.number };
              },
              title: (e) => {
                return e.replace(/\n/g, " ");
              },
            },
            legend: false,
            areaStyle: () => {
                return {
                fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
                };
            },
        });
        $this.areaTrendPlot = areaTrendPlot;
        areaTrendPlot.render();
      }
    },
  },
};
</script>

<style>
</style>