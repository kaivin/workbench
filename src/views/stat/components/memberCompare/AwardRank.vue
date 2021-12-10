<template>
  <div class="memberAward">
      <div class="memberTit">
          <h3>奖金排行榜</h3>
          <p>(单位：元)</p>
      </div>
      <div class="awardRank">
          <ul class="inul" :style="'height:'+ awardMoneySet.boxHeight">
              <li class="flex-box" v-for="(item,index) in awardMoney" :key="index">
                <router-link :to="{path: lang == 'ch'?'/stat/cn/memberAnalysis/singlePerson':'/stat/en/memberAnalysis/singlePerson',query:{deptId:item.dept_id,itemId:item.uid}}" tag="a" target="_blank">  
                  <div class="rankNum">
                      <div class="numTop" v-if="item.ranking<4" :class="'numTop0'+(item.ranking)"></div>
                      <div class="numNormal" v-if="item.ranking>3 && item.ranking < 10">
                          0{{item.ranking}}
                      </div>
                      <div class="numNormal" v-if="item.ranking > 9">
                          {{item.ranking}}
                      </div>
                  </div>
                  <div class="userImg">
                    <div v-if="item.headimg" class="headImg">
                      <span><img :src="item.headimg" :alt="item.name" /></span>
                    </div>
                    <div v-else class="nopic"></div> 
                  </div>
                  <div class="userName">
                    <span>{{item.name}} - <span class="dept">{{item.deptName}}</span></span> 
                  </div>
                  <div class="userAward flex-content">
                      <span v-if="item.ranking<=3" :class="'num0'+(item.ranking)"> 
                        {{item.allmoney}}元
                      </span>
                      <span v-else> 
                        {{item.allmoney}}元
                      </span>
                  </div>
                  </router-link>
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
          boxHeight = '1133px'
        }
        
        $this.$emit("changeSet", $this.awardMoneySet, isFold, boxHeight);
    },
  }
}
</script>

<style></style>