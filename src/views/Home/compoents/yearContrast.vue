<template>
  <div class="rowSix" >
               <div class="rowSixFl">
                    <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}年度成交积分对比</h3>
                    <div id="yearscoretongChart01" class="chart-canvas"></div>
               </div>
               <div class="rowSixFr">
                    <div class="itemRowTit">
                         <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}年度同期成交对比</h3>
                         <span>(单位：分)</span>
                    </div>
                    <div class="rowSixFrBox">
                         <ul class="rowSixFrTop">
                             <li v-for="(item,index) in currentCluesData.sametimeArr" :key="index" :style="'width:'+item.percen">
                                <p class="time">{{item.year}}</p>
                                <p class="contrast flex-box flex-wrap">
                                    <span class="percen"><i></i></span>
                                    <span class="number flex-content">{{item.value}}</span>
                                </p>
                             </li>
                         </ul>
                         <ul class="rowSixFrBom">
                             <li>                             
                                <i class="svg-i"><svg-icon icon-class="home_num" /></i>
                                <p><span>同比增长量</span><strong :class="currentCluesData.sametimeGrowth>0?'':'falling'">{{Math.abs(currentCluesData.sametimeGrowth)}}<i>{{currentCluesData.sametimeGrowth>0?'↑':'↓'}}</i></strong></p>
                             </li>
                             <li>                             
                                <i class="svg-i"><svg-icon icon-class="home_rate" /></i>
                                <p><span>同比增长率</span><strong :class="currentCluesData.sametimeGrowth>0?'':'falling'">{{currentCluesData.sametimeRate}}<i>{{currentCluesData.sametimeGrowth>0?'↑':'↓'}}</i></strong></p>
                             </li>
                         </ul>
                    </div>
               </div>
               <div class="rowSixlegend">
                  <span class="legendItem1">(单位：分)</span>
                  <span class="legendItem2">2021年</span>
                  <span class="legendItem3">2020年</span>
               </div>
          </div>
</template>

<script>
import { Line} from '@antv/g2plot';
export default {
    name:"demo",
    data(){
        return {

        }
    },
    props:{
        language:{
            type:String,
            default:""
        },
        currentCluesData:{
            type:Object,
            default:function(){
                return {}
            }
        }

    },
    created(){
        //this.yearscoretongChart()
    },
    methods:{
// 年度成交积分对比
    yearscoretongChart(){
      var $this = this;
     if($this.yearscoretongData&&!$this.yearscoretongData.chart.destroyed){
        $this.yearscoretongData.chart.destroy();
      }
      if($this.currentCluesData.yearscoretongArr.length>0){
        var yearArr = [];
        var maxYear = 0;
        var minYear = 0;
        $this.currentCluesData.yearscoretongArr.forEach(function(item,index){
          if(!yearArr.includes(parseInt(item.year))){
            yearArr.push(parseInt(item.year));
          }
        });
        if(yearArr.length==2){
          if(yearArr[0]>yearArr[1]){
            maxYear = yearArr[0];
            minYear = yearArr[1];
          }else if(yearArr[0]<yearArr[1]){
            maxYear = yearArr[1];
            minYear = yearArr[0];
          }else{
            maxYear = minYear = yearArr[0]
          }
        }
        
          $this.currentCluesData.yearscoretongArr.forEach((item,index)=>{
            item.value = parseFloat(item.value)
          })
          
          const yearscoretongData = new Line('yearscoretongChart01', {
            data:$this.currentCluesData.yearscoretongArr,
            xField: 'month',
            yField: 'value',
            seriesField: 'year',
           
            xAxis: {
              label: {
                offset:11,
                autoHide: true,
                autoRotate: false,
                style: {
                  fill: '#a1a1a1',
                  opacity: 1,
                  fontSize: 12,
                  lineHeight:18,
                },
              },
            },
            yAxis: {
              tickCount:4,
              grid: {
                line: {
                  style: {
                    stroke: '#cccccc',
                    lineWidth: 1,
                    lineDash: [3, 2],
                    strokeOpacity: 0.5,
                    shadowColor: null,
                    shadowBlur: 0,
                    shadowOffsetX:0,
                    shadowOffsetY:0,
                    cursor: 'pointer'
                  }
                }
              },
            },
            legend:false,
            // label
            label: {
              style: {
                textAlign: 'center',
                color:'#9e9e9e',
                fontsize:12,
              },
              formatter: (item) => {
                if(item.year==""+maxYear){
                  return item.value
                }
              },
            },
            point: {
              shape: (res) =>{
                if(res.year == ""+maxYear){
                  return 'circle';
                }
              },
              size: 3,
              style:(res)=> {
                var obj = {
                  opacity: 0.5,
                  stroke: '#78bccf',
                  fill: '#fff',
                }
                if(res.year == ""+maxYear){
                  obj.opacity = 0.5;
                }else{
                  obj.opacity = 0;
                  obj.lineWidth= 0;
                  obj.fill= '';
                }
                return obj;
              },
            },
            color: ({ year }) => {
              return year === ""+minYear ? '#fbd266' : '#78bccf';
            },
            lineStyle: ({ year }) => {
              if (year === ""+minYear) {
                return {
                  lineDash: [4, 4],
                  opacity: 1,
                };
              }
              return {
                opacity: 0.5,
              };
            },
          });
          $this.yearscoretongData = yearscoretongData;
          yearscoretongData.render();
          var hoverData = [];
          yearscoretongData.on('tooltip:change', ev => {
            hoverData=ev.data.items;
          })
          yearscoretongData.on('plot:click', ev => {
            var mouth=hoverData[0].data.month.replace('月','');
            var sametimeArr=[];
            var registerObj={
              year:hoverData[0].data.year,
              value:0,
            };        
            var lastregisterObj={
              year:hoverData[1].data.year,
              value:0,
            };
            var sametimeGrowth='';
            var sametimeRate='';
            $this.currentCluesData.yearscoretongArr.forEach(function(item,index){
                if(item.month.replace('月','')<mouth||item.month.replace('月','')==mouth){
                  //年度同期询盘对比
                  if(registerObj.year==item.year){
                      registerObj.value=registerObj.value+Number(item.value);
                  }else{
                    lastregisterObj.value=lastregisterObj.value+Number(item.value);
                  } 
                }
            });
            if ($this.isFloat(registerObj.value)) {
                registerObj.value=Number(registerObj.value.toFixed(2));
            } 
            if ($this.isFloat(lastregisterObj.value)) {
                lastregisterObj.value=Number(lastregisterObj.value.toFixed(2));
            }                          
            var MaxValue='';
            if(Number(registerObj.value)>=Number(lastregisterObj.value)){
              MaxValue=Number(registerObj.value);
            }else{
              MaxValue=Number(lastregisterObj.value);
            }
            if(MaxValue==0){
              lastregisterObj.percen='0%';
              registerObj.percen='0%';
            }else{
                lastregisterObj.percen=(Number(lastregisterObj.value)/MaxValue*100).toFixed(2)+'%';
                registerObj.percen=(Number(registerObj.value)/MaxValue*100).toFixed(2)+'%';
            }
            sametimeArr.push(registerObj,lastregisterObj);
            $this.currentCluesData.sametimeArr = sametimeArr;
            if(registerObj.year>lastregisterObj.year){
                sametimeGrowth=registerObj.value-lastregisterObj.value;
                if(lastregisterObj.value==0){
                  sametimeRate=registerObj.value.toFixed(2)+'%';
                }else{
                  sametimeRate=(Math.abs(registerObj.value-lastregisterObj.value)/lastregisterObj.value*100).toFixed(2)+'%';
                }
            }else{
                sametimeGrowth=lastregisterObj.value-registerObj.value;
                if(registerObj.value==0){
                  sametimeRate=(lastregisterObj.value).toFixed(2)+'%';
                }else{
                  sametimeRate=(Math.abs(lastregisterObj.value-registerObj.value)/registerObj.value*100).toFixed(2)+'%';
                }
            }
            if($this.isFloat(sametimeGrowth)){
              sametimeGrowth=Number(sametimeGrowth.toFixed(2));
            }
            $this.currentCluesData.sametimeGrowth=sametimeGrowth;
            $this.currentCluesData.sametimeRate=sametimeRate;
          });
        
      }
    },
    }
}
</script>

<style>

</style>