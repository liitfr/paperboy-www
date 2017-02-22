// TODO : audio doesn't work on mobile. But then works when pause & resume video. FIND A HACK
// TODO : FIND A HACK to hide player button once video has been played

const path = require('path')
const HardSourcePlugin = require('hard-source-webpack-plugin')
const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('babel-preset-latest')
const pageId = require('spike-page-id')
const lost = require('lost')

module.exports = {
  devtool: 'source-map',
  vendor: 'assets/vendor/**',
  dumpDirs: ['views', 'assets', 'www'],
  matchers: {
    html: '*(**/)*.sgr',
    css: '*(**/)*.sss'
  },
  ignore: ['**/layout.sgr', '**/_*', '**/.*', '_cache/**', 'readme.md'],
  reshape: (ctx) => {
    return htmlStandards({
      webpack: ctx,
      locals: { pageId: pageId(ctx) }
    })
  },
  postcss: (ctx) => {
    const css = cssStandards({
      rucksack: {
        fallbacks: true
      },
      webpack: ctx
    })
    css.plugins.push(lost())
    return css
  },
  babel: { presets: [jsStandards] },
  plugins: [
    new HardSourcePlugin({
      environmentPaths: { root: __dirname },
      recordsPath: path.join(__dirname, '_cache/records.json'),
      cacheDirectory: path.join(__dirname, '_cache/hard_source_cache')
    })
  ],
  resolve: {
    root: path.resolve('./node_modules'),
    alias: {
      'animation.gsap': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js'),
      'CssPlugin': path.resolve('node_modules', 'gsap/src/uncompressed/plugins/CSSPlugin.js'),
      'EasePack': path.resolve('node_modules', 'gsap/src/uncompressed/easing/EasePack.js'),
      'ScrollMagic': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js'),
      'ScrollToPlugin': path.resolve('node_modules', 'gsap/src/uncompressed/plugins/ScrollToPlugin.js'),
      'TimelineLite': path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
      'TimelineMax': path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js'),
      'TweenMax': path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
      'TweenLite': path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js')
    }
  }
}
