const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeId: '',
    lat: 0,
    lng: 0,
    city: '',
    area: '',
    keyword: '',
    cityList: [{
      areaId: '',
      areaName: "全市"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      storeId: options.storeId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getLocation()
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

  searchInput(e) {
    this.data.searchKey = e.detail.value
  },

  onSearch() {
    this.getTakeList()
  },

  /**
   * 获取位置
   */
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          lat: res.latitude,
          lng: res.longitude
        })
        this.getTakeList()
      }
    })
  },

  /**
   * 门店自提列表
   */
  getTakeList() {
    http.post(app.globalData.takeList, {
      storeId: this.data.storeId,
      lat: this.data.lat,
      lng: this.data.lng,
      keyword: this.data.searchKey,
      area: this.data.area == '全市' ? '' : this.data.area
    }).then(res => {
      this.setData({
        list: res.result
      })
      if (this.data.cityList.length == 1) {
        this.getAreaList(res.province.cityId)
      }
    })
  },

  /**
   * 获取地区列表
   */
  getAreaList(id) {
    http.post(app.globalData.addressLinkage, {
      parentId: id
    }).then(res => {
      this.setData({
        cityList: [...this.data.cityList, ...res.result],
        area: '全市'
      })
    })
  },

  /**
   * 选择地区
   */
  changeArea(e) {
    this.setData({
      area: this.data.cityList[e.detail.value].areaName
    })
    this.getTakeList()
  },
  /**
   * 清空输入框
   */
  onClearKey() {
    this.setData({
      searchKey: ''
    })
  },
})