const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    province: {},
    city: {},
    area: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let obj = {}
    // if (options.data){
    //   obj.province = JSON.parse(options.data).province
    //   obj.city = JSON.parse(options.data).city
    //   obj.area = JSON.parse(options.data).area
    // }
    if (options.popupIdx){
      this.setData({
        popupIdx: options.popupIdx
      })
    }
    obj.diyColor = app.globalData.diyColor
    this.setData(obj)
    this.getProvince()
    // if (options.data){
    //   this.getCity()
    //   this.getArea()
    // }
    
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
   * 获取省级数据
   */
  getProvince() {
    http.post(app.globalData.address_linkage, {
      parentId: 0
    }).then(res => {
      this.setData({
        province_list: res.result
      })
    })
  },

  /**
   * 选择省份
   */
  onProvince(e) {
    let item = e.currentTarget.dataset.item
    this.setData({
      province: item,
      city: {},
      area: {},
      area_list: []
    })
    this.getCity()
  },

  /**
   * 获取市
   */
  getCity() {
    http.post(app.globalData.address_linkage, {
      parentId: this.data.province.area_id
    }).then(res => {
      this.setData({
        city_list: res.result,
      })
    })
  },

  /**
   * 选择市
   */
  onCity(e) {
    let item = e.currentTarget.dataset.item
    this.setData({
      city: item,
      area: {}
    })
    this.getArea()
  },

  /**
   * 获取地区
   */
  getArea() {
    http.post(app.globalData.address_linkage, {
      parentId: this.data.city.area_id
    }).then(res => {
      this.setData({
        area_list: res.result,
      })
    })
  },

  /**
   * 选择地区
   */
  onArea(e) {
    let item = e.currentTarget.dataset.item
    this.setData({
      area: item,
    })
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      province: this.data.province,
      city: this.data.city,
      area: this.data.area
    })
    wx.navigateBack()
    prevPage.createWhether(this.data.popupIdx)
  }
})