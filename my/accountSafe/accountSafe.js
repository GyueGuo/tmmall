const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    event.on('setPassword', this, () => {
      this.data.info.payState = 1
      this.setData({
        info: this.data.info
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getData()
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
    event.remove('setPassword', this)
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
  getData() {
    http.post(app.globalData.safety, {}).then(res => {
      this.setData({
        info: res.result
      })
    })
  },

  /**
   * 手机号码
   */
  onPhone() {
    wx.navigateTo({
      url: `${this.data.info.phoneState == 1 ? '/my/changePhone/changePhone?status=0':'/my/changePhone/changePhone?status=2'}`,
    })
  },

  /**
   * 支付密码
   */
  onPassword() {
    if (this.data.info.payState == 0) {
      wx.navigateTo({
        url: '/my/setPayPsw/setPayPsw',
      })
    } else {
      wx.navigateTo({
        url: '../password/password',
      })
    }
  },
  /**
   * 登录密码
   */
  onsetPassword() {
    if (this.data.info.passwordState == 0) {
      wx.navigateTo({
        url: '../setPassword/setPassword?type=login',
      })
    } else {
      wx.navigateTo({
        url: '../password/password?type=login',
      })
    }
  }
})