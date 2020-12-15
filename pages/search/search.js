const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选项卡 1商品 2店铺
    current_tab: 1,
    //搜索关键字
    search_key: '',
    //历史搜索
    history_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      current_tab: options.type,
      diy_color: app.globalData.diy_color,
      configSwitch: app.globalData.configSwitch
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let obj = {}
    if (this.data.current_tab == 1) {
      obj.history_list = wx.getStorageSync('goods_history').length == 0 ? [] : wx.getStorageSync('goods_history')
    } else if (this.data.current_tab == 2) {
      obj.history_list = wx.getStorageSync('shops_history').length == 0 ? [] : wx.getStorageSync('shops_history')
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
    http.post(app.globalData.hot_search).then(res => {
      this.setData({
        hot_search: res.result
      })
    })
  },

  /**
   * 选择商品
   */
  onGood() {
    this.setData({
      current_tab: 1
    })
  },

  /**
   * 选择店铺
   */
  onShop() {
    this.setData({
      current_tab: 2
    })
  },

  /**
   * 搜索输入
   */
  searchInput(e) {
    this.setData({
      search_key: e.detail.value.replace(/[ ]/g, "")
    })
  },

  /**
   * 清空输入框
   */
  onClearKey() {
    this.setData({
      search_key: ''
    })
  },

  /**
   * 历史搜索
   */
  setHistroy() {
    let history_list = this.data.history_list.filter(val => {
      return val != this.data.search_key
    })
    this.setData({
      history_list: history_list
    })
    if (this.data.history_list.length > 9) {
      this.data.history_list.splice(this.data.history_list.length - 1, 1)
      this.data.history_list.unshift(this.data.search_key)
    } else {
      this.data.history_list.unshift(this.data.search_key)
    }

    if (this.data.current_tab == 1) {
      wx.setStorageSync('goods_history', this.data.history_list)
    } else if (this.data.current_tab == 2) {
      wx.setStorageSync('shops_history', this.data.history_list)
    }

    this.setData({
      history_list: this.data.history_list
    })
  },

  /**
   * 清空历史搜索
   */
  onClearHistory() {
    if (this.data.current_tab == 1) {
      wx.removeStorageSync('shops_history')
      this.setData({
        history_list: []
      })
    } else if (this.data.current_tab == 2) {
      wx.removeStorageSync('goods_history')
      this.setData({
        history_list: []
      })
    }

  },

  /**
   * 搜索
   */
  onSearch(e) {
    if (e.currentTarget.dataset.item) {
      this.setData({
        search_key: e.currentTarget.dataset.item
      })
    }
    if (this.data.search_key != '') {
      this.setHistroy()
    }
    if (this.data.current_tab == 1) {
      wx.navigateTo({
        url: '../search_goods/search_goods?key=' + this.data.search_key,
      })
    } else {
      wx.navigateTo({
        url: '../search_shops/search_shops?key=' + this.data.search_key,
      })
    }
  }

})