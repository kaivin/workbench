<template>
  <div class="memberAward">
      <div class="memberTit">
          <h3>个人年度总<span>奖金额</span>排行榜</h3>
          <p>（单位：元）</p>
      </div>
      <div class="awardRank">
          <ul class="inul" :style="'height:'+ awardMoneySet.boxHeight">
              <li v-for="(item,index) in awardMoney" :key="index">
                  <div class="rankNum">
                      <div class="numTop" v-if="index<3" :class="'numTop0'+(index+1)"></div>
                      <div class="numNormal" v-if="index>2 && index < 9">
                          0{{index+1}}
                      </div>
                      <div class="numNormal" v-if="index > 8">
                          {{index+1}}
                      </div>
                  </div>
                  <div class="userImg">
                    <div v-if="item.headimg" class="headImg" @click="handleContrast(item.dept_id,item.uid)">
                      <img :src="item.headimg" :alt="item.name" />
                    </div>
                    <div v-else class="nopic"></div> 
                  </div>
                  <div class="userName">
                    <span @click="handleContrast(item.dept_id,item.uid)">{{item.name}} </span> 
                  </div>
                  <div class="userAward">
                      <span v-if="index<3" :class="'num0'+(index+1)"> 
                        {{item.allmoney}}元
                      </span>
                      <span v-else> 
                        {{item.allmoney}}元
                      </span>
                  </div>
              </li>
          </ul>
          <div class="awardMore" v-if="awardMoneySet.ifFold" :class="!awardMoneySet.isFold? 'inRotate' : 'rowRotate' "  @click="showAll" ></div>
      </div>
  </div>
</template>

<script>
export default {
  name: "AwardRank",
  data() {
    return {
    };
  },
  created(){
  },
  props: {
    awardMoney: {
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
    awardMoneySet: {
      type: Object,
      default: function () {
        return {};
      },
    }
  },
  methods:{
    showAll(){
        var $this = this;
        var isFold = !$this.awardMoneySet.isFold;
        var boxHeight = '';
        if(isFold){
          boxHeight = "auto";
        }else{
          boxHeight = '770px'
        }
        
        $this.$emit("changeSet", $this.awardMoneySet, isFold, boxHeight);
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