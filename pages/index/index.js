const app = getApp()

Page({
  data: {
    // 用于分页的属性
    totalPage: 1,
    page: 1,
    videoList: [],
    screenWidth: 350,
    serverUrl: "",
    searchContent: ""
  },

  onLoad: function (params) {
    var me = this;
    var screenWidth = wx.getSystemInfoSync().screenWidth;
    var searchContent = params.search;
    var isSaveRecord = params.isSaveRecord;
    if (isSaveRecord == null || isSaveRecord == '' || isSaveRecord == undefined) {
      isSaveRecord = 0;
    }
    me.setData({
      screenWidth: screenWidth,
      searchContent: searchContent
    });
    // 获取当前的分页数
    var page = me.data.page;
    me.getAllVideoList(page, isSaveRecord);
  },

  // 公共代码块
  getAllVideoList: function (page, isSaveRecord) {
    var me = this;
    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '请等待, 加载中...',
    });

    var searchContent = me.data.searchContent;
    wx.request({
      url: serverUrl + '/video/showAll?page=' + page + "&isSaveRecord=" + isSaveRecord,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        videoDesc: searchContent
      },
      success: function (res) {
        wx.hideLoading();
        // 当前页面隐藏导航条加载动画
        wx.hideNavigationBarLoading();
        // 停止当前页面下拉刷新
        wx.stopPullDownRefresh();
        console.log(res.data);

        // 判断当前页page是否是第一页, 如果是第一页, 那么设置videoList为空
        if (page === 1) {
          me.setData({
            videoList: []
          });
        }

        // 从数据库获取的videoList
        var videoList = res.data.data.rows;
        // 现有的videoList
        var newVideoList = me.data.videoList;

        me.setData({
          videoList: newVideoList.concat(videoList),
          page: page,
          totalPage: res.data.data.total,
          serverUrl: serverUrl
        });
      }
    })
  },

  // 上拉刷新
  onReachBottom: function () {
    var me = this;
    var currentPage = me.data.page;
    var totalPage = me.data.totalPage;

    // 判断当前页数和总页数是否相等, 如果相等则无需查询
    if (currentPage === totalPage) {
      wx.showToast({
        title: '已经没有视频啦!',
        icon: 'none'
      });
      return;
    }

    var page = currentPage + 1;
    me.getAllVideoList(page, 0);
  },

  onPullDownRefresh: function () {
    // 当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    this.getAllVideoList(1, 0);
  }
})
