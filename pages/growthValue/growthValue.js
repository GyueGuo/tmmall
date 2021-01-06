const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountStatus: true,
    shoppingStatus: true,
    interactStatus: true
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
    this.getData()
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
   * 开关账户
   */
  changeAccount() {
    this.setData({
      accountStatus: !this.data.accountStatus
    })
  },

  /**
   * 开关购物
   */
  changeShopping() {
    this.setData({
      shoppingStatus: !this.data.shoppingStatus
    })
  },

  /**
   * 开关互动
   */
  changeInteract() {
    this.setData({
      interactStatus: !this.data.interactStatus
    })
  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.myTask, {}).then(res => {
      this.setData({
        info: res
      })
    })
  },

  goShopping() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  goCommenting() {
    wx.navigateTo({
      url: '/my/myComment/myComment',
    })
  },

  goView() {
    wx.navigateTo({
      url: '/pages/hotSpots/hotSpots',
    })
  }
})