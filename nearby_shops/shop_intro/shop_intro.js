const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      store_id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getData()
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
   * 获取数据
   */
  getData() {
    http.post(app.globalData.store_info, {
      store_id: this.data.store_id
    }).then(res => {
      this.setData({
        info: res.result
      })
    })
  },

  /**
   * 店铺地址
   */
  onAddress() {
    wx.openLocation({
      latitude: parseFloat(this.data.info.lat),
      longitude: parseFloat(this.data.info.lng),
      scale: 18,
      name: this.data.info.store_name,
      address: this.data.info.address,
      fail(e) {}
    })
  },

  /**
   * 服务电话
   */
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.info.phone,
    })
  },
  /**
   * 店铺二维码
   */
  code() {
    this.selectComponent("#shop_code").show()
  },
  /**
   * 证照信息
   */
  goCredential(e) {
    let data = {}
    data.licence_file = e.currentTarget.dataset.data.licence_file
    data.business_file = e.currentTarget.dataset.data.business_file
    wx.navigateTo({
      url: '/nearby_shops/shop_credential/shop_credential?data=' + JSON.stringify(data),
    })
  },
  /**
   * 客服
   */
  service() {
    let service_info = {
      store_title: this.data.info.describe,
      TARGET_ID: this.data.store_id,
      DIVERSION_ID: '1003'
    }
    wx.navigateTo({
      url: '/my/service/service?service_info=' + JSON.stringify(service_info),
    })
  }
})