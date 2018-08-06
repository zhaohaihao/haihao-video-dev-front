const app = getApp()

Page({
    data: {
      bgmList: [],
      serverUrl: "",
      videoParams: {}
    },

    onLoad: function (params) {
      var me = this;
      console.log(params);
      me.setData({
        videoParams: params
      });

      wx.showLoading({
        title: '请等待...',
      });
      var serverUrl = app.serverUrl;
      var user = app.getGlobalUserInfo();
      // 调用后端
      wx.request({
        url: serverUrl + '/bgm/list',
        method: "POST",
        header: {
          'content-type': 'application/json',
          'userId': user.id,
          'userToken': user.userToken
        },
        success: function (res) {
          console.log(res.data);
          wx.hideLoading();
          if (res.data.status == 200) {
            var bgmList = res.data.data;
            me.setData({
              bgmList: bgmList,
              serverUrl: serverUrl
            });
          } else if (res.data.status == 502) {
            wx.showToast({
              title: res.data.msg,
              duration: 3000,
              icon: "none",
              success: function () {
                wx.redirectTo({
                  url: '../userLogin/login',
                })
              }
            })
          }
        }
      })
    },

    upload: function (e) {
      var me = this;
      console.log(e);
      var bgmId = e.detail.value.bgmId;
      var desc = e.detail.value.desc;

      console.log("bgmId: " + bgmId);
      console.log("desc: " + desc);
  
      var duration = me.data.videoParams.duration;
      var tempHeight = me.data.videoParams.tempHeight;
      var tempWidth = me.data.videoParams.tempWidth;
      var tempVideoUrl = me.data.videoParams.tempVideoUrl;
      var tempCoverUrl = me.data.videoParams.tempCoverUrl;

      // 上传短视频
      wx.showLoading({
        title: '上传中...',
      })
      var serverUrl = app.serverUrl;
      // fixme 修改原有的全局对象为本地缓存
      var userInfo = app.getGlobalUserInfo();
      wx.uploadFile({
        url: serverUrl + '/video/uploadVideo',
        formData: {
          userId: userInfo.id,  // fixme 原来的 app.userInfo.id
          bgmId: bgmId,
          desc: desc,
          videoSeconds: duration,
          videoWidth: tempHeight,
          videoHeight: tempWidth
        },
        filePath: tempVideoUrl,
        name: 'file',
        header: {
          'content-type': 'application/json',
          'userId': userInfo.id,
          'userToken': userInfo.userToken
        },
        success: function (res) {
          var data = JSON.parse(res.data);
          wx.hideLoading();
          if (data.status == 200) {
            wx.showToast({
              title: '上传成功!',
              icon: "success"
            });
            wx.navigateTo({
              url: '../mine/mine',
            })
            // var videoId = data.data;
            // // 上传封面
            // wx.showLoading({
            //   title: '上传中...',
            // })
            // wx.uploadFile({
            //   url: serverUrl + '/video/uploadCover',
            //   formData: {
            //     userId: app.userInfo.id,
            //     videoId: videoId
            //   },
            //   filePath: tempCoverUrl,
            //   name: 'file',
            //   header: {
            //     'content-type': 'application/json' // 默认值
            //   },
            //   success: function (res) {
            //     var data = JSON.parse(res.data);
            //     wx.hideLoading();
            //     if (data.status == 200) {
            //       wx.showToast({
            //         title: '上传成功!',
            //         icon: 'success'
            //       });
            //       wx.navigateBack({
            //         delta: 1,
            //       })
            //     } else {
            //       wx.showToast({
            //         title: '上传失败!',
            //         icon: 'none'
            //       })
            //     }
            //   }
            // })
          } else if (res.data.status == 502) {
            wx.showToast({
              title: res.data.msg,
              duration: 3000,
              icon: "none",
              success: function () {
                wx.redirectTo({
                  url: '../userLogin/login',
                })
              }
            })
          } else {
            wx.showToast({
              title: '上传失败!',
              icon: 'none'
            })
          }
        }
      })
    }
})

