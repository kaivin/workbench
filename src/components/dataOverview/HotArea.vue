<template>
  <div class="hxpage">
    <div class="module-top">
      <div class="title-view">
        <div class="title">{{language=="中文"?'中文年度热门地区TOP5':'英文年度热门国家TOP5'}}</div>
        <div class="unit">{{type == 1?'（单位：分）':'（单位：个）'}}</div>
        <div class="more" @click="goPage">更多分析 ></div>
        <div class="btn-group">
          <div @click="changeType(0)" class="btn-item" :class="type == 0?'active':''">询盘</div>
          <div @click="changeType(1)" class="btn-item" :class="type == 1?'active':''">成交积分</div>
          <div v-if="language=='英文'" @click="changeType(2)" class="btn-item" :class="type == 2?'active':''">成交个数</div>
        </div>
      </div>
      <div class="rowTwoOneItem">
        <div class="map-chart">
          <div
            v-if="language == '中文'"
            id="regionMapChart"
            class="chart-canvas"
          ></div>
          <div v-else id="worldRegionMapChart" class="chart-canvas"></div>
        </div>
        <div class="top-ten">
          <div id="topTen" class="chart-canva"></div>
        </div>
      </div>

    </div>
  </div>
  
</template>

<script>
import { Bar,P,G2,} from '@antv/g2plot';
import { worldCountry } from "@/utils/worldCountry";
import DataSet from '@antv/data-set';
export default {
    name:'demo',
    data(){
      return {
        mapDateData:'',
        numList:[],
        sumColor:[],
        type:0,//0 询盘  1 成交积分  2 成交个数
        worldRegionMapChart:null,//世界地图
        regionMapChart:null,//中国地图
        pieSourcePlot:null,//热门地区TOP10
      }
    },
    props:{
      language:{
        type:String,
        default:"中文"
      },
      provincecountmap:{//询盘地图
          type:Array,
          default:function(){
            return []
          } 
      }, 
      provincescoretmap:{//成交积分地图
        type:Array,
        default:function(){
          return []
        } 
      },
      provincescorenumbertmap:{//成交个数地图
        type:Array,
        default:function(){
          return []
        } 
      },

    },
    watch:{
      provincecountmap:{
        handler(newval,oldval){
          if(this.language == '中文'){
            this.drawCnCluesRegionChart(newval);
          }else{
            this.drawEnCluesRegionChart(newval);
          }
          
          this.drawTopTen();
        },
        deep:true
      },
      type:function(newval,oldval){
        if(this.language == '中文'){
            this.drawCnCluesRegionChart(newval);
          }else{
            this.drawEnCluesRegionChart(newval);
          }
        this.drawTopTen();
      }
    },
    mounted(){
     
    },
    methods:{
      goPage(){
       if(this.language == '中文'){
         this.$router.push('/Home/CH/sectorAnalysis?type=' + this.type)
       }else{
         this.$router.push('/Home/EN/sectorAnalysis?type=' + this.type)
       }
      },
      changeType(val){
        this.type = val;
      },
      // 中文地区询盘地图
      drawCnCluesRegionChart(newval){
        var $this = this;
        var maxNum='';
        var minAverage='';
        let mapCountData = [];
        if(this.type == 0){
          mapCountData = $this.provincecountmap;
        }else{
          mapCountData = $this.provincescoretmap;
         
          mapCountData.sort(function(a,b){
            return a.number-b.number
          }).reverse();
        }
        if($this.worldRegionMapChart&&!$this.worldRegionMapChart.destroyed){
        $this.worldRegionMapChart.destroy();
        }
        if($this.regionMapChart&&!$this.regionMapChart.destroyed){
          $this.regionMapChart.destroy();
        }
        $this.numList='';
        $this.sumColor=[];
        mapCountData.forEach(function(item,index){
            if(maxNum<item.number){
              maxNum=item.number;
            }
        });
        
        if(maxNum>0){
          if(maxNum>=4){
            var average=parseInt(maxNum/4);
            var averageStr=average.toString();
            
            var numRes = [];
            if(average > 0){
                for(var i=0;i<averageStr.length;i++){
                    numRes.push(averageStr[i]);
                }
            }
            if(averageStr.length>=2){
              minAverage=numRes[0]*Math.pow(10,(averageStr.length-1))
            }else{
              minAverage=numRes[0]
            }
            var averArr=['0-'+minAverage,minAverage+'-'+minAverage*2,minAverage*2+'-'+minAverage*3,minAverage*3+'-'+minAverage*4,'大于'+minAverage*4];
            var defaulColor=['#ae1222','#f27042','#f1de5f','#a2bfcd', '#b3b3b3'];
           
            var numList=[minAverage*4,minAverage*3,minAverage*2,minAverage*1]; 
          }else{
            minAverage = 1;
            var averArr=[];
            var numList=[]; 
            for(let i = 0;i<maxNum/minAverage;i++){
              averArr.push(minAverage*i + '-' + minAverage*(i+1))
            }
            for(let i = 0;i<maxNum/minAverage;i++){
              numList.push(minAverage*i)
            }
            numList.sort(function(a, b){return b - a});
            var defaulColor=[];
            var colAry=['#ae1222','#f27042','#f1de5f','#a2bfcd', '#b3b3b3'];
            for(let i = 0;i<maxNum/minAverage;i++){
              if(i == maxNum/minAverage - 1){
                defaulColor[i] = colAry[4]
              }else{
                defaulColor[i] = colAry[i]
              }
            }
            
          }
        
          
        }else{
          minAverage=10;
          var averArr=['0-'+minAverage];
          var defaulColor=['#b3b3b3'];
          var numList=[minAverage*1]; 
        }
        $this.numList=numList;
        //筛选颜色
        var resArr=mapCountData; 
        var sumColor=[];
        for(var j=0;j<numList.length;j++){
          for(var i=0;i<resArr.length;i++){
              if(numList[j+1]&&numList[j]){
                if(resArr[i].number>numList[0]&&j==0){
                  if(sumColor.indexOf(defaulColor[j])==-1){
                    sumColor.push(defaulColor[j]);
                  }
                }
                if(resArr[i].number>numList[j+1]&&resArr[i].number<=numList[j]){
                  if(sumColor.indexOf(defaulColor[j+1])==-1){
                    sumColor.push(defaulColor[j+1]);
                  }
                }
              }
              if(resArr[i].number<=numList[numList.length-1]&&j==(numList.length-1)){
                if(sumColor.indexOf(defaulColor[defaulColor.length-1])==-1){
                  sumColor.push(defaulColor[defaulColor.length-1]);
                }
              }
          }
        }
        $this.sumColor=sumColor;
        
        if(mapCountData.length>0){   
          fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/china-provinces.geo.json')
          .then(res => res.json())
          .then(GeoJSON => {
            const regionMapChart = new G2.Chart({
              container: 'regionMapChart',
              width:340,
              height:240,
              // 添加 element 选中和激活交互
              interactions: [{ type: 'element-single-selected' }, { type: 'element-active' }],
            });
            regionMapChart.scale({
              latitude: { sync: true },
              longitude: { sync: true }
            });
            regionMapChart.tooltip({
              showTitle: false,
              showMarkers: false,
              shared: true,
            });
            regionMapChart.axis(false);
            regionMapChart.legend('trend', {
              position: 'bottom-left',
            });
            // 绘制中国地图背景
            var ds = new DataSet();
            const geoDv = ds.createView('back').source(GeoJSON, {type: 'GeoJSON'});
            const geoView = regionMapChart.createView();
            geoView.data(geoDv.rows);
            geoView.tooltip(false);
            geoView.polygon()
              .position('longitude*latitude')
              .color('grey')
              .style({
                fill: '#fff',
                stroke: '#ccc',
                lineWidth: 1,
              });
            // 可视化用户数据
            const userData = [];
            mapCountData.forEach(function(item,index){
              var itemData = {};
              itemData.name = item.name;
              itemData.number = item.number;
              userData.push(itemData);
            });
            
            const userDv = ds.createView().source(userData).transform({
              geoDataView: geoDv,
              field: 'name',
              type: 'geo.region',
              as: ['longitude', 'latitude']
            }).transform({
              type: 'map',
              callback: obj => {
                
                  if(obj.number <=minAverage){
                      obj.trend=averArr[0];
                  }else if(obj.number <=minAverage*2 && obj.number>minAverage){
                      obj.trend=averArr[1];
                  }else if(obj.number <=minAverage*3 && obj.number>minAverage*2){
                      obj.trend=averArr[2];
                  }else if(obj.number <=minAverage*4 && obj.number>minAverage*3){
                      obj.trend=averArr[3];
                  }else{
                      obj.trend=averArr[4];
                  }
                  return obj;
              }
            });
            const userView = regionMapChart.createView();
            userView.data(userDv.rows);
            userView.scale({
              number: {
                alias: $this.type == 0?'数量':'积分'
              },
              name:{
                alias:"地区"
              }
            });
            
            userView.polygon()
              .position('longitude*latitude')     
              .color('trend', $this.sumColor)
              .tooltip('name*number')
              .style({
                fillOpacity: 1,
                stroke:"#fff"
              }).state({
                active: {
                  style: {
                    lineWidth: 0,
                    stroke:0,
                    fillOpacity:0.8,
                  },
                },
              }).animate({
                leave: {
                  animation: 'fade-out'
                }
              });
            userView.interaction('element-active');
            $this.regionMapChart = regionMapChart;
            regionMapChart.render();
          });
        }
      },
      // 热门地区TOP10
      drawTopTen(){
        var $this = this;
         let mapCountData = [];
        if(this.type == 0){
          mapCountData = $this.provincecountmap;
        }else if(this.type == 1){
          mapCountData = $this.provincescoretmap;
          
          mapCountData.sort(function(a,b){
            return a.number-b.number
          }).reverse();
        }else if(this.type == 2){
          mapCountData = $this.provincescorenumbertmap;
          mapCountData.sort(function(a,b){
            return a.number-b.number
          }).reverse();
        }
        
        if(mapCountData.length>0){
          if($this.pieSourcePlot&&!$this.pieSourcePlot.chart.destroyed){
            $this.pieSourcePlot.changeData(mapCountData);
          }else{ 
            var numList=$this.numList;  
            var defaulColor=$this.sumColor;          
            var rel=mapCountData;
            var topTenColor=[];
            
            mapCountData.forEach(function(item,index){
              if(defaulColor.length>=5){
                for(var i=0;i<numList.length;i++){
                  if(item.number>=numList[i]){
                    topTenColor.push(defaulColor[i]);
                    break;
                  }
                  if(item.number<numList[numList.length-1]){
                    topTenColor.push(defaulColor[numList.length-1]);
                    break;
                  }
                }
              }else{
                
                for(var i=0;i<numList.length;i++){
                  if(item.number>numList[i]){
                    topTenColor.push(defaulColor[i]);
                    break;
                  }
                  if(item.number<=numList[numList.length-1]){
                    topTenColor.push(defaulColor[numList.length-1]);
                    break;
                  }
                }
              }
            });
            topTenColor=topTenColor.reverse();
            const pieSourcePlot = new Bar('topTen', {
              data:mapCountData,
              xField: 'number',
              yField: $this.language =='中文'?'name':'country',
              seriesField: $this.language =='中文'?'name':'country',
              barWidthRatio: 0.4,
              height:240,
              legend: false,
              appendPadding:[0, 30, 0, 10],
              xAxis:{
                grid: {
                  line: {
                    style: {
                      stroke: "#cccccc",
                      lineWidth: 1,
                      lineDash: [3, 2],
                      strokeOpacity: 0.3,
                      shadowColor: null,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                    },
                  },
                },
                line:null,
              },
              //color:['#ae1222','#f27042','#f1de5f','#a2bfcd', '#b3b3b3'],
              color:topTenColor,
              label: {
                style: {
                  fill: '#999999',
                  opacity: 1,
                  fontSize: 12
                },
                position: 'right',
                offset:10,
              },
              meta: {
                name: {
                  alias: '地区',
                },
                number: {
                  alias: $this.type == 0?'数量':'积分'
                },
              },
            });
            $this.pieSourcePlot = pieSourcePlot;
            pieSourcePlot.render();
          }
        }
      },
      // 英文地区询盘地图
      drawEnCluesRegionChart(){
        var $this = this;
        var maxNum='';
        var minAverage='';
        let mapCountData = [];
        if(this.type == 0){
          mapCountData = worldCountry($this.provincecountmap);
        }else if(this.type == 1){
          mapCountData = worldCountry($this.provincescoretmap);
        }else{
          mapCountData = worldCountry($this.provincescorenumbertmap);
        }
        mapCountData.sort(function(a,b){return a.number-b.number}).reverse();
        if($this.worldRegionMapChart&&!$this.worldRegionMapChart.destroyed){
          $this.worldRegionMapChart.destroy();
        }
        if($this.regionMapChart&&!$this.regionMapChart.destroyed){
          $this.regionMapChart.destroy();
        }
        $this.numList='';
        $this.sumColor=[];
        mapCountData.forEach(function(item,index){
            if(maxNum<item.number){
              maxNum=item.number;
            }
        });
        if(maxNum>0){
          if(maxNum>=4){
          var average=parseInt(maxNum/4);
          var averageStr=average.toString();
          var numRes = [];
          if(average > 0){
              for(var i=0;i<averageStr.length;i++){
                  numRes.push(averageStr[i]);
              }
          }
          if(averageStr.length>=2){
            minAverage=numRes[0]*Math.pow(10,(averageStr.length-1))
          }else{
            minAverage=numRes[0]
          }
          var averArr=['0-'+minAverage,minAverage+'-'+minAverage*2,minAverage*2+'-'+minAverage*3,minAverage*3+'-'+minAverage*4,'大于'+minAverage*4];
          var defaulColor=['#ae1222','#f27042','#f1de5f','#a2bfcd', '#b3b3b3'];
          
          var numList=[minAverage*4,minAverage*3,minAverage*2,minAverage*1]; 
          }else{
            minAverage = 1;
            var averArr=[];
            var numList=[]; 
            for(let i = 0;i<maxNum/minAverage;i++){
              averArr.push(minAverage*i + '-' + minAverage*(i+1))
            }
            for(let i = 0;i<maxNum/minAverage;i++){
              numList.push(minAverage*i)
            }
            numList.sort(function(a, b){return b - a});
            var defaulColor=[];
            var colAry=['#ae1222','#f27042','#f1de5f','#a2bfcd', '#b3b3b3'];
            for(let i = 0;i<maxNum/minAverage;i++){
              if(i == maxNum/minAverage - 1){
                defaulColor[i] = colAry[4]
              }else{
                defaulColor[i] = colAry[i]
              }
            }
          }
        }else{
          minAverage=10;
          var averArr=['0-'+minAverage];
          var defaulColor=['#b3b3b3'];
          var numList=[minAverage*1]; 
        }
        $this.numList=numList;
       
        //筛选颜色
        var resArr=mapCountData;
        var sumColor=[];
        for(var j=0;j<numList.length;j++){
          for(var i=0;i<resArr.length;i++){
              if(numList[j+1]&&numList[j]){
                if(resArr[i].number>numList[0]&&j==0){
                  if(sumColor.indexOf(defaulColor[j])==-1){
                    sumColor.push(defaulColor[j]);
                  }
                }
                if(resArr[i].number>numList[j+1]&&resArr[i].number<=numList[j]){
                  if(sumColor.indexOf(defaulColor[j+1])==-1){
                    sumColor.push(defaulColor[j+1]);
                  }
                }
              }
              if(resArr[i].number<=numList[numList.length-1]&&j==(numList.length-1)){
                if(sumColor.indexOf(defaulColor[defaulColor.length-1])==-1){
                  sumColor.push(defaulColor[defaulColor.length-1]);
                }
              }
          }
        }
        
        $this.sumColor=sumColor;
       
        fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/world.geo.json')
        .then(res => res.json())
        .then(mapData => {
          const worldRegionMapChart = new G2.Chart({
            container: 'worldRegionMapChart',
            width: 400,
            height: 240,
          });
          worldRegionMapChart.tooltip({
            showTitle: false,
            showMarkers: false,
            shared: true,
          });
          // 同步度量
          worldRegionMapChart.scale({
            longitude: {
              sync: true
            },
            latitude: {
              sync: true
            }
          });
          worldRegionMapChart.axis(false);
          worldRegionMapChart.legend('trend', {
            position: 'bottom-left',
            itemHeight:20,
          });
          // 绘制世界地图背景
          var ds = new DataSet();
          const worldMap = ds.createView('back').source(mapData, {type: 'GeoJSON'});
          const worldMapView = worldRegionMapChart.createView();
          worldMapView.data(worldMap.rows);
          worldMapView.tooltip(false);
          worldMapView.polygon()
            .position('longitude*latitude')
            .color('grey')
            .style({
              fill: '#fff',
              stroke: '#ccc',
              lineWidth: 1,
            });
          // 可视化用户数据
          const userData = mapCountData;
          
          const userDv = ds.createView().source(userData).transform({
            // sizeByCount: true,
            geoDataView: worldMap,
            field: 'country',
            type: 'geo.region',
            as: ['longitude', 'latitude']
          }).transform({
            type: 'map',
            callback: obj => {
              if(obj.number <=minAverage){
                  obj.trend=averArr[0];
              }else if(obj.number <=minAverage*2 && obj.number>minAverage){
                  obj.trend=averArr[1];
              }else if(obj.number <=minAverage*3 && obj.number>minAverage*2){
                  obj.trend=averArr[2];
              }else if(obj.number <=minAverage*4 && obj.number>minAverage*3){
                  obj.trend=averArr[3];
              }else{
                  obj.trend=averArr[4];
              }
              return obj;
            }
          });
          const userView = worldRegionMapChart.createView();
          userView.data(userDv.rows);
          userView.scale({
            number: {
              alias: $this.type == 1?'积分':'数量'
            },
            name:{
              alias:"国家"
            },
            country:{
              alias:"英文名"
            }
          });
          userView.polygon()
            .position('longitude*latitude')         
            .color('trend', $this.sumColor)
            .tooltip('name*country*number')
            .style({
              fillOpacity: 1,
              stroke:"#fff"
            }).state({
                active: {
                  style: {
                    lineWidth: 0,
                    stroke:0,
                    fillOpacity:0.8,
                  },
                },
              }).animate({
              leave: {
                animation: 'fade-out'
              }
            });
          userView.interaction('element-active');
          $this.worldRegionMapChart = worldRegionMapChart;
          worldRegionMapChart.render();
        });
      },
    }
}
</script>

<style scoped lang="scss">
.hxpage{
  background: #fff;
  .module-top{
    padding: 15px 30px;
    border-bottom: 2px solid #f6f7fa;
  }
  .title-view{
    height: 24px;
    line-height: 24px;
    margin-bottom: 10px;
    .title{
      font-size: 14px;
      color: #1a1a1a;
      float: left;
      margin-right: 4px;
      font-weight: bold;
      span{
        font-size: 12px;
        color: #a1a1a1;
        font-weight: normal;
        margin-left: 10px;
      }
    }
    .unit{
      font-size: 12px;
      color: #a1a1a1;
      float: left;
    }
    .more{
      font-size: 12px;
      color: #a1a1a1;
      float: right;
      cursor: pointer;
    }
    .btn-group{
      float: right;
      margin-right: 20px;
      display: flex;
      .btn-item{
        padding: 0 10px;
        height: 24px;
        text-align: center;
        line-height: 22px;
        border: 1px solid #e1e3ea;
        color: #9ea5af;
        font-size: 12px;
        box-sizing: border-box;
        cursor: pointer;
      }
      .active{
        border: 1px solid #6198f5;
        background: #6198f5;
        color: #fff;
      }
    }
  }
  .contrast-view{
    height: 40px;
    margin-bottom: 15px;
    .redtext{
      float: left;
      font-size: 28px;
      color: #eb3737;
      font-weight: bold;
      margin-right: 15px;
      line-height: 40px;
    }
    .redright{
      float: left;
      .conname{
        font-size: 12px;
        line-height: 20px;
        color: #999999;
      }
      .num{
        font-size: 12px;
        line-height: 20px;
        padding-left: 12px;
        position: relative;
      }
      .up{
        color: #f25e5e;
        &:before{
          content: '↑';
          position: absolute;
          left: 0;
          font-size: 12px;
          line-height: 12px;
          top: 3px;
          
        }
      }
      .down{
        color: #2dbb4c;
        &:before{
          content: '↓';
          position: absolute;
          left: 0;
          font-size: 12px;
          line-height: 12px;
          top: 3px;
          
        }
      }
    }
  }
  .chart-top{
    height: 68px;
  }
  .module-bottom{
    padding: 20px 30px;
  }
  .map-chart{
    float: left;
    width: 40%;
    .chart-canvas{
      height: 240px;
    }
  }
  .top-ten{
    float: right;
    width: 50%;
    .chart-canva{
      height: 240px;
    }
  }
  
}
</style>