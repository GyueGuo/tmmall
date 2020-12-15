// pages/forget_psw_two/forget_psw_two.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    phone: '',
    encrypt_phone: '',
    time: 60,
    content: '点击获取',
    count_down: '',
    //是否下一步
    able: false,
    //验证码
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      phone: options.phone
    })
    let array = options.phone.split('')
    for (let i = 3; i < 7; i++) {
      array[i] = '*';
    }
    this.setData({
      type: options.type != undefined ? options.type : '',
      encrypt_phone: array.join('')
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
    http.encPost(app.globalData.message_send, {
      type: '2',
      phone: this.data.phone
    }).then(res => {
      this.countDown()
      this.data.count_down = setInterval(() => {
        this.countDown()
      }, 1000)
    })
    // this.countDown()
    // this.data.count_down = setInterval(() => {
    //   this.countDown()
    // }, 1000)
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
    clearInterval(this.data.count_down)
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
   * 倒计时
   */
  countDown() {
    if (this.data.time == 0) {
      this.setData({
        content: '点击获取',
        time: 60
      })
      clearInterval(this.data.count_down)
    } else {
      this.setData({
        content: this.data.time + 's后重新获取'
      })
      this.data.time--
    }
  },

  /**
   * 获取验证码
   */
  getCode() {
    if (this.data.content == '点击获取') {
      http.encPost(app.globalData.message_send, {
        type: '2',
        phone: this.data.phone
      }).then(res => {
        this.countDown()
        this.data.count_down = setInterval(() => {
          this.countDown()
        }, 1000)
      })
      // this.countDown()
      // this.data.count_down = setInterval(() => {
      //   this.countDown()
      // }, 1000)
    }
  },

  /**
   * 验证码输入
   */
  codeInput(e) {
    this.setData({
      code: e.detail.value
    })
    if (e.detail.value.length == 6) {
      this.setData({
        able: true
      })
    }
  },

  /**
   * 下一步
   */
  onNext(e) {
    if (this.data.able) {
      http.encPost(app.globalData.check_code, {
        type: 2,
        phone: this.data.phone,
        code: this.data.code
      }).then(res => {
        wx.redirectTo({
          url: '../forget_psw_three/forget_psw_three?phone=' + this.data.phone + '&type=' + this.data.type,
        })
      })
    }
  }
})