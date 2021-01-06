const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    //当前滑块
    current: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getRecharge()
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

  /**
   * 获取充值列表
   */
  getRecharge() {
    http.post(app.globalData.rechargeList).then(res => {
      this.setData({
        list: res.result
      })
    })
  },

  /**
   * 滑动
   */
  swiperChange(e) {
    this.setData({
      current: e.detail.current
    })
  },

  /**
   * 点击选项卡
   */
  onSelect(e) {
    this.setData({
      current: e.currentTarget.dataset.index
    })
  },

  /**
   * 充值说明
   */
  onChargeInfo() {
    wx.navigateTo({
      url: '/my/webView/webView?id=24',
    })
  },

  /**
   * 关闭充值说明
   */
  closeCharge() {
    this.setData({
      chargeBoard: false
    })
  },

  /**
   * 支付
   */
  pay() {
    if (app.login()) {
      http.post(app.globalData.commonOrder).then(res => {
        http.post(app.globalData.wxPay, {
          openId: app.globalData.openid,
          outTradeNo: res.result,
          body: '充值',
          attach: `recharge|2|${app.globalData.memberId}|${this.data.list[this.data.current].rechargeId}`,
          totalFee: this.data.list[this.data.current].rechargeMoney
        }).then(res => {
          wx.requestPayment({
            timeStamp: res.result.timestamp,
            nonceStr: res.result.nonceStr,
            package: res.result.package,
            signType: res.result.signType,
            paySign: res.result.paySign,
            success: res => {
              app.showSuccessToast('充值成功', () => {})
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/my/my',
                })
              }, 1000)
            }
          })
        })
      })
    }
  }
})