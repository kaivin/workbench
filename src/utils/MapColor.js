﻿export function MapInterval(maxNum){    
    var minAverage = 0;  
    var defaultColor = []   
    var pieces = [];
    var numList = [];
    if(maxNum>=4){
        var average=parseInt(maxNum/4);
        var averageStr=average.toString();
        var numRes = [];
        if(average > 0){
            for(var i=0;i<averageStr.length;i++){
                numRes.push(parseInt(averageStr[i]));
            }
        }
        if(averageStr.length>=2){
            minAverage=numRes[0]*Math.pow(10,(averageStr.length-1))
        }else{
            minAverage=numRes[0]
        }
        defaultColor = ['#fe3a33','#ffa037','#1760ff','#a4b8de','#e3e3e9'];
        numList = [minAverage*4,minAverage*3,minAverage*2,minAverage*1]; 
        pieces = [
            {lt:minAverage,label:'0-'+minAverage,color:'#e3e3e9',symbol:'rect'},
            {gte:minAverage,lt:minAverage*2,label:minAverage+'-'+minAverage*2,color:'#a4b8de',symbol:'rect'},
            {gte:minAverage*2,lt:minAverage*3,label:minAverage*2+'-'+minAverage*3,color:'#1760ff',symbol:'rect'},
            {gte:minAverage*3,lt:minAverage*4,label:minAverage*3+'-'+minAverage*4,color:'#ffa037',symbol:'rect'},
            {gte:minAverage*4,label:'大于'+minAverage*4,color:'#fe3a33',symbol:'rect'},
        ]
    }else{
        minAverage=4;
        defaultColor=['#e3e3e9'];
        numList=[minAverage*1];    
        pieces = [
            {lt:minAverage,label:'0-'+minAverage,color:'#e3e3e9',symbol:'rect'},
        ]      
    }
    var valDateObj={}
    valDateObj.minAverage=minAverage;         // 平均值
    valDateObj.numList=numList;               // 色块区间
    valDateObj.pieces=pieces;               // 区间值
    valDateObj.defaultColor=defaultColor;       // 区间值
    return valDateObj;    
};

export function MapDarkInterval(maxNum){    
    var minAverage = 0;  
    var defaultColor = []   
    var pieces = [];
    var numList = [];
    if(maxNum>=4){
        var average=parseInt(maxNum/4);
        var averageStr=average.toString();
        var numRes = [];
        if(average > 0){
            for(var i=0;i<averageStr.length;i++){
                numRes.push(parseInt(averageStr[i]));
            }
        }
        if(averageStr.length>=2){
            minAverage=numRes[0]*Math.pow(10,(averageStr.length-1))
        }else{
            minAverage=numRes[0]
        }
        defaultColor = ['#fe3a33','#ff8543','#1760ff','#19e7ff','#2f4075'];
        numList = [minAverage*4,minAverage*3,minAverage*2,minAverage*1]; 
        pieces = [
            {lt:minAverage,label:'0-'+minAverage,color:'#2f4075',symbol:'rect'},
            {gte:minAverage,lt:minAverage*2,label:minAverage+'-'+minAverage*2,color:'#19e7ff',symbol:'rect'},
            {gte:minAverage*2,lt:minAverage*3,label:minAverage*2+'-'+minAverage*3,color:'#1760ff',symbol:'rect'},
            {gte:minAverage*3,lt:minAverage*4,label:minAverage*3+'-'+minAverage*4,color:'#ff8543',symbol:'rect'},
            {gte:minAverage*4,label:'大于'+minAverage*4,color:'#fe3a33',symbol:'rect'},
        ]
    }else{
        minAverage=4;
        defaultColor=['#2f4075'];
        numList=[minAverage*1];    
        pieces = [
            {lt:minAverage,label:'0-'+minAverage,color:'#2f4075',symbol:'rect'},
        ]      
    }
    var valDateObj={}
    valDateObj.minAverage=minAverage;         // 平均值
    valDateObj.numList=numList;               // 色块区间
    valDateObj.pieces=pieces;               // 区间值
    valDateObj.defaultColor=defaultColor;       // 区间值
    return valDateObj;    
};

export function MapColor(resArr,obj){
    //筛选颜色
    var sumColor=[];
    for(var j=0;j<obj.numList.length;j++){
        for(var i=0;i<resArr.length;i++){
            if(obj.numList[j+1]&&obj.numList[j]){
                if(resArr[i].number>obj.numList[0]&&j==0){
                    if(sumColor.indexOf(obj.defaulColor[j])==-1){
                    sumColor.push(obj.defaulColor[j]);
                    }
                }
                if(resArr[i].number>obj.numList[j+1]&&resArr[i].number<=obj.numList[j]){
                    if(sumColor.indexOf(obj.defaulColor[j+1])==-1){
                        sumColor.push(obj.defaulColor[j+1]);
                    }
                }
            }
            if(resArr[i].number<=obj.numList[obj.numList.length-1]&&j==(obj.numList.length-1)){
                if(sumColor.indexOf(obj.defaulColor[obj.defaulColor.length-1])==-1){
                    sumColor.push(obj.defaulColor[obj.defaulColor.length-1]);
                }
            }
        }
    }
    return sumColor;
}

export function TopTenColor(resArr,obj){ 
    var topTenColor=[];
    resArr.forEach(function(item,index){
        for(var i=0;i<obj.numList.length;i++){
            if(item.value>=obj.numList[i]){
                topTenColor.push(obj.defaultColor[i]);
                break;
            }
            if(item.value<obj.numList[obj.numList.length-1]){
                if(obj.defaultColor.length==1){
                    topTenColor.push(obj.defaultColor[0]);
                }else{
                    topTenColor.push(obj.defaultColor[obj.numList.length]);
                }
                break;
            }
        }
    });
    topTenColor.reverse();
    return topTenColor;
}
export function currentColor(value,obj){ 
    var currentColor="";
    for(var i=0;i<obj.numList.length;i++){
        if(value>=obj.numList[i]){
            currentColor = obj.defaultColor[i];
            break;
        }
        if(value<obj.numList[obj.numList.length-1]){
            if(obj.defaultColor.length==1){
                currentColor = obj.defaultColor[0];
            }else{
                currentColor = obj.defaultColor[obj.numList.length];
            }
            break;
        }
    }
    return currentColor;
}