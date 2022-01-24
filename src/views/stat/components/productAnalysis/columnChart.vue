<template>
    <div class="chart-pie" style="height:280px;" id="columnChart"></div> 
</template>
<script>
import * as echarts from 'echarts';
export default {
  name: "columnChart",
  props: {
    chartList:{
      type: Object,
      default: function () {
        return {};
      },
    }
  },
  data() {
    return {
    };
  },
  watch: {
    chartList:{
      handler(newValue, oldValue) {
        this.drawColumnChart();
      },
      deep: true
    },
  },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.myChart){
        this.myChart.dispose();
    }
  },
  mounted(){
      var $this = this;
      window.addEventListener('resize',$this.echartsSize);
  },
  methods: {
    // 占比图例
    drawColumnChart(){
      var $this = this;
      var chartDom = document.getElementById('columnChart');
      var myChart = echarts.init(chartDom);
      var xAxiData=[];
      var serieData=[];
      $this.chartList.chartList.forEach(function(item,index){
        serieData.push(item.value);
        xAxiData.push(item.name);
      });
      var option;
      option = {
          tooltip: {
              trigger: 'item'
          },
          grid: {
              left:20,
              right:0,
              bottom:0,
              top:10,
              containLabel: true
          },
          xAxis: {
            type: 'category',
            data:xAxiData,
            axisLabel: {
              interval: 0,
              rotate: 30
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data:serieData,
              barWidth:20,
              type: 'bar',
              itemStyle: {
                color: '#044bff'
              }
            }
          ]
      };
      option && myChart.setOption(option);  
      $this.myChart = myChart;
    },
    echartsSize(){
        if(this.myChart){
            this.myChart.resize();
        }
    }
  }
}
</script>



