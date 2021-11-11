<template>
  <div class="rowFourOne" v-if="currentCluesData.userscoreNum&&currentCluesData.userscoreNum.length>0">
                    <div class="itemRowTit">
                         <h3>月成交Top5</h3>
                         <span>(单位：分)</span>
                    </div>
                    <ul class="rowFourOneUl">
                        <li class="flex-box flex-wrap" v-for="(item,index) in currentCluesData.userscoreNum" :key='index'>
                             <p class="rowFourOneUlNum"><span>{{index+1}}</span></p>
                             <p class="rowFourOneUlPic" v-if="item.headimg"><img v-bind:src="item.headimg" alt=""></p>
                             <p class="rowFourOneUlPic" v-else><img src="../../../assets/clinchIcon01.png" alt=""></p>
                             <div class="rowFourOneUlBox flex-content">
                                  <p class="infoData">
                                    {{item.username}}
                                    <span class="group">{{item.groupname}}</span>
                                  </p>
                                  <p class="percen flex-wrap">
                                     <span class="percenFl flex-content"><i :style="'width:'+item.percen+'%'"></i></span>
                                     <span class="percenFr">{{item.number}}<i v-if="item.Growth!=0" :class="item.growthClass?'rising':'falling'">{{item.Growth}}</i></span>
                                  </p>
                             </div>
                        </li>
                    </ul>
               </div>
</template>

<script>
export default {
    name:'demo',
    data(){
        return {

        }
    },
    props:{
        currentCluesData:{
            type:Object,
            default:function(){
                return {}
            }
        }
    },
    created(){

    },
    methods:{

    }
}
</script>

<style>

</style>