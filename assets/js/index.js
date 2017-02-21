/* globals YT */

const $ = require('jquery')

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

var vid = {
  'videoId': '4P6kAeQ_m1Q',
  'startSeconds': 0,
  // 'endSeconds': 690,
  'suggestedQuality': 'hd720'
}
var rad = {
  'videoId': 'OS90-v5bj7M',
  'startSeconds': 0,
  // 'endSeconds': 690,
  // 'suggestedQuality': 'small'
}

// Hack to use onYouTubePlayerAPIReady with webpack : http://stackoverflow.com/questions/12256382/youtube-iframe-api-not-triggering-onyoutubeiframeapiready
window.onYouTubePlayerAPIReady = () => {
  tv = new YT.Player('tv', {events: {'onReady': onTVReady, 'onStateChange': onPlayerStateChange}, playerVars: playerDefaults})
  rd = new YT.Player('rd', {events: {'onReady': onRadReady, 'onStateChange': onPlayerStateChange}, playerVars: playerDefaults})
}

var onTVReady = () => {
  tv.loadVideoById(vid)
  tv.mute()
}

var onRadReady = () => {
  rd.loadVideoById(rad)
}

var onPlayerStateChange = (e) => {
  if (e.data === 1) {
    $('#tv').addClass('active')
  } else if (e.data === 2) {
    $('#tv').removeClass('active')
    tv.loadVideoById(vid)
    rd.loadVideoById(rad)
    tv.seekTo(vid.startSeconds)
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
    $('.tv .screen').css({'left': - (newW - w) / 2 + 'px'})
    $('.tv .screen').css({'top': - (newH - h) / 2 + 'px'})
  } else {
    // H wins
    newH = h
    newW = newH * 1167 / 721
    if (w < 448) {
      // Try to center biker a little bit
      $('.tv .screen').css({'left': - ((1.5 * newW) - w) / 2 + 'px'})
    } else if (w < 800) {
      // Try to center biker a little bit
      $('.tv .screen').css({'left': - ((1.3 * newW) - w) / 2 + 'px'})
    } else {
      $('.tv .screen').css({'left': - (newW - w) / 2 + 'px'})
    }
    $('.tv .screen').css({'top': - (newH - h) / 2 + 'px'})
  }
  tv.setSize(newW, newH)
}

$(window).on('load resize', () => {
  vidRescale()
})
