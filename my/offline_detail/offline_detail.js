const app = getApp();
const http = require('../../utils/http.js');
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
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch
    })
    this.getData(options.id)
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
   * 获取数据
   */
  getData(id) {
    http.post(app.globalData.orderDetails, {
      orderAttachId: id
    }).then(res => {
      res.result['totalPrice'] = parseFloat(res.result.subtotalPrice) + parseFloat(res.result.subtotalCouponPrice) + parseFloat(res.result.totalPacketPrice)
      this.setData({
        discounts: (parseFloat(res.result.totalPacketPrice) + parseFloat(res.result.subtotalCouponPrice)).toFixed(2),
        info: res.result
      })
    })
  },

  goShop() {
    wx.navigateTo({
      url: '/nearbyShops/shopDetail/shopDetail?storeId=' + this.data.info.storeId,
    })
  },

  /**
   * 拨打电话
   */
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.info.storeList.phone,
    })
  },
  /**
   * 拨打平台电话
   */
  callPtPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.configSwitch.appInfo.contact,
    })
  },

  /**
   * 复制
   */
  copyOrderNumber() {
    wx.setClipboardData({
      data: this.data.info.orderAttachNumber,
    })
  }

})