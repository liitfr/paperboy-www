/* globals $, YT, Expo, TweenLite, Power4 */

const ScrollMagic = require('ScrollMagic')
require('animation.gsap')
const TweenMax = require('TweenMax')
require('ScrollToPlugin')

var smController = new ScrollMagic.Controller()

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
  'videoId': 'CT8t_1JXWn8',
  // 'videoId': 'CfMMlT8Lyns',
  'startSeconds': 4
}

// Hack to use onYouTubePlayerAPIReady with webpack : http://stackoverflow.com/questions/12256382/youtube-iframe-api-not-triggering-onyoutubeiframeapiready
window.onYouTubePlayerAPIReady = () => {
  rd = new YT.Player('rd', {events: {'onReady': onRadReady}, playerVars: playerDefaults})
}

var onTVReady = () => {
  vidRescale()
  $('.control#pause').on('click', () => tv.pauseVideo())
  $('.control#play').on('click', () => tv.playVideo())
  tv.loadVideoById(vid)
  tv.mute()
}

var onRadReady = () => {
  new ScrollMagic.Scene({triggerElement: '#trigger-volume', duration: 700})
    .addTo(smController)
    .on('progress', function (e) {
      rd.setVolume((1 - e.progress.toFixed(3)) * 100)
    })
  tv = new YT.Player('tv', {events: {'onReady': onTVReady, 'onStateChange': onPlayerStateChange}, playerVars: playerDefaults})
  rd.loadVideoById(rad)
  $('.control#pause, .control#play').on('click', () => {
    $('.control#pause, .control#play').toggleClass('hidden')
  })
  $('.control#pause').on('click', () => rd.pauseVideo())
  $('.control#play').on('click', () => rd.playVideo())
  $('.control#replay').on('click', () => {
    tv.seekTo(0)
    rd.seekTo(0)
    $('.control#pause, .control#replay').toggleClass('hidden')
  })
  $('.control#volume-off, .control#volume-on').on('click', () => {
    $('.control#volume-off, .control#volume-on').toggleClass('hidden')
  })
  $('.control#volume-off').on('click', () => rd.mute())
  $('.control#volume-on').on('click', () => rd.unMute())
}

var onPlayerStateChange = (e) => {
  // -1: unstarted
  // 0: ended
  // 1: playing
  // 2: paused
  // 3: buffering
  // 4: video cued
  if (e.data === 1) {
    $('#tv').addClass('active')
  } else if (e.data === 0) {
    $('.control#pause, .control#replay').toggleClass('hidden')
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

// -----------------------------------------------------------------------------
// Tweens

TweenMax.to('#title-hyphen', 0.5, {ease: Expo.easeInOut, autoAlpha: 0, yoyo: true, repeat: -1})
$('.control#see-more').on('click', () => TweenLite.to(window, 1.5, {ease: Power4.easeOut, scrollTo: '#presentation'}))
