// pages/password/password.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type != undefined ? options.type : ''
    })
    if (this.data.type == 'login') {
      wx.setNavigationBarTitle({
        title: '登录密码',
      })
    }else{
      wx.setNavigationBarTitle({
        title: '支付密码',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
   * 修改密码
   */
  updatePassword() {
    if (this.data.type == 'login') {
      wx.navigateTo({
        url: '../change_password/change_password?type=login',
      })
    } else {
      wx.navigateTo({
        url: '../change_password/change_password',
      })
    }
  },

  /**
   * 忘记密码
   */
  forgetPassword() {
    if (this.data.type == 'login') {
      wx.navigateTo({
        url: '../forget_psw_one/forget_psw_one?type=login',
      })
    } else {
      wx.navigateTo({
        url: '../forget_psw_one/forget_psw_one',
      })
    }
  }
})