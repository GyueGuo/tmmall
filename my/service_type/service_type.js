// pages/service_type/service_type.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: 1, // 是否收到货 1未收到货 2已收到货
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.dataInfo = JSON.parse(options.dataInfo)
    this.data.dataInfo.info['file'] = decodeURIComponent(this.data.dataInfo.info.file)
    let state = 1
    if (this.data.dataInfo.status == 3 || this.data.dataInfo.status == 4) {
      //同城或者快递 已收货
      state = 2
    } else {
      state = 1
    }
    this.setData({
      diy_color: app.globalData.diy_color,
      dataInfo: this.data.dataInfo,
      state: state
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

  /**
   * 退款
   * state 是否收到货 1未收到货 2已收到货
   * type: 退款类型 1退款 2退货退款
   */
  onRefund() {
    let dataInfo = this.data.dataInfo
    dataInfo.state = this.data.state
    dataInfo.type = 1
    dataInfo.info.file = encodeURIComponent(dataInfo.info.file)
    wx.navigateTo({
      url: `/my/apply_refund/apply_refund?dataInfo=${JSON.stringify(dataInfo)}`
    })
    dataInfo.info.file = decodeURIComponent(dataInfo.info.file)
  },

  /**
   * 退货退款
   * state 是否收到货 1未收到货 2已收到货
   * type: 退款类型 1退款 2退货退款
   */
  onRefundProduct() {
    let dataInfo = this.data.dataInfo
    dataInfo.state = this.data.state
    dataInfo.type = 2
    dataInfo.info.file = encodeURIComponent(dataInfo.info.file)
    wx.navigateTo({
      url: `/my/apply_refund/apply_refund?dataInfo=${JSON.stringify(dataInfo)}`
    })
    dataInfo.info.file = decodeURIComponent(dataInfo.info.file)
  }
})