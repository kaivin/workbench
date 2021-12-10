<template>
  <div class="page-root scroll-panel" ref="boxPane">
    <p class="breadcrumb" ref="breadcrumbPane">
      <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
      <template v-for="(item,index) in breadcrumbList">
        <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
        <span class="breadcrumb-link" v-bind:key="index" v-else><b>-</b><span>{{item.title}}</span></span>
      </template>
      <span class="breadcrumb-link"><b>-</b><span>网站信息</span></span>
    </p>
    <el-card class="box-card scroll-card" shadow="hover">
        <div class="card-content WebsiteOne" ref="cardContent">
          <ul class="WebsiteOneTable clearfix">
              <li v-if="writePermit.includes('domain')||readPermit.includes('domain')">
                  <div class="AddEditPostItem flex-box flex-row clearfix">
                      <label>主域名：</label>
                      <el-input
                        v-model="formData.domain"
                        size="small"
                        class="EditPostInput flex-content"
                        :disabled="!writePermit.includes('domain')"
                        clearable>
                      </el-input>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix">
                      <label>网站ID：</label>
                      <el-input
                        v-model="formData.id"
                        size="small"
                        class="EditPostInput flex-content"
                        disabled>
                      </el-input>
                  </div>
              </li>
              <li>
                  <div class="AddEditPostItem flex-box flex-row clearfix WebsiteOneTool">
                      <label>查询工具：</label>
                      <div class="item-wrap flex-content">
                        <a :href="isHttps?'https://www.ipip.net/ip/https://www.'+formData.domain+'/.html':'https://www.ipip.net/ip/http://www.'+formData.domain+'/.html'" target="_blank" class="link">IP查询</a>
                        <a :href="isHttps?'https://www.'+formData.domain+'/robots.txt':'http://www.'+formData.domain+'/robots.txt'" target="_blank" class="link">robots.txt</a>
                        <a :href="isHttps?'https://www.'+formData.domain+'/sitemap.xml':'http://www.'+formData.domain+'/sitemap.xml'" target="_blank" class="link">sitemap.xml</a>
                        <a :href="'https://web.archive.org/web/*/'+formData.domain" target="_blank" class="link">历史快照</a>
                        <a :href="'https://www.google.com.hk/search?q=site:'+formData.domain" target="_blank" class="link">谷歌site</a>
                        <a :href="'https://www.baidu.com/s?wd=site:'+formData.domain" target="_blank" class="link">百度site</a>
                        <a :href="'https://www.so.com/s?q=site:'+formData.domain" target="_blank" class="link">360site</a>
                        <a :href="'https://www.sogou.com/web?query=site:'+formData.domain" target="_blank" class="link">搜狗site</a>
                        <a :href="'https://m.sm.cn/s?q=site:'+formData.domain" target="_blank" class="link">神马site</a>
                        <a :href="'https://m.toutiao.com/search?keyword=site:'+formData.domain" target="_blank" class="link">头条site</a>
                        <a :href="isHttps?'httsp://www.'+formData.domain+'/Error/_Message_Error.txt':'http://www.'+formData.domain+'/Error/_Message_Error.txt'" target="_blank" class="link">ErrLog</a>
                        <a :href="'https://www.google.com/search?q=site:'+formData.domain+' (博彩|时时彩|澳门|斗地主|娱乐场|欢乐豆|成人|传奇)'" target="_blank" class="link">被黑查询</a>
                        <a :href="'https://www.google.com/search?q=site:'+formData.domain+' (黎明|世邦|西芝|嵩山|维科|科利瑞克|鑫海|一帆|豫晖|最佳|第一|最优)'" target="_blank" class="link">同行与违禁词</a>
                      </div>
                  </div>
              </li>
              <li v-if="writePermit.includes('domain_header')||readPermit.includes('domain_header')">
                  <div class="AddEditPostItem flex-box flex-row clearfix WebsiteOneSite">
                      <label>网站：</label>
                      <div class="item-wrap flex-content table-icon">
                          <span class="icon-title" title="https模式" v-if="isHttps"><i class="svg-i"><svg-icon icon-class="websiteHttps" class-name="disabled" /></i>ssl证书</span>
                          <template v-for="(item,index) in websiteList">
                            <span class="icon-title" v-on:click="hrefBlank(item)" :title="item" v-bind:key="index" v-if="item.indexOf('://www.')!=-1"><i class="svg-i"><svg-icon icon-class="websitePc" class-name="disabled" /></i>{{item}}</span>
                            <span class="icon-title" v-on:click="hrefBlank(item)" :title="item" v-else-if="item.indexOf('://m.')!=-1"><i class="svg-i"><svg-icon icon-class="websiteMobile" class-name="disabled" /></i>{{item}}</span>
                            <span class="icon-title" v-on:click="hrefBlank(item)" :title="item" v-else><i class="svg-i"><svg-icon icon-class="websiteMap" class-name="disabled" /></i>{{item}}</span>
                          </template>
                      </div>
                  </div>
              </li>
              <li>
                  <div class="AddEditPostItem flex-box flex-row clearfix WebsiteOneStatus">
                    <label>状态：</label>
                    <div class="item-column flex-content flex-box">
                      <template v-if="formData.is_online">
                        <div class="table-icon" v-if="formData.speedcheckstatus==1">
                          <i class="svg-i online" v-if="formData.openstatus==0" title="正常"><svg-icon icon-class="online" class-name="disabled" /></i>
                          <i class="svg-i timeout" v-else-if="formData.openstatus==1" title="超时"><svg-icon icon-class="timeout" class-name="disabled" /></i>
                          <i class="svg-i abnormal" v-else title="异常"><svg-icon icon-class="abnormal" class-name="disabled" /></i>
                        </div>
                        <div class="table-tag" v-else><el-tag type="info">未检测</el-tag></div>
                        <div class="table-tag" v-if="formData.speedcheckstatus==1&&formData.speed!=''">
                          <template v-if="formData.isCn">
                            <el-tag v-if="formData.speed<1" type="success">{{formData.speed}}s</el-tag>
                            <el-tag v-else-if="formData.speed>=1&&formData.speed<2" type="warning">{{formData.speed}}s</el-tag>
                            <el-tag v-else type="danger">{{formData.speed}}s</el-tag>
                          </template>
                          <template v-else>
                            <el-tag v-if="formData.speed<2" type="success">{{formData.speed}}s</el-tag>
                            <el-tag v-else-if="formData.speed>=2&&formData.speed<4" type="warning">{{formData.speed}}s</el-tag>
                            <el-tag v-else type="danger">{{formData.speed}}s</el-tag>
                          </template>
                        </div>
                        <div class="item-wrap flex-content flex-box" v-if="formData.speedcheckstatus==1">
                          <span class="text">{{formData.speedcheck}}</span>
                        </div>
                      </template>
                      <div class="table-tag" v-else><el-tag type="info">离线</el-tag></div>
                    </div>
                  </div>
              </li>
              <li v-if="writePermit.includes('domain_outtime')||readPermit.includes('domain_outtime')||writePermit.includes('server_outtime')||readPermit.includes('server_outtime')">
                  <div class="AddEditPostItem flex-box flex-row clearfix WebsiteOneDomain" v-if="writePermit.includes('domain_outtime')||readPermit.includes('domain_outtime')">
                      <label>域名到期：</label>
                      <el-date-picker
                        v-model="formData.domain_outtime"
                        type="datetime"
                        placeholder="选择日期时间"
                        class="EditPostInput flex-content"
                        value-format = "yyyy-MM-dd HH:mm:ss"
                        :disabled="!writePermit.includes('domain_outtime')"
                        default-time="12:00:00">
                      </el-date-picker>
                      <a :href="'http://tool.chinaz.com/DomainDel/?wd=www.'+formData.domain" target="_blank" class="link">到期查询</a>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('server_outtime')||readPermit.includes('server_outtime')">
                      <label>主机到期：</label>
                      <el-date-picker
                        v-model="formData.server_outtime"
                        type="datetime"
                        class="EditPostInput flex-content"
                        value-format = "yyyy-MM-dd HH:mm:ss"
                        :disabled="!writePermit.includes('server_outtime')"
                        placeholder="选择日期时间"
                        default-time="12:00:00">
                      </el-date-picker>
                  </div>
              </li>
              <li v-if="writePermit.includes('ip')||readPermit.includes('ip')">
                  <div class="AddEditPostItem flex-box flex-row clearfix">
                      <label>IP：</label>
                      <el-input
                        v-model="formData.ip"
                        size="small"
                        class="EditPostInput flex-content"
                        :disabled="!writePermit.includes('ip')"
                        clearable>
                      </el-input>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix WebsiteOneIp">
                    <div class="item-wrap">
                        <a :href="'https://www.ipip.net/ip/'+formData.ip+'.html'" target="_blank" class="link">IP查询</a>
                        <a :href="'http://ping.chinaz.com/'+formData.ip" target="_blank" class="link">PING国内检测</a>
                        <a :href="'https://asm.ca.com/zh_cn/ping.php?IP='+formData.ip" target="_blank" class="link">PING全球检测</a>
                        <a class="link" v-if="formData.serverstatus==1" v-on:click="linkPage">独立服务器查询</a>
                      </div>
                  </div>
              </li>
              <li v-if="writePermit.includes('ftpuser')||readPermit.includes('ftpuser')||writePermit.includes('ftppassword')||readPermit.includes('ftppassword')">
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('ftpuser')||readPermit.includes('ftpuser')">
                      <label>FTP帐号：</label>
                        <el-input
                          v-model="formData.ftpuser"
                          :disabled="!writePermit.includes('ftpuser')"
                          size="small"
                          class="EditPostInput flex-content"
                          clearable>
                        </el-input>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('ftppassword')||readPermit.includes('ftppassword')">
                      <label>FTP密码：</label>
                        <el-input
                          v-model="formData.ftppassword"
                          :disabled="!writePermit.includes('ftppassword')"
                          size="small"
                          class="EditPostInput flex-content"
                          clearable>
                        </el-input>
                  </div>
              </li>
              <li v-if="writePermit.includes('iisftpuser')||readPermit.includes('iisftpuser')||writePermit.includes('iisftppwd')||readPermit.includes('iisftppwd')||writePermit.includes('logspath')||readPermit.includes('logspath')">
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('iisftpuser')||readPermit.includes('iisftpuser')">
                      <label>IIS FTP帐号：</label>
                      <el-input
                        v-model="formData.iisftpuser"
                        :disabled="!writePermit.includes('iisftpuser')"
                        size="small"
                        class="EditPostInput flex-content"
                        clearable>
                      </el-input>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('iisftppwd')||readPermit.includes('iisftppwd')">
                      <label>IIS FTP密码：</label>
                        <el-input
                          v-model="formData.iisftppwd"
                          :disabled="!writePermit.includes('iisftppwd')"
                          size="small"
                          class="EditPostInput flex-content"
                          clearable>
                        </el-input>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix WebsiteOnePath" v-if="writePermit.includes('logspath')||readPermit.includes('logspath')">
                      <label>Path：</label>
                      <el-input
                        v-model="formData.logspath"
                        :disabled="!writePermit.includes('logspath')"
                        size="small"
                        class="EditPostInput flex-content"
                        clearable>
                      </el-input>
                      <span @click="handleIIS" class="link">IIS 分析</span>
                  </div>
              </li>
              <li v-if="writePermit.includes('ftpremarks')||readPermit.includes('ftpremarks')">
                  <div class="AddEditPostItem flex-box flex-row clearfix WebsiteOneFtpBak">
                      <label>FTP备注：</label>
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入FTP备注"
                        v-model="formData.ftpremarks"
                        :disabled="!writePermit.includes('ftpremarks')"
                        size="small"
                        class="EditPostInput flex-content"
                        clearable>
                      </el-input>
                  </div>
              </li>
              <li v-if="writePermit.includes('websiteurl')||readPermit.includes('websiteurl')||writePermit.includes('websiteuser')||readPermit.includes('websiteuser')||writePermit.includes('websitepassword')||readPermit.includes('websitepassword')">
                  <div class="AddEditPostItem flex-box flex-row clearfix WebsiteOneWebsiteurl" v-if="writePermit.includes('websiteurl')||readPermit.includes('websiteurl')">
                      <label>后台地址：</label>
                      <el-input
                        v-model="formData.websiteurl"
                        :disabled="!writePermit.includes('websiteurl')"
                        size="small"
                        class="EditPostInput flex-content"
                        clearable>
                      </el-input>
                      <a :href="formData.websiteurl" target="_blank" class="link">跳转</a>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('websiteuser')||readPermit.includes('websiteuser')">
                      <label>后台帐号：</label>
                        <el-input
                          v-model="formData.websiteuser"
                          :disabled="!writePermit.includes('websiteuser')"
                          size="small"
                          class="EditPostInput flex-content"
                          clearable>
                        </el-input>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('websitepassword')||readPermit.includes('websitepassword')">
                      <label>后台密码：</label>
                        <el-input
                          v-model="formData.websitepassword"
                          :disabled="!writePermit.includes('websitepassword')"
                          size="small"
                          class="EditPostInput flex-content"
                          clearable>
                        </el-input>
                  </div>
              </li>
              <li v-if="writePermit.includes('websiteremarks')||readPermit.includes('websiteremarks')">
                  <div class="AddEditPostItem flex-box flex-row clearfix WebsiteOneAdminBak">
                      <label>后台备注：</label>
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入后台备注"
                        v-model="formData.websiteremarks"
                        :disabled="!writePermit.includes('websiteremarks')"
                        size="small"
                        class="EditPostInput flex-content"
                        clearable>
                      </el-input>
                  </div>
              </li>
              <li v-if="writePermit.includes('brand')||readPermit.includes('brand')||writePermit.includes('language')||readPermit.includes('language')||writePermit.includes('website_departid')||readPermit.includes('website_departid')">
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('brand')||readPermit.includes('brand')">
                      <label>品牌：</label>
                      <el-select 
                        v-model="formData.brand" 
                        size="small"
                        class="EditPostInput flex-content"
                        :disabled="!writePermit.includes('brand')" 
                        clearable 
                        placeholder="请选择品牌">
                        <el-option
                          v-for="item in brandSelectList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('language')||readPermit.includes('language')">
                      <label>语言：</label>
                        <el-select 
                          v-model="formData.language" 
                          :disabled="!writePermit.includes('language')" 
                          size="small" 
                          class="EditPostInput flex-content"
                          clearable 
                          placeholder="请选择语言">
                          <el-option
                            v-for="item in languageSelectList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('website_departid')||readPermit.includes('website_departid')">
                      <label>部门：</label>
                        <el-select 
                          v-model="formData.website_departid" 
                          :disabled="!writePermit.includes('website_departid')" 
                          size="small" 
                          class="EditPostInput flex-content"
                          clearable 
                          placeholder="请选择部门">
                          <el-option
                            v-for="item in departSelectList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                  </div>
              </li>
              <li v-if="writePermit.includes('website_designuser')||readPermit.includes('website_designuser')||writePermit.includes('website_beforeuser')||readPermit.includes('website_beforeuser')||writePermit.includes('website_backuser')||readPermit.includes('website_backuser')">
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('website_designuser')||readPermit.includes('website_designuser')">
                      <label>设计：</label>
                        <el-select 
                          v-model="formData.website_designuser" 
                          :disabled="!writePermit.includes('website_designuser')" 
                          size="small" 
                          class="EditPostInput flex-content"
                          filterable 
                          multiple 
                          clearable 
                          placeholder="请选择设计负责人">
                          <el-option
                            v-for="item in userSelectList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('website_beforeuser')||readPermit.includes('website_beforeuser')">
                      <label>前端：</label>
                        <el-select 
                          v-model="formData.website_beforeuser" 
                          :disabled="!writePermit.includes('website_beforeuser')" 
                          size="small" 
                          class="EditPostInput flex-content"
                          filterable 
                          multiple 
                          clearable 
                          placeholder="请选择前端负责人">
                          <el-option
                            v-for="item in userSelectList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('website_backuser')||readPermit.includes('website_backuser')">
                      <label>程序：</label>
                        <el-select 
                          v-model="formData.website_backuser" 
                          :disabled="!writePermit.includes('website_backuser')" 
                          size="small" 
                          class="EditPostInput flex-content"
                          filterable 
                          multiple 
                          clearable 
                          placeholder="请选择程序负责人">
                          <el-option
                            v-for="item in userSelectList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                  </div>
              </li>
              <li v-if="writePermit.includes('website_serveruser')||readPermit.includes('website_serveruser')||writePermit.includes('website_pushuser')||readPermit.includes('website_pushuser')||writePermit.includes('website_headuser')||readPermit.includes('website_headuser')">
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('website_serveruser')||readPermit.includes('website_serveruser')">
                      <label>服务器：</label>
                        <el-select 
                          v-model="formData.website_serveruser" 
                          :disabled="!writePermit.includes('website_serveruser')" 
                          size="small" 
                          class="EditPostInput flex-content"
                          filterable 
                          multiple 
                          clearable 
                          placeholder="请选择服务器负责人">
                          <el-option
                            v-for="item in userSelectList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('website_pushuser')||readPermit.includes('website_pushuser')">
                      <label>推广：</label>
                        <el-select 
                          v-model="formData.website_pushuser" 
                          :disabled="!writePermit.includes('website_pushuser')" 
                          size="small" 
                          class="EditPostInput flex-content"
                          filterable 
                          multiple 
                          clearable 
                          placeholder="请选择推广负责人">
                          <el-option
                            v-for="item in userSelectList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('website_headuser')||readPermit.includes('website_headuser')">
                      <label>站长：</label>
                        <el-select 
                          v-model="formData.website_headuser" 
                          :disabled="!writePermit.includes('website_headuser')" 
                          size="small" 
                          class="EditPostInput flex-content"
                          filterable 
                          multiple 
                          clearable 
                          placeholder="请选择站点负责人">
                          <el-option
                            v-for="item in userSelectList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                  </div>
              </li>
              <li v-if="writePermit.includes('domain_attr')||readPermit.includes('domain_attr')">
                  <div class="AddEditPostItem flex-box flex-row clearfix">
                      <label>网站标签：</label>
                      <el-input
                        v-model="formData.domain_attr"
                        :disabled="!writePermit.includes('domain_attr')" 
                        @input="attrChangeHandler"
                        size="small"
                        class="EditPostInput flex-content"
                        clearable>
                      </el-input>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix WebsiteOneTag">
                    <div class="item-wrap">
                      <el-button class="item-tag" type="primary" v-for="(item,index) in attrTagList" v-bind:key="index" v-bind:class="item.isOn?'':'is-plain'" size="mini" v-on:click="clickAttrTag(item.name)">{{item.name}}</el-button>
                    </div>
                  </div>
              </li>
              <li v-if="writePermit.includes('domain_header')||readPermit.includes('domain_header')">
                  <div class="AddEditPostItem flex-box flex-row clearfix">
                      <label>主机头：</label>
                      <el-input
                        v-model="formData.domain_header"
                        :disabled="!writePermit.includes('domain_header')" 
                        size="small"
                        class="EditPostInput flex-content"
                        @input="hostChangeHandler"
                        clearable>
                      </el-input>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix WebsiteOneTag">
                      <div class="item-wrap">
                        <el-button class="item-tag" type="primary" v-for="(item,index) in hostTagList" v-bind:key="index" v-bind:class="item.isOn?'':'is-plain'" size="mini" v-on:click="clickHostTag(item.name)">{{item.name}}</el-button>
                      </div>
                  </div>
              </li>
              <li>
                  <div class="AddEditPostItem flex-box flex-row clearfix WebsiteOneBak">
                      <label>
                        <el-popover
                          placement="left"
                          width="400"
                          trigger="hover">
                          <div class="remarks-content">
                            <p><strong>以下情况请添加备注：</strong></p>
                            <p>1.上线时间；</p>
                            <p>2. 上线后2、3天的蜘蛛与收录表现情况；</p>
                            <p>3.一周左右的收录与流量；</p>
                            <p>4.表现较好时的流量；</p>
                            <p>5.网站异常，较大波动，被K惩罚的时间；</p>
                            <p>6.异常后做的处理；</p>
                            <p>7.对网站进行改版等较大改动；</p>
                            <p>8.其他认为需要记录分析的情况。</p>
                            <p><strong>格式：#时间 内容</strong></p>
                            <p><strong>示例：</strong></p>
                            <p>#2021-06-18</p>
                            <p>网站上线</p>
                          </div>
                          <i slot="reference" class="svg-i"><svg-icon icon-class="tips" class-name="disabled" /></i>
                        </el-popover>
                        备注：
                      </label>
                      <el-input
                        type="textarea"
                        :autosize="{ minRows:5, maxRows:10}"
                        placeholder="请输入网站备注"
                        v-model="formData.remarks"
                        size="small"
                        class="EditPostInput flex-content"
                        clearable>
                      </el-input>
                  </div>
              </li>
              <li class="WebsiteOneFoot">
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('is_online')||readPermit.includes('is_online')">
                      <label>上线：</label>
                      <el-checkbox v-model="formData.is_online" :disabled="!writePermit.includes('is_online')" label="网站已上线" border size="small"></el-checkbox>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix" v-if="writePermit.includes('sort')||readPermit.includes('sort')">
                      <label>排序：</label>
                        <el-input
                          v-model="formData.sort"
                          :disabled="!writePermit.includes('sort')"
                          clearable
                          size="small">
                        </el-input>
                  </div>
                  <div class="AddEditPostItem flex-box flex-row clearfix">
                      <label>更新时间：</label>
                      <span>{{formData.updatetime}}</span>
                  </div>
              </li>
          </ul>
          <div class="card-header WebServerAddEditBtn WebsiteOneBtn">
              <el-button type="primary" class="updateBtn" :class="isDisabled?'isDisabled':''" :disabled="isDisabled" size="small" v-on:click="updateWebsiteInfo()" v-if="menuButtonPermit.includes('Website_edit')"><i class="svg-i planeWhite" ><svg-icon icon-class="planeWhite" /></i>更新</el-button>
              <el-button type="primary" class="resetBtn" size="small" v-on:click="resetFormData()">重置</el-button>
          </div>
        </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'websiteEdit',
  data() {
    return {
      breadcrumbList:[],
      menuButtonPermit:[],
      formData:{
        id:0,
        language:"",
        brand:"",
        website_departid:"",
        website_beforeuser:[],
        website_designuser:[],
        website_backuser:[],
        website_headuser:[],
        website_pushuser:[],
        website_serveruser:[],
        websiteremarks:"",
        ftpremarks:"",
        domain:"",
        websiteurl:"",
        websitepassword:"",
        websiteuser:"",
        ftpuser:"",
        ftppassword:"",
        iisftpuser:"",
        iisftppwd:"",
        logspath:"",
        remarks:"",
        ip:"",
        weblink:"",
        is_online:false,
        domain_outtime:"",
        server_outtime:"",
        domain_attr:"",
        domain_header:"",
        sort:"",
        updatetime:"",
        speedcheck:"",
        openstatus:0,
        speed:"",
        speedcheckstatus:0,
        isCn:true,
        serverstatus:0,
      },
      websiteInfo:null,
      websiteList:[],
      isHttps:false,
      languageSelectList:[],
      brandSelectList:[],
      departSelectList:[],
      userSelectList:[],
      hostTagList:[],
      attrTagList:[],
      readPermit:[],
      writePermit:[],
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
    // 初始化数据
    initData(){
        var $this = this;
        if($this.$router.currentRoute.meta.id){
           $this.loadingFun();
          $this.getUserMenuButtonPermit();
        }else{
          $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
        }
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
            if($this.menuButtonPermit.includes('Website_edit')){
              $this.getWebsiteSystemData();
            }else{
              $this.$message({
                showClose: true,
                message: "未被分配网站修改查看权限",
                type: 'error',
                duration:6000
              });
              $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            }
          }else{
            $this.$message({
              showClose: true,
              message: "未被分配网站修改查看权限",
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
    // 获取系统展示数据
    getWebsiteSystemData(){
      var $this = this;
      $this.$store.dispatch('website/websiteEditSystemInfoAction', null).then(response=>{
        if(response){
          if(response.status){
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
            var userSelectList = [];
            response.user.forEach(function(item,index){
              var itemData = {};
              itemData.value = item.id;
              itemData.label = item.name+"["+item.id+"]";
              userSelectList.push(itemData);
            });
            $this.userSelectList = userSelectList;
            response.hosting.forEach(function(item,index){
              item.isOn = false;
            });
            $this.hostTagList = response.hosting;
            response.webtags.forEach(function(item,index){
              item.isOn = false;
            });
            $this.attrTagList = response.webtags;
            $this.readPermit = response.readfield;
            $this.writePermit = response.writefield;
            $this.getWebsiteInfo();
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
    // 获取编辑网站详情
    getWebsiteInfo(){
      var $this = this;
      if($this.$route.query.websiteID){
          $this.formData.id = $this.$route.query.websiteID;
          $this.formData.domain = $this.$route.query.website;
          $this.$store.dispatch('website/websiteEditInfoAction', {id:$this.formData.id}).then(response=>{
              if(response){
                if(response.status){
                  $this.websiteInfo = response.data;
                  $this.initWebsiteInfo($this.websiteInfo);
                }else{
                  if(response.permitstatus&&response.permitstatus==2){
                    $this.$message({
                      showClose: true,
                      message: "未被分配该网站修改权限",
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
         $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
      }
    },
    // 初始化网站信息
    initWebsiteInfo(data){
      var $this = this;
      $this.formData.id = data.id;
      $this.formData.domain = data.domain;
      $this.formData.brand = data.brand;
      $this.formData.language = data.language;
      $this.formData.website_departid = data.website_departid;
      $this.formData.speedcheck = data.speedcheck;
      $this.formData.openstatus = data.openstatus;
      $this.formData.serverstatus = data.serverstatus;
      $this.formData.speedcheckstatus = data.speedcheckstatus;
      if(data.language==1){
        $this.formData.isCn = true;
      }else{
        $this.formData.isCn = false;
      }
      if(data.speed){
        $this.formData.speed = parseFloat(data.speed.split("s")[0]);
      }
      if(data.domain_outtime&&data.domain_outtime!=""){
        $this.formData.domain_outtime = data.domain_outtime;
      }
      if(data.server_outtime&&data.server_outtime!=""){
        $this.formData.server_outtime = data.server_outtime;
      }
      if(data.ip&&data.ip!=""){
        $this.formData.ip = data.ip;
      }
      if(data.ftpuser&&data.ftpuser!=""){
        $this.formData.ftpuser = data.ftpuser;
      }
      if(data.ftppassword&&data.ftppassword!=""){
        $this.formData.ftppassword = data.ftppassword;
      }
      if(data.ftpremarks&&data.ftpremarks!=""){
        $this.formData.ftpremarks = data.ftpremarks;
      }
      if(data.iisftpuser&&data.iisftpuser!=""){
        $this.formData.iisftpuser = data.iisftpuser;
      }
      if(data.iisftppwd&&data.iisftppwd!=""){
        $this.formData.iisftppwd = data.iisftppwd;
      }
      if(data.logspath&&data.logspath!=""){
        $this.formData.logspath = data.logspath;
      }
      if(data.remarks&&data.remarks!=""){
        $this.formData.remarks = data.remarks;
      }
      if(data.sort&&data.sort!=""){
        $this.formData.sort = data.sort;
      }
      if(data.updatetime&&data.updatetime!=""){
        $this.formData.updatetime = data.updatetime;
      }
      if(data.weblink&&data.weblink!=""){
        $this.formData.weblink = data.weblink;
      }
      if(data.websiteurl&&data.websiteurl!=""){
        $this.formData.websiteurl = data.websiteurl;
      }
      if(data.websiteuser&&data.websiteuser!=""){
        $this.formData.websiteuser = data.websiteuser;
      }
      if(data.websitepassword&&data.websitepassword!=""){
        $this.formData.websitepassword = data.websitepassword;
      }
      if(data.websiteremarks&&data.websiteremarks!=""){
        $this.formData.websiteremarks = data.websiteremarks;
      }
      if(data.domain_attr&&data.domain_attr!=""){
        $this.formData.domain_attr = data.domain_attr;
        $this.attrChangeHandler($this.formData.domain_attr);
      }
      if(data.domain_header&&data.domain_header!=""){
        $this.formData.domain_header = data.domain_header;
        $this.hostChangeHandler($this.formData.domain_header);
      }
      $this.formData.is_online = data.is_online?true:false;
      if(data.website_designuser&&data.website_designuser!=''){
        if(data.website_designuser.indexOf(",")!=-1){
          var strArr = data.website_designuser.split(",");
          strArr.forEach(function(item,index){
            $this.formData.website_designuser.push(parseInt(item));
          });
        }else{
          $this.formData.website_designuser = [parseInt(data.website_designuser)]
        }
      }
      if(data.website_beforeuser&&data.website_beforeuser!=''){
        if(data.website_beforeuser.indexOf(",")!=-1){
          var strArr = data.website_beforeuser.split(",");
          strArr.forEach(function(item,index){
            $this.formData.website_beforeuser.push(parseInt(item));
          });
        }else{
          $this.formData.website_beforeuser = [parseInt(data.website_beforeuser)]
        }
      }
      if(data.website_backuser&&data.website_backuser!=''){
        if(data.website_backuser.indexOf(",")!=-1){
          var strArr = data.website_backuser.split(",");
          strArr.forEach(function(item,index){
            $this.formData.website_backuser.push(parseInt(item));
          });
        }else{
          $this.formData.website_backuser = [parseInt(data.website_backuser)]
        }
      }
      if(data.website_headuser&&data.website_headuser!=''){
        if(data.website_headuser.indexOf(",")!=-1){
          var strArr = data.website_headuser.split(",");
          strArr.forEach(function(item,index){
            $this.formData.website_headuser.push(parseInt(item));
          });
        }else{
          $this.formData.website_headuser = [parseInt(data.website_headuser)]
        }
      }
      if(data.website_pushuser&&data.website_pushuser!=''){
        if(data.website_pushuser.indexOf(",")!=-1){
          var strArr = data.website_pushuser.split(",");
          strArr.forEach(function(item,index){
            $this.formData.website_pushuser.push(parseInt(item));
          });
        }else{
          $this.formData.website_pushuser = [parseInt(data.website_pushuser)]
        }
      }
      if(data.website_serveruser&&data.website_serveruser!=''){
        if(data.website_serveruser.indexOf(",")!=-1){
          var strArr = data.website_serveruser.split(",");
          strArr.forEach(function(item,index){
            $this.formData.website_serveruser.push(parseInt(item));
          });
        }else{
          $this.formData.website_serveruser = [parseInt(data.website_serveruser)]
        }
      }
      $this.isLoading.close();
    },
    // 清空信息
    clearForm(){
      var $this = this;
      $this.formData.id=0,
      $this.formData.language="";
      $this.formData.brand="";
      $this.formData.website_departid="";
      $this.formData.website_beforeuser=[];
      $this.formData.website_designuser=[];
      $this.formData.website_backuser=[];
      $this.formData.website_headuser=[];
      $this.formData.website_pushuser=[];
      $this.formData.website_serveruser=[];
      $this.formData.websiteremarks="";
      $this.formData.ftpremarks="";
      $this.formData.domain="";
      $this.formData.websiteurl="";
      $this.formData.websitepassword="";
      $this.formData.websiteuser="";
      $this.formData.ftpuser="";
      $this.formData.ftppassword="";
      $this.formData.iisftpuser="";
      $this.formData.iisftppwd="";
      $this.formData.logspath="";
      $this.formData.remarks="";
      $this.formData.ip="";
      $this.formData.weblink="";
      $this.formData.is_online=false;
      $this.formData.domain_outtime="";
      $this.formData.server_outtime="";
      $this.formData.domain_attr="";
      $this.formData.domain_header="";
      $this.formData.sort="";
      $this.formData.updatetime="";
      $this.formData.speedcheck="";
      $this.formData.speed="";
      $this.formData.openstatus=0;
      $this.formData.speedcheckstatus=0;
      $this.formData.isCn=true;
      $this.formData.serverstatus=0;
    },
    // 重置网站基本信息
    resetFormData(){
      var $this = this;
      $this.clearForm();
      $this.initWebsiteInfo($this.websiteInfo);
    },
    // 更新网站信息
    updateWebsiteInfo(){
      var $this = this;
      if(!$this.isDisabled){
        $this.isDisabled=true;
        $this.loadingFun();
        var formData = {}
        formData.id = $this.formData.id;
        formData.brand = $this.formData.brand;
        formData.language = $this.formData.language;
        formData.domain = $this.formData.domain;
        formData.weblink = $this.formData.weblink;
        formData.ip = $this.formData.ip;
        formData.ftpuser = $this.formData.ftpuser;
        formData.ftppassword = $this.formData.ftppassword;
        formData.ftpremarks = $this.formData.ftpremarks;
        formData.iisftpuser = $this.formData.iisftpuser;
        formData.iisftppwd = $this.formData.iisftppwd;
        formData.logspath = $this.formData.logspath;
        formData.websiteurl = $this.formData.websiteurl;
        formData.websiteuser = $this.formData.websiteuser;
        formData.websitepassword = $this.formData.websitepassword;
        formData.websiteremarks = $this.formData.websiteremarks;
        formData.remarks = $this.formData.remarks;
        formData.is_online = $this.formData.is_online?1:0;
        formData.domain_outtime = $this.formData.domain_outtime;
        formData.server_outtime = $this.formData.server_outtime;
        formData.website_backuser = $this.formData.website_backuser;
        formData.website_beforeuser = $this.formData.website_beforeuser;
        formData.website_designuser = $this.formData.website_designuser;
        formData.website_headuser = $this.formData.website_headuser;
        formData.website_pushuser = $this.formData.website_pushuser;
        formData.domain_header = $this.formData.domain_header;
        formData.domain_attr = $this.formData.domain_attr;
        formData.website_departid = $this.formData.website_departid;
        formData.sort = $this.formData.sort;
        formData.website_serveruser = $this.formData.website_serveruser;
        $this.$store.dispatch('website/websiteEditAction', formData).then(response=>{
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
    // 外部打开网站
    hrefBlank(url){
      window.open(url,'_blank');
    },
    // 主机头选择
    clickHostTag(name){
      var $this = this;
      if($this.writePermit.includes('domain_header')){
        var hostTagList = $this.hostTagList;
        hostTagList.forEach(function(item,index){
          if(item.name==name){
            if(item.isOn){
              item.isOn = false;
              var hostArr = $this.formData.domain_header;
              var reg = new RegExp(name+"\\|","ig")
              var newHost = hostArr.replace(reg, '');
              $this.formData.domain_header = newHost;
            }else{
              item.isOn = true;
              $this.formData.domain_header += name+"|";
            }
          }
        });
        $this.hostTagList = hostTagList;
        $this.hostCombinUrl();
      }
    },
    // 主机头输入性发生改变时触发
    hostChangeHandler(e){
      var $this = this;
      var hostTagList= $this.hostTagList;
      var currentHost = [];
      if(e.indexOf("|")!=-1){
        currentHost = e.split("|");
      }else{
        currentHost = [e]
      }
      hostTagList.forEach(function(item,index){
        if(currentHost.includes(item.name)){
          item.isOn = true;
        }else{
          item.isOn = false;
        }
      });
      $this.hostTagList = hostTagList;
      $this.hostCombinUrl();
    },
    // 主机头拼接链接
    hostCombinUrl(){
      var $this = this;
      var hostTagList = $this.formData.domain_header;
      var hostList = [];
      if(hostTagList.indexOf("|")!=-1){
        hostList = hostTagList.split("|");
      }else{
        hostList = [hostTagList];
      }
      if(hostList.includes("https")){
        $this.isHttps = true;
      }else{
        $this.isHttps = false;
      }
      var websiteList = [];
      hostList.forEach(function(item,index){
        if($this.isHttps){
          if(item!="https"&&item!=""){
            var itemUrl = "https://"+item+"."+$this.formData.domain;
            websiteList.push(itemUrl);
          }
        }else{
          var itemUrl = "http://"+item+"."+$this.formData.domain;
          websiteList.push(itemUrl);
        }
      });
      $this.websiteList = websiteList;
    },
    // 网站标签选择
    clickAttrTag(name){
      var $this = this;
      if($this.writePermit.includes('domain_attr')){
        var attrTagList = $this.attrTagList;
        attrTagList.forEach(function(item,index){
          if(item.name==name){
            if(item.isOn){
              item.isOn = false;
              var attrArr = $this.formData.domain_attr;
              var reg = new RegExp(name+"\\|","ig")
              var newAttr = attrArr.replace(reg, '');
              $this.formData.domain_attr = newAttr;
            }else{
              item.isOn = true;
              $this.formData.domain_attr += name+"|";
            }
          }
        });
      }
    },
    // 网站标签输入性发生改变时触发
    attrChangeHandler(e){
      var $this = this;
      var attrTagList= $this.attrTagList;
      var currentAttr = [];
      if(e.indexOf("|")!=-1){
        currentAttr = e.split("|");
      }else{
        currentAttr = [e]
      }
      attrTagList.forEach(function(item,index){
        if(currentAttr.includes(item.name)){
          item.isOn = true;
        }else{
          item.isOn = false;
        }
      });
      $this.attrTagList = attrTagList;
    },
    // 跳转到服务器管理
    linkPage(){
      var $this = this;
      if($this.formData.ip!=""){
        var routeUrl =  $this.$router.resolve({path:'/Webserver/lists',query:{IP:$this.formData.ip}});
        window.open(routeUrl.href,'_blank');
      }
    },
    // IIS分析
    handleIIS(){
      var $this=this;
      var iisForm={};
      iisForm.ip=$this.formData.ip;
      iisForm.ftpuser=$this.formData.iisftpuser;
      iisForm.ftppwd=$this.formData.iisftppwd;
      iisForm.path=$this.formData.logspath;
      iisForm.weburl='http://www.'+$this.formData.domain;
      var routeUrl =  $this.$router.resolve({path: "/Weblog/logList",query: {ip:$this.formData.ip,ftpuser:$this.formData.iisftpuser,ftppwd:$this.formData.iisftppwd,path:$this.formData.logspath,weburl:$this.formData.domain}});
      window.open(routeUrl.href,'_blank');
    },
  }
}
</script>
<style lang="scss" scoped>
</style>