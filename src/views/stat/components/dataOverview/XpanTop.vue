<template>
  <div class="hxpage money-page">
    <div class="module-top">
      <div class="title-view">
        <div class="title">年度总奖金 TOP5</div>
        <div class="unit">（单位：元）</div>
        <router-link :to="{path:language == '中文'?'/stat/cn/memberAnalysis':'/stat/en/memberAnalysis'}" tag="a" target="_blank" class="more">详情 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></router-link>
      </div>
      <ul class="top-money" ref="topul" v-resize="setBarWidth">
        <li class="top-item" v-for="(item,index) in topdata" :key="index" @click="handleContrast(item.dept_id,item.uid)">      
            <router-link :to="{path: language == '中文'?'/stat/cn/memberAnalysis/singlePerson':'/stat/en/memberAnalysis/singlePerson',query:{deptId:item.dept_id,itemId:item.uid}}" tag="a" target="_blank">  
            <div class="rankNum">
                <div class="numTop" v-if="(index+1)<=3" :class="'numTop0'+(index+1)"></div>
                <div class="numTop" v-if="(index+1)>3">{{index+1}}</div>
            </div>
            <div class="userImg">
              <div v-if="item.headimg" class="headImg">
                <span><img :src="item.headimg" :alt="item.name" /></span>
              </div>
              <div v-else class="nopic"></div> 
            </div>
            <div class="userName">
              <span>{{item.name}}</span> 
            </div>
            <div class="userAward flex-content">
                <span v-if="index+1<=3" :class="'num0'+(index+1)"> 
                  {{item.allmoney}}元
                </span>
                <span v-else> 
                  {{item.allmoney}}元
                </span>
            </div>
            </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
    name:'demo',
    data(){
      return {
        topdata:[],
        barWidth:212,
      }
    },
    props:{
      language:{
        type:String,
        default:"中文"
      },
      moneytop5:{
        type:Array,
        default:function(){
          return []
        }
      }
    },
    watch:{
      moneytop5:{
        handler(val,oldval){
          this.setTopData(val);
        },
        deep:true
      }
    },
    mounted(){
      this.setBarWidth();
      window.addEventListener('resize',this.setBarWidth);
    },
    directives: {  // 使用局部注册指令的方式
      resize: { // 指令的名称
        bind(el, binding) { // el为绑定的元素，binding为绑定给指令的对象
          let width = '', height = '';
          function isReize() {
            const style = document.defaultView.getComputedStyle(el);
            if (width !== style.width || height !== style.height) {
              binding.value();  // 关键
            }
            width = style.width;
            height = style.height;
          }
          el.__vueSetInterval__ = setInterval(isReize, 300);
        },
        unbind(el) {
          clearInterval(el.__vueSetInterval__);
        }
      }
    },
    destroyed(){
      window.removeEventListener('resize',this.setBarWidth)
    },
    methods:{
      setTopData(val){
        let topdata = JSON.parse(JSON.stringify(val));
        let maxwidth = topdata[0].number;
       
        for(let i = 0;i<topdata.length;i++){
          topdata[i].width = parseFloat((topdata[i].number/maxwidth).toFixed(2))
        }
        this.topdata = topdata;
        
      },
      setBarWidth(){
        let topul = this.$refs["topul"].offsetWidth;
        this.barWidth = topul - 42 - 50 - 46;
      },
    }
}
</script>

<style scoped lang="scss">
</style>