export function MapInterval(maxNum){
    var minAverage='';  
    var defaulColor = []   
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
            defaulColor=['#ae1222','#f27042','#f1de5f','#a2bfcd', '#b3b3b3'];
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
            defaulColor=[];
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
        defaulColor=['#b3b3b3'];
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