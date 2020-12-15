const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: '',
    p_type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      p_type: options.type
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
   * 密码输入
   */
  passwordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },

  login() {
    let re = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
    if (!re.test(this.data.password)) {
      app.showToast('请输入6位-20位字母、数组密码')
      return
    }
    http.encPost(app.globalData.set_password_login, {
      password: this.data.password
    }).then(res => {
      app.showSuccessToast(res.message, () => {
        // event.emit('setPassword')
        wx.navigateBack()
      })
    })
  }
})