<template>
  <div class="millionDeal" v-if="millionDeal.length > 0">
    <div class="milRank">
        <ul class="milul" :style="'height:'+ millionDealSet.boxHeight">
            <li v-for="(item,index) in millionDeal" :key="index">
                <div class="rankNum" >
                    <div v-if="index<3" class="rankstyle" :class="'rank0'+(index+1)"></div>
                    <div class="numNormal" v-if="index>2 && index < 9">
                          0{{index+1}}
                      </div>
                      <div class="numNormal" v-if="index > 8">
                          {{index+1}}
                      </div>
                </div>
                <div class="userImg">
                    <div v-if="item.headimg" class="headImg">
                      <img :src="item.headimg" :alt="item.ownuser" />
                    </div>
                    <div v-else class="nopic"></div>  
                </div>
                <div class="userName">
                    {{item.ownuser}}
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
  }
}
</script>

<style>

</style>