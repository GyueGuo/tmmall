const app = getApp();
const http = require('../../utils/http.js');
Page({
  data: {
    isModalVisible: false,
  },
  handleExchange() {
    this.setData({
      isModalVisible: true,
    })
  },
  onLoad() {
    if (!app.globalData.memberId || !app.globalData.phone) {
      wx.redirectTo({
        url: '/pages/accredit/accredit',
      })
    }
  },
  handleCloseModal() {
    this.setData({
      isModalVisible: false,
    })
  }
})