<template>
    <div class="page-root scroll-panel depart-index" ref="boxPane">  
        <div class="ChannelTab">
            <div class="ChannelMain flex-box">
                  <span class="Channeltit">部门：</span>
                  <div class="ChannelItem">
                      <span class="ChannelItemTag" v-bind:class="searchData.depart_id == '' ?'active':''"  v-on:click="allItemCheck">全部</span>
                      <span class="ChannelItemTag" v-bind:class="item.isOn?'active':''" v-for="(item,index) in departList" :key="index" v-on:click="groupChangeHandler(item.id)">{{item.name}}</span>
                      <span class="Channeltit" style="margin-left:20px">时间选择：</span>                     
                      <el-date-picker
                        v-model="searchData.data"
                        @change="handleData"
                        type="monthrange"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        key="b"
                        size="mini"
                        class="date-range"
                        range-separator="～"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerMonthRangeOptions">
                      </el-date-picker>
                      <i class="ChannelBtn" v-on:click="ChannelBtn">重置</i>
                  </div>                
            </div>
        </div>
        <div class="flex-content OwnRank">
            <div class="OwnRankTop">
                <template v-if="sourceData.length>0" v-for="(item,index) in sourceData">
                  <source-rank 
                    :itemData="item" 
                    :ByTime ="searchTime"
                    :YSort='true'
                     v-if="index>=0&&index<3"
                    @fallSort='getfallSort'
                    @changeSet='changeSet'
                    ></source-rank>
                </template>
            </div>
        </div>
    </div>
  </template>
  <script>
  import {mapGetters} from 'vuex';
  import sourceRank from "../components/chinasourcedefault/sourceRank.vue";
  import {randomString,numSeparate,sortByDesc,rankingWithTotalItem,singleArrColor} from "@/utils/index";
  export default {
    name: 'Fivedepart_chinasourcedefault',
    components: {
      sourceRank,
    },
    data() {
      return {
          menuButtonPermit:[],         //网页权限字段
          departList:[],              //渠道数据
          searchData:{
            data:[],
            depart_id:'',
          },
          searchTime: '',
          pickerMonthRangeOptions: {
            shortcuts: [{
              text: '今年至今',
              onClick(picker) {
                const end = new Date();
                const start = new Date(new Date().getFullYear(), 0);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近六个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - 6);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
          sourceData:[],
          scorelist:[],
          allscore: 0
      };
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'menuData'
      ]),
    },
    created() {
      var $this = this;
      $this.searchData.data=$this.getNearMonth();
      $this.getUserMenuButtonPermit();
    },
    mounted(){
      const $this = this;
      if(!$this.sidebar.opened){
        $this.$store.dispatch('app/toggleSideBar');
      }  
    },
    methods: {
      // 判断浏览器类型
      getBrowserType(){
        var ua =  navigator.userAgent;
        if(ua){
          if(ua.indexOf('Mobile')!=-1){
            this.scrollPosition.isPC = false;
          }else{
            this.scrollPosition.isPC = true;
          }
        }else{
          this.scrollPosition.isPC = true;
        }
      },
      // 获取当前登陆用户在该页面的操作权限
      getUserMenuButtonPermit(){
        var $this = this;
        $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
          if(res.data.length>0){
            var permitData = [];
            res.data.forEach(function(item,index){
              permitData.push(item.action_route);
            });
            if(permitData.includes('Fivedepart_chinasourcedefault')){
                $this.getDepartList()
            }else{
              $this.$message({
                showClose: true,
                message: "未被分配该页面的访问权限",
                type: 'error',
                  duration:6000
              });
              $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            }
          }else{
            $this.$message({
              showClose: true,
              message: "未被分配该页面的访问权限",
              type: 'error',
                duration:6000
            });
            $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
          }
        });
      },
      // 获取部门列表
      getDepartList(){
        var $this = this;
        $this.$store.dispatch('depfive/depfiveConditionAction', null).then(res=>{
          var departList = [];
          if(res.depart && res.depart.length > 0){
            res.depart.forEach(function(item,index){
              var itemData = {};
              itemData.id = item.id;
              itemData.name = item.name;
              itemData.disabled = false;
              itemData.isOn = false;
              departList.push(itemData);
            });        
          }
          $this.departList = JSON.parse(JSON.stringify(departList));
          $this.getSearchData();
        });
      },
      // 结果处理
      departDataRes(dataArr, Tag){
        dataArr.forEach(function(item,index){
          item.emptyDivisor=false;
          item.value= item[Tag];
        });
        var itemArr=singleArrColor(dataArr);
        itemArr.sort(sortByDesc("value"));
        return itemArr;
      },
      // 部门点击事件
      groupChangeHandler(id){
        var $this = this;
        var departList = $this.departList;
        var departID = '';
        departList.forEach(function(item,index){
          
          if(item.id == id){
            item.isOn = !item.isOn;
          }else{
            item.isOn = false;
          }
          if(item.isOn){
            departID = item.id;
          }
        });
        $this.searchData.depart_id = departID;
        $this.getSearchData();
      },
      allItemCheck(){
        var $this = this;
        $this.departList.forEach(function(item,index){
            item.isOn = false;
        });
        $this.searchData.depart_id = "";
        $this.getSearchData();
      },
      //点击时间搜索
      handleData(){
        var $this=this;
        $this.getSearchData();
      },
      // 重置搜索数据
      ChannelBtn(){
          var $this=this;
          $this.departList.forEach(function(item,index){
              item.isOn=false;
          });
          $this.searchData.depart_id='';
          $this.searchData.data=$this.getNearMonth();
          $this.getSearchData();
      },
      //重组搜索数据
      initsearch(){
        var $this = this;
        var searchData={};
        if($this.searchData.depart_id&&$this.searchData.depart_id!=''){
          searchData.depart_id=$this.searchData.depart_id;
        }
        if($this.searchData.data&&$this.searchData.data.length>0){
          searchData.starttime=$this.searchData.data[0];
          searchData.endtime=$this.searchData.data[1];
          $this.searchTime=$this.searchData.data[0]+' ~ '+$this.searchData.data[1];
        }else{
            $this.searchTime='';
        }
        return searchData;
      },
      getSearchData(){
        var $this = this;
        var searchData={};
        searchData=$this.initsearch();
        $this.$store.dispatch('depfive/depfiveSourceDataAction', searchData).then(res=>{
            if(res.status){
              var sourceData=[];
              $this.allscore = res.allscore;
              //  成交积分
              if(res.scorelist && res.scorelist.length > 0){
                var scorelist=$this.departDataRes(res.scorelist,'score');
                var scoreSource=rankingWithTotalItem(scorelist,'value');
                scoreSource.forEach(function(item){
                  item.number = numSeparate(item.value);
                });
                $this.scorelist=scoreSource;
                var scoreObj=$this.sourceRank(scoreSource,'成交积分排行榜','分', res.allscore);
                sourceData.push(scoreObj);       
                $this.sourceData=sourceData;
              }
            }else{
              $this.$message({
                showClose: true,
                message: res.info,
                type: 'error',
                duration:6000
              });
            }
        });
      },
 
      sourceRank(dateArr,Name,Tag, allscore){
        var itemObj={};
        itemObj.mainArr=dateArr;
        itemObj.name=Name;
        itemObj.unit=Tag;
        itemObj.allscore = allscore;
        var total = dateArr.reduce((prev,next) => {
          return prev + Number(next.value)
        },0)
        itemObj.totalNum = total.toFixed(1) + Tag;
        if(dateArr.length>8){
          itemObj.ifFold=true;
          itemObj.boxHeight='504px';
        }else{
          itemObj.ifFold=false;
          itemObj.boxHeight=dateArr.length*63+'px';
        }
        itemObj.isFold=false;
        itemObj.randomStr = randomString(4);
        if(Name.indexOf('询盘均价排行榜')>=0){
          itemObj.isavg='消费/询盘';
        }else if(Name.indexOf('成交积分均价排行榜')>=0){
          itemObj.isavg='消费/成交积分';
        }else if(Name.indexOf('积分询盘比排行榜')>=0){
          itemObj.isavg='询盘/成交积分';
        }else{
          itemObj.isavg=''
        }
        if(Name.indexOf('等级')>=0){
          itemObj.isLevel=true;
        }else{
          itemObj.isLevel=false;
        }
        return itemObj;
      },
      // 展开折叠点击事件
      changeSet(isfold,boxheight,Tag){
        var $this = this;
        var sourceData=$this.sourceData;
        sourceData.forEach(function(item,index){
            if(item.name==Tag){
              item.boxHeight=boxheight;
              item.isFold=isfold;
            }
        });
        $this.sourceData=sourceData;
      },
      //点击排序
      getfallSort(dateArr){
        var $this=this;
        if(dateArr=='成交积分排行榜'){
          $this.getfallSortPlug($this.scorelist,dateArr);
        }
      },
      getfallSortPlug(dateArr,Tag){
        var $this=this;
        var sourceData=$this.sourceData;
        sourceData.forEach(function(item,index){
            var itemArr=[];
            dateArr.forEach(function(items,indexs){
                item.mainArr.forEach(function(itemk,indexk){
                    if(itemk.id==items.id){
                      itemArr.push(itemk);
                    }
                });
            });
            item.mainArr=itemArr;
        });
        $this.sourceData=sourceData;
      },
      // 最近六个月时间周期
      getNearMonth(){
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 5);
        var startYear = start.getFullYear();
        var startMonth = start.getMonth() +1;
        var endYear = end.getFullYear();
        var endMonth = end.getMonth() + 1;
        startMonth = startMonth<10?'0'+startMonth:startMonth;
        endMonth = endMonth<10?'0'+endMonth:endMonth;
        var startDate = startYear+"-"+startMonth;
        var endDate = endYear+"-"+endMonth;
        return [startDate,endDate];
      }
    }
  }
</script>
<style scoped lang="scss">
.depart-index .ChannelTab .ChannelMain .Channeltit{
  width:auto;
}
</style>