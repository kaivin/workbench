<template>
  <div class="page-root" v-bind:class="isPreview?'scroll-panel':''" ref="boxPane">
    <el-card v-show="!isPreview" class="box-card scroll-card" shadow="hover">
        <div slot="header">
          <div class="card-header" ref="headerPane">
            <el-button type="primary" size="small" icon="el-icon-refresh" v-on:click="resetFormData()">重置</el-button>
            <el-button type="primary" size="small" icon="el-icon-s-promotion" v-on:click="saveArticle()" v-if="menuButtonPermit.includes('Article_edit')||menuButtonPermit.includes('Article_add')">发布</el-button>
            <el-button type="primary" size="small" icon="el-icon-document" v-on:click="perviewPage()" v-if="menuButtonPermit.includes('Article_edit')||menuButtonPermit.includes('Article_add')">预览</el-button>
          </div>
        </div>
        <div class="card-content" ref="cardContent">
          <div class="scroll-panel" v-bind:style="{height:scrollHeight+'px'}">
            <table class="table-post">
              <tr>
                <td class="type-title"><span>论坛栏目：</span></td>
                <td>
                  <div class="item-form">
                    <div class="tag-panel">
                        <el-button type="primary" plain v-bind:class="item.plain?'is-active':''" size="small" v-for="item in postType" v-bind:key="item.id" v-on:click="clickPostType(item.id)">{{item.typename}}</el-button>
                    </div>
                    <el-popover
                      placement="left"
                      width="200"
                      trigger="hover"
                      content="文章所属论坛栏目，不可为空">
                      <i slot="reference" class="el-icon-s-opportunity"></i>
                    </el-popover>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="type-title"><span>系统标签：</span></td>
                <td>
                  <div class="item-form">
                    <el-checkbox-group class="checkbox-panel" v-model="formData.systemTag" size="small">
                      <el-checkbox :label="item.id" v-for="item in postSystemTag" v-bind:key="item.id" border>{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                    <el-popover
                      placement="left"
                      width="200"
                      trigger="hover"
                      content="文章可以拥有的标签属性，可为空">
                      <i slot="reference" class="el-icon-s-opportunity"></i>
                    </el-popover>
                  </div>
                </td>
              </tr>
              <tr v-if="permitField.includes('mytags')">
                <td class="type-title"><span>自定义标签：</span></td>
                <td>
                  <div class="item-form-group">
                    <div class="item-form" style="width:200px;float:left;">
                      <div class="item-form-panel">
                        <el-input
                          placeholder="请输入标签内容"
                          v-model="formData.tag"
                          size="small"
                          clearable>
                        </el-input>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="文章可以拥有的自定义标签，可为空">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-form inline-item" style="width:192px;float:left;">
                      <strong>标签背景色：</strong>
                      <div class="item-form-panel">
                        <el-color-picker
                          v-model="formData.tagBgColor"
                          :predefine="predefineColors" size="small">
                        </el-color-picker>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="自定义标签背景色">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="type-title"><span>标题：</span></td>
                <td>
                  <div class="item-form-group flex-box">
                    <div class="item-form flex-content">
                      <div class="item-form-panel">
                        <el-input
                          placeholder="请输入文章标题"
                          v-model="formData.title"
                          size="small"
                          ref="title"
                          clearable>
                        </el-input>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="文章标题，不可为空">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-form inline-item title-color" style="width:180px;">
                      <strong>标题颜色：</strong>
                      <div class="item-form-panel">
                        <el-color-picker
                          v-model="formData.titleColor"
                          :predefine="predefineColors" size="small">
                        </el-color-picker>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="文章标题颜色，可为空">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="userList.length>0">
                <td class="type-title"><span>内容：</span></td>
                <td>
                  <div class="item-form">
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
                    <el-popover
                      placement="left"
                      width="400"
                      trigger="hover"
                      content="文章主要内容，可选择使用富文本编辑器或者使用markdown编辑器，编辑器切换将清空当前编辑器已编辑内容，不可为空">
                      <i slot="reference" class="el-icon-s-opportunity"></i>
                    </el-popover>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="type-title"><span>备注：</span></td>
                <td>
                  <div class="item-form">
                    <div class="item-form-panel">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入文章备注"
                        v-model="formData.remarks"
                        size="small"
                        clearable>
                      </el-input>
                    </div>
                    <el-popover
                      placement="left"
                      width="200"
                      trigger="hover"
                      content="文章备注，可为空">
                      <i slot="reference" class="el-icon-s-opportunity"></i>
                    </el-popover>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <div class="item-form-group">
                    <div class="item-form inline-item other-td" style="width:270px;float:left;">
                      <strong>评论：</strong>
                      <div class="item-form-panel">
                        <el-checkbox v-model="formData.isCommentClose" label="关闭评论" border size="small"></el-checkbox>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="是否关闭评论，默认都可参与评论">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-form inline-item other-td" style="width:270px;float:left;">
                      <strong>共享修改：</strong>
                      <div class="item-form-panel">
                        <el-checkbox v-model="formData.isEditShareOpen" label="共享修改" border size="small"></el-checkbox>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="文章是否可以被他人修改，默认只有文章发布者及上级部门可修改">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <div class="item-form-group">
                    <div class="item-form inline-item other-td" style="width:270px;float:left;">
                      <strong>匿名发布：</strong>
                      <div class="item-form-panel">
                        <el-checkbox v-model="formData.isAnonymous" label="匿名发布" border size="small"></el-checkbox>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="是否匿名发布该文章，默认不匿名">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-form inline-item other-td" style="width:270px;float:left;">
                      <strong>置顶：</strong>
                      <div class="item-form-panel">
                        <el-checkbox v-model="formData.isTop" label="置顶" border size="small"></el-checkbox>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="文章是否置顶显示，置顶文章也可排序，根据排序数值大小进行排序，默认不置顶">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-form inline-item other-td" style="width:270px;float:left;">
                      <strong>排序：</strong>
                      <div class="item-form-panel">
                        <el-input
                          v-model="formData.sort"
                          size="small" clearable>
                        </el-input>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="数值越小，排位越靠前，数值可为负，可为空">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="permitField.includes('is_updatetime')">
                <td class="type-title"><span>更新修改时间：</span></td>
                <td>
                  <div class="item-form" style="width:154px;float:left;">
                      <div class="item-form-panel">
                       <el-checkbox v-model="formData.is_updatetime" label="更新修改时间" border size="small"></el-checkbox>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="只有勾选此项，首页推荐相关设置才会生效">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
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
                          style="width:130px"
                          clearable>
                        </el-input>
                        <em>天</em>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="文章可以在首页保留显示的天数，默认是3天，不可为空">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                </td>
              </tr>
              <tr v-if="permitField.includes('indexshowdepart')">
                <td class="type-title"><span>首页推荐部门：</span></td>
                <td>
                  <div class="item-form">
                    <el-checkbox-group class="checkbox-panel" v-model="formData.recomDepart" size="small">
                      <el-checkbox :label="item.id" v-for="item in departList" v-bind:key="item.id" border>{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                    <el-popover
                      placement="left"
                      width="500"
                      trigger="hover"
                      content="哪些有当前论坛栏目阅读权限且有当前文章浏览权限的部门可以在首页推荐看到该文章，首页推荐如不可看，但拥有当前论坛栏目阅读权限和当前文章浏览权限，则可在论坛栏目文章列表中看到该文章">
                      <i slot="reference" class="el-icon-s-opportunity"></i>
                    </el-popover>
                  </div>
                </td>
              </tr>
              <tr v-if="permitField.includes('readpermit')">
                <td class="type-title"><span>默认权限：</span></td>
                <td>
                  <div class="item-form-group">
                    <div class="item-form" style="width:126px;float:left;">
                      <div class="item-form-panel">
                        <el-checkbox v-model="formData.isAllPermit" @change="changeSelectHandler" label="默认权限" border size="small"></el-checkbox>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="勾选该项相当于全选浏览权限部门">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="permitField.includes('lookpermitdepart')">
                <td class="type-title"><span>部门浏览权限：</span></td>
                <td>
                  <div class="item-form">
                    <el-checkbox-group class="checkbox-panel" v-model="formData.readDepart" size="small">
                      <el-checkbox :label="item.id" v-for="item in departList" v-bind:key="item.id" :disabled="item.disabled" border>{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                    <el-popover
                      placement="left"
                      width="300"
                      trigger="hover"
                      content="哪些部门可以有当前文章的浏览权限，前提是部门拥有当前文章所属论坛栏目的浏览权限">
                      <i slot="reference" class="el-icon-s-opportunity"></i>
                    </el-popover>
                  </div>
                </td>
              </tr>
              <tr v-if="permitField.includes('lookuserid')">
                <td class="type-title"><span>用户浏览权限：</span></td>
                <td>
                  <div class="item-form">
                    <el-select v-model="formData.readUser" filterable clearable multiple placeholder="请选择可浏览用户" style="width: 100%;">
                      <el-option
                        v-for="item in userList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-popover
                      placement="left"
                      width="500"
                      trigger="hover"
                      content="哪些用户可以拥有当前文章的浏览权限，前提是用户拥有当前文章所属论坛栏目的浏览权限，部门浏览权限未勾选的部门所属用户中，有需要当前文章的浏览权限的用户，则使用此功能给予浏览权限">
                      <i slot="reference" class="el-icon-s-opportunity"></i>
                    </el-popover>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
    </el-card>
    <div v-show="isPreview" class="preview-page">
      <div class="article-header">
        <div class="flex-row multiple-column">
          <div class="flex-column txt-content">
            <div class="flex-row">
              <div class="flex-column txt-font nowrap"><span>栏目：</span></div>
              <div class="flex-column txt-content nowrap">
                <strong>{{previewData.typeName}}</strong>
              </div>
            </div>
          </div>
          <div class="flex-column txt-content">
            <div class="flex-row">
              <div class="flex-column txt-font nowrap"><span>创建者：</span></div>
              <div class="flex-column txt-content nowrap">
                <strong>{{previewData.anthor}}</strong>
              </div>
            </div>
          </div>
          <div class="flex-column txt-content">
            <div class="flex-row">
              <div class="flex-column txt-font nowrap"><span>创建时间：</span></div>
              <div class="flex-column txt-content nowrap">
                <strong>{{previewData.createdTime}}</strong>
              </div>
            </div>
          </div>
          <div class="flex-column txt-content">
            <div class="flex-row">
              <div class="flex-column txt-font nowrap"><span>修改时间：</span></div>
              <div class="flex-column txt-content nowrap">
                <strong>{{previewData.updateTime}}</strong>
              </div>
            </div>
          </div>
          <div class="flex-column txt-content">
            <div class="flex-row">
              <div class="flex-column txt-font nowrap"><span>点击量：</span></div>
              <div class="flex-column txt-content">
                <strong>{{previewData.hits}}</strong>
              </div>
              <div class="flex-column txt-content" style="line-height:0;">
                <el-tag class="btn-back" type="danger" v-on:click="backSendPost">返回</el-tag>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-row">
          <div class="flex-column txt-font nowrap"><span>标题：</span></div>
          <div class="flex-column txt-content">
            <strong>{{previewData.title}}</strong>
          </div>
        </div>
      </div>
      <div class="info-content" v-bind:class="formData.is_markdown==1?'vuepress-markdown-body':'rich-text'" v-html="previewData.content"></div>
    </div>
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
      activeTab:"textarea",
      isPreview:false,
      isSort:false,
      scrollHeight:200,
      postType:[],
      postSystemTag:[],
      departList:[],
      userList:[],
      permitField:[],
      formData:{
        id:0,
        postTypeID:0,
        systemTag:[],
        tag:"",
        tagBgColor:"#1b3f75",
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
        day:"3",
        recomDepart:[],
        isAllPermit:false,
        readDepart:[],
        readUser:[],
        is_markdown:0,
        is_updatetime:false,
      },
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
      ],
      editorConfig: {
        UEDITOR_HOME_URL: '/ueditor/',
        // 服务端接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: process.env.NODE_ENV=='development'?'http://172.16.10.27:8017/php/controller.php':process.env.VUE_APP_BASE_API+'/php/controller.php',
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
      }
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
      this.$nextTick(function () {
        $this.scrollHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-30-25;
        // 30：page-root上下内边距；20：按钮父级上下内边距；
      });
      window.onresize = () => {
          return (() => {
            $this.scrollHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-30-25;
            // 30：page-root上下内边距；20：按钮父级上下内边距；
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
  },
  created(){
    var $this = this;
    $this.initData();
  },
  methods:{
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
      $this.getUserMenuButtonPermit();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        console.log(res,"操作权限");
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.$route.query.id){
              if(!$this.menuButtonPermit.includes('Article_edit')){
                $this.$message({
                  showClose: true,
                  message: "未被分配该文章修改权限",
                  type: 'error',
                  duration:6000
                });
                $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
              }else{
                if($this.device==="desktop"){
                  $this.getShowData();
                }else{
                  $this.$message({
                    showClose: true,
                    message: "请前往PC端做修改操作",
                    type: 'error',
                    duration:6000
                  });
                  $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
                }
              }
            }else{
              if(!$this.menuButtonPermit.includes('Article_add')){
                $this.$message({
                  showClose: true,
                  message: "未被分配文章发布权限",
                  type: 'error',
                  duration:6000
                });
                $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
              }else{
                if($this.device==="desktop"){
                  $this.getShowData();
                }else{
                  $this.$message({
                    showClose: true,
                    message: "请前往PC端做添加操作",
                    type: 'error',
                    duration:6000
                  });
                  $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
                }
              }
            }
          }else{
            $this.$message({
              showClose: true,
              message: "未被分配文章发布修改权限",
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
    // 获取当前登录用户添加发布时可选择的论坛栏目
    getShowData(){
      var $this = this;
      $this.$store.dispatch('article/getEditPostDataAction', null).then(response=>{
        if(response){
          if(response.status){
            console.log(response,"所有展示数据")
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
            $this.permitField = response.myfield;
            if($this.$route.query.id){
              $this.formData.id = parseInt($this.$route.query.id);
              $this.getArticleInfo();
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
          console.log(ue);
      })
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
        console.log(response,"文章详情");
          if(response){
            if(response.status){
              $this.articleData = response.data;
              $this.initArticle($this.articleData)
            }else{
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
      $this.formData.tagBgColor = data.mytagscolor;
      $this.formData.title = data.title;
      $this.formData.titleColor = data.titlecolor;
      $this.formData.is_markdown = data.is_markdown;
      if(data.is_markdown==1){
        $this.formData.markdownContent = data.markdowntext;
        $this.activeTab = "markdown";
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
      $this.formData.tagBgColor = "#1b3f75";
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
      if(!$this.validationForm()){
        return false;
      }
      var formData = {}
      formData.id = $this.formData.id;
      formData.typeid = $this.formData.postTypeID;
      formData.title = $this.formData.title;
      formData.content = $this.formData.content;
      formData.markdowntext = $this.formData.markdownContent;
      formData.is_markdown = $this.formData.is_markdown;
      formData.tags_id = $this.formData.systemTag;
      if($this.isSort){
        formData.sort = $this.formData.sort;
      }
      if($this.permitField.includes("mytags")){
        formData.mytags = $this.formData.tag;
        formData.mytagscolor = $this.formData.tagBgColor;
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
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
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
          // $this.activeTab = "markdown";
        }else{
          $this.formData.is_markdown = 0;
          $this.formData.content = "";
          $this.formData.markdownContent = "";
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
  }
}
</script>
<style lang="scss" scoped>
.table-post{
  width: 100%;
  overflow: hidden;
  border-top: 1px solid $border;
  border-left: 1px solid $border;
  tr{
    td{
      padding: 5px 10px;
      vertical-align: middle;
      border-right: 1px solid $border;
      border-bottom: 1px solid $border;
    }
    td.type-title{
      width: 140px;
      text-align: right;
      span{
        display: inline-block;
        line-height: 32px;
        vertical-align: middle;
      }
    }
  }
}
.item-form-panel{
  margin: 5px 0;
  em{
    font-style: normal;
    font-weight: normal;
    margin-left: 10px;
    line-height: 32px;
  }
}
.item-form-group.flex-box{
  display: flex;
  .flex-content{
    flex: 1;
  }
}
.item-form{
    padding-right: 30px;
    position: relative;
    &.inline-item.title-color{
      padding-left: 115px;
      &:before{
        display: none;
      }
      >strong{
        width: 105px;
      }
    }
    &.inline-item.other-title{
      padding-left: 115px;
      >strong{
        width: 105px;
      }
    }
    &.other-title+&.other-title{
      >strong{
        &:before{
          display: none;
        }
      }
    }
    &.inline-item.other-td{
      padding-left: 140px;
      >strong{
        width: 130px;
        &:before{
          display: none;
        }
      }
    }
    &.inline-item{
      padding-left: 130px;
      &:before{
        content:'';
        display: block;
        width: 1px;
        background: $border;
        position: absolute;
        top: -5px;
        height: 52px;
        right:0;
      }
      ::v-deep .el-color-picker{
        vertical-align: top;
      }
      >strong{
        display: block;
        position: absolute;
        left:0;
        top:0;
        width: 120px;
        text-align: right;
        font-weight: normal;
        padding: 0 10px;
        height: 42px;
        line-height: 42px;
        &:before,&:after{
          content:'';
          display: block;
          width: 1px;
          background: $border;
          position: absolute;
          top: -5px;
          height: 52px;
        }
        &:before{
          left:0;
        }
        &:after{
          right:0;
        }
      }
    }
    >span{
      display: block;
      width: 30px;
      height: 42px;
      position: absolute;
      right:0;
      top:0;
      text-align: center;
      line-height: 42px;
      font-size: 14px;
      cursor: pointer;
      color: #bbb;
    }
    &:before,
    &:after {
      content: "";
      display: table;
    }
    &:after {
      clear: both;
    }
}
.tag-panel{
    width: 100%;
    overflow: hidden;
    font-size:0;
    .el-button{
        margin-right: 10px;
        margin-bottom: 5px;
        margin-top: 5px;
        vertical-align: top;
    }
    .el-button+.el-button{
      margin-left:0!important;
    }
}
.checkbox-panel{
  .el-checkbox{
    margin: 5px 10px 5px 0!important;
  }
}
.tab-card{
  margin: 5px 0;
}
.btn-back{
  cursor: pointer;
}
.article-header{
  margin-bottom: 15px;
  border-top: 1px solid $primaryBorder;
  border-left: 1px solid $primaryBorder;
  display: block;
  .flex-row{
    display: flex;
    .flex-column{
      padding: 10px;
      line-height: 28px;
      font-size: 15px;
      border-bottom: 1px solid $primaryBorder;
      border-right: 1px solid $primaryBorder;
    }
    .nowrap{
      word-break: keep-all;
      word-wrap:normal;
      white-space:nowrap;
    }
    .txt-content{
      flex: 1;
    }
    &.multiple-column{
      flex-wrap: wrap;
      >.flex-column{
        padding:0;
        border-bottom:none;
        border-right:none;
      }
    }
  }
}
</style>