<template>
    <div :id="id"></div>
</template>
<script>
import { Line } from '@antv/g2plot';
export default {
  props: ["linechartyeartongArr"],
  data() {
    return {
      chartArr: null,
      newlist:this.linechartyeartongArr,
      Recordlist:[],
      minRecord:'',
      maxRecord:'',
      id: Math.random()
        .toString(36)
        .substr(2)
    };
  },
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    this.yeartongChart();
  },
  watch: {
    linechartyeartongArr: function(val) {
      this.chartArr.changeData(val);
    }
  },
  // 方法集合
  methods: {
    yeartongChart() {
      var $this = this;
      if ($this.newlist.dayxuntrend.length > 0) {
        const chartArr = new Line($this.id, {
          data: $this.newlist.dayxuntrend,
          xField: "date",
          yField: "value",
          seriesField: "name",
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
          },
          point: {
            size: 3,
            style: (res) => {
              var obj = {
                opacity: 0.5,
                stroke: "#6392ec",
                fill: "#fff",
              };
              return obj;
            },
          },
        });
        $this.chartArr = chartArr;
        chartArr.render();
      }else{        
        if ($this.chartArr&&!$this.chartArr.chart.destroyed){
          $this.chartArr.chart.destroy();
        }
      }
    },
  }
};
</script>

<style  scoped>
#c1 {
  margin: 20px auto;
  width: 100%;
  position: relative;
}
</style>