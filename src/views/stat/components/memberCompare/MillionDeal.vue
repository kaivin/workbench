<template>
  <div class="millionDeal" v-if="millionDeal.length > 0">
      <div class="memberTit">
          <h3>百万成交榜单</h3>
          <p>(单位：个)</p>
      </div>
    <div class="milRank">
        <ul class="milul" :style="'height:'+ millionDealSet.boxHeight">
            <li v-for="(item,index) in millionDeal" :key="index" @click="handleContrast(item.dept_id,item.uid)">
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
                    <span>{{item.ownuser}}</span>                    
                </div>
                <div class="milNum flex-content">
                     <p>×{{item.number}}</p>
                </div>
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
    // 跳转到个人详情
    handleContrast(deptId,itemId){
      var $this=this;
      if($this.lang=='ch'){
        var routeUrl =  $this.$router.resolve({path: "/stat/cn/memberAnalysis/singlePerson",query:{deptId:deptId,itemId:itemId}});
      }else{
        var routeUrl =  $this.$router.resolve({path: "/stat/en/memberAnalysis/singlePerson",query:{deptId:deptId,itemId:itemId}});
      }
      window.open(routeUrl.href,'_blank');
    },
  }
}
</script>

<style>

</style>