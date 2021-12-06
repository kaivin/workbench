<template>
    <div class="homeLeft" :class="currentShrink?'':'Shrink'">
        <el-scrollbar v-if='currentShrink' wrap-class="scrollbar-wrapper">
            <ul class="homeLeftMenu">
                <template v-for="item in currentData">
                <li class="homeSubmenu" v-if="item.menuList.length>0">
                    <div class="homeLeftTit"><span>{{item.title}}</span><i class='el-icon-arrow-down'></i></div>
                    <ul>
                        <li v-for="item1 in item.menuList"><router-link tag='span' :to="item1.router">{{item1.title}}</router-link></li>
                    </ul>
                </li>
                </template>
            </ul>
        </el-scrollbar>
        <p class="homeLeftArrow" v-on:click="handleShrink"><i></i></p>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name:"sidebar",
    data(){
        return{
          currentShrink:true,
          currentData:[],
        }
    },
    props: {
        menuList: {
        type: Array,
        default:[],
        },
    },
    watch: {
        menuList:{
        handler(newValue, oldValue) {
            this.currentData = newValue;
        },
        deep: true,
        immediate:true
        },
    },
    methods: {
        handleShrink(){
        var $this = this;
        $this.currentShrink=!$this.currentShrink;
        },
    }
}
</script>