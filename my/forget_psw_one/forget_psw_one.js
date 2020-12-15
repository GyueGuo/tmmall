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
      diy_color: app.globalData.diy_color,
      phone: app.globalData.phone
    })
    if (this.data.type == 'login') {
      wx.setNavigationBarTitle({
        title: '忘记登录密码'
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
   * 下一步
   */
  onNext() {
    // http.encPost(app.globalData.message_send, {
    //   type: 2,
    //   phone: this.data.phone
    // }).then(res => {
    //   app.showSuccessToast(res.message, ()=> {
        wx.redirectTo({
          url: '../forget_psw_two/forget_psw_two?phone=' + this.data.phone + '&type=' + this.data.type,
        })
    //   })
    // })
  }
})