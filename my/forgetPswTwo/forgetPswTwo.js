const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    phone: '',
    encryptPhone: '',
    time: 60,
    content: '点击获取',
    countDown: '',
    //是否下一步
    able: false,
    //验证码
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      phone: options.phone
    })
    let array = options.phone.split('')
    for (let i = 3; i < 7; i++) {
      array[i] = '*';
    }
    this.setData({
      type: options.type != undefined ? options.type : '',
      encryptPhone: array.join('')
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
  onReady() {
    http.encPost(app.globalData.messageSend, {
      type: '2',
      phone: this.data.phone
    }).then(res => {
      this.countDown()
      this.data.countDown = setInterval(() => {
        this.countDown()
      }, 1000)
    })
    // this.countDown()
    // this.data.countDown = setInterval(() => {
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
    clearInterval(this.data.countDown)
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
      clearInterval(this.data.countDown)
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
      http.encPost(app.globalData.messageSend, {
        type: '2',
        phone: this.data.phone
      }).then(res => {
        this.countDown()
        this.data.countDown = setInterval(() => {
          this.countDown()
        }, 1000)
      })
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
      http.encPost(app.globalData.checkCode, {
        type: 2,
        phone: this.data.phone,
        code: this.data.code
      }).then(res => {
        wx.redirectTo({
          url: '../forgetPswThree/forgetPswThree?phone=' + this.data.phone + '&type=' + this.data.type,
        })
      })
    }
  }
})