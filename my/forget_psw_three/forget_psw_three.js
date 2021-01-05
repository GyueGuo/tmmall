const app = getApp();
const http = require('../../utils/http.js');
const REpsw = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    phone: '',
    psw: '',
    able: false,
    isPsw: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      phone: options.phone,
      type: options.type != undefined ? options.type : '',
    })
    if (this.data.type == 'login') {
      wx.setNavigationBarTitle({
        title: '忘记登录密码',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '忘记支付密码',
      })
    }
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
  pswInput(e) {
    let obj = {
      psw: e.detail.value
    }
    if (this.data.type == 'login') {
      if (REpsw.test(e.detail.value)) {
        obj.able = true
      }
    } else {
      obj.able = e.detail.value.length == 6
    }
    this.setData(obj)
  },

  /**
   * 完成忘记支付密码
   */
  finish() {
    if (this.data.able) {
      http.encPost(app.globalData.forgetPayPassword, {
        phone: this.data.phone,
        payPassword: this.data.psw
      }).then(res => {
        app.showSuccessToast(res.message, () => {
          wx.navigateBack()
        })
      })
    }
  },
  /**
   * 完成忘记登录密码
   */
  login() {
    if (!REpsw.test(this.data.psw)) {
      app.showToast('请输入6位-20位字母、数字密码')
      return
    }
    if (this.data.able) {
      http.encPost(app.globalData.forgetPassword, {
        phone: this.data.phone,
        password: this.data.psw
      }).then(res => {
        app.showSuccessToast(res.message, () => {
          wx.navigateBack()
        })
      })
    }
  },

  /**
   * 隐藏显示密码
   */
  onPswShow() {
    this.setData({
      isPsw: !this.data.isPsw
    })
  },
})