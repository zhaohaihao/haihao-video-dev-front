//app.js
App({
  serverUrl: "http://localhost:8081",
  // serverUrl: "https://21979403.ngrok.io",
  userInfo: null,

  setGlobalUserInfo: function (user) {
    wx.setStorageSync("userInfo", user);
  },

  getGlobalUserInfo: function () {
    return wx.getStorageSync("userInfo");
  }
})