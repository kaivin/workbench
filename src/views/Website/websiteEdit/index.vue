<template>
  <div class="page-root" ref="boxPane">
    <el-card class="box-card scroll-card" shadow="hover">
        <div slot="header">
          <div class="card-header" ref="headerPane">
            <el-button type="primary" size="small" icon="el-icon-refresh" v-on:click="resetFormData()">重置</el-button>
            <el-button type="primary" size="small" icon="el-icon-s-promotion" v-on:click="updateWebsiteInfo()" v-if="menuButtonPermit.includes('Website_edit')">更新</el-button>
            <el-button type="primary" size="small" icon="el-icon-s-promotion" v-on:click="syncMessage()">同步留言板权限</el-button>
          </div>
        </div>
        <div class="card-content" ref="cardContent">
          <div class="scroll-panel" v-bind:style="{height:scrollHeight+'px'}">
            <table class="table-post">
              <tr v-if="writePermit.includes('domain')||readPermit.includes('domain')">
                <td class="type-title"><span>主域名：</span></td>
                <td>
                  <div class="item-form-group flex-box">
                    <div class="item-form flex-content">
                      <div class="item-form-panel">
                        <el-input
                          v-model="formData.domain"
                          size="small"
                          :disabled="!writePermit.includes('domain')"
                          clearable>
                        </el-input>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="网站主域名">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-form inline-item title-color" style="width:240px;">
                      <strong>网站ID：</strong>
                      <div class="item-form-panel">
                        <el-input
                          v-model="formData.id"
                          size="small"
                          disabled>
                        </el-input>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="网站唯一标识ID">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="type-title"><span>查询工具：</span></td>
                <td>
                  <div class="item-form-content">
                    <div class="item-column flex">
                      <div class="item-wrap flex-box">
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
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="* 可自主替换更多查询词，同行、违禁词、被黑关键词可自行补充">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="writePermit.includes('domain_header')||readPermit.includes('domain_header')">
                <td class="type-title"><span>网站：</span></td>
                <td>
                  <div class="item-form-content">
                    <div class="item-column flex">
                      <div class="item-wrap flex-box table-icon">
                          <span class="icon-title" title="https模式" v-if="isHttps"><i class="svg-i"><svg-icon icon-class="https" class-name="disabled" /></i>ssl证书</span>
                          <template v-for="(item,index) in websiteList">
                            <span class="icon-title" v-on:click="hrefBlank(item)" :title="item" v-bind:key="index" v-if="item.indexOf('://www.')!=-1"><i class="svg-i"><svg-icon icon-class="pc" class-name="disabled" /></i>{{item}}</span>
                            <span class="icon-title" v-on:click="hrefBlank(item)" :title="item" v-bind:key="index" v-else-if="item.indexOf('://m.')!=-1"><i class="svg-i"><svg-icon icon-class="mobile" class-name="disabled" /></i>{{item}}</span>
                            <span class="icon-title" v-on:click="hrefBlank(item)" :title="item" v-bind:key="index" v-else><i class="svg-i"><svg-icon icon-class="internet" class-name="disabled" /></i>{{item}}</span>
                          </template>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="type-title"><span>状态：</span></td>
                <td>
                  <div class="item-form-content">
                    <div class="item-column flex">
                      <template v-if="formData.is_online">
                        <div class="table-icon" v-if="formData.speedcheckstatus==1">
                          <i class="svg-i online" v-if="openstatus==0" title="正常"><svg-icon icon-class="runnormal" class-name="disabled" /></i>
                          <i class="svg-i timeout" v-else-if="openstatus==1" title="超时"><svg-icon icon-class="timeout" class-name="disabled" /></i>
                          <i class="svg-i abnormal" v-else title="异常"><svg-icon icon-class="abnormal" class-name="disabled" /></i>
                        </div>
                        <div class="table-tag" v-else><el-tag type="info">未检测</el-tag></div>
                        <div class="table-tag" v-if="formData.speedcheckstatus==1">
                          <template v-if="formData.isCn">
                            <el-tag v-if="scope.row.speed<1" type="success">{{formData.speed}}s</el-tag>
                            <el-tag v-else-if="scope.row.speed>=1&&scope.row.speed<2" type="warning">{{formData.speed}}s</el-tag>
                            <el-tag v-else type="danger">{{formData.speed}}s</el-tag>
                          </template>
                          <template v-else>
                            <el-tag v-if="scope.row.speed<2" type="success">{{formData.speed}}s</el-tag>
                            <el-tag v-else-if="scope.row.speed>=2&&scope.row.speed<4" type="warning">{{formData.speed}}s</el-tag>
                            <el-tag v-else type="danger">{{formData.speed}}s</el-tag>
                          </template>
                        </div>
                        <div class="item-wrap flex-box" v-if="formData.speedcheckstatus==1">
                          <span class="text">{{formData.speedcheck}}</span>
                        </div>
                      </template>
                      <div class="table-tag" v-else><el-tag type="info">离线</el-tag></div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="writePermit.includes('domain_outtime')||readPermit.includes('domain_outtime')||writePermit.includes('server_outtime')||readPermit.includes('server_outtime')">
                <td class="type-title"><span>到期时间：</span></td>
                <td>
                  <div class="item-form-content flex-box">
                    <div class="item-column" v-if="writePermit.includes('domain_outtime')||readPermit.includes('domain_outtime')">
                      <strong>域名到期：</strong>
                      <div class="item-wrap">
                        <el-date-picker
                          v-model="formData.domain_outtime"
                          type="datetime"
                          placeholder="选择日期时间"
                          value-format = "yyyy-MM-dd HH:mm:ss"
                          :disabled="!writePermit.includes('domain_outtime')"
                          default-time="12:00:00">
                        </el-date-picker>
                      </div>
                      <a :href="'http://tool.chinaz.com/DomainDel/?wd=www.'+formData.domain" target="_blank" class="link">到期查询</a>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="域名到期时间，域名续费后，需更新域名到期时间">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-column" v-if="writePermit.includes('server_outtime')||readPermit.includes('server_outtime')">
                      <strong>主机到期：</strong>
                      <div class="item-wrap">
                        <el-date-picker
                          v-model="formData.server_outtime"
                          type="datetime"
                          value-format = "yyyy-MM-dd HH:mm:ss"
                          :disabled="!writePermit.includes('server_outtime')"
                          placeholder="选择日期时间"
                          default-time="12:00:00">
                        </el-date-picker>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="主机续费后，需更新主机到期时间">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="writePermit.includes('ip')||readPermit.includes('ip')">
                <td class="type-title"><span>IP：</span></td>
                <td>
                  <div class="item-form-content">
                    <div class="item-column" style="width: 240px;">
                        <el-input
                          v-model="formData.ip"
                          size="small"
                          :disabled="!writePermit.includes('ip')"
                          clearable>
                        </el-input>
                    </div>
                    <div class="item-column flex">
                      <div class="item-wrap flex-box">
                        <a :href="'https://www.ipip.net/ip/'+formData.ip+'.html'" target="_blank" class="link">IP查询</a>
                        <a :href="'http://ping.chinaz.com/'+formData.ip" target="_blank" class="link">PING国内检测</a>
                        <a :href="'https://asm.ca.com/zh_cn/ping.php?IP='+formData.ip" target="_blank" class="link">PING全球检测</a>
                        <a class="link" v-if="formData.serverstatus==1" v-on:click="linkPage">独立服务器查询</a>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="writePermit.includes('ftpuser')||readPermit.includes('ftpuser')||writePermit.includes('ftppassword')||readPermit.includes('ftppassword')">
                <td class="type-title"><span>FTP：</span></td>
                <td>
                  <div class="item-form-content">
                    <div class="item-column flex" v-if="writePermit.includes('ftpuser')||readPermit.includes('ftpuser')">
                      <strong>帐号：</strong>
                      <div class="item-wrap">
                        <el-input
                          v-model="formData.ftpuser"
                          :disabled="!writePermit.includes('ftpuser')"
                          size="small"
                          clearable>
                        </el-input>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="FTP登录账号">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-column flex" v-if="writePermit.includes('ftppassword')||readPermit.includes('ftppassword')">
                      <strong>密码：</strong>
                      <div class="item-wrap">
                        <el-input
                          v-model="formData.ftppassword"
                          :disabled="!writePermit.includes('ftppassword')"
                          size="small"
                          clearable>
                        </el-input>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="FTP登录密码">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="writePermit.includes('iisftpuser')||readPermit.includes('iisftpuser')||writePermit.includes('iisftppwd')||readPermit.includes('iisftppwd')||writePermit.includes('logspath')||readPermit.includes('logspath')">
                <td class="type-title"><span>IIS FTP：</span></td>
                <td>
                  <div class="item-form-content">
                    <div class="item-column flex" v-if="writePermit.includes('iisftpuser')||readPermit.includes('iisftpuser')">
                      <strong>帐号：</strong>
                      <div class="item-wrap">
                        <el-input
                          v-model="formData.iisftpuser"
                          :disabled="!writePermit.includes('iisftpuser')"
                          size="small"
                          clearable>
                        </el-input>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="IIS FTP登陆账号">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-column flex" v-if="writePermit.includes('iisftppwd')||readPermit.includes('iisftppwd')">
                      <strong>密码：</strong>
                      <div class="item-wrap">
                        <el-input
                          v-model="formData.iisftppwd"
                          :disabled="!writePermit.includes('iisftppwd')"
                          size="small"
                          clearable>
                        </el-input>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="IIS FTP登录密码">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-column flex" v-if="writePermit.includes('logspath')||readPermit.includes('logspath')">
                      <strong>Path：</strong>
                      <div class="item-wrap">
                        <el-input
                          v-model="formData.logspath"
                          :disabled="!writePermit.includes('logspath')"
                          size="small"
                          clearable>
                        </el-input>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="网站日志的存放路径">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-column">
                      <div class="item-wrap flex-box">
                        <a :href="isHttps?'http://172.16.10.90:8528/iis.aspx?ip='+formData.ip+'&user='+formData.iisftpuser+'&pwd='+formData.iisftppwd+'&path='+formData.logspath+'&web=https://www.'+formData.domain:'http://172.16.10.90:8528/iis.aspx?ip='+formData.ip+'&user='+formData.iisftpuser+'&pwd='+formData.iisftppwd+'&path='+formData.logspath+'&web=http://www.'+formData.domain" target="_blank" class="link">IIS 分析</a>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="writePermit.includes('ftpremarks')||readPermit.includes('ftpremarks')">
                <td class="type-title"><span>FTP备注：</span></td>
                <td>
                  <div class="item-form-content">
                    <div class="item-column flex">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入FTP备注"
                        v-model="formData.ftpremarks"
                        :disabled="!writePermit.includes('ftpremarks')"
                        size="small"
                        clearable>
                      </el-input>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="writePermit.includes('websiteurl')||readPermit.includes('websiteurl')||writePermit.includes('websiteuser')||readPermit.includes('websiteuser')||writePermit.includes('websitepassword')||readPermit.includes('websitepassword')">
                <td class="type-title"><span>后台管理：</span></td>
                <td>
                  <div class="item-form-content" v-if="writePermit.includes('websiteurl')||readPermit.includes('websiteurl')">
                    <div class="item-column flex">
                      <strong>后台地址：</strong>
                      <div class="item-wrap">
                        <el-input
                          v-model="formData.websiteurl"
                          :disabled="!writePermit.includes('websiteurl')"
                          size="small"
                          clearable>
                        </el-input>
                      </div>
                      <a :href="formData.websiteurl" target="_blank" class="link">跳转</a>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="网站后台管理地址">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                  <div class="item-form-content">
                    <div class="item-column flex" v-if="writePermit.includes('websiteuser')||readPermit.includes('websiteuser')">
                      <strong>帐号：</strong>
                      <div class="item-wrap">
                        <el-input
                          v-model="formData.websiteuser"
                          :disabled="!writePermit.includes('websiteuser')"
                          size="small"
                          clearable>
                        </el-input>
                      </div>
                      <el-popover
                        placement="left"
                        width="210"
                        trigger="hover"
                        content="网站后台管理系统登陆账号">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-column flex" v-if="writePermit.includes('websitepassword')||readPermit.includes('websitepassword')">
                      <strong>密码：</strong>
                      <div class="item-wrap">
                        <el-input
                          v-model="formData.websitepassword"
                          :disabled="!writePermit.includes('websitepassword')"
                          size="small"
                          clearable>
                        </el-input>
                      </div>
                      <el-popover
                        placement="left"
                        width="210"
                        trigger="hover"
                        content="网站后台管理系统登陆密码">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="writePermit.includes('websiteremarks')||readPermit.includes('websiteremarks')">
                <td class="type-title"><span>后台备注：</span></td>
                <td>
                  <div class="item-form-content">
                    <div class="item-column flex">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入后台备注"
                        v-model="formData.websiteremarks"
                        :disabled="!writePermit.includes('websiteremarks')"
                        size="small"
                        clearable>
                      </el-input>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="writePermit.includes('brand')||readPermit.includes('brand')||writePermit.includes('language')||readPermit.includes('language')||writePermit.includes('website_departid')||readPermit.includes('website_departid')||writePermit.includes('website_designuser')||readPermit.includes('website_designuser')||writePermit.includes('website_beforeuser')||readPermit.includes('website_beforeuser')||writePermit.includes('website_backuser')||readPermit.includes('website_backuser')||writePermit.includes('website_serveruser')||readPermit.includes('website_serveruser')||writePermit.includes('website_pushuser')||readPermit.includes('website_pushuser')||writePermit.includes('website_headuser')||readPermit.includes('website_headuser')">
                <td class="type-title"><span>网站归属：</span></td>
                <td>
                  <div class="item-form-content" v-if="writePermit.includes('brand')||readPermit.includes('brand')||writePermit.includes('language')||readPermit.includes('language')||writePermit.includes('website_departid')||readPermit.includes('website_departid')">
                    <div class="item-column flex" v-if="writePermit.includes('brand')||readPermit.includes('brand')">
                      <strong>品牌：</strong>
                      <div class="item-wrap">
                        <el-select 
                          v-model="formData.brand" 
                          size="small"
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
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="网站所属品牌">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-column flex" v-if="writePermit.includes('language')||readPermit.includes('language')">
                      <strong>语言：</strong>
                      <div class="item-wrap">
                        <el-select 
                          v-model="formData.language" 
                          :disabled="!writePermit.includes('language')" 
                          size="small" 
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
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="网站所属语种">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-column flex" v-if="writePermit.includes('website_departid')||readPermit.includes('website_departid')">
                      <strong>部门：</strong>
                      <div class="item-wrap">
                        <el-select 
                          v-model="formData.website_departid" 
                          :disabled="!writePermit.includes('website_departid')" 
                          size="small" 
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
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="网站所属部门">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                  <div class="item-form-content" v-if="writePermit.includes('website_designuser')||readPermit.includes('website_designuser')||writePermit.includes('website_beforeuser')||readPermit.includes('website_beforeuser')">
                    <div class="item-column flex" v-if="writePermit.includes('website_designuser')||readPermit.includes('website_designuser')">
                      <strong>设计：</strong>
                      <div class="item-wrap">
                        <el-select 
                          v-model="formData.website_designuser" 
                          :disabled="!writePermit.includes('website_designuser')" 
                          size="small" 
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
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="网站的设计负责人">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-column flex" v-if="writePermit.includes('website_beforeuser')||readPermit.includes('website_beforeuser')">
                      <strong>前端：</strong>
                      <div class="item-wrap">
                        <el-select 
                          v-model="formData.website_beforeuser" 
                          :disabled="!writePermit.includes('website_beforeuser')" 
                          size="small" 
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
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="网站的前端负责人">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                  <div class="item-form-content" v-if="writePermit.includes('website_backuser')||readPermit.includes('website_backuser')||writePermit.includes('website_serveruser')||readPermit.includes('website_serveruser')">
                    <div class="item-column flex" v-if="writePermit.includes('website_backuser')||readPermit.includes('website_backuser')">
                      <strong>程序：</strong>
                      <div class="item-wrap">
                        <el-select 
                          v-model="formData.website_backuser" 
                          :disabled="!writePermit.includes('website_backuser')" 
                          size="small" 
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
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="网站的程序负责人">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-column flex" v-if="writePermit.includes('website_serveruser')||readPermit.includes('website_serveruser')">
                      <strong>服务器：</strong>
                      <div class="item-wrap">
                        <el-select 
                          v-model="formData.website_serveruser" 
                          :disabled="!writePermit.includes('website_serveruser')" 
                          size="small" 
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
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="网站服务器的运维负责人">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                  <div class="item-form-content" v-if="writePermit.includes('website_pushuser')||readPermit.includes('website_pushuser')||writePermit.includes('website_headuser')||readPermit.includes('website_headuser')">
                    <div class="item-column flex" v-if="writePermit.includes('website_pushuser')||readPermit.includes('website_pushuser')">
                      <strong>推广：</strong>
                      <div class="item-wrap">
                        <el-select 
                          v-model="formData.website_pushuser" 
                          :disabled="!writePermit.includes('website_pushuser')" 
                          size="small" 
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
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="网站推广|优化的负责人">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-column flex" v-if="writePermit.includes('website_headuser')||readPermit.includes('website_headuser')">
                      <strong>站长：</strong>
                      <div class="item-wrap">
                        <el-select 
                          v-model="formData.website_headuser" 
                          :disabled="!writePermit.includes('website_headuser')" 
                          size="small" 
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
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="网站站长负责人">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="writePermit.includes('domain_attr')||readPermit.includes('domain_attr')">
                <td class="type-title"><span>网站标签：</span></td>
                <td>
                  <div class="item-form-content">
                    <div class="item-column flex">
                      <div class="item-wrap">
                        <el-input
                          v-model="formData.domain_attr"
                          :disabled="!writePermit.includes('domain_attr')" 
                          @input="attrChangeHandler"
                          size="small"
                          clearable>
                        </el-input>
                      </div>
                      <el-popover
                        placement="left"
                        width="300"
                        trigger="hover"
                        content="网站属性标签，有系统标签可供选择，也可添加自定义标签，以'|'分隔不同标签，并以'|'结尾">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                  <div class="item-form-content" v-if="attrTagList.length>0">
                    <div class="item-column flex">
                      <div class="item-wrap flex-box">
                        <el-button class="item-tag" type="primary" v-for="(item,index) in attrTagList" v-bind:key="index" v-bind:class="item.isOn?'':'is-plain'" size="mini" v-on:click="clickAttrTag(item.name)">{{item.name}}</el-button>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="系统标签">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="writePermit.includes('domain_header')||readPermit.includes('domain_header')">
                <td class="type-title"><span>主机头：</span></td>
                <td>
                  <div class="item-form-content">
                    <div class="item-column flex">
                      <div class="item-wrap">
                        <el-input
                          v-model="formData.domain_header"
                          :disabled="!writePermit.includes('domain_header')" 
                          size="small"
                          @input="hostChangeHandler"
                          clearable>
                        </el-input>
                      </div>
                      <el-popover
                        placement="left"
                        width="300"
                        trigger="hover"
                        content="主机头属性标签，有系统主机头标签可供选择，也可添加自定义标签，以'|'分隔不同标签，并以'|'结尾">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                  </div>
                  <div class="item-form-content" v-if="hostTagList.length>0">
                    <div class="item-column flex">
                      <div class="item-wrap flex-box">
                        <el-button class="item-tag" type="primary" v-for="(item,index) in hostTagList" v-bind:key="index" v-bind:class="item.isOn?'':'is-plain'" size="mini" v-on:click="clickHostTag(item.name)">{{item.name}}</el-button>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="系统主机头标签">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
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
                        :autosize="{ minRows: 10, maxRows: 20}"
                        placeholder="请输入网站备注"
                        v-model="formData.remarks"
                        size="small"
                        clearable>
                      </el-input>
                    </div>
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
                      <i slot="reference" class="el-icon-s-opportunity"></i>
                    </el-popover>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="type-title"><span>其他属性：</span></td>
                <td>
                  <div class="item-form-content flex-box">
                    <div class="item-column" style="width:240px;" v-if="writePermit.includes('is_online')||readPermit.includes('is_online')">
                      <strong>上线：</strong>
                      <div class="item-wrap">
                        <el-checkbox v-model="formData.is_online" :disabled="!writePermit.includes('is_online')" label="网站已上线" border size="small"></el-checkbox>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="网站上线后，需勾选此项">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-column" style="width: 240px;" v-if="writePermit.includes('sort')||readPermit.includes('sort')">
                      <strong>排序：</strong>
                      <div class="item-wrap">
                        <el-input
                          v-model="formData.sort"
                          :disabled="!writePermit.includes('sort')"
                          clearable
                          size="small">
                        </el-input>
                      </div>
                      <el-popover
                        placement="left"
                        width="200"
                        trigger="hover"
                        content="网站列表中可进行排序">
                        <i slot="reference" class="el-icon-s-opportunity"></i>
                      </el-popover>
                    </div>
                    <div class="item-column flex">
                      <strong style="width:120px;">更新时间：</strong>
                      <div class="item-wrap">
                        <div class="font">{{formData.updatetime}}</div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
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
      menuButtonPermit:[],
      scrollHeight:200,
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
        openstatus:"",
        speed:"",
        speedcheckstatus:0,
        isCn:true,
        serverstatus:0,
      },
      websiteInfo:null,
      openstatus:0,
      websiteList:[],
      isHttps:false,
      languageSelectList:[],
      brandSelectList:[],
      departSelectList:[],
      userSelectList:[],
      hostTagList:[],
      attrTagList:[],
      readPermit:[],
      writePermit:[]
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
    // 初始化数据
    initData(){
        var $this = this;
        if($this.$router.currentRoute.meta.id){
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
            console.log(res.data,"操作权限");
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Website_edit')){
              if($this.device==="desktop"){
                $this.getWebsiteSystemData();
              }else{
                $this.$message({
                  showClose: true,
                  message: "请前往PC端做修改查看操作",
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
            console.log(response,"系统展示数据");
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
                  console.log(response,"网站详情");
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
      if(data.languagename=="中文"){
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
      $this.formData.openstatus="";
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
        $this.$router.push({path:'/Webserver/lists',query:{IP:$this.formData.ip}});
      }
    },
    // 同步留言板权限
    syncMessage(){
      var $this = this;
      $this.$alert('该功能暂未实现，将在留言板模块开发时实现', '提示', {
        confirmButtonText: '确定',
      });
    }
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
.flex-box{display:flex;flex-wrap:wrap;}
.item-form-content{
  display: flex;
  .item-column{
    &.flex{
      flex: 1;
    }
    display: flex;
    padding: 5px 0;
    ::v-deep .el-select{
      display: block;
    }
    .item-tag{
      margin: 5px;
      &:focus{
        background: #47bba4;
        border-color: #47bba4;
        color: #FFFFFF;
      }
      &.is-plain:focus{
        color: #2e88ff;
        background: #e8f7f4;
        border-color: #a3ddd1;
      }
    }
    .font{
      display: block;
      padding: 0 5px;
      margin: 0 5px;
      height: 32px;
      font-size: 14px;
      line-height: 32px;
      color: #333;
    }
    .text{
      display: block;
      padding: 0 5px;
      margin: 0 5px;
      height: 32px;
      font-size: 12px;
      line-height: 32px;
      color: $--color-primary;
    }
    .link{
      display: block;
      padding: 0 5px;
      margin: 0 5px;
      height: 32px;
      font-size: 14px;
      line-height: 32px;
      color: $--color-primary;
    }
    .icon-title{
      margin: 0 5px;
      font-size: 14px;
      color: $--color-primary;
      cursor: pointer;
      .svg-i{
        color: $--color-primary;
      }
    }
    >strong{
      display: block;
      width:100px;
      text-align: right;
      height: 32px;
      line-height: 32px;
      font-weight: normal;
      padding: 0 10px 0 0;
    }
    >span{
      display: block;
      width: 30px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      font-size: 14px;
      cursor: pointer;
      color: #bbb;
    }
    .item-wrap{
      flex:1;
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
.remarks-content{
  p{
    line-height: 2;
    font-size: 14px;
  }
}
.table-icon{
  line-height:0;
  transition: all .3s;
  .svg-i{
    display: inline-block;
    vertical-align: middle;
    margin: 3px;
    cursor: pointer;
    color: #333;
    &.link{
      &:hover{
        color: $--color-primary;
      }
    }
    &.offline{
      color: #909399;
    }
    &.online{
      color: #42d885;
    }
    &.abnormal{
      color: #ff4949;
    }
    &.timeout{
      color: #ffc833;
    }
  }
  .svg-icon{
    width: 20px;
    height: 20px;
  }
  span{
    vertical-align: middle;
    line-height: 24px;
  }
}
</style>