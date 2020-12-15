const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    web_content: ''
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
    http.post(app.globalData.new_gift, {}).then(res => {
      this.setData({
        list: res.result,
        web_content: res.content
      })
    })
  },

  /**
   * 一键领取
   */
  getAll() {
    if (app.login()) {
      http.post(app.globalData.get_gift, {}).then(res => {
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