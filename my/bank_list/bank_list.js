// my/bank_list/bank_list.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    total: 0,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.select) {
      this.setData({
        select: 1
      })
    }
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
    this.geData()
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
    if (this.data.list.length < this.data.total) {
      this.data.page++;
      this.getData()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 获取数据
   */
  geData() {
    http.post(app.globalData.card_index, {
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          list: res.result.data,
          total: res.result.total
        })
      } else {
        this.setData({
          list: [...this.data.list, ...res.result.data]
        })
      }
      if (this.data.list.length == 0 && this.data.select == 1) {
        let pages = getCurrentPages()
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
          card_details: null,
        })
      }
    })
  },
  /**
   * 跳页添加银行卡
   */
  addCard() {
    wx.navigateTo({
      url: '/my/add_bank/add_bank',
    })
  },
  /**
   * 选择银行卡
   */
  select(e) {
    if (this.data.select == 1) {
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        card_details: e.currentTarget.dataset.item,
      })
      wx.navigateBack({})
    } else {
      wx.navigateTo({
        url: `/my/bank_details/bank_details?card_id=${e.currentTarget.dataset.item.card_id}`,
      })
    }
  }
})