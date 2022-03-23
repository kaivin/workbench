<template>
  <div class="rowMonthDeal" :class="lang=='en'? 'enrowMonthDeal':''">
    <div class="rowTitle">
      <div class="title-left">
        <h3 class="tit-h3">月成交等级统计</h3>
        <span class="tit-span">（单位：次）</span>
        <span class="tit-span" v-if="isShow">注：{{showYear}}年{{scoremonth.split("-")[0]}}<span>至{{showYear}}年{{scoremonth.split("-")[1]}}</span></span>
        <!-- <span class="tit-span" v-else>注：{{NowYear}}年暂无数据</span> -->
      </div>
      <div class="dealYear">
        <span :class="type==1?'active':''" @click="changeType(1)">{{NowYear-1}}年</span>
        <span :class="type==2?'active':''" @click="changeType(2)">{{NowYear}}年</span>
      </div>
    </div>
    <div class="rowMain">
        <el-table
            :data="MonthFinish"
            style="width: 100%"
            border
            class="depMonthCont"
            >
            <el-table-column
                prop="name"
                label="部门">
            </el-table-column>
            <el-table-column
                prop="bad"
                label="不合格">
                <template slot-scope="scope">
                    <el-tooltip placement="top" effect="light" popper-class="newtooltip" :disabled="scope.row.badmonth.length>0? false : true">
                        <div slot="content">
                            <div class="showmonth">
                                <span class="sitem" v-for="(item,index) in scope.row.badmonth.slice(0,-1).split('|')" :key="index">{{item}}</span>
                            </div>
                        </div>
                        <div class="cetbox">
                            <span class="cet01"><i>×</i>{{scope.row.bad}}</span>
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column
                prop="qualified"
                label="合格">
                <template slot-scope="scope">
                    <el-tooltip placement="top" effect="light" popper-class="newtooltip" :disabled="scope.row.qualifiedmonth.length > 0? false : true">
                        <div slot="content">
                            <div class="showmonth">
                                <span class="sitem" v-for="(item,index) in scope.row.qualifiedmonth.slice(0,-1).split('|')" :key="index">{{item}}</span>
                            </div>
                        </div>
                        <div class="cetbox">
                            <span class="cet02"><i>×</i>{{scope.row.qualified}}</span>
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column
                prop="medium"
                label="中等">
                <template slot-scope="scope">
                    <el-tooltip placement="top" effect="light" popper-class="newtooltip" :disabled="scope.row.mediummonth.length > 0? false : true">
                        <div slot="content">
                            <div class="showmonth">
                                <span class="sitem" v-for="(item,index) in scope.row.mediummonth.slice(0,-1).split('|')" :key="index">{{item}}</span>
                            </div>
                        </div>
                        <div class="cetbox">
                            <span class="cet03"><i>×</i>{{scope.row.medium}}</span>
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column
                prop="good"
                label="优秀"
                >
                <template slot-scope="scope">
                    <el-tooltip placement="top" effect="light" popper-class="newtooltip" :visible-arrow="true" :disabled="scope.row.goodmonth.length>0? false : true">
                        <div slot="content">
                            <div class="showmonth">
                                <span class="sitem" v-for="(item,index) in scope.row.goodmonth.slice(0,-1).split('|')" :key="index">{{item}}</span>
                            </div>
                        </div>
                        <div class="cetbox">
                            <span class="cet04"><i>×</i>{{scope.row.good}}</span>
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
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
            isShow: true,
            type:2,
            showYear:''
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
        },
        lang: {
            type: String,
            default: function(){
                return "";
            }
        }
    },
    created(){
        var $this = this;
        $this.NowYear = new Date().getFullYear();
        $this.NowMonth = new Date().getMonth() + 1;
        if(new Date().getMonth() < 2){
            $this.type = 1;
            $this.showYear = new Date().getFullYear()-1;
        }else{
            $this.showYear = new Date().getFullYear();
        }
    },
    watch:{
        scoremonth(val){
            var $this = this;
            if(val == ''){
                $this.isShow = false
            }else{
                $this.isShow = true
            }
        }
    },
    mounted(){
    },
    methods:{
        changeType(val){
            var $this = this;
            $this.type = val;
            $this.isShow = false;
            var year = '';
            if(val == 1){
                year = $this.NowYear-1;
            }else{
                year = $this.NowYear;
            }
            $this.showYear = year;
            $this.$emit('yearChange',year)
        }
    }
}
</script>

<style></style>