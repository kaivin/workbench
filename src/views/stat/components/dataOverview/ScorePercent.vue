<template>
  <div class="hxpage btm_shadow">
      <div class="title-view">
        <div class="title">部门成交占比{{type == 0?'（积分+占比）':'（个数+占比）'}}</div>
        <router-link :to="{path:language == '中文'?'/stat/cn/departAnalysis':'/stat/en/departAnalysis',query:{type:2,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}}" tag="a" target="_blank" class="more">详情 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></router-link>
      </div>
      <div class="chart-bottom scale-panel" id="ScoreYearsChartBot"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts-gl';
import {parseTime} from "@/utils";
import { mapGetters } from 'vuex'
export default {
    name:'demo',
    data(){
      return {
        type:0,
        isUp:true,
        isUpNum:0,
        totalXpanYears:0,
        startTime:"",
        endTime:"",
        baseDepart:"",
        contrastDepart:"",
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
    computed:{
      ...mapGetters([
        'sidebar',
      ]),
      isCollapse() {
        return this.sidebar.opened
      }
    },
    watch:{
      type:function(newval,oldval){
        this.setChartBottom();
      },
      yeardeaprtscore:{
        handler(newval,oldval){
          this.goPage();
          this.setChartBottom();
        },
        deep:true
      },
      isCollapse(){
        setTimeout(() => {
          this.echartsSize();
        }, 200)
      }
    },
    methods:{
      changeType(val){
        this.type = val;
      },
      setChartBottom(val){
        var $this = this;
        let chartBotData = [];
        if(this.type == 0){
          chartBotData = JSON.parse(JSON.stringify(this.yeardeaprtscore));
        }else{
          chartBotData = JSON.parse(JSON.stringify(this.yearscorenumbercount));
        }
        var chartDom = document.getElementById('ScoreYearsChartBot');
        var myChart = echarts.init(chartDom);
        var option;
        var $this = this;
        var pieData = [];
        var totalScore = 0;
        var  colorList=['#3a72ff', '#1bd7ff', '#ff395d', '#ffcd6a', '#f1bb4c',];
        chartBotData.forEach(function(item){
          var itemData = {};
          itemData.name = item.departname;
          itemData.value = item.score;
          pieData.push(itemData);
        });
        option = {
            color: colorList,
            tooltip: {
              trigger: 'item',
              formatter: (params) => {
                console.log(params,"tooltip")
                if(this.type == 0){
                  var text = `${params.data.name}<br/>
                  <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                      params.color
                  };"></span>积分：${params.data.value}`;
                  return text;
                }else{
                  var text = `${params.data.name}<br/>
                  <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                      params.color
                  };"></span>个数：${params.data.value}`;
                  return text;
                }
              },
            },
            // dataset:{
            //     source: chartBotData
            // },
            series: [
                // {
                //     radius: ['35%', '62%'],
                //     center: ['50%', '54%'],
                //     type: 'pie',
                //     showEmptyCircle: true,
                //     itemStyle: {
                //       color: function(params) {
                //           return colorList[params.dataIndex]
                //       }
                //     },
                //     z:2,
                //     label:{
                //       show:false,
                //     },
                //     labelLine:{
                //       show:false
                //     }
                // },
                // {
                //     radius: ['35%', '62%'],
                //     center: ['50%', '54%'],
                //     type: 'pie',
                //     showEmptyCircle: true,
                //     itemStyle: {
                //       // color: {
                //       //   type: 'radial',
                //       //   x: 0.5,
                //       //   y: 0.5,
                //       //   r: 0.5,
                //       //   colorStops: [{
                //       //       offset: .4, color: 'rgba(255,255,255,.2)' // 0% 处的颜色
                //       //   }, {
                //       //       offset: 1, color:  'rgba(0,0,0,.2)' // 100% 处的颜色
                //       //   }],
                //       //   global: false // 缺省为 false
                //       // }
                //       color: {
                //         type: 'linear',
                //         x: 1,
                //         y: 1,
                //         x2: 0,
                //         y2: 1,
                //         colorStops: [{
                //             offset: .2, color: 'rgba(0,0,0,.2)' // 0% 处的颜色
                //         }, {
                //             offset: .5, color:  'rgba(255,255,255,.2)' // 100% 处的颜色
                //         },{
                //             offset: .8, color:  'rgba(0,0,0,.2)' // 100% 处的颜色
                //         }],
                //         global: false // 缺省为 false
                //       }
                //     },
                //     z:3,
                //     label:{
                //       show:false,
                //     },
                //     labelLine:{
                //       show:false
                //     }
                // },
                {
                    radius: ['32%', '58%'],
                    center: ['50%', '50%'],
                    type: 'pie',
                    showEmptyCircle: true,
                    data:pieData,
                    itemStyle: {
                      color: function(params) {
                        return colorList[params.dataIndex]
                      },
                      // borderColor: "rgba(255, 255, 255, 0.6)",
                      // borderWidth: "1",
                      // borderType: "solid"
                    },
                    z:4,
                    labelLine: {
                      show: true,
                      length: 15,
                      length2: 10,
                      lineStyle: {
                          color: 'rgba(140,162,221,0.8)'
                      },
                      align: 'right'
                    },
                    label:{
                      formatter: function(params){
                          var str = '';
                          str = '{a|'+params.name+'}'+'{b|\n占比: '+params.percent.toFixed(1)+'%}';
                          return str
                      },
                      fontSize: 13,
                      color: "rgba(140,162,221,0.8)",
                      rich: {
                        b:{
                          padding: [5, 0, 0, 0],
                        }
                      }
                    },
                    labelLayout:{
                        verticalAlign:"top"
                    }
                },
                // 边框的设置
                {
                  radius: ['0%', '33%'],
                  // radius: ['32%', '38%'],
                  center: ['50%', '50%'],
                  type: 'pie',
                  z:4,
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  },
                  tooltip: {
                      show: false
                  },
                  itemStyle: {
                    // color:'rgba(0,0,0,0.2)'
                    color: "#1d2244"
                  },
                  emphasis: {
                    scale: false
                  },
                  data: [{
                      value: 1,
                  }],
                },
                {
                    radius: ['0%', '58%'],
                    center: ['50%', '50%'],
                    type: 'pie',
                    z:0,
                    label: {
                      show: false
                    },
                    labelLine: {
                      show: false
                    },
                    animation: false,
                    tooltip: {
                      show: false
                    },
                    itemStyle: {
                      color: "rgba(255, 255, 255, 0.6)",
                      borderColor: "rgba(255, 255, 255, 0.6)",
                      borderWidth: "1",
                      borderType: "solid"
                    },
                    emphasis: {
                      scale: false
                    },
                    data: [{
                        value: 1,
                    }],
                }
            ]
        };
        option && myChart.setOption(option);
        $this.myChart = myChart;
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
      },
      drawPieChart(){
        var img ='data:image/png;base64,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';
        var $this = this;
        var myChart = echarts.init(document.getElementById('ScoreYearsChartBot'));
        var colorList=['#3a72ff', '#1bd7ff', '#ff395d', '#ffcd6a', '#f1bb4c'];
        let chartBotData = [];
        if(this.type == 0){
          chartBotData = JSON.parse(JSON.stringify(this.yeardeaprtscore));
        }else{
          chartBotData = JSON.parse(JSON.stringify(this.yearscorenumbercount));
        }
        var pieData = []
        for (var i = 0; i < chartBotData.length; i++) {
          pieData.push(
            {
              value: chartBotData[i].score,
              name: chartBotData[i].departname,
              itemStyle: {
                borderWidth: 4,
                shadowBlur: 20,
                borderColor: colorList[i],
                shadowColor: colorList[i],
              },
            },
            {
              value: 32,
              name: '',
              itemStyle: {
                label: {
                  show: false,
                },
                labelLine: {
                    show: false,
                },
                color: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 0,
              },
            }
          );
        }
        var seriesOption = [
          {
            name: '',
            type: 'pie',
            clockWise: true,
            radius: ['40%', '60%'],
            hoverAnimation: true,
            label: {
              show: true,
              position: 'outside',
              formatter: function (params) {
                var percent = 0;
                var total = 0;
                for (var i = 0; i < chartBotData.length; i++) {
                  total += chartBotData[i].score;
                }
                percent = ((params.value / total) * 100).toFixed(0);
                if (params.name !== '') {
                  var text = `<span style="color:${params.color};">${params.name}<br/>占比: ${percent}%</span>`;
                  return text;
                } else {
                  return '';
                }
              },
            },
            labelLine: {
              length: 30,
              length2: 100,
              show: true,
              color: '#00ffff',
            },
            data: pieData,
          },
        ];
        var option = {
          color: colorList,
          graphic: {
            elements: [
              {
                type: 'image',
                z: 3,
                style: {
                  image: img,
                  width: 100,
                  height: 100,
                },
                left: 'center',
                top: 'center',
                position: [100, 100],
              },
            ],
          },
          tooltip: {
              show: true,
          },
          toolbox: {
              show: false,
          },
          series: seriesOption,
        };
        option && myChart.setOption(option);
        $this.myChart = myChart;
      },
      // 3D环状图
      drawPie3D(){
        var $this = this;
        var myChart = echarts.init(document.getElementById('ScoreYearsChartBot'));
        var colorList=['#3a72ff', '#1bd7ff', '#ff395d', '#ffcd6a', '#f1bb4c'];
        let chartBotData = [];
        if(this.type == 0){
          chartBotData = JSON.parse(JSON.stringify(this.yeardeaprtscore));
        }else{
          chartBotData = JSON.parse(JSON.stringify(this.yearscorenumbercount));
        }
        console.log(chartBotData,"3D环")
        var pieData = []
        var totalScore = 0;
        chartBotData.forEach(function(item,index){
          var itemData = {};
          itemData.name = item.departname;
          itemData.score = item.score;
          totalScore += item.score;
          itemData.itemStyle = {};
          itemData.itemStyle.color = colorList[index];
          itemData.itemStyle.opacity = 1;
          pieData.push(itemData);
        })
        pieData.forEach(function(item){
          item.value = item.score==0||totalScore==0?0:parseInt(item.score/totalScore*100);
        });
        console.log(pieData)
        var option = $this.getPie3D(pieData, 0.6);
        option && myChart.setOption(option);
        $this.myChart = myChart;
        // 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
        let selectedIndex = '';
        let hoveredIndex = '';
        // 监听点击事件，实现选中效果（单选）
        $this.myChart.on('click', function(params) {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否选中取反。
            let isSelected = !option.series[params.seriesIndex].pieStatus.selected;
            let isHovered = option.series[params.seriesIndex].pieStatus.hovered;
            let k = option.series[params.seriesIndex].pieStatus.k;
            let startRatio = option.series[params.seriesIndex].pieData.startRatio;
            let endRatio = option.series[params.seriesIndex].pieData.endRatio;
            // 如果之前选中过其他扇形，将其取消选中（对 option 更新）
            if (selectedIndex !== '' && selectedIndex !== params.seriesIndex) {
                option.series[selectedIndex].parametricEquation = $this.getParametricEquation(option.series[selectedIndex].pieData.startRatio, option.series[selectedIndex].pieData.endRatio, false, false, k, option.series[selectedIndex].pieData.value);
                option.series[selectedIndex].pieStatus.selected = false;
            }
            // 对当前点击的扇形，执行选中/取消选中操作（对 option 更新）
            option.series[params.seriesIndex].parametricEquation = $this.getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, option.series[selectedIndex].pieData.value);
            option.series[params.seriesIndex].pieStatus.selected = isSelected;
            // 如果本次是选中操作，记录上次选中的扇形对应的系列号 seriesIndex
            isSelected ? selectedIndex = params.seriesIndex : null;
            // 使用更新后的 option，渲染图表
            $this.myChart.setOption(option);
        });
        // 监听 mouseover，近似实现高亮（放大）效果
        $this.myChart.on('mouseover', function(params) {
            // 准备重新渲染扇形所需的参数
            let isSelected;
            let isHovered;
            let startRatio;
            let endRatio;
            let k;
            // 如果触发 mouseover 的扇形当前已高亮，则不做操作
            if (hoveredIndex === params.seriesIndex) {
                return;
                // 否则进行高亮及必要的取消高亮操作
            } else {
                // 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
                if (hoveredIndex !== '') {
                    // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
                    isSelected = option.series[hoveredIndex].pieStatus.selected;
                    isHovered = false;
                    startRatio = option.series[hoveredIndex].pieData.startRatio;
                    endRatio = option.series[hoveredIndex].pieData.endRatio;
                    k = option.series[hoveredIndex].pieStatus.k;

                    // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
                    option.series[hoveredIndex].parametricEquation = $this.getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, option.series[hoveredIndex].pieData.value);
                    option.series[hoveredIndex].pieStatus.hovered = isHovered;

                    // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
                    hoveredIndex = '';
                }
                // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
                if (params.seriesName !== 'mouseoutSeries') {
                    // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
                    isSelected = option.series[params.seriesIndex].pieStatus.selected;
                    isHovered = true;
                    startRatio = option.series[params.seriesIndex].pieData.startRatio;
                    endRatio = option.series[params.seriesIndex].pieData.endRatio;
                    k = option.series[params.seriesIndex].pieStatus.k;

                    // 对当前点击的扇形，执行高亮操作（对 option 更新）
                    option.series[params.seriesIndex].parametricEquation = $this.getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, option.series[params.seriesIndex].pieData.value + 5);
                    option.series[params.seriesIndex].pieStatus.hovered = isHovered;

                    // 记录上次高亮的扇形对应的系列号 seriesIndex
                    hoveredIndex = params.seriesIndex;
                }

                // 使用更新后的 option，渲染图表
                $this.myChart.setOption(option);
            }
        });
        // 修正取消高亮失败的 bug
        $this.myChart.on('globalout', function() {
            if (hoveredIndex !== '') {
                // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
                isSelected = option.series[hoveredIndex].pieStatus.selected;
                isHovered = false;
                k = option.series[hoveredIndex].pieStatus.k;
                startRatio = option.series[hoveredIndex].pieData.startRatio;
                endRatio = option.series[hoveredIndex].pieData.endRatio;
                // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
                option.series[hoveredIndex].parametricEquation = $this.getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, option.series[hoveredIndex].pieData.value);
                option.series[hoveredIndex].pieStatus.hovered = isHovered;

                // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
                hoveredIndex = '';
            }
            // 使用更新后的 option，渲染图表
            $this.myChart.setOption(option);
        });
      },
      // 生成模拟 3D 饼图的配置项
      getPie3D(pieData, internalDiameterRatio) {
        var $this = this;
        let series = [];
        let sumValue = 0;
        let startValue = 0;
        let endValue = 0;
        let legendData = [];
        let k = typeof internalDiameterRatio !== 'undefined' ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio) : 1 / 3;
        // 为每一个饼图数据，生成一个 series-surface 配置
        for (let i = 0; i < pieData.length; i++) {
            sumValue += pieData[i].value;
            let seriesItem = {
                name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
                type: 'surface',
                parametric: true,
                wireframe: {
                    show: false
                },
                pieData: pieData[i],
                pieStatus: {
                    selected: false,
                    hovered: false,
                    k: k
                },
            };
            if (typeof pieData[i].itemStyle != 'undefined') {
                let itemStyle = {};
                typeof pieData[i].itemStyle.color != 'undefined' ? itemStyle.color = pieData[i].itemStyle.color : null;
                typeof pieData[i].itemStyle.opacity != 'undefined' ? itemStyle.opacity = pieData[i].itemStyle.opacity : null;
                seriesItem.itemStyle = itemStyle;
            }
            series.push(seriesItem);
        }
        // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
        // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
        for (let i = 0; i < series.length; i++) {
            endValue = startValue + series[i].pieData.value;
            series[i].pieData.startRatio = startValue / sumValue;
            series[i].pieData.endRatio = endValue / sumValue;
            series[i].parametricEquation = $this.getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio, false, false, k, series[i].pieData.value);
            startValue = endValue;
            legendData.push(series[i].name);
        }
        // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
        series.push({
            name: 'mouseoutSeries',
            type: 'surface',
            parametric: true,
            wireframe: {
                show: false
            },
            itemStyle: {
                opacity: 0
            },
            parametricEquation: {
              u: {
                  min: 0,
                  max: Math.PI * 2,
                  step: Math.PI / 20
              },
              v: {
                  min: 0,
                  max: Math.PI,
                  step: Math.PI / 20
              },
              x: function(u, v) {
                  return Math.sin(v) * Math.sin(u) + Math.sin(u);
              },
              y: function(u, v) {
                  return Math.sin(v) * Math.cos(u) + Math.cos(u);
              },
              z: function(u, v) {
                  return Math.cos(v) > 0 ? 0.1 : -0.1;
              }
            }
        });
        // 准备待返回的配置项，把准备好的 legendData、series 传入。
        let option = {
            //animation: false,
            legend: {
              show:false,
              data: legendData
            },
            tooltip: {
              formatter: params => {
                if (params.seriesName !== 'mouseoutSeries') {
                  console.log(pieData)
                  var score = 0;
                  var percent = 0;
                  pieData.forEach(function(item){
                    if(item.name==params.seriesName){
                      score = item.score;
                      percent = item.value+"%";
                    }
                  });
                  console.log(params)
                  var text = `${params.seriesName}<br/>
                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                        params.color
                    };"></span>积分：${score}<br/>
                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                        params.color
                    };"></span>占比：${percent}`;
                  return text;
                }
              }
            },
            xAxis3D: {
                min: -1,
                max: 1
            },
            yAxis3D: {
                min: -1,
                max: 1
            },
            zAxis3D: {
                min: -1,
                max: 1
            },
            grid3D: {
                show: false,
                boxHeight: 16,
                viewControl: {//3d效果可以放大、旋转等，请自己去查看官方配置
                    alpha: 30,
                    // beta: 90,
                    rotateSensitivity: 0,
                    zoomSensitivity: 0,
                    panSensitivity: 0,
                    autoRotate: false
                },
                //后处理特效可以为画面添加高光、景深、环境光遮蔽（SSAO）、调色等效果。可以让整个画面更富有质感。
                postEffect: {//配置这项会出现锯齿，请自己去查看官方配置有办法解决 
                    enable: true,
                    bloom: {
                        enable: true,
                        bloomIntensity: 0.5
                    },
                    SSAO: {
                        enable: true,
                        quality: 'medium',
                        radius: 2
                    }
                }
            },
            series: series
        };
        return option;
      },
      // 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
      getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
        // 计算
        let midRatio = (startRatio + endRatio) / 2;
        let startRadian = startRatio * Math.PI * 2;
        let endRadian = endRatio * Math.PI * 2;
        let midRadian = midRatio * Math.PI * 2;
        // 如果只有一个扇形，则不实现选中效果。
        if (startRatio === 0 && endRatio === 1) {
            isSelected = false;
        }
        // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
        k = typeof k !== 'undefined' ? k : 1 / 3;
        // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
        let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
        let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
        // 计算高亮效果的放大比例（未高亮，则比例为 1）
        let hoverRate = isHovered ? 1.05 : 1;
        // 返回曲面参数方程
        return {
            u: {
                min: -Math.PI,
                max: Math.PI * 3,
                step: Math.PI / 32
            },
            v: {
                min: 0,
                max: Math.PI * 2,
                step: Math.PI / 20
            },
            x: function(u, v) {
                if (u < startRadian) {
                    return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                if (u > endRadian) {
                    return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
            },
            y: function(u, v) {
                if (u < startRadian) {
                    return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                if (u > endRadian) {
                    return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
                }
                return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
            },
            z: function(u, v) {
                if (u < -Math.PI * 0.5) {
                    return Math.sin(u);
                }
                if (u > Math.PI * 2.5) {
				          return Math.sin(u);
                }
			          return Math.sin(v) > 0 ? 1 : -1;
            }
        };
      }
    }
}
</script>

<style scoped lang="scss">
</style>