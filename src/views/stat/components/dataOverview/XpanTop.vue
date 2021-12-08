<template>
  <div class="hxpage minHxpage">
    <div class="module-top">
      <div class="title-view">
        <div class="title">年度总奖金 TOP5</div>
        <div class="unit">（单位：元）</div>
        <div class="more" @click="goPage">更多分析 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></div>
      </div>
      <ul class="top-view" ref="topul" v-resize="setBarWidth">
        <li class="top-item" v-for="(item,index) in topdata" :key="index" @click="handleContrast(item.dept_id,item.uid)">        
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
      goPage(){
        if(this.language == '中文'){
          this.$router.push('/stat/cn/memberAnalysis')
        }else{
          this.$router.push('/stat/en/memberAnalysis')
        }
      },
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
      // 跳转到个人详情
      handleContrast(deptId,itemId){
        var $this=this;
        if($this.language == '中文'){
          var routeUrl =  $this.$router.resolve({path: "/stat/cn/memberAnalysis/singlePerson",query:{deptId:deptId,itemId:itemId}});
        }else{
          var routeUrl =  $this.$router.resolve({path: "/stat/en/memberAnalysis/singlePerson",query:{deptId:deptId,itemId:itemId}});
        }
        window.open(routeUrl.href,'_blank');
      },
    }
}
</script>

<style scoped lang="scss">
.hxpage{
    background: #fff;
    min-height: 306px;
    .module-top{
      padding:0;
      
    }
    .title-view{
      line-height:16px;
      margin-bottom:12px;
      padding:22px 28px 0px 28px;
      .title{
        font-size: 14px;
        color: #1a1a1a;
        float: left;
        margin-right: 4px;
        font-weight: bold;
      }
      .unit{
        font-size: 12px;
        color: #a1a1a1;
        float: left;
      }
      .more{
        font-size: 12px;
        color: #a1a1a1;
        float: right;
        cursor: pointer;
        position: relative;
        top: -1px;
        .svg-i{
          font-size: 10px;
          color: #a1a1a1;
          vertical-align: 1px;
        }
      }
    }
    .contrast-view{
      height: 40px;
      margin-bottom: 15px;
      .redtext{
        float: left;
        font-size: 26px;
        color: #eb3737;
        font-weight: bold;
        margin-right: 15px;
      }
      .redright{
        float: left;
        .conname{
          font-size: 12px;
          line-height: 20px;
          color: #999999;
        }
        .num{
          font-size: 12px;
          line-height: 20px;
          padding-left: 12px;
          position: relative;
        }
        .up{
          color: #f25e5e;
          &:before{
            content: '↑';
            position: absolute;
            left: 0;
            font-size: 12px;
            line-height: 12px;
            top: 3px;
            
          }
        }
        .down{
          color: #2dbb4c;
          &:before{
            content: '↓';
            position: absolute;
            left: 0;
            font-size: 12px;
            line-height: 12px;
            top: 3px;
            
          }
        }
      }
    }
    .chart-top{
      height: 68px;
    }
    .module-bottom{
      padding: 20px 30px;
    }
    .chart-bottom{
      height: 260px;
      margin-top: 35px;
    }
    .top-view{
      .top-item{
            padding:10px 35px 10px 20px;
            display: flex;
            flex-direction: row;
            align-items: center;
            border-top: 1px solid #f5f5f5;
            cursor: pointer;
            &:first-child{border-top:0px;}
            .rankNum{
                width:30px;
                height:30px;
                text-align: center;
                line-height:30px;
                font-family:Impact;
                .numTop{
                    width:30px;
                    height:30px;
                    line-height:30px;
                    font-size:24px;
                    color:#b9b9b9;
                    &.numTop01{
                        background: url(../../../../assets/personal_AwardIcon01.png) center center no-repeat;
                        background-size:18px auto;
                    }
                    &.numTop02{
                        background: url(../../../../assets/personal_AwardIcon02.png) center center no-repeat;
                        background-size:18px auto;
                    }
                    &.numTop03{
                        background: url(../../../../assets/personal_AwardIcon03.png) center center no-repeat;
                        background-size:18px auto;
                    }
                }
            }
            .userImg{
                padding-left:38px;
                width:95px;
                .headImg{
                    width:30px;
                    height:30px;
                    overflow: hidden;
                    position: relative;
                    span{
                        clear: both;
                        display: block;
                        overflow: hidden;
                        width: 100%;
                        height: 100%;
                        border-radius: 4px;
                        position: relative;
                        margin: 0 auto;
                        img{
                            width: 100%;
                            position: absolute;
                            left: 0px;
                            top: 0%;
                            -o-object-fit: cover;
                            object-fit: cover;
                            transition: all 0.5s;
                        }
                    }
                }
                .nopic{
                    width:30px;
                    height:30px;
                    overflow: hidden;
                    border-radius: 4px;
                    position: relative;
                    cursor: pointer;
                    background: url(../../../../assets/default_pic.jpg) center center no-repeat;
                    background-size:100%;
                }    
            }
            .userName{
                color: #111111;
                font-size: 14px;
                .dept{
                    color:#666;
                }
            }
            .userAward{
                color: #333333;
                font-size: 13px;
                text-align: right;
                .num01{
                    background-image: linear-gradient(90deg,#f9c020 0%,#f83801 60%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: transparent;
                    font-weight: bold;
                }
                .num02{
                    background-image: linear-gradient(90deg,#92acc7 0%,#315c88 60%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: transparent;
                    font-weight: bold;
                }
                .num03{
                    background-image: linear-gradient(90deg,#ad6d2d 40%,#f5c166 100%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: transparent;
                    font-weight: bold;
                }
            }
      }
    }
}
</style>