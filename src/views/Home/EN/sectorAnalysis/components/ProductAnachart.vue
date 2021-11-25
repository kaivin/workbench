<template>
   <div class="SectorRowProChatBom" :id="id"></div>
</template>
<script>
import { Pie } from "@antv/g2plot";
export default {
  name: "ProductAna",
  props: {
    TabNameAny: {
      type: String,
      default: "",
    },
    ProductAnyDate: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      chartArr: null,
      TabName:'xunnumber',
      ProductAny:this.ProductAnyDate,
      id: Math.random()
        .toString(36)
        .substr(2),
    };
  },
  mounted() {
    var $this=this;    
    $this.ProductAnalyChart();
  },
  watch:{
      TabNameAny(newVal,oldVal){
        this.TabName=newVal;
      },
      ProductAnyDate(newVal,oldVal){
        this.ProductAny=newVal;
        this.ProductAnalyChart();
      }
  },
  methods: {
    // 询盘环形图
    ProductAnalyChart() {
      var $this = this;
        if ($this.chartArr &&!$this.chartArr.chart.destroyed) {
            $this.chartArr.chart.destroy();
        }
      if ($this.chartArr &&!$this.chartArr.chart.destroyed) {
          $this.chartArr.changeData($this.ProductAny);
        } else {
            if($this.ProductAny&&$this.ProductAny.length>0){
                var statTabName='产品询盘\n个数占比';
                if($this.TabName=='xunnumber'){statTabName='产品询盘\n个数占比'};
                if($this.TabName=='buynumber'){statTabName='成交\n个数占比'};
                if($this.TabName=='score'){statTabName='成交\n积分占比'};
                const chartArr = new Pie($this.id, {
                    data:$this.ProductAny,
                    angleField: "value",
                    colorField: "name",
                    height: 358,
                    radius: 0.9,
                    innerRadius: 0.65,
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
                        value: {
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
                    legend:false,
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
                            content: statTabName,                       
                        },
                    },
                    // 添加 中心统计文本 交互
                    interactions: [
                        { type: "element-selected" },
                        { type: "element-active" },
                    ],
                });
                $this.chartArr = chartArr;
                chartArr.render();
            }
        }
    },
  },
};
</script>

<style>
</style>