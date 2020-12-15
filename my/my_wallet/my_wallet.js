// my/my_wallet/my_wallet.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {
      coupon: 0,
      pay_points: 0,
      red_packet: 0,
      usable_money: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      configSwitch: app.globalData.configSwitch
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.my_myWallet, {}).then(res => {
      this.setData({
        info: res.data
      })
    })
  },

  /**
   * 路由
   */
  route(e) {
    let item = e.currentTarget.dataset.item
    switch (item) {
      case 'usable_money': //账户余额
        wx.navigateTo({
          url: `/my/account_balance/account_balance?balance=${this.data.info.usable_money}`
        })
        break;
      case 'coupon':
        wx.navigateTo({ //优惠劵
          url: `/my/coupon/coupon`
        })
        break;
      case 'red_packet': //红包
        wx.navigateTo({
          url: `/my/red_pocket/red_pocket`
        })
        break;
      case 'pay_points': //积分
        wx.navigateTo({
          url: `/my/integral/integral`
        })
        break;
      case 'account_recharge': //充值
        wx.navigateTo({
          url: `/my/account_recharge/account_recharge`
        })
        break;
      case 'payment_code': //付款码
        wx.navigateTo({
          url: `/my/vip_card/vip_card?tab=2`
        })
        break;
      case 'bank': //银行卡
        wx.navigateTo({
          url: `/my/bank_list/bank_list`
        })
        break;
    }
  }
})