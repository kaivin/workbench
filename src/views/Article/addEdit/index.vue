<template>
  <div class="page-root bbs-panel scroll-panel" ref="boxPane">
    <p class="breadcrumb">
      <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
      <template v-for="item in breadcrumbList">
        <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
        <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
      </template>
      <span class="breadcrumb-link"><b>-</b><span>发布文章</span></span>
    </p>
    <el-card class="box-card ArticleCard scroll-card" v-show="!isPreview" shadow="hover">
        <div class="card-content" ref="cardContent">
          <div class="main-content">
            <table class="ArticleFour">
              <tr>
                <td class="type-title"><span>论坛栏目：</span></td>
                <td>
                  <div class="item-form buttonOne">
                      <el-button type="primary" plain v-bind:class="item.plain?'is-active':''" size="small" v-for="item in postType" v-bind:key="item.id" v-on:click="clickPostType(item.id)">{{item.typename}}</el-button>
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
              <tr v-if="permitField.includes('mytags')">
                <td colspan="2">
                    <p class="type-title" v-if="permitField.includes('mytags')"><span>自定义标签：</span></p>
                    <div class="item-form" v-if="permitField.includes('mytags')" style="float:left; width:252px;">
                        <el-input
                          placeholder="请输入标签内容"
                          v-model="formData.tag"
                          size="small"
                          clearable>
                        </el-input>
                    </div>
                    <p class="type-title" v-if="permitField.includes('uid')"><span>发布人：</span></p>
                    <div class="item-form itemacces" v-if="permitField.includes('uid')" style="float:left; width:252px;">
                      <el-select v-model="formData.uid" size="small" filterable placeholder="请选择发布人">
                        <el-option
                          v-for="item in userList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
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
              <tr v-if="userList.length>0">
                <td class="type-title"><span>内容：</span></td>
                <td>
                  <div class="item-form editor-panel">
                    <div class="ueditor-button" v-if="activeTab=='textarea'"><el-checkbox v-model="formData.is_center" @change="changeCenterHandler" style="margin-right: 5px;"  label="表格文字水平居中" size="mini" border></el-checkbox><span class="btn" v-on:click="removeSpace">清除空格</span><span class="btn" v-on:click="removeTableStyle">清除表格默认样式</span><span class="btn" v-on:click="removeHtmlStyle">清除所有默认样式</span></div>
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
                      <strong>共享修改：</strong>
                      <div class="item-form-panel">
                        <el-checkbox v-model="formData.isEditShareOpen" label="共享修改" border size="small"></el-checkbox>
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
                    <div class="item-form inline-item other-td">
                      <strong>排序：</strong>
                      <div class="item-form-panel" style="width:80px">
                        <el-input
                          v-model="formData.sort"
                          size="small" clearable>
                        </el-input>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="permitField.includes('is_updatetime')">
                <td class="type-title"><span>更新修改时间：</span></td>
                <td>
                  <div class="item-form buttonTwo" style="width:154px;float:left;">
                      <div class="item-form-panel">
                      <el-checkbox v-model="formData.is_updatetime" label="更新修改时间" border size="small"></el-checkbox>
                      </div>
                    </div>
                </td>
              </tr>
              <tr v-if="permitField.includes('showdays')">
                <td class="type-title"><span>首页推荐天数：</span></td>
                <td>
                  <div class="item-form" style="width:190px;float:left;">
                      <div class="item-form-panel">
                        <el-input
                          placeholder="推荐天数"
                          v-model="formData.day"
                          size="small"
                          style="width:121px"
                          clearable>
                        </el-input>
                        <em>天</em>
                      </div>
                    </div>
                </td>
              </tr>
              <tr v-if="permitField.includes('indexshowdepart')">
                <td class="type-title"><span>首页推荐部门：</span></td>
                <td>
                  <div class="item-form buttonTwo">
                    <el-checkbox-group class="checkbox-panel" v-model="formData.recomDepart" size="small">
                      <el-checkbox :label="item.id" v-for="item in departList" v-bind:key="item.id" border>{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </td>
              </tr>
              <tr v-if="permitField.includes('readpermit')">
                <td class="type-title"><span>默认权限：</span></td>
                <td>
                  <div class="item-form-group">
                    <div class="item-form buttonTwo" style="width:126px;float:left;">
                      <div class="item-form-panel">
                        <el-checkbox v-model="formData.isAllPermit" @change="changeSelectHandler" label="默认权限" border size="small"></el-checkbox>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="permitField.includes('lookpermitdepart')">
                <td class="type-title"><span>部门浏览权限：</span></td>
                <td>
                  <div class="item-form buttonTwo">
                    <el-checkbox-group class="checkbox-panel" v-model="formData.readDepart" size="small">
                      <el-checkbox :label="item.id" v-for="item in departList" v-bind:key="item.id" :disabled="item.disabled" border>{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </td>
              </tr>
              <tr v-if="permitField.includes('lookuserid')">
                <td class="type-title"><span>用户浏览权限：</span></td>
                <td>
                  <div class="item-form itemacces">
                    <el-select v-model="formData.readUser" size="small" filterable clearable multiple placeholder="请选择可浏览用户">
                      <el-option
                        v-for="item in userList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </td>
              </tr>
            </table>      
            <div class="card-header WebServerAddEditBtn ArticleFive" ref="headerPane">
              <div class="header-content">
                <el-button type="primary" class="updateBtn" size="small" :class="isDisabled?'isDisabled':''" :disabled="isDisabled" v-on:click="saveArticle()" v-if="menuButtonPermit.includes('Article_edit')||menuButtonPermit.includes('Article_add')"><i class="svg-i planeWhite" ><svg-icon icon-class="planeWhite" /></i>发布</el-button>
                <el-button type="primary" class="resetBtn" size="small" v-on:click="resetFormData()">重置</el-button>
                <el-button type="primary" class="resetBtn" size="small" v-on:click="perviewPage()" v-if="menuButtonPermit.includes('Article_edit')||menuButtonPermit.includes('Article_add')">预览</el-button>
              </div>
            </div>
          </div>
        </div>
    </el-card>
    <div v-show="isPreview" class="preview-page">
      <div class="article-info">
        <div class="ArticleSixFlTop">
          <h1>{{previewData.title}}</h1>
          <div class="ArticleSixFlTopTag clearfix">
            <p class="ArticleSixFlTopTagFl">
              <span><i class="svg-i" ><svg-icon icon-class="art-depart" /></i>{{previewData.typeName}}</span>
              <span><i class="svg-i" ><svg-icon icon-class="art-author" /></i>{{previewData.anthor}}</span>
              <span><i class="svg-i" ><svg-icon icon-class="art-edit-time" /></i>{{previewData.updateTime}}</span>
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
  name: 'articleAddEdit',
  components: { VueUeditorWrap },
  data() {
    return {
      menuButtonPermit:[],
      breadcrumbList:[],
      activeTab:"textarea",
      isPreview:false,
      postType:[],
      postSystemTag:[],
      departList:[],
      userList:[],
      permitField:[],
      isTitColor:0,
      isTitColorNum:"#333333",
      formData:{
        id:0,
        postTypeID:0,
        systemTag:[],
        tag:"",
        title:"",
        titleColor:"",
        content:"",
        markdownContent:"",
        remarks:"",
        isCommentClose:false,
        isEditShareOpen:false,
        isAnonymous:false,
        sort:"",
        isTop:false,
        day:"2",
        recomDepart:[],
        isAllPermit:false,
        readDepart:[],
        readUser:[],
        uid:'',
        is_markdown:0,
        is_updatetime:false,
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
        maximumWords:100000000000,
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
                'preview', //预览
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
      isInit:false,
      count:0,
      isLoading:null,
      isDisabled:false,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'menuData'
    ]),
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
      var pageID = 0;
      if($this.$router.currentRoute.meta.id.indexOf('-')!=-1){
        pageID = parseInt($this.$router.currentRoute.meta.id.split("-")[1]);
      }else{
        pageID = $this.$router.currentRoute.meta.id;
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
    resetFormData(){
      var $this = this;
      $this.clearFormData();
      if($this.$route.query.id){
        $this.initArticle($this.articleData);
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
            if($this.$route.query.id){
              if(!$this.menuButtonPermit.includes('Article_edit')){
                $this.isLoading.close();
                $this.$message({
                  showClose: true,
                  message: "未被分配该文章修改权限",
                  type: 'error',
                  duration:6000
                });
                $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
              }else{
                  $this.getShowData();
              }
            }else{
              if(!$this.menuButtonPermit.includes('Article_add')){
                $this.isLoading.close();
                $this.$message({
                  showClose: true,
                  message: "未被分配文章发布权限",
                  type: 'error',
                  duration:6000
                });
                $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
              }else{
                  $this.getShowData();
              }
            }
          }else{
            $this.isLoading.close();
            $this.$message({
              showClose: true,
              message: "未被分配文章发布修改权限",
              type: 'error',
              duration:6000
            });
            $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
          }
        }else{
          $this.isLoading.close();
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 获取当前登录用户添加发布时可选择的论坛栏目
    getShowData(){
      var $this = this;
      $this.$store.dispatch('article/getEditPostDataAction', null).then(response=>{
        if(response){
          if(response.status){
            response.userwritetypepermit.forEach(function(item,index){
              item.plain = false;
            });
            $this.postType = response.userwritetypepermit;
            $this.postSystemTag = response.tags;
            $this.departList = response.depart;
            response.user.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name+"[" + item.id + "]"
              $this.userList.push(itemData);
            });
            $this.formData.uid=$this.userInfo.id;
            $this.permitField = response.myfield;
            if($this.$route.query.id){
              $this.formData.id = parseInt($this.$route.query.id);
              $this.getArticleInfo();
            }else{
              $this.isLoading.close();
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
    // 论坛栏目点击切换状态事件
    clickPostType(id){
      var $this = this;
      var data = $this.postType;
      $this.changePostType(data,id,$this);
    },
    // 论坛栏目选中状态切换
    changePostType(data,id,$this){
      data.forEach(function(item,index){
        if(item.id == id){
          item.plain = true;
          $this.formData.postTypeID = item.id;
        }else{
          item.plain = false;
        }
      });
      $this.postType = data;
    },
    // 5、 你可以在ready方法中拿到editorInstance实例,所有API和官方的实例是一样了。http://fex.baidu.com/ueditor/#api-common
    ready (ue) {
      ue.addListener('ready', () => {
      });
    },
    // 改变可选部门状态
    changeDepartSelected(data){
      var $this = this;
      if($this.formData.isAllPermit){
        data.forEach(function(item,index){
          item.disabled = true;
        });
        $this.departList = data;
      }else{
        data.forEach(function(item,index){
          item.disabled = false;
        });
        $this.departList = data;
      }
    },
    // 获取编辑文章详情
    getArticleInfo(){
      var $this = this;
      $this.$store.dispatch('article/postArticleEditInfoAction', {id:$this.formData.id}).then(response=>{
          if(response){
            if(response.status){
              $this.articleData = response.data;
              $this.isLoading.close();
              $this.initArticle($this.articleData)
            }else{
              $this.isLoading.close();
              if(response.permitstatus&&response.permitstatus==2){
                $this.$message({
                  showClose: true,
                  message: "未被分配该文章修改权限",
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
          }else{
            $this.isLoading.close();
          }
      });
    },
    // 初始化编辑文章详情
    initArticle(data){
      var $this = this;
      var postType = $this.postType;
      $this.changePostType(postType,data.typeid,$this);
      $this.formData.postTypeID = data.typeid;
      $this.formData.id = data.id;
      $this.formData.tag = data.mytags;
      $this.formData.title = data.title;
      $this.formData.titleColor = data.titlecolor;
      $this.formData.is_markdown = data.is_markdown;
      if(data.is_markdown==1){
        $this.formData.markdownContent = data.markdowntext;
        $this.activeTab = "markdown";
        $this.isInit = true;
      }else{
        $this.formData.markdownContent = "";
        $this.activeTab = "textarea";
      }
      $this.formData.content = data.content;
      $this.formData.remarks = data.remarks;
      $this.formData.isCommentClose = data.issay==0?true:false;
      $this.formData.isEditShareOpen = data.isedit==0?false:true;
      $this.formData.isAnonymous = data.is_hidename==0?false:true;
      $this.formData.sort = data.sort==0?"":data.sort;
      $this.formData.isTop = data.is_top==0?false:true;
      $this.formData.day = data.showdays;
      $this.formData.isAllPermit = data.readpermit==0?false:true;
      $this.formData.is_updatetime = data.is_updatetime==0?false:true;
      $this.formData.is_center = data.is_center==1?false:true;
      if(data.tagsid){
        if(data.tagsid.indexOf(",")!=-1){
          var systemTagArr = data.tagsid.split(",");
          systemTagArr.forEach(function(item,index){
            $this.formData.systemTag.push(parseInt(item));
          });
        }else{
          var systemTag = parseInt(data.tagsid);
          $this.formData.systemTag = [systemTag];
        }
      }else{
        $this.formData.systemTag = [];
      }
      if(data.indexshowdepart){
        if(data.indexshowdepart.indexOf(",")!=-1){
          var recomDepartArr = data.indexshowdepart.split(",");
          recomDepartArr.forEach(function(item,index){
            $this.formData.recomDepart.push(parseInt(item));
          });
        }else{
          var recomDepart = parseInt(data.indexshowdepart);
          $this.formData.recomDepart = [recomDepart];
        }
      }else{
        $this.formData.recomDepart = [];
      }
      if(data.lookpermitdepart){
        if(data.lookpermitdepart.indexOf(",")!=-1){
          var readDepartArr = data.lookpermitdepart.split(",");
          readDepartArr.forEach(function(item,index){
            $this.formData.readDepart.push(parseInt(item));
          });
        }else{
          var readDepart = parseInt(data.lookpermitdepart);
          $this.formData.readDepart = [readDepart];
        }
      }else{
        $this.formData.readDepart = [];
      }
      if(data.uid&&data.uid!=''){
        $this.formData.uid=data.uid;
      }else{
        $this.formData.uid=$this.userInfo.id;
      }
      if(data.lookuserid){
        if(data.lookuserid.indexOf(",")!=-1){
          var readUserArr = data.lookuserid.split(",");
          readUserArr.forEach(function(item,index){
            $this.formData.readUser.push(parseInt(item));
          });
        }else{
          var readUser = parseInt(data.lookuserid);
          $this.formData.readUser = [readUser];
        }
      }else{
        $this.formData.readUser = [];
      }
      $this.changeDepartSelected($this.departList);
    },
    // 重置添加文章表单
    clearFormData(){
      var $this = this;
      $this.formData.id = 0;
      $this.formData.postTypeID = 0;
      $this.formData.systemTag = [];
      $this.formData.tag = "";
      $this.formData.title = "";
      $this.formData.titleColor = "";
      $this.formData.content = "";
      $this.formData.is_markdown = 0;
      $this.formData.markdownContent = "";
      $this.formData.remarks = "";
      $this.formData.isCommentClose = false;
      $this.formData.isEditShareOpen = false;
      $this.formData.isAnonymous = false;
      $this.formData.sort = "";
      $this.formData.isTop = false;
      $this.formData.day = "3";
      $this.formData.recomDepart = [];
      $this.formData.isAllPermit = false;
      $this.formData.readDepart = [];
      $this.formData.readUser = [];
      $this.formData.is_updatetime = false;
      $this.formData.is_center = false;
      $this.activeTab = "textarea";
      $this.changePostType($this.postType,$this.formData.postTypeID,$this);
      $this.changeDepartSelected($this.departList);
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.formData.postTypeID == 0){
        $this.$message({
            showClose: true,
            message: '错误：论坛栏目不能为空！',
            type: 'error'
        });
        return false;
      }
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
    // 默认权限切换事件
    changeSelectHandler(e){
      var $this = this;
      var departList = $this.departList;
      if(e){
        departList.forEach(function(item,index){
          item.disabled = true;
        });
        $this.departList = departList;
        $this.formData.readDepart = [];
      }else{
        departList.forEach(function(item,index){
          item.disabled = false;
        });
        $this.departList = departList;
      }
    },
    // 发布文章
    saveArticle(){
      var $this = this;
      if(!$this.isDisabled){
        if(!$this.validationForm()){
          return false;
        }
        $this.isDisabled=true;
        var formData = {}
        formData.id = $this.formData.id;
        formData.typeid = $this.formData.postTypeID;
        formData.title = $this.formData.title;
        formData.content = $this.formData.content;
        formData.markdowntext = $this.formData.markdownContent;
        formData.is_markdown = $this.formData.is_markdown;
        formData.tags_id = $this.formData.systemTag;
        formData.is_center = $this.formData.is_center?2:1;
        formData.sort = $this.formData.sort;
        if($this.permitField.includes("mytags")){
          formData.mytags = $this.formData.tag;
        }
        formData.remarks = $this.formData.remarks;
        if($this.permitField.includes("showdays")){
          formData.showdays = $this.formData.day;
        }
        if($this.permitField.includes("indexshowdepart")){
          formData.indexshowdepart = $this.formData.recomDepart;
        }
        if($this.permitField.includes("lookpermitdepart")){
          formData.lookpermitdepart = $this.formData.readDepart;
        }
        if($this.permitField.includes("lookuserid")){
          formData.lookuserid = $this.formData.readUser;
        }
        if($this.permitField.includes("uid")){
          formData.uid = $this.formData.uid;
        }
        formData.is_top = $this.formData.isTop?1:0;
        formData.issay = $this.formData.isCommentClose?0:1;
        formData.isedit = $this.formData.isEditShareOpen?1:0;
        formData.is_hidename = $this.formData.isAnonymous?1:0;
        formData.titlecolor = $this.formData.titleColor;
        if($this.permitField.includes("readpermit")){
          formData.readpermit = $this.formData.isAllPermit?1:0;
        }
        if($this.permitField.includes("is_updatetime")){
          formData.is_updatetime = $this.formData.is_updatetime?1:0;
        }
        var pathUrl = "";
        if($this.formData.id!==0){
          pathUrl = 'article/postArticleEditAction';
        }else{
          pathUrl = 'article/postArticleAddAction';
        }
        $this.$store.dispatch(pathUrl, formData).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.$router.push({path:'/Article/index',query:{id:$this.formData.postTypeID}});
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
      if($this.isInit&&$this.count==0){
        $this.isInit = false;
      }else{
        $this.count +=1;
        return $this.$confirm('两种编辑器的内容不能相互转换，切换编辑器将清空当前编辑器已编辑内容，是否确认切换编辑器？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(activeName=="markdown"){
            $this.formData.is_markdown = 1;
            $this.formData.content = "";
            // $this.activeTab = "markdown";
            $this.formData.is_center = false;
          }else{
            $this.formData.is_markdown = 0;
            $this.formData.content = "";
            $this.formData.markdownContent = "";
            // $this.activeTab = "textarea";
            $this.formData.is_center = false;
          }
        }).catch(() => {
          throw new Error("已取消切换");        
        });
      }
    },
    // 返回添加编辑页面
    backSendPost(){
      var $this = this;
      $this.isPreview = false;
      document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
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
      if($this.formData.id == 0){
        if($this.formData.postTypeID==0){
          $this.previewData.typeName="";
        }else{
          $this.postType.forEach(function(item,index){
            if(item.id==$this.formData.postTypeID){
              $this.previewData.typeName = item.typename;
            }
          });
        }
        $this.previewData.createdTime = $this.getNowTime();
        $this.previewData.updateTime = $this.getNowTime();
        $this.previewData.hits = 0;
        $this.previewData.anthor = $this.formData.isAnonymous?"匿名":$this.userInfo.name;
        $this.previewData.title = $this.formData.title;
        $this.previewData.content = $this.formData.content;
      }else{
        $this.postType.forEach(function(item,index){
          if(item.id==$this.formData.postTypeID){
            $this.previewData.typeName = item.typename;
          }
        });
        $this.previewData.createdTime = $this.articleData.addtime;
        $this.previewData.updateTime = $this.articleData.updatetime;
        $this.previewData.anthor = $this.formData.isAnonymous?"匿名":$this.articleData.createname;
        $this.previewData.hits = $this.articleData.hits;
        $this.previewData.title = $this.formData.title;
        $this.previewData.content = $this.formData.content;
      }
      document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
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
    // 清除空格
    removeSpace(){
      var $this = this;
      var html = $this.formData.content;
      let relSpace = /&nbsp;/g;
      html = html.replace(relSpace,'');
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