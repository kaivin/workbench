<template>
  <div class="rowMonthDeal">
    <div class="rowTitle">
      <div class="title-left">
        <h3 class="tit-h3">各部门月成交完成情况统计</h3>
        <span class="tit-span">（单位：次）</span>
        <span class="tit-span">注：{{NowYear}}年{{scoremonth.split("-")[0]}}<span v:if="isShow">至{{NowYear}}年{{scoremonth.split("-")[1]}}</span></span>
      </div>
    </div>
    <div class="rowMain">
        <ul class="depMonthCont">
            <li class="firstLine">
                <div class="fItem">部门</div>
                <div class="fItem">不合格</div>
                <div class="fItem">合格</div>
                <div class="fItem">中等</div>
                <div class="fItem">优秀</div>
            </li>
            <li class="secLine" v-for="(item,index) in MonthFinish" :key="index">
                <div class="cItem">
                    <span>
                        {{item.name}}
                    </span>
                </div>
                <div class="cItem">
                    <span>
                        × {{item.bad}}
                    </span>
                </div>
                <div class="cItem">
                    <span>
                        × {{item.qualified}}
                    </span>
                </div>
                <div class="cItem">
                    <span>
                        × {{item.medium}}
                    </span>
                </div>
                <div class="cItem">
                    <span>
                        × {{item.good}}
                    </span>
                </div>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
export default {
    name: "MonthDeal",
    data() {
        return {
            NowYear:"",
            NowMonth:"",
            isShow: true
        }
    },
    props:{
        MonthFinish: {
            type: Array,
            default: function () {
                return [];
            },
        },
        scoremonth: {
            type: String,
            default: function() {
                return '';
            }
        }
    },
    created(){
        var $this = this;
        $this.NowYear = new Date().getFullYear();
        $this.NowMonth = new Date().getMonth() + 1;
        if(new Date().getMonth() +1 == 1){
            $this.isShow = false
        }

    },
    methods:{
        
    }
}
</script>

<style>

</style>