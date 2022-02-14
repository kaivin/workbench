<template>
    <div class="pie-chart" :id="'pie-'+idData" :style="'height:'+scoreHeight+'px'" ></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "pieChart",
  data:function() {
    return {
        myChart:null,
    };
  },
  props: {
    chartData: {
      type: Array,
      default:[],
    },
    scoreHeight:{
      type: Number,
      default: "",
    },
    idData:{
      type: String,
      default: "",
    },
  },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.myChart){
        this.myChart.dispose();
    }
  },
  watch: {
    chartData:{
      handler(newValue, oldValue) {
        window.addEventListener('resize',this.echartsSize);
        var colorList1=[];
        newValue.forEach(function(item,index){
            colorList1.push(item.color);
        });
        var option;
        option = {
            tooltip: {
                trigger: 'item'
            },
            legend:false,
            color:colorList1,
            series: [
                {
                    type: 'pie',
                    radius: '60%',
                    label: {
                    show: false
                    },
                    emphasis: {
                    label: {
                        show: true
                    }
                    },
                    data:newValue,
                }
            ]
        };
        this.myChart.setOption(option,true);
      },
      deep: true
    },
  },
  mounted(){
      var $this = this;
      window.addEventListener('resize',$this.echartsSize);
      this.drawAreaTrendChart($this.chartData);
  },
  methods: {
    drawAreaTrendChart(dataArr) {
        var $this = this;
        var chartDom = document.getElementById('pie-'+$this.idData);
        var myChart = echarts.init(chartDom);
        var colorList1=[];
        dataArr.forEach(function(item,index){
            colorList1.push(item.color);
        });
        var option;
        option = {
            tooltip: {
                trigger: 'item'
            },
            legend:false,
            color:colorList1,
            series: [
                {
                    type: 'pie',
                    radius: '60%',
                    avoidLabelOverlap: false,
                    label: {show: false},
                    labelLine: {show: false},
                    emphasis: {
                        itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.2)'
                        }
                    },
                    data:dataArr,
                }
            ]
        };
        option && myChart.setOption(option,true);
        $this.myChart = myChart;
    },
    echartsSize(){
        if(this.myChart){
            this.myChart.resize();
        }
    }
  },
}
</script>

<style></style>