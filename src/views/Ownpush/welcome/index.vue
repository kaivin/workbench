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
                <div class="airBtn" @click="btnClick"><span class="light"></span></div>
            </div>
        </div>
    </div>
</template>
<script>
import { getChScore,getEnScore } from '@/api/ownaim';
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
            if($this.status == 1){
                getChScore().then(response=>{
                    $this.funchtargetPlug(response);
                });
            }else{
                getEnScore().then(response=>{
                    $this.funchtargetPlug(response);
                });
            }
        },
        funchtargetPlug(arrData){
            var $this = this;
            if(arrData.status){
                $this.hasscore = arrData.hasscore;
                $this.targetscore = arrData.targetscore;
                var leftday = arrData.timeday;
                var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
                $this.finishTime = leftday*24*60*60*1000 + timeStamp;
            }else{
                $this.$message({
                    showClose: true,
                    message: arrData.info,
                    type: 'error'
                });
            }
        },
        // 计时结束
        commitTimeEnd(){
            
        },
        btnClick(){
            var $this = this;
            $this.ismove = true;
            setTimeout(() => {
                $this.$router.push("/Home/index");
            }, 2000);
        }
    }
}
</script>