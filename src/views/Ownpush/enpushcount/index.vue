<template>
    <div class="page-root" ref="boxPane">
        <div class="abs-panel" ref="mainPane">
            <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
                <div class="true-height" ref="scrollPane">
                    <el-card class="box-card scroll-card push-cost target-part" shadow="never">
                      <div class="target_top">
                        <cost-count
                          :CostCount="CostCount"
                        ></cost-count>
                      </div>
                      <div class="target_box">
                        <div class="target_left">
                          <day-cost 
                            :DayData="DayData"
                          ></day-cost>
                        </div>
                        <div class="target_right">
                          <inquiry-line :InquiryData="InquiryData"></inquiry-line>
                        </div>
                      </div>
                    </el-card>
                </div>
            </div>
            <add-cost v-if="(menuButtonPermit.includes('Ownpush_pushtypeadd')||menuButtonPermit.includes('Ownpush_pushtypeedit'))" @costCountChange="initPage"></add-cost>
        </div>
    </div>
  </template>
  <script>
  import { mapGetters } from 'vuex';
  import CostCount from "./components/CostCount";
  import DayCost from "./components/DayCost";
  import InquiryLine from "./components/InquiryLine";
  export default {
    name: 'Ownpush_enpushcount',
    data() {
      return {
        breadcrumbList:[],
        menuButtonPermit:[],
        isSaveData:false,
        CostCount: {
          prevCost: 0,
          lastAvaCost: 0,
          monthAvaCost: 0,
          totalCost: 0,
        },
        DayData:{
          departArr:[],
          dayArr:[],
          monthArr:[],
          historyArr:[],
          targetArr:[],
          searchArr:[],
          unsearchArr:[]
        },
        InquiryData: {
          category: [],
          data: []
        }
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'menuData'
      ]),
    },
    components:{
      CostCount,
      DayCost,
      InquiryLine
    },
    mounted(){
        const $this = this;
        if(!$this.sidebar.opened){
          $this.$store.dispatch('app/toggleSideBar');
        }
    },
    created(){
      var $this = this;
      $this.initData();
    },
    methods:{
      // 初始化数据
      initData(){
        var $this = this;
        $this.getUserMenuButtonPermit();
      },
      // 初始化页面信息
      initPage(){
        var $this = this;
        $this.$store.dispatch('ownpush/cnChannelListAction', null).then(response=>{
          if(response){
            if(response.status){
              if(response.data.length>0){
                $this.tableData = response.data;
              }else{
                $this.tableData = [];
              }
              setTimeout(()=>{
                $this.isSaveData=false;
              },1000);
            }else{
              if(response.permitstatus&&response.permitstatus==2){
                $this.$message({
                  showClose: true,
                  message: "未被分配该页面访问权限",
                  type: 'error',
                  duration:6000
                });
                $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
              }else{
                $this.$message({
                  showClose: true,
                  message: response.info,
                  type: 'error'
                });
                setTimeout(()=>{
                  $this.isSaveData=false;
                },1000);
              }
            }
          }
        });
      },
      // 获取当前登陆用户在该页面的操作权限
      getUserMenuButtonPermit(){
        var $this = this;
        $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
          if(res.status){
            $this.initPage();
            // if(res.data.length>0){
            //   res.data.forEach(function(item,index){
            //     $this.menuButtonPermit.push(item.action_route);
            //   });
            //   if($this.menuButtonPermit.includes('Ownpush_pushtype')){
            //     $this.initPage();
            //   }else{
            //     $this.$message({
            //       showClose: true,
            //       message: "未被分配该页面的访问权限",
            //       type: 'error',
            //         duration:6000
            //     });
            //     $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            //   }
            // }else{
            //   $this.$message({
            //     showClose: true,
            //     message: "未被分配该页面的访问权限",
            //     type: 'error',
            //       duration:6000
            //   });
            //   $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            // }
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
        });
      },
    }
  }
  </script>
  <style lang="scss" scoped>
    .scroll-panel{
      padding: 10px;
    }
    .push-cost{
      .target_box{
        .target_left, .target_right{
          width: calc(50% - 5px);
        }
      }
    }
    @media (max-width: 1600px){
      .push-cost{
        .target_box{
          .target_left, .target_right{
            width: 100%;
          }
        }
      }
    }
  </style>
  