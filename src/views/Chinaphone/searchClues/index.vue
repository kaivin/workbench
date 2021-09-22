<template>
  <div class="page-root Chinaphone" ref="boxPane">
    <div class="abs-panel" ref="mainPane">
        <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
            <div class="true-height" ref="scrollPane">      
                <p class="breadcrumb" ref="breadcrumbPane">
                    <router-link class="breadcrumb-link" to="/">首页</router-link>
                    <template v-for="item in breadcrumbList">
                      <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id"><b>-</b><span>{{item.title}}</span></router-link>
                    </template>                    
                    <router-link class="breadcrumb-link" to="/Chinaphone/searchClues"><b>-</b>搜索数据</router-link>
                </p>
                <el-card class="box-card scroll-card" shadow="hover">
                  <div slot="header">
                      <div class="card-header EnphoneCardHeader" ref="headerPane">
                          <div class="search-wrap" v-if="device==='desktop'">
                            <div class="item-search" style="width: 240px;">
                              <el-date-picker
                                  v-model="searchData.date"
                                  class="date-range"
                                  size="small"
                                  type="daterange"
                                  align="right"
                                  value-format = "yyyy-MM-dd"
                                  unlink-panels
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期"
                                  :picker-options="pickerRangeOptions">
                              </el-date-picker>
                            </div>
                            <div class="item-search" style="width:100px;">
                              <el-select v-model="searchData.phoneid" size="small" clearable placeholder="电话">
                                <el-option
                                v-for="item in phoneList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                            <div class="item-search" style="width:100px;">
                              <el-select v-model="searchData.mode" size="small" clearable placeholder="渠道">
                                <el-option
                                    v-for="item in sourceList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                            <div class="item-search" style="width:80px;">
                              <el-select v-model="searchData.level_id" size="small" clearable placeholder="级别">
                                <el-option
                                    v-for="item in levelList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                            <div class="item-search" style="width:100px;">
                              <el-select v-model="searchData.typekey" size="small" clearable placeholder="选择分类" @change="currentCateChange">
                                <el-option
                                    v-for="item in productTypeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                            <div class="item-search" style="width:120px;">
                              <el-select v-model="searchData.productid" size="small" clearable placeholder="选择产品">
                                <el-option
                                    v-for="item in productList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                            <div class="item-search" style="width:100px;">
                              <el-select v-model="searchData.productlevel" size="small" clearable placeholder="产品类别">
                                <el-option
                                v-for="item in categoryList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                            <div class="item-search" style="width:80px;">
                              <el-select v-model="searchData.device" size="small" clearable placeholder="设备">
                                <el-option
                                  v-for="item in deviceList"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                            <div class="item-search" style="width:80px;">
                              <el-input
                                  placeholder="地区"
                                  size="small"
                                  v-model="searchData.province"
                                  clearable>
                              </el-input>
                            </div>
                            <div class="item-search" style="width:150px;">
                              <el-input
                                  placeholder="来源平台/关键词"
                                  size="small"
                                  v-model="searchData.search"
                                  clearable>
                              </el-input>
                            </div>
                            <div class="item-search" style="width:120px;">
                              <el-input
                                    placeholder="备注/提供者"
                                    size="small"
                                    v-model="searchData.anymessage"
                                    clearable>
                                </el-input>
                            </div>
                            <div class="item-search" style="width:140px;">
                              <el-input
                                    placeholder="域名(精确匹配)"
                                    size="small"
                                    v-model="searchData.domain"
                                    clearable>
                                </el-input>
                            </div>
                            <div class="item-search" style="width:180px;">
                              <el-input
                                placeholder="来源URL(默认模糊匹配)"
                                size="small"
                                v-model="searchData.url"
                                clearable>
                              </el-input>
                            </div>
                            <div class="item-search">
                              <el-checkbox v-model="searchData.is_url" label="精确URL" border size="small"></el-checkbox>
                            </div>
                            <div class="item-search" style="width:240px;">
                              <el-input
                                  placeholder="询盘ID，多个以|分隔"
                                  size="small"
                                  v-model="searchData.idlist"
                                  clearable>
                              </el-input>
                            </div>
                            <div class="item-search">
                              <el-checkbox v-model="searchData.effective" label="只看有效" border size="small"></el-checkbox>
                            </div>
                            <div class="item-search">
                              <el-checkbox v-model="searchData.is_group" label="分组统计" border size="small"></el-checkbox>
                            </div>
                            <div class="item-search" style="width:90px;">
                              <el-select v-model="searchData.groupurlproduct" size="small" placeholder="分组类型">
                                <el-option
                                  v-for="item in groupList"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                            <div class="item-search">
                              <span style="float:left;line-height:32px;font-size:12px;">显示条数：</span>
                              <el-input
                                  style="width:50px;"
                                  placeholder="显示条数"
                                  size="small"
                                  v-model="searchData.limit">
                              </el-input>
                            </div>
                          </div>
                          <div class="clues-info flex-box">
                              <div class="clues-infoFl flex-content">
                                  <p v-if="isClues"><span>根据查询条件共找到：<strong class="color1">{{infoData.totalCount}}</strong>条，其中有效<strong class="color2">{{infoData.effectiveCount}}</strong>条，无效：<strong class="color3">{{infoData.invalidCount}}</strong>条。</span></p>
                                  <p v-if="isUrl"><span>共计：<strong class="color1">{{infoData.groupCount}}</strong>条URL，询盘<strong class="color2">{{infoData.totalCount}}</strong>个。</span></p>
                                  <p v-if="isProduct"><span>共计：<strong class="color1">{{infoData.groupCount}}</strong>种产品，条URL，询盘<strong class="color2">{{infoData.totalCount}}</strong>个。</span></p>
                              </div>
                              <div class="clues-title-btn">                          
                                <el-button type="primary" size="small" class="serchBtn" v-if="device==='desktop'" @click="searchResult"><i class="svg-i" ><svg-icon icon-class="serch_en" /></i>查询</el-button>
                                <el-button type="primary" size="small" class="derived" :disabled="isExportDisabled" v-if="menuButtonPermit.includes('Chinaphone_listexport')" @click="dialogExportVisible = true"><i class="svg-i" ><svg-icon icon-class="derived" /></i>导出数据</el-button>
                                <el-button type="primary" size="small" class="editorNote" v-bind:disabled="isDisabled" v-if="menuButtonPermit.includes('Chinaphone_custormgivea')" v-on:click="setALevel"><i class="svg-i" ><svg-icon icon-class="editorNote" /></i>标记为A+</el-button>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="card-content" ref="tableContent">
                      <div class="table-wrapper" v-bind:class="scrollPosition.isFixed?'fixed-table':''">
                          <div class="table-mask"></div>
                          <el-table
                              v-if="isClues"
                              key="a"
                              ref="simpleTable"
                              :data="tableData"
                              tooltip-effect="dark"
                              stripe
                              class="SiteTable EntableColor"
                              style="width: 100%"
                              :style="'min-height:'+minHeight+'px;'"
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
                                      <p><a :href="scope.row.lookurl" target="_blank">{{scope.row.lookdomain}}</a></p>
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
                                      <div class="table-tag"><span class="level" @click="handleCustormeditlogClick(scope.row.id)" :class="'level-'+scope.row.level_id">{{scope.row.levelname}}</span></div>
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
                              ref="simpleUrlTable"
                              class="SiteTable"
                              :data="tableData"
                              tooltip-effect="dark"
                              stripe
                              style="width: 100%"
                              :style="'min-height:'+minHeight+'px;'"
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
                              ref="simpleProductTable"
                              class="SiteTable"
                              :data="tableData"
                              tooltip-effect="dark"
                              stripe
                              style="width: 100%"
                              :style="'min-height:'+minHeight+'px;'"
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
                      <div class="out_box fixed" v-if="scrollPosition.maxScrollWidth>0&&scrollPosition.isPC" :style="'left:'+scrollPosition.left+'px;width:'+scrollPosition.width+'px;bottom:'+scrollPosition.fixedBottom+'px;'" ref="out_box">
                          <div class="in_box" @mousedown="mouseDownHandler" :style="'left:'+scrollPosition.insetLeft+'px;width:'+scrollPosition.insetWidth+'px;'" ref="in_box" ></div>
                      </div>
                  </div>
                  <div class="pagination-panel" v-if="totalDataNum>20" ref="pagePane">
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
            </div> 
        </div>
    </div>     
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
    <el-dialog title="级别修改记录" custom-class="export-dialog popover" :visible.sync="levelPopBool">
         <ul>
            <li v-for="item in levelPop" :key="item.id">            
            <span>{{item.addtime}}</span>
            <span v-if="item.bname&&item.bname!=''">[{{item.bname}}]修改</span>
            <span>是否有效<em>[{{item.neweffective}}]</em></span>
            <span>原始级别<em>[{{item.oldlevel}}]</em>,</span>
            <span>修改后级别<em>[{{item.newlevel}}]</em>,</span>
            <span>原因：<em>[{{item.remark}}]</em></span>            
            </li>
         </ul>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" size="small" @click="handleLockClick">确定</el-button>
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
      minHeight:"auto",
      breadcrumbList:[],
      phoneID:null,
      currentPhone:'',
      writepermit:false,
      menuButtonPermit:[],
      defaultData:{},
      operationsWidth:"",
      tableData:[],
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
      levelPop:[],  
      levelPopBool:false,
      scrollPosition:{
        width:0,
        left:0,
        fixedBottom: 15,
        insetWidth:0,
        oldInsetLeft:0,
        insetLeft:0,
        ratio:0,
        startPageX:0,
        maxScrollWidth:0,
        isMouseDown:false,
        isPC:true,
        isFixed:false,
      },
      scrollTable:{
        scrollDom:null,
        tableHeaderFixedDom:null,
        tableFixedRightDom:null,
        fixedTopHeight:0,
        tableheaderHeight:0,
        fixedRightWidth:0,
        tableBottom:0,
        clientHeight:0,
      },
      isLoading:null,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device',
      'sidebar',
      'menuData'
    ]),
  },
  mounted(){
    const $this = this;
    // 监听竖向滚动条滚动事件
    window.addEventListener('scroll',$this.handleScroll,true);
    $this.$nextTick(function () {
        $this.setHeight();
    });
    window.onresize = () => {
      return (() => {
           $this.setHeight();
      })()
    }
  },
  watch: {
      minHeight(val) {
        if (!this.timer) {
          this.minHeight = val
          this.timer = true
          const $this = this
          setTimeout(function() {
            $this.timer = false
          }, 400)
        }
      },
      isOpen(e){
        this.setHeight();
      },
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
  },
  updated(){
    var $this =this;
    $this.$nextTick(() => {
      $this.$refs.simpleTable.doLayout();
    })
  },
  destroyed(){
    console.log("走了销毁1");
    window.removeEventListener('scroll', this.handleScroll,true);//监听页面滚动事件
  },
  methods:{
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
      console.log($this.breadcrumbList,"面包屑数据");
    },
    // loading自定义
    loadingFun(){
      var $this = this;
      $this.isLoading = $this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
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
    // 设置高度
    setHeight(){
      var $this = this;
      $this.minHeight = 0;      
      var headerHeight = $this.$refs.headerPane.offsetHeight+45;
      var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
      var screenHeight = $this.$refs.boxPane.offsetHeight;
      $this.minHeight = screenHeight-headerHeight-breadcrumbHeight-30;
      $this.getBrowserType();
        setTimeout(function() {
          $this.setScrollDom();
      }, 400);
    },
    // 搜索结果
    searchResult(){
      var $this = this;
      $this.loadingFun();
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
      $this.loadingFun();
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
            console.log(response,"询盘信息——$this.tableData");
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
            $this.$nextTick(function () {
              $this.setHeight();
            })
            $this.isLoading.close();
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
            $this.isLoading.close();
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
    // 询盘级别修改记录
    handleCustormeditlogClick(Rid){
      var $this = this;
      var FormID={};
      FormID.id = Rid;
      $this.$store.dispatch('chinaphone/CustormeditlogAction', FormID).then(response=>{
        if(response){
          if(response.status){  
            console.log(response,'级别修改记录-response');  
            if(response.data.length>0){
              $this.levelPopBool=true;
              $this.levelPop=response.data;
            }
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
    handleLockClick(){
        var $this=this;
        $this.levelPopBool=!$this.levelPopBool;
    },
    // 设置横向滚动条相关DOM数据
    setScrollDom(){
      var $this = this;
      $this.scrollPosition.insetLeft = 0;
      $this.scrollPosition.oldInsetLeft = 0;
      // 表格真实宽度（可能超出屏幕）
      var scrollWidth = $this.$refs.simpleTable.bodyWrapper.scrollWidth;
      // 表格可见宽度（屏幕内宽度）
      var maxWidth = $this.$refs.simpleTable.bodyWrapper.clientWidth;
      // 获取表格的位置信息（距离视窗左边的位置信息）
      var rectOBJ = $this.$refs.simpleTable.$el.getBoundingClientRect();
      // 获取距离视窗左边的宽度
      var leftWidth = rectOBJ.left;
      // 根据百分比算出滚动条滑块的宽度
      var insetWidth = parseInt(maxWidth/scrollWidth*maxWidth);
      // 算出滚动条与视口比例（滚动条滚动1像素视口需要滚动多少像素）
      var ratio = (scrollWidth - maxWidth) / (maxWidth - insetWidth);
      var scrollDom = document.querySelector(".SiteTable .el-table__body-wrapper");
      var tableHeaderFixedDom = document.querySelector(".SiteTable .el-table__header-wrapper");
      var tableFixedRightDom = document.querySelector(".SiteTable .el-table__fixed-right");
      $this.scrollPosition.width = maxWidth;
      $this.scrollPosition.left = leftWidth;
      $this.scrollPosition.insetWidth = insetWidth;
      $this.scrollPosition.ratio = parseFloat(ratio);
      $this.scrollPosition.maxScrollWidth = maxWidth - insetWidth;
      $this.scrollTable.scrollDom = scrollDom;
      // 视窗改变时，让自定义滚动条的位置与真实滚动条滚动的位置相吻合
      $this.scrollPosition.insetLeft = $this.scrollTable.scrollDom.scrollLeft/$this.scrollPosition.ratio;
      // 获取表格头吸顶需滚动的高度
      if($this.$refs.headerPane){
         $this.scrollTable.fixedTopHeight = $this.$refs.headerPane.offsetHeight+$this.$refs.breadcrumbPane.offsetHeight+15;
      }else{
         $this.scrollTable.fixedTopHeight=$this.$refs.breadcrumbPane.offsetHeight+15;
      }
      $this.scrollTable.tableHeaderFixedDom = tableHeaderFixedDom;
      if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
         $this.scrollTable.tableFixedRightDom = tableFixedRightDom;
      }
      var fixedHeaderObj = $this.scrollTable.tableHeaderFixedDom.getBoundingClientRect();
      // 获取表格头的高度
      $this.scrollTable.tableheaderHeight = fixedHeaderObj.height;
      if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
         var fixedRightObj = $this.scrollTable.tableFixedRightDom.getBoundingClientRect();
         // 获取右侧固定列的总宽度
         $this.scrollTable.fixedRightWidth = fixedRightObj.width;
      }
      var tableObj = $this.scrollTable.scrollDom.getBoundingClientRect();
      $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+$this.scrollTable.tableheaderHeight+60+15;
      $this.scrollTable.clientHeight = document.documentElement.clientHeight;
      // 头部固定情况下视窗宽高改变，需要重新设置的一些宽高
      if($this.scrollPosition.isFixed){
        var tableHeaderStyle = "width:"+$this.scrollPosition.width+"px;";
        $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
        document.querySelector(".table-mask").style = tableHeaderStyle;
        var tableStyle3 = "width:"+$this.scrollTable.fixedRightWidth+"px;";        
        if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
          document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
        }
        $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+60+15;
      }
      // 视窗宽高改变时需要设置默认滚动条的位置
      if($this.totalDataNum>20){
        var scrTop = $this.$refs.scrollDom.scrollTop;
        if(scrTop+$this.scrollTable.clientHeight-60>=$this.scrollTable.tableBottom-60-15){
          $this.scrollPosition.fixedBottom = scrTop+$this.scrollTable.clientHeight-$this.scrollTable.tableBottom-30;
        }else{
          $this.scrollPosition.fixedBottom = 15;
        }
      }
    },
    // 竖向滚动条滚动事件
    handleScroll(event){
      var $this = this;
      if(!$this.scrollPosition.isMouseDown&&event.target.className=="scroll-panel"){// 非鼠标按下状态，为竖向滚动条触发的滚动事件
        var scrTop = event.target.scrollTop;
        var tableFixedRightDom = document.querySelector(".SiteTable .el-table__fixed-right");
        if(scrTop>=$this.scrollTable.fixedTopHeight){// 头部需要固定
          $this.scrollPosition.isFixed = true;
          var tableHeaderStyle = "width:"+$this.scrollPosition.width+"px;"
          $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
          document.querySelector(".table-mask").style = tableHeaderStyle;
          var tableStyle1 = "padding-top:"+$this.scrollTable.tableheaderHeight+"px;";
          var tableStyle2 = "top:"+$this.scrollTable.tableheaderHeight+"px;";
          var tableStyle3 = "width:"+$this.scrollTable.fixedRightWidth+"px;";
          document.querySelector(".SiteTable .el-table__body-wrapper").style=tableStyle1;
          
          if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-body-wrapper").style=tableStyle2;
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
          }
        }else{// 头部需要变为正常
          $this.scrollPosition.isFixed = false;
          var tableHeaderStyle = "width:100%";
          $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
          var tableStyle1 = "padding-top:0";
          document.querySelector(".SiteTable .el-table__body-wrapper").style=tableStyle1;
          var tableStyle3 = "width:auto";
          if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
            document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
          }
        }
        if($this.totalDataNum>20){
          if(scrTop+$this.scrollTable.clientHeight-60>=$this.scrollTable.tableBottom-60-15){
            $this.scrollPosition.fixedBottom = scrTop+$this.scrollTable.clientHeight-$this.scrollTable.tableBottom-30;
          }else{
            $this.scrollPosition.fixedBottom = 15;
          }
        }
      }
    },
    // 监听横向滚动条鼠标按下事件
    mouseDownHandler(e){
      this.crossMoveStartHandler(e);
      window.addEventListener('mousemove',this.crossMoveingHandler);
      window.addEventListener('mouseup',this.crossMoveEndHandler);
    },
    // 横向滚动条移动开始事件
    crossMoveStartHandler(e){
      var $this = this;
      $this.scrollPosition.isMouseDown = true;
      $this.scrollPosition.startPageX = e.pageX;
    },
    // 横向滚动条鼠标移动事件
    crossMoveingHandler(e){
      var $this = this;
      if($this.scrollPosition.isMouseDown){// 只在鼠标按下时监听鼠标移动事件
        var moveLeft = e.pageX - $this.scrollPosition.startPageX;
        var scrollWidth = 0;
        // 判断本次鼠标按下后鼠标移动的距离 大于0为向右移动
        if(moveLeft>0){
          // 本次移动距离+历史已移动距离如果大于最大能移动距离，说明向右已经滚动到头
          if(moveLeft+$this.scrollPosition.oldInsetLeft>=$this.scrollPosition.maxScrollWidth){
            scrollWidth = $this.scrollPosition.maxScrollWidth;
          }else{
            scrollWidth = moveLeft+$this.scrollPosition.oldInsetLeft;
          }
        }else if(moveLeft<0){
          // 小于0为向左移动
          // 本次移动距离+历史已移动距离，如果小于0，说明向左移动已经到头
          if(moveLeft+$this.scrollPosition.oldInsetLeft<0){
            scrollWidth = 0;
          }else{
            scrollWidth = moveLeft+$this.scrollPosition.oldInsetLeft;
          }
        }else{// 鼠标按下后，未移动
          scrollWidth = $this.scrollPosition.insetLeft;
        }
        // 计算得出本次移动+历史移动总距离
        // 自定义滚动条位置改变
        $this.scrollPosition.insetLeft = scrollWidth;
        // 真实滚动条滚动距离 = 自定义滚动条滚动距离*自定义滚动条与真实滚动条的滚动比
        $this.scrollTable.scrollDom.scrollLeft = scrollWidth*$this.scrollPosition.ratio;
        e.preventDefault();
      }
    },
    // 横向滚动条移动结束事件
    crossMoveEndHandler(e){
      var $this = this;
      $this.scrollPosition.isMouseDown = false;
      $this.scrollPosition.startPageX = 0;
      $this.scrollPosition.oldInsetLeft = $this.scrollPosition.insetLeft;
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
