<template>
  <div class="hxpage btm_prochart">
      <div class="title-view">
        <div class="title">热门产品TOP10
          <!-- <span v-if="type==2 && language=='中文'">（单位：分）</span><span v-else>（单位：个）</span> -->
        </div>
        <router-link :to="{path:language == '中文'?'/stat/cn/departAnalysis':'/stat/en/departAnalysis',query:{type:6,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}}" tag="a" target="_blank" class="more">更多分析 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></router-link>
        <div class="btn-group">
          <div @click="changeType(1)" class="btn-item" :class="type == 1?'active':''">询盘个数</div>
          <div @click="changeType(2)" class="btn-item" :class="type == 2?'active':''">成交{{language=='中文'?'积分':'个数'}}</div>
        </div>
      </div>
      <div class="chart-bottom" id="HotProductChart"></div>
      <div class="productChart" v-if="!hasData">暂无数据</div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { mapGetters } from 'vuex'
export default {
    name:'demo',
    data(){
      return {
        type: 1,
        myChart:null,
        startTime:"",
        endTime:"",
        baseDepart:"",
        contrastDepart:"",
        hasData: true,
      }
    },
    props:{
      producttop10:{
        type:Object,
        default:function(){
          return {}
        }
      },
      departList:{
        type:Array,
        default:function(){
          return []
        }
      },
      language:{
        type:String,
        default:"中文"
      },
      year:{
        type: Number,
        default: new Date().getFullYear()
      },
    },
    watch:{
      type:function(val,oldval){
        this.setChartBottom()
      },
      producttop10:{
        handler(val,oldval){
          this.goPage();
          this.setChartBottom()
        },
        deep:true
      },
      isCollapse(){
        setTimeout(() => {
          this.echartsSize();
        }, 400)
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
    methods:{
      changeType(val){
        this.type = val;
      },
      setChartBottom(){
        var $this = this;
        let chartBotData = [];
        let xAxisData = [];
        let seriesData = [];
        let picData=[];
        let bgData = [];
        let showchart = 0;
        if($this.myChart){
          $this.myChart.dispose();
        }
        if($this.type == 1){
            // 询盘个数
            chartBotData = JSON.parse(JSON.stringify($this.producttop10.productxuntop10));
            if(chartBotData.length > 0){
              $this.hasData = true;
              showchart = 1;
              for(let i = 0;i<chartBotData.length;i++){
                xAxisData.push(chartBotData[i].aliasname);
                seriesData.push(chartBotData[i].number);
              }
            }else{
              $this.hasData = false;
            }        
            
        }else if($this.type == 2 && $this.language == "中文"){
          // 中文成交积分
            chartBotData = JSON.parse(JSON.stringify($this.producttop10.productscoretop10));
            if(chartBotData.length > 0){
              $this.hasData = true;
              showchart = 1;
              for(let i = 0;i<chartBotData.length;i++){
                  xAxisData.push(chartBotData[i].aliasname);
                  seriesData.push(chartBotData[i].score);
              }
            }else{
              $this.hasData = false;
            }
        }else if($this.type == 2 && $this.language == "英文"){
          // 英文成交个数
            chartBotData = JSON.parse(JSON.stringify($this.producttop10.productscoretop10));
            if(chartBotData.length > 0){
              $this.hasData = true;
              showchart = 1;
              for(let i = 0;i<chartBotData.length;i++){
                  xAxisData.push(chartBotData[i].aliasname);
                  seriesData.push(chartBotData[i].number);
              }
            }else{
              $this.hasData = false;
            }
          }
        
        if(showchart == 1){
          var chartDom = document.getElementById('HotProductChart');
          var myChart = echarts.init(chartDom);

          const CubeLeft = echarts.graphic.extendShape({
              shape: {
                  x: 0,
                  y: 0,
              },
              buildPath: function (ctx, shape) {
                  
                  const xAxisPoint = shape.xAxisPoint;
                  const c0 = [shape.x+3, shape.y]; //+9
                  const c1 = [shape.x - 15, shape.y]; //-9
                  const c2 = [xAxisPoint[0] -15, xAxisPoint[1]]; //-9
                  const c3 = [xAxisPoint[0]+3, xAxisPoint[1]]; //+9
                  ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath();
              },
          });
          const CubeRight = echarts.graphic.extendShape({
              shape: {
                  x: 0,
                  y: 0,
              },
              buildPath: function (ctx, shape) {
                  const xAxisPoint = shape.xAxisPoint;
                  const c1 = [shape.x+3, shape.y]; //+9
                  const c2 = [xAxisPoint[0]+3 , xAxisPoint[1]]; //+9
                  const c3 = [xAxisPoint[0] + 15, xAxisPoint[1]]; //+21
                  const c4 = [shape.x + 15, shape.y - 6]; //-6
                  ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
              },
          });
          const CubeTop = echarts.graphic.extendShape({
              shape: {
                  x: 0,
                  y: 0,
              },
              buildPath: function (ctx, shape) {
                  const c1 = [shape.x+3, shape.y]; //+9
                  const c2 = [shape.x -15, shape.y]; //-10
                  const c3 = [shape.x -3, shape.y - 6]; //-6
                  const c4 = [shape.x+15, shape.y - 6]; //-6
                  ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
              },
          });
          echarts.graphic.registerShape('CubeLeft', CubeLeft);
          echarts.graphic.registerShape('CubeRight', CubeRight);
          echarts.graphic.registerShape('CubeTop', CubeTop);

          var option = {
              tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'shadow',
                  },
                  formatter: function (params) {
                      let returnData = '';
                      let name = "";
                      if($this.type == 1){
                          name="询盘个数"
                      }else if($this.type == 2&&$this.language == "中文"){  
                        name="成交积分"
                      }else if($this.type == 2&&$this.language == "英文"){
                        name="成交个数"
                      }
                      for (let i = 0; i < params.length; i++) {
                          returnData = params[i].name + '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background:#1e4acd"></span>'
                          +name + '<span style="padding-left:13px">' 
                          + params[i].value + '</span>';
                      }
                      return returnData;
                  },
              },
              grid: {
                  left: '50',
                  right: '1',
                  bottom: '5',
                  top: '24',
                  containLabel: true
              },
              xAxis: {
                  type: "category",
                  data: xAxisData,
                  axisTick: {
                      show: false
                  },
                  axisLine: {
                      show:true,
                      lineStyle:{
                        color: "#323958",
                        type: "solid"
                      },
                  },
                  axisLabel: {
                      rotate: 0,
                      interval: 0,
                      margin: 14,
                      formatter: function (value) {
                        var num = value.split("").length;
                        var str = value;
                        // if(num>6){
                        //   str = str.split("").slice(0,5).join("\n");
                        //   str = str + '\n…';
                        // }else{
                        //   str = str.split("").join("\n");
                        // }
                        if(num>6){
                          str = str.slice(0,5);
                          str = str + '…';
                        }
                        return str;
                      },
                      rich:{
                        addtext:{
                        }
                      },
                      textStyle: {
                          padding: [2,0,0,0],
                          fontSize: 13,
                          color: "#ccc",
                      }
                  },
                  splitLine:{
                      show: true,
                      lineStyle:{
                          type: [4, 3],
                          dashOffset: 3,
                          color: '#ebebeb',
                          opacity: 0.1,
                          shadowColor: null,
                          shadowBlur: 0,
                          shadowOffsetX: 0,
                          shadowOffsetY: 0,
                      }
                  },
              },
              yAxis: {
                  name: "",
                  type: "value",
                  triggerEvent: true,
                  splitLine:{
                      lineStyle:{
                          type: [4, 3],
                          dashOffset: 3,
                          color: '#ebebeb',
                          opacity: 0.1,
                          shadowColor: null,
                          shadowBlur: 0,
                          shadowOffsetX: 0,
                          shadowOffsetY: 0,
                      }
                  },
                  axisTick: {
                      show: false
                  },
                  axisLine: {
                      show: true,
                      lineStyle: {
                          type: [4, 3],
                          dashOffset: 3,
                          color: '#ebebeb',
                          opacity: 0.01,
                          shadowColor: null,
                          shadowBlur: 0,
                          shadowOffsetX: 0,
                          shadowOffsetY: 0,
                      }
                  },
                  axisLabel: {
                      show: true,
                      color: "#ccc",
                      fontSize: 13,
                      inside:true,        // 标签刻度朝内
                      margin:0,           // 清除默认间距
                      padding:[0,10,0,0], // 右边内边距10
                      textStyle:{
                          align:'right'   // 文字右对齐
                      }
                  },
                  splitNumber:4,
              },
              animation: false,
              series: [
                    {
                        type: 'custom',
                        name: $this.type == 2 && $this.language == "中文" ? "积分" : "个数",
                        renderItem: (params, api) => {
                            const location = api.coord([api.value(0), api.value(1)]);
                            return {
                                type: 'group',
                                children: [
                                    {
                                        type: 'CubeLeft',
                                        shape: {
                                            api,
                                            xValue: api.value(0),
                                            yValue: api.value(1),
                                            x: location[0],
                                            y: location[1],
                                            xAxisPoint: api.coord([api.value(0), 0]),
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {
                                                    offset: 0,
                                                    color: '#a4fdf9',
                                                },{
                                                    offset: 0.5,
                                                    color: '#87d8fa',
                                                },{
                                                    offset: 1,
                                                    color: '#5496fd',
                                                },
                                            ]),
                                        },
                                    },
                                    {
                                        type: 'CubeRight',
                                        shape: {
                                            api,
                                            xValue: api.value(0),
                                            yValue: api.value(1),
                                            x: location[0],
                                            y: location[1],
                                            xAxisPoint: api.coord([api.value(0), 0]),
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {
                                                    offset: 0,
                                                    color: '#4785fe',
                                                },
                                                {
                                                    offset: 1,
                                                    color: '#1e4acd',
                                                },
                                            ]),
                                        },
                                    },
                                    {
                                        type: 'CubeTop',
                                        shape: {
                                            api,
                                            xValue: api.value(0),
                                            yValue: api.value(1),
                                            x: location[0],
                                            y: location[1],
                                            xAxisPoint: api.coord([api.value(0), 0]),
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                                {
                                                    offset: 0,
                                                    color: '#c8b6ff',
                                                },
                                                {
                                                    offset: 1,
                                                    color: '#a385fc',
                                                },
                                            ]),
                                        },
                                    },
                                ],
                            };
                        },
                        data: seriesData,
                    },
                    {
                        type: 'bar',
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                color: '#ccc',
                                offset: [5, -5],
                                fontSize: 13,
                            },
                        },
                        itemStyle: {
                            color: 'transparent',
                        },
                        tooltip: {
                          show: false
                        },
                        data: seriesData,
                    },
              ]
          };
          
          this.myChart = myChart;
          // 使用刚指定的配置项和数据显示图表。
          myChart.setOption(option);
          this.echartsResize = this.myChart.resize();

          myChart.on('click', function (params) {
            let dataIndex = params.dataIndex;
            let id = chartBotData[dataIndex].typeid;
            let productname = '';
            if($this.type==1){
              productname = chartBotData[dataIndex].productname;
            }else{
              productname = chartBotData[dataIndex].xunproduct;
            }
            var date = new Date();
            var endDate = '';
            var endYear = date.getFullYear();
            var endMonth = date.getMonth() + 1;
            var startYear;
            var startMonth;
            var startDate = '';
            if(endMonth>6){
              startMonth = endMonth-6;
              startYear = endYear;
            }else{
              startMonth = endMonth+6;
              startYear = endYear-1;
            }
            startMonth = startMonth<10?'0'+startMonth:startMonth;
            endMonth = endMonth<10?'0'+endMonth:endMonth; 
            startDate = startYear+"-"+startMonth;
            endDate = endYear+"-"+endMonth;
            if($this.language == '中文'){
              $this.$router.push({path:'/stat/cn/productAnalysis/ProAccount',query:{starttime:startDate,endtime:endDate,productname:productname,typeid:id}});
            }else{
              $this.$router.push({path:'/stat/en/productAnalysis/ProAccount',query:{starttime:startDate,endtime:endDate,productname:productname,typeid:id}});
            }
          })
        }

      },

      echartsSize(){
        if(this.myChart){
          this.myChart.resize();
        }
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
    },
    destroyed(){
      window.removeEventListener('resize',this.echartsSize);
      if(this.myChart){
        this.myChart.dispose();
      }
    }
}
</script>
<style lang="scss">
</style>