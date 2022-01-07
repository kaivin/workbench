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
        let lightData = [];
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
                obj.symbolSize = [58,58];
                obj.symbolOffset= [0, 72];
                obj.symbolBorderRadius= "50%";
                picData.push(obj);

                var obj2 = {};
                obj2.value= chartBotData[i].number;
                obj2.symbol = 'image://data:image/png;base64,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';
                obj2.symbolPosition = 'start';
                obj2.symbolSize = [60,60];
                obj2.symbolOffset= [0, 73];
                bgData.push(obj2);

                var obj3 = {};
                obj3.value= chartBotData[i].number;
                obj3.symbol = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTAxLTA3VDEzOjI5OjQ3KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wMS0wN1QxNDoxODoxMSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wMS0wN1QxNDoxODoxMSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTFiNDQ3MDUtYzMyMy0zODQ2LTk3NDctMGJjZmViNDhiMmY4IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MmI2NWI1YjQtN2Q3ZC1hYzQxLTg1ZjgtNjE5MWJkOTA2OWFhIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NWM2OTg3ZmYtZWNjZC1mMzQ5LTg0MzUtYWE3MmU2MzIzYzEyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1YzY5ODdmZi1lY2NkLWYzNDktODQzNS1hYTcyZTYzMjNjMTIiIHN0RXZ0OndoZW49IjIwMjItMDEtMDdUMTM6Mjk6NDcrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MTFiNDQ3MDUtYzMyMy0zODQ2LTk3NDctMGJjZmViNDhiMmY4IiBzdEV2dDp3aGVuPSIyMDIyLTAxLTA3VDE0OjE4OjExKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+PXQ3fAAAAhNJREFUaIHt20trU0EYgOFnTmLTm2gVrXYhitJFcenClbhTEPwj/jrBlUtFF24UEVdFcCGK2KK2VmvbjIvJMbE02ggmZjIvDBnOdV6+by4HMiHGaJKoRt2AYVOEc6cI504Rzp0inDtFOHeKcO4U4dwpwrlThHOnCOdOEc6dIpw7RTh3inDuFOHcKcK5U4RzZ5KEA5MljMkRDnVlEoQbJki40pWN9YGcCZ3y8993OQsHHNGTzuQrHDAtCUeZRzhgBkc79b3ek81RtOgf09CV3dETXfKM8AKOS6I7+0/mFOEmTuM8NrCFtkwjXOEEltHCmiTdPujCcaWeYyucwQpOYRMf+900rikdMIU5XMBVnMRTrOJrvxvHUbghtXsJ13BRSt3neCxFt+++hnESrtBqc247xtutEG5U7OIFHuGZ1G9/u4ljHIQDmpGlzRhvfmrHWy1hpdWwLonexRNsH+Zh/7twPfpe34rxzvpeXJyuQrVQhdWKe3iA1w6Yb/sRRryN55dPN6l/zkgD0rw0+i7isjS/LkU+hyT7EG/tWzr+8YUjEA5SZjWlBf6UNHcuS4KtzrFZnJUiXEkLiZe4j1dS/x385UMUrkfXOnpzOIZLuCLJf9FdIe1Kc+oG3mAd7/DeX8oyfOGGFMH5TpmVpKckoapzzVanfMA3KSu+O2DlNCjDTunQ81t/p9b1WrYhDUID9c3D8gPwqXF3bV1m5AAAAABJRU5ErkJggg==';
                obj3.symbolPosition = 'start';
                obj3.symbolSize = [60,60];
                obj3.symbolOffset= [0, 73];
                lightData.push(obj3);
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
                  obj.symbolSize = [58,58];
                  obj.symbolOffset= [0, 72];
                  picData.push(obj);

                  var obj2 = {};
                  obj2.value= chartBotData[i].score;
                  obj2.symbol = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAIRUlEQVRogd2be1BU1x3Hv+fu7t3luctzAUF5iJIaNRECooYo0kRNk4ka0iY1FKMZH7FER3CcTpoak5lOk3R0YkfbuEyKMz6qgzRSgxYrBJS3jQZfIyIm4a3g8hDYxz2//lFxEOSxsJdVP3+ex93Pd889d3fOPYdNj3wbcrClxKAFEEuEKAKmAQgBYQIBOgCuIACETgKMRKgnYjfA6BIIFQCKd8atbhvJ53xfsc8mL6WtQYZiS6khkAi/BLDMarbGNFyqUdRdrMadH5vQ+kMj2ptaYOrogrmrBwAgOmtc1a7Orm5+XoEeQX7RHkF6+E0Lg/6pECkl31AKYkeJcGRX/Kof7eXI7DHCW0oMcQSkmbtNi6vyzimu5Jaj9vw1WLpNo7qeSqNGwIxwhMVFYnJclKRydsoh4PPdCau/7d/W1hEeU+AtJYb5BGxvqal/vuJgLq7klo065GAo1SKmxM/GjOU/h0dQQCGAD/e8tCq/t35cAqeVGPxB+Ky9qfXXBbszcfVUGYiTzdexBcYYwuKeQ8yqRLj4eO4HIe3LJasaZA+cWmJI5Gbr3opDp7TFX2XbfUSHQ6lRY9abr+Dp115sYwrFu+/7qY7Y0n/EgVOLDSKAP7fV3d5w7IO/ounqzVHo2g/v8GAs2LIObnqfvxBH6qZA5Yi+eYU+YOawjVKLDG4Asq+fufCrzE070VZ/a6y+Y6ar1Yjrp4ugDQqIdg/QxxW30bFYrdA9XL9hA28uMvgAyP3+64K5OdvTYTWZ7eU8ZiSLBTfPlkOj003yCA1eVGTkmXN1QtdQfYYMvPmsQQsgt3z/ici8nQcBkvfBNCqIUFtxAQqVys9nanjCmTv80DwPYdDbe9DAm88aRCKWfSErf07+F4dk87UXjZWXoXZ39/cIDYkubJEOPe+lkB7WThjsAsSxo/rM+fjTOw7IZ2lnKr7aj9ry8/HE2Y7B2jw08KbC9ERjfcv6E5+kgziXz9DOEOco2bMXHU231398xfrGw9oMCLyx0DBBsli/PP6HPTB1Djn/H0ksXd0o3rUbVjP/27aL1sD+9QMCE2e7zv0jV+fo39mxcKfmJq7lnNARxxf96x4InPJt+oL2xpalZRnZ42cnE1ezs3H3VuvSD76TFvYtf3CEObYX7T0KS8/4/l2UA8lkwuWsTBDHtr7l9wP/9nR6nLG2eV5VXtm4y8lFXVkpOpqa520tk+J6y+4H5hxpFQdzwKXH56k8HMQ5qk9+AyKk9ZYJAPDeqXRfc5dpUdXpUsfZyUR9eQksXaZFqWclX+BeYE54q7rwnPJJmLv9kcwmNJ6vUBLHW8C9wMSxvCr/yZm7/Wn4bxk4seUAIKw9ka61mq2xDZXXHO0lG8bqq7BarLEpeVwrcM7mNF+5obA+gbdzL5LZjLaaGwrOaY7AiWY1XK52tJPstP1QBeIsSgDH9NaanxztIzud9T+Bc5omSISQ9kbHL9nITU/rLRBnIQI4ArpaR/RW47HG3NEGzjFB4JzpzJ13He0jO5K5B8ThLnAOV0t3j6N9ZEcy9UAiuAn8UVyYkwnizCyAs06Vk8bRLrKjEDUgTp0C5zCqXFwc7SM7gqgB5+gQOEe9k07naB/ZUbloQZw1CZyjxsXHx9E+sqPS+YITagTiuOgeNGBx74lD7R0I4rgkcGLnPEMnO9pHdpz9w0EcFQJxKtIFh0oKUXS0k2wIShEa3zBJIhQLWe+80waFsthrSoSjvWTDKTACJCiLD69gxv8v8UjIDIiKdrSXbLiHzwYRMoHeJR5iB/QzI60KUe1YMxkQVGq4hEZaOccB4F7g4+tWNgui5qR/1GzH2smAW3gsmNLpZGYyawb6rEtLEj4NXrgETBj0DepjBxMU0D27BJzTp71l99P9O2VlgcZTf0b/zJMzl13CoqFw05/JWsUKesseGE7OaVvoktehUD3+P1FMpYZnTCKI8FHf8gcCn9688j+i1itrYsKr42snA7pZr0Lh4p319bvsVN/yAROWSywlcN5io2tg8LjJ2RvROxju0xcbiVNK/7oBgQu2JteCCWumvrkeCo3T+BjaEUF0gm/CBgDKNcfWsNoB9Q/rVPi7lYdFre+e8OVrHq+nNhPgvWAtBFffPdlrcfhhTQZPw7FRN+WZ/EmLV8jmZ28857wNdeCzBSBsHKzNoIGLP0w2c47XfSPjKwPjE+UxtCO6qES4RMRXgmjZv9Zh0O2CQ96vZR8lt3COBH3sy+cnLkkGY4/g7c0EeM5dCdcZr1QSZwnH17OWoZoPm6Dik+RmTnjBa+aCvJDlKVCone0nO0YE0RneC1PgPGVBIRHmf/MemofrM6LdtI2F/zTp5y49JHr6eegioqPv1l2HtdNoF+nRInqHwPulrRC9J+8mYEXOBnSOpJ/NG8SfTs1IJMm693b5Ce2t0mPglvF9zcqUItxnvgbXaYvaIShX52yATRvEbZ6UFz//zRGC8imv535xICzpj3CfEgMwZutlbIcxOIXEQL/0T3Cd/vJBYsqIur8n2RQWGOMhj4j3M+aD8LGptW5e63cn0XGtFNxi39c2TCHCOTQWLj97ESqPoLNE+H19RlJeb/24nmrpJXxDxgsgpEmWnsWd1eVCZ1UZuuuvgqyj20zOlCLU+qlwmhQFTXAMZyrnHACf1WckOfYYT3/C1u2bSMAbIFpG3BptaqxWdDddh9XYCHNbA6S7beDmu6B7dwFTaSCIzlA466B094dS6w/RdzJU3mESBGUZIxwl4HB9RtKgB7UcGrgvIWv2aYkolghRIDYdQAgB3kTQAeQKYgCok4gZAbpNQA04qyRQBQMrrstIkuUo3v8AQntiX52hKEAAAAAASUVORK5CYII=';
                  obj2.symbolPosition = 'start';
                  obj2.symbolSize = [60,60];
                  obj2.symbolOffset= [0, 73];
                  bgData.push(obj2);

                  var obj3 = {};
                  obj3.value= chartBotData[i].score;
                  obj3.symbol = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTAxLTA3VDEzOjI5OjQ3KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wMS0wN1QxNDoxODoxMSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wMS0wN1QxNDoxODoxMSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTFiNDQ3MDUtYzMyMy0zODQ2LTk3NDctMGJjZmViNDhiMmY4IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MmI2NWI1YjQtN2Q3ZC1hYzQxLTg1ZjgtNjE5MWJkOTA2OWFhIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NWM2OTg3ZmYtZWNjZC1mMzQ5LTg0MzUtYWE3MmU2MzIzYzEyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1YzY5ODdmZi1lY2NkLWYzNDktODQzNS1hYTcyZTYzMjNjMTIiIHN0RXZ0OndoZW49IjIwMjItMDEtMDdUMTM6Mjk6NDcrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MTFiNDQ3MDUtYzMyMy0zODQ2LTk3NDctMGJjZmViNDhiMmY4IiBzdEV2dDp3aGVuPSIyMDIyLTAxLTA3VDE0OjE4OjExKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+PXQ3fAAAAhNJREFUaIHt20trU0EYgOFnTmLTm2gVrXYhitJFcenClbhTEPwj/jrBlUtFF24UEVdFcCGK2KK2VmvbjIvJMbE02ggmZjIvDBnOdV6+by4HMiHGaJKoRt2AYVOEc6cI504Rzp0inDtFOHeKcO4U4dwpwrlThHOnCOdOEc6dIpw7RTh3inDuFOHcKcK5U4RzZ5KEA5MljMkRDnVlEoQbJki40pWN9YGcCZ3y8993OQsHHNGTzuQrHDAtCUeZRzhgBkc79b3ek81RtOgf09CV3dETXfKM8AKOS6I7+0/mFOEmTuM8NrCFtkwjXOEEltHCmiTdPujCcaWeYyucwQpOYRMf+900rikdMIU5XMBVnMRTrOJrvxvHUbghtXsJ13BRSt3neCxFt+++hnESrtBqc247xtutEG5U7OIFHuGZ1G9/u4ljHIQDmpGlzRhvfmrHWy1hpdWwLonexRNsH+Zh/7twPfpe34rxzvpeXJyuQrVQhdWKe3iA1w6Yb/sRRryN55dPN6l/zkgD0rw0+i7isjS/LkU+hyT7EG/tWzr+8YUjEA5SZjWlBf6UNHcuS4KtzrFZnJUiXEkLiZe4j1dS/x385UMUrkfXOnpzOIZLuCLJf9FdIe1Kc+oG3mAd7/DeX8oyfOGGFMH5TpmVpKckoapzzVanfMA3KSu+O2DlNCjDTunQ81t/p9b1WrYhDUID9c3D8gPwqXF3bV1m5AAAAABJRU5ErkJggg==';
                  obj3.symbolPosition = 'start';
                  obj3.symbolSize = [60,60];
                  obj3.symbolOffset= [0, 73];
                  lightData.push(obj3);
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
                  obj.symbolSize = [58,58];
                  obj.symbolOffset= [0, 72];
                  obj.symbolBorderRadius= "50%";
                  picData.push(obj);

                  var obj2 = {};
                  obj2.value= chartBotData[i].number;
                  obj2.symbol = 'image://data:image/png;base64,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';
                  obj2.symbolPosition = 'start';
                  obj2.symbolSize = [60,60];
                  obj2.symbolOffset= [0, 73];
                  bgData.push(obj2);

                  var obj3 = {};
                  obj3.value= chartBotData[i].number;
                  obj3.symbol = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTAxLTA3VDEzOjI5OjQ3KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wMS0wN1QxNDoxODoxMSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wMS0wN1QxNDoxODoxMSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTFiNDQ3MDUtYzMyMy0zODQ2LTk3NDctMGJjZmViNDhiMmY4IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MmI2NWI1YjQtN2Q3ZC1hYzQxLTg1ZjgtNjE5MWJkOTA2OWFhIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NWM2OTg3ZmYtZWNjZC1mMzQ5LTg0MzUtYWE3MmU2MzIzYzEyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1YzY5ODdmZi1lY2NkLWYzNDktODQzNS1hYTcyZTYzMjNjMTIiIHN0RXZ0OndoZW49IjIwMjItMDEtMDdUMTM6Mjk6NDcrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MTFiNDQ3MDUtYzMyMy0zODQ2LTk3NDctMGJjZmViNDhiMmY4IiBzdEV2dDp3aGVuPSIyMDIyLTAxLTA3VDE0OjE4OjExKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+PXQ3fAAAAhNJREFUaIHt20trU0EYgOFnTmLTm2gVrXYhitJFcenClbhTEPwj/jrBlUtFF24UEVdFcCGK2KK2VmvbjIvJMbE02ggmZjIvDBnOdV6+by4HMiHGaJKoRt2AYVOEc6cI504Rzp0inDtFOHeKcO4U4dwpwrlThHOnCOdOEc6dIpw7RTh3inDuFOHcKcK5U4RzZ5KEA5MljMkRDnVlEoQbJki40pWN9YGcCZ3y8993OQsHHNGTzuQrHDAtCUeZRzhgBkc79b3ek81RtOgf09CV3dETXfKM8AKOS6I7+0/mFOEmTuM8NrCFtkwjXOEEltHCmiTdPujCcaWeYyucwQpOYRMf+900rikdMIU5XMBVnMRTrOJrvxvHUbghtXsJ13BRSt3neCxFt+++hnESrtBqc247xtutEG5U7OIFHuGZ1G9/u4ljHIQDmpGlzRhvfmrHWy1hpdWwLonexRNsH+Zh/7twPfpe34rxzvpeXJyuQrVQhdWKe3iA1w6Yb/sRRryN55dPN6l/zkgD0rw0+i7isjS/LkU+hyT7EG/tWzr+8YUjEA5SZjWlBf6UNHcuS4KtzrFZnJUiXEkLiZe4j1dS/x385UMUrkfXOnpzOIZLuCLJf9FdIe1Kc+oG3mAd7/DeX8oyfOGGFMH5TpmVpKckoapzzVanfMA3KSu+O2DlNCjDTunQ81t/p9b1WrYhDUID9c3D8gPwqXF3bV1m5AAAAABJRU5ErkJggg==';
                  obj3.symbolPosition = 'start';
                  obj3.symbolSize = [60,60];
                  obj3.symbolOffset= [0, 73];
                  lightData.push(obj3);
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
                  top: '16',
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
                      margin: 86,
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
                        itemStyle: {
                          shadowBlur: 8,
                          shadowColor: 'rgba(54, 95, 214, 0.45)',
                          shadowOffsetY: 6,
                          shadowOffsetX: 0,
                          opacity: 1
                        },
                    },
                    {
                        z: 4,
                        type: "pictorialBar",
                        data: picData,
                        
                    },
                    {
                        z: 5,
                        type: "pictorialBar",
                        data: lightData,
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