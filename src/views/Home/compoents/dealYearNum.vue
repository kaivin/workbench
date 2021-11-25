<template>
  <div class="rowEightFr">
    <div class="clearfix">
      <h3 style="float: left">
        {{ language == "Module_cnStat" ? "中文" : "英文" }}年度成交积分
        <span style="color: #c1c1c1; font-size: 12px"
          >数据更新于{{ updatemtime[0] }}年{{ updatemtime[1] }}月{{
            updatemtime[2]
          }}日 {{ updatemtime[3] }}时 | 每月更新</span
        >
        <span style="color: #c1c1c1; font-size: 12px; margin-left: 20px"
          >(展示为{{ updateScoremonth }}之间的数据)</span
        >
      </h3>
      <p class="unit">(单位：分)</p>
    </div>
    <p class="totalNum">
      <span
        >{{ language == "Module_cnStat" ? "中文" : "英文" }}总成交积分：</span
      ><strong>{{ currentCluesData.totalNumscore }}</strong>
    </p>
    <div id="yeardepartscoreChart" class="chart-canvas"></div>
  </div>
</template>

<script>
import { Pie } from "@antv/g2plot";
export default {
  name: "demo",
  data() {
    return {};
  },
  props: {
    language: {
      type: String,
      default: "",
    },
    currentCluesData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    updateScoremonth: {
      type: String,
      default: "",
    },
    updatemtime: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  created() {},
  methods: {
    // 中文年度成交积分
    yeardepartscoreChart() {

      var $this = this;
      if (
        $this.yeardepartscoreData &&
        !$this.yeardepartscoreData.chart.destroyed
      ) {
        $this.yeardepartscoreData.chart.destroy();
      }
      var data = $this.currentCluesData.yeardepartscoreArr;
      const yeardepartscoreData = new Pie("yeardepartscoreChart", {
        data,
        angleField: "score",
        colorField: "departname",
        height: 358,
        radius: 0.7,
        innerRadius: 0.6,
        appendPadding: 0,
        color: [
          "#f38080",
          "#ffd29e",
          "#6bddc9",
          "#81a7f1",
          "#b4c4ee",
          "#78D3F8",
          "#9661BC",
          "#F6903D",
          "#008685",
          "#F08BB4",
        ],
        meta: {
          score: {
            formatter: (v) => `${v}`,
          },
        },
        state: {
          active: {
            style: {
              lineWidth: 0,
              fillOpacity: 0.8,
            },
          },
        },
        label: {
          type: "inner",
          offset: "-50%",
          autoRotate: false,
          style: { textAlign: "center" },
          formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
        },
        legend: {
          maxRow: 3,
          position: "left",
          itemHeight: 20,
          offsetY: 36,
          offsetX: 25,
          itemName: {
            formatter(text, item, index) {
              if (data) {
                return text + "：" + data[index].score.toFixed(2);
              }
              return;
            },
          },
        },
        statistic: {
          title: false,
          content: {
            style: {
              fontSize: "14",
              whiteSpace: "pre-wrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.4,
              fontWeight: 500,
              color: "#999",
            },
            content: "部门\n成交占比",
          },
        },
        // 添加 中心统计文本 交互
        interactions: [
          { type: "element-selected" },
          { type: "element-active" },
        ],
      });
      $this.yeardepartscoreData = yeardepartscoreData;
      yeardepartscoreData.render();
    },
  },
};
</script>

<style>
</style>