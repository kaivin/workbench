<template>
    <div class="page-root scroll-panel personAnalysis" ref="boxPane">
        <div class="memberTopTab" ref="headerPane">
            <div class="chooseDepart flex-box">
              <div class="bind_items flex-box">
                <span class="choosetit">日期：</span>
                <el-select v-model="searchData.date" placeholder="选择日期" clearable style="width: 200px">
                  <el-option
                    v-for="item in timeList"
                    :key="item.ads_time"
                    :label="item.ads_time"
                    :value="item.ads_time">
                  </el-option>
                </el-select>
              </div>

              <div class="bind_items flex-box">
                <span class="choosetit">域名：</span>
                <div class="departchoose">
                    <el-checkbox class="all-select" :indeterminate="isAllDomain" border size="mini" v-model="checkAllDomain" @change="handleCheckAllDomainChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedDomain" @change="handleCheckedDomainChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="item in domainList" :label="item.value" :key="item.id" border>{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </div>
              </div>
              
              <div class="bind_items flex-box">
                <span class="choosetit">分析项：</span>
                <div class="departchoose">
                  <el-checkbox class="all-select" :indeterminate="isAllItem" border size="mini" v-model="checkAllItem" @change="handleCheckAllItemChange">全选</el-checkbox>
                  <el-checkbox-group class="team-list" v-model="checkedItem" @change="handleCheckedItemChange" size="mini">
                    <el-checkbox class="item-checkbox" v-for="item in resaultShowList" :label="item.value" :key="item.id" border>{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <el-button type="primary" class="updateBtn" size="small" :disabled="isDisabled" v-if="menuButtonPermit.includes('Fivedepart_domaincount')" v-on:click="getDomainData" icon="el-icon-search">搜索</el-button>
              <el-button type="info" class="resetBtn" size="small" v-on:click="resetData()" :disabled="isDisabled">重置</el-button>
              <el-button type="success" class="deviceBtn" icon="el-icon-plus" size="small" :disabled="isDisabled" v-if="menuButtonPermit.includes('Fivedepart_addurl')" @click="deviceShow">设备数据</el-button>
              <el-button type="primary" class="importBtn" plain size="small" :disabled="isDisabled" v-if="menuButtonPermit.includes('Fivedepart_exportlink')" @click="importShow">导入excel</el-button>
              <el-link type="primary" v-if="menuButtonPermit.includes('Fivedepart_exportlink')" @click='downloadLink' class="mb_link">下载模板</el-link>
            </div>
        </div>
        <div class="card-content" ref="tableContent">
          <div class="exportDiv" v-if="checkedItem.length > 0 && (searchResult.word_count.length > 0 || searchResult.device_count.length > 0 || searchResult.ads_count.length > 0 || searchResult.url_count.length > 0)">
            <el-button type="warning" size="small" class="exportBtn" :disabled="isExportDisabled"  @click="showExportDialog"><i class="svg-i" ><svg-icon icon-class="derived" /></i>导出{{exportTitle}}数据</el-button>
          </div>
          <el-tabs v-model="activeNames" type="card" @tab-click="tabClick" v-if="checkedItem.length > 0 && (searchResult.word_count.length > 0 || searchResult.device_count.length > 0 || searchResult.ads_count.length > 0 || searchResult.url_count.length > 0)">
            <el-tab-pane label="搜索词" name="1" v-if="checkedItem.includes(1)">
              <div class="table-wrapper">
                  <el-table
                    ref="simpleTable01"
                    :data="searchResult.word_count"
                    tooltip-effect="dark"
                    class="SiteTable EntableColor"
                    style="width: 100%"
                    row-key="id"
                    key="a"
                    height="calc(100vh - 355px)"
                    stripe
                    >
                      <el-table-column
                        label="搜索词"
                        prop="word"
                        :min-width="240"
                        >
                      </el-table-column>
                      <el-table-column
                        label="询盘"
                        sortable
                        align="center"
                        prop="xunnumber"
                        :min-width="100"
                        >
                      </el-table-column>
                      <el-table-column
                        prop="zh_rate_sort"
                        label="转化率"
                        align="center"
                        :min-width="100"
                        sortable
                        >
                        <template #default="scope">
                          <span v-if="/^[0-9]+.?[0-9]*$/.test(scope.row.zh_rate)">
                            {{Number(scope.row.zh_rate*100).toFixed(1)}}%
                          </span>
                          <span v-else>
                            {{scope.row.zh_rate}}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="price_sort"
                        label="平均询盘费用"
                        align="center"
                        sortable
                        :min-width="100"
                        >
                        <template #default="scope">
                          {{scope.row.price}}
                        </template>
                      </el-table-column>
                  </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="设备" name="2" v-if="checkedItem.includes(2)">
              <div class="table-wrapper">
                  <el-table
                    ref="simpleTable02"
                    :data="searchResult.device_count"
                    tooltip-effect="dark"
                    class="SiteTable EntableColor"
                    style="width: 100%"
                    row-key="id"
                    key="b"
                    stripe
                    height="calc(100vh - 355px)"
                    >
                    <el-table-column
                      label="设备"
                      prop="word"
                      :min-width="240"
                      >
                    </el-table-column>
                    <el-table-column
                      label="询盘"
                      sortable
                      align="center"
                      prop="xunnumber"
                      :min-width="100"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="zh_rate_sort"
                      label="转化率"
                      align="center"
                      sortable
                      :min-width="100"
                      >
                      <template #default="scope">
                        <span v-if="/^[0-9]+.?[0-9]*$/.test(scope.row.zh_rate)">
                          {{Number(scope.row.zh_rate*100).toFixed(1)}}%
                        </span>
                        <span v-else>
                          {{scope.row.zh_rate}}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="price_sort"
                      label="平均询盘费用"
                      align="center"
                      sortable
                      :min-width="100"
                      >
                      <template #default="scope">
                        {{scope.row.price}}
                      </template>
                    </el-table-column>
                  </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="广告" name="3" v-if="checkedItem.includes(3)">
              <div class="table-wrapper">
                  <el-table
                    ref="simpleTable03"
                    :data="searchResult.ads_count"
                    tooltip-effect="dark"
                    class="SiteTable EntableColor"
                    style="width: 100%"
                    row-key="id"
                    key="c"
                    stripe
                    height="calc(100vh - 355px)"
                    >
                      <el-table-column
                        label="广告"
                        prop="word_ads"
                        :min-width="240"
                        >
                      </el-table-column>
                      <el-table-column
                        label="询盘"
                        sortable
                        prop="xunnumber"
                        align="center"
                        :min-width="100"
                        >
                      </el-table-column>
                      <el-table-column
                        prop="zh_rate_sort"
                        label="转化率"
                        sortable
                        align="center"
                        :min-width="100"
                        >
                        <template #default="scope">
                          <span v-if="/^[0-9]+.?[0-9]*$/.test(scope.row.zh_rate)">
                            {{Number(scope.row.zh_rate*100).toFixed(1)}}%
                          </span>
                          <span v-else>
                            {{scope.row.zh_rate}}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="price_sort"
                        label="平均询盘费用"
                        align="center"
                        sortable
                        :min-width="100"
                        >
                        <template #default="scope">
                          {{scope.row.price}}
                        </template>
                      </el-table-column>
                  </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="网址" name="4" v-if="checkedItem.includes(4)">
              <div class="table-wrapper">
                  <el-table
                    ref="simpleTable04"
                    :data="searchResult.url_count"
                    tooltip-effect="dark"
                    class="SiteTable EntableColor"
                    style="width: 100%"
                    row-key="id"
                    key="d"
                    stripe
                    height="calc(100vh - 355px)"
                    > 
                      <el-table-column
                        label="网址"
                        prop="word_filename"
                        :min-width="240"
                        >
                        <template #default="scope">
                          <el-link type="primary" :href="scope.row.word_filename" target="_blank">{{scope.row.word_filename}}</el-link>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="询盘"
                        sortable
                        prop="xunnumber"
                        align="center"
                        :min-width="100"
                        >
                      </el-table-column>
                      <el-table-column
                        prop="zh_rate_sort"
                        label="转化率"
                        sortable
                        align="center"
                        :min-width="100"
                        >
                        <template #default="scope">
                          <span v-if="/^[0-9]+.?[0-9]*$/.test(scope.row.zh_rate)">
                            {{Number(scope.row.zh_rate*100).toFixed(1)}}%
                          </span>
                          <span v-else>
                            {{scope.row.zh_rate}}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="price_sort"
                        label="平均询盘费用"
                        align="center"
                        sortable
                        :min-width="100"
                        >
                        <template #default="scope">
                          {{scope.row.price}}
                        </template>
                      </el-table-column>
                  </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
      </div>
      <el-backtop target=".scroll-panel"></el-backtop>
      <ExportModal ref="ExportModalRef" @exportSuccess="exportDone"></ExportModal>
      <AddUrl ref="AddUrlRef" @saveSuccess="saveSuccess"></AddUrl>
      <ImportData ref="ImportDataRef" @saveSuccess="saveSuccess"></ImportData>
      <DownTemplate ref="DownTemplateRef"></DownTemplate>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ExportModal from '@/components/Excel/exportModal.vue'
import { jsonToSheetXlsx } from '@/components/Excel/Export2Excel'
import AddUrl from '../components/domaincount/addUrl.vue';
import ImportData from '../components/domaincount/importData.vue';
import DownTemplate from '../components/domaincount/downTemplate.vue';
export default {
  name: 'domaincount',
  data() {
    return {
      defaultData:{},
      menuButtonPermit:[],
      searchData:{
        date:"",
      },
      searchResult: {
        word_count:[],
        device_count: [],
        ads_count: [],
        url_count: []
      },
      isDisabled:false,
      isExportDisabled: true,
      resaultShowList:[
        {id:1,value:1,label:"搜索词"},
        {id:2,value:2,label:"设备"},
        {id:3,value:3,label:"广告"},
        {id:4,value:4,label:"网址"}
      ],
      domainList: [
        {id:1,value:"ftmmachinery.com", label: "ftmmachinery.com"},
        {id:2,value:"ftmsino.com", label: "ftmsino.com"},
      ],
      isAllItem:false,
      checkAllItem:false,
      checkedItem:[],
      isAllDomain:false,
      checkAllDomain:false,
      checkedDomain:[],
      pickerRangeOptions: this.$pickerRangeOptions,
      activeNames: "1",
      exportTitle: "搜索词",
      timeList: [],
    }
  },
  components: {
		ExportModal,
    AddUrl,
    ImportData,
    DownTemplate
	},
  computed: {
    ...mapGetters([
      'userInfo',
      'sidebar',
      'menuData'
    ]),
    isCollapse() {
      return this.sidebar.opened
    },
  },
  watch:{
    minWidth(val) {
      if (!this.timer) {
        this.minWidth = val
        this.timer = true
        const $this = this
        setTimeout(function() {
          $this.timer = false
        }, 400)
      }
    },
  },
  mounted(){
    const $this = this;
    if($this.$refs.boxPane){  
      $this.minWidth = $this.$refs.boxPane.offsetWidth; 
    }
    window.onresize = () => {
      return (() => {
        if($this.$refs.boxPane){
          $this.minWidth = $this.$refs.boxPane.offsetWidth; 
        }
      })()
    }
  },
  created(){
    var $this = this;
    $this.initData();
  },
  methods:{
    // 重置选择项
    resetData(){
      var $this = this;
      $this.searchData.date="";
      $this.searchResult.word_count=[];
      $this.searchResult.url_count=[];
      $this.searchResult.ads_count=[];
      $this.searchResult.device_count=[];
      $this.isAllItem = false;
      $this.checkAllItem = false;
      $this.checkedItem = [];
      $this.isAllDomain = false;
      $this.checkAllDomain = false;
      $this.checkedDomain = [];
      $this.isDisabled = false;
      $this.isExportDisabled = true;
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 组装搜索接口所需数据
    initSearchData(){
      var $this = this;
      var searchData = {};
      searchData.ads_time = $this.searchData.date;
      searchData.type = $this.checkedItem;
      searchData.domain = $this.checkedDomain;
      return searchData;
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if(!$this.menuButtonPermit.includes('Fivedepart_domaincount')){
              $this.$message({
                showClose: true,
                message: "未被分配该页面的访问权限",
                type: 'error',
                  duration:6000
              });
              $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            }else{
              $this.getTimeList();
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
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    
    getTimeList(){
      var $this = this;
      $this.$store.dispatch('depfive/depfiveTimeAction', null).then(response=>{
        if(response){
          if(response.status){
            if(response.data && response.data.length > 0){
              $this.timeList = response.data;
            }
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
            setTimeout(()=>{
              $this.isDisabled=false;
            },1000);
          }
        }
      });
    },
    // 获取统计数据
    getDomainData(){
      var $this = this;
      if(!$this.isDisabled){
        var searchData = $this.initSearchData();
        if($this.searchData.date == ""){
          $this.$message({
              showClose: true,
              message: '请选择查询时间！',
              type: 'error'
          });
          return false;
        }
        if(searchData.domain.length == 0){
          $this.$message({
              showClose: true,
              message: '请至少选择一个域名！',
              type: 'error'
          });
          return false;
        }
        if(searchData.type.length == 0){
          $this.$message({
              showClose: true,
              message: '请至少选择一个分析项！',
              type: 'error'
          });
          return false;
        }
        $this.isDisabled=true;
        $this.$store.dispatch('depfive/depfiveDomainDataAction', searchData).then(response=>{
          if(response){
            if(response.status){
              if(response.word_count && response.word_count.length > 0){
                $this.searchResult.word_count = response.word_count;
              }
              if(response.device_count && response.device_count.length > 0){
                $this.searchResult.device_count = response.device_count;
              }
              if(response.ads_count && response.ads_count.length > 0){
                $this.searchResult.ads_count = response.ads_count;
              }
              if(response.url_count && response.url_count.length > 0){
                $this.searchResult.url_count = response.url_count;
              }
              $this.activeNames = ''+$this.checkedItem[0];
              if(''+$this.checkedItem[0] == "1"){
                $this.exportTitle = "搜索词";
              }else if(''+$this.checkedItem[0] == "2"){
                $this.exportTitle = "设备";
              }else if(''+$this.checkedItem[0] == "3"){
                $this.exportTitle = "广告";
              }else if(''+$this.checkedItem[0] == "4"){
                $this.exportTitle = "网址";
              }
              setTimeout(()=>{
                $this.isDisabled=false;
                $this.isExportDisabled = false;
              },1000);
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
              setTimeout(()=>{
                $this.isDisabled=false;
              },1000);
            }
          }
        });
      }
    },
    // 分析项筛选
    handleCheckAllItemChange(e){
      var $this = this;
      if(e){
        var checkedItem = [];
        $this.resaultShowList.forEach(function(item,index){
          checkedItem.push(item.value);
        });
        $this.checkedItem = checkedItem;
        $this.checkAllItem= true;
      }else{
        $this.checkedItem = [];
        $this.checkAllItem = false;
      }
      $this.isAllItem = false;
    },
    handleCheckedItemChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.resaultShowList.length){
          $this.checkAllItem = true;
        }else{
          $this.checkAllItem = false;
        }
        if(checkedCount>0&&checkedCount<$this.resaultShowList.length){
          $this.isAllItem = true;
        }else{
          $this.isAllItem = false;
        }
    },
    // 域名筛选
    handleCheckAllDomainChange(e){
      var $this = this;
      if(e){
        var checkedDomain = [];
        $this.domainList.forEach(function(item,index){
          checkedDomain.push(item.value);
        });
        $this.checkedDomain = checkedDomain;
        $this.checkAllDomain= true;
      }else{
        $this.checkedDomain = [];
        $this.checkAllDomain = false;
      }
      $this.isAllDomain = false;
    },
    handleCheckedDomainChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.domainList.length){
          $this.checkAllDomain = true;
        }else{
          $this.checkAllDomain = false;
        }
        if(checkedCount>0&&checkedCount<$this.domainList.length){
          $this.isAllDomain = true;
        }else{
          $this.isAllDomain = false;
        }
    },
    showExportDialog() {
			var $this = this;
      var fieldList = [];
      if($this.activeNames == "1"){
        fieldList.push({ key: 'word', value: '搜索词'})
      }else if($this.activeNames == "2"){
        fieldList.push({ key: 'word', value: '设备'})
      }else if($this.activeNames == "3"){
        fieldList.push({ key: 'word_ads', value: '广告'})
      }else if($this.activeNames == "4"){
        fieldList.push({ key: 'word_filename', value: '网址'})
      }
      fieldList.push({ key: 'xunnumber', value: '询盘'})
      fieldList.push({ key: 'zh_rate', value: '转化率'})
      fieldList.push({ key: 'price', value: '平均询盘费用'})
			$this.$refs.ExportModalRef.showDialog({ fieldList: fieldList, hasSelected: false, hasData: false })
		},
		exportDone(obj) {
			var $this = this;
			const filename = obj.filename
			const customData = []
			let header = null
			const bookType = obj.fileType
			const headerSort = obj.sort
			if (obj.headerType === 'custom') {
				header = obj.header
			}
			var resData = [];
      if($this.activeNames == "1"){
        resData = $this.searchResult.word_count;
      }else if($this.activeNames == "2"){
        resData = $this.searchResult.device_count;
      }else if($this.activeNames == "3"){
        resData = $this.searchResult.ads_count;
      }else if($this.activeNames == "4"){
        resData = $this.searchResult.url_count;
      }
			resData.forEach((item) => {
				const itemObj = {}
				headerSort.forEach((current) => {
					itemObj[current] = item[current]
				})
				customData.push(itemObj)
			})
			jsonToSheetXlsx({
				data: customData,
				header: header,
				filename: filename,
				json2sheetOpts: {
				// 指定顺序
				header: headerSort
				},
				write2excelOpts: {
				  bookType
				}
			})
		},
    tabClick(e){
      var $this = this;
      if(e.name == "1"){
        $this.exportTitle = "搜索词";
        $this.$nextTick(() => {
          $this.$refs.simpleTable01.doLayout();
        })
      }else if(e.name == "2"){
        $this.exportTitle = "设备";
        $this.$nextTick(() => {
          $this.$refs.simpleTable02.doLayout();
        })
      }else if(e.name == "3"){
        $this.exportTitle = "广告";
        $this.$nextTick(() => {
          $this.$refs.simpleTable03.doLayout();
        })
      }else if(e.name == "4"){
        $this.exportTitle = "网址";
        $this.$nextTick(() => {
          $this.$refs.simpleTable04.doLayout();
        })
      }
    },
    importShow(){
      var $this = this;
      $this.$refs.ImportDataRef.showDialog({timeList: $this.timeList})
    },
    deviceShow(){
      var $this = this;
			$this.$refs.AddUrlRef.showDialog({timeList: $this.timeList})
    },
    downloadLink(){
      var $this = this;
			$this.$refs.DownTemplateRef.showDialog()
    },
    saveSuccess(){
      var $this = this;
      if($this.searchData.date && $this.checkedDomain.length > 0 && $this.checkedItem.length > 0){
        $this.getDomainData();
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.chooseDepart{
  flex-wrap: wrap;
  .bind_items{
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 20px;
  }
}
.memberTopTab .chooseDepart .departchoose label{
  height: 34px;
}
.el-checkbox.is-bordered + .el-checkbox.is-bordered{
  margin-left: -1px;
}
.updateBtn, .resetBtn, .importBtn, .exportBtn, .deviceBtn{
  height: 34px;
  line-height: 32px;
  padding: 0 15px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.importBtn label{
  cursor: pointer;
}
.mb_link{
  display: inline-block;
  height: 34px;
  line-height: 34px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
}
.memberTopTab{
  padding: 20px;
}
.card-content{
  padding: 20px;
  background-color: #fff;
  height: calc(100vh - 257px);
  position: relative;
  .exportDiv{
    position: absolute;
    z-index: 33;
    right: 20px;
    top: 10px;
  }
}
.memberTopTab .chooseDepart .departItems .date-range span.el-range-separator:hover{
  color: #0048ff;
}
.col_title{
  font-size: 17px;
  color: #565656;
}
.el-table.SiteTable{
  border-left: 1px solid #ebeff1;
  border-radius: 8px 8px 0 0;
}
.table-wrapper{
  position: relative;
  &:after{
    content: "";
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: #ebeff1;
  }
}

</style>
<style>
.memberTopTab .chooseDepart .departchoose label:hover .el-checkbox__input.is-checked .el-checkbox__inner, .memberTopTab .chooseDepart .departchoose label:hover .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #0970ff;
}
</style>