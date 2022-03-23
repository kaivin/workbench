export function MapInterval(maxNum){    
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

export function MapCountInterval(maxNum){    
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
        defaultColor = ["#0050b3","#0762c9","#0e75de",'#1587f4','#1890ff','#41a6ff','#69bcff','#92d1ff','#bae7ff'];
        numList = [500,300,100,60,50,40,30,20,10]; 
        pieces = [
            {lt:10,label:'0-10',color:'#bae7ff',symbol:'rect'},
            {gte:10,lt:20,label:'10-20',color:'#92d1ff',symbol:'rect'},
            {gte:20,lt:30,label:'20-30',color:'#69bcff',symbol:'rect'},
            {gte:30,lt:40,label:'30-40',color:'#41a6ff',symbol:'rect'},
            {gte:40,lt:50,label:'40-50',color:'#1890ff',symbol:'rect'},
            {gte:50,lt:60,label:'50-60',color:'#158fff',symbol:'rect'},
            {gte:60,lt:100,label:'60-100',color:'#1587f4',symbol:'rect'},
            {gte:100,lt:300,label:'100-300',color:'#0e75de',symbol:'rect'},
            {gte:300,lt:500,label:'300-500',color:'#0762c9',symbol:'rect'},
            {gte:500,label:'大于500',color:'#0050b3',symbol:'rect'},
        ]
    }else{
        minAverage=4;
        defaultColor=['#bae7ff'];
        numList=[minAverage*1];    
        pieces = [
            {lt:minAverage,label:'0-'+minAverage,color:'#bae7ff',symbol:'rect'},
        ]     
    }
    var valDateObj={}
    valDateObj.minAverage=minAverage;         // 平均值
    valDateObj.numList=numList;               // 色块区间
    valDateObj.pieces=pieces;               // 区间值
    valDateObj.defaultColor=defaultColor;       // 区间值
    return valDateObj;    
};

export function enMapCountInterval(maxNum){    
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
        defaultColor = ["#0762c9","#0e75de",'#1587f4','#1890ff','#41a6ff','#69bcff','#92d1ff','#bae7ff'];
        numList = [100,50,40,30,20,10,5]; 
        pieces = [
            {lt:5,label:'0-5',color:'#bae7ff',symbol:'rect'},
            {gte:5,lt:10,label:'5-10',color:'#92d1ff',symbol:'rect'},
            {gte:10,lt:20,label:'10-20',color:'#69bcff',symbol:'rect'},
            {gte:20,lt:30,label:'20-30',color:'#41a6ff',symbol:'rect'},
            {gte:30,lt:40,label:'30-40',color:'#1890ff',symbol:'rect'},
            {gte:40,lt:50,label:'40-50',color:'#158fff',symbol:'rect'},
            {gte:50,lt:100,label:'50-100',color:'#0e75de',symbol:'rect'},
            {gte:100,label:'大于100',color:'#0762c9',symbol:'rect'},
        ]
    }else{
        minAverage=4;
        defaultColor=['#92d1ff','#bae7ff'];
        numList=[4,3,2,1];    
        pieces = [
            {lt:1,label:'0',color:'#bae7ff',symbol:'rect'},
            {gte:0,lt:minAverage,label:'1-'+minAverage,color:'#92d1ff',symbol:'rect'},
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