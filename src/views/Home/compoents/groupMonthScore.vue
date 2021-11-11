<template>
  <div
    class="rowThreeOne"
    
  >
    <h3>
      {{
        currentCluesData.departID
          ? currentCluesData.departName
          : language == "Module_cnStat"
          ? "中文"
          : "英文"
      }}小组月询盘成绩
    </h3>
    <div class="rowThreeBox">
      <div id="zugroupmonthChart" class="chart-canvas"></div>
      <div class="rowThreeOnelegend">
        <span class="legendItem1">(单位：个)</span>
        <span class="legendItem2">本月数量</span>
        <span class="legendItem3">上月数量</span>
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
  created() {},
  methods: {
    // 月询盘
    zugroupmonthChart() {
      var $this = this;
       if($this.zugoupmonthColumn&&!$this.zugoupmonthColumn.chart.destroyed){
        $this.zugoupmonthColumn.chart.destroy();
      }
      
      if ($this.currentCluesData.zugoupmonthArr.length > 0) {
        if (
          $this.zugoupmonthColumn &&
          !$this.zugoupmonthColumn.chart.destroyed
        ) {
          $this.zugoupmonthColumn.changeData(
            $this.currentCluesData.zugoupmonthArr
          );
        } else {
          var resultData = $this.currentCluesData.zugoupmonthArr;
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

          const zugoupmonthColumn = new Column("zugroupmonthChart", {
            data: resultData,
            isGroup: true,
            xField: "name",
            yField: "number",
            seriesField: "title",
           
            height: 300,
            //padding:[35,0,30,25],
            /** 设置颜色 */
            color: ["#fcb030", "#f7c572"],
            /** 设置间距 */
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
              // 可手动配置 label 数据标签位置
              position: "top", // 'top', 'middle', 'bottom'
              offset: 4,
              // 可配置附加的布局方法
              layout: [
                // 数据标签防遮挡
                { type: "interval-hide-overlap" },
                // 数据标签文颜色自动调整
                { type: "adjust-color" },
              ],
            },
          });
          $this.zugoupmonthColumn = zugoupmonthColumn;
          zugoupmonthColumn.render();
        }
      }
    },
  },
};
</script>

<style>
</style>