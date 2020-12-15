const http = require('../../utils/http.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    old_psw: '',
    new_psw: '',
    confirm_psw: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: options.type != undefined ? options.type : '',
      diy_color: app.globalData.diy_color
    })
    if (this.data.type == 'login') {
      wx.setNavigationBarTitle({
        title: '修改登录密码'
      })
    }else{
      wx.setNavigationBarTitle({
        title: '修改支付密码'
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
   * 旧密码输入
   */
  oldInput(e) {
    this.setData({
      old_psw: e.detail.value
    })
  },

  /**
   * 新密码输入
   */
  newInput(e) {
    this.setData({
      new_psw: e.detail.value
    })
  },

  /**
   * 确认密码输入
   */
  confirmInput(e) {
    this.setData({
      confirm_psw: e.detail.value
    })
  },

  /**
   * 完成支付修改密码
   */
  finish() {
    if (this.data.old_psw.length < 6) {
      app.showToast('请输入旧的支付密码')
      return
    }
    if (this.data.new_psw.length < 6) {
      app.showToast('请输入新的支付密码')
      return
    }
    if (this.data.confirm_psw.length < 6) {
      app.showToast('请输入新的支付密码')
      return
    }
    if (this.data.new_psw != this.data.confirm_psw) {
      app.showToast('两次新密码输入不一致')
      return
    }
    
    http.encPost(app.globalData.update_password, {
      oldPassword: this.data.old_psw,
      payPassword: this.data.confirm_psw
    }).then(res => {
      app.showSuccessToast(res.message, () => {
        wx.navigateBack()
      })
    })
  },

  /**
   * 完成登录修改密码
   */
  d_set_psw() {
    let re = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/
    if (!re.test(this.data.old_psw)) {
      app.showToast('请输入6位-20位字母、数字旧的登录密码')
      return
    }
    if (!re.test(this.data.new_psw)) {
      app.showToast('请输入6位-20位字母、数字新的登录密码')
      return
    }
    if (!re.test(this.data.confirm_psw)) {
      app.showToast('请输入6位-20位字母、数字新的登录密码')
      return
    }
    if (this.data.new_psw != this.data.confirm_psw) {
      app.showToast('两次新密码输入不一致')
      return
    }
    http.encPost(app.globalData.d_update_password, {
      oldPassword: this.data.old_psw,
      password: this.data.confirm_psw
    }).then(res => {
      app.showSuccessToast(res.message, () => {
        wx.navigateBack()
      })
    })
  }

})