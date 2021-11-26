<template>
    <div :id="id" class="chart-panel"></div>
</template>
<script>
import { Area } from "@antv/g2plot";
export default {
  props: ["dayEnquiriesTrendArr"],
  data() {
    return {
      chartArr: null,
      newlist:this.dayEnquiriesTrendArr,
      id: Math.random()
        .toString(36)
        .substr(2)
    };
  },
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    this.TrendChart();
  },
  watch: {
    dayEnquiriesTrendArr: function(val) {
      this.chartArr.changeData(val);
    }
  },
  // 方法集合
methods: {
    TrendChart() {
      var $this = this;
      if ($this.newlist.dayxuntrend.length > 0) {
          var colorDate=['#75adfa', '#59cab6', '#ff7e24', '#8a80b9', '#ff5a5a'];
          var areaArr=[];
          const chartArr = new Area($this.id, {
            data: $this.newlist.dayxuntrend,
            xField: "date",
            yField: "value",
            seriesField: 'name',
            isStack:false,
            color: $this.newlist.dayxuntrend.length==1?colorDate[0]:colorDate,
            appendPadding:[30,15,15,15],
            yAxis:{
              grid:{
                line:{
                  style:{
                    stroke: 'black',
                    lineWidth:1,
                    lineDash:[6,3],
                    strokeOpacity:0.1,
                    shadowBlur:0
                  }
                }
              },
            },
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
            legend:{
              layout:'horizontal',
              position:'top',
              flipPage:false,
              offsetX:60,
              offsetY:0,
              label:{
                style:{
                  textBaseline:"middle"
                }
              },
            },
            areaStyle: (data) => {
              var itemColor = "";
              $this.newlist.dayxuntrend.forEach(function(item){
                if(item.name){
                  if(item.name == data.name){
                    itemColor = item.color;
                  }
                }else{
                  itemColor = item.color;
                }
              });
              return {
                fill: 'l(270) 0:#ffffff 1:'+itemColor,
              };
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