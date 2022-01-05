<template>
  <div class="hxpage btm_prochart">
      <div class="title-view">
        <div class="title">热门产品TOP10<span v-if="type==2 && language=='中文'">（单位：分）</span><span v-else>（单位：个）</span></div>
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
        let shadowData = [];
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
                var obj = {};
                obj.value= chartBotData[i].number;
                obj.symbol = 'image://' + chartBotData[i].pimg;
                obj.symbolPosition = 'start';
                obj.symbolSize = [42,42];
                obj.symbolOffset= [0, 49];
                obj.symbolBorderRadius= "50%";
                picData.push(obj);

                var obj2 = {};
                obj2.value= chartBotData[i].number;
                obj2.symbol = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAEzUlEQVRYhc2ZTWwUVRzAf292Z95+t12WfpKQTMMmEoSD1wZO1ZOa4EFoYiIeJOjRC0KEVQLhbkzDRYmJqwc1KgchcAE8GhIQPSwyCYSW0o8t3e7Xm+3ueOhsre0uy+K2099t33uz75d/3vu/mfcXL7/yDi+KlTTDwAhwANgNJIE+IOIOyQNPgAzwF3ADuGlmrEL9P+78/nVbc/pfQFIArwFHhOO8LssqGCyWMJSNblfwV5cQNQcARxPxJZ8/XjH0l2xpvFkKBT9WAVmykuYl4CvgCuC0M79oJ8JW0jwInDKUvS+2kCOymEer1tqZj5pPIx+NkOuKYUvjNpDKp1M/dVTYSprDwLhUarRndp5QodiWZDOK4RDZRBxbGleBY/l06n6rZ7RWA6yk+bZwnFvbZuZGhx5MdEwWIFQoMvRwgm0zc6PCcW5FxlKHWj3TNMLuWj2jVyon+yafYCi7Y6KNsKXBk8E+Krp+Fvgkn041XNsNI+zKfi7L6uTgw8kNlwUwlM3gw0lkWZ0ExiNjKdFoXLMlcU6W1YcDjx7jq1Y3znINvmqVgUePkWV1FDjXaMw6YStpHtIrleP9E1NotfYyQCfQajX6J6bQK5XjkbHU4XX9q39YSXNYOM6F3snpTY3sWnzVKr2T0wjHuRAZSw2v7lsb4fH4bDYmldpEvcZIpYjPZqPA+Or2FWEraR40lD3aNb+w6XLN6JpfwFD2aGQsdbDepsFKVjgVn816JtcM1+l0PWvUI/yqVGpfJw+FThEqFJFK7WX5/WVF+Ejsac47qxa4bu8CiPDh02HhOLM77z8IeJHGnoeapvFgeGfZESKhASOyrLasLCznZllWAWBEAw4EiyWvnVriOh7QgD2b8a7wf3Ed92jALt2ueKzTGtdxlwZs9/IYfl5cx+0aEN3KG66O6xht+cWx1dCAxZq29b1dx0UNmKn6fB7rtMZ1nNGAexVD91inNa7jPQ24a0vDY53WuI53NeBGKRT0WKc1ruMNDbipArK8lTdeTdNQAVkGbmpmxio4QvxciIa99mpKIRrGEeKXfDpVqIf14kJ3l6dSz8J1uwj/vsBfsaVxpxgOeeXUlGI4hC2NO8BlcIXNjOUAn2YTcRzR8MLFExwhyCbiAJ/Vr65WdpqZsX60pXE11x3zym8due4YtjSu5dOpH+pta1PDsWwivqik3GS19SgpySbii8Cx1e3/ETYz1n1HiPenB3vx8riu+nxMD/biCHE0n079vbpvXfI1M9Z3FV0/PzXUjxe5uaZpTA31U9H18/l06tu1/c2MTqiA/OLxjoFNjXTV5+PxjgFUQF4ATjQa4+sb3LeusWdunvltPb9W/X5/MRreHyyVN/xy0JYGUzsGsKVxFvio2YV2yxqHlTTHhOOMx2ezsY24d3OEINcdI5uI5xwhPsinU988a3zDCK+mZ27+j/lE/PtSOLS7GAmZ/qUqeqUzH63FcIjpgT7yseg1hHgjn05db/VMu2Wvt1gue+2NPc0Ryb9g2SsSYbE7ipLyNnBmdZ7tqLArXS8svucWFgPPKCyy5PNTMXRsaVAKBVEBWXaEuAR8CVxptlab0XYl1D3GLwOXraQZKQcDI+VgYD+wB9jF+tLtNMul2z+B68BvZsbKtztvnX8AcK7kgXAIBSAAAAAASUVORK5CYII=';
                obj2.symbolPosition = 'start';
                obj2.symbolSize = [44,44];
                obj2.symbolOffset= [0, 49];
                bgData.push(obj2);

                var obj3 = {};
                obj3.value= 0.5;
                shadowData.push(obj3);
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
                  var obj = {};
                  obj.value= chartBotData[i].score;
                  obj.symbol = 'image://' + chartBotData[i].pimg;
                  obj.symbolPosition = 'start';
                  obj.symbolSize = [42,42];
                  obj.symbolOffset= [0, 49];
                  picData.push(obj);

                  var obj2 = {};
                  obj2.value= chartBotData[i].score;
                  obj2.symbol = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAEzUlEQVRYhc2ZTWwUVRzAf292Z95+t12WfpKQTMMmEoSD1wZO1ZOa4EFoYiIeJOjRC0KEVQLhbkzDRYmJqwc1KgchcAE8GhIQPSwyCYSW0o8t3e7Xm+3ueOhsre0uy+K2099t33uz75d/3vu/mfcXL7/yDi+KlTTDwAhwANgNJIE+IOIOyQNPgAzwF3ADuGlmrEL9P+78/nVbc/pfQFIArwFHhOO8LssqGCyWMJSNblfwV5cQNQcARxPxJZ8/XjH0l2xpvFkKBT9WAVmykuYl4CvgCuC0M79oJ8JW0jwInDKUvS+2kCOymEer1tqZj5pPIx+NkOuKYUvjNpDKp1M/dVTYSprDwLhUarRndp5QodiWZDOK4RDZRBxbGleBY/l06n6rZ7RWA6yk+bZwnFvbZuZGhx5MdEwWIFQoMvRwgm0zc6PCcW5FxlKHWj3TNMLuWj2jVyon+yafYCi7Y6KNsKXBk8E+Krp+Fvgkn041XNsNI+zKfi7L6uTgw8kNlwUwlM3gw0lkWZ0ExiNjKdFoXLMlcU6W1YcDjx7jq1Y3znINvmqVgUePkWV1FDjXaMw6YStpHtIrleP9E1NotfYyQCfQajX6J6bQK5XjkbHU4XX9q39YSXNYOM6F3snpTY3sWnzVKr2T0wjHuRAZSw2v7lsb4fH4bDYmldpEvcZIpYjPZqPA+Or2FWEraR40lD3aNb+w6XLN6JpfwFD2aGQsdbDepsFKVjgVn816JtcM1+l0PWvUI/yqVGpfJw+FThEqFJFK7WX5/WVF+Ejsac47qxa4bu8CiPDh02HhOLM77z8IeJHGnoeapvFgeGfZESKhASOyrLasLCznZllWAWBEAw4EiyWvnVriOh7QgD2b8a7wf3Ed92jALt2ueKzTGtdxlwZs9/IYfl5cx+0aEN3KG66O6xht+cWx1dCAxZq29b1dx0UNmKn6fB7rtMZ1nNGAexVD91inNa7jPQ24a0vDY53WuI53NeBGKRT0WKc1ruMNDbipArK8lTdeTdNQAVkGbmpmxio4QvxciIa99mpKIRrGEeKXfDpVqIf14kJ3l6dSz8J1uwj/vsBfsaVxpxgOeeXUlGI4hC2NO8BlcIXNjOUAn2YTcRzR8MLFExwhyCbiAJ/Vr65WdpqZsX60pXE11x3zym8due4YtjSu5dOpH+pta1PDsWwivqik3GS19SgpySbii8Cx1e3/ETYz1n1HiPenB3vx8riu+nxMD/biCHE0n079vbpvXfI1M9Z3FV0/PzXUjxe5uaZpTA31U9H18/l06tu1/c2MTqiA/OLxjoFNjXTV5+PxjgFUQF4ATjQa4+sb3LeusWdunvltPb9W/X5/MRreHyyVN/xy0JYGUzsGsKVxFvio2YV2yxqHlTTHhOOMx2ezsY24d3OEINcdI5uI5xwhPsinU988a3zDCK+mZ27+j/lE/PtSOLS7GAmZ/qUqeqUzH63FcIjpgT7yseg1hHgjn05db/VMu2Wvt1gue+2NPc0Ryb9g2SsSYbE7ipLyNnBmdZ7tqLArXS8svucWFgPPKCyy5PNTMXRsaVAKBVEBWXaEuAR8CVxptlab0XYl1D3GLwOXraQZKQcDI+VgYD+wB9jF+tLtNMul2z+B68BvZsbKtztvnX8AcK7kgXAIBSAAAAAASUVORK5CYII=';
                  obj2.symbolPosition = 'start';
                  obj2.symbolSize = [44,44];
                  obj2.symbolOffset= [0, 49];
                  bgData.push(obj2);

                  var obj3 = {};
                  obj3.value= 0.5;
                  shadowData.push(obj3);
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

                  var obj = {};
                  obj.value= chartBotData[i].number;
                  obj.symbol = 'image://' + chartBotData[i].pimg;
                  obj.symbolPosition = 'start';
                  obj.symbolSize = [42,42];
                  obj.symbolOffset= [0, 49];
                  obj.symbolBorderRadius= "50%";
                  picData.push(obj);

                  var obj2 = {};
                  obj2.value= chartBotData[i].number;
                  obj2.symbol = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAEzUlEQVRYhc2ZTWwUVRzAf292Z95+t12WfpKQTMMmEoSD1wZO1ZOa4EFoYiIeJOjRC0KEVQLhbkzDRYmJqwc1KgchcAE8GhIQPSwyCYSW0o8t3e7Xm+3ueOhsre0uy+K2099t33uz75d/3vu/mfcXL7/yDi+KlTTDwAhwANgNJIE+IOIOyQNPgAzwF3ADuGlmrEL9P+78/nVbc/pfQFIArwFHhOO8LssqGCyWMJSNblfwV5cQNQcARxPxJZ8/XjH0l2xpvFkKBT9WAVmykuYl4CvgCuC0M79oJ8JW0jwInDKUvS+2kCOymEer1tqZj5pPIx+NkOuKYUvjNpDKp1M/dVTYSprDwLhUarRndp5QodiWZDOK4RDZRBxbGleBY/l06n6rZ7RWA6yk+bZwnFvbZuZGhx5MdEwWIFQoMvRwgm0zc6PCcW5FxlKHWj3TNMLuWj2jVyon+yafYCi7Y6KNsKXBk8E+Krp+Fvgkn041XNsNI+zKfi7L6uTgw8kNlwUwlM3gw0lkWZ0ExiNjKdFoXLMlcU6W1YcDjx7jq1Y3znINvmqVgUePkWV1FDjXaMw6YStpHtIrleP9E1NotfYyQCfQajX6J6bQK5XjkbHU4XX9q39YSXNYOM6F3snpTY3sWnzVKr2T0wjHuRAZSw2v7lsb4fH4bDYmldpEvcZIpYjPZqPA+Or2FWEraR40lD3aNb+w6XLN6JpfwFD2aGQsdbDepsFKVjgVn816JtcM1+l0PWvUI/yqVGpfJw+FThEqFJFK7WX5/WVF+Ejsac47qxa4bu8CiPDh02HhOLM77z8IeJHGnoeapvFgeGfZESKhASOyrLasLCznZllWAWBEAw4EiyWvnVriOh7QgD2b8a7wf3Ed92jALt2ueKzTGtdxlwZs9/IYfl5cx+0aEN3KG66O6xht+cWx1dCAxZq29b1dx0UNmKn6fB7rtMZ1nNGAexVD91inNa7jPQ24a0vDY53WuI53NeBGKRT0WKc1ruMNDbipArK8lTdeTdNQAVkGbmpmxio4QvxciIa99mpKIRrGEeKXfDpVqIf14kJ3l6dSz8J1uwj/vsBfsaVxpxgOeeXUlGI4hC2NO8BlcIXNjOUAn2YTcRzR8MLFExwhyCbiAJ/Vr65WdpqZsX60pXE11x3zym8due4YtjSu5dOpH+pta1PDsWwivqik3GS19SgpySbii8Cx1e3/ETYz1n1HiPenB3vx8riu+nxMD/biCHE0n079vbpvXfI1M9Z3FV0/PzXUjxe5uaZpTA31U9H18/l06tu1/c2MTqiA/OLxjoFNjXTV5+PxjgFUQF4ATjQa4+sb3LeusWdunvltPb9W/X5/MRreHyyVN/xy0JYGUzsGsKVxFvio2YV2yxqHlTTHhOOMx2ezsY24d3OEINcdI5uI5xwhPsinU988a3zDCK+mZ27+j/lE/PtSOLS7GAmZ/qUqeqUzH63FcIjpgT7yseg1hHgjn05db/VMu2Wvt1gue+2NPc0Ryb9g2SsSYbE7ipLyNnBmdZ7tqLArXS8svucWFgPPKCyy5PNTMXRsaVAKBVEBWXaEuAR8CVxptlab0XYl1D3GLwOXraQZKQcDI+VgYD+wB9jF+tLtNMul2z+B68BvZsbKtztvnX8AcK7kgXAIBSAAAAAASUVORK5CYII=';
                  obj2.symbolPosition = 'start';
                  obj2.symbolSize = [44,44];
                  obj2.symbolOffset= [0, 49];
                  bgData.push(obj2);

                  var obj3 = {};
                  obj3.value= 0.5;
                  shadowData.push(obj3);
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
                  const c0 = [shape.x+7, shape.y];
                  const c1 = [shape.x - 6, shape.y];
                  const c2 = [xAxisPoint[0] -6, xAxisPoint[1]];
                  const c3 = [xAxisPoint[0]+7, xAxisPoint[1]];
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
                  const c1 = [shape.x+7, shape.y];
                  const c2 = [xAxisPoint[0]+7, xAxisPoint[1]];
                  const c3 = [xAxisPoint[0] + 14, xAxisPoint[1]];
                  const c4 = [shape.x + 14, shape.y - 4];
                  ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
              },
          });
          const CubeTop = echarts.graphic.extendShape({
              shape: {
                  x: 0,
                  y: 0,
              },
              buildPath: function (ctx, shape) {
                  const c1 = [shape.x+7, shape.y];
                  const c2 = [shape.x -6, shape.y];
                  const c3 = [shape.x, shape.y - 5];
                  const c4 = [shape.x+15, shape.y - 5];
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
                  bottom: '0',
                  top: '26',
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
                      margin: 59,
                      formatter: function (value) {
                        var num = value.split("").length;
                        var str = value;
                        if(num>6){
                          str = str.split("").slice(0,5).join("\n");
                          str = str + '\n{addtext|…}';
                        }else{
                          str = str.split("").join("\n");
                        }
                        return str;
                      },
                      rich:{
                        addtext:{
                          rotate: 90,
                          align: "top",
                          verticalAlign: "top"
                        },
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
              series: [
                    {
                        z: 4,
                        type: "pictorialBar",
                        data: bgData,
                    },
                    {
                        z: 6,
                        type: "pictorialBar",
                        data: picData
                    },
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
                                            fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {
                                                    offset: 0,
                                                    color: '#a385fc',
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
                    { //shadow
                        name: "",
                        type: "pictorialBar",
                        symbolSize: [17, 4],
                        symbolOffset: [3, -5],
                        z: 1,
                        itemStyle: {
                          color: "#1c2042",
                          shadowBlur: 9,
                          shadowColor: 'rgba(85, 149, 253, 1)',
                          shadowOffsetY: 8,
                          shadowOffsetX: 0,
                          opacity: 1
                        },
                        data: shadowData,
                        tooltip:{
                            show: false
                        }
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
            console.log(chartBotData)
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