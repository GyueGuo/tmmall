const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {
      coupon: 0,
      payPoints: 0,
      redPacket: 0,
      usableMoney: 0
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
    http.post(app.globalData.myMyWallet, {}).then(res => {
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
      case 'usableMoney': //账户余额
        wx.navigateTo({
          url: `/my/accountBalance/accountBalance?balance=${this.data.info.usableMoney}`
        })
        break;
      case 'coupon':
        wx.navigateTo({ //优惠劵
          url: `/my/coupon/coupon`
        })
        break;
      case 'redPacket': //红包
        wx.navigateTo({
          url: `/my/redPocket/redPocket`
        })
        break;
      case 'payPoints': //积分
        wx.navigateTo({
          url: `/my/integral/integral`
        })
        break;
      case 'accountRecharge': //充值
        wx.navigateTo({
          url: `/my/accountRecharge/accountRecharge`
        })
        break;
      case 'paymentCode': //付款码
        wx.navigateTo({
          url: `/my/vipCard/vipCard?tab=2`
        })
        break;
      case 'bank': //银行卡
        wx.navigateTo({
          url: `/my/bankList/bankList`
        })
        break;
    }
  }
})