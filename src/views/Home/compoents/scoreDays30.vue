<template>
  <div class="trend-chart">
    <h3>
      {{
        currentCluesData.departID
          ? currentCluesData.departName
          : language == "Module_cnStat"
          ? "中文"
          : "英文"
      }}近30天询盘趋势
    </h3>
    <div id="cluesChart" class="chart-canvas flex-content"></div>
    <div class="trendlegend">
      <span class="legendItem1">总询盘</span>
      <span v-if="isDepart1" class="legendItem2">搜索询盘</span>
      <span class="legendItem3">目标值</span>
      <span class="legendItem4">平均值</span>
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
    currentCluesData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    isDepart1:{
      type:Boolean,
      default:false
    }
  },
  created() {
    
  },
  methods: {
    // 近30天询盘统计趋势图
    drawAreaTrendChart() {
      var $this = this;
      if ($this.currentCluesData.chartData.length > 0) {
        if ($this.areaTrendPlot && !$this.areaTrendPlot.chart.destroyed) {
          $this.areaTrendPlot.chart.destroy();
        }
          const areaTrendPlot = new Area("cluesChart", {
            data: $this.currentCluesData.chartData,
            xField: "date",
            yField: "xunnumber",
            seriesField: "title",
            color: ["#6b9afa", "#316afa"],
            isStack: false,
            areaStyle: () => {
              return {
                fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
              };
            },
            appendPadding: [15, 15, 15, 15],
            height: 370,
            smooth: false,
            legend: false,
            xAxis: {
              tickCount: 10,
              label: {
                offset: 10,
                style: {
                  fill: "#666666",
                  opacity: 0.6,
                  fontSize: 12,
                  lineHeight: 16,
                },
              },
            },
            yAxis: {
              grid: {
                line: {
                  style: {
                    stroke: "#cccccc",
                    lineWidth: 1,
                    lineDash: [3, 2],
                    strokeOpacity: 0.5,
                    shadowColor: null,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    cursor: "pointer",
                  },
                },
              },
            },
            // label
            label: {
              layout: [{ type: "hide-overlap" }], // 隐藏重叠label
              style: {
                textAlign: "center",
                color: "#9e9e9e",
                fontsize: 12,
              },
              formatter: (item) => {
                if ($this.isDepart1) {
                  if (item.title == "搜索询盘") {
                    return item.xunnumber;
                  } else {
                    return null;
                  }
                } else {
                  return item.xunnumber;
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
                if (res.title == "搜索询盘") {
                  obj.opacity = 1;
                } else {
                  if ($this.isDepart1) {
                    obj.opacity = 0;
                    obj.lineWidth = 0;
                    obj.fill = "";
                    obj.r = 0;
                  } else {
                    obj.opacity = 1;
                  }
                }
                return obj;
              },
            },
            tooltip: {
              formatter: (datum) => {
                return { name: datum.title, value: datum.xunnumber };
              },
              title: (e) => {
                return e.replace(/\n/g, " ");
              },
            },
            annotations: [
              // 平均值
              {
                type: "line",
                start: ["min", $this.currentCluesData.avgChartNum],
                end: ["max", $this.currentCluesData.avgChartNum],
                top: true,
                offsetY: 0,
                offsetX: 0,
                style: {
                  stroke: "#f16b6b",
                  lineDash: [6, 4],
                  lineWidth: 1,
                },
              },
              // 平均值
              {
                type: "html",
                position: ["max", $this.currentCluesData.avgChartNum],
                top: true,
                html:
                  "<span class='chart-font avg'><span class='txt-font'>" +
                  $this.currentCluesData.avgChartNum +
                  "</span><i></i></span>",
                alignX: "left",
                alignY: "bottom",
              },
              // 目标线
              {
                type: "line",
                start: ["min", $this.currentCluesData.targetNum],
                end: ["max", $this.currentCluesData.targetNum],
                top: true,
                offsetY: 0,
                offsetX: 0,
                style: {
                  stroke: "#6aa343",
                  lineWidth: 1,
                },
              },
              // 目标线
              {
                type: "html",
                position: ["max", $this.currentCluesData.targetNum],
                top: true,
                html:
                  "<span class='chart-font target'><span class='txt-font'>" +
                  $this.currentCluesData.targetNum +
                  "</span><i></i></span>",
                alignX: "left",
                alignY: "bottom",
              },
            ],
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