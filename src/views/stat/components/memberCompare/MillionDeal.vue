<template>
  <div class="millionDeal" v-if="millionDeal.length > 0">
    <div class="milRank">
        <ul class="milul" :style="'height:'+ millionDealSet.boxHeight">
            <li v-for="(item,index) in millionDeal" :key="index">
                <div class="rankNum" >
                    <div v-if="item.ranking<4" class="rankstyle" :class="'rank0'+(item.ranking)"></div>
                    <div class="numNormal" v-if="item.ranking>3 && item.ranking < 10">
                          0{{item.ranking}}
                      </div>
                      <div class="numNormal" v-if="item.ranking > 9">
                          {{item.ranking}}
                      </div>
                </div>
                <div class="userImg">
                    <div v-if="item.headimg" class="headImg" @click="handleContrast(item.dept_id,item.uid)">
                      <img :src="item.headimg" :alt="item.ownuser" />
                    </div>
                    <div v-else class="nopic"></div>  
                </div>
                <div class="userName">                
                    <span @click="handleContrast(item.dept_id,item.uid)">{{item.ownuser}}</span>                    
                </div>
                <div class="milNum">
                    ×{{item.number}}
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
          boxHeight = '296px'
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