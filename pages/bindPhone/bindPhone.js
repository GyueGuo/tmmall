const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //发送验证码文字
    codeIntro: '获取验证码',
    //倒计时
    countdown: 60,
    //定时器
    timer: {},
    //手机号
    phone: '',
    //验证码
    code: '',
    //密码
    password: '',
    isSubmit: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch
    })
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

  setTime() {
    if (this.data.countdown == 0) {
      this.data.codeIntro = "获取验证码";
      this.data.countdown = 60;
      this.setData({
        codeIntro: this.data.codeIntro
      })
      clearInterval(this.data.timer)
      return
    } else {
      this.data.codeIntro = "重新发送(" + this.data.countdown + ")";
      this.data.countdown--;
    }
    this.setData({
      codeIntro: this.data.codeIntro
    })
  },

  /**
   * 获取验证码
   */
  getCode() {
    if (this.data.codeIntro != "获取验证码") {
      return
    }
    if (!app.isPoneAvailable(this.data.phone)) {
      app.showToast('请输入正确手机号码')
      return
    }
    http.encPost(app.globalData.messageSend, {
      phone: this.data.phone,
      wechatOpenId: app.globalData.unionId,
      qqOpenId: '',
      type: 10
    }).then(res => {
      console.log(res)
      this.setTime()
      this.data.timer = setInterval(() => {
        this.setTime()
      }, 1000)
    })

  },

  /**
   * 手机号输入
   */
  phoneInput(e) {
    this.data.phone = e.detail.value
  },

  /**
   * 验证码输入
   */
  codeInput(e) {
    this.data.code = e.detail.value
  },

  /**
   * 密码输入
   */
  pswInput(e) {
    this.setData({
      password: e.detail.value.replace(/[\u4E00-\u9FA5]/g, '').replace(/ /g, '')
    })
  },

  /**
   * 关联
   */
  submit() {
    if (this.data.isSubmit == false) {
      return
    }
    this.setData({
      isSubmit: false
    })
    if (!app.isPoneAvailable(this.data.phone)) {
      app.showToast('请输入正确手机号码')
      this.setData({
        isSubmit: true
      })
      return
    }

    if (this.data.password < 6) {
      app.showToast('密码至少6位')
      return
    }

    http.post(app.globalData.bindPhone, {
      phone: this.data.phone,
      password: this.data.password,
      code: this.data.code,
      unionId: app.globalData.unionId
    }).then(res => {
      app.showSuccessToast(res.message, () => {
        wx.setStorageSync('memberId', res.memberId)
        app.globalData.memberId = res.memberId
        wx.setStorageSync('phone', this.data.phone)
        app.globalData.phone = this.data.phone

        let page = getCurrentPages()
        let route = page[page.length - 2].route //上一页地址
        switch (route) {
          case 'nearbyShops/goodDetail/goodDetail': //是否是商品详情
            page[page.length - 2].getData()
            break;
          case 'my/integralGoodDetail/integralGoodDetail':
            page[page.length - 2].getData()
            break;
        }
        wx.navigateBack()
        wx.nextTick(() => {
          event.emit('refreshCart')
          event.emit('refreshHome')
        })

      })
    }).catch(res => {
      this.setData({
        isSubmit: true
      })
    })
  },

  onWeb() {
    wx.navigateTo({
      url: '/my/webView/webView?id=17',
    })
  }
})