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
                        <div class="numtext">
                            {{targetscore}}<span>分</span>
                        </div>
                    </div>
                    <div class="nowNumber" :style="'left:'+numper" :class="hasscore/targetscore > 0.87 ? 'nownumbtm':''">
                        <div class="numtext">
                            {{hasscore}}<span>分</span>
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="airBox">
                <div class="air01" :class="ismove?'air01active':''"></div>
                <div class="air02" :class="ismove?'air02active':''"></div>
                <p class="airtext">恭喜你离目标又近了一天！</p>
                <div class="airBtn" @click="btnClick"></div>
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
            hasscore: 0,
            targetscore: 320,
            finishTime: 0,
            ismove: false,
            status: 0,
        };
    },
    components:{
        FlipDown
    },
    computed:{
        numper(){
            var $this = this;
            return ($this.hasscore/$this.targetscore)*100+"%"
        }
    },
    created() {
        var $this = this;
        $this.status = $this.$route.query.status;
        $this.getchtarget();
    },
    methods: {
        getchtarget(){
            var $this = this;
            var pathUrl = "";
            if($this.status == 1){
                 pathUrl = "ownaim/getChScore";
            }else{
                 pathUrl = "ownaim/getEnScore";
            }
            $this.$store.dispatch(pathUrl).then(response=>{
                if(response.status){
                    $this.hasscore = response.hasscore;
                    $this.targetscore = response.targetscore;
                    var leftday = response.timeday;
                    var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
                    $this.finishTime = leftday*24*60*60*1000 + timeStamp;
                }else{
                    $this.$message({
                        showClose: true,
                        message: response.info,
                        type: 'error'
                    });
                }
            });
        },
        // 计时结束
        commitTimeEnd(){
            
        },
        btnClick(){
            var $this = this;
            $this.ismove = true;
            setTimeout(() => {
                $this.$router.push("/Home/index");
            }, 3000);
        }
    }
}
</script>