<template>
    <div class="flex-wrap" :class="currentCluesData.mapdirection?'mapdirection':''">   
        <div class="flex-content" v-for="(item,index) in currentCluesData.mapArr" :key='index'>
            <div class="DayMapRowFl">
                <div :id="`regionMapChart${index}`" class="chart-canvas"></div>
            </div>
            <div class="DayMapRowFr">
                <div :id="`topTen${index}`" class="chart-canvas"></div>
            </div>
        </div>
    </div>
</template>
<script>
import {G2,Bar} from '@antv/g2plot';
import DataSet from '@antv/data-set';
export default {
  props: ["currentCluesDatanochart"],
  data() {
    return {
      regionMapChart: null,
      pieSourcePlot: null,
      numList:'',
      sumColor:[],
      currentCluesData:this.currentCluesDatanochart,
      id: Math.random()
        .toString(36)
        .substr(2)
    };
  },
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    this.drawCnCluesRegionChart();
    this.drawTopTen();
  },
  watch: {
    currentCluesData: function(val) {
      this.regionMapChart.changeData(val.cluesRegionData);
      this.pieSourcePlot.changeData(val.cluesRegionData);
    }
  },
  // 方法集合
  methods: {
    // 中文地区询盘地图
    drawCnCluesRegionChart(){      
      var $this = this;
      $this.currentCluesData.mapArr.forEach(function(item,index){
          if(item.cluesRegionData&&item.cluesRegionData.length>0){                   
                var maxNum='';
                var minAverage='';
                $this.numList='';
                $this.sumColor=[];
                item.cluesRegionData.forEach(function(items,index){
                    if(maxNum<items.number){
                        maxNum=items.number;
                    }
                });      
                if(maxNum>0){
                    if(maxNum>=4){
                    var average=parseInt(maxNum/4);
                    var averageStr=average.toString();
                    console.log(average)
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
                var resArr=item.cluesRegionData; 
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
                if(item.cluesRegionData.length>0){   
                    fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/china-provinces.geo.json')
                    .then(res => res.json())
                    .then(GeoJSON => {
                    const regionMapChart = new G2.Chart({
                        container: `regionMapChart${index}`,
                        width:300,
                        height:218,
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
                    item.cluesRegionData.forEach(function(items,index){
                        var itemData = {};
                        itemData.name = items.name;
                        itemData.number = items.number;
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
                        alias: '数量'
                        },
                        name:{
                        alias:"地区"
                        }
                    });
                    console.log($this.sumColor)
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
          }
      }); 
    },
    // 热门地区TOP10
    drawTopTen(){
      var $this = this;
        $this.currentCluesData.mapArr.forEach(function(item,index){
            if(item.topTenRegionData&&item.topTenRegionData.length>0){
                var numList=$this.numList;  
                var defaulColor=$this.sumColor;          
                var rel=item.topTenRegionData;
                var topTenColor=[];          
                item.topTenRegionData.forEach(function(items,index){
                    if(defaulColor.length>=5){
                        for(var i=0;i<numList.length;i++){
                        if(items.number>=numList[i]){
                            topTenColor.push(defaulColor[i]);
                            break;
                        }
                        if(items.number<numList[numList.length-1]){
                            topTenColor.push(defaulColor[numList.length-1]);
                            break;
                        }
                        }
                    }else{              
                        for(var i=0;i<numList.length;i++){
                        if(items.number>numList[i]){
                            topTenColor.push(defaulColor[i]);
                            break;
                        }
                        if(items.number<=numList[numList.length-1]){
                            topTenColor.push(defaulColor[numList.length-1]);
                            break;
                        }
                        }
                    }
                });
                topTenColor=topTenColor.reverse();
                const pieSourcePlot = new Bar(`topTen${index}`, {
                    data:item.topTenRegionData,
                    xField: 'number',
                    yField: 'name',
                    seriesField: 'name',
                    barWidthRatio: 0.4,
                    height:340,
                    legend: false,
                    appendPadding:[0, 50, 0, 30],
                    xAxis:false,
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
                        alias: '数量',
                        },
                    },
                });
                $this.pieSourcePlot = pieSourcePlot;
                pieSourcePlot.render();
            }
        });
    }
  }
};
</script>

<style  scoped>
#c1 {
  margin: 20px auto;
  width: 100%;
  position: relative;
}
</style>