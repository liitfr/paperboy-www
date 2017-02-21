const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const pageId = require('spike-page-id')
const {UglifyJsPlugin, DedupePlugin, OccurrenceOrderPlugin} = require('webpack').optimize
const lost = require('lost')

module.exports = {
  // disable source maps
  devtool: false,
  vendor: 'assets/vendor/**',
  dumpDirs: ['views', 'assets', 'www'],
  // webpack optimization and minfication plugins
  plugins: [
    new UglifyJsPlugin(),
    new DedupePlugin(),
    new OccurrenceOrderPlugin()
  ],
  // image optimization
  module: {
    loaders: [{ test: /\.(jpe?g|png|gif|svg)$/i, loader: 'image-webpack' }]
  },
  // adds html minification plugin
  reshape: (ctx) => {
    return htmlStandards({
      webpack: ctx,
      locals: { pageId: pageId(ctx) },
      minify: true
    })
  },
  // adds css minification plugin
  postcss: (ctx) => {
    const css = cssStandards({
      rucksack: {
        fallbacks: true
      },
      webpack: ctx,
      minify: true,
      warnForDuplicates: false // cssnano includes autoprefixer
    })
    css.plugins.push(lost())
    return css
  },
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
