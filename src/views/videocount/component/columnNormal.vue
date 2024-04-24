<template>
  <div class="col_item">
    <div class="chart-column" :id="title" style="width: 100%; height: calc(100vh - 470px);"></div>
    <p class="col_tit" v-if="showTitle">{{chartData.name}}</p>
  </div>
</template>
<script>
import * as echarts from 'echarts';
export default {
  name: "columnChart",
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
    drawColumnChart(){
        var $this = this;
        $this.showTitle = true;
        if($this.myChart){
            $this.myChart.dispose();
        }
        var colorArr = ["#2259e5","#5f83e1", "#3ebea7","#89d6c8", "#eca12d","#f0bc6d", "#ee4747", "#ff6e6e","#33abda", "#73c0de","#6ec840", "#a3d988","#f57543","#ff8d61","#9a60b4", "#c088da", "#c20cb8", "#ff5ef7","#c8bc12", "#e5d822", "#3759be", "#6d88dc", "#e06430", "#fc8452", "#e2ac34", "#fac858", "#ce3f3f","#ee6666"];
        var chartDom = document.getElementById($this.title);
        var myChart = echarts.init(chartDom);
        var option;
        var xData = [];
        var series = [];
        var itemObj={};
        itemObj.name = $this.chartData.name;
        itemObj.data = $this.chartData.data;
        itemObj.type='bar';
        itemObj.barMaxWidth = 30;
        itemObj.label={
          show: true,
          position: 'top',
          distance: 5,
          color: "#666"
        };
        itemObj.itemStyle={
          color: "#2259e5",
          borderColor: "#2259e5",
        };
        series.push(itemObj);
        option = {
          tooltip: {
              backgroundColor:'rgba(255,255,255,0.95)',
              trigger: "axis",
              textStyle:{
                fontSize:'12',
                color: '#666'
              },
              formatter(params){
                console.log(params)
                let returnData = `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>`;
                params.forEach((item,index) => {
                    returnData += `<div class="bar clearfix" style="margin-top:5px">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[index].borderColor};"></span><span>
                      <p class="short_name">`;
                    returnData += `实际完成</span></p><p class="right_some"><span>${item.data.value}积分</span>`;
                    if(item.data.resdata && item.data.resdata.length > 0){
                      item.data.resdata.forEach((sitem,sindex)=> {
                        returnData += `，${sitem.type_name}${sitem.number}个`;
                      })
                    }
                    returnData += `</p></div>`;
                })
                returnData +=`</div>`;
                return returnData;
            }
          },
          grid: {
              top:50,
              right:22,
              bottom:50,
              left:52,
          },
          xAxis: {
              type: 'category',
              data: $this.chartData.c_name,
              axisLine: {
                  show: false,
              },
              axisTick: {
                  show: false,
              },
              axisLine:{
                  show: true,
                  lineStyle:{
                      type: [4, 0],
                      dashOffset: 3,
                      color: '#e5e5e5',
                      opacity: 1,
                      shadowColor: null,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                  }
              },
              axisLabel: {
                  interval:0,
                  color: "#555",
                  fontSize: "12",
                  lineHeight: 18,
              },
          },
          yAxis: {
              type: 'value',
              name: "单位（分）",
              nameTextStyle: {
                color: "#b4b4b4",
                nameLocation: "start",
              },
              alignTicks: true,
              axisLabel:{
                color: "#888"
              },
              
          },
          animation: false,
          series:series,
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
.tooltitle{
    font-size: 14px;
    font-weight: bold;
}
.long_name, .short_name, .right_some{
  display:inline-block;
  vertical-align:top;
}
.long_name{
  width: 100px;
}
.short_name{
  width: 60px;
}
.right_some{
  font-weight: bold;
  max-width: 500px;
  word-break: break-all;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.col_tit{
  font-size: 15px;
  text-align: center;
  color: #666;
  font-weight: bold;
}
</style>