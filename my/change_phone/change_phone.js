const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: '',
    status: 0, //0手机验证 1 修改手机 2绑定手机
    content: '获取验证码',
    time: 60,
    finish: '下一步',
    count_down: '',
    phone_able: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let obj = {}
    obj.diy_color = app.globalData.diy_color
    
    if (options.status == 0) {
      //手机验证
      wx.setNavigationBarTitle({
        title: '修改手机',
      })
      obj.phone = app.globalData.phone
    } else if (options.status == 1) {
      //修改手机
      wx.setNavigationBarTitle({
        title: '修改手机',
      })
      obj.finish = '完成'
      obj.phone_able = false
    } else if (options.status == 2) {
      //绑定手机
      wx.setNavigationBarTitle({
        title: '绑定手机',
      })
      obj.finish = '完成'
      obj.phone_able = false
    }
    obj.status = options.status
    this.setData(obj)
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
   * 绑定手机号
   */
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    })

    this.canNext()
  },

  /**
   * 验证码
   */
  codeInput(e) {
    this.setData({
      code: e.detail.value
    })
    this.canNext()
  },

  /**
   * 是否可以下一步
   */
  canNext() {
    this.setData({
      able: this.data.code.length == 6 && app.isPoneAvailable(this.data.phone)
    })
  },

  /**
   * 获取验证码
   */
  getCode() {
    if (!app.isPoneAvailable(this.data.phone)) {
      app.showToast('请输入正确手机号码')
      return
    }
    if (this.data.content != '获取验证码') {
      return
    }
    let type
    switch (this.data.status) {
      case '0':
        type = 2
        break;
      case '1':
        type = 1
        break;
      case '2':
        type = 2
        break;
    }
    console.log(type)
    http.encPost(app.globalData.message_send, {
      type: type,
      phone: this.data.phone
    }).then(res => {
      this.countDown()
      this.data.count_down = setInterval(() => {
        this.countDown()
      }, 1000)
    })
  },

  /**
   * 倒计时
   */
  countDown() {
    if (this.data.time == 0) {
      this.setData({
        content: '获取验证码',
        time: 60
      })
      clearInterval(this.data.count_down)
    } else {
      this.setData({
        content: this.data.time + 's后重新发送'
      })
      this.data.time--
    }
  },

  /**
   * 下一步
   */
  onNext() {
    if (!this.data.able) {
      return
    }
    if (this.data.status == 0) {
      http.encPost(app.globalData.check_code, {
        type: this.data.status == 0 ? '2' : '1',
        phone: this.data.phone,
        code: this.data.code
      }).then(res => {
      wx.redirectTo({
        url: '/my/change_phone/change_phone?status=1',
      })
      })
    } else {
      http.post(app.globalData.update_phone, {
        phone: this.data.phone,
        code: this.data.code
      }).then(res => {
        app.showSuccessToast(res.message, () => {
          app.globalData.phone = this.data.phone
          wx.navigateBack()
        })
      })
    }
  }
})