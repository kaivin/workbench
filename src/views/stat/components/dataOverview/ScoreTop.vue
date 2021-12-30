<template>
  <div class="hxpage score-top">
    <div class="module-top">
      <div class="title-view">
        <div class="title">个人榜单TOP5</div>
        <div class="unit" v-if="type==1">（单位：{{language == '中文'?'分':'个'}}）</div>
        <div class="unit" v-if="type==2">（单位：个）</div>
        <div class="unit" v-if="type==3">（单位：个）</div>
        <div class="unit" v-if="type==4">（单位：元）</div>
        <router-link :to="{path:language == '中文'?'/stat/cn/memberAnalysis':'/stat/en/memberAnalysis'}" tag="a" target="_blank" class="more">更多分析<i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></router-link>
        <div class="btn-group btn_change">
          <div @click="changeType(1)" class="btn-item" :class="type == 1?'active':''">
            {{language == '中文'?'成交积分':'成交个数'}}
          </div>
          <div @click="changeType(2)" class="btn-item" :class="type == 2?'active':''">询盘个数</div>
          <div @click="changeType(3)" class="btn-item" :class="type == 3?'active':''">百万个数</div>
          <div @click="changeType(4)" class="btn-item" :class="type == 4?'active':''">奖金</div>
        </div>
      </div>
      <ul class="top-view" ref="topul">
        <li class="top-item" v-for="(item,index) in topdata" :key="index">
          <router-link :to="getlink(item)" tag="a" >
            <div class="top-icon">
              <img :src="require('@/assets/personal_InquiryIcon0'+(item.ranking)+'.png')" alt="" v-if="item.ranking < 4">
              <span v-else>0{{item.ranking}}</span>
            </div>
            <div class="top-img">
              <img  :src="item.headimg"  alt="">
            </div>
            <div class="top-name">
              <span v-if="type == 4||type == 2">{{item.name}}</span>
              <span v-if="type == 3">{{item.ownuser}}</span>
              <span v-else>{{item.username}}</span>
            </div>
            <div class="top-width">
              <div :class="'top-bar' + item.ranking" :style="'width:' + item.width"></div>
            </div>
            <div class="userAward flex-content" v-if="type == 4">
                  <span v-if="item.ranking<4" :class="'num0'+item.ranking"> 
                    {{item.allmoney}}元
                  </span>
                  <span v-else> 
                    {{item.allmoney}}元
                  </span>
            </div>
            <div class="userAward flex-content" v-if="type == 3||type ==2">
                  <span v-if="item.ranking<4" :class="'num0'+item.ranking"> 
                    {{item.number}}个
                  </span>
                  <span v-else> 
                    {{item.number}}个
                  </span>
            </div>
            <div class="userAward flex-content" v-if="type == 1&& language == '中文'">
                  <span v-if="item.ranking<4" :class="'num0'+item.ranking"> 
                    {{item.number}}分
                  </span>
                  <span v-else> 
                    {{item.number}}分
                  </span>
            </div>
            <div class="userAward flex-content" v-if="type == 1&& language == '英文'">
                  <span v-if="item.ranking<4" :class="'num0'+item.ranking"> 
                    {{item.number}}个
                  </span>
                  <span v-else> 
                    {{item.number}}个
                  </span>
            </div>
          </router-link>
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
        type: 1,
      }
    },
    props:{
      language:{
        type:String,
        default:"中文"
      },
      scoretop5:{
        type: Object,
        default:function(){
          return {}
        }
      },
    },
    watch:{
      scoretop5:{
        handler(val,oldval){
          this.getData();
        },
        deep:true
      },
    },
    mounted(){
      
    },
    destroyed(){
      
    },
    methods:{
      changeType(val){
        this.type = val;
        this.getData();
      },
      // setTopData(val){
      //   var $this = this;
      //   let topdata = JSON.parse(JSON.stringify(val));
      //   if(topdata.length > 0){
      //     let maxwidth = topdata[0].number;
      //     for(let i = 0;i<topdata.length;i++){
      //       topdata[i].width = parseFloat((topdata[i].number/maxwidth).toFixed(2)) * 85 + '%';
      //     }
      //     this.topdata = topdata;
      //   }
      // },
      getData(){
        let topdata = [];
        var $this = this;
        // 获取长度百分比
        if($this.type == 4){
          // 奖金
          topdata = $this.scoretop5.moneytop5;
          if(topdata.length > 0){
            let maxwidth = topdata[0].allmoney.split(',').join('');
            for(let i = 0;i<topdata.length;i++){
              topdata[i].width = parseFloat((topdata[i].allmoney.split(',').join('')/maxwidth).toFixed(2)) * 85 + '%';
            }
          }
        }else{
          if($this.type == 1){
            // 成交积分
            topdata = $this.scoretop5.yearuserscoretop5;
          }else if($this.type == 2){
            // 询盘个数
            topdata = $this.scoretop5.yearuserxuntop5;
          }else if($this.type == 3){
            // 百万个数
            topdata = $this.scoretop5.anumbertop5;
          }
          if(topdata.length > 0){
            let maxwidth = topdata[0].number;
            for(let i = 0;i<topdata.length;i++){
              topdata[i].width = parseFloat((topdata[i].number/maxwidth).toFixed(2)) * 85 + '%';
            }
          }
        }
        this.topdata = topdata;
        
      },
      // 获取链接
      getlink(item){
        var $this = this;
        var link={};
        if($this.language == "中文"){
          link.path = '/stat/cn/memberAnalysis/singlePerson';
        }else{
          link.path = '/stat/en/memberAnalysis/singlePerson';
        }
        link.query = {};
        link.query.deptId = item.dept_id;
        if($this.type == 1){
          if($this.language == "中文"){
            link.query.itemId = item.userid;
          }else{
             link.query.itemId = item.uid;
          }
        }else if($this.type == 2){
          link.query.itemId = item.id
        }else{
          link.query.itemId = item.uid
        }
        return link;
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