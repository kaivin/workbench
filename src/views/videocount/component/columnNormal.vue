<template>
  <div class="col_item">
    <div class="chart-column" :id="title" style="width: 100%; height: calc(100vh - 470px);"></div>
  </div>
</template>
<script>
import * as echarts from 'echarts';
export default {
  name: "columnNormal",
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
        if($this.myChart){
            $this.myChart.dispose();
        }
        var colorArr = ["#2259e5","#5f83e1", "#3ebea7","#89d6c8", "#eca12d","#f0bc6d", "#ee4747", "#ff6e6e","#33abda", "#73c0de","#6ec840", "#a3d988","#f57543","#ff8d61","#9a60b4", "#c088da", "#c20cb8", "#ff5ef7","#c8bc12", "#e5d822", "#3759be", "#6d88dc", "#e06430", "#fc8452", "#e2ac34", "#fac858", "#ce3f3f","#ee6666"];
        var chartDom = document.getElementById($this.title);
        var myChart = echarts.init(chartDom);
        var option;
        var xData = [];
        var series = [];
        if($this.chartData.data && $this.chartData.data.length > 0){
          $this.chartData.data.forEach((item,index) => {
            var itemObj={};
            itemObj.name = item.name;
            itemObj.data = item.data;
            if(index == 0 || index == 1){
              itemObj.type='bar';
              itemObj.barMaxWidth = 30;
              if(index == 0){
                itemObj.label={
                  show: true,
                  position: 'insideTop',
                  distance: 10,
                  color: "#fff",
                  formatter:function(params){
                    if(params.value > 0.5){
                      return params.value
                    }else{
                      return ""
                    }
                  },
                };
              }else if(index == 1){
                itemObj.label={
                  show: true,
                  position: 'top',
                  distance: 5,
                  formatter:function(params){
                    return params.data.all
                  },
                };
              }
              itemObj.itemStyle={
                color: colorArr[index],
                borderColor: colorArr[index],
              };
              itemObj.stack = "data";
              series.push(itemObj);
            }else if(index == 2 || index == 3){
              // 折线图
              itemObj.smooth=false;
              itemObj.type='line';
              itemObj.lineStyle={
                  width: 1,
                  color: colorArr[index], // 线条颜色
              };
              itemObj.itemStyle={
                  color: '#fff',
                  borderColor: colorArr[index], // 折点颜色
                  borderWidth: 1
              };
              itemObj.emphasis={
                lineStyle: {
                  width: 2,	// hover时的折线宽度
                },
                itemStyle:{
                  borderWidth: 2
                }
              };
              itemObj.symbolSize=5;
              itemObj.symbol='circle';
              itemObj.yAxisIndex = 1;
              itemObj.animationDuration=2800;
              itemObj.animationEasing='quadraticOut';
              series.push(itemObj);
            }
          })
        
          option = {
            tooltip: {
                backgroundColor:'rgba(255,255,255,0.95)',
                trigger: "axis",
                textStyle:{
                  fontSize:'12',
                  color: '#666'
                },
                formatter(params){
                  var resParams = $this.getRaramsRank(params);
                  let returnData = `<div class="toolDiv">
                      <div class="tooltitle">${params[0].name}</div>`;
                      resParams.forEach(item => {
                        returnData += `<div class="bar clearfix" style="margin-top:5px">
                        <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${item.borderColor};"></span><span>`;
                          returnData += `<p class="long_name2">${item.seriesName}</span></p>`;
                          if(item.seriesName == '实际完成' || item.seriesName == '有效完成' ){
                            if(item.seriesName == '实际完成'){
                              returnData += `<p class="right_some"><span>${item.data.all}积分</span>`;
                            }else{
                              returnData += `<p class="right_some"><span>${item.value}积分</span>`;
                            }
                          }else{
                            returnData += `<p class="right_some"><span>${item.value}%</span>`;
                          }

                          if(item.data.resdata && item.data.resdata.length > 0){
                            item.data.resdata.forEach((sitem,sindex)=> {
                              returnData += `，${sitem.type_name}${sitem.number}个`;
                            })
                          }
                        returnData += `</p></div>`;
                      })
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
            yAxis: [{
                type: 'value',
                name: "单位（分）",
                nameTextStyle: {
                  color: "#b4b4b4",
                  nameLocation: "start",
                },
                min: 0,
                alignTicks: true,
                axisLabel:{
                  color: "#888"
                }, 
              },
              {
                  type: 'value',
                  name: "单位（%）",
                  nameTextStyle: {
                    color: "#b4b4b4",
                    nameLocation: "end",
                  },
                  min: 0,
                  alignTicks: true,
                  axisLabel:{
                    color: "#888"
                  },
                },
            ],
            // legend: {
            //   show: true
            // },
            animation: false,
            series:series,
          };
          option && myChart.setOption(option);
          $this.myChart = myChart;
        }
    },
    echartsSize(){
        if(this.myChart){
            this.myChart.resize();
        }
    },
    getRaramsRank(params){
      var $this = this;
      var resArr = [];
      var resTitle = ['实际完成', '实际完成占比', '有效完成', '有效完成占比'];
      resTitle.forEach(item => {
        var paramObj = $this.getAimParam(params, item);
        if(paramObj.isIn){
          resArr.push(paramObj.data);
        }
      })
      return resArr;
    },
    getAimParam(param, aim){
      var resObj = {
        data: {},
        isIn: false
      }
      param.forEach(item => {
        if(item.seriesName == aim){
          resObj.isIn = true;
          resObj.data = item;
        }
      })
      return resObj;
    }
  }
}
</script>
<style>
.tooltitle{
    font-size: 14px;
    font-weight: bold;
}
.long_name, .long_name2, .short_name, .right_some{
  display:inline-block;
  vertical-align:top;
}
.long_name{
  width: 100px;
}
.long_name2{
  width: 80px;
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