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
  handleCloseModal() {
    this.setData({
      isModalVisible: false,
    })
  }
})