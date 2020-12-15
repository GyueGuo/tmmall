const http = require('../../utils/http.js');
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
    http.post(app.globalData.setting, {}).then(res => {
      this.setData({
        info: res.result
      })
    })
  },

  /**
   * 个人信息
   */
  onPersonal() {
    wx.navigateTo({
      url: '/my/personal/personal',
    })
  },

  /**
   * 收货地址
   */
  onAddress() {
    wx.navigateTo({
      url: '../address/address',
    })
  },

  /**
   * 账户安全
   */
  onAccount() {
    wx.navigateTo({
      url: '../account_safe/account_safe',
    })
  },

  /**
   * 通知
   */
  onMessage() {

  },

  /**
   * 问题反馈
   */
  onFeedback() {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },

  /**
   * 关于我们
   */
  onUs() {
    wx.navigateTo({
      url: '../about_us/about_us',
    })
  },
  showModal() {
    this.selectComponent("#modal").showModal()
  },
  
  /**
   * 退出登录
   */
  exit() {
    wx.clearStorageSync()
    app.globalData.member_id = ''
    app.globalData.phone = ''
    app.globalData.openid = ''
    app.globalData.unionId = ''
    app.globalData.token = ''
    //代言人ID
    app.globalData.sup_id = ''
    //是否入驻商家
    app.globalData.in_state = ''
    app.globalData.distribution = {}
    wx.closeSocket()
    clearTimeout(app.app_socketHeartTime)
    wx.reLaunch({
      url: '/pages/home/home'
    })
  }
})