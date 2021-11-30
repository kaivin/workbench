export function MapInterval(maxNum){    
    var minAverage='';  
    var defaulColor = []   
        if(maxNum>=20){
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
            var averArr=['0-'+minAverage,minAverage+'-'+minAverage*2,minAverage*2+'-'+minAverage*3,minAverage*3+'-'+minAverage*4,'大于'+minAverage*4];
            defaulColor=['#f66262','#fdb76a','#496bf2','#a4b8de','#e4e5ea'];
            var numList=[minAverage*4,minAverage*3,minAverage*2,minAverage*1]; 
        }else{
            minAverage=20;
            var averArr=['0-'+minAverage];
            defaulColor=['#e4e5ea'];
            var numList=[minAverage*1];          
        }
    var valDateObj={}
    valDateObj.minAverage=minAverage;         // 平均值
    valDateObj.numList=numList;               // 色块区间
    valDateObj.averArr=averArr;               // 区间值
    valDateObj.defaulColor=defaulColor;       // 区间值
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
            if(item.number>=obj.numList[i]){
                topTenColor.push(obj.defaulColor[i]);
                break;
            }
            if(item.number<obj.numList[obj.numList.length-1]){
                topTenColor.push(obj.defaulColor[obj.numList.length]);
                break;
            }
        }
    });
    topTenColor.reverse();
    return topTenColor;
}