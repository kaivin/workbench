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
                var obj = {};
                obj.value= chartBotData[i].number;
                obj.symbol = 'image://' + chartBotData[i].pimg;
                obj.symbolPosition = 'start';
                obj.symbolSize = [66,58];
                obj.symbolOffset= [0, 73];
                obj.symbolBorderRadius= "50%";
                picData.push(obj);

                var obj2 = {};
                obj2.value= chartBotData[i].number;
                obj2.symbol = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFUAAABQCAYAAABoODnpAAAQyklEQVR4nNWcPc8sNxXH/8cz+/IkEoiAAgkoEUIUEZ+AAlFAxSeAJkKioKOhygdASJSkpqGhgw7EN6CDBiEBEgIhAiRpknufZ3dn7ENhH/scj+dl793cG6zsnbHHO+P5zf+82LN5iJnxUZW/+KEDcATgAXQATl/udv4ju+DHpJCG+uM/DZPjADhtSbURAJc+HYCeGT2AHoyegR2A/tN3ePG1T+B1AH1ghH9+gH+8f8JjAJ6AEYQRgKe4HYBYBxDUh9MHajspP3/z++AQEEIAOICZwYHBYIAZzAwwct3s1ydObX//8y+3crTQKqgTWJ97nb/V9XibA14OAQgBCB7wIxA8wXuAQxwHOaDrANfF/SMBr+4dXuqBCwPvDAHvDgB7wId0jpERAgBiEDEIDBBHtswI7BFCAHsP7xl+HBE8Yxw9/OjhR4YfA7z38ANj9B5hCBilffQYx5D2A8bBp22shzHY4z4gDAF+ZARf6sHzO+MYvvfXX3znN2tQ+zXo/Q4//cOv/vjyo/fu4foe3a5Hd9ihO+zRH/boDjv0hx12xx12dx32xw7dntD1QO8cur7DnnrsCLgLHuE84nIB/BBwOQUM9yPOD2dc7s8Y7h9wfvQIpw8f4fzBh3H76BHOjx7j8nDCeHrAeL5gHAaEYYD3HsH7qFCfHkKtVA4AEOtcVAqsK9WAePEzr+CLX/sZgFevhZokAo9ojifX4bPv/+1dEEXrly0AwFH1VYBBSWmx6Xc9EMZ4w5fLCD8OCKOPihsH+GGEHwb4YcA4XOAH2x5CAI9jBBg8eEzbEMAhmYiAWYoPTxk6+PF7GM7+lS19DdS33tiZg2/+6Nd47a1vxsEnmExUbmIs/kpUENLNRv9WVBRCQBjHVB9jm9f78il1TmYfBJz4yKdn9ERlPG+LsYvmn01HoCqg2flLP4Y1PfmEWI+OM/aNx/S+/oj4yvnBBWaqmjHEfvOYWwrmZn9qtJUyDmHxuJRlqKEyq2pwos6i1IAQOCtVgNaAxdcxW5WXjwxeAcvRGqnegiLjWXIFy+AWeYy3gJqV6sEg40/lZjndJAcNLRRoBnBIQGuIAle+h9QfGVIGhupBlqgzHX/OBm3rk5atKf0i1OCt+U9OqlVRRVxJg4p/DQZwqNuMcoM6P+eHAYFsxlBUacdHpcPW8uQiNmXF/KNjDr4EKttB1Fqbd5jCFNcgakyRe+JTgygxTExffK5VtwYqcxUss8y8+WYgdVlRqgczIwRvU6k8pnTDSmVQYEMGGyM9N9Ra3EKA8bWBoZVfTD8YmNWArD9VfZi4QKy+qqt0A8rLUEOceQS/BDWZow5KaT8+lKCA+pxeTcGyUm+wLkWpmNOtA1T8rfhcPTaayV1TdRbeVse5UFaV6gcffeOM+UdrTAoFKuXpbKCCyVqldXBrqJSVWU9MXwUz4okSAQuxnU7NlNZ9r5T+2z/5/ezBMI64nKO65nyqgIxVZcIaVJoAlABVAlgdxEJoqRQNmNNPfsBpbKSC1QSj9FuFRmrPYYmXlJVAFTCcxhWolV/NKrP+UvvXOFOaZgRZldm/yrltPlva1X0rs+aYAFr3NAtxuxI7uE39FqH6ccT5HOfd9XiK60kRGwpoNu0qE5D2DNSrzCCCFKUa/1y1ReXFVcFi+oltc6JEMlTUEGenCA0R3QRq8B6X04gwjgDRFGpOqeLwdPQGy4oRN3LU+fw1q1RNJkS92TIAAzIvkZqoT4rfvD+l+qYW3MGNoI443w/J/BsdBKYEDKUoARHqdElg+qm/XVQnoaiUAyiDzN40/kcAsukjrpop+ZKsX8gCUTmwCmuHbrUPsEGpp9OA4MfphXUOWPm7PCtS/nWiWlYwUz+Tt2oXAh30Ijkxf2R4KAs+bGdTESTig8nOlxqmb8HWLqCPUBuZ7hVQX3rj63QSpc6UOhhkoAwDovazIVgFT4NWUaWcl5jU+ZOLkPsO5U5ZYBOBzASgBlevEdesmlDlwCzYJagEAKf7AT4ptZnrSaqjsgCbDbS2JSi1fC7D+uYIFBlmFmi6NRalShpl4pKYu+YWlzF1sjT1w1Ooe6vUWbBzUPNLvtN9XKmfL2J+dbqjU6ww7zMrX1tMXYITlAWk68jtFGmmQVMZh177jW++kiKT/58JZBl1w8Xupkptgm1B1W9NU6Aa21dRarVQq5SoCl4RIjCZJDSA6uXCshRZYrgEMcr8KvNmLubN+jiZyUFsr+6x8qm7tlInYFdf/FmfOn0nJWrIaZWBGnLqZZVazLu0q1WrJaCV/45JfgBAedGEK5halQQC5+oUNhkF23veU6cbNvtUrVKaQm2UDLVsa7XaAMZRpXquXx2fAIU+d7lmNneyKdRUmRSVrAOVgcgwJJVCNd/9rgPi63v9CmCi1rVAlaCOjUvYJNzAFZhqlqX3tWuQIGd8qO6b3QoM0JyTZt+qJie1metMkEipUYKYs0FrJmfdd1mpi2rVUGuVAgCdJVDNLlKXyAsUJWkfa9UK63P1KlQ+FkpQykC5ATTtEEBi9pBUKjHL4ETBRanZBZC+danaNgDY7Zzmo+Vt1Lqq1PPDiC4svPBS5mlmWDq9Mm0Nl4DUN6TvS/65ESgUUILLYKNgXTbvkgGQSrVIQVQKhmKd6n3vAMgFtqdUVH3c5WHAIZv/HFgosDrFQglWsCrVZg8FvLgORN+LDUDTjIny3JyimeeZlKtUqUDW9UaqJdX9PvtUcTqNyL2cp0alnjz2fl6pVqXWZGFcgHxBB5+oSgJQfkyWzpHd6xJQpMXzBEUHJtIZAKl+xQWQWLMcg3xfYVD13c5hmApvotZV8x9OI0JYmqbmvQJNwSsgZbeoVEgFVgEq99EXmQMq6kyiIWRAkY9LboCM2RcFa5BU+VmFIYHd7zsMJfq3oxkK1OrxlM9wia9BFkuVVhWQOkNQJk4M+aGGCXAobqOcZxtQiegZoEAjAuAmgYrkd2DiGmbBloB1ODg8jlDn1EoAeM383XiO76jKEdLyVAy5sS8gocAVuMIq+sUytJzUa9eyCjT50QwkQuQWWMZUuU3/qu4ZwOGQfeqiWucCVd73Q1hXqpYW14DV8RzQJGhZZUobgPw2VA6TBhr/wRSomH2EmIHm3DSp0sm+qNGVCQOVcxYqyfwPJqUynDSEVp6q98kPIb/Y21LYkImn0m06+GQFAymdkvdL6rsymBTlSSlWgFmg2tTVfoZYoBm1CsgWVGilegcLVHfiGmpd8tPIP8NZpJk22vQBsCx4Jl+ad6VvkmHkG7J5ciJLCSzUQnMEGpWIJlCnZk5OQUWpZ7CuAqlhW27HY4f4y3qj1EmZW6UyXyxK1edp+dV6hyDT5IkbyGYeYaYokw5zUaoyrOIPNwAlV9TpXPIWAphM/wzSQEUJXqkcjmaaOgt3bkHF1HOkbk8gJsdsHFOZQf11TtLjZPZUglMUcFGnXtoT8ctUdBZohgaQkzatTKXiFtTKDRyOHXBugpz1qXXJX+RGtJ+WOvpLZEltiQqZUxF0LhubxBWkfxRYCU3yb/GXEUwTqPalGmprC1QBrLgBAuF4l6EaPnVZXfmP97vdp5aqzVn1qTPI/Hy5wMxVMmYf80/1ijj7RlcCzBJQ101N3onp2+AWH1QaoHIxx+NklaoJtp870ISwVip4ereeGEi+y+ITVRuUqQMRaM6pBJRqJ5Q20tAEmHNKpbXJuwpqgSyDF3eQfOpaoaXXKQAAB2om+3Ol+QCUMK2G47nLonIy8KTMuB/bSzqEZOaYmL9AEzBNoK6CCxdnV5WbELPXUI9HV25jhhewIaVycFcotX0dLlEmNdjJgr6iPoV570RIEV/SRB3JdZKPAnoR6Jp/Lb5UVHu4My/+rvapuXRwy0E/s5nplJQ2aTRcOQ9c+9Iy7ORTpZYjdaXObLoFWhtoV9TZgpsyA3lI4ls3mv861B7dPLBMZe14Vc/cpqZfMnxJVYup2zyTsg+OJlVUrEG1gVaKde00K15eMgCS9dTVsgGqux7abLfa1lVd5YMsZgdSW/W99FQoOSgo0AZmnQnUQCfuQEGFeniQQHWDH6gBwA49/NOYfyq0FPDUDEYC1NRjaZhclJQDiU2ttOkXRdIEaKl3xp+ayUAa2/5wQ6WOW6UoN7+kbLK0dCZgj0hUL9+hLE9lolql+Ts2I6AMupsCTfmrTbf0ucp662F/M6V2OF2RUtVc6sLqQOuHtTniAjn6F5iiIGmfUSkEZFFmU8UNoHXQym4AwO5wQ/N/kmK9Z+tni7ZMfnwbG/MZ9Ef8rM4j9SqTKEz7xQzTVS5hNn+1LgAAdjdQKgPgHdxVxn91kVmUivowLAUMMsQS/dXMJ4MjWJVShjhVays7oCnY9AB3u/zgZcDN0oJqOu+bk66nLK28tS46SOQ+OoDZHFLDhQIhKs5qlf5OmbxKpWrfqsF28b3/ZK2tHnoPI5FpSb8fur4s+uGZy6lUqnWQRKnG9HUX5SbE1xroKnhBqd21gEqe6vK5048pVu98ToZ5AXXfb8hTP4Ki5k+w/qD0KGATJCjT1+qkGi6MCs0MqpWrZpcDwJp+E8yaT8XuSZV666LdLTUgE1X1+rAAhAKm/KxROPJ+WW40/lRvJ6X1N1RMfbdN8leXZjo12zfvQdIbq7hy2LgAnRFAgUQBrN1JvfSnTV+VVpAy9blAlT/pl27PvmTBbIA/C1Kda+J7UT0gHZSs+yETIC0fNBS7RIwB8H5jbrap1De7qf9ih2suPnsNqrvU6rdlFqYUTYwb+7eFuqVcw+nakxpYKxfSAshZB4DyV92ANrOJUuvIxod995+XPvmFLSO/TflIEo3q5WK93/yKQsHAG1/6FJjxX0yVOlHtUkrFAIJ7sfvBN7763be7jl7uOkLXOXQdoespbqUt1fuO0O3qfg5dj9zW96ndEVxf2lynzyl1l/7UnYNzyO1x3+V9cvF8RIDrCOQIjgBHdBP1B+Z//+v90w/R/huEpghUPQEwTvjdz7vfAvgKgD3AB8AfEf/S5F36vADgDowXMOKIEXc44wDggPiHFHfpOh3Kj7smeQpuY/gtc9R/jNED+Y81DgDO6fMA4ATgPu3LVtpPqd8FFmgNloENc/+ZAXUokPTDkD6XNAiBqvvLd2qIt4Y6dw/yJ/cGNc4zCrwHFIDSr/5rmVfP/fVg9KBkQAKNqv7SRwa7pNIr04AnLjXUllovKHBP1faCAlSgLqZTwHLyL4OhdEJKF9BJoRQ92BbQlkqfJdSWWjVYcQUacEupLbVuDlR6QAJWBqSBSB89UIGpgWpXMTeZv3Wpo3NtcTLeWrV6u+UP5U6KhirBSjrLvh5MPWh9TAPtsG72z0qp9VhrN6BV29qOsGDn0qkMeXVBpRpQfVyrtE8D0TC1Qlu+9FkoVY81wAqhBXdstG32p0Dbp2q1AlOYuj0ggpOL1/6z5UefJ9SWYmuXoD8afsv8mytWa8v6+ktB7TPK/6QlF94C81mavpSWb12C29rXKl9UKTC/SkXVVv+fGNrXSh+XBtEy9ecJVMoa2BowY6rKlj/V21yW8tQaLFDgarCk2rfCfB5K1ftLcOfqm4AC64GqBbZ1TD61oufU+byg6norii9B3AQU2OZTtwBFY19v6/3nVeZUK9utEK/2qa2B6GR/bqBbQT5PnzrXtgRuTumzZetL/RrcFriYqX8cyhZQV8OUcu0vJbbCrRdbPs5lbXxXj/9Jf37SutD/E8i5cpNx3/I3PVsG9DxdwTN70P8Dgj9B+r7iu1wAAAAASUVORK5CYII=';
                obj2.symbolPosition = 'start';
                obj2.symbolSize = [85,80];
                obj2.symbolOffset= [0, 92];
                bgData.push(obj2);

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
                  obj.symbolSize = [66,58];
                  obj.symbolOffset= [0, 73];
                  picData.push(obj);

                  var obj2 = {};
                  obj2.value= chartBotData[i].score;
                  obj2.symbol = 'image://data:image/png;base64,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';
                  obj2.symbolPosition = 'start';
                  obj2.symbolSize = [85,80];
                  obj2.symbolOffset= [0, 92];
                  bgData.push(obj2);
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
                  obj.symbolSize = [66,58];
                  obj.symbolOffset= [0, 73];
                  obj.symbolBorderRadius= "50%";
                  picData.push(obj);

                  var obj2 = {};
                  obj2.value= chartBotData[i].number;
                  obj2.symbol = 'image://data:image/png;base64,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';
                  obj2.symbolPosition = 'start';
                  obj2.symbolSize = [85,80];
                  obj2.symbolOffset= [0, 92];
                  bgData.push(obj2);

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
                  const c0 = [shape.x+9, shape.y];
                  const c1 = [shape.x - 9, shape.y];
                  const c2 = [xAxisPoint[0] -9, xAxisPoint[1]];
                  const c3 = [xAxisPoint[0]+9, xAxisPoint[1]];
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
                  const c1 = [shape.x+9, shape.y];
                  const c2 = [xAxisPoint[0]+9 , xAxisPoint[1]];
                  const c3 = [xAxisPoint[0] + 21, xAxisPoint[1]];
                  const c4 = [shape.x + 21, shape.y - 6];
                  ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
              },
          });
          const CubeTop = echarts.graphic.extendShape({
              shape: {
                  x: 0,
                  y: 0,
              },
              buildPath: function (ctx, shape) {
                  const c1 = [shape.x+9, shape.y];
                  const c2 = [shape.x -10, shape.y];
                  const c3 = [shape.x, shape.y - 6];
                  const c4 = [shape.x+21, shape.y - 6];
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
                      margin: 88,
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
              series: [
                    {
                        z: 3,
                        type: "pictorialBar",
                        data: bgData,
                    },
                    {
                        z: 4,
                        type: "pictorialBar",
                        data: picData,
                        
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
                    // { //shadow
                    //     name: "",
                    //     type: "pictorialBar",
                    //     symbolSize: [17, 4],
                    //     symbolOffset: [3, -5],
                    //     z: 1,
                    //     itemStyle: {
                    //       color: "#1c2042",
                    //       shadowBlur: 9,
                    //       shadowColor: 'rgba(85, 149, 253, 1)',
                    //       shadowOffsetY: 8,
                    //       shadowOffsetX: 0,
                    //       opacity: 1
                    //     },
                    //     data: shadowData,
                    //     tooltip:{
                    //         show: false
                    //     }
                    // },
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