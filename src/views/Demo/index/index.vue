<template>
    <div class="scroll-root-container">
        <div class="scroll-button left" v-if="showScrollButton" @click="handleScroll('left')">
            <i class="el-icon-arrow-left"></i>
        </div>
        <div class="scroll-button right" v-if="showScrollButton" @click="handleScroll('right')">
            <i class="el-icon-arrow-right"></i>
        </div>
        <div
            class="scroll-root"
            ref="parent"
        >
            <div class="scroll-container" ref="scrollContent">
                为高校生活购买 Mac 或 iPad，AirPods 搭配其中。
                以教育优惠购买符合条件的 Mac 或 iPad，现搭配 AirPods，并可选择升级至 AirPods Pro1。还能 8 折加购 AppleCare+ 服务计划，享受配件优惠2。
                为高校生活购买 Mac 或 iPad，AirPods 搭配其中。
                以教育优惠购买符合条件的 Mac 或 iPad，现搭配 AirPods，并可选择升级至 AirPods Pro1。还能 8 折加购 AppleCare+ 服务计划，享受配件优惠2。
                为高校生活购买 Mac 或 iPad，AirPods 搭配其中。
                以教育优惠购买符合条件的 Mac 或 iPad，现搭配 AirPods，并可选择升级至 AirPods Pro1。还能 8 折加购 AppleCare+ 服务计划，享受配件优惠2。
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Scroll',
    data() {
        return {
            showScrollButton: false,
        }
    },
    mounted() {
        const { $refs: { parent, scrollContent } } = this
        // 第一次加载时判断是否需要显示左右滚动按钮，如果父容器的宽度大于子容器的宽度就不用
        if (parent && scrollContent) {
            this.showScrollButton = parent.offsetWidth < scrollContent.offsetWidth
        }
    },
    methods: {
        handleScroll(direction) {
            // 每10毫秒移动20，点击一次移动十次,根据自己需要调整
            let times = 0
            const interval = 10
            const moveInterval = 20
            const totalTimes = 10
            const vm = this
            const scroll = () => {
                times++
                const offset = vm.$refs.parent.scrollLeft
                vm.$refs.parent.scrollLeft = direction === 'right'? offset + moveInterval  : offset - moveInterval 
                if (times !== totalTimes ) {
                    setTimeout(scroll, interval )
                }
            }
            scroll()
        },
    },
}
</script>

<style scoped>
    .scroll-root-container {
        position: relative;
        width: 700px;
        margin: 0 auto;
        border-left: 1px solid black;
        border-right: 1px solid black;
    }
    .scroll-root {
        width: 100%;
        height: 300px;
        overflow-x: auto;
        scrollbar-width: none; /* Firefox 隐藏滚动条 */
    }
    .scroll-root::-webkit-scrollbar {
        display: none; /* chrome 隐藏滚动条 */

    }
    .scroll-container {
        width: 1000px;
        height: 100%;
    }
    .scroll-button {
        width: 19px;
        height: 40px;
        cursor: pointer;
        position: absolute;
        top: 140px;
        line-height: 40px;
        background: rgba(0, 0, 0, 0.51);
    }
    .el-icon-arrow-left,.el-icon-arrow-right {
        font-weight: bolder;
        font-size: 16px;
    }
    .left {
        left: 0;
        border-bottom-right-radius: 20px;
        border-top-right-radius: 20px;
    }
    .right {
        right: -1px;
        border-bottom-left-radius: 20px;
        border-top-left-radius: 20px;
    }
    .el-icon-arrow-left {
        margin-left: -8px;
    }
    .el-icon-arrow-right {
        margin-right: -8px;
    }
</style>