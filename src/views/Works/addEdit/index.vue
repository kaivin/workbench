<template>
  <div class="page-root bbs-panel work-add-edit scroll-panel" ref="boxPane">
    <p class="breadcrumb" ref="breadcrumbPane">
        <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
        <template v-for="item in breadcrumbList">
          <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
          <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
        </template>
        <span class="breadcrumb-link"><b>-</b>{{breadcrumbName}}</span>
    </p>
    <el-card class="box-card ArticleCard scroll-card" shadow="hover">
        <div class="card-content" ref="cardContent">
          <div class="main-content">
            <table class="ArticleFour">
              <tr>
                <td class="type-title"><span>工单标题：</span></td>
                <td>
                  <div class="item-form-group flex-box" style="padding-right: 4px;">
                    <div class="item-form flex-content">
                        <el-input
                          placeholder="请输入文章标题"
                          v-model="formData.title"
                          size="small"
                          ref="title"
                          clearable>
                        </el-input>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="type-title"><span>工单内容：</span></td>
                <td>
                  <div class="item-form" style="border:1px solid #e9ecf0;margin: 4px 0 4px 4px;">
                    <vue-ueditor-wrap v-model="formData.content" :config="editorConfig" @ready="ready" editor-id="editor-rich-text"></vue-ueditor-wrap>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <div class="item-form-group ArticleFourTag">
                    <div class="item-form inline-item other-td">
                      <strong>工单类型：</strong>
                      <div class="item-form-panel buttonOne" style="width:213px;">
                        <el-button type="primary" plain v-bind:class="item.plain?'is-active':''" size="small" v-for="item in typeList" v-bind:key="item.id" v-on:click="clickWordOrderType(item.id)">{{item.workname}}</el-button>
                      </div>
                    </div>
                    <div class="item-form inline-item other-td">
                      <strong>工单标签：</strong>
                      <div class="item-form-panel buttonTwo">
                        <el-checkbox-group class="checkbox-panel" v-model="formData.tags_id" size="small">
                            <el-checkbox :label="item.id" v-for="item in systemTag" v-bind:key="item.id" border>{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <div class="item-form-group ArticleFourTag">
                    <div class="item-form inline-item other-td">
                      <strong>自定义标签：</strong>
                      <div class="item-form-panel">
                        <el-input
                          placeholder="请输入标签内容"
                          v-model="formData.mytags"
                          size="small"
                          clearable>
                        </el-input>
                      </div>
                    </div>
                    <div class="item-form inline-item other-td">
                      <strong>截止时间：</strong>
                      <div class="item-form-panel">
                        <el-date-picker
                            v-model="formData.endtime"
                            type="datetime"
                            placeholder="选择日期时间"
                            class="date-time"
                            value-format = "yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                      </div>
                    </div>
                    <div class="item-form inline-item other-td">
                      <strong>工单积分：</strong>
                      <div class="item-form-panel">
                        <el-input
                          placeholder="请输入工单积分"
                          v-model="formData.score"
                          size="small"
                          clearable>
                        </el-input>
                      </div>
                    </div>
                    <div class="item-form inline-item other-td">
                      <strong>发布人：</strong>
                      <div class="item-form-panel">
                        <el-select v-model="formData.publishuserid" size="small" filterable disabled placeholder="请选择发布人">
                            <el-option
                            v-for="item in userList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                      </div>
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
                        <el-checkbox v-model="formData.issay" label="关闭评论" border size="small"></el-checkbox>
                      </div>
                    </div>
                    <div class="item-form buttonTwo inline-item other-td">
                      <strong>共享修改：</strong>
                      <div class="item-form-panel">
                        <el-checkbox v-model="formData.isedit" label="共享修改" border size="small"></el-checkbox>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </table>      
            <div class="card-header WebServerAddEditBtn ArticleFive" ref="headerPane">
              <div class="header-content">
                <el-button type="primary" class="updateBtn" size="small" v-on:click="saveArticle()" v-if="menuButtonPermit.includes('Works_workedit')||menuButtonPermit.includes('Works_publishwork')"><i class="svg-i planeWhite" ><svg-icon icon-class="planeWhite" /></i>发布</el-button>
                <el-button type="primary" class="resetBtn" size="small" v-on:click="resetFormData()">重置</el-button>
              </div>
            </div>
          </div>
        </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
  name: 'workOrderAddEdit',
  components: { VueUeditorWrap },
  data() {
    return {
      breadcrumbList:[],
      breadcrumbName:'',
      menuButtonPermit:[],
      typeList:[],
      systemTag:[],
      userList:[],
      formData:{
        id:0,
        typeid:0,
        tags_id:[],
        mytags:"",
        title:"",
        content:"",
        issay:false,
        isedit:false,
        publishuserid:'',
        score:"",
        endtime:"",
      },
      editorConfig: {
        UEDITOR_HOME_URL: '/ueditor/',
        // 服务端接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: process.env.NODE_ENV=='development'?'http://172.16.10.24:8017/php/controller.php':process.env.VUE_APP_BASE_API+'/php/controller.php',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 工具栏是否可以浮动
        autoFloatEnabled: false,
        // 初始容器高度
        initialFrameHeight: 500,
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
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device',
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
        console.log(res,"操作权限——工单发布");
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.$route.query.ID){
              if(!$this.menuButtonPermit.includes('Works_workedit')){
                $this.$message({
                  showClose: true,
                  message: "未被分配该工单修改权限",
                  type: 'error',
                  duration:6000
                });
                $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
              }else{
                if($this.device==="desktop"){
                  $this.breadcrumbName='工单发布';
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
              if(!$this.menuButtonPermit.includes('Works_publishwork')){
                $this.$message({
                  showClose: true,
                  message: "未被分配工单发布权限",
                  type: 'error',
                  duration:6000
                });
                $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
              }else{
                if($this.device==="desktop"){
                  $this.breadcrumbName='工单发布';
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
    // 获取工单发布修改所需系统数据
    getShowData(){
      var $this = this;
      $this.$store.dispatch('works/getSystemDataAction', null).then(response=>{
        if(response){
          if(response.status){
            console.log(response,"所有展示数据")
            response.userwritetypepermit.forEach(function(item,index){
                if(index == 0){
                    item.plain = true;
                    $this.formData.typeid = item.id;
                }else{
                    item.plain = false;
                }
            });
            $this.typeList = response.userwritetypepermit;
            $this.systemTag = response.tags;
            $this.formData.publishuserid=$this.userInfo.id;
            var userList = [];
            var itemUser = {};
            itemUser.label = $this.userInfo.name;
            itemUser.value = $this.userInfo.id;
            userList.push(itemUser);
            $this.userList = userList;
            if($this.$route.query.ID){
              $this.formData.id = parseInt($this.$route.query.ID);
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
    // 工单类型点击事件
    clickWorkOrderType(id){
      var $this = this;
      var data = $this.typeList;
      $this.changeWorkOrderType(data,id,$this);
    },
    // 工单类型选中状态切换
    changeWorkOrderType(data,id,$this){
        if(id == 0){
            data.forEach(function(item,index){
                if(index == 0){
                    item.plain = true;
                    $this.formData.typeid = item.id;
                }else{
                    item.plain = false;
                }
            });
        }else{
            data.forEach(function(item,index){
                if(item.id == id){
                    item.plain = true;
                    $this.formData.typeid = item.id;
                }else{
                    item.plain = false;
                }
            });
        }
        $this.typeList = data;
    },
    // 5、 你可以在ready方法中拿到editorInstance实例,所有API和官方的实例是一样了。http://fex.baidu.com/ueditor/#api-common
    ready (ue) {
      ue.addListener('ready', () => {
          console.log(ue);
      })
    },
    // 获取编辑工单详情
    getArticleInfo(){
      var $this = this;
      $this.$store.dispatch('works/workOrderEditInitInfoAction', {id:$this.formData.id}).then(response=>{
        console.log(response,"工单详情");
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
      var typeList = $this.typeList;
      $this.changeWorkOrderType(typeList,data.typeid,$this);
      $this.formData.typeid = data.typeid;
      $this.formData.id = data.id;
      $this.formData.title = data.title;
      $this.formData.content = data.content;
      $this.formData.endtime = data.endtime;
      $this.formData.score = data.score;
      $this.formData.mytags = data.mytags;
      $this.formData.issay = data.issay==0?true:false;
      $this.formData.isedit = data.isedit==0?false:true;
      if(data.tags_id){
        if(data.tags_id.indexOf(",")!=-1){
          var systemTagArr = data.tags_id.split(",");
          systemTagArr.forEach(function(item,index){
            $this.formData.tags_id.push(parseInt(item));
          });
        }else{
          var tags_id = parseInt(data.tags_id);
          $this.formData.tags_id = [tags_id];
        }
      }else{
        $this.formData.tags_id = [];
      }
    },
    // 重置添加文章表单
    clearFormData(){
      var $this = this;
      $this.formData.id = 0;
      $this.formData.typeid = 0;
      $this.formData.tags_id = [];
      $this.formData.mytags = "";
      $this.formData.title = "";
      $this.formData.content = "";
      $this.formData.publishuserid = "";
      $this.formData.score = "";
      $this.formData.endtime = "";
      $this.formData.issay = false;
      $this.formData.isedit = false;
      $this.changeWorkOrderType($this.typeList,$this.formData.typeid,$this);
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.formData.typeid == 0){
        $this.$message({
            showClose: true,
            message: '错误：工单类型不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.formData.title == ""){
        $this.$message({
            showClose: true,
            message: '错误：工单标题不能为空！',
            type: 'error'
        });
        $this.$refs['title'].focus();
        return false;
      }
      if($this.formData.content == ""){
        $this.$message({
            showClose: true,
            message: '错误：工单内容不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.formData.score == ""){
        $this.$message({
            showClose: true,
            message: '错误：工单积分不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.formData.endtime == ""){
        $this.$message({
            showClose: true,
            message: '错误：工单截止时间不能为空！',
            type: 'error'
        });
        return false;
      }
      return true;
    },
    // 发布工单
    saveArticle(){
      var $this = this;
      if(!$this.validationForm()){
        return false;
      }
      var formData = {}
      formData.id = $this.formData.id;
      formData.typeid = $this.formData.typeid;
      formData.title = $this.formData.title;
      formData.content = $this.formData.content;
      formData.tags_id = $this.formData.tags_id;
      formData.mytags = $this.formData.mytags;
      formData.publishuserid = $this.formData.publishuserid;
      formData.issay = $this.formData.issay?0:1;
      formData.isedit = $this.formData.isedit?1:0;
      formData.score = $this.formData.score;
      formData.endtime = $this.formData.endtime;
      var pathUrl = "";
      if($this.formData.id!==0){
        pathUrl = 'works/workOrderEditAction';
      }else{
        pathUrl = 'works/workOrderAddAction';
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
  }
}
</script>
<style lang="scss" scoped>
</style>