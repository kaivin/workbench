<template>
    <div class="focusProMain flex-wrap">
        <div class="focusProUlFl">
            <router-link :to="{path: lang == 'ch'?'/stat/cn/productAnalysis/ProAccount':'/stat/en/productAnalysis/ProAccount',query:{starttime:starttime,endtime:endtime,productname:focusPro.name,typeid:focusPro.typeid}}" tag="a" target="_blank">{{focusPro.name}}</router-link>
            <dl>
                <dd>
                    <p class="focusProUlFlTop">{{focusPro.todayxunnumber}}</p>
                    <p class="focusProUlFlBom">今日询盘</p>
                </dd>
                <dd>
                    <p class="focusProUlFlTop">{{focusPro.lastdayxunnumber}}</p>
                    <p class="focusProUlFlBom">昨日询盘</p>
                </dd>
                <dd>
                    <p class="focusProUlFlTop">{{focusPro.weekxunnumber}}<span :class="focusPro.weekxunnumber-focusPro.lastweekxunnumber>=0?'':'fall'"><i><svg-icon :icon-class="focusPro.weekxunnumber-focusPro.lastweekxunnumber>=0?'data-up':'data-down'" /></i>{{Math.abs(focusPro.weekxunnumber-focusPro.lastweekxunnumber)}}</span></p>
                    <p class="focusProUlFlBom">本周询盘</p>
                </dd>
                <dd>
                    <p class="focusProUlFlTop">{{focusPro.monthxunnumber}}<span :class="focusPro.monthxunnumber-focusPro.lastmonthxunnumber>=0?'':'fall'"><i><svg-icon :icon-class="focusPro.monthxunnumber-focusPro.lastmonthxunnumber>=0?'data-up':'data-down'" /></i>{{Math.abs(focusPro.monthxunnumber-focusPro.lastmonthxunnumber)}}</span></p>
                    <p class="focusProUlFlBom">本月询盘</p>
                </dd>
            </dl>
        </div>
        <div class="focusProUlFr flex-content" ref="focusProPane">
            <p class="focusProUlTit"><i class="icon"><svg-icon icon-class="tips" /></i>近7天部门<span :class="item.isOn?'active':''" v-for="item in tabList" :key="item.value" v-on:click="tabChange(item)">{{item.label}}</span></p>
            <div class="focusProUlChart" v-show="currentType=='trend'">
                  <div class="chart-panel" style="height:270px;" :id="'trend'+focusPro.id"></div> 
            </div>
            <div class="focusProUlChart" v-show="currentType=='pie'">
                  <div class="chart-pie" style="height:270px;" :id="'pie'+focusPro.id"></div> 
            </div>
        </div>
    </div>
</template>
<script>
import {Area,Pie} from '@antv/g2plot';
export default {
  name: "focusPro",
  data() {
    return {
      currentType:"trend",
      tabList:null,
    };
  },
  created() {
    var $this = this;
  },
  props: {
    focusPro:{
      type: Object,
      default: function () {
        return {};
      },
    },
    lang:{
      type: String,
      default: function () {
        return "";
      },
    },
    starttime:{
      type: String,
      default: function () {
        return "";
      },
    },
    endtime:{
      type: String,
      default: function () {
        return "";
      },
    },
  },
  watch: {
    focusPro:{
      handler(newValue, oldValue) {
        this.tabTypeChange();
      },
      deep: true,
      immediate:true
    },
  },
  mounted(){
    if(this.currentType=='trend'){
      this.drawAreaChart();
    }
  },
  methods: {
    // 选项卡切换事件
    tabChange(obj){
        var $this = this;
        var tabList = $this.tabList;
        $this.currentType = obj.value;
        tabList.forEach(function(item){
          if(item.value == obj.value){
            item.isOn = !item.isOn;
            if(item.isOn){
              $this.currentType = item.value;
              if(obj.value=="pie"){
                $this.drawPieChart();
              }else if(obj.value=="trend"){
                $this.drawAreaChart();
              }
            }
          }else{
            if(item.isOn){
              item.isOn = !item.isOn
            }
          }
        });
        $this.tabList = tabList;
    },
    // 判断选项卡类别
    tabTypeChange(){
      var $this = this;
      var tabList = null;
      tabList =[
        {label:"趋势",value:"trend",isOn:true},
        {label:"占比",value:"pie",isOn:false},
      ]
      $this.tabList = tabList;
    },
    // 占比图例
    drawPieChart(){
      var $this = this;
      if(!$this.piePlot){
        const piePlot = new Pie('pie'+$this.focusPro.id, {
          appendPadding:[30,10,10,10],
          data:$this.focusPro.focusProPie,
          angleField: 'value',
          colorField: 'name',
          radius: 0.75,
          width:300,
          height: 270,
          radius: 1,
          innerRadius: 0.6,
          color:$this.focusPro.ChartColor,
          animation: {
            // 配置图表第一次加载时的入场动画
            appear: {
              animation: 'zoom-in', // 动画效果
              duration: 500,  // 动画执行时间
            },
          },
          label: {
            type:'spider',
            labelHeight: 28,
            style:{
              fill:'#90a6e8',
            },
            content:(data)=>{
              return '占比：'+ Math.floor(data.percent * 10000) / 100+"%";
            } ,
          },
          legend:{
            marker:{
              symbol:"hyphen",
            },
            itemSpacing:15,
            layout:'horizontal',
            position:'top-right',
            flipPage:false,
            offsetX:0,
            offsetY:5,
            itemName: {
              formatter: (val) => `${val}`,
              style: {
                fill: '#c2c2c2',
                lineHeight:20,
              },
            },
            label:{
                style:{
                    textBaseline:"middle",
                    fill:'#c2c2c2',
                }
            },
          },
          pieStyle:{
            stroke:0,
          },
          state: {
            active: {
              style: {
                fill:'#90a6e8',
                lineWidth:0,
                fillOpacity: 0.65,
              },
            },
          },
          interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
          statistic:false,
        });
        $this.piePlot = piePlot;
        piePlot.render();
      }
    },
    // 面积趋势图例
    drawAreaChart(){
        var $this = this;
        if(!$this.Plot){
            const Plot = new Area('trend'+$this.focusPro.id, {
                data:$this.focusPro.focusProTrend,
                xField: 'date',
                yField: 'number',
                seriesField:'name',
                isStack:false,
                startOnZero:false,
                color:$this.focusPro.focusProTrend.length==1?$this.focusPro.ChartColor[0]:$this.focusPro.ChartColor,
                appendPadding:[15,0,0,0],
                meta: {
                  date: {
                    range: [0, 1],
                  },
                },
                yAxis:{
                    tickCount:3,
                    line:{
                        style:{
                          stroke: '#fff',
                          strokeOpacity: 0.2,
                        }
                    },
                    grid:{
                        line:{
                            style:{
                              stroke: '#fff',
                              lineWidth: 1,
                              strokeOpacity: 0.05,
                            }
                        }
                    },
                    label: {
                        style:{
                            lineHeight:18,
                            fill:'#e5e5e5',
                        }
                    },
                },
                xAxis: {
                    tickCount:15,
                    line:{
                        style:{
                          stroke: '#fff',
                          strokeOpacity: 0.2,
                        }
                    },
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
                                  item = v.split("-")[1]+"-"+v.split("-")[2];
                              }
                            }
                            return item
                        },
                        style:{
                            lineHeight:18,
                            fill:'#e5e5e5',
                        }
                    },
                },
                legend:{
                    marker:{
                      symbol:"hyphen",
                    },
                    itemSpacing:20,
                    position:'top-right',
                    flipPage:false,
                    offsetX:0,
                    offsetY:5,
                    itemName: {
                      formatter: (val) => `${val}`,
                      style: {
                        fill: '#c2c2c2',
                      },
                    },
                    label:{
                      style:{
                        textBaseline:"middle",                          
                      }
                    },
                },
                areaStyle: (data) => {
                    var itemColor = "";
                    $this.focusPro.focusProTrend.forEach(function(item){
                        if(item.name){
                            if(item.name == data.name){
                                itemColor = item.color;
                            }
                        }else{
                            itemColor = item.color;
                        }
                    });
                    return {
                        fill: 'l(270) 0:rgba(255,255,255,0) 1:'+itemColor,
                    };
                },
            });
            $this.Plot = Plot;
            Plot.render();
        }
    },
  }
}
</script>



