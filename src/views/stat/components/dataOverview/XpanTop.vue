<template>
  <div class="hxpage minHxpage">
    <div class="module-top">
      <div class="title-view">
        <div class="title">个人年度总询盘个数 TOP5</div>
        <div class="unit">（单位：个）</div>
        <div class="more" @click="goPage">详情 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></div>
      </div>
      <ul class="top-view" ref="topul">
        <li class="top-item" v-for="(item,index) in topdata" :key="index" @click="handleContrast(item.dept_id,item.id)">
          <div class="top-img">
            <span v-if="index <= 2" :class="'topimg' + index"><img :src="item.headimg" alt=""></span>
            <span v-if="index == 3"><img src="@/assets/top4.jpg" alt=""></span>
            <span v-if="index == 4"><img src="@/assets/top5.jpg" alt=""></span>
          </div>
          <div class="top-name">
            <img :class="'topicon' + index" v-if="index == 0" src="@/assets/top1.jpg" alt="">
            <img :class="'topicon' + index" v-if="index == 1" src="@/assets/top2.jpg" alt="">
            <img :class="'topicon' + index" v-if="index == 2" src="@/assets/top3.jpg" alt="">
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
          this.$router.push('/stat/cn/memberAnalysis')
        }else{
          this.$router.push('/stat/en/memberAnalysis')
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
      },
    }
}
</script>

<style></style>