<template>
    <div class="welcome_page">
        <div class="welcome_text">
            <div class="timeCounter">
                <div class="timetitle">倒计时</div>
                <FlipDown :endDate="finishTime"
                        @timeUp="commitTimeEnd"
                        :type="4" :theme="1" 
                        :timeUnit="['天','时','分','秒']" 
                        class="flip-down"
                />
            </div>
            <div class="aimBox">
                <div class="aimNumber">
                    <div class="aimnum">
                        {{aimnumber}}<span>分</span>
                    </div>
                </div>
                <div class="nowNumber" :style="'left:'+numper">{{nownumber}}<span>分</span></div>
            </div>
            <div class="airBox">
                <div class="air01"></div>
                <div class="air02"></div>
                <p class="airtext">恭喜你离目标又近了一天！</p>
                <div class="airBtn"></div>
            </div>
        </div>
    </div>
</template>
<script>
import FlipDown from './FlipDown.vue';
export default {
    name: "welcome",
    data() {
        return {
            finishTime: 0,
            aimnumber:320,
            nownumber:33.5,
        };
    },
    components:{
        FlipDown
    },
    computed:{
        numper(){
            var $this = this;
            return ($this.nownumber/$this.aimnumber)*100+"%"
        }
    },
    created() {
        var $this = this;
        $this.finishTime = new Date().getTime() + 3600*24*2*1000;
    },

    methods: {
        // 计时结束
        commitTimeEnd(){

        }
    }
}
</script>