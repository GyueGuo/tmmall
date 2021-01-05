const wxbarcode = require('../../utils/codeUtil.js');
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前显示 1为会员卡 2为付款码
    tab: 1,
    //起始的Y坐标
    startY: '',
    //是否可见
    see: false,
    cardcode: '',
    barcode: '',
    payNumber:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let obj = {}
    if (options.tab) {
      obj.tab = options.tab
    }
    obj.configSwitch = app.globalData.configSwitch
    this.setData(obj)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getData()
    this.getCode()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.tab == 2) {
      this.getCode()
      this.data.countDown = setInterval(() => {
        this.getCode()
      }, 1000)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(this.data.countDown)
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
   * 开始滑动
   */
  touchStart(e) {
    this.data.startY = e.changedTouches[0].pageY
  },

  /**
   * 结束滑动
   */
  touchEnd(e) {
    if (this.data.startY - e.changedTouches[0].pageY > 20) {
      this.setData({
        tab: 2
      })
      this.getCode()
      this.data.countDown = setInterval(() => {
        this.getCode()
      }, 1000)
    }
    if (e.changedTouches[0].pageY - this.data.startY > 20) {
      this.setData({
        tab: 1
      })
      clearInterval(this.data.countDown)
    }
  },

  /**
   * 点击会员卡
   */
  onVipCard() {
    if (this.data.tab != 1) {
      this.setData({
        tab: 1
      })
      clearInterval(this.data.countDown)
    }
  },

  /**
   * 点击付款码
   */
  onPayCode() {
    if (this.data.tab != 2) {
      this.setData({
        tab: 2
      })
      this.getCode()
      this.data.countDown = setInterval(() => {
        this.getCode()
      }, 1000)
    }
  },

  getData() {
    http.post(app.globalData.rankCard, {}).then(res => {
      this.setData({
        info: res.result
      })
      wxbarcode.barcode('cardcode', res.result.cardNumber, 584, 126, this);
    })
  },
  getCode() {
    http.postList(app.globalData.paymentCode, {}).then(res => {
      if (this.data.payNumber ==null||this.data.payNumber != res.number) {
        this.setData({
          payNumber: res.number,
          balance: res.usableMoney
        })
        wxbarcode.barcode('barcode', res.number, 584, 126, this);
        wxbarcode.qrcode('qrcode', res.number, 330, 330, this);
      }
    })
  },

  changeSee() {
    this.setData({
      see: !this.data.see
    })
  },

  setPassword() {
    wx.navigateTo({
      url: '/my/password/password',
    })
  },
  onNumber() {
    this.setData({
      numberSee: !this.data.numberSee
    })
  }
})