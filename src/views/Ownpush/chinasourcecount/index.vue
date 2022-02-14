<template>
  <div class="page-root scroll-panel depart-index" ref="boxPane">  
      <div class="ChannelTab">
          <div class="ChannelMain flex-box">
                <span class="Channeltit">渠道：</span>
                <div class="ChannelItem">
                     <span class="ChannelItemTag" v-bind:class="item.isOn?'active':''" v-for="(item,index) in channelList" :key="index" v-on:click="groupChangeHandler(item.id)">{{item.name}}</span>
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
                    <i class="ChannelBtn" v-on:click="defaultSort">默认排序</i>
                </div>                
          </div>
      </div>
      <div class="flex-content OwnRank">
          <div class="OwnRankTop">
              <template v-if="sourceData.length>0" v-for="item in sourceData">
                <source-rank 
                  :itemData="item" 
                  :ByTime ="searchTime"
                  :YSort='true'
                  @fallSort='getfallSort'
                  ></source-rank>
              </template>
          </div>
      </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
import sourceRank from "../components/chinadepartcount/sourceRank.vue";
import {randomString,numSeparate,sortByDesc,rankingWithTotalItem,singleArrColor} from "@/utils/index";
export default {
  name: 'Ownpush_chinasourcecount',
  components: {
    sourceRank,
  },
  data() {
    return {
        menuButtonPermit:[],         //网页权限字段
        channelList:[],              //渠道数据
        searchData:{
          data:[],
          source_id:[],
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
        moneylist:[],
        priceAlist:[],
        priceBlist:[],
        priceClist:[],
        priceDlist:[],
        priceElist:[],
        scorelist:[],
        xunlist:[],
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
          if(permitData.includes('Ownpush_chinasourcecount')){
              $this.getChannelList()
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
    // 获取渠道列表
    getChannelList(){
      var $this = this;
      $this.$store.dispatch('ownpush/getOwnsourceAction', null).then(res=>{
        var channelList = [];
        var contrastSourceList = [];
        res.data.forEach(function(item,index){
          var itemData = {};
          itemData.id = item.id;
          itemData.name = item.name;
          itemData.disabled = false;
          itemData.isOn = false;
          channelList.push(itemData);
        });
        $this.channelList = JSON.parse(JSON.stringify(channelList));
        $this.getSearchData();
      });
    },
    ChannelData(dateArr,Tag){
      var $this=this;
      var channelList=$this.channelList;
      var itemArr=[];
      if($this.searchData.source_id&&$this.searchData.source_id.length>0){
        var newChannelList=[];
        $this.searchData.source_id.forEach(function(item,index){
          channelList.forEach(function(items,indexs){
            if(item==items.id){
              newChannelList.push(items);
            }
          });
        });
        newChannelList.forEach(function(item,index){
          var itemObj={}
          itemObj.id=item.id;
          itemObj.name=item.name;
          itemObj.value=0;
          dateArr.forEach(function(items,indexs){
            if(items.source_id==item.id){
              itemObj.value=items[Tag];
            }
          });
          itemArr.push(itemObj);
        });
      }else{
        channelList.forEach(function(item,index){
          var itemObj={}
          itemObj.id=item.id;
          itemObj.name=item.name;
          itemObj.value=0;
          dateArr.forEach(function(items,indexs){
            if(items.source_id==item.id){
              itemObj.value=items[Tag];
            }
          });
          itemArr.push(itemObj);
        });
      }
      itemArr=singleArrColor(itemArr);
      itemArr.sort(sortByDesc("value"));
      return itemArr;
    },
    // 渠道点击事件
    groupChangeHandler(id){
      var $this = this;
      var channelList = $this.channelList;
      var sourceID = [];
      channelList.forEach(function(item,index){
        if(item.id == id){
          item.isOn = !item.isOn;
        }
        if(item.isOn){
          sourceID.push(item.id);
        }
      });
      $this.searchData.source_id=sourceID;
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
        $this.channelList.forEach(function(item,index){
            item.isOn=false;
        });
        $this.searchData.source_id=[];
        $this.searchData.data=$this.getNearMonth();
        $this.getSearchData();
    },
    // 清空数据
    emptyData(){
        var $this=this;
    },
    //重组搜索数据
    initsearch(){
      var $this = this;
      var searchData={};
      if($this.searchData.source_id&&$this.searchData.source_id!=''){
        searchData.source_id=$this.searchData.source_id;
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
      $this.emptyData();
      $this.$store.dispatch('ownpush/getOwnChinasourcedefaultAction', searchData).then(res=>{
          if(res.status){
            var sourceData=[];
            //  消费
            $this.moneylist=$this.ChannelData(res.moneylist,'allmoney');
            var moneySource=rankingWithTotalItem($this.moneylist,'value');
            var moneyObj=$this.sourceRank(moneySource,'消费排行榜','元');
            sourceData.push(moneyObj);
            //  询盘
            $this.xunlist=$this.ChannelData(res.xunlist,'number');
            var xunSource=rankingWithTotalItem($this.xunlist,'value');
            var xunObj=$this.sourceRank(xunSource,'询盘排行榜','个');
            sourceData.push(xunObj);
            //  成交积分
            $this.scorelist=$this.ChannelData(res.scorelist,'score');
            var xunSource=rankingWithTotalItem($this.scorelist,'value');
            var scoreObj=$this.sourceRank(xunSource,'成交积分排行榜','分');
            sourceData.push(scoreObj);
            //  询盘均价
            var xunAvg=[];
            $this.moneylist.forEach(function(item,index){
                var itemObj={}
                itemObj.id=item.id;
                itemObj.color=item.color;
                itemObj.name=item.name;
                itemObj.value=0;
                $this.xunlist.forEach(function(items,indexs){
                    if(items.id==item.id){
                      if(item.value==0||items.value==0){
                        itemObj.value=0;
                      }else{
                        itemObj.value=(item.value/items.value).toFixed(2)*1;
                      }
                    }
                });
                xunAvg.push(itemObj);
            });
            xunAvg.sort(sortByDesc("value"));
            var xunAvgSource=rankingWithTotalItem(xunAvg,'value');
            var xunAvgObj=$this.sourceRank(xunAvgSource,'询盘均价排行榜','元');
            sourceData.push(xunAvgObj);
            //  成交积分均价
            var scoreAvg=[];
            $this.moneylist.forEach(function(item,index){
                var itemObj={}
                itemObj.id=item.id;
                itemObj.color=item.color;
                itemObj.name=item.name;
                itemObj.value=0;
                $this.scorelist.forEach(function(items,indexs){
                    if(items.id==item.id){
                      if(item.value==0||items.value==0){
                        itemObj.value=0;
                      }else{
                        itemObj.value=(item.value/items.value).toFixed(2)*1;
                      }
                    }
                });
                scoreAvg.push(itemObj);
            });
            scoreAvg.sort(sortByDesc("value"));
            var scoreAvgSource=rankingWithTotalItem(scoreAvg,'value');
            var scoreAvgObj=$this.sourceRank(scoreAvgSource,'成交积分均价排行榜','元');
            sourceData.push(scoreAvgObj);
            //  积分询盘比
            var scoreAndxun=[];
            $this.scorelist.forEach(function(item,index){
                var itemObj={}
                itemObj.id=item.id;
                itemObj.color=item.color;
                itemObj.name=item.name;
                itemObj.value=0;
                $this.xunlist.forEach(function(items,indexs){
                    if(items.id==item.id){
                      if(item.value==0||items.value==0){
                        itemObj.value=0;
                      }else{
                        itemObj.value=(item.value/items.value).toFixed(2)*1;
                      }
                    }
                });
                scoreAndxun.push(itemObj);
            });
            scoreAndxun.sort(sortByDesc("value"));
            var scoreAndxunSource=rankingWithTotalItem(scoreAndxun,'value');
            var scoreAndxunObj=$this.sourceRank(scoreAndxunSource,'积分询盘比排行榜','');
            sourceData.push(scoreAndxunObj);
            //  等级
            //A
            $this.priceAlist=$this.ChannelData(res.priceAlist,'number');
            var priceASource=rankingWithTotalItem($this.priceAlist,'value');
            var priceAObj=$this.sourceRank(priceASource,'成交等级A','个');
            sourceData.push(priceAObj);
            //B
            $this.priceBlist=$this.ChannelData(res.priceBlist,'number');
            var priceBSource=rankingWithTotalItem($this.priceBlist,'value');
            var priceBObj=$this.sourceRank(priceBSource,'成交等级B','个');
            sourceData.push(priceBObj);
            //C
            $this.priceClist=$this.ChannelData(res.priceClist,'number');
            var priceCSource=rankingWithTotalItem($this.priceClist,'value');
            var priceCObj=$this.sourceRank(priceCSource,'成交等级C','个');
            sourceData.push(priceCObj);
            //D
            $this.priceDlist=$this.ChannelData(res.priceDlist,'number');
            var priceDSource=rankingWithTotalItem($this.priceDlist,'value');
            var priceDObj=$this.sourceRank(priceDSource,'成交等级D','个');
            sourceData.push(priceDObj);
            //E
            $this.priceElist=$this.ChannelData(res.priceElist,'number');
            var priceESource=rankingWithTotalItem($this.priceElist,'value');
            var priceEObj=$this.sourceRank(priceESource,'成交等级E','个');
            sourceData.push(priceEObj);            
            $this.sourceData=sourceData;
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
    sourceRank(dateArr,Name,Tag,isLevel){
      var itemObj={};
      itemObj.mainArr=dateArr;
      itemObj.name=Name;
      itemObj.unit=Tag;
      itemObj.randomStr = randomString(4);
      if(Name.indexOf('询盘均价排行榜')>=0){
        itemObj.isavg='消费/询盘';
      }else if(Name.indexOf('成交积分均价排行榜')>=0){
        itemObj.isavg='消费/成交积分';
      }else if(Name.indexOf('积分询盘比排行榜')>=0){
        itemObj.isavg='成交积分/询盘';
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
    getfallSort(dateArr){
      var $this=this;
      var sourceData=$this.sourceData;
      var defaultArr=[];
      sourceData.forEach(function(item,index){
          if(item.name==dateArr){
            defaultArr=item.mainArr;
          }
      });
      sourceData.forEach(function(item,index){
          if(item.name!=dateArr){
              var itemArr=[];
              defaultArr.forEach(function(items,indexs){
                  item.mainArr.forEach(function(itemk,indexk){
                      if(itemk.id==items.id){
                        itemArr.push(itemk);
                      }
                  });
              });
              item.mainArr=itemArr;
              $this.sourceData=sourceData;
          }
      });
    },
    defaultSort(){
      var $this=this;
      $this.getSearchData();
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



