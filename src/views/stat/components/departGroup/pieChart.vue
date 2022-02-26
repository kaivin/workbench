<template>
    <div class="pie-chart" style="width:220px;height:277px; margin:0 auto;" :id="'pie-'+idData"></div>
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
    colorData: {
      type: Array,
      default:[],
    },
    idData:{
      type: String,
      default: "",
    },
    fontData:{
      type: String,
      default: "",
    },
  },
  computed:{
    currentData(){
      return this.chartData;
    },
  },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.myChart){
        this.myChart.dispose();
    }
  },
  mounted(){
    window.addEventListener('resize',this.echartsSize);
    this.drawPieChart();
  },
  methods:{
    drawPieChart(){
      var $this = this; 
      var chartDom = document.getElementById('pie-'+$this.idData);
      var myChart = echarts.init(chartDom);
      var option;
      option = {
          title:{
              text:$this.fontData,
              textStyle:{
                  fontSize:14,
                  color:"#666666",
                  fontWeight:'400',
                  lineHeight:24,
              },
              textAlign:"center",
              x: '48%',
              y: '41%',
              itemGap:0
          },
          tooltip: {
              trigger: 'item'
          },
          animation: false,
          series: [
              {
                  color:$this.colorData,
                  type: 'pie',
                  radius: ['50%', '90%'],
                  avoidLabelOverlap: false,
                  label: {
                    show: false,
                  },
                  emphasis: {
                    label: {
                      show: false,
                    }
                  },
                  itemStyle: {
                      borderColor: '#ffffff',
                      borderWidth:1,
                  },
                  labelLine: {
                    show: false
                  },
                  data:$this.currentData
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
  },
};
</script>

<style></style>