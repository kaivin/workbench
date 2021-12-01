<template>

  <div class="rowOneOne flex-content">
    <div class="rowOneOneTit flex-wrap">
      <h3>{{ language == "Module_cnStat" ? "中文" : "英文" }}各部门日目标</h3>
      <div class="item-search flex-content">
        <el-date-picker
          v-model="DaytargetTime"
          size="mini"
          type="date"
          @change="DaytargetHandler"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          style="width: 180px"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="rowOneOneItem clearfix">
      <div class="rowOneOneItemFl">
        <div id="radialBarChart" class="chart-canvas"></div>
      </div>
      <dl class="rowOneOneItemFr">
        <dt>
          {{
            currentCluesData.departID
              ? currentCluesData.departName
              : language == "Module_cnStat"
              ? "中文"
              : "英文"
          }}统计
        </dt>
        <dd>
          历史单日最高<span>({{ targetScore.historymaxnumber.xundate }})</span
          ><strong class="color01">{{
            targetScore.historymaxnumber.maxnumber
          }}</strong>
        </dd>
        <dd>
          本月单日最高<span v-if="targetScore.daymaxnumber.xundate">({{ targetScore.daymaxnumber.xundate }})</span
          ><strong class="color02">{{
            targetScore.daymaxnumber.maxnumber?targetScore.daymaxnumber.maxnumber:0
          }}</strong>
        </dd>
        <!-- <dd v-if="targetScore.isDistanceTarget">距目标线差距<strong>{{targetScore.DistanceTarget}}</strong></dd>
                             <dd v-else>超出目标线<strong>{{targetScore.DistanceTarget}}</strong></dd> -->
      </dl>
      <div class="legendFly">
        <span class="legendItem1">目标询盘</span>
        <span class="legendItem2">询盘数量</span>
        <span class="legendItem6">非搜索询盘</span>
        <span class="legendItem3">达成目标</span>
        <span class="legendItem4">历史最高</span>
        <span class="legendItem5">本月最高</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Mix } from "@antv/g2plot";
import {parseTime}  from "@/utils";
export default {
  name: "module",
  data() {
    return {
     DaytargetTime:'',
    };
  },
  props: {
    language: {
      //中英文
      type: String,
      default: "",
    },
    
    currentCluesData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    targetScore: {
      type: Object,
      default: function () {
        return {};
      },
    },
    depDayTarget: {
      //部门日目标
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  created() {
    this.DaytargetTime = parseTime(new Date(),'{y}-{m}-{d}');
  },
  watch:{
    depDayTarget:{//深度监听，可监听到对象、数组的变化
         handler(val, oldVal){
           
             this.drawDepartTarget(val)
         },
         deep:true //true 深度监听
     }
  },
  methods: {
    // 成交统计月份选择
    DaytargetHandler(val) {
      this.$emit('dateChange',val)
    },
    // 获取地区目标询盘数据
    drawDepartTarget(chatdata) {
      var $this = this;
      var resultData = chatdata;
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
        for (var i = 0; i < resultData.length; i++) {
          if (resultData[i].searchdaynumber) {
            resultData[i].values = [
              resultData[i].searchdaynumber,
              resultData[i].daynumber,
            ];
          } else {
            resultData[i].values = [0, resultData[i].daynumber];
          }
        }
      if ($this.radialBarPlot && !$this.radialBarPlot.chart.destroyed) {
        for(let i = 0;i<$this.radialBarPlot.options.plots.length;i++){
          $this.radialBarPlot.options.plots[i].options.data = resultData;
        }
        $this.radialBarPlot.render();
      } else {
        const radialBarPlot = new Mix("radialBarChart", {
          appendPadding: 8,
          syncViewPadding: true,
          tooltip: {
            shared: true,
            customItems: (originalItems) => {
              for (let i = 0; i < originalItems.length; i++) {
                if (originalItems[i].name == originalItems[i].title) {
                  if (originalItems[i].name == "电商一部") {
                    originalItems[i].name = "非搜索询盘";
                    originalItems[i].value =
                      parseInt(originalItems[i].value.split("-")[1]) -
                      parseInt(originalItems[i].value.split("-")[0]);
                  } else {
                    originalItems[i].name = "询盘数量";
                    originalItems[i].value =
                      parseInt(originalItems[i].value.split("-")[1]) -
                      parseInt(originalItems[i].value.split("-")[0]);
                  }
                }
              }
              return originalItems;
            },
          },
          height: 215,
          plots: [
            {
              //历史最高折线图
              type: "column",
              options: {
                data: resultData,
                xField: "departname",
                yField: "historymaxnumber",
                minColumnWidth: 30,
                maxColumnWidth: 30,
                interactions: [{ type: "active-region", enable: false }],
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
                        strokeOpacity: 0.3,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                      },
                    },
                  },
                  max: maxnum + 10,
                },
                columnStyle: {
                  fill: "#fff",
                  stroke: "#fee4e4",
                  lineWidth: 1,
                  fillOpacity: 0.5,
                },
                color: "#f38080",
                columnWidthRatio: 0.5,
                meta: {
                  historymaxnumber: {
                    alias: "历史最高",
                  },
                },
                label: {
                  style: {
                    fill: "#ff0606",
                    fontWeight: 600,
                  },
                  offsetY: 6,
                  position: "top",
                },
              },
            },
            {
              //目标柱状图
              type: "column",
              options: {
                data: resultData,
                xField: "departname",
                yField: "daytargetnumber",
                minColumnWidth: 30,
                maxColumnWidth: 30,
                interactions: [{ type: "active-region", enable: false }],
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
                        strokeOpacity: 0.3,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                      },
                    },
                  },
                  max: maxnum + 10,
                },
                columnStyle: {
                  fill: "#e7f1ff",
                },
                color: "#e7f1ff",
                columnWidthRatio: 0.5,
                meta: {
                  daytargetnumber: {
                    alias: "目标询盘",
                  },
                },
              },
            },
            {
              //搜索柱状图
              type: "column",
              options: {
                data: resultData,
                xField: "departname",
                yField: "searchdaynumber",
                xAxis: false,
                minColumnWidth: 25,
                maxColumnWidth: 25,
                interactions: [{ type: "active-region", enable: false }],
                yAxis: {
                  grid: {
                    line: {
                      style: {
                        stroke: "#cccccc",
                        lineWidth: 1,
                        lineDash: [3, 2],
                        strokeOpacity: 0,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                      },
                    },
                  },
                  max: maxnum + 10,
                },
                color: "#59cab6",
                columnStyle: (res) => {
                  var obj = {};
                  obj.fill = "#59cab6";
                  if (res.departname == "电商一部") {
                    if (res.searchdaynumber) {
                      resultData.forEach(function (item, index) {
                        if (item.departname == res.departname) {
                          if (res.searchdaynumber >= item.daytargetnumber) {
                            obj.fill = "#f38080";
                          }
                        }
                      });
                    }
                  }
                  return obj;
                },
                columnWidthRatio: 0.4,
                meta: {
                  searchdaynumber: {
                    alias: "搜索询盘",
                  },
                },
                label: {
                  style: {
                    fill: "#FFFFFF",
                  },
                  position: "middle",
                  content: (item) => {
                    if (item.searchdaynumber) {
                      return item.searchdaynumber;
                    }
                  },
                },
              },
            },
            {
              //非搜索区间柱状图
              type: "column",
              options: {
                data: resultData,
                isRange: true,
                xField: "departname",
                yField: "values",
                minColumnWidth: 25,
                maxColumnWidth: 25,
                interactions: [{ type: "active-region", enable: false }],
                xAxis: false,
                yAxis: {
                  grid: {
                    line: {
                      style: {
                        stroke: "#cccccc",
                        lineWidth: 1,
                        lineDash: [3, 2],
                        strokeOpacity: 0,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                      },
                    },
                  },
                  max: maxnum + 10,
                },
                color: (item) => {
                  if (item.departname == "电商一部") {
                    return "#f7c572";
                  } else {
                    return "#59cab6";
                  }
                },
                columnStyle: (item) => {
                  if (item.departname == "电商一部") {
                    return {
                      fill: "#f7c572",
                    };
                  } else {
                    for (let i = 0; i < resultData.length; i++) {
                      if (resultData[i].departname == item.departname) {
                        if (
                          resultData[i].daynumber >=
                          resultData[i].daytargetnumber
                        ) {
                          return {
                            fill: "#f38080",
                          };
                        } else {
                          return {
                            fill: "#59cab6",
                          };
                        }
                      }
                    }
                  }
                },
                columnWidthRatio: 0.4,
                label: {
                  style: {
                    fill: "#FFFFFF",
                  },
                  position: "middle",
                  content: (item) => {
                    if (item.daynumber > 0) {
                      return item.searchdaynumber
                        ? parseInt(item.daynumber) -
                            parseInt(item.searchdaynumber)
                        : parseInt(item.daynumber);
                    }
                  },
                },
              },
            },
            {
              //本月最高折线图
              type: "line",
              options: {
                data: resultData,
                xField: "departname",
                yField: "monthmaxnumber",
                xAxis: false,
                yAxis: {
                  grid: {
                    line: {
                      style: {
                        stroke: "#cccccc",
                        lineWidth: 1,
                        lineDash: [3, 2],
                        strokeOpacity: 0,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                      },
                    },
                  },
                  max: maxnum + 10,
                },

                color: "#fcb030",
                meta: {
                  monthmaxnumber: {
                    alias: "本月最高",
                  },
                },
                lineStyle: {
                  fill: "#fcb030",
                  fillOpacity: 0,
                  lineOpacity: 0,
                  opacity: 0,
                },
                point: {
                  size: 3,
                  shape: "circle",
                  style: {
                    fill: "#fcb030",
                    stroke: "#fcb030",
                  },
                },
                label: {
                  style: {
                    fill: "#fcb030",
                    fontWeight: 600,
                  },
                  position: "top",
                },
              },
            },
          ],
        });

        $this.radialBarPlot = radialBarPlot;
        radialBarPlot.render();
      }
    },
  },
};
</script>

<style>
</style>