<template>
  <div class="hxpage">
    <div class="module-top">
      <div class="title-view">
        <div class="title">个人年度总询盘个数 TOP5</div>
        <div class="unit">（单位：个）</div>
        <div class="more" @click="goPage">详情 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></div>
      </div>
      <ul class="top-view" ref="topul">
        <li class="top-item" v-for="(item,index) in topdata" :key="index">
          <div class="top-img">
            <img v-if="index <= 2" :src="item.headimg" :class="'topimg' + index" alt="">
            <img v-if="index == 3" src="../../assets/top4.jpg" alt="">
            <img v-if="index == 4" src="../../assets/top5.jpg" alt="">
          </div>
          <div class="top-name">
            <img :class="'topicon' + index" v-if="index == 0" src="../../assets/top1.jpg" alt="">
            <img :class="'topicon' + index" v-if="index == 1" src="../../assets/top2.jpg" alt="">
            <img :class="'topicon' + index" v-if="index == 2" src="../../assets/top3.jpg" alt="">
            <span>{{item.name}}</span>
          </div>
          <div class="top-width">
            <div :class="'top-bar' + index" :style="'width:' + (barWidth * item.width) + 'px'"></div>
            <span>{{item.number}}</span>
          </div>
        </li>
      </ul>

      
      
    </div>
    
  </div>
</template>

<script>
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
      yearusertop5:{
        type:Array,
        default:function(){
          return []
        }
      }
    },
    watch:{
      yearusertop5:{
        handler(val,oldval){
          this.setTopData(val);
        },
        deep:true
      }
    },
    mounted(){
      this.setBarWidth();
      window.addEventListener('resize',this.setBarWidth)
    },
    destroyed(){
      window.removeEventListener('resize',this.setBarWidth)
    },
    methods:{
       goPage(){
        if(this.language == '中文'){
          this.$router.push('/Home/CH/groupAnalysis')
        }else{
          this.$router.push('/Home/EN/groupAnalysis')
        }
      },
      setTopData(val){
        let topdata = JSON.parse(JSON.stringify(val));
        let maxwidth = topdata[0].number;
       
        for(let i = 0;i<topdata.length;i++){
          topdata[i].width = parseFloat((topdata[i].number/maxwidth).toFixed(2))
        }
        this.topdata = topdata;
        
      },
      setBarWidth(){
        let topul = this.$refs["topul"].offsetWidth;
        this.barWidth = topul - 42 - 50 - 46;
      }
    }
}
</script>

<style scoped lang="scss">
.hxpage{
  background: #fff;
  min-height: 306px;
  .module-top{
    padding: 15px 30px 0;
    
  }
  .title-view{
    height: 24px;
    line-height: 24px;
    margin-bottom: 25px;
    .title{
      font-size: 14px;
      color: #1a1a1a;
      float: left;
      margin-right: 4px;
      font-weight: bold;
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
    padding: 20px 30px;
  }
  .chart-bottom{
    height: 260px;
    margin-top: 35px;
  }
  .top-view{
    .top-item{
      display: flex;
      margin-bottom: 6px;
      .top-img{
        display: flex;
        width: 42px;
        height: 42px;
        
        img{
          margin: auto;
          border-radius: 50%;
        }
        .topimg0{
          width: 42px;
          height: 42px;
           box-sizing: border-box;
          border: 1px solid #fff;
          box-shadow: 0px 5px 9px 0px rgba(185, 193, 204, 0.58);
        }
        .topimg1{
          width: 36px;
          height: 36px;
           box-sizing: border-box;
          border: 1px solid #fff;
          box-shadow: 0px 5px 9px 0px rgba(185, 193, 204, 0.58);
        }
        .topimg2{
          width: 32px;
          height: 32px;
          box-sizing: border-box;
          border: 1px solid #fff;
          box-shadow: 0px 5px 9px 0px rgba(185, 193, 204, 0.58);
        }
      }
      .top-name{
        width: 50px;
        display: flex;
        text-align: center;
        flex-flow: column;
        justify-content: center;
        img{
          margin: 0 auto;
        }
        span{
          font-size: 12px;
          color: #393939;
        }
        .topicon0{
          width: 26px;
        }
        .topicon1{
          width: 20px;
        }
        .topicon2{
          width: 18px;
        }
      }
      .top-width{
        line-height: 42px;
        display: flex;
        div{
          height: 12px;
          margin: auto 0;
          border-radius: 6px;
        }
        span{
          font-size: 12px;
          margin-left: 10px;
          color: #3c3c3c;
        }
        .top-bar0{
          background-color: rgb(252, 84, 75);
          box-shadow: 0px 5px 10px 0px rgba(240, 156, 148, 0.51);
        }
        .top-bar1{
          background-color: rgb(255, 172, 92);
          box-shadow: 0px 5px 10px 0px rgba(247, 182, 119, 0.51);
        }
        .top-bar2{
          background-color: rgb(255, 218, 128);
          box-shadow: 0px 5px 10px 0px rgba(248, 207, 179, 0.51);
        }
        .top-bar3{
          background: #d1dbe4;
        }
        .top-bar4{
          background: #d1dbe4;
        }
      }
    }
  }
  
}
</style>