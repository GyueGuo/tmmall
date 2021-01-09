const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fPsw: '',
    password: '',
    type: 0, //0设置,1确认
    focus: true, //焦点
    focusVerify: false
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
  pswFocus() {
    if (this.data.type === 0) {
      this.setData({
        focus: true,
      })
    } else {
      this.setData({
        focusVerify: true,
      })
    }
  },

  /**
   * 密码输入
   */
  passwordInput(e) {
    this.setData({
      password: e.detail.value
    })
    if (this.data.password.length == 6 && this.data.type === 0) {
      wx.showLoading({
        mask: true
      })
      this.setData({
        fPsw: this.data.password,
        password: '',
        type: 1,
        focus: false
      })
      wx.setNavigationBarTitle({
        title: '确认支付密码'
      })
      wx.nextTick(() => {
        wx.hideLoading()
        this.setData({
          focusVerify: true,
        })
      })
    }
  },
  /**
   * 密码输入
   */
  passwordInputVerify(e) {
    this.setData({
      password: e.detail.value
    })
    if (this.data.password.length == 6 && this.data.type === 1) {
      console.log('a')
      if (this.data.fPsw == this.data.password) {
        this.setData({
          focus: false,
          focusVerify: false,
        })
        wx.showLoading({
          title: '提交中',
          mask: true
        })
        http.encPost(app.globalData.setPassword, {
          payPassword: this.data.password
        }).then(res => {
          app.showSuccessToast(res.message, () => {
            wx.navigateBack()
            wx.hideLoading()
          })
        })
      } else {
        this.setData({
          fPsw: '',
          password: '',
          type: 0,
          focusVerify: false,
        })
        app.showToast('两次新密码输入不一致', () => {
          this.setData({
            focus: true,
          })
          wx.setNavigationBarTitle({
            title: '设置支付密码'
          })
        })
      }
    }
  },


})