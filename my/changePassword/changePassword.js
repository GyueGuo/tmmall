const http = require('../../utils/http.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    oldPsw: '',
    newPsw: '',
    confirmPsw: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: options.type != undefined ? options.type : '',
      diyColor: app.globalData.diyColor
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
      oldPsw: e.detail.value
    })
  },

  /**
   * 新密码输入
   */
  newInput(e) {
    this.setData({
      newPsw: e.detail.value
    })
  },

  /**
   * 确认密码输入
   */
  confirmInput(e) {
    this.setData({
      confirmPsw: e.detail.value
    })
  },

  /**
   * 完成支付修改密码
   */
  finish() {
    if (this.data.oldPsw.length < 6) {
      app.showToast('请输入旧的支付密码')
      return
    }
    if (this.data.newPsw.length < 6) {
      app.showToast('请输入新的支付密码')
      return
    }
    if (this.data.confirmPsw.length < 6) {
      app.showToast('请输入新的支付密码')
      return
    }
    if (this.data.newPsw != this.data.confirmPsw) {
      app.showToast('两次新密码输入不一致')
      return
    }
    
    http.encPost(app.globalData.updatePassword, {
      oldPassword: this.data.oldPsw,
      payPassword: this.data.confirmPsw
    }).then(res => {
      app.showSuccessToast(res.message, () => {
        wx.navigateBack()
      })
    })
  },

  /**
   * 完成登录修改密码
   */
  dSetPsw() {
    let re = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/
    if (!re.test(this.data.oldPsw)) {
      app.showToast('请输入6位-20位字母、数字旧的登录密码')
      return
    }
    if (!re.test(this.data.newPsw)) {
      app.showToast('请输入6位-20位字母、数字新的登录密码')
      return
    }
    if (!re.test(this.data.confirmPsw)) {
      app.showToast('请输入6位-20位字母、数字新的登录密码')
      return
    }
    if (this.data.newPsw != this.data.confirmPsw) {
      app.showToast('两次新密码输入不一致')
      return
    }
    http.encPost(app.globalData.dUpdatePassword, {
      oldPassword: this.data.oldPsw,
      password: this.data.confirmPsw
    }).then(res => {
      app.showSuccessToast(res.message, () => {
        wx.navigateBack()
      })
    })
  }

})