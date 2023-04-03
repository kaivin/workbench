<template>
  <div class="hxpage col_right">
      <div class="title-view">
        <div class="title">部门平均成本排行</div>
        <router-link :to="{path:language == '中文'?'/stat/cn/departAnalysis':'/stat/en/departAnalysis',query:{type:3,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}}" tag="a" target="_blank" class="more">详情 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></router-link>
      </div>
      <div class="chart-bottom" id="CostYearsChartBot"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {parseTime} from "@/utils";
import { mapGetters } from 'vuex'
export default {
    name:'demo',
    data(){
      return {
        startTime:"",
        endTime:"",
        baseDepart:"",
        contrastDepart:"",
        type:3,
        myChart:null,
      }
    },
    props:{
      language:{
        type:String,
        default:"中文"
      },
      yeardeaprtscore:{
        type:Array,
        default:function(){
          return []
        }
      },
      departList:{
        type:Array,
        default:function(){
          return []
        }
      },
      year:{
        type: Number,
        default: new Date().getFullYear()
      },
    },
    watch:{
      yeardeaprtscore:{
        handler(val,oldval){
          this.goPage();
          this.setChartBottom(val)
        },
        deep:true
      },
      isCollapse(){
        setTimeout(() => {
          this.echartsSize();
        }, 200)
      }
    },
    computed:{
      ...mapGetters([
        'sidebar',
      ]),
      isCollapse() {
        return this.sidebar.opened
      }
    },
    mounted(){
      window.addEventListener('resize',this.echartsSize)
    },
    created(){
    },
    methods:{
      getMonthDays(year,month){
        var thisDate = new Date(year,month,0); //当天数为0 js自动处理为上一月的最后一天
        return thisDate.getDate();
      },
      setChartBottom(val){
          var $this = this;
          if($this.myChart){
            $this.myChart.dispose();
          }
          let chartBotData = JSON.parse(JSON.stringify(val));
          for(let i = 0;i<chartBotData.length;i++){
            chartBotData[i].departname=chartBotData[i].departname.slice(-2)
          }
          chartBotData.forEach(item=>{
            item.avgallmoney = parseFloat(item.avgallmoney.toFixed(1))
          })
          chartBotData.sort(function(a, b){return a.avgallmoney - b.avgallmoney}); 

          var chartDom = document.getElementById('CostYearsChartBot');
          var myChart = echarts.init(chartDom);
          var option;
          var newList = [];
          var maxValue = 0;
          var maxNum = 0;
          var maxList= [];
          var btmList = [];
          for(var i=0;i<chartBotData.length;i++){
              var obj={};
              obj.departname = chartBotData[i].departname;
              obj.avgallmoney = chartBotData[i].avgallmoney;
              newList.push(obj);
              if(chartBotData[i].avgallmoney > maxValue){
                  maxValue = chartBotData[i].avgallmoney;
              }
          }
          var numlen = Math.ceil(maxValue).toString().split('').length;
          var step = 15;
          for(var i=0;i< numlen-2 ;i++){
            step = step*10
          }
          maxNum = Math.ceil(maxValue/step)*step;
          for(var i=0;i< chartBotData.length;i++){
              var obj={};
              obj.departname= chartBotData[i].departname;
              obj.avgallmoney= maxNum;
              maxList.push(obj);
              var obj2 = {};
              obj2.departname= chartBotData[i].departname;
              obj2.avgallmoney= 0.5;
              btmList.push(obj2);
          }

          var option = {
              tooltip:{
                show:true,
                trigger: 'item',
                backgroundColor:'#fff',
                extraCssText: 'box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);',
                formatter: function (params) {
                  return `<div class="toolDiv">
                    <div class="title">${params.data.departname}</div>
                    <div class="bar clearfix">
                      ${params.marker}
                      <span>数量：</span>
                      <span>${params.data.avgallmoney}</span>
                    </div>
                  </div>`
                },
                textStyle:{
                  fontSize:12,
                  color: "#666"
                }
              },
              grid: {
                  left: '0',
                  right: '0',
                  bottom: '3%',
                  top: '20',
                  containLabel: true
              },
              xAxis: [{
                  type: 'category',
                  name: "部门",
                  boundaryGap: ['20%', '20%'],
                  splitLine: {
                      show: false
                  },
                  axisLine:{
                    show:true,
                    lineStyle:{
                      color: "#323958",
                      type: "solid"
                    },
                  },
                  axisTick: {
                      show: false
                  },
                  axisLabel: {
                    fontSize: 13,
                    color: '#ccc',
                    padding: [3,0, 0, 0]
                  },
              }],
              yAxis: [{
                  type: 'value',
                  name: "成本",
                  splitLine: {
                      show: false
                  },
                  axisLine: {
                      show: false
                  },
                  axisTick: {
                      show: false,
                  },
                  axisLabel: {
                    color: '#ccc',
                    fontSize: 13
                  },
                  nameTextStyle:{
                      color: "transparent"
                  },
                  splitNumber:3,
                  splitLine:{
                    lineStyle:{
                      type: [4, 3],
                      dashOffset: 3,
                      color:'#e6e6e6',
                      opacity:0.1,
                      shadowColor: null,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                    }
                  }
              }],
              dataset:[{
                      source: newList
                  },
                  {
                      source: maxList
                  },
                  {
                      source: btmList
                  }
              ],
              animation: false,
              series: [       
                { //最低下的圆片
                  name: "",
                  type: "pictorialBar",
                  symbolSize: [32, 7],
                  symbolOffset: [-2, 4],
                  z: 12,
                  itemStyle: {
                      opacity: 1,
                      color: function(params){
                        if(params.dataIndex == 0){
                          return  '#b10a27';
                        }else if(params.dataIndex == 1){
                          return  '#dc5b00';
                        }else if(params.dataIndex == 2){
                            return  '#0041d0';
                        }else if(params.dataIndex == 3){
                          return  '#3a6cc6';
                        }
                      }
                  },
                  tooltip:{
                      show: false
                  },
                  datasetIndex:2,
                },
                //下半截柱状图
                {
                  name: '成本',
                  type: 'bar',
                  barWidth: 32,
                  z: 1,
                  itemStyle: { //lenged文本
                    color: function(params) {
                      if(params.dataIndex == 0){
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#ff395d'
                        },{
                            offset: 1,
                            color: '#d21435'
                        }], false)
                      }else if(params.dataIndex == 1){
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#ffaf47'
                        },{
                            offset: 1,
                            color: '#ff7a21'
                        }], false)
                      }else if(params.dataIndex == 2){
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#2e7ff3'
                        },{
                            offset: 0.5,
                            color: '#1969f9'
                        },{
                            offset: 1,
                            color: '#0352ff'
                        }], false)
                      }else if(params.dataIndex == 3){
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#2e7ff3'
                        },{
                            offset: 1,
                            color: '#4ab5f8'
                        }], false)
                      }
                    }
                  },
                  dataIndex: 0
                },
                //头部圆形
                {
                  name: "", 
                  type: "pictorialBar",
                  symbolSize: [40, 10],
                  symbolOffset: [-2, -3],
                  z: 12,
                  symbolPosition: "end",
                  itemStyle: {
                      color: '#44548c',
                  },
                  datasetIndex: 1,
                  tooltip:{
                      show: false
                  }
                },
                // 下半截柱状图顶部圆形
                {
                  name: "",
                  type: "pictorialBar",
                  symbolSize: [32, 14],
                  symbolOffset: [-2, -5],
                  z: 12,
                  itemStyle: {
                      opacity: 1,
                      color: function(params) {
                        if(params.dataIndex == 0){
                          return new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                                  offset: 0,
                                  color: '#ff617e'
                              }, {
                                  offset: 1,
                                  color: '#ff91a4'
                          }], false)
                        }else if(params.dataIndex == 1){
                          return new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                                  offset: 0,
                                  color: '#ff9e37'
                              }, {
                                  offset: 1,
                                  color: '#ffe154'
                          }], false)
                        }else if(params.dataIndex == 2){
                          return new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                                  offset: 0,
                                  color: '#2d7df3'
                              }, {
                                  offset: 1,
                                  color: '#53d0f6'
                          }], false)
                        }else if(params.dataIndex == 3){
                          return new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                                  offset: 0,
                                  color: '#91eaff'
                              }, {
                                  offset: 1,
                                  color: '#53d0f6'
                          }], false)
                        }
                      }
                  },
                  symbolPosition: "end",
                  datasetIndex: 0,
                  tooltip:{
                      show: false
                  }
                },
                //最大值
                {
                  name: 'max',
                  type: 'bar',
                  barWidth: 40,
                  barGap: '-113%',
                  z: 0,
                  itemStyle: {
                      color: '#324071',
                  },
                  datasetIndex: 1,
                  tooltip:{
                      show: false
                  }
                },
                // 数字展示
                {
                  name: '数据',
                  type: 'pictorialBar',
                  symbolSize: [40, 10],
                  symbolOffset: [-2, -3],
                  z: 15,
                  zlevel: 0,
                  itemStyle: {
                      color: 'transparent', //数据的间隔颜色
                  },
                  label: {
                    show: true,
                    position: 'top',
                    distance: 10,
                    color: "#cccccc",
                    fontSize: 13,
                    align: "center",
                    offset: [-4,0]
                      
                  },
                  dataIndex: 0
                },
              ]
          };

          option && myChart.setOption(option);
          $this.myChart = myChart;
          myChart.on('click', function (params) {
            // 在用户点击后控制台打印数据的名称
            let baseDepart = chartBotData[params.dataIndex].id;
            let contrastDepart = '';
            let startTime = $this.year + '/01';
            let endTime = $this.year + '/12';
            if($this.language == '中文'){
              $this.$router.push({path:'/stat/cn/departAnalysis',query:{type:3,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }else{
              $this.$router.push({path:'/stat/en/departAnalysis',query:{type:3,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }
        });
      },
      goPage(){
        var $this = this;
        var newDate = new Date();
        // var newYear = newDate.getFullYear();
        var newYear = $this.year;
        var startTime = newYear + "/01";
        var endTime = newYear + "/12";
        var baseDepart = "";
        var contrastDepartArr = [];
        this.departList.forEach(function(item,index){
          if(index == 0){
            baseDepart = item.id;
          }else{
            contrastDepartArr.push(item.id);
          }
        });
        var contrastDepart = "";
        if(contrastDepartArr.length>0){
          contrastDepart = contrastDepartArr.join(",");
        }
        $this.startTime = startTime;
        $this.endTime = endTime;
        $this.baseDepart = baseDepart;
        $this.contrastDepart = contrastDepart;
      },
      echartsSize(){
        if(this.myChart){
          this.myChart.resize();
        }
      }
    },
    destroyed(){
      window.removeEventListener('resize',this.echartsSize);
      if(this.myChart){
        this.myChart.dispose();
      }
    }
}
</script>
<style scoped lang="scss">
</style>