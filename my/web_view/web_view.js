const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let src = ''
    switch (options.id) {
      case "17":
        wx.setNavigationBarTitle({
          title: '注册协议',
        })
        src = app.globalData.registWeb
        break;
      case "20":
        wx.setNavigationBarTitle({
          title: '拼团玩法',
        })
        src = app.globalData.collageRuleWeb
        break;
      case "21":
        wx.setNavigationBarTitle({
          title: '砍价活动规则',
        })
        src = app.globalData.bargainRuleWeb
        break;
      case "24":
        wx.setNavigationBarTitle({
          title: '充值说明',
        })
        src = app.globalData.rechargeWeb
        break;
      case "33":
        wx.setNavigationBarTitle({
          title: '门店自提',
        })
        src = app.globalData.storeSelfWeb
        break;
      case "34":
        wx.setNavigationBarTitle({
          title: '主营类目店铺',
        })
        src = app.globalData.shopCategoryWeb
        break;
      case "35":
        wx.setNavigationBarTitle({
          title: '店铺服务协议',
        })
        src = app.globalData.shopServiceWeb
        break;
      case "drawActivity":
        wx.setNavigationBarTitle({
          title: '抽奖规则',
        })
        src = app.globalData.drawActivityView + '?activityId=' + options.drawId
        break;
      case "distribution":
        wx.setNavigationBarTitle({
          title: '收益说明',
        })
        src = app.globalData.distributionMyExplain
        break;
      default:
        wx.setNavigationBarTitle({
          title: '积分说明',
        })
        src = app.globalData.integralHelp
        break;
    }
    this.setData({
      src,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})