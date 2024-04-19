<template>
    <div class="page-root scroll-panel group-index" ref="boxPane"> 
        <p class="breadcrumb" ref="breadcrumbPane">
            <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
            <template v-for="item in breadcrumbList">
            <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
            <span v-else class="breadcrumb-link" v-bind:key="'last-' + item.id"><b>-</b><span>{{item.title}}</span></span>
            </template>
        </p>
        <div class="chart_main">
          <el-tabs v-model="nowChart" type="card" @tab-click="tabChange">
            <el-tab-pane label="详细" name="1">
              <div class="filter-panel" ref="filterbox">
                  <div class="filter-list">
                      <div class="item-search flex-box">
                          <div class="filter-title"><span class="txt-title">日期：</span></div>
                          <div class="item-list">
                            <el-date-picker
                                v-model="searchData.time"
                                type="daterange"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                key="a"
                                size="small"
                                class="date-range"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                >
                            </el-date-picker>
                          </div>
                      </div>
                      <div class="item-filter flex-box group">
                          <div class="filter-title"><span class="txt-title">人员：</span></div>
                          <div class="filter-content flex-content">
                              <div class="checked_item">
                                  <el-checkbox
                                  v-model="checkAll"
                                  :indeterminate="isIndeterminate"
                                  @change="handleCheckAllChange"
                                  ><span class="c_tit">全选</span>
                                  </el-checkbox>
                                  <el-checkbox-group
                                  v-model="searchData.name"
                                  @change="handleCheckedChange"
                                  >
                                      <el-checkbox
                                      v-for="item in userList"
                                      :key="item.id"
                                      :label="item.name"
                                      :value="item.name"
                                      >
                                      <span class="c_tit">{{item.name}}</span>
                                      </el-checkbox>
                                  </el-checkbox-group>
                              </div>
                          </div>
                      </div>
                      <div class="item-search item-btn">
                          <div class="filter-title" style="opacity: 0; visibility: hidden;"><span class="txt-title">人员：</span></div>
                          <el-button class="search_btn" type="primary" :disabled="isSearchData" @click="getCountData">查询</el-button>
                          <el-button type="info" class="reset_btn" v-on:click="resetColumnData()">重置</el-button>
                      </div>
                  </div>
              </div>
              <div class="chartShow result-panel">
                  <!-- <div class="item-change">
                      <div class="item-font" :class="nowChart == 1?'active':''" @click="tabChange(1)">详细</div>
                      <div class="item-font" :class="nowChart == 2?'active':''" @click="tabChange(2)">占比</div>
                  </div> -->
                  <div class="chart_item">
                      <div class="search" v-if="isSearchData"><p>请稍候...</p></div>
                      <ColumnChart :chartData="chartData"></ColumnChart>
                  </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="占比" name="2">
              <div class="filter-panel" ref="filterbox">
                  <div class="filter-list">
                      <div class="item-search flex-box">
                          <div class="filter-title"><span class="txt-title">日期：</span></div>
                          <div class="item-list">
                            <el-date-picker
                                v-model="searchData.time"
                                type="daterange"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                key="a"
                                size="small"
                                class="date-range"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                >
                            </el-date-picker>
                          </div>
                          <div class="filter-title" style="margin-left: 50px"><span class="txt-title">岗位：</span></div>
                          <div class="item-list">
                            <el-select v-model="pieSearch.post_id" placeholder="请选择">
                                <el-option v-for="item in isGetPost" :disabled="item.disabled" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                          </div>
                      </div>
                      <div class="item-filter flex-box group">
                          <div class="filter-title"><span class="txt-title">人员：</span></div>
                          <div class="filter-content flex-content">
                              <div class="checked_item">
                                  <el-radio-group
                                  v-model="pieSearch.name"
                                  >
                                      <el-radio
                                      v-for="item in userList"
                                      :key="item.id"
                                      :label="item.name"
                                      :value="item.name"
                                      >
                                      <span class="c_tit">{{item.name}}</span>
                                      </el-radio>
                                  </el-radio-group>
                              </div>
                          </div>
                      </div>
                      <div class="item-search item-btn">
                          <div class="filter-title" style="opacity: 0; visibility: hidden;"><span class="txt-title">人员：</span></div>
                          <el-button class="search_btn" type="primary" :disabled="isSearchData" @click="getPieData">查询</el-button>
                          <el-button type="info" class="reset_btn" v-on:click="resetPieData()">重置</el-button>
                      </div>
                  </div>
              </div>
              <div class="chartShow result-panel">
                  <div class="chart_item">
                      <div class="search" v-if="isSearchData"><p>请稍候...</p></div>
                      <div class="pie_list">
                        <div class="pie_item">
                          <div id="pieChart"></div>
                        </div>
                      </div>
                  </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
    </div>
  </template>
  <script>
  import {mapGetters} from 'vuex';
  import ColumnChart from '../component/columnChart.vue';
  export default {
    name: 'videocount_index',
    data() {
      return {
          menuButtonPermit:[],         //网页权限字段
          searchData:{
            name:[],
            time: []
          },
          pieSearch:{
            time: [],
            name: "",
            post_id: ""
          },
          showChart: false,
          isIndeterminate: false,
          checkAll: false,
          isSearchData: false,
          pickerDateRangeOptions: this.$pickerRangeOptions,
          userList: [],
          typeList: [],
          nowChart: "1",
          chartData: {},
          isSearchColumn: false,
          isSearchPie: false,
          isGetPost: false,
      };
    },
    components: {
      ColumnChart,
      
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'menuData'
      ]),
      isOpen() {
        return this.sidebar.opened;
      },
    },
    created() {
      var $this = this;
      $this.getBreadcrumbList();
      $this.initData();
    },
    mounted(){
      const $this = this;
      window.addEventListener('resize',$this.echartsSize);
    },
    destroyed(){
      const $this = this;
      window.removeEventListener('resize', $this.echartsSize);
    },
    methods: {
      // 获取面包屑路径
      getBreadcrumbList(){
        var $this = this;
        var breadcrumbList = [];
        var currentID = ""+$this.$router.currentRoute.meta.id;
        var pageID = 0;
        if(currentID.indexOf('-')!=-1){
          pageID = parseInt(currentID.split("-")[1]);
        }else{
          pageID = parseInt(currentID);
        }
        $this.menuData.forEach(function(item,index){
          if(item.meta.id == pageID){
            var itemData = {};
            itemData.id = item.meta.id;
            itemData.router = item.path;
            itemData.title = item.meta.title;
            breadcrumbList.push(itemData);
          }else{
            if(item.children.length>0){
              item.children.forEach(function(item1,index1){
                if(item1.meta.id == pageID){
                  var itemData = {};
                  itemData.id = item.meta.id;
                  itemData.router = item.path;
                  itemData.title = item.meta.title;
                  breadcrumbList.push(itemData);
                  var itemData2 = {};
                  itemData2.id = item1.meta.id;
                  itemData2.router = item1.path;
                  itemData2.title = item1.meta.title;
                  breadcrumbList.push(itemData2);
                }else{
                  if(item1.children.length>0){
                    item1.children.forEach(function(item2,index2){
                      if(item2.meta.id == pageID){
                        var itemData = {};
                        itemData.id = item.meta.id;
                        itemData.router = item.path;
                        itemData.title = item.meta.title;
                        breadcrumbList.push(itemData);
                        var itemData2 = {};
                        itemData2.id = item1.meta.id;
                        itemData2.router = item1.path;
                        itemData2.title = item1.meta.title;
                        breadcrumbList.push(itemData2);
                        var itemData3 = {};
                        itemData3.id = item2.meta.id;
                        itemData3.router = item2.path;
                        itemData3.title = item2.meta.title;
                        breadcrumbList.push(itemData3);
                      }
                    });
                  }
                }
              });
            }
          }
        });
        $this.breadcrumbList = breadcrumbList;
      },
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
            if(permitData.includes('videocount_index')){
              $this.searchData.time = $this.getDefaultTime();
              $this.pieSearch.time = $this.getDefaultTime();
              $this.getUserList();
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
      // 初始化数据
      initData(){
        var $this = this;
        $this.getUserMenuButtonPermit();
      },
      // 获取用户
      getUserList(){
        var $this = this;
        $this.$store.dispatch('videocount/userListData',null).then(res=>{
            if(res.code == 200){
                var resData = [];
                if(res.data && res.data.length > 0){
                    resData = res.data;
                }
                $this.userList = resData;
                $this.getCountData();
            }else{
                $this.$message({
                    showClose: true,
                    message: res.msg,
                    type: 'error'
                });
            }
        });
      },
      getPostList(){
        var $this = this;
        $this.$store.dispatch('videocount/getVideoPostData',null).then(res=>{
          if(res.code == 200){
            var resData = [];
            if(res.data && res.data.length > 0){
                res.data.forEach(item => {
                    var obj = {};
                    obj.label = item.name;
                    obj.value = item.id;
                    obj.disabled = false;
                    resData.push(obj);
                })
            }
            $this.isGetPost = true;
				  }else{
            $this.$message({
                showClose: true,
                message: res.msg,
                type: 'error'
            });
          }
			  });
		  },
      // 点击选中
      handleCheckedChange(e){
        var $this = this;
        var checkedCount = e.length;
        if(checkedCount === $this.userList.length){
          $this.checkAll = true;
        }else{
          $this.checkAll = false;
        }
        if(checkedCount>0&&checkedCount<$this.userList.length){
          $this.isIndeterminate = true;
        }else{
          $this.isIndeterminate = false;
        }
      },
      // 全选
      handleCheckAllChange(e){
        var $this = this;
        var checkedList = [];
        if(e){
          $this.userList.forEach((item) =>{
            checkedList.push(item.name);
          })
          $this.searchData.name = checkedList;
          $this.checkAll= true;
        }else{
          $this.searchData.name = [];
          $this.checkAll= false;
        }
        $this.isIndeterminate = false;
      },
      // 获取统计数据
      getCountData(){
        var $this = this;
        if(!$this.isSearchData){
          var formData = {};
          formData.name = $this.searchData.name;
          formData.time = $this.searchData.time.join(" - ");
          $this.isSearchData = true;
          $this.$store.dispatch('videocount/getVideoCountData', formData).then(response=>{
            if(response){
              $this.isSearchData = false;
              $this.chartData = {}
              if(response.code == 200){
                if(response.data){
                  if(response.data.day_word_data.length > 0){
                    var resList = response.data.day_word_data;
                    resList = resList.sort($this.sortByAsc("day"));
                    $this.handleChartData(resList);
                  }
                }
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
                    message: response.msg,
                    type: 'error'
                  });
                  setTimeout(()=>{
                    $this.isSearchResult=false;
                    $this.isSaveData=false;
                  },1000);
                }
              }
            }
          });
        }
      },
      // 获取饼图数据
      getPieData(){
        var $this = this;
        if(!$this.isSearchData){
          var formData = {};
          formData.name = $this.pieSearch.name;
          formData.time = $this.pieSearch.time.join(" - ");
          formData.post_id = $this.pieSearch.post_id;
          $this.isSearchData = true;
          $this.$store.dispatch('videocount/getVideoCountData', formData).then(response=>{
            if(response){
              $this.isSearchData = false;
              $this.chartData = {}
              if(response.code == 200){
                if(response.data){
                  if(response.data.day_word_data.length > 0){
                    var resList = response.data.day_word_data;
                    resList = resList.sort($this.sortByAsc("day"));
                    $this.handlePieData(resList);
                  }
                }
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
                    message: response.msg,
                    type: 'error'
                  });
                  setTimeout(()=>{
                    $this.isSearchResult=false;
                    $this.isSaveData=false;
                  },1000);
                }
              }
            }
          });
        }
      },
      handleChartData(data){
        var $this = this;
        var c_name = [];
        var c_data = [];
        var c_user = [];
        var all_truescore = [];
        var all_sepscore = [];
        var all_percent = [];
        data.forEach((item,index) => {
          c_name.push(item.day);
          if(item.user_data && item.user_data.length > 0){
            item.user_data.forEach((sitem, sindex) => {
              if(index == 0){
                var truescore = [];
                var sepscore = [];
                var percent = [];
                c_user.push(sitem.name);
                for(var i = 0; i < data.length;i++){
                  var trueobj = {};
                  var result = data[i].user_data[sindex];
                  trueobj.value = result.data.user_effective_score;
                  trueobj.all = result.data.user_actual_score;
                  trueobj.actual_data = result.data.user_actual_data;
                  trueobj.effective_data = result.data.user_effective_data;
                  truescore.push(trueobj);
                  var obj = {};
                  obj.value = result.data.user_actual_score-result.data.user_effective_score;
                  obj.all = result.data.user_actual_score;
                  sepscore.push(obj);
                  if(result.data.user_effective_score > 0 && result.data.user_actual_score > 0){
                    percent.push(Number(result.data.user_effective_score*100/result.data.user_actual_score).toFixed(1));
                  }else{
                    percent.push(0);
                  }
                }
                c_data.push(truescore);
                c_data.push(sepscore);
                c_data.push(percent);
              }
            })
            
          }else{
            var trueobj = {};
            trueobj.value = item.all_user_effective_score;
            trueobj.all = item.all_user_actual_score;
            trueobj.actual_data = item.all_user_actual_data;
            trueobj.effective_data = item.all_user_effective_data;
            all_truescore.push(trueobj);
            var obj = {};
            obj.value = item.all_user_actual_score-item.all_user_effective_score;
            obj.all = item.all_user_actual_score;
            all_sepscore.push(obj);
            if(item.all_user_effective_score > 0 && item.all_user_actual_score > 0){
              all_percent.push(Number(item.all_user_effective_score*100/item.all_user_actual_score).toFixed(1));
            }else{
              all_percent.push(0);
            }
          }
        });
        if($this.searchData.name.length == 0){
          c_data.push(all_truescore);
          c_data.push(all_sepscore);
          c_data.push(all_percent);
        }
        $this.chartData.c_name = c_name;
        $this.chartData.c_data = c_data;
        $this.chartData.c_user = c_user;
      },
      resetColumnData(){
        var $this = this;
        $this.searchData.name = [];
        $this.searchData.time = [];
        $this.checkAll = false;
      },
      resetPieData(){
        var $this = this;
        $this.pieSearch.name = "";
        $this.pieSearch.time = [];
        $this.pieSearch.post_id = "";
        $this.checkAll = false;
      },
      getDefaultTime(){
        var $this = this;
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime());
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 6);
        let timeArr = [end.toISOString().slice(0, 10), start.toISOString().slice(0, 10)];
        return timeArr;
      },
      tabChange(item){
        var $this = this;
        $this.nowChart = item.name;
        if($this.pieChart){
          $this.pieChart.dispose();
        }
        $this.pieChart = null;
        if(item.name == "1"){
          if(!isSearchColumn){
            $this.getCountData();
          }
        }else if(item.name == "2"){
          if(!$this.isGetPost){
            $this.getPostList();
          }else{
            if(!isSearchPie){
              $this.getPieData();
            }
          }
          
        }
      },
      sortByAsc(i){
        return function(a,b){
          return new Date(a[i]).getTime() - new Date(b[i]).getTime()
        }
      }
    }
  }
  </script>
  <style lang="scss" scoped>
    .chartShow{
      margin-top: 20px;
      padding: 20px;
      background-color: #fff;
      min-height: calc(100vh - 417px);
      #columnChart{
        width: 100%;
        height: calc(100vh - 460px);
      }
    }
    .checked_item .c_tit, .checked_item .c_name{
      font-size: 14px;
      display: inline-block;
      height: 28px;
      line-height: 28px;
      color: #1a1a1a;
    }
    .checked_item .el-checkbox{
      min-width: 120px;
      margin: 3px;
    }
    .checked_item .el-checkbox-group{
        display: inline-block;
    }
    .search_btn, .reset_btn{
      padding-top: 8px;
      padding-bottom: 8px;
      margin-top: 10px;
    }
    .result-panel{
        position: relative;
        .search,.no-data{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        font-size: 14px;
        line-height: 2;
        text-align: center;
        p{
            position: absolute;
            left: 0;
            width: 100%;
            top: 50%;
            margin-top: -20px;
        }
        }
        .search p{
        color: #999
        }
    }
    .item-search{
        margin-bottom: 10px;
        .date-range{
            width: 240px;
        }
    }
    .item-search .filter-title{
        width: 70px;
        display: inline-flex;
        align-items: center;
        .txt-title{
            display: block;
            height: 28px;
            line-height: 28px;
            font-size: 14px;
            color: #666666;
            text-align: left;
        }
    }
    .item-change{
        margin-bottom: 10px;
        .item-font{
            float:left;
            border:1px solid #e1e3ea;
            font-size:13px;
            color:#555555;
            padding:5px 12px;
            line-height:20px;
            margin-left:-1px;
            cursor:pointer;
            &.active,&:hover{
                color:#0970ff;
                border:1px solid #0970ff;
                background:#e0e9ff;
                position:relative;
                z-index:2;
            }
        }
        &:after{
            content: "";
            display: block;
            clear: both;
        }
    }
    .item-filter{
        margin-top: 15px;
        margin-bottom: 5px;
    }
    .item-list{
        .item-change{
            display: inline-flex;
            align-items: center;
            margin-bottom: 0;
            margin-right: 20px;
        }
        .item-date{
            display: inline-flex;
            align-items: center;
        }
    }
    .item-btn{
      margin-bottom: 0px!important;
    }
    .group-index .filter-panel .filter-list{
      padding: 18px 30px 15px;
    }
    .group-index .filter-panel{
      margin-top: 5px;
    }
  </style>
  <style>
  .el-tabs__item{
    background-color: #fff;
  }
  .el-tabs--card > .el-tabs__header{
    border-bottom: 1px solid #fff;
  }
  .el-tabs__item.is-active{
    color: #fff;
    background-color: #0970ff;
  }
  </style>