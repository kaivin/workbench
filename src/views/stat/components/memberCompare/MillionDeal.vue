<template>
  <div class="millionDeal" v-if="millionDeal.length > 0">
      <div class="memberTit">
          <h3>百万成交榜单<span>({{dateTime}})</span></h3>
          <p>(单位：个)</p>
      </div>
    <div class="milRank">
        <ul class="milul" :style="'height:'+ millionDealSet.boxHeight">
            <li v-for="(item,index) in millionDeal" :key="index">
                <router-link :to="{path: lang == 'ch'?'/stat/cn/memberAnalysis/singlePerson':'/stat/en/memberAnalysis/singlePerson',query:{deptId:item.dept_id,itemId:item.uid}}" tag="a" target="_blank"> 
                <div class="rankNum" >
                    <div v-if="item.ranking<4" class="rankstyle" :class="'rank0'+(item.ranking)"></div>
                    <div class="numNormal" v-if="item.ranking>3 && item.ranking <= 9">
                          0{{item.ranking}}
                      </div>
                      <div class="numNormal" v-if="item.ranking > 9">
                          {{item.ranking}}
                      </div>
                </div>
                <div class="userImg">
                    <div v-if="item.headimg" class="headImg" :class="item.ranking<4?'headImgBorder':''">
                      <span><img :src="item.headimg" :alt="item.ownuser" /></span>
                    </div>
                    <div v-else class="nopic" :class="item.ranking<4?'headImgBorder':''"><span></span></div>  
                </div>
                <div class="userName">                
                    <span>{{item.ownuser}} - <span class="dept">{{item.deptName}}</span></span>                    
                </div>
                <div class="milNum flex-content">
                     <p>×{{item.number}}</p>
                </div>
                </router-link>
            </li>
        </ul>
        <div class="milMore" v-if="millionDealSet.ifFold" :class="!millionDealSet.isFold? 'inRotate' : 'rowRotate' "  @click="showAll" ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MillionDeal",
  data() {
    return {

    };
  },
  created(){
  },
  props: {
    millionDeal: {
      type: Array,
      default: function () {
        return [];
      },
    },
    lang:{
      type: String,
      default: function () {
        return "";
      },
    },
    //折叠情况
    millionDealSet: {
      type: Object,
      default: function () {
        return {};
      },
    },
    scoretime:{
      type: String,
      default: function () {
        return "";
      },
    },
  },
  computed:{
    dateTime(){
      var $this = this;
      var datearr=$this.scoretime.split("|");
      var newarr=[];
      for(var i=0;i<datearr.length;i++){
        datearr[i] = datearr[i].split("-").join(".");
      }
      return datearr.join("-");
    }
  },
  methods:{
    showAll(){
        var $this = this;
        var isFold = !$this.millionDealSet.isFold;
        var boxHeight = '';
        if(isFold){
          boxHeight = "auto";
        }else{
          boxHeight = '630px'
        }
        
        $this.$emit("changeSet", $this.millionDealSet, isFold, boxHeight);
    },
  }
}
</script>

<style></style>