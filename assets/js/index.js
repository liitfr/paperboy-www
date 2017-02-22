/* globals YT */

const FastClick = require('fastclick')
$(function () {
  FastClick.attach(document.body)
})

// -----------------------------------------------------------------------------
// Avoid `console` errors in browsers that lack a console.
var method
var noop = () => {}
var methods = [
  'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
  'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
  'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
  'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
]
var length = methods.length
var console = (window.console = window.console || {})

while (length--) {
  method = methods[length]
  // Only stub undefined methods.
  if (!console[method]) {
    console[method] = noop
  }
}

// -----------------------------------------------------------------------------
// Video & music
// This code comes from : https://codepen.io/ccrch/pen/GgPLVW
var tag = document.createElement('script')
tag.src = 'https://www.youtube.com/player_api'
var firstScriptTag = document.getElementsByTagName('script')[0]
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

var tv
var rd
var playerDefaults = {
  autoplay: 0,
  autohide: 1,
  modestbranding: 0,
  rel: 0,
  showinfo: 0,
  controls: 0,
  disablekb: 1,
  enablejsapi: 0,
  iv_load_policy: 3
}

// Background video
var vid = {
  'videoId': '4P6kAeQ_m1Q',
  'startSeconds': 0,
  'suggestedQuality': 'hd720'
}
// Radio (music) video
var rad = {
  'videoId': 'CfMMlT8Lyns',
  'startSeconds': 0
}

// Hack to use onYouTubePlayerAPIReady with webpack : http://stackoverflow.com/questions/12256382/youtube-iframe-api-not-triggering-onyoutubeiframeapiready
window.onYouTubePlayerAPIReady = () => {
  rd = new YT.Player('rd', {events: {'onReady': onRadReady, 'onStateChange': onPlayerStateChange}, playerVars: playerDefaults})
}

var onTVReady = () => {
  vidRescale()
  $('.control#pause').on('click', () => tv.pauseVideo())
  $('.control#play').on('click', () => tv.playVideo())
  tv.loadVideoById(vid)
  tv.mute()
}

var onRadReady = () => {
  tv = new YT.Player('tv', {events: {'onReady': onTVReady, 'onStateChange': onPlayerStateChange}, playerVars: playerDefaults})
  rd.loadVideoById(rad)
  $('.control#pause, .control#play').on('click', () => {
    $('.control#pause, .control#play').toggleClass('hidden')
  })
  $('.control#pause').on('click', () => rd.pauseVideo())
  $('.control#play').on('click', () => rd.playVideo())
  $('.control#volume-off, .control#volume-on').on('click', () => {
    $('.control#volume-off, .control#volume-on').toggleClass('hidden')
  })
  $('.control#volume-off').on('click', () => rd.mute())
  $('.control#volume-on').on('click', () => rd.unMute())
}

var onPlayerStateChange = (e) => {
  if (e.data === 1) {
    $('#tv').addClass('active')
  }
}

var vidRescale = () => {
  var w = $(window).width()
  var h = $(window).height()
  var newW
  var newH
  // Dimensions without black frame
  if (w / h > 1167 / 721) {
    // W wins
    // Add black frame
    newW = w + 340
    newH = newW * 721 / 1167
    $('.tv .screen').css({'left': -(newW - w) / 2 + 'px'})
    $('.tv .screen').css({'top': -(newH - h) / 2 + 'px'})
  } else {
    // H wins
    newH = h
    newW = newH * 1167 / 721
    if (w < 448) {
      // Try to center biker a little bit
      $('.tv .screen').css({'left': -((1.5 * newW) - w) / 2 + 'px'})
    } else if (w < 800) {
      // Try to center biker a little bit
      $('.tv .screen').css({'left': -((1.3 * newW) - w) / 2 + 'px'})
    } else {
      $('.tv .screen').css({'left': -(newW - w) / 2 + 'px'})
    }
    $('.tv .screen').css({'top': -(newH - h) / 2 + 'px'})
  }
  tv.setSize(newW, newH)
}

$(window).on('resize', () => {
  vidRescale()
})
