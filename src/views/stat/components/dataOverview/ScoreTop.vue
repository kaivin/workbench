<template>
  <div class="hxpage score-top">
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
</style>