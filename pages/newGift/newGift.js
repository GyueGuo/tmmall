const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    webContent: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getData()
  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.newGift, {}).then(res => {
      this.setData({
        list: res.result,
        webContent: res.content
      })
    })
  },

  /**
   * 一键领取
   */
  getAll() {
    if (app.login()) {
      http.post(app.globalData.getGift, {}).then(res => {
        app.showSuccessToast('领取成功', () => {
          wx.navigateBack()
        })
      })
    }
  },

  onRule() {
    this.setData({
      show: true
    })
  },

  close() {
    this.setData({
      show: false
    })
  }
})