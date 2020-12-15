// my/add_bank/add_bank.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankName: '',
    bankUserName: '',
    bankNumber: '',
    isSubmit: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 开户银行
   */
  bankName(e) {
    let val = e.detail.value
    this.setData({
      bankName: val
    })
  },
  /**
   * 持卡人姓名
   */
  bankUserName(e) {
    let val = e.detail.value
    this.setData({
      bankUserName: val
    })
  },
  /**
   * 银行卡号
   */
  bankNumber(e) {
    let val = e.detail.value
    this.setData({
      bankNumber: val
    })
  },
  /**
   * 提交
   */
  submit() {
    if (this.data.bankName == '') {
      app.showToast('请输入开户银行', () => {})
      return
    }
    if (this.data.bankUserName == '') {
      app.showToast('请输入持卡人姓名', () => {})
      return
    }
    if (this.data.bankNumber == '') {
      app.showToast('请输入银行卡号', () => {})
      return
    }
    if (!this.data.isSubmit) {
      return
    }
    this.setData({
      isSubmit: false
    })
    setTimeout(() => {
      this.setData({
        isSubmit: true
      })
    }, 5000)
    http.post(app.globalData.card_create, {
      cardBankName: this.data.bankName,
      cardBankOwner: this.data.bankUserName,
      cardNumber: this.data.bankNumber
    }).then(res => {
      app.showSuccessToast('提交成功', () => {
        wx.navigateBack({})
      })
    }).catch(() => {
      this.setData({
        isSubmit: true
      })
    })
  }
})