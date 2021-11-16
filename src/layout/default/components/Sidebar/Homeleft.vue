<template>
    <div class="homeLeft" :class="currentShrink?'':'Shrink'">
        <el-scrollbar v-if='currentShrink' wrap-class="scrollbar-wrapper">
            <ul class="homeLeftMenu">
                <li class="homeSubmenu">
                    <div class="homeLeftTit"><span>中文</span><i class='el-icon-arrow-down'></i></div>
                    <ul>
                        <li><router-link tag='span' to="/Home/CH/objectiveShow">目标展示</router-link></li>
                        <li><router-link tag='span' to="/Home/CH/dataOverview">数据总览</router-link></li>
                        <li><router-link tag='span' to="/Home/CH/sectorAnalysis">部门分析</router-link></li>
                        <li><router-link tag='span' to="/Home/CH/teamMember">小组分析</router-link></li>
                        <li><router-link tag='span' to="/Home/CH/groupAnalysis">组员分析</router-link></li>
                    </ul>
                </li>
                <li class="homeSubmenu">
                    <div class="homeLeftTit"><span>英文</span><i class='el-icon-arrow-down'></i></div>
                    <ul>
                        <li><router-link tag='span' to="/Home/EN/objectiveShow">目标展示</router-link></li>
                        <li><router-link tag='span' to="/Home/EN/dataOverview">数据总览</router-link></li>
                        <li><router-link tag='span' to="/Home/EN/sectorAnalysis">部门分析</router-link></li>
                        <li><router-link tag='span' to="/Home/EN/teamMember">小组分析</router-link></li>
                        <li><router-link tag='span' to="/Home/EN/groupAnalysis">组员分析</router-link></li>
                    </ul>
                </li>
            </ul>
        </el-scrollbar>
        <p class="homeLeftArrow" v-on:click="handleShrink"><i></i></p>
    </div>
</template>
<script>
export default {
    name:"Homeleft",
    data(){
        return{
          currentShrink:true,
        }
    },
    methods: {
        handleShrink(){
        var $this = this;
        $this.currentShrink=!$this.currentShrink;
        },
    }
}
</script>



