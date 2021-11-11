<template>
  <div class="rowFive">
    <div class="rowFiveFl">
      <h3>
        {{
          currentCluesData.departID
            ? currentCluesData.departName
            : language == "Module_cnStat"
            ? "中文"
            : "英文"
        }}年度询盘对比
      </h3>
      <div id="yeartongChart" class="chart-canvas"></div>
    </div>
    <div class="rowFiveFr">
      <h3>
        {{
          currentCluesData.departID
            ? currentCluesData.departName
            : language == "Module_cnStat"
            ? "中文"
            : "英文"
        }}年度同期询盘对比
      </h3>
      <div class="rowFiveFrBox">
        <ul class="rowFiveFrBoxFr">
          <li
            v-for="(item, index) in currentCluesData.registerArr"
            :key="index"
            :class="item.isOn ? 'rowFiveOne' : 'rowFiveTwo'"
          >
            <p :style="'border-bottom-width:' + item.isHeight + 'px'">
              <span class="rowFiveNumBom">{{ item.value }}</span>
            </p>
            <span class="rowFiveNumTop">{{ item.year }}</span>
          </li>
        </ul>
        <ul class="rowFiveFrBoxFl">
          <li>
            <span>同比增长量</span
            ><strong
              :class="currentCluesData.registerGrowth > 0 ? '' : 'falling'"
              >{{ Math.abs(currentCluesData.registerGrowth)
              }}<i>{{
                currentCluesData.registerGrowth > 0 ? "↑" : "↓"
              }}</i></strong
            >
          </li>
          <li>
            <span>同比增长率</span
            ><strong
              :class="currentCluesData.registerGrowth > 0 ? '' : 'falling'"
              >{{ currentCluesData.registerRate
              }}<i>{{
                currentCluesData.registerGrowth > 0 ? "↑" : "↓"
              }}</i></strong
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="rowFivelegend">
      <span class="legendItem1">(单位：个)</span>
      <span class="legendItem2">2021年</span>
      <span class="legendItem3">2020年</span>
    </div>
  </div>
</template>

<script>
import {Line} from '@antv/g2plot';
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
    // 年度询盘对比
    yeartongChart() {
      var $this = this;
      if ($this.currentCluesData.yeartongArr.length > 0) {
        var yearArr = [];
        var maxYear = 0;
        var minYear = 0;
        $this.currentCluesData.yeartongArr.forEach(function (item, index) {
          if (!yearArr.includes(parseInt(item.year))) {
            yearArr.push(parseInt(item.year));
          }
        });
        if (yearArr.length == 2) {
          if (yearArr[0] > yearArr[1]) {
            maxYear = yearArr[0];
            minYear = yearArr[1];
          } else if (yearArr[0] < yearArr[1]) {
            maxYear = yearArr[1];
            minYear = yearArr[0];
          } else {
            maxYear = minYear = yearArr[0];
          }
        }
        if ($this.yeartongData && !$this.yeartongData.chart.destroyed) {
          $this.yeartongData.changeData($this.currentCluesData.yeartongArr);
        } else {
          const yeartongData = new Line("yeartongChart", {
            data: $this.currentCluesData.yeartongArr,
            xField: "month",
            yField: "value",
            seriesField: "year",
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
              tickCount: 4,
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
            legend: false,
            // label
            label: {
              style: {
                textAlign: "center",
                color: "#9e9e9e",
                fontsize: 12,
              },
              formatter: (item) => {
                if (item.year == "" + maxYear) {
                  return item.value;
                }
              },
            },
            point: {
              shape: (res) => {
                if (res.year == "" + maxYear) {
                  return "circle";
                }
              },
              size: 3,
              style: (res) => {
                var obj = {
                  opacity: 0.5,
                  stroke: "#6392ec",
                  fill: "#fff",
                };
                if (res.year == "" + maxYear) {
                  obj.opacity = 0.5;
                } else {
                  obj.opacity = 0;
                  obj.lineWidth = 0;
                  obj.fill = "";
                }
                return obj;
              },
            },
            color: ({ year }) => {
              return year === "" + minYear ? "#fbd266" : "#6392ec";
            },
            lineStyle: ({ year }) => {
              if (year === "" + minYear) {
                return {
                  lineDash: [4, 4],
                  opacity: 1,
                };
              }
              return {
                opacity: 0.5,
              };
            },
          });
          $this.yeartongData = yeartongData;
          yeartongData.render();
          var hoverData = [];
          yeartongData.on("tooltip:change", (ev) => {
            hoverData = ev.data.items;
          });
          yeartongData.on("plot:click", (ev) => {
            var mouth = hoverData[0].data.month.replace("月", "");
            var registerArr = [];
            var registerObj = {
              year: hoverData[0].data.year,
              value: 0,
              isOn: false,
              isHeight: 0,
            };
            var lastregisterObj = {
              year: hoverData[1].data.year,
              value: 0,
              isOn: false,
              isHeight: 0,
            };
            $this.currentCluesData.yeartongArr.forEach(function (item, index) {
              if (
                item.month.replace("月", "") < mouth ||
                item.month.replace("月", "") == mouth
              ) {
                //年度同期询盘对比
                if (registerObj.year == item.year) {
                  registerObj.value = registerObj.value + item.value;
                } else {
                  lastregisterObj.value = lastregisterObj.value + item.value;
                }
              }
            });
            if (registerObj.year > lastregisterObj.year) {
              registerObj.isOn = true;
            } else {
              lastregisterObj.isOn = true;
            }
            var MaxVal = "";
            if (registerObj.value > lastregisterObj.value) {
              MaxVal = registerObj.value;
            } else {
              MaxVal = lastregisterObj.value;
            }
            registerObj.isHeight = (registerObj.value / MaxVal) * 244;
            lastregisterObj.isHeight = (lastregisterObj.value / MaxVal) * 244;
            registerArr.push(registerObj, lastregisterObj);
            $this.currentCluesData.registerArr = registerArr;
            var registerGrowth = "";
            var registerRate = "";
            if (registerObj.year >= lastregisterObj.year) {
              registerGrowth = registerObj.value - lastregisterObj.value;
              registerRate =
                Math.abs(
                  (
                    ((registerObj.value - lastregisterObj.value) /
                      lastregisterObj.value) *
                    100
                  ).toFixed(2)
                ) + "%";
            } else {
              registerGrowth = lastregisterObj.value - registerObj.value;
              registerRate =
                Math.abs(
                  (
                    ((lastregisterObj.value - registerObj.value) /
                      registerObj.value) *
                    100
                  ).toFixed(2)
                ) + "%";
            }
            $this.currentCluesData.registerGrowth = registerGrowth;
            $this.currentCluesData.registerRate = registerRate;
          });
        }
      }
    },
  },
};
</script>

<style>
</style>