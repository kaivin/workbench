<template>
  <div class="hxpage minHxpage">
    <div class="module-top">
      <div class="title-view">
        <div class="title">年度成交{{language == '中文'?'积分':'个数'}} TOP5</div>
        <div class="unit">（单位：{{language == '中文'?'分':'个'}} <img src="@/assets/no_icon.png" alt="">：百万）</div>
        <router-link :to="{path:language == '中文'?'/stat/cn/memberAnalysis':'/stat/en/memberAnalysis'}" tag="a" target="_blank" class="more">详情 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></router-link>
      </div>
      <ul class="top-view" ref="topul">
        <li class="top-item" v-for="(item,index) in topdata" :key="index">
          <router-link :to="{path: language == '中文'?'/stat/cn/memberAnalysis/singlePerson':'/stat/en/memberAnalysis/singlePerson',query:{deptId:item.dept_id,itemId:language == '中文'?item.userid:item.uid}}" tag="a">
          <div class="top-icon">
            <img :src="require('@/assets/no'+(index+1)+'.jpg')" alt="">
          </div>
          <div class="top-img">
            <img  :src="item.headimg"  alt="">
          </div>
          <div class="top-name">
            {{item.username}}
          </div>
          <div class="top-width">
            <div :class="'top-bar' + index" :style="'width:' + item.width"></div>
            <span>{{item.number}}</span>
          </div>
          <div class="top-num" v-if="item.anumber>0">
            <img src="@/assets/no_icon.png" alt="">
            <span>x{{item.anumber}}</span>
          </div>
          </router-link>
        </li>
      </ul>
    </div>
    
  </div>
</template>

<script>
import parseInt from '@antv/util/lib/to-integer';
export default {
    name:'demo',
    data(){
      return {
        topdata:[],
        barWidth:212,

      }
    },
    props:{
      language:{
        type:String,
        default:"中文"
      },
      yearuserscoretop5:{
        type:Array,
        default:function(){
          return []
        }
      }
    },
    watch:{
      yearuserscoretop5:{
        handler(val,oldval){
          this.setTopData(val);
        },
        deep:true
      }
    },
    mounted(){
      
    },
    destroyed(){
      
    },
    methods:{
      setTopData(val){
        let topdata = JSON.parse(JSON.stringify(val));
        topdata.sort(function(a, b){return a.number - b.number}).reverse(); 
        let maxwidth = topdata[0].number;
        for(let i = 0;i<topdata.length;i++){
          topdata[i].width = parseFloat((topdata[i].number/maxwidth).toFixed(2)) * 100 + '%';
          topdata[i].anumber = parseInt(topdata[i].anumber);
          topdata[i].color = '#fff';
        }
        this.topdata = topdata;
        
      },
      setBarColor(){
        let topul = this.$refs["topul"].offsetWidth;
        let barWidth = topul - 200;
        for(let i = 0;i<this.topdata.length;i++){
          if(parseFloat(this.topdata[i].width.replace('%',''))/100 * barWidth >=72 && i<3){
            this.topdata[i].color = '#fff'
          }else{
            this.topdata[i].color = '#454545'
          }
        }
      },
      // 跳转到个人详情
      handleContrast(deptId,itemId){
        var $this=this;
        if($this.language == '中文'){
          var routeUrl =  $this.$router.resolve({path: "/stat/cn/memberAnalysis/singlePerson",query:{deptId:deptId,itemId:itemId}});
        }else{
          var routeUrl =  $this.$router.resolve({path: "/stat/en/memberAnalysis/singlePerson",query:{deptId:deptId,itemId:itemId}});
        }
        window.open(routeUrl.href,'_blank');
      }
      
    }
}
</script>

<style scoped lang="scss">
.hxpage{
  background: #fff;
  min-height: 306px;
  .module-top{
    padding: 30px 22px 17px;
    border-right: 1px solid #efefef;
    border-bottom: 1px solid #efefef;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
    &:hover{
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    }
  }
  .title-view{
    height: 24px;
    line-height: 24px;
    margin-bottom: 20px;
    .title{
      font-size: 14px;
      color: #1a1a1a;
      float: left;
      margin-right: 0;
      font-weight: bold;
    }
    .unit{
      font-size: 12px;
      color: #a1a1a1;
      float: left;
      line-height: 24px;
      height: 24px;
      img{
        width: 18px;
        position: relative;
        top: 4px;
        vertical-align: top;
        display: inline-block;
        margin-left: 5px;
      }
    }
    .more{
      font-size: 12px;
      color: #a1a1a1;
      float: right;
      cursor: pointer;
      position: relative;
      top: -1px;
      .svg-i{
        font-size: 10px;
        color: #a1a1a1;
        vertical-align: 1px;
      }
    }
  }
  .contrast-view{
    height: 40px;
    margin-bottom: 15px;
    .redtext{
      float: left;
      font-size: 26px;
      color: #eb3737;
      font-weight: bold;
      margin-right: 15px;
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
    padding: 30px;
    border-right: 1px solid #efefef;
    border-bottom: 1px solid #efefef;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
    &:hover{
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    }
  }
  .chart-bottom{
    height: 260px;
    margin-top: 35px;
  }
  .top-view{
    .top-item{
      display: flex;
      margin-bottom: 15px;
      cursor: pointer;
      a{
        flex:1;
        display: flex;
      }
      .top-icon{
        display: flex;
        width: 34px;
        height: 34px;
        margin-right: 10px;
        img{
          margin: auto 0 auto 0;
        }
      }
      .top-img{
        display: flex;
        width: 34px;
        height: 34px;
        border: 1px solid #fee170;
        border-radius: 50%;
        overflow: hidden;
        img{
          margin: auto;
          width: 100%;
          box-sizing: border-box;
        }
        
      }
      .top-name{
        width: 66px;
        height: 34px;
        line-height: 34px;
        font-size: 12px;
        color: #1b1b1b;
        text-align: center;
      }
      .top-width{
        width: calc(100% - 200px);
        height: 34px;
        box-sizing: border-box;
        padding-top: 9px;
        position: relative;
        margin-right: 20px;
        display: flex;
        div{
          height: 16px;
        }
        span{
          font-size: 12px;
          line-height: 16px;
          color: #454545;
          margin-left: 10px;
        }
        .top-bar0{
          background:#fc544b;
        }
        .top-bar1{
          background:#ff8317;
        }
        .top-bar2{
          background:#fac322;
        }
        .top-bar3{
          background: #d1dbe4;
        }
        .top-bar4{
          background: #d1dbe4;
        }
      }
      .top-num{
        display: flex;
        img{
          margin: auto 3px auto 0;
          width: 22px;
        }
        span{
          font-size: 12px;
          color: #dea21c;
          margin: auto 0;
        }
      }
    }
  }
  
}
</style>