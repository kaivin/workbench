<template>
  <div class="page-root bbs-panel scroll-panel" ref="boxPane">
    <p class="breadcrumb" ref="breadcrumbPane">
      <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
      <template v-for="item in breadcrumbList">
        <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
        <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
      </template>
      <router-link class="breadcrumb-link" :to="'/Website/logList?websiteID='+websiteID+'&website='+website"><b>-</b><span>{{website}}工作日志</span></router-link>
      <span class="breadcrumb-link"><b>-</b><span>发布日志</span></span>
    </p>
    <el-card v-show="!isPreview" class="box-card WebsiteCard scroll-card" shadow="hover">
      <div class="card-content" ref="cardContent">
        <div class="main-content">
          <table class="ArticleFour">
            <tr>
              <td class="type-title"><span>所属网站：</span></td>
              <td>
                <div class="item-form buttonOne">
                      <el-button type="primary" size="small" style="margin:4px;">{{website}} [ {{websiteID}} ] </el-button>
                </div>
              </td>
            </tr>
            <tr>
              <td class="type-title"><span>系统标签：</span></td>
              <td>
                <div class="item-form buttonTwo">
                  <el-checkbox-group class="checkbox-panel" v-model="formData.systemTag" size="small">
                    <el-checkbox :label="item.id" v-for="item in postSystemTag" v-bind:key="item.id" border>{{item.name}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </td>
            </tr>
            <tr>
              <td class="type-title"><span>自定义标签：</span></td>
              <td>
                  <div class="item-form"  style="width:252px;">
                      <el-input
                        placeholder="请输入标签内容"
                        v-model="formData.tag"
                        size="small"
                        clearable>
                      </el-input>
                  </div>
              </td>
            </tr>
            <tr>
              <td class="type-title"><span>标题：</span></td>
              <td>
                <div class="item-form-group ArticleFourTit flex-box">
                  <div class="item-form flex-content">
                      <el-input
                        placeholder="请输入文章标题"
                        v-model="formData.title"
                        size="small"
                        ref="title"
                        clearable>
                      </el-input>
                  </div>
                  <div class="item-form inline-item title-color">
                    <strong>标题颜色：</strong>
                    <div class="item-form-panel">
                          <span v-for="(item,index) in predefineColors" v-bind:key="index" v-bind:style="{background:item}" v-on:click="clickTitColor(item)" v-bind:class="item==isTitColor?'TitColor':''"></span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="postSystemTag.length>0">
              <td class="type-title"><span>内容：</span></td>
              <td>
                  <div class="item-form editor-panel">
                    <div class="ueditor-button" v-if="activeTab=='textarea'"><el-checkbox v-model="formData.is_center" @change="changeCenterHandler" style="margin-right: 5px;" label="表格文字水平居中" size="mini" border></el-checkbox><span class="btn" v-on:click="removeSpace">清除空格</span><span class="btn" v-on:click="removeTableStyle">清除表格默认样式</span><span class="btn" v-on:click="removeHtmlStyle">清除所有默认样式</span></div>
                  <el-tabs v-model="activeTab" type="border-card" class="tab-card" :before-leave="tabClickHandler">
                    <el-tab-pane label="富文本编辑器" name="textarea" id="editor-rich">
                      <vue-ueditor-wrap v-model="formData.content" :config="editorConfig" @ready="ready" editor-id="editor-rich-text"></vue-ueditor-wrap>
                    </el-tab-pane>
                    <el-tab-pane label="Markdown" name="markdown">
                      <v-md-editor 
                        left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code"
                        v-model="formData.markdownContent" @change="changeMarkdownHandler" height="600px" mode="editable"></v-md-editor>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </td>
            </tr>
            <tr>
              <td class="type-title"><span>备注：</span></td>
              <td>
                <div class="item-form">
                  <div class="item-textarea">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入文章备注"
                      v-model="formData.remarks"
                      size="small"
                      clearable>
                    </el-input>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="item-form-group ArticleFourTag">
                  <div class="item-form buttonTwo inline-item other-td">
                    <strong>评论：</strong>
                    <div class="item-form-panel">
                      <el-checkbox v-model="formData.isCommentClose" label="关闭评论" border size="small"></el-checkbox>
                    </div>
                  </div>
                  <div class="item-form buttonTwo inline-item other-td">
                    <strong>匿名发布：</strong>
                    <div class="item-form-panel">
                      <el-checkbox v-model="formData.isAnonymous" label="匿名发布" border size="small"></el-checkbox>
                    </div>
                  </div>
                  <div class="item-form buttonTwo inline-item other-td">
                    <strong>置顶：</strong>
                    <div class="item-form-panel">
                      <el-checkbox v-model="formData.isTop" label="置顶" border size="small"></el-checkbox>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <div class="card-header WebServerAddEditBtn ArticleFive">
            <el-button type="primary" class="updateBtn" :class="isDisabled?'isDisabled':''" :disabled="isDisabled" size="small" v-on:click="saveArticle()" v-if="menuButtonPermit.includes('Website_logedit')||menuButtonPermit.includes('Website_logadd')"><i class="svg-i planeWhite" ><svg-icon icon-class="planeWhite" /></i>发布</el-button>
            <el-button type="primary" class="resetBtn" size="small" v-on:click="resetFormData()">重置</el-button>
            <el-button type="primary" class="resetBtn" size="small" v-on:click="perviewPage()" v-if="menuButtonPermit.includes('Website_logedit')||menuButtonPermit.includes('Website_logadd')">预览</el-button>
          </div>
        </div>
      </div>
    </el-card>
    <div v-show="isPreview" class="preview-page">
      <div class="article-info">
        <div class="ArticleSixFlTop">
          <h1>{{previewData.title}}</h1>
          <h2>网站：{{website}} [ {{websiteID}} ]</h2>
          <div class="ArticleSixFlTopTag clearfix">
            <p class="ArticleSixFlTopTagFl">
              <span><i class="svg-i" ><svg-icon icon-class="art-author" /></i>{{previewData.anthor}}</span>
              <span class="back" v-on:click="backSendPost"><i class="svg-i" ><svg-icon icon-class="back" /></i>点击返回</span>
            </p>
            <p class="ArticleSixFlTopTagFr">阅读：{{previewData.hits}}<span>|</span>发布时间：{{previewData.createdTime}} </p>
          </div>
        </div>
        <div class="info-content" v-bind:class="formData.is_markdown==1?'vuepress-markdown-body':'rich-text'" v-html="previewData.content"></div>
      </div>
    </div>
    <el-backtop target=".scroll-panel"></el-backtop>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
  name: 'websiteLogAddEdit',
  components: { VueUeditorWrap },
  data() {
    return {
      breadcrumbList:[],
      menuButtonPermit:[],
      activeTab:"textarea",
      isPreview:false,
      scrollHeight:200,
      postSystemTag:[],
      websiteID:"",
      website:"",
      isTitColor:0,
      isTitColorNum:"#333333",
      formData:{
        id:0,
        systemTag:[],
        tag:"",
        tagBgColor:"#1b3f75",
        title:"",
        titleColor:"",
        content:"",
        markdownContent:"",
        remarks:"",
        isCommentClose:false,
        isAnonymous:false,
        isTop:false,
        is_markdown:0,
        is_center:false,
      },
      predefineColors: [
        '#222222',
        '#a40000',
        '#ff0000',
        '#fa6c01',
        '#ff9406',
        '#0051a4',
        '#129b30',
        '#0b4c5f',
        '#610b38',
      ],
      editorConfig: {
        UEDITOR_HOME_URL: '/ueditor/',
        // 服务端接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: process.env.NODE_ENV=='development'?'http://172.16.10.24:8017/php/controller.php':process.env.VUE_APP_BASE_API+'/php/controller.php',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 工具栏是否可以浮动
        autoFloatEnabled: false,
        // 初始容器高度
        initialFrameHeight: 600,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 关闭自动保存
        enableAutoSave: false,
        saveInterval: 24*60*60*60*1000,
        maximumWords:20000,
        insertorderedlist:{
          //自定的样式
          'num1': '1),2),3)...',
          'num2': '(1),(2),(3)...',
          'cn': '一,二,三....',
          'cn1': '一),二),三)....',
          'cn2': '(一),(二),(三)....',
          //系统自带
          'decimal': '' ,// '1,2,3...'
          'lower-alpha': '' , // 'a,b,c...'
          'lower-roman': '' , //'i,ii,iii...'
          'upper-alpha': '' , //'A,B,C'
          'upper-roman': '' //'I,II,III...'
        },
        toolbars: [
            [
                'source', //源代码
                "|",
                'undo', //撤销
                'redo', //重做
                '|',
                'formatmatch', //格式刷
                'removeformat', //清除格式
                'pasteplain', //纯文本粘贴模式
                '|',
                // 'preview', //预览
                'cleardoc', //清空文档
                'selectall', //全选
                'searchreplace', //查询替换
                '|',
                'bold', //加粗
                'italic', //斜体
                'underline', //下划线
                'strikethrough', //删除线
                'superscript', //上标
                'subscript', //下标
                'touppercase', //字母大写
                'tolowercase', //字母小写
                'blockquote', //引用
                '|',
                'fontfamily', //字体
                'fontsize', //字号
                'forecolor', //字体颜色
                'backcolor', //背景色
                '|',
                'justifyleft', //居左对齐
                'justifyright', //居右对齐
                'justifycenter', //居中对齐
                'justifyjustify', //两端对齐
                '|',
                'indent', //首行缩进
                'rowspacingtop', //段前距
                'lineheight', //行间距
                'rowspacingbottom', //段后距
                '|',
                'insertorderedlist', //有序列表
                'insertunorderedlist', //无序列表
                '|',
                'link', //超链接
                'unlink', //取消链接
                'anchor', //锚点
                '|',
                'customstyle', //自定义标题
                'paragraph', //段落格式
                '|',
                'inserttable', //插入表格
                'edittable', //表格属性
                'edittd', //单元格属性
                '|',
                'date', //日期
                'time', //时间
                '|',
                // 'simpleupload', //单图上传
                'insertimage', //多图上传
                'imagenone', //默认
                'imageleft', //左浮动
                'imagecenter', //居中
                'imageright', //右浮动
                '|',
                'insertvideo', //视频
                'attachment', //附件
                '|',
                'emotion', //表情
                'spechars', //特殊字符
                '|',
                'horizontal', //分隔线
                'pagebreak', //分页
                '|',
                'background', //背景
                'autotypeset', //自动排版
                'map', //Baidu地图
                'scrawl', //涂鸦
                'fullscreen', //全屏
                '|',
            ]
        ]
      },
      articleData:{},
      previewData:{
        createdTime:"",
        updateTime:"",
        typeName:"",
        anthor:"",
        hits:0,
        title:"",
        content:"",
      },
      isDisabled:false,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'menuData'
    ]),
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
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
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
    // 重置页面
    resetFormPage(){
      var $this = this;
      $this.clearFormData();
      if($this.formData.id!=0){
        $this.initPage();
      }
    },
    // 初始化数据
    initData(){
        var $this = this;
        $this.loadingFun();
        $this.getUserMenuButtonPermit();
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
                if($this.$route.query.logID){
                  if(!$this.menuButtonPermit.includes('Website_logedit')){
                    $this.$message({
                      showClose: true,
                      message: "未被分配日志修改权限",
                      type: 'error',
                      duration:6000
                    });
                    $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
                  }else{
                    if($this.$route.query.websiteID&&$this.$route.query.website){
                      $this.getSystemTagData();
                    }else{
                      $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
                    }
                  }
                }else{
                  if(!$this.menuButtonPermit.includes('Website_logadd')){
                    $this.$message({
                      showClose: true,
                      message: "未被分配日志发布权限",
                      type: 'error',
                      duration:6000
                    });
                    $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
                  }else{
                    if($this.$route.query.websiteID&&$this.$route.query.website){
                      $this.getSystemTagData();
                    }else{
                      $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
                    }
                  }
                }
            }else{
                $this.$message({
                  showClose: true,
                  message: "未被分配日志发布修改权限",
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
    // 获取系统标签
    getSystemTagData(){
      var $this = this;
      $this.$store.dispatch('website/systemTagListAction', null).then(response=>{
        if(response){
          if(response.status){
            $this.postSystemTag = response.data;
            $this.getArticleInfo();
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
    // 5、 你可以在ready方法中拿到editorInstance实例,所有API和官方的实例是一样了。http://fex.baidu.com/ueditor/#api-common
    ready (ue) {
      ue.addListener('ready', () => {
      })
    },
    // 获取编辑文章详情
    getArticleInfo(){
      var $this = this;
      $this.websiteID = $this.$route.query.websiteID;
      $this.website = $this.$route.query.website;
      if($this.$route.query.logID){
          $this.formData.id = parseInt($this.$route.query.logID);
          $this.$store.dispatch('website/websiteLogEditInfoAction', {id:$this.formData.id}).then(response=>{
            if(response){
              if(response.status){
                $this.articleData = response.data;
                $this.initPage();
              }else{
                if(response.permitstatus&&response.permitstatus==2){
                  $this.$message({
                    showClose: true,
                    message: "未被分配该日志修改权限",
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
      }else{
        $this.isLoading.close();
      }
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.formData.id = $this.articleData.id;
      $this.formData.tag = $this.articleData.mytags;
      $this.formData.tagBgColor = $this.articleData.mytagscolor!=""?$this.articleData.mytagscolor:'#1b3f75';
      $this.formData.title = $this.articleData.title;
      $this.formData.titleColor = $this.articleData.titlecolor;
      $this.formData.is_markdown = $this.articleData.is_markdown;
      if($this.articleData.is_markdown==1){
        $this.formData.markdownContent = $this.articleData.markdowntext;
        $this.activeTab = "markdown";
      }else{
        $this.formData.markdownContent = "";
        $this.activeTab = "textarea";
      }
      $this.formData.content = $this.articleData.content;
      $this.formData.remarks = $this.articleData.remarks;
      $this.formData.isCommentClose = $this.articleData.issay==0?true:false;
      $this.formData.isAnonymous = $this.articleData.is_hidename==0?false:true;
      $this.formData.is_center= $this.articleData.is_center==1?false:true;
      $this.formData.isTop = $this.articleData.is_top==0?false:true;
      if($this.articleData.tagsid){
        if($this.articleData.tagsid.indexOf(",")!=-1){
          var systemTagArr = $this.articleData.tagsid.split(",");
          systemTagArr.forEach(function(item,index){
            $this.formData.systemTag.push(parseInt(item));
          });
        }else{
          var systemTag = parseInt($this.articleData.tagsid);
          $this.formData.systemTag = [systemTag];
        }
      }else{
        $this.formData.systemTag = [];
      }
      $this.isLoading.close();
    },
    // 重置添加文章表单
    clearFormData(){
      var $this = this;
      $this.formData.id = 0;
      $this.formData.systemTag = [];
      $this.formData.tag = "";
      $this.formData.tagBgColor = "#1b3f75";
      $this.formData.title = "";
      $this.formData.titleColor = "";
      $this.formData.content = "";
      $this.formData.is_markdown = 0;
      $this.formData.markdownContent = "";
      $this.formData.remarks = "";
      $this.formData.isCommentClose = false;
      $this.formData.isAnonymous = false;
      $this.formData.isTop = false;
      $this.formData.is_center = false;
      $this.activeTab = "textarea";
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.formData.title == ""){
        $this.$message({
            showClose: true,
            message: '错误：文章标题不能为空！',
            type: 'error'
        });
        $this.$refs['title'].focus();
        return false;
      }
      if($this.formData.content == ""){
        $this.$message({
            showClose: true,
            message: '错误：文章内容不能为空！',
            type: 'error'
        });
        return false;
      }
      return true;
    },
    // 发布文章
    saveArticle(){
      var $this = this;
      if(!$this.isDisabled){
        if(!$this.validationForm()){
          return false;
        }
        $this.isDisabled=true;
        $this.loadingFun();
        var formData = {}
        formData.website_id = $this.websiteID;
        formData.id = $this.formData.id;
        formData.title = $this.formData.title;
        formData.content = $this.formData.content;
        formData.markdowntext = $this.formData.markdownContent;
        formData.is_markdown = $this.formData.is_markdown;
        formData.tags_id = $this.formData.systemTag;
        formData.mytags = $this.formData.tag;
        formData.mytagscolor = $this.formData.tagBgColor;
        formData.remarks = $this.formData.remarks;
        formData.is_top = $this.formData.isTop?1:0;
        formData.issay = $this.formData.isCommentClose?0:1;
        formData.is_hidename = $this.formData.isAnonymous?1:0;
        formData.is_center = $this.formData.is_center?2:1;
        formData.titlecolor = $this.formData.titleColor;
        var pathUrl = "";
        if($this.formData.id!==0){
          pathUrl = 'website/websiteLogEditAction';
        }else{
          pathUrl = 'website/websiteLogAddAction';
        }
        $this.$store.dispatch(pathUrl, formData).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.isLoading.close();
              setTimeout(()=>{
                $this.isDisabled=false;
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
        });
      }
    },
    // markdown文本发生变化时执行事件
    changeMarkdownHandler(text,html){
      this.formData.content = html;
    },
    // 文本编辑器选项卡切换事件
    tabClickHandler(activeName,oldActiveName){
      var $this = this;
      return $this.$confirm('两种编辑器的内容不能相互转换，切换编辑器将清空当前编辑器已编辑内容，是否确认切换编辑器？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(activeName=="markdown"){
          $this.formData.is_markdown = 1;
          $this.formData.content = "";
          $this.formData.is_center = false;
          // $this.activeTab = "markdown";
        }else{
          $this.formData.is_markdown = 0;
          $this.formData.content = "";
          $this.formData.markdownContent = "";
          $this.formData.is_center = false;
          // $this.activeTab = "textarea";
        }
      }).catch(() => {
        throw new Error("已取消切换");        
      });
    },
    // 返回添加编辑页面
    backSendPost(){
      var $this = this;
      $this.isPreview = false;
      $this.resetPreviewData();
    },
    // 重置预览信息
    resetPreviewData(){
      var $this = this;
      $this.previewData.typeName = "";
      $this.previewData.createdTime = "";
      $this.previewData.updateTime = "";
      $this.previewData.hits = 0;
      $this.previewData.anthor = "";
      $this.previewData.title = "";
      $this.previewData.content = "";
    },
    // 预览按钮点击事件
    perviewPage(){
      var $this = this;
      $this.isPreview = true;
      $this.previewData.typeName = $this.website+" [ "+$this.websiteID+" ] ";
      if($this.formData.id == 0){
        $this.previewData.createdTime = $this.getNowTime();
        $this.previewData.updateTime = $this.getNowTime();
        $this.previewData.hits = 0;
        $this.previewData.anthor = $this.formData.isAnonymous?"匿名":$this.userInfo.name;
        $this.previewData.title = $this.formData.title;
        $this.previewData.content = $this.formData.content;
      }else{
        $this.previewData.createdTime = $this.articleData.addtime;
        $this.previewData.updateTime = $this.articleData.updatetime;
        $this.previewData.anthor = $this.formData.isAnonymous?"匿名":$this.articleData.createname;
        $this.previewData.hits = $this.articleData.hits;
        $this.previewData.title = $this.formData.title;
        $this.previewData.content = $this.formData.content;
      }
    },
    // 获取当前时间
    getNowTime(){
      var data = new Date();
      var month =data.getMonth() < 10 ? "0" + (data.getMonth() + 1) : data.getMonth() + 1;
      var date = data.getDate() < 10 ? "0" + data.getDate() : data.getDate();
      var hour = data.getHours() <10?"0"+data.getHours():data.getHours();
      var minutes = data.getMinutes() <10?"0"+data.getMinutes():data.getMinutes();
      var seconds = data.getSeconds() <10?"0"+data.getSeconds():data.getSeconds();
      var dateTime = data.getFullYear() + "-" + month + "-" + date+" "+hour+":"+minutes+":"+seconds;
      return dateTime;
    },
    // 点击设置文字颜色事件
    clickTitColor(ValColor){
      var $this=this;
       var titleColor="";
       if($this.isTitColorNum==ValColor){
         $this.isTitColor=0;
         $this.isTitColorNum="#333333";
         titleColor="";
       }else{
         $this.isTitColor=ValColor;
         $this.isTitColorNum=ValColor;
         titleColor=ValColor;
       }
       $this.formData.titleColor=ValColor;
    },
    
    // 清除所有默认样式
    removeHtmlStyle(){
      var $this = this;
      var html = $this.formData.content;
      let relStyle = /style\s*?=\s*?([‘"])[\s\S]*?\1/g;
      let relClass = /class\s*?=\s*?([‘"])[\s\S]*?\1/g;
      let relWidth = /width\s*?=\s*?([‘"])[\s\S]*?\1/g;
      let relHeight = /height\s*?=\s*?([‘"])[\s\S]*?\1/g;
      let newHtml = "";
      if (html) {
        newHtml = html.replace(relStyle, "").replace(relClass, "").replace(relWidth, "").replace(relHeight, "");
      }
      $this.formData.content = newHtml;
    },
    // 清除空格
    removeSpace(){
      var $this = this;
      var html = $this.formData.content;
      let relSpace = /&nbsp;/g;
      html = html.replace(relSpace,'');
      $this.formData.content = html;
    },
    // 清除表格默认样式
    removeTableStyle(){
      var $this = this;
      var html = $this.formData.content;
      let relStyle = /style\s*?=\s*?([‘"])[\s\S]*?\1/g;
      let relClass = /class\s*?=\s*?([‘"])[\s\S]*?\1/g;
      let relWidth = /width\s*?=\s*?([‘"])[\s\S]*?\1/g;
      let relHeight = /height\s*?=\s*?([‘"])[\s\S]*?\1/g;
      html = html.replace(/(<(table|tr|col|colgroup|tbody|thead|tfooter))[^>]*(>)/gi,'$1$3');
      html = html.replace(/<td[^>]*>/gi,function(match,capture){
        var itemTd = match.replace(relStyle, "").replace(relClass, "").replace(relWidth, "").replace(relHeight, "");
        return itemTd;
      });
      $this.formData.content = html;
    },
    // 表格文字水平居中
    changeCenterHandler(e){
      var $this = this;
      console.log(e);
      var html = $this.formData.content;
      if(e){
        html = html.replace(/<table/gi, "<table class='is-center'");
      }else{
        html = html.replace(/<table class="is-center"/gi, "<table");
      }
      $this.formData.content = html;
    },
  }
}
</script>
<style lang="scss" scoped>
</style>