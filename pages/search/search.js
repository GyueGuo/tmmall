const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选项卡 1商品 2店铺
    currentTab: 1,
    //搜索关键字
    searchKey: '',
    //历史搜索
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      currentTab: options.type,
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let obj = {}
    if (this.data.currentTab == 1) {
      obj.historyList = wx.getStorageSync('goodsHistory').length == 0 ? [] : wx.getStorageSync('goodsHistory')
    } else if (this.data.currentTab == 2) {
      obj.historyList = wx.getStorageSync('shopsHistory').length == 0 ? [] : wx.getStorageSync('shopsHistory')
    }
    this.setData(obj)
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
   * 热门搜索
   */
  getData() {
    http.post(app.globalData.hotSearch).then(res => {
      this.setData({
        hotSearch: res.result
      })
    })
  },

  /**
   * 选择商品
   */
  onGood() {
    this.setData({
      currentTab: 1
    })
  },

  /**
   * 选择店铺
   */
  onShop() {
    this.setData({
      currentTab: 2
    })
  },

  /**
   * 搜索输入
   */
  searchInput(e) {
    this.setData({
      searchKey: e.detail.value.replace(/[ ]/g, "")
    })
  },

  /**
   * 清空输入框
   */
  onClearKey() {
    this.setData({
      searchKey: ''
    })
  },

  /**
   * 历史搜索
   */
  setHistroy() {
    let historyList = this.data.historyList.filter(val => {
      return val != this.data.searchKey
    })
    this.setData({
      historyList: historyList
    })
    if (this.data.historyList.length > 9) {
      this.data.historyList.splice(this.data.historyList.length - 1, 1)
      this.data.historyList.unshift(this.data.searchKey)
    } else {
      this.data.historyList.unshift(this.data.searchKey)
    }

    if (this.data.currentTab == 1) {
      wx.setStorageSync('goodsHistory', this.data.historyList)
    } else if (this.data.currentTab == 2) {
      wx.setStorageSync('shopsHistory', this.data.historyList)
    }

    this.setData({
      historyList: this.data.historyList
    })
  },

  /**
   * 清空历史搜索
   */
  onClearHistory() {
    if (this.data.currentTab == 1) {
      wx.removeStorageSync('shopsHistory')
      this.setData({
        historyList: []
      })
    } else if (this.data.currentTab == 2) {
      wx.removeStorageSync('goodsHistory')
      this.setData({
        historyList: []
      })
    }

  },

  /**
   * 搜索
   */
  onSearch(e) {
    if (e.currentTarget.dataset.item) {
      this.setData({
        searchKey: e.currentTarget.dataset.item
      })
    }
    if (this.data.searchKey != '') {
      this.setHistroy()
    }
    if (this.data.currentTab == 1) {
      wx.navigateTo({
        url: '../searchGoods/searchGoods?key=' + this.data.searchKey,
      })
    } else {
      wx.navigateTo({
        url: '../searchGoods/searchGoods?key=' + this.data.searchKey,
      })
    }
  }

})