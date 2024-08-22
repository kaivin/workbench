const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// const CompressionWebpackPlugin = require("compression-webpack-plugin");
// const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const path = require("path");
const open = require('open');// 打开浏览器
const chalk = require('chalk');// 改变命令行中输出日志颜色插件
const ip = require('ip').address();
const defaultSettings = require('./src/settings.js')
function resolve(dir) {
  return path.join(__dirname, dir);
}
const name = defaultSettings.title
const port = process.env.port || process.env.npm_config_port || 9527
module.exports = {
    // 选项...
    publicPath:process.env.BASE_URL,
    outputDir:process.env.outputDir,
    assetsDir:'static',
    productionSourceMap:false,
    lintOnSave: false,
    configureWebpack: {
        name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            },
            extensions: [ ".js", ".json"]
        },
        // plugins: [
        //   new CompressionWebpackPlugin({
        //       filename: "[path].gz[query]",
        //       algorithm: "gzip",
        //       test: productionGzipExtensions,
        //       compressionOptions: { level: 7 },
        //       threshold: 10240,
        //       minRatio: 0.8,
        //       deleteOriginalAssets: true
        //     })
        // ]
    },
    css:{
        loaderOptions:{
            sass:{
                prependData:`
                    @import "./src/styles/-variables.scss";
                    @import "./src/styles/-mixin.scss";
                    @import "./src/styles/element_variables.scss";
                    `,
                // additionalData:`@import "~@/styles/variables.scss"`
                implementation: require('sass'),
                sassOptions: {
                  // 生效代码
                  outputStyle: 'expanded'
                }	
            }
        }
    },
    chainWebpack: config =>{
        config.resolve.symlinks(true);
        config.plugin('html')
          .tap(args => {
            args[0].title = name;
            return args;
        });
        config.resolve.alias
        .set('@', resolve('src'))
        .set('assets', resolve('src/assets'))
        .set('components', resolve('src/components'))
        .set('api', resolve('src/api'))

        config.plugin('preload').tap(() => [
            {
              rel: 'preload',
              // to ignore runtime.js
              // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
              fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
              include: 'initial'
            }
        ])
      
        // when there are many pages, it will cause too many meaningless requests
        config.plugins.delete('prefetch')
    
        // set svg-sprite-loader
        config.module.rule('svg').exclude.add(resolve('src/icons')).end()
        config.module.rule('icons').test(/\.svg$/).include.add(resolve('src/icons')).end().use('svg-sprite-loader').loader('svg-sprite-loader').options({
            symbolId: 'icon-[name]'
        }).end()

        config.when(process.env.NODE_ENV !== 'development',config => {
          config.plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
          }]).end()
          config.optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
          })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
          config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
            {
              analyzerMode: "static"
            }
          ]);
        })
    },
    devServer:{
        port:port,
        hotOnly:true,    // 是否热更新;
        host: ip,
        overlay:{
            warnings: false,
            errors: true
        },
        // historyApiFallback: {
        //     index: '/index.html' //与output的publicPath
        // },
        proxy:{
            '/api':{   // 路径中有 /api 的请求都会走这个代理 , 可以自己定义一个,下面移除即可
                target:'http://172.16.10.23:8017',    // 目标代理接口地址,实际跨域要访问的接口,这个地址会替换掉 axios.defaults.baseURL
                secure:false,
                changeOrigin:true,  // 开启代理，在本地创建一个虚拟服务端
                ws:true,       // 是否启用  websockets;
                pathRewrite:{   // 去掉 路径中的  /api  这一截
                    '^/api':''
                }
            },
        },
        after() {
            open(`http://${ip}:${this.port}`).then(() => {
                console.log(chalk.cyan(`成功打开链接： http://${ip}:${this.port}`));
            }).catch(err => {
                console.log(chalk.red(err));
            });
        }
    }
}