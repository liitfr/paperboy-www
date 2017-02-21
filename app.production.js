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
  }
}
