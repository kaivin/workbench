<template>
    <div class="chart-pie" id="pieChart"></div> 
</template>
<script>
import * as echarts from 'echarts';
export default {
  name: "pieChart",
  props: {
    chartData:{
      type: Object,
      default: function () {
        return {};
      },
    }
  },
  data() {
    return {
        myChart: null
    };
  },
  watch: {
    chartData:{
      handler(newValue, oldValue) {
        this.drawPieChart();
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
    drawPieChart(){
        var $this = this;
        if($this.myChart){
            $this.myChart.dispose();
        }
        var colorArr = ["#2259e5","#5f83e1", "#3ebea7","#89d6c8", "#eca12d","#f0bc6d", "#ee4747", "#ff6e6e","#33abda", "#73c0de","#6ec840", "#a3d988","#f57543","#ff8d61","#9a60b4", "#c088da", "#c20cb8", "#ff5ef7","#c8bc12", "#e5d822", "#3759be", "#6d88dc", "#e06430", "#fc8452", "#e2ac34", "#fac858", "#ce3f3f","#ee6666"];
        var chartDom = document.getElementById('pieChart');
        var myChart = echarts.init(chartDom);
        var option;
        var series = [];
        series = [
            {
              name: '',
              type: 'pie',
              radius: ['40%', '70%'],
              data: $this.columnData.pie_addList,
              emphasis: {
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2
                }
              },
              label:{
                  normal:{
                      formatter: function(params){
                          var str = '';
                          str = params.name+":"+params.percent.toFixed(1)+"%";
                          return str
                      },
                      position: 'outside',
                      fontSize: 13,
                      color: "#666",
                  }
                },
            }
        ];
        option = {
          tooltip: {
            trigger: 'item',
            formatter(items){
              var tooltext = `<div class="counttoolTip">
              <div class="title">${items.name}</div>
              <div class="bar clearfix">
                ${items.marker}
                <span class="name">${items.seriesName}：</span>
                <span class="num">${items.value}</span>
              </div>
              `;
              return tooltext;
            }
          },
          legend: {
            show: false,
            orient: 'vertical',
            right: 'right',
            top: 'middle',
            itemWidth: 8,
            itemHeight: 8,
            icon: "circle",
          },
          color: ["#2259e5","#3ebea7","#eca12d","#ee4747","#73c0de","#91cb74","#ff8d61","#9a60b4","#e522db","#e5d822","#5470c6","#fc8452","#fac858","#ee6666"],
          animation: false,
          series: series
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



