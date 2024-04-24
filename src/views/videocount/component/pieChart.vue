<template>
    <div class="pie_main">
      <div class="chart-pie" :id="title" style="width: 100%; height: calc(100vh - 470px);"></div>
      <div class="chart_tit" v-if="showTitle">
        <p v-if="chartData.title">{{chartData.title}}</p>
        <p>{{chartData.name}}<span class="imp">{{chartData.score}}</span>分</p>
      </div>
      
    </div>
    
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
    },
    title:{
      type: String,
      default:""
    }
  },
  data() {
    return {
        myChart: null,
        showTitle: false
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
        $this.showTitle = true;
        if($this.myChart){
            $this.myChart.dispose();
        }
        var colorArr = ["#2259e5","#5f83e1", "#3ebea7","#89d6c8", "#eca12d","#f0bc6d", "#ee4747", "#ff6e6e","#33abda", "#73c0de","#6ec840", "#a3d988","#f57543","#ff8d61","#9a60b4", "#c088da", "#c20cb8", "#ff5ef7","#c8bc12", "#e5d822", "#3759be", "#6d88dc", "#e06430", "#fc8452", "#e2ac34", "#fac858", "#ce3f3f","#ee6666"];
        var chartDom = document.getElementById($this.title);
        var myChart = echarts.init(chartDom);
        var option;
        var series = [];
        series = [
            {
              name: '',
              type: 'pie',
              radius: ['40%', '70%'],
              data: $this.chartData.data,
              itemStyle: {
                borderRadius: 4,
                borderColor: '#fff',
                borderWidth: 2
              },
              label:{
                  normal:{
                      formatter: function(params){
                          var str = '';
                          str = params.name+"："+params.percent+"%";
                          return str
                      },
                      position: 'outside',
                      fontSize: 12,
                      color: "#666",
                  }
                },
            }
        ];
        option = {
          tooltip: {
            trigger: 'item',
            formatter(items){
              var tooltext = "";
              var cname = $this.chartData.name;
              var title = $this.chartData.title;
              if(title){
                tooltext = `<div class="counttoolTip">
                <div class="title">${title} <span>${cname}</span></div>
                <div class="bar clearfix">
                  ${items.marker}
                  <span class="name">${items.data.type_name}：</span>
                  <p class="right_some"><span class="num">${items.value}分</span>（${items.data.number}个）</p>
                </div>
                `;
              }else{
                tooltext = `<div class="counttoolTip">
                <div class="title">${items.name}</div>
                <div class="bar clearfix">
                  ${items.marker}
                  <span class="name">${cname}：</span>
                  <p class="right_some"><span class="num">${items.value}分</span>`;
                if(items.data.resdata && items.data.resdata.length > 0){
                  items.data.resdata.forEach((sitem,sindex)=> {
                    tooltext += `，${sitem.type_name}${sitem.number}个`;
                  })
                }
                tooltext += `</p>
                </div>
                `;
              }
              
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
<style>
.pie_main{
  position: relative;
}
.chart_tit{
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  text-align: center;
  font-size: 20px;
}
.chart_tit p+p{
  margin-top: 4px;
}
.chart_tit .imp{
  color: #0970ff;
  margin-left: 2px;
  margin-right: 2px;
}
.right_some{
  display: inline-block;
  vertical-align: top;
  font-weight: bold;
  max-width: 280px;
  word-break: break-all;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-size: 12px;
}
.right_some span{
  display: inline-block;
  vertical-align: top;
}
.counttoolTip .title{
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}
</style>