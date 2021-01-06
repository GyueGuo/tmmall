const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: options.type != undefined ? options.type : '',
      diyColor: app.globalData.diyColor,
      phone: app.globalData.phone
    })
    if (this.data.type == 'login') {
      wx.setNavigationBarTitle({
        title: '忘记登录密码'
      })
    }
  },


  /**
   * 下一步
   */
  onNext() {
    wx.redirectTo({
      url: '../forgetPswTwo/forgetPswTwo?phone=' + this.data.phone + '&type=' + this.data.type,
    })
  }
})