<template>
  <div class="item-row depFive default-chart flex-box">
    <div class="item-column flex-box flex-column">
      <div class="column-header flex-box">
        <div class="flex-content txt-header">
          <strong>{{currentData.name}}</strong><span>{{currentData.unit}}</span>
        </div>
        <div class="item-change">
          <div class="item-font" v-bind:class="item.isOn?'active':''" v-for="item in tabList" v-bind:key="item.value" v-on:click="tabChange(item)">{{item.label}}</div>
        </div>
      </div>
      <div class="column-body flex-content">
          <div class="item-tab pie-panel" v-show="currentType=='pie'">
            <div class="pie-chart" style="width:370px;height:287px; margin:0 auto;" :id="'pie-'+currentData.randomStr"></div>
          </div>
          <div class="item-tab rank-panel" v-show="currentType=='rank'">
            <div class="column-chart" style="width:370px;height:297px; margin:0 auto;" :id="'column-'+currentData.randomStr"></div>
          </div>
      </div>
    </div>
    <div class="flex-content flex-box flex-column">
      <div class="chart-header flex-box">
        <div class="title-panel"><strong>{{currentData.chartTitle}}</strong><span>{{currentData.unit}}</span></div>
        <div class="legend-list flex-content">
          <div class="item-legend"></div>
        </div>
      </div>
      <div class="flex-content chart-content">
        <div v-if="currentData.chartType=='area'" style="height:320px;" class="chart-panel" :id="'area-'+currentData.randomStr"></div>
        <div v-else-if="currentData.chartType=='line'" style="height:320px;" class="chart-panel" :id="'line-'+currentData.randomStr"></div>
        <div v-else style="height:320px;" class="chart-panel" :id="'mulitColumn-'+currentData.randomStr"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
require('echarts/theme/macarons') // echarts theme
export default {
  name: "defaultChart",
  data:function() {
    return {
      myChart:null,
      pieChart:null,
      columnChart:null,
      lineChart:null,
      mulitColumnPlot: null,
      currentType:"pie",
      tabList:[
        {label:"占比",value:"pie",isOn:true},
        {label:"排行",value:"rank",isOn:false}
      ],
    };
  },
  props: {
    itemData: {
      type: Object,
      default:{},
    },
  },
  computed:{
    currentData(){
      console.log(this.itemData)
      return this.itemData;
    },
    chartName(){
      var chartName=[];
      this.itemData.mainData.forEach(function(item,index){
        chartName.push(item[0].name);
      });
      return chartName;
    },
    ChartColor(){
      var ChartColor=[];
      this.itemData.mainData.forEach(function(item,index){
        ChartColor.push(item[0].color);
      });
      return ChartColor;
    },
    chartAxis(){
      var chartAxis=[];
      this.itemData.mainData.forEach(function(item,index){
        if(index==0){
          item.forEach(function(items,indexs){
            if(items.key.indexOf("&")!=-1){
              chartAxis.push(items.key.split("&")[0]+'\n'+items.key.split("&")[1]);
            }else{
              if(items.key.indexOf(" ")!=-1){
                var week = "周"+items.key.split(" ")[1].substr(2);
                var date = items.key.split(" ")[0];
                chartAxis.push(date.split("-")[1]+"-"+date.split("-")[2]+'\n'+week);
              }else{
                chartAxis.push(items.key.split("-")[1]+"月");
              }
            }            
          });
        }
      });
      return chartAxis;
    },
  },
  watch: {
      itemData:{
        handler(newValue, oldValue) {
          if(this.currentData.chartType=='area'){
            this.drawAreaChart();
          }else if(this.currentData.chartType=='line'){
            this.drawLineChart();
          }else if(this.currentData.chartType=='column'){
            this.drawMulitColumnChart();
          }
          if(this.currentType == 'pie'){
            this.drawPieChart();
          }
          if(this.currentType == 'rank'){
            this.drawColumnChart();
          }
        },
        deep: true
      },
    },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.myChart){
        this.myChart.dispose();
    }
    if(this.pieChart){
        this.pieChart.dispose();
    }
    if(this.columnChart){
        this.columnChart.dispose();
    }
    if(this.lineChart){
        this.lineChart.dispose();
    }
  },
  mounted(){
    window.addEventListener('resize',this.echartsSize);
    if(this.currentData.chartType=='area'){
      this.drawAreaChart();
    }else if(this.currentData.chartType=='line'){
      this.drawLineChart();
    }else if(this.currentData.chartType=='column'){
      this.drawMulitColumnChart();
    }
    this.drawPieChart();
  },
  methods:{
    // 选项卡切换事件
    tabChange(obj){
      var $this = this;
      var tabList = $this.tabList;
      if($this.pieChart){
          $this.pieChart.dispose();
      }
      if($this.columnChart){
          $this.columnChart.dispose();
      }
      tabList.forEach(function(item){
        item.isOn = false;
        if(item.value == obj.value){
          item.isOn = true;
          if(item.isOn){
            $this.currentType = item.value;
            if(obj.value=="pie"){
              $this.drawPieChart();
            }else if(obj.value=="rank"){
              $this.drawColumnChart();
            }
          }
        }else{
            item.isOn = false;
        }
      });
      $this.tabList = tabList;
    },
    // 排行图例
    drawColumnChart(){
      var $this = this;
      var chartDom = document.getElementById('column-'+$this.currentData.randomStr);
      var columnChart = echarts.init(chartDom);
      var DataArr=[];
      var chartNameArr=[];
      $this.currentData.totalChart.forEach(function(item,index){
        if(item.name.indexOf('-')!=-1){
          var itemStr=item.name.split("-")[0]+"\n"+item.name.split("-")[1];
        }else{
          var itemStr=item.name;
        }
        chartNameArr.push(itemStr);
        DataArr.push(item.value);
      });
      var series=[];
      series=[{
          type: 'bar',
          data:DataArr,
          barWidth: '28px',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#81a7f1' },
              { offset: 1, color: '#c6d6f4' }
            ])
          },
          label: {
              show: false,
          },
      }];
      var option;
      option = {
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'shadow'
              },
              valueFormatter: (value) => {
                if($this.currentData.percentLabel){
                  return Math.floor(value * 100) + "%"
                }else{
                  return value
                }
              }
          },
          grid: {
              top:'30',
              right:'18',
              left:'50',
              bottom:'50'
          },
          xAxis:{
              type: 'category',
              data:chartNameArr,
              axisTick: {
                  show: false
              },
              axisLine:{
                  show: true,
                  lineStyle:{
                      type: [4, 2],
                      dashOffset: 3,
                      color: '#000',
                      opacity:0.1,
                      shadowColor: null,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                  }
              },
              axisLabel: {
                  color: "#999",
                  fontSize: "12",
                  lineHeight: 18,
              },
              nameTextStyle:{
                  lineHeight:18,
              }
          },
          yAxis:{
              type: 'value',
              axisTick: {
                  show: false
              },
              axisLabel: {
                  color: "#999",
                  fontSize: "12",
                  lineHeight: 18
              },
              axisLine:{
                  show: false,
              },
              splitLine:{
                  show: true,
                  lineStyle:{
                      type: [4, 2],
                      dashOffset: 3,
                      color: '#000',
                      opacity:0.1,
                      shadowColor: null,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                  }
              },
              splitNumber:3,
              nameTextStyle:{
                  lineHeight:18,
              }
          },
          animation: false,
          series:series,
      }
      option && columnChart.setOption(option);
      $this.columnChart = columnChart;
    },
    // 占比图例
    drawPieChart(){
      var $this = this;
      var chartDom = document.getElementById('pie-'+$this.currentData.randomStr);
      var pieChart = echarts.init(chartDom);
      var serieData=[];
      var echartColor=[];
      $this.currentData.totalChart.forEach(function(item,index){
        var itemObj={};
        itemObj.value=item.value;
        itemObj.name=item.name;
        serieData.push(itemObj);

        var colorObj={};
        colorObj.x=0;
        colorObj.y=0;
        colorObj.x2=0;
        colorObj.y2=1;
        colorObj.colorStops=[];
        var colorOne={};
        colorOne.offset=0;
        colorOne.color=item.color;            
        colorObj.colorStops.push(colorOne);
        var colorTwo={};
        colorTwo.offset=1;
        colorTwo.color=item.color;
        colorObj.colorStops.push(colorTwo);
        echartColor.push(colorObj);
      });
      var option;
      option = {
        tooltip: {
          trigger: 'item',
          valueFormatter: (value) => {
            if($this.currentData.percentLabel){
              return Math.floor(value * 100)
            }else{
              return value
            }
          }
        },
        grid: {
            top:0,
            right:0,
            bottom:20,
            left:0,
        },
        legend: {
          bottom:0
        },
        animation: false,
        series: [
          {
            type: 'pie',
            top:-30,
            radius: '50%',
            color:echartColor,
            data:serieData,
            label: {
                formatter: params => {
                    return '{percent|占比：}\n'+ params.percent + '%'
                },
                distanceToLabelLine: 0,
                padding: [-2, 0, 0, 0],
                rich: {
                    percent: {
                        color: "#333",
                        align: 'left',
                        fontSize: 12,
                        padding: [5, 10]
                    }
                }
            },
            itemStyle: {
                borderColor: '#ffffff',
                borderWidth:1,
            },
          }
        ]
      };
      option && pieChart.setOption(option);
      $this.pieChart = pieChart;
    },
    // 面积趋势图例
    drawAreaChart(){
      var $this = this;
      var chartDom = document.getElementById('area-'+$this.currentData.randomStr);
      var myChart = echarts.init(chartDom, 'macarons');
      var series=[];
      if($this.currentData.mainData&&$this.currentData.mainData.length>0){
        $this.currentData.mainData.forEach(function(item,index){
            var itemObj={};
            itemObj.name=$this.chartName[index];
            itemObj.smooth=false;
            itemObj.type='line';
            // if($this.currentData.mainData.length<=3){
              itemObj.label={
                show: true,
                position: 'top',
                formatter: param => {
                  if($this.currentData.percentLabel){
                    return Math.floor(param.value * 100)
                  }else{
                    return param.value
                  }
                }
              }
            // }else{
            //   itemObj.showSymbol=false;
            // }
            itemObj.lineStyle={
                width: 1,
                color:$this.ChartColor[index], // 线条颜色
            };
            itemObj.itemStyle={
                color: '#fff',
                borderColor:$this.ChartColor[index], // 折点颜色
                borderWidth: 1
            };
            itemObj.areaStyle={
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color:$this.ChartColor[index],
                      opacity:1
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 255, 255, 0)",
                    }
                  ]),
                  opacity:0.3
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
            itemObj.data=[];
            item.forEach(function(items,indexs){
              var obj = {}
              obj.value = items.value;
              obj.number = items.number;
              obj.allnumber = items.allnumber;
              itemObj.data.push(obj)
              // itemObj.data.push(items.value);
            });
            itemObj.animationDuration=2800;
            itemObj.animationEasing='quadraticOut';
            series.push(itemObj);
        });
      }
      var option;
      option = {
          tooltip: {
              backgroundColor:'rgba(255,255,255,0.95)',
              trigger: "axis",
              textStyle:{
                fontSize:'12',
                color: '#666'
              },
              formatter(params){
                let returnData = `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>`;
                if($this.currentData.formatLabel){
                  for (let i = 0; i < params.length; i++) {
                    returnData += `<div class="bar clearfix"><span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[i].borderColor};"></span>
                      <span>${params[i].seriesName}：</span>
                      <span>${params[i].value}%（${params[i].data.number}/${params[i].data.allnumber}）</span></div>`;
                  }
                }else{
                  for (let i = 0; i < params.length; i++) {
                    returnData += `<div class="bar clearfix"><span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[i].borderColor};"></span>
                      <span>${params[i].seriesName}：</span>
                      <span>${params[i].value}</span></div>`;
                  }
                }
                returnData +=`</div>`;
                return returnData;
            }
          },
          grid: {
              top:60,
              right:30,
              bottom:40,
              left:52,
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data:$this.chartAxis,
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
                  interval:1,
                  color: "#555",
                  fontSize: "12",
                  lineHeight: 18
              },
          },
          yAxis:[{
              type: 'value',
              position: 'left',
              axisTick: {
                  show: true
              },
              axisLabel: {
                  color: "#555",
                  fontSize: "12"
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
              splitLine:{
                  show: true,
                  lineStyle:{
                      type: [4, 0],
                      dashOffset: 3,
                      color: '#eee',
                      opacity: 1,
                      shadowColor: null,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                  }
              },
              splitNumber:3,
              nameTextStyle:{
                  lineHeight:20,
              }
          },{
              type: 'value',
              position: 'right',
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
          }],
          legend:{
            right:30,
            data:$this.currentData.chartName
          },
          animation: false,
          series:series,
      };
      option && myChart.setOption(option);
      $this.myChart = myChart;
    },
    // 多折线趋势图例
    drawLineChart(){
      var $this = this;
      var chartDom = document.getElementById('line-'+$this.currentData.randomStr);
      var lineChart = echarts.init(chartDom, 'macarons');
      var series=[];
      if($this.currentData.mainData&&$this.currentData.mainData.length>0){
        $this.currentData.mainData.forEach(function(item,index){
            var itemObj={};
            itemObj.name=$this.chartName[index];
            itemObj.smooth=false;
            itemObj.type='line';
            // if($this.currentData.mainData.length<=3){
              itemObj.label={
                show: true,
                position: 'top'
              }
            // }else{
            //   itemObj.showSymbol=false;
            // }
            itemObj.lineStyle={
                width: 1,
                color:$this.ChartColor[index], // 线条颜色
            };
            itemObj.itemStyle={
                color: '#fff',
                borderColor:$this.ChartColor[index], // 折点颜色
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
            itemObj.data=[];
            item.forEach(function(items,indexs){
              itemObj.data.push(items.value);
            });
            itemObj.animationDuration=2800;
            itemObj.animationEasing='quadraticOut';
            series.push(itemObj);
        });
      }
      var option;
      option = {
          tooltip: {
              backgroundColor:'rgba(255,255,255,0.95)',
              trigger: "axis",
              textStyle:{
                fontSize:'12',
                color: '#666'
              },
              formatter(params){
                let returnData = `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>`;
                for (let i = 0; i < params.length; i++) {
                    returnData += `<div class="bar clearfix"><span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[i].borderColor};"></span>
                      <span>${params[i].seriesName}：</span>
                      <span>${params[i].value}</span></div>`;
                }
                returnData +=`</div>`;
                return returnData;
            }
          },
          grid: {
              top:60,
              right:30,
              bottom:40,
              left:52,
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data:$this.chartAxis,
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
                  interval:1,
                  color: "#555",
                  fontSize: "12",
                  lineHeight: 18,
              },
          },
          yAxis:[{
              type: 'value',
              position: 'left',
              axisTick: {
                  show: true
              },
              axisLabel: {
                  color: "#555",
                  fontSize: "12",
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
              splitLine:{
                  show: true,
                  lineStyle:{
                      type: [4, 0],
                      dashOffset: 3,
                      color: '#eee',
                      opacity: 1,
                      shadowColor: null,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                  }
              },
              splitNumber:3,
              nameTextStyle:{
                  lineHeight:20,
              }
          },{
              type: 'value',
              position: 'right',
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
          }],
          legend:{
            right:30,
            data:$this.currentData.chartName
          },
          animation: false,
          series:series,
      };
      option && lineChart.setOption(option);
      $this.lineChart = lineChart;
    },
    // 堆叠分组柱状图例
    drawMulitColumnChart(){
      var $this = this;
      var isDate = false;
      if($this.currentData.chartTitle.indexOf('日期')!=-1){
        isDate = true;
      }
      if(!$this.mulitColumnPlot){
        const mulitColumnPlot = new Column('mulitColumn-'+$this.currentData.randomStr, {
          appendPadding:[30,30,20],
          data:$this.currentData.mainData,
          xField: 'key',
          yField: 'value',
          isGroup: true,
          isStack: true,
          seriesField: 'name',
          groupField: 'depart',
          color:$this.currentData.colorArr.length==1?$this.currentData.colorArr[0]:$this.currentData.colorArr,
          label:{
            style: {
              fill: '#ffffff',
              opacity: 1,
              fontSize: 14
            }
          },
          xAxis: {
            label: {
              // 数值格式化为千分位
              formatter: (v) => {
                var item = "";
                if(v.indexOf("&")!=-1){
                  item = v.split("&")[0]+'\n'+v.split("&")[1];
                }else{
                  if(v.indexOf(" ")!=-1){
                    var week = "周"+v.split(" ")[1].substr(2);
                    var date = v.split(" ")[0];
                    item = date.split("-")[1]+"-"+date.split("-")[2]+'\n'+week;
                  }else{
                    item = v.split("-")[1]+"月";
                  }
                }
                return item
              },
              style:{
                lineHeight:18
              }
            },
          },
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
          legend:{
            marker:'line',
            layout:'horizontal',
            position:'top-right',
            flipPage:false,
            offsetX:-30,
            label:{
              style:{
                textBaseline:"middle"
              }
            },
          },
          tooltip: {
            customContent: (title,datum) => {
              var newArr = [];
              var departArr = [];
              datum.forEach(function(item,index){
                newArr.push(item.data);
                if(!departArr.includes(item.data.depart)){
                  departArr.push(item.data.depart)
                }
              });
              var dataArr = [];
              departArr.forEach(function(item){
                var itemData = {};
                itemData.title = item;
                itemData.value = 0;
                itemData.children = [];
                newArr.forEach(function(item1){
                  if(item1.depart == item){
                    itemData.color = item1.departColor;
                    itemData.value += item1.value;
                    var itemChart = {};
                    itemChart.name = item1.name;
                    itemChart.value = item1.value;
                    itemChart.color = item1.memberColor;
                    itemData.children.push(itemChart);
                  };
                });
                dataArr.push(itemData);
              });
              var templateHtml = "";
              if(isDate){
                templateHtml = '<div class="tooltip-panel date"><div class="tooltip-title">'+title+'</div><div class="tooltip-body">';
              }else{
                templateHtml = '<div class="tooltip-panel"><div class="tooltip-title">'+title+'</div><div class="tooltip-body">';
              }
              dataArr.forEach(function(item,index){
                var itemHtml = '<div class="tooltip-dl"><div class="tooltip-dt"><div class="txt-name" style="color:'+item.color+'">'+item.title+'</div><div class="txt-value" style="color:'+item.color+'">'+item.value+'</div></div>';
                item.children.forEach(function(item1){
                  itemHtml += '<div class="tooltip-dd"><div class="txt-name"><i style="background:'+item1.color+'"></i>'+item1.name+'</div><div class="txt-value">'+item1.value+'</div></div>';
                });
                itemHtml+='</div>'
                templateHtml += itemHtml
              });
              templateHtml += '</div></div>'
              return templateHtml;
            },
          },// 自定义状态样式
          state: {
            active: {
              style: {
                lineWidth: 0,
                fillOpacity: 0.65,
              },
            },
          },
        });
        $this.mulitColumnPlot = mulitColumnPlot;
        mulitColumnPlot.render();
      }
    },
    echartsSize(){
        if(this.myChart){
            this.myChart.resize();
        }
        if(this.pieChart){
            this.pieChart.resize();
        }
        if(this.columnChart){
            this.columnChart.resize();
        }
        if(this.lineChart){
            this.lineChart.resize();
        }
        if(this.mulitColumnPlot){
          this.mulitColumnPlot.resize();
        }
    }
  },
};
</script>

<style scoped></style>