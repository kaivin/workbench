<template>
  <div
    class="rowThreeTwo"
    v-if="
      currentCluesData.zugroupdayArr.length > 0 &&
      currentCluesData.zugroupdayArr
    "
  >
    <h3>
      {{
        currentCluesData.departID
          ? currentCluesData.departName
          : language == "Module_cnStat"
          ? "中文"
          : "英文"
      }}小组日询盘成绩
    </h3>
    <div class="rowThreeBox">
      <div id="zugroupdayChart" class="chart-canvas"></div>
      <div class="rowThreeTwolegend">
        <span class="legendItem1">(单位：个)</span>
        <span class="legendItem2">当日数量</span>
        <span class="legendItem3">昨日数量</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Column } from "@antv/g2plot";
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
  },
  created() {
    
  },
  methods: {
    // 日询盘
    zugroupdayChart() {
      var $this = this;
      if($this.zugroupdayColumn&&!$this.zugroupdayColumn.chart.destroyed){
        $this.zugroupdayColumn.chart.destroy();
      }
      if ($this.currentCluesData.zugroupdayArr.length > 0) {
        if ($this.zugroupdayColumn && !$this.zugroupdayColumn.chart.destroyed) {
          $this.zugroupdayColumn.changeData(
            $this.currentCluesData.zugroupdayArr
          );
        } else {
          var resultData = $this.currentCluesData.zugroupdayArr;
          var maxnum = 0;
          for (var i = 0; i < resultData.length; i++) {
            for (var key in resultData[i]) {
              if (
                key != "id" &&
                typeof resultData[i][key] == "number" &&
                resultData[i][key] > maxnum
              ) {
                maxnum = resultData[i][key];
              }
            }
          }
          const zugroupdayColumn = new Column("zugroupdayChart", {
            data: resultData,
            isGroup: true,
            xField: "name",
            yField: "number",
            seriesField: "title",
            width: 500,
            height: 300,
            color: ["#669aff", "#9dd5ff"],
            dodgePadding: 0,
            maxColumnWidth: 25,
            legend: false,
            xAxis: {
              label: {
                offset: 11,
                autoHide: true,
                autoRotate: false,
                style: {
                  fill: "#a1a1a1",
                  opacity: 1,
                  fontSize: 12,
                  lineHeight: 18,
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
              max: maxnum + 10,
            },
            label: {
              position: "top",
              layout: [
                { type: "interval-hide-overlap" },
                { type: "adjust-color" },
              ],
            },
          });
          $this.zugroupdayColumn = zugroupdayColumn;
          zugroupdayColumn.render();
        }
      }
    },
  },
};
</script>

<style>
</style>