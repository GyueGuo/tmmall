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
        src = app.globalData.regist_web
        break;
      case "20":
        wx.setNavigationBarTitle({
          title: '拼团玩法',
        })
        src = app.globalData.collage_rule_web
        break;
      case "21":
        wx.setNavigationBarTitle({
          title: '砍价活动规则',
        })
        src = app.globalData.bargain_rule_web
        break;
      case "24":
        wx.setNavigationBarTitle({
          title: '充值说明',
        })
        src = app.globalData.recharge_web
        break;
      case "33":
        wx.setNavigationBarTitle({
          title: '门店自提',
        })
        src = app.globalData.store_self_web
        break;
      case "34":
        wx.setNavigationBarTitle({
          title: '主营类目店铺',
        })
        src = app.globalData.shop_category_web
        break;
      case "35":
        wx.setNavigationBarTitle({
          title: '店铺服务协议',
        })
        src = app.globalData.shop_service_web
        break;
      case "draw_activity":
        wx.setNavigationBarTitle({
          title: '抽奖规则',
        })
        src = app.globalData.draw_activity_view + '?activity_id=' + options.draw_id
        break;
      case "distribution":
        wx.setNavigationBarTitle({
          title: '收益说明',
        })
        src = app.globalData.distribution_my_explain
        break;
      default:
        wx.setNavigationBarTitle({
          title: '积分说明',
        })
        src = app.globalData.integral_help
        break;
    }
    this.setData({
      src: src
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