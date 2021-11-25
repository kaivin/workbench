<template>
    <div :id="id"></div>
</template>
<script>
import { Area } from "@antv/g2plot";
export default {
  props: ["datSelfContrast"],
  data() {
    return {
      chartArr: null,
      newlist:this.datSelfContrast,
      id: Math.random()
        .toString(36)
        .substr(2)
    };
  },
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    this.contrastChart();
  },
  watch: {
    datSelfContrast: function(val) {
      this.chartArr.changeData(val);
    }
  },
  // 方法集合
  methods: {
    contrastChart() {
      var $this = this;
      if ($this.newlist.length > 0) {   
        const chartArr = new Area($this.id, {
            data: $this.newlist,
            xField: "date",
            yField: "value",
            seriesField: 'name',
            color: ['#6b9afa', '#316afa'],
            isStack:false,
            areaStyle: () => {
            return {
                fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
            };
            },
            appendPadding:[15,15,15,15],
            height: 370,
            smooth:false,
            legend:false,
            xAxis: {
            tickCount:10,
            label: {
                offset:10,
                style: {
                fill: '#666666',
                opacity: 0.6,
                fontSize: 12,
                lineHeight:16,
                },
            },
            },
            yAxis: {
            grid: {
                line: {
                style: {
                    stroke: '#cccccc',
                    lineWidth: 1,
                    lineDash: [3, 2],
                    strokeOpacity: 0.5,
                    shadowColor: null,
                    shadowBlur: 0,
                    shadowOffsetX:0,
                    shadowOffsetY:0,
                    cursor: 'pointer'
                }
                }
            },
            },
            // label
            label: {
            layout: [{ type: 'hide-overlap' }], // 隐藏重叠label
            style: {
                textAlign: 'center',
                color:'#9e9e9e',
                fontsize:12,
            },
            },
            point: {
            size:3,
            shape: 'circle',
            style: (res) => {
                var obj = {
                opacity: 0.5,
                stroke: '#6392ec',
                fill: '#fff',
                }
                return obj;
            },
            },
            tooltip: {
            formatter: (datum) => {
                return { name: datum.name, value: datum.value };
            },
            title:(e)=>{
                return e.replace(/\n/g," ")
            }
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