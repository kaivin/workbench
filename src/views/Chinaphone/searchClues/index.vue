<template>
  <div class="page-root" ref="boxPane">
    <el-card class="box-card" shadow="hover">
        <div slot="header">
            <div class="card-header" ref="headerPane">
                <div class="search-wrap flex-wrap" v-if="device==='desktop'">
                    <div class="search-panelOne flex-content">
                        <el-date-picker
                            v-model="searchData.date"
                            size="small"
                            type="daterange"
                            style="width:250px;margin-right:10px;margin-bottom:10px;"
                            align="right"
                            value-format = "yyyy-MM-dd"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerRangeOptions">
                        </el-date-picker>
                        <el-select v-model="searchData.phoneid" size="small" style="width:120px;margin-right:10px;margin-bottom:10px;" clearable placeholder="电话">
                            <el-option
                            v-for="item in phoneList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="searchData.mode" size="small" clearable placeholder="渠道" style="width:120px;margin-right:10px;margin-bottom:10px;">
                            <el-option
                                v-for="item in sourceList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="searchData.level_id" size="small" clearable placeholder="级别" style="width:80px;margin-right:10px;margin-bottom:10px;">
                            <el-option
                                v-for="item in levelList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="searchData.typekey" size="small" clearable placeholder="选择分类" @change="currentCateChange" style="width:100px;margin-right:10px;margin-bottom:10px;">
                            <el-option
                                v-for="item in productTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="searchData.productid" size="small" clearable placeholder="选择产品" style="width:150px;margin-right:10px;margin-bottom:10px;">
                            <el-option
                                v-for="item in productList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="searchData.productlevel" size="small" clearable placeholder="产品类别" style="width:100px;margin-right:10px;margin-bottom:10px;">
                            <el-option
                            v-for="item in categoryList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="searchData.device" size="small" clearable placeholder="设备" style="width:80px;margin-right:10px;margin-bottom:10px;">
                            <el-option
                            v-for="item in deviceList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <el-input
                            style="width: 140px;margin-right:10px;margin-bottom:10px;"
                            placeholder="地区"
                            size="small"
                            v-model="searchData.province"
                            clearable>
                        </el-input>
                        <el-input
                            style="width: 200px;margin-right:10px;margin-bottom:10px;"
                            placeholder="来源平台/关键词"
                            size="small"
                            v-model="searchData.search"
                            clearable>
                        </el-input>
                        <el-input
                            style="width:150px;margin-bottom:10px;"
                            placeholder="备注/提供者"
                            size="small"
                            v-model="searchData.anymessage"
                            clearable>
                        </el-input>
                    </div>
                    <div class="search-panelTwo">
                        <el-input
                            style="width: 140px;"
                            placeholder="域名(精确匹配)"
                            size="small"
                            v-model="searchData.domain"
                            clearable>
                        </el-input>
                        <el-checkbox v-model="searchData.is_url" label="精确URL" border size="small" style="width:90px;"></el-checkbox>
                        <el-input
                            placeholder="来源URL(默认模糊匹配)"
                            size="small"
                            v-model="searchData.url"
                            clearable>
                        </el-input>
                    </div>
                    <div class="search-panelThree">
                        <span style="float:left;line-height:32px;font-size:12px;">显示条数：</span>
                        <el-input
                            style="width:40px;"
                            placeholder="显示条数"
                            size="small"
                            v-model="searchData.limit">
                        </el-input>
                        <el-checkbox v-model="searchData.effective" label="只看有效" border size="small"></el-checkbox>
                    </div>
                    <div class="search-panelFour">
                        <el-checkbox v-model="searchData.is_group" label="分组统计" border size="small"></el-checkbox>
                        <el-select v-model="searchData.groupurlproduct" size="small" placeholder="分组类型">
                            <el-option
                            v-for="item in groupList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-panelFive">
                        <el-input
                            placeholder="询盘ID"
                            size="small"
                            v-model="searchData.messageid"
                            clearable>
                        </el-input>
                        <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="询盘ID，一行一个"
                            size="small"
                            v-model="searchData.idlist"
                            clearable>
                        </el-input>
                    </div>
                </div>
                  <div class="clues-info flex-wrap">
                       <div class="clues-infoFl flex-content">
                          <p v-if="isClues"><span class="item-span-1">根据查询条件共找到：<strong>{{infoData.totalCount}}</strong>条，</span><span class="item-span-2">其中有效<strong>{{infoData.effectiveCount}}</strong>条，无效：<strong>{{infoData.invalidCount}}</strong>条！</span></p>
                          <p v-if="isUrl"><span class="item-span-1">共计：<strong>{{infoData.groupCount}}</strong>条URL！数量：<strong>{{infoData.totalCount}}</strong>个询盘。</span></p>
                          <p v-if="isProduct"><span class="item-span-1">共计：<strong>{{infoData.groupCount}}</strong>种产品，数量：<strong>{{infoData.totalCount}}</strong>个询盘。</span></p>
                       </div>
                       <div class="clues-title-btn">                          
                        <el-button type="primary" size="small" class="serchBtn" v-if="device==='desktop'" @click="searchResult"><i class="svg-i" ><svg-icon icon-class="serch_en" /></i>查询</el-button>
                        <el-button type="primary" size="small" class="derived" :disabled="isExportDisabled" v-if="menuButtonPermit.includes('Chinaphone_listexport')" @click="dialogExportVisible = true"><i class="svg-i" ><svg-icon icon-class="derived" /></i>导出数据</el-button>
                        <el-button type="primary" size="small" class="editorNote" v-bind:disabled="isDisabled" v-on:click="setALevel"><i class="svg-i" ><svg-icon icon-class="editorNote" /></i>标记为A+</el-button>


                       </div>
                  </div>
            </div>
        </div>
        <div class="card-content" ref="tableContent">
            <el-table
                v-if="isClues"
                key="a"
                border
                ref="simpleTable"
                :data="tableData"
                tooltip-effect="dark"
                stripe
                class="SiteTable"
                style="width: 100%"
                :height="tableHeight"
                row-key="id"
                @selection-change="handleSelectionChange"
                >
                <el-table-column
                    type="selection"
                    align="center"
                    width="48">
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="ID"
                    width="80"
                    >
                </el-table-column>
                <el-table-column
                    prop="phoneText"
                    label="电话"
                    width="80"
                    >
                </el-table-column>
                <el-table-column
                    prop="xuntime"
                    label="时间"
                    width="150"
                    >
                    <template slot-scope="scope">
                        <div class="table-text">
                        <p>{{scope.row.xuntime}}</p>
                        <p>{{scope.row.weekday}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="sourcename"
                    label="域名/渠道"
                    width="100"
                    >
                    <template slot-scope="scope">
                        <div class="table-text">
                        <p><a :href="scope.row.url" target="_blank">{{scope.row.domain}}</a></p>
                        <p>{{scope.row.sourcename}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="sourcename"
                    label="地区/归属地"
                    width="100"
                    >
                    <template slot-scope="scope">
                        <div class="table-text">
                        <p>{{scope.row.province}}/{{scope.row.city}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="keyproduct"
                    label="意向设备"
                    width="100"
                    >
                    <template slot-scope="scope">
                        <span class="product-span" v-bind:class="'level_'+scope.row.productlevel"><i>[{{scope.row.productlevel}}]</i>{{scope.row.keyproduct}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="effective"
                    label="有效"
                    width="60"
                    >
                    <template slot-scope="scope">
                        <div class="table-tag"><el-checkbox v-model="scope.row.isEffective" disabled></el-checkbox></div>
                        <div class="table-text"><p>{{scope.row.invalidcause}}</p></div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="addusername"
                    label="添加人"
                    width="80"
                    >
                </el-table-column>
                <el-table-column
                    prop="addtime"
                    label="添加时间"
                    width="150"
                    >
                </el-table-column>
                <el-table-column
                    prop="levelname"
                    label="等级"
                    min-width="60"
                    >
                    <template slot-scope="scope">
                        <div class="table-tag"><span class="level" :class="'level-'+scope.row.level_id">{{scope.row.levelname}}</span></div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="levelname"
                    label="备注/原因"
                    min-width="120"
                    >
                    <template slot-scope="scope">
                        <div class="table-text">
                            <p>{{scope.row.custormcause}}</p>
                            <p>{{scope.row.custormremark}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="url"
                    label="域名/链接"
                    min-width="150"
                    >
                    <template slot-scope="scope">
                        <div class="table-text">
                            <p>{{scope.row.domain}}</p>
                            <p>{{scope.row.url}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="searchword"
                    label="平台/关键词"
                    min-width="110"
                    >
                    <template slot-scope="scope">
                        <div class="table-text">
                            <p>{{scope.row.search}}</p>
                            <p>{{scope.row.searchword}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="备注"
                    min-width="140"
                    >
                    <template slot-scope="scope">
                        <div class="table-text">
                            <p>{{scope.row.remark}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="searchword"
                    label="提供者/设备"
                    min-width="100"
                    >
                    <template slot-scope="scope">
                        <div class="table-text">
                            <p>{{scope.row.useridname}}</p>
                            <p>{{scope.row.device}}</p>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-table
                v-if="isUrl"
                key="b"
                border
                ref="simpleUrlTable"
                class="SiteTable"
                :data="tableData"
                tooltip-effect="dark"
                stripe
                style="width: 100%"
                :height="tableHeight"
                row-key="id"
                >
                <el-table-column
                    prop="url"
                    label="链接"
                    min-width="200"
                    >
                </el-table-column>
                <el-table-column
                    prop="number"
                    label="数量"
                    min-width="120"
                    >
                </el-table-column>
            </el-table>
            <el-table
                v-if="isProduct"
                key="c"
                border
                ref="simpleProductTable"
                class="SiteTable"
                :data="tableData"
                tooltip-effect="dark"
                stripe
                style="width: 100%"
                :height="tableHeight"
                row-key="id"
                >
                <el-table-column
                    prop="keyproduct"
                    label="产品"
                    min-width="200"
                    >
                </el-table-column>
                <el-table-column
                    prop="number"
                    label="数量"
                    min-width="120"
                    >
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-panel" ref="pagePane">
            <el-pagination
                @size-change="handleSizeChange"
                :page-sizes="pageSizeList"
                @current-change="handleCurrentChange"
                :current-page="searchData.page"
                :layout="device==='mobile'?'jumper':'total, sizes, prev, pager, next, jumper'"
                :total="totalDataNum">
            </el-pagination>
        </div>
    </el-card>
    <el-dialog title="导出" custom-class="export-dialog" :visible.sync="dialogExportVisible" width="400px">
      <el-form :inline="true" :model="exportForm">
        <el-form-item label="文件名称：" :label-width="formLabelWidth">
          <el-input v-model="exportForm.fileName" placeholder="文件名 (默认：excel-list)" prefix-icon="el-icon-document"></el-input>
        </el-form-item>
        <el-form-item label="文件类型：" :label-width="formLabelWidth">
          <el-select v-model="exportForm.bookType" placeholder="请选择导出文件类型">
            <el-option label="xlsx" value="xlsx"></el-option>
            <el-option label="csv" value="csv"></el-option>
            <el-option label="txt" value="txt"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogExportVisible = false">取 消</el-button>
          <el-button :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">导 出</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'searchClues',
  data() {
    return {
      phoneID:null,
      currentPhone:'',
      writepermit:false,
      menuButtonPermit:[],
      defaultData:{},
      operationsWidth:"",
      tableData:[],
      tableHeight:200,
      maxDate:[],
      minDate:[],
      maxNum:0,
      pageSizeList:[20],
      searchData:{
        date:[],
        messageid:"",
        page:1,
        limit:20,
        mode:"",
        typekey:'',
        level_id:'',
        productlevel:'',
        productid:'',
        phoneid:'',
        device:'',
        effective:false,
        province:"",
        search:'',
        anymessage:'',
        domain:'',
        url:'',
        is_url:false,
        is_group:false,
        idlist:'',
        groupurlproduct:1,
      },
      totalDataNum:0,
      pickerRangeOptions: {
        shortcuts: [{
          text: '最近一旬',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 9);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      deviceList:[],
      productTypeList:[],
      sourceList:[],
      phoneList:[],
      levelList:[],
      categoryList:[],
      productList:[],
      effectiveList:[
        {label:"有效",value:1},
        {label:"无效",value:2},
      ],
      groupList:[
        {label:"按URL",value:1},
        {label:"按产品",value:2},
      ],
      infoData:{
        totalCount:0,
        effectiveCount:0,
        invalidCount:0,
        levelOneCount:0,
        levelTwoCount:0,
        totalCountMonth:0,
        effectiveCountMonth:0,
        invalidCountMonth:0,
        levelOneCountMonth:0,
        levelTwoCountMonth:0,
      },
      formLabelWidth:"110px",
      exportForm:{
        fileName:"",
        bookType:"xlsx"
      },
      dialogExportVisible:false,
      downloadLoading: false,
      permitField:[],
      isExportDisabled:true,
      isDisabled:true,
      selectedData:[],
      isUrl:false,
      isProduct:false,
      isClues:true,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device'
    ]),
  },
  mounted(){
    const $this = this;
    $this.$nextTick(function () {
      $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-40-20;
    });
    window.onresize = () => {
        return (() => {
        $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-40-20;
        // 49: 分割线高度；30：page-root上下内边距；30：el-card__body上下内边距；20：按钮父级上下内边距；3：上下border
        })()
    }
  },
  watch: {
      tableHeight(val) {
        if (!this.timer) {
          this.tableHeight = val
          this.timer = true
          const $this = this
          setTimeout(function() {
            $this.timer = false
          }, 400)
        }
      },
  },
  created(){
    var $this = this;
    $this.initData();
  },
  methods:{
    // 搜索结果
    searchResult(){
      var $this = this;
      $this.initCluesList();
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.getSearchSelectData();
    },
    // 组装搜索接口所需数据
    initSearchData(){
      var $this = this;
      var searchData = {};
      searchData.page = $this.searchData.page;
      searchData.limit = $this.searchData.limit;
      searchData.phoneid = $this.searchData.phoneid;
      searchData.messageid = $this.searchData.messageid;
      searchData.province = $this.searchData.province;
      searchData.search = $this.searchData.search;
      searchData.anymessage = $this.searchData.anymessage;
      searchData.domain = $this.searchData.domain;
      searchData.url = $this.searchData.url;
      searchData.groupurlproduct = $this.searchData.groupurlproduct;
      searchData.is_url = $this.searchData.is_url?1:0;
      searchData.effective = $this.searchData.effective?1:0;
      searchData.is_group = $this.searchData.is_group?1:0;
      searchData.mode = $this.searchData.mode;
      searchData.typekey = $this.searchData.typekey;
      searchData.level_id = $this.searchData.level_id;
      searchData.productlevel = $this.searchData.productlevel;
      searchData.device = $this.searchData.device;
      searchData.idlist = $this.searchData.idlist;
      if($this.searchData.date&&$this.searchData.date.length>0){
        searchData.starttime = $this.searchData.date[0];
        searchData.endtime = $this.searchData.date[1];
      }else{
          searchData.starttime = "";
          searchData.endtime = "";
      }
      return searchData;
    },
    // 初始化询盘列表数据
    initCluesList(){
      var $this = this;
      var searchData = $this.initSearchData();
      $this.$store.dispatch('chinaphone/getCurrentCluesSearchListAction', searchData).then(response=>{
        if(response){
          if(response.status){
            var infoData = {};
            infoData.totalCount = response.allcount;
            if($this.searchData.is_group){
              infoData.groupCount = response.countgroup;
              if($this.searchData.groupurlproduct ==1){
                $this.isUrl=true;
                $this.isProduct=false;
              }else{
                $this.isUrl=false;
                $this.isProduct=true;
              }
              $this.isClues=false;
            }else{
              infoData.effectiveCount = response.effectivecount;
              infoData.invalidCount = response.noeffectivecount;
              if(response.data.length>0){
                response.data.forEach(function(item,index){
                  if(item.phonenumber.indexOf("-")!=-1){
                    item.phoneText = item.phonenumber.split("-")[1];
                  }else{
                    item.phoneText = item.phonenumber;
                  }
                  item.isEffective = item.effective==1?true:false;
                });
              }
              $this.isUrl=false;
              $this.isProduct=false;
              $this.isClues=true;
            }
            if(response.data.length>0){
              $this.isExportDisabled = false;
            }else{
              $this.isExportDisabled = true;
            }
            console.log(response,"询盘信息");
            $this.tableData = response.data;
            $this.infoData = infoData;
            $this.totalDataNum = response.allcount;
            $this.pageSizeList;            
            var pageSizeListArr = [$this.pageSizeList];
            if (pageSizeListArr.length > 1) {
              pageSizeListArr.shift();
            }
            pageSizeListArr = [searchData.limit];
            $this.pageSizeList = pageSizeListArr;
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
        }
      });
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        console.log(res);
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Chinaphone_search')){
              $this.initPage();
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
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 获取当前电话的搜索条件数据
    getSearchSelectData(){
      var $this = this;
      $this.$store.dispatch('chinaphone/cluesSearchSelectDataAction', null).then(response=>{
        if(response){
          if(response.status){
            console.log(response,"搜索条件信息");
            var deviceList = [];
            response.device.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.name;
              deviceList.push(itemData);
            });
            $this.deviceList = deviceList;
            var productTypeList = [];
            response.producttype.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              productTypeList.push(itemData);
            });
            $this.productTypeList = productTypeList;
            var sourceList = [];
            response.sourcetype.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              sourceList.push(itemData);
            });
            $this.sourceList = sourceList;
            var phoneList = [];
            response.phone.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.phonenumber;
              itemData.value = item.id;
              phoneList.push(itemData);
            });
            $this.phoneList = phoneList;
            var levelList = [];
            response.xunlevel.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.levelname;
              itemData.value = item.id;
              levelList.push(itemData);
            });
            $this.levelList = levelList;
            var categoryList = [];
            response.xuntype.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              categoryList.push(itemData);
            });
            $this.categoryList = categoryList;
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
        }
      });
    },
    // 当前产品分类改变触发事件
    currentCateChange(e){
        var $this = this;
        if(e){
          $this.searchData.productid = "";
          $this.$store.dispatch('chinaphone/getCurrentCateProductListAction', {typeid:e}).then(response=>{
              if(response){
                  if(response.status){
                      console.log(response,"搜索条件信息");
                      var productList = [];
                      response.data.forEach(function(item,index){
                          var itemData = {};
                          itemData.label = item.name;
                          itemData.value = item.id;
                          productList.push(itemData);
                      });
                      $this.productList = productList;
                      
                  }else{
                      $this.$message({
                      showClose: true,
                      message: response.info,
                      type: 'error'
                      });
                  }
              }
          });
        }else{
          $this.searchData.productid = "";
          $this.productList = [];
        }
    },
    // 每页显示条数改变事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.searchData.limit = val;
      this.initCluesList();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.searchData.page = val;
      this.initCluesList();
    },
    // 导出当前页数据
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '电话','询盘时间','星期','域名','渠道', '地区', '城市', '意向设备','有效','无效原因','添加人','添加时间', '等级', '客服备注','客服原因', '链接', '平台', '关键词', '电商备注', '提供者', '设备']
        const list = this.tableData
        const data = [];
        list.forEach(function(item,index){
          var itemData = [];
          itemData.push(item.id);
          itemData.push(item.phonenumber);
          itemData.push(item.xuntime);
          itemData.push(item.weekday);
          itemData.push(item.domain);
          itemData.push(item.sourcename);
          itemData.push(item.province);
          itemData.push(item.city);
          itemData.push(item.keyproduct);
          itemData.push(item.effective==1?'有效':'无效');
          itemData.push(item.invalidcause);
          itemData.push(item.addusername);
          itemData.push(item.addtime);
          itemData.push(item.levelname);
          itemData.push(item.custormremark);
          itemData.push(item.custormcause);
          itemData.push(item.url);
          itemData.push(item.search);
          itemData.push(item.searchword);
          itemData.push(item.remark);
          itemData.push(item.useridname);
          itemData.push(item.device);
          data.push(itemData);
        });
        // const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.exportForm.fileName,
          autoWidth: true,
          bookType: this.exportForm.bookType
        })
        this.downloadLoading = false;
        this.dialogExportVisible = false;
        this.exportForm.fileName = "";
      })
    },
    // 表格多选改变事件
    handleSelectionChange(val) {
        var $this = this;
        $this.selectedData = val;
        if($this.selectedData.length>0){
          $this.isDisabled = false;
        }else{
          $this.isDisabled = true;
        }
    },
    // 批量设置为A+级别
    setALevel(){
      var $this = this;
      var postData = {};
      var levelID = [];
      $this.selectedData.forEach(function(item,index){
        levelID.push(item.id);
      });
      postData.id = levelID;
      console.log(postData,"发送数据");
      $this.$store.dispatch('chinaphone/currentCluesSetALevelAction', postData).then(response=>{
        if(response){
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
            $this.initCluesList();
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
        }
      });
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
