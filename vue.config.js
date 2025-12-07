const path = require('path')
const webpack = require('webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const GitRevision = new GitRevisionPlugin()
const buildDate = JSON.stringify(new Date().toLocaleString())
const createThemeColorReplacerPlugin = require('./config/plugin.config')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    'viser-vue': 'ViserVue',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    '//lib.baomitu.com/vue/2.6.10/vue.min.js',
    '//lib.baomitu.com/vue-router/3.1.3/vue-router.min.js',
    '//unpkg.com/viser-vue/umd/viser-vue.min.js',
    '//lib.baomitu.com/vuex/3.1.1/vuex.min.js',
    '//lib.baomitu.com/axios/0.19.0/axios.min.js'
  ]
}

// vue.config.js
const vueConfig = {
  // 部署应用包时的基本 URL
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',

  configureWebpack: {
    // 开发环境启用 source map - 使用 source-map 获得最佳调试体验
    devtool: isProd ? false : 'source-map',
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      })
      // new webpack.DefinePlugin({
      //   APP_VERSION: `"${require('./package.json').version}"`,
      //   GIT_HASH: JSON.stringify(GitRevision.version()),
      //   BUILD_DATE: buildDate
      // })
    ],
    // if prod, add externals
    externals: isProd ? assetsCDN.externals : {}
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))

    // fixed svg-loader by https://github.com/damianstasik/vue-svg-loader/issues/185#issuecomment-1126721069
		const svgRule = config.module.rule('svg')
		// Remove regular svg config from root rules list
		config.module.rules.delete('svg')

		config.module.rule('svg')
			// Use svg component rule
			.oneOf('svg_as_component')
				.resourceQuery(/inline/)
				.test(/\.(svg)(\?.*)?$/)
				.use('babel-loader')
					.loader('babel-loader')
					.end()
				.use('vue-svg-loader')
					.loader('vue-svg-loader')
					.options({
						svgo: {
							plugins: [
								{ prefixIds: true },
								{ cleanupIDs: true },
								{ convertShapeToPath: false },
								{ convertStyleToAttrs: true }
							]
						}
					})
					.end()
				.end()
			// Otherwise use original svg rule
			.oneOf('svg_as_regular')
				.merge(svgRule.toConfig())
				.end()

    // if prod is on
    // assets require on cdn
    if (isProd) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })
    }
  },

  css: {
    // 定位css文件
    sourceMap: true,
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme

          // 默认蓝
          // 'primary-color': '#1890ff',
          // 'link-color': '#1890ff',

          'font-size-base': '13px',
          'border-radius-base': '2px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 8000
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    // proxy: {
    //   '/api': {
    //     target: 'https:/www.abc.com/index.php/store',
    //     ws: false,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '/api': ''
    //     }
    //   }
    // }
  },

  // 开发环境启用 source map,便于调试
  // disable source map in production
  productionSourceMap: false,
  lintOnSave: false,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
  console.log('VUE_APP_PREVIEW', true)
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
