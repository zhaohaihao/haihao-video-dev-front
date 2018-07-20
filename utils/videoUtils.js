function uploadVideo() {
  // fixme 视频上传复用
  // videoUtil.uploadVideo();
  // 以下是原来的代码，不删除，便于参照
  var me = this;

  wx.chooseVideo({
    sourceType: ['album'],
    success: function (res) {
      console.log("ressss"+res);

      var duration = res.duration;
      var tmpHeight = res.height;
      var tmpWidth = res.width;
      var tmpVideoUrl = res.tempFilePath;
      var tmpCoverUrl = res.thumbTempFilePath;

      if (duration > 11) {
        wx.showToast({
          title: '视频长度不能超过10秒...',
          icon: "none",
          duration: 2500
        })
      } else if (duration < 1) {
        wx.showToast({
          title: '视频长度太短，请上传超过1秒的视频...',
          icon: "none",
          duration: 2500
        })
      } else {
        // 打开选择bgm的页面
        wx.navigateTo({
          url: '../chooseBgm/chooseBgm?duration=' + duration
          + "&tempHeight=" + tmpHeight
          + "&tempWidth=" + tmpWidth
          + "&tempVideoUrl=" + tmpVideoUrl
          + "&tempCoverUrl=" + tmpCoverUrl
          ,
        })
      }

    }
  })

}

module.exports = {
  uploadVideo: uploadVideo
}