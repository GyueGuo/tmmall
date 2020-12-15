const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adv_info: {},
    list: [],
    total: '',
    page: 1
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
    this.getBargainList()
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
    this.setData({
      page: 1,
      list: []
    })
    this.getBargainList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.total > this.data.list.length) {
      this.data.page++;
      this.getBargainList()
    }
  },

  /**
   * 我的砍价
   */
  onMyBargain() {
    if (app.login()) {
      wx.redirectTo({
        url: '/my/my_bargain/my_bargain',
      })
    }
  },

  /**
   * 获取数据
   */
  getBargainList() {
    http.postList(app.globalData.bargain_index, {
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          list: res.result.data,
          adv_info: res.advInfo,
          total: res.result.total
        })
      } else {
        this.setData({
          list: [...this.data.list, ...res.result.data]
        })
      }
    })
  },

  onAdvInfo() {
    switch (this.data.adv_info.type) {
      case 1: // 商品
        wx.navigateTo({
          url: '/nearby_shops/good_detail/good_detail?goods_id=' + this.data.adv_info.content,
        })
        break;
      case 2: // 店铺
        wx.navigateTo({
          url: '/nearby_shops/shop_detail/shop_detail?store_id=' + this.data.adv_info.content
        })
        break;
    }
  },

  /**
   * 商品详情
   */
  onGood(e) {
    wx.navigateTo({
      url: '/nearby_shops/good_detail/good_detail?goods_id=' + e.currentTarget.dataset.id,
    })
  }
})