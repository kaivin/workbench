<template>
    <div class="sidebar-footer">
        <div class="flex-font"><p>项目技术栈</p></div>
        <hamburger id="hamburger-container" v-bind:is-active="sidebar.opened" class="hamburger-container" v-on:toggleClick="toggleSideBar" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
export default {
    components: {
        Hamburger,
    },
    computed: {
        ...mapGetters([
            'sidebar',
        ]),
    },
    methods:{
        // 侧边导航伸缩
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
    }
}
</script>


<style lang="scss" scoped>
.sidebar-footer{
    width:100%;
    height:56px;
    background: $subMenuBg;
    position: relative;
    z-index: 1100;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    .flex-font{
        flex:1;
        height: 100%;
        p{
            width: 100%;
            height: 56px;
            line-height: 56px;
            font-size: 12px;
            color: $placeholderText;
            text-align: center;
            margin:0;
            transition: all .2s;
        }
    }
}
</style>
