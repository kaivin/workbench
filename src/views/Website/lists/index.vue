<template>
  <div class="page-root" ref="boxPane">
    <el-card class="box-card scroll-card WebsiteList-card" shadow="hover" v-bind:class="device=='mobile'?'mobile':''">
      <div slot="header" ref="headerPane" >
        <div class="card-header" v-if="device==='desktop'">
          <div class="border-wrap post-class">
            <div class="border-row flex-wrap">
                <div class="border-cell txt-font"><span>行业：</span></div>
                <div class="border-cell flex-content">
                    <div class="tag-panel">
                        <template v-for="(item,index) in brandList">
                            <el-button type="primary" v-bind:key="index" v-bind:class="item.isOn?'':'is-plain'" size="small" v-on:click="clickBrand(item.id)">{{item.brandname}}</el-button>
                        </template>
                    </div>
                </div>
                <span class="borderver"></span>
                <div class="border-cell txt-font"><span>语言：</span></div>
                <div class="border-cell flex-content">
                    <div class="tag-panel">
                        <template v-for="item in languageList">
                            <el-button type="primary" v-bind:key="item.id" v-bind:class="item.isOn?'':'is-plain'" size="small" v-on:click="clickLanguage(item.id)">{{item.languagename}}</el-button>
                        </template>
                    </div>
                </div>
                <span class="borderver"></span>
                <div class="border-cell txt-font"><span>排序：</span></div>
                <div class="border-cell flex-content">
                    <div class="tag-panel">
                        <template v-for="(item,index) in sort">
                            <el-button type="primary" v-bind:key="index" v-bind:class="item.isOn?'':'is-plain'" size="small" v-on:click="clickSort(item.key)">{{item.name}}</el-button>
                        </template>
                    </div>
                </div>
            </div>
            <div class="border-row flex-wrap">
                <div class="border-cell txt-font"><span>部门：</span></div>
                <div class="border-cell flex-content">
                    <div class="tag-panel">
                        <template v-for="(item,index) in departList">
                            <el-button type="primary" v-bind:key="index" v-bind:class="item.isOn?'':'is-plain'" size="small" v-on:click="clickDepart(item.id)">{{item.name}}</el-button>
                        </template>
                    </div>
                </div>
            </div>
            <div class="border-row flex-wrap">
                <div class="border-cell txt-font"><span>模式：</span></div>
                <div class="border-cell flex-content">
                    <div class="tag-panel">
                        <template v-for="(item,index) in websiteStatus">
                            <el-button :type="item.type" v-bind:key="index" v-bind:class="item.isOn?'':'is-plain'" size="small" v-on:click="clickStatus(item.cate,item.key)">{{item.name}}</el-button>
                        </template>
                    </div>
                </div>
            </div>
            <div class="border-row flex-wrap">
                <div class="border-cell txt-font"><span>标签：</span></div>
                <div class="border-cell flex-content">
                    <div class="tag-panel">
                        <template v-for="(item,index) in attrTagList">
                            <el-button type="primary" v-bind:key="index" v-bind:class="item.isOn?'':'is-plain'" size="small" v-on:click="clickAttrTag(item.name,item.id)">{{item.name}}</el-button>
                        </template>
                    </div>
                </div>
            </div>
            <div class="border-row flex-wrap">
                <div class="border-cell txt-font"><span>主机头：</span></div>
                <div class="border-cell flex-content">
                    <div class="tag-panel">
                        <template v-for="(item,index) in hostTagList">
                            <el-button type="primary" v-bind:key="index" v-bind:class="item.isOn?'':'is-plain'" size="small" v-on:click="clickHostTag(item.name,item.id)">{{item.name}}</el-button>
                        </template>
                    </div>
                </div>
                <span class="borderver"></span>
                <div class="border-cell txt-font"><span>其他：</span></div>
                <div class="border-cell flex-content">
                    <div class="tag-panel">
                        <el-button type="primary" v-bind:class="formData.headeruser?'':'is-plain'" size="small" v-on:click="clickManage">个人负责网站</el-button>
                        <el-button type="primary" v-bind:class="formData.personuser?'':'is-plain'" size="small" v-on:click="clickDevelop">个人开发网站</el-button>
                    </div>
                </div>
                <div class="border-cell flex-content">
                    <div class="tag-panel WebsiteListSearch">
                        <el-input
                          style="width:100%;margin:0px!important;"
                          placeholder="IP/域名搜索："
                          v-model="formData.ip"
                          size="small"
                          clearable>
                        </el-input>
                        <el-button class="item-input" size="small" type="primary" @click="searchResult"><i class="svg-i searchWhite" ><svg-icon icon-class="searchWhite" /></i>搜索</el-button>
                    </div>
                </div>
            </div>
          </div>
        </div>
        <div class="card-header ArticleSearchScreen" v-else>
            <div class="search-panel ArticleSearch">                              
                <el-input placeholder="输入ip或域名" v-model="formData.ip" class="article-search">
                  <el-button slot="append" @click="searchResult"><span class="search-icon"><svg-icon icon-class="search1" class-name="disabled" /></span></el-button>
                </el-input>
            </div>
            <span class="WebsiteListScreen" v-on:click="searchDialog()">筛选</span>
        </div>
      </div>
      <div class="card-content WebsiteList-Wrap" ref="cardContent">
          <div class="card-wrap">
            <el-table
              ref="simpleTable"
              :data="tableData"
              stripe
              :height="scrollHeight"
              class="SiteTable"
              style="width: 100%"
              >
              <el-table-column
                type="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                prop="id"
                label="ID"
                width="60"
                >
              </el-table-column>
              <el-table-column
                prop="departname"
                label="部门"
                width="100"
                >
              </el-table-column>
              <el-table-column
                prop="is_online"
                label="上线"
                width="50"
                >
                <template #default="scope">
                  <div class="table-icon center">
                    <i class="svg-i online" v-if="scope.row.is_online" title="在线"></i>
                    <i class="svg-i offline" v-else title="离线"></i>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="openstatus"
                label="状态"
                width="80"
                >
                <template #default="scope">
                  <template v-if="scope.row.is_online">
                    <div class="table-tag" v-if="scope.row.speedcheckstatus==1">
                       <el-tag class="NotTag normal" type="info" v-if="scope.row.openstatus==0" title="正常">正常</el-tag>
                       <el-tag class="NotTag timeout" type="info" v-else-if="scope.row.openstatus==1" title="超时">超时网站</el-tag>
                       <el-tag class="NotTag abnormal" type="info" v-else title="异常">异常</el-tag>
                    </div>
                    <div class="table-tag" v-else><el-tag class="NotTag NotDetect" type="info">未检测</el-tag></div>
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                prop="speed"
                label="速度"
                width="80"
                >
                <template #default="scope">
                  <template v-if="scope.row.is_online">
                    <div class="table-tag" v-if="scope.row.speedcheckstatus==1">
                        <template v-if="scope.row.isCn">
                          <el-tag size="small" v-if="scope.row.speed<1" type="success">{{scope.row.speed}}s</el-tag>
                          <el-tag size="small" v-else-if="scope.row.speed>=1&&scope.row.speed<2" type="warning">{{scope.row.speed}}s</el-tag>
                          <el-tag size="small" v-else type="danger">{{scope.row.speed}}s</el-tag>
                        </template>
                        <template v-else>
                          <el-tag size="small" v-if="scope.row.speed<2" type="success">{{scope.row.speed}}s</el-tag>
                          <el-tag size="small" v-else-if="scope.row.speed>=2&&scope.row.speed<4" type="warning">{{scope.row.speed}}s</el-tag>
                          <el-tag size="small" v-else type="danger">{{scope.row.speed}}s</el-tag>
                        </template>
                    </div>
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                prop="domainattr"
                label="标签"
                min-width="240"
                >
                <template #default="scope">
                  <div class="table-tag">
                    <el-tag :style="{background:item.color,borderColor:item.color,color:'#ffffff'}" size="small" v-for="(item,index) in scope.row.tagList" v-bind:key="index">{{item.tag}}</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="domain"
                label="主域名"
                min-width="210"
                >
                <template #default="scope">
                  <strong>{{scope.row.domain}}</strong>
                </template>
              </el-table-column>
              <el-table-column
                prop="hosttag"
                label="主机头"
                min-width="130"
                >
                <template #default="scope">
                  <div class="table-icon">
                    <i class="svg-i" title="http" v-if="!scope.row.isHttps"><svg-icon icon-class="websiteClock" class-name="disabled" /></i>
                    <template v-for="(item,index) in scope.row.hostList">
                      <i class="svg-i" title="https" v-bind:key="index" v-if="item=='https'"><svg-icon icon-class="websiteClock" class-name="disabled" /></i>
                      <i class="svg-i link" v-on:click="hrefBlank(scope.row.isHttps?'https://'+item+'.'+scope.row.domain:'http://'+item+'.'+scope.row.domain)" :title="scope.row.isHttps?'https://'+item+'.'+scope.row.domain:'http://'+item+'.'+scope.row.domain" v-bind:key="index" v-else-if="item=='www'"><svg-icon icon-class="websitePc" class-name="disabled" /></i>
                      <i class="svg-i link" v-on:click="hrefBlank(scope.row.isHttps?'https://'+item+'.'+scope.row.domain:'http://'+item+'.'+scope.row.domain)" :title="scope.row.isHttps?'https://'+item+'.'+scope.row.domain:'http://'+item+'.'+scope.row.domain" v-bind:key="index" v-else-if="item=='m'"><svg-icon icon-class="websiteMobile" class-name="disabled" /></i>
                      <i class="svg-i link" v-on:click="hrefBlank(scope.row.isHttps?'https://'+item+'.'+scope.row.domain:'http://'+item+'.'+scope.row.domain)" :title="scope.row.isHttps?'https://'+item+'.'+scope.row.domain:'http://'+item+'.'+scope.row.domain" v-bind:key="index" v-else><svg-icon icon-class="websiteMap" class-name="disabled" /></i>
                    </template>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="website_designuser"
                label="设计负责人"
                width="94"
                >
                <template #default="scope">
                  <div class="table-name" v-if="scope.row.uiList.length>0">
                    <span class="item-name" v-for="(item,index) in scope.row.uiList" v-bind:key="index">{{item}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="website_beforeuser"
                label="前端负责人"
                width="94"
                >
                <template #default="scope">
                  <div class="table-name" v-if="scope.row.frontEndList.length>0">
                    <span class="item-name" v-for="(item,index) in scope.row.frontEndList" v-bind:key="index">{{item}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="website_backuser"
                label="程序负责人"
                width="94"
                >
                <template #default="scope">
                  <div class="table-name" v-if="scope.row.programList.length>0">
                    <span class="item-name" v-for="(item,index) in scope.row.programList" v-bind:key="index">{{item}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="website_pushuser"
                label="推广负责人"
                width="94"
                >
                <template #default="scope">
                  <div class="table-name" v-if="scope.row.promoteList.length>0">
                    <span class="item-name" v-for="(item,index) in scope.row.promoteList" v-bind:key="index">{{item}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="website_headuser"
                label="组负责人"
                width="84"
                >
                <template #default="scope">
                  <div class="table-name" v-if="scope.row.teamList.length>0">
                    <span class="item-name" v-for="(item,index) in scope.row.teamList" v-bind:key="index">{{item}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="website_serveruser"
                label="服务器负责人"
                width="110"
                >
                <template #default="scope">
                  <div class="table-name" v-if="scope.row.serverList.length>0">
                    <span class="item-name" v-for="(item,index) in scope.row.serverList" v-bind:key="index">{{item}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="addtime"
                label="添加时间"
                width="160"
                >
              </el-table-column>
              <el-table-column
                v-if="menuButtonPermit.includes('Website_loglist')"
                label="工作日志"
                width="140"
                fixed="right"
                >
                <template #default="scope">
                  <el-button v-if="scope.row.show===1" class="logs-button" size="mini" @click="linkToLog(scope.row,scope.$index)">工作日志<span v-if="scope.row.weblogcount!=0" class="logs-num">({{scope.row.weblogcount}})</span></el-button>
                </template>
              </el-table-column>
              <el-table-column
                v-if="(menuButtonPermit.includes('Website_edit')||menuButtonPermit.includes('Website_delete'))&&device==='desktop'"
                :width="operationsWidth"
                align="center"
                fixed="right"
                label="操作">
                <template #default="scope">
                  <div class="table-button">
                    <el-button v-if="scope.row.show===1&&menuButtonPermit.includes('Website_edit')" size="mini" @click="editTableRow(scope.row,scope.$index)">编辑</el-button>
                    <el-button v-if="scope.row.deletepermit===1&&menuButtonPermit.includes('Website_delete')" size="mini" @click="deleteTableRow(scope.row,scope.$index)" type="info" plain>删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div v-if="totalDataNum>50" class="pagination-panel" ref="pagePane">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="pageSizeList"
                :page-size="limit"
                :layout="device==='mobile'?'sizes, jumper':'total, sizes, prev, pager, next, jumper'"
                :total="totalDataNum">
              </el-pagination>
            </div>
          </div>
      </div>
    </el-card>
    <div class="drawerBg" v-bind:class="openClass?'open':''" v-if="device!=='desktop'" v-on:click="searchDialog()"></div>
    <div class="WebsiteFixed" ref="WebsiteFixed" v-bind:class="openClass?'open':''" v-if="device!=='desktop'">
        <ul :style="{height:WebsiteFixedHeight+'px'}">
           <li>
              <span class="WebsiteFixedTit">行业：</span>
              <div class="tag-panel">
                  <template v-for="(item,index) in brandList">
                      <el-button type="primary" v-bind:key="index" v-bind:class="item.isOn?'is-plain':''" size="small" v-on:click="clickBrand(item.id)">{{item.brandname}}</el-button>
                  </template>
              </div>
           </li>
           <li>
              <span class="WebsiteFixedTit">语言：</span>
                <div class="tag-panel">
                    <template v-for="item in languageList">
                        <el-button type="primary" v-bind:key="item.id" v-bind:class="item.isOn?'is-plain':''" size="small" v-on:click="clickLanguage(item.id)">{{item.languagename}}</el-button>
                    </template>
                </div>
           </li>
           <li>
              <span class="WebsiteFixedTit">排序：</span>
                <div class="tag-panel">
                    <template v-for="(item,index) in sort">
                        <el-button type="primary" v-bind:key="index" v-bind:class="item.isOn?'is-plain':''" size="small" v-on:click="clickSort(item.key)">{{item.name}}</el-button>
                    </template>
                </div>
           </li>
           <li>
              <span class="WebsiteFixedTit">部门：</span>
                <div class="tag-panel">
                    <template v-for="(item,index) in departList">
                        <el-button type="primary" v-bind:key="index" v-bind:class="item.isOn?'is-plain':''" size="small" v-on:click="clickDepart(item.id)">{{item.name}}</el-button>
                    </template>
                </div>
           </li>
           <li>
              <span class="WebsiteFixedTit">模式：</span>
                <div class="tag-panel">
                    <template v-for="(item,index) in websiteStatus">
                        <el-button :type="item.type" v-bind:key="index" v-bind:class="item.isOn?'is-plain':''" size="small" v-on:click="clickStatus(item.cate,item.key)">{{item.name}}</el-button>
                    </template>
                </div>
           </li>
           <li>
              <span class="WebsiteFixedTit">标签：</span>
                <div class="tag-panel">
                    <template v-for="(item,index) in attrTagList">
                        <el-button type="primary" v-bind:key="index" v-bind:class="item.isOn?'is-plain':''" size="small" v-on:click="clickAttrTag(item.name,item.id)">{{item.name}}</el-button>
                    </template>
                </div>
           </li>
           <li>
              <span class="WebsiteFixedTit">主机头：</span>
                <div class="tag-panel">
                    <template v-for="(item,index) in hostTagList">
                        <el-button type="primary" v-bind:key="index" v-bind:class="item.isOn?'is-plain':''" size="small" v-on:click="clickHostTag(item.name,item.id)">{{item.name}}</el-button>
                    </template>
                </div>
           </li>
           <li class="WebsiteFixedWeb">
                <div class="tag-panel">
                    <el-button type="primary" v-bind:class="formData.headeruser?'is-plain':''" size="small" v-on:click="clickManage">个人负责网站</el-button>
                    <el-button type="primary" v-bind:class="formData.personuser?'is-plain':''" size="small" v-on:click="clickDevelop">个人开发网站</el-button>
                </div>
           </li>
        </ul>
        <p class="WebsiteFixedFoot" ref="WebsiteFixedFoot">
            <span class="WebsiteQue" v-on:click="searchDialog()">确定</span>
        </p>
    </div>
    <el-dialog :title="dialogText" v-if="menuButtonPermit.includes('Website_add')&&device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" :before-close="handleClose" width="480px">
      <el-form :model="dialogForm">
        <div class="item-form">
          <el-form-item label="品牌：" :label-width="formLabelWidth">
            <el-select v-model="dialogForm.brand" clearable placeholder="请选择品牌">
              <el-option
                v-for="item in brandSelectList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item-form">
          <el-form-item label="语言：" :label-width="formLabelWidth">
            <el-select v-model="dialogForm.language" clearable placeholder="请选择语言">
              <el-option
                v-for="item in languageSelectList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item-form">
          <el-form-item label="主域名：" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.domain" ref="domain"></el-input>
          </el-form-item>
        </div>
        <div class="item-form">
            <el-form-item label="网址：" :label-width="formLabelWidth">
              <el-input v-model="dialogForm.weblink" ref="weblink"></el-input>
            </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="saveWebsiteAddData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'websiteLists',
  data() {
    return {
      scrollHeight:200,
      WebsiteFixedHeight:0,
      operationsWidth:"",
      openClass:false,
      menuButtonPermit:[],
      tableData:[],
      page:1,
      limit:100,
      pageSizeList:[100, 200, 500, 1000],
      totalDataNum:0,
      languageSelectList:[],
      brandSelectList:[],
      departSelectList:[],
      attrTagSelectList:[],
      hostTagSelectList:[],
      brandList:[],
      departList:[],
      languageList:[],
      attrTagList:[],
      hostTagList:[],
      websiteStatus:[
        {name:"全部",isOn:true,type:"primary",key:2,cate:"a"},
        {name:"在线网站",isOn:false,type:"success",key:1,cate:"a"},
        {name:"离线网站",isOn:false,type:"info",key:0,cate:"a"},
        {name:"超时网站",isOn:false,type:"warning",key:1,cate:"b"},
        {name:"异常网站",isOn:false,type:"danger",key:2,cate:"b"},
      ],
      sort:[
        {name:"默认排序",isOn:true,key:"asc"},
        {name:"最新上线",isOn:false,key:"desc"},
      ],
      websiteSelectList:[
        {label:"全部",value:2},
        {label:"在线网站",value:1},
        {label:"离线网站",value:0},
        {label:"超时网站",value:3},
        {label:"异常网站",value:4},
      ],
      websiteType:null,
      attrID:null,
      hostID:null,
      formData:{
        ip:"",
        brand:null,
        language:null,
        departid:null,
        domainattr:null,
        domainheader:null,
        headeruser:null,
        personuser:null,
        order:null,
        is_online:null,
        openstatus:null,
      },
      dialogFormVisible:false,
      dialogText:"",
      formLabelWidth:"110px",
      dialogForm:{
        brand:"",
        language:"",
        domain:"",
        weblink:"",
      },
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device',
      'addWebsite'
    ]),
    isAdd() {
      return this.addWebsite
    }
  },
  mounted(){
      const $this = this;
      this.$nextTick(function () {
        if($this.totalDataNum>50){
           $this.scrollHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-40-20;
        }else{
           $this.scrollHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-40-40-20;
        }
        // 40：page-root上下内边距；40：headerPane上下内边距；20：headerPane底部外边距；
      });
      window.onresize = () => {
          return (() => {
              if($this.totalDataNum>50){
                $this.scrollHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-40-20;
              }else{
                $this.scrollHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-40-40-20;
              }
              // 40：page-root上下内边距；40：headerPane上下内边距；20：headerPane底部外边距；
          })()
      };
  },
  watch: {
      scrollHeight(val) {
        if (!this.timer) {
          this.scrollHeight = val
          this.timer = true
          const $this = this
          setTimeout(function() {
            $this.timer = false
          }, 400)
        }
      },
      isAdd(e){
        if(e){
          this.addTableRow();
        }
      },
      //监听相同路由下参数变化的时候，从而实现异步刷新
      '$route'(to,from) {
        this.initData();
      },
  },
  created(){
    var $this = this;
    $this.initData();
  },
  updated(){
    var $this = this;
    this.$nextTick(function () {
      this.$refs.simpleTable.doLayout();
      if($this.totalDataNum>50){
          $this.scrollHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-$this.$refs.pagePane.offsetHeight-40-40-20;
      }else{
          $this.scrollHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-40-40-20;
      }
      // 40：page-root上下内边距；40：headerPane上下内边距；20：headerPane底部外边距；
    });
  },
  methods:{
    // 搜索结果点击事件
    searchResult(){
      var $this = this;
      $this.hostID=null;
      $this.attrID=null;
      $this.websiteType = null;
      $this.formData.brand=null;
      $this.formData.language=null;
      $this.formData.departid=null;
      $this.formData.domainattr=null;
      $this.formData.domainheader=null;
      $this.formData.headeruser=null;
      $this.formData.personuser=null;
      $this.formData.order=null;
      $this.formData.is_online=null;
      $this.formData.openstatus=null;
      $this.limit = 100;
      $this.page = 1;
      $this.linkTo();
    },
    // 初始化页面数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            console.log(res.data,"操作权限");
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Website_lists')){
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('Website_edit')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('Website_delete')){
                operationsWidth+=66;
              }
              $this.operationsWidth = "" + operationsWidth;
              $this.getLinkParam();
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
    // 外部打开网站
    hrefBlank(url){
      window.open(url,'_blank');
    },
    // 获取网站列表数据
    getWebsiteListData(){
      var $this = this;
      var formData = {};
      formData.page = $this.page;
      formData.limit = $this.limit;
      if($this.formData.order){
        formData.order = $this.formData.order;
      }
      if($this.formData.ip!=""){
        formData.ip = $this.formData.ip;
      }
      if($this.formData.brand){
        formData.brand = $this.formData.brand;
      }
      if($this.formData.language){
        formData.language = $this.formData.language;
      }
      if($this.formData.departid){
        formData.departid = $this.formData.departid;
      }
      if($this.formData.domainattr){
        formData.domainattr = $this.formData.domainattr;
      }
      if($this.formData.domainheader){
        formData.domainheader = $this.formData.domainheader;
      }
      if($this.formData.headeruser){
        formData.headeruser = $this.formData.headeruser;
      }
      if($this.formData.personuser){
        formData.personuser = $this.formData.personuser;
      }
      if($this.formData.is_online||$this.formData.is_online==0){
        formData.is_online = $this.formData.is_online
      }
      if($this.formData.openstatus){
        formData.openstatus = $this.formData.openstatus
      }
      $this.$store.dispatch('website/websiteListAction', formData).then(response=>{
        if(response){
          if(response.status){
            console.log(response,"网站列表");
            response.data.forEach(function(item,index){
              if(item.languagename=="中文"){
                item.isCn = true;
              }else{
                item.isCn = false;
              }
              if(item.speed){
                item.speed = parseFloat(item.speed.split("s")[0]);
              }
              item.tagList = [];
              if(item.domainattr&&item.domainattr != ""){
                if(item.domainattr.indexOf("|")!=-1){
                  var tagArr = item.domainattr.split("|");
                  tagArr.forEach(function(item1,index1){
                    var itemData = {};
                    if(item1.indexOf("-")!=-1){
                      itemData.tag = item1.split("-")[0];
                      itemData.color = item1.split("-")[1];
                    }else{
                      itemData.tag = item1;
                      itemData.color = "#1b3f75";
                    }
                    item.tagList.push(itemData);
                  });
                }else{
                  var itemData = {};
                  if(item.domainattr.indexOf("-")!=-1){
                    itemData.tag = item.domainattr.split("-")[0];
                    itemData.color = item.domainattr.split("-")[1];
                  }else{
                    itemData.tag = item.domainattr;
                    itemData.color = "#1b3f75";
                  }
                  item.tagList.push(itemData);
                }
              }
              item.isHttps = false;
              item.hostList = [];
              if(item.hosttag&&item.hosttag!=""){
                if(item.hosttag.indexOf("https")!=-1){
                  item.isHttps = true;
                }else{
                  item.isHttps = false;
                }
                if(item.hosttag.indexOf("|")!=-1){
                  item.hostList = item.hosttag.split("|");
                }else{
                  item.hostList = [item.hosttag];
                }
              }
              item.uiList=[];
              item.frontEndList = [];
              item.programList = [];
              item.promoteList = [];
              item.teamList = [];
              item.serverList = [];
              if(item.website_designuser&&item.website_designuser!=""){
                if(item.website_designuser.indexOf("|")!=-1){
                  item.uiList = item.website_designuser.split("|");
                }else{
                  item.uiList = [item.website_designuser];
                }
              }
              if(item.website_beforeuser&&item.website_beforeuser!=""){
                if(item.website_beforeuser.indexOf("|")!=-1){
                  item.frontEndList = item.website_beforeuser.split("|");
                }else{
                  item.frontEndList = [item.website_beforeuser];
                }
              }
              if(item.website_backuser&&item.website_backuser!=""){
                if(item.website_backuser.indexOf("|")!=-1){
                  item.programList = item.website_backuser.split("|");
                }else{
                  item.programList = [item.website_backuser];
                }
              }
              if(item.website_pushuser&&item.website_pushuser!=""){
                if(item.website_pushuser.indexOf("|")!=-1){
                  item.promoteList = item.website_pushuser.split("|");
                }else{
                  item.promoteList = [item.website_pushuser];
                }
              }
              if(item.website_headuser&&item.website_headuser!=""){
                if(item.website_headuser.indexOf("|")!=-1){
                  item.teamList = item.website_headuser.split("|");
                }else{
                  item.teamList = [item.website_headuser];
                }
              }
              if(item.website_serveruser&&item.website_serveruser!=""){
                if(item.website_serveruser.indexOf("|")!=-1){
                  item.serverList = item.website_serveruser.split("|");
                }else{
                  item.serverList = [item.website_serveruser];
                }
              }
            });
            $this.tableData = response.data;
            $this.totalDataNum = response.allcount;
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
              }
          }
        }
      });
    },
    // 获取查询相关展示数据
    getSearchItemData(){
      var $this = this;
      $this.$store.dispatch('website/websitePropertyAction', null).then(response=>{
        if(response){
          if(response.status){
            console.log(response,"查询条件数据");
            var brandSelectList = [];
            response.brand.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.brandname;
              brandSelectList.push(itemData);
            });
            $this.brandSelectList = brandSelectList;
            var languageSelectList = [];
            response.language.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.languagename;
              languageSelectList.push(itemData);
            });
            $this.languageSelectList = languageSelectList;
            var departSelectList = [];
            response.depart.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              departSelectList.push(itemData);
            });
            $this.departSelectList = departSelectList;
            var attrTagSelectList = [];
            response.attr.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              attrTagSelectList.push(itemData);
            });
            $this.attrTagSelectList = attrTagSelectList;
            var hostTagSelectList = [];
            response.headattr.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name;
              hostTagSelectList.push(itemData);
            });
            $this.hostTagSelectList = hostTagSelectList;
            if($this.formData.brand){
              response.brand.forEach(function(item,index){
                if(item.id == $this.formData.brand){
                  item.isOn = true;
                }else{
                  item.isOn = false;
                }
              });
            }else{
              response.brand.forEach(function(item,index){
                item.isOn = false;
              });
            }
            if($this.formData.departid){
              response.depart.forEach(function(item,index){
                if(item.id == $this.formData.departid){
                  item.isOn = true;
                }else{
                  item.isOn = false;
                }
              });
            }else{
              response.depart.forEach(function(item,index){
                item.isOn = false;
              });
            }
            if($this.formData.domainattr){
              response.attr.forEach(function(item,index){
                if(item.name == $this.formData.domainattr){
                  item.isOn = true;
                  $this.attrID = item.id;
                }else{
                  item.isOn = false;
                }
              });
            }else{
              response.attr.forEach(function(item,index){
                item.isOn = false;
              });
            }
            if($this.formData.domainheader){
              response.headattr.forEach(function(item,index){
                if(item.name == $this.formData.domainheader){
                  item.isOn = true;
                  $this.hostID = item.id;
                }else{
                  item.isOn = false;
                }
              });
            }else{
              response.headattr.forEach(function(item,index){
                item.isOn = false;
              });
            }
            if($this.formData.language){
              response.language.forEach(function(item,index){
                if(item.id == $this.formData.language){
                  item.isOn = true;
                }else{
                  item.isOn = false;
                }
              });
            }else{
              response.language.forEach(function(item,index){
                item.isOn = false;
              });
            }
            $this.brandList = response.brand;
            $this.departList = response.depart;
            $this.attrTagList = response.attr;
            $this.hostTagList = response.headattr;
            $this.languageList = response.language;
            $this.getWebsiteListData();
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
    // 选择品牌
    clickBrand(id){
      var $this = this;
      $this.formData.brand = id;
      $this.formData.ip="";
      $this.linkTo();
    },
    // 选择语言
    clickLanguage(id){
      var $this = this;
      $this.formData.language = id;
      $this.formData.ip="";
      $this.linkTo();
    },
    // 选择部门
    clickDepart(id){
      var $this = this;
      $this.formData.departid = id;
      $this.formData.ip="";
      $this.linkTo();
    },
    // 选择属性标签
    clickAttrTag(name,id){
      var $this = this;
      $this.formData.domainattr = name;
      $this.formData.ip="";
      $this.attrID = id;
      $this.linkTo();
    },
    // 选择主机头标签
    clickHostTag(name,id){
      var $this = this;
      $this.formData.domainheader = name;
      $this.formData.ip="";
      $this.hostID = id;
      $this.linkTo();
    },
    // 选择网站状态
    clickStatus(cate,key){
      var $this = this;
      $this.formData.ip="";
      if(cate=="a"){
        $this.formData.openstatus = null;
        $this.formData.is_online = key;
      }else{
        $this.formData.is_online = null;
        $this.formData.openstatus = key;
      }
      $this.linkTo();
    },
    // 选择排序方式
    clickSort(key){
      var $this = this;
      $this.formData.order = key;
      $this.formData.ip="";
      $this.linkTo();
    },
    // 选择个人负责网站
    clickManage(){
      var $this = this;
      $this.formData.ip="";
      $this.formData.personuser = null;
      $this.formData.headeruser = $this.userInfo.id;
      $this.linkTo();
    },
    // 选择个人开发网站
    clickDevelop(){
      var $this = this;
      $this.formData.ip="";
      $this.formData.headeruser = null;
      $this.formData.personuser = $this.userInfo.id;
      $this.linkTo();
    },
    // 获取页面跳转携带的参数
    getLinkParam(){
      var $this = this;
      var sortList = $this.sort;
      var websiteStatus = $this.websiteStatus;
      sortList.forEach(function(item,index){
        if(item.key=="asc"){
          item.isOn = true;
        }else{
          item.isOn = false;
        }
      });
      websiteStatus.forEach(function(item,index){
        if(index == 0){
          item.isOn = true;
        }else{
          item.isOn = false;
        }
      });
      if($this.$route.query.brandID){
        $this.formData.brand = parseInt($this.$route.query.brandID);
      }
      if($this.$route.query.languageID){
        $this.formData.language = parseInt($this.$route.query.languageID);
      }
      if($this.$route.query.departID){
        $this.formData.departid = parseInt($this.$route.query.departID);
      }
      if($this.$route.query.tag){
        $this.formData.domainattr = $this.$route.query.tag;
      }
      if($this.$route.query.host){
        $this.formData.domainheader = $this.$route.query.host;
      }
      if($this.$route.query.manageID){
        $this.formData.headeruser = parseInt($this.$route.query.manageID);
      }
      if($this.$route.query.developID){
        $this.formData.personuser = parseInt($this.$route.query.developID);
      }
      if($this.$route.query.sort){
        $this.formData.order = $this.$route.query.sort;
        sortList.forEach(function(item,index){
          if(item.key == $this.formData.order){
            item.isOn = true;
          }else{
            item.isOn = false;
          }
        });
      }
      $this.sort = sortList;
      if($this.$route.query.key){
        $this.formData.ip = $this.$route.query.key;
      }
      if($this.$route.query.online){
        $this.formData.is_online = parseInt($this.$route.query.online);
        $this.websiteType = parseInt($this.$route.query.online);
        websiteStatus.forEach(function(item,index){
          if(item.key == $this.formData.is_online&&item.cate == "a"){
            item.isOn = true;
          }else{
            item.isOn = false;
          }
        });
      }
      if($this.$route.query.status){
        $this.formData.openstatus = parseInt($this.$route.query.status);
        if($this.formData.openstatus==1){
          $this.websiteType = 3;
        }
        if($this.formData.openstatus==2){
          $this.websiteType = 4;
        }
        websiteStatus.forEach(function(item,index){
          if(item.key == $this.formData.openstatus&&item.cate == "b"){
            item.isOn = true;
          }else{
            item.isOn = false;
          }
        });
      }
      $this.websiteStatus = websiteStatus;
      if($this.$route.query.page){
        $this.page = $this.$route.query.page;
      }
      if($this.$route.query.limit){
        $this.limit = $this.$route.query.limit;
      }
      $this.getSearchItemData();
    },
    // 页面自跳转
    linkTo(){
      var $this = this;
      var queryObj = {};
      if($this.formData.brand){
        queryObj.brandID = $this.formData.brand;
      }
      if($this.formData.language){
        queryObj.languageID = $this.formData.language;
      }
      if($this.formData.departid){
        queryObj.departID = $this.formData.departid;
      }
      if($this.formData.domainattr){
        queryObj.tag = $this.formData.domainattr;
      }
      if($this.formData.domainheader){
        queryObj.host = $this.formData.domainheader;
      }
      if($this.formData.headeruser){
        queryObj.manageID = $this.formData.headeruser;
      }
      if($this.formData.personuser){
        queryObj.developID = $this.formData.personuser;
      }
      if($this.formData.order){
        queryObj.sort = $this.formData.order;
      }
      if($this.formData.ip!=''){
        queryObj.key = $this.formData.ip;
      }
      if($this.formData.is_online!=null){
        queryObj.online = $this.formData.is_online;
      }
      if($this.formData.openstatus){
        queryObj.status = $this.formData.openstatus;
      }
      if($this.formData.page>1){
        queryObj.page = $this.page;
      }
      if($this.formData.page>1||($this.formData.page==1&&$this.formData.limit>100)){
        queryObj.limit = $this.limit;
      }
      $this.$router.push({page:'Website/lists',query:queryObj});
    },
    // 跳转到网站日志列表页
    linkToLog(row,index){
      var $this = this;
      if($this.device=="desktop"){
        var routeUrl =  $this.$router.resolve({name:'websiteLogList',query:{websiteID:row.id,website:row.domain}});
        window.open(routeUrl.href,'_blank');
      }else{
        $this.$router.push({name:'websiteLogList',query:{websiteID:row.id,website:row.domain}});
      }
    },
    // 修改网站数据
    editTableRow(row,index){
      var $this = this;
      if($this.device=="desktop"){
        var routeUrl =  $this.$router.resolve({name:'websiteEdit',query:{websiteID:row.id,website:row.domain}});
        window.open(routeUrl.href,'_blank');
      }else{
        $this.$router.push({name:'websiteEdit',query:{websiteID:row.id,website:row.domain}});
      }
    },
    // 每页显示条数改变事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val;
      this.initData();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.initData();
    },
    // 关闭添加网站弹窗
    handleClose(){
      var $this = this;
      $this.dialogFormVisible = false;
      $this.$store.dispatch('app/closeWebsite');
    },
    // 添加表格行数据
    addTableRow(row,index){
      this.dialogFormVisible = true;
      this.dialogText = "添加网站";
      this.resetFormData();
    },
    // 保存添加网站数据
    saveWebsiteAddData(){
      var $this = this;
      if(!$this.validationForm()){
        return false;
      }
      $this.$store.dispatch('website/websiteAddAction', $this.dialogForm).then(response=>{
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
            $this.handleClose();
            $this.initData();
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 重置添加数据表单
    resetFormData(){
      var $this = this;
      $this.dialogForm.brand = "";
      $this.dialogForm.language = "";
      $this.dialogForm.domain = "";
      $this.dialogForm.weblink = "";
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.brand == ""){
        $this.$message({
            showClose: true,
            message: '错误：网站品牌不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.dialogForm.language == ""){
        $this.$message({
            showClose: true,
            message: '错误：网站语种不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.dialogForm.domain == ""){
        $this.$message({
            showClose: true,
            message: '错误：主域名不能为空！',
            type: 'error'
        });
        $this.$refs['domain'].focus();
        return false;
      }
      return true;
    },
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      $this.$confirm('此操作将删除该网站, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('website/websiteDeleteAction', {id:row.id}).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.initData();
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
            }
          });
      }).catch(() => {
          $this.$message({
            type: 'info',
            message: '已取消删除'
          });          
      });
    },
    // 高级筛选
    searchDialog(){
      var $this = this;
      $this.openClass=!$this.openClass;
      if($this.openClass){
          $this.WebsiteFixedHeight = $this.$refs.WebsiteFixed.offsetHeight-$this.$refs.WebsiteFixedFoot.offsetHeight-10-10;
      }
    },
  }
}
</script>
<style lang="scss" scoped>
</style>