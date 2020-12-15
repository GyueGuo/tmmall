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
      diy_color: app.globalData.diy_color
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
    http.post(app.globalData.recharge_list).then(res => {
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
      url: '/my/web_view/web_view?id=24',
    })
    // this.setData({
    //   charge_board: true
    // })
  },

  /**
   * 关闭充值说明
   */
  closeCharge() {
    this.setData({
      charge_board: false
    })
  },

  /**
   * 支付
   */
  pay() {
    if (app.login()) {
      http.post(app.globalData.common_order).then(res => {
        http.post(app.globalData.wx_pay, {
          openId: app.globalData.openid,
          outTradeNo: res.result,
          body: '充值',
          attach: `recharge|2|${app.globalData.member_id}|${this.data.list[this.data.current].recharge_id}`,
          total_fee: this.data.list[this.data.current].recharge_money
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