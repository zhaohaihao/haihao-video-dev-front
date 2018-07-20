var videoUtils = require('../../utils/videoUtils.js')

const app = getApp()

Page({

  data: {
    cover: "cover"
  },

  // 页面值的变量
  videoCtx: {},

  onLoad: function () {
    var me = this;
    me.videoCtx = wx.createVideoContext("myVideo", me);
  },

  onShow: function () {
    var me = this;
    me.videoCtx.play();
  },

  onHide: function () {
    var me = this;
    me.videoCtx.pause();
  },

  showSearch: function () {
    wx.navigateTo({
      url: '../searchVideo/searchVideo',
    })
  },

  upload: function () {
    videoUtils.uploadVideo();
  }
})