const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选项卡
    tabList: [{
      storeClassifyId: 0,
      title: '精选'
    }],
    currentTab: 0,
    page: 1,
    list: [],
    total: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getClassify()
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
   * 获取一级列表
   */
  getClassify() {
    http.post(app.globalData.platformClassify).then(res => {
      this.setData({
        classify: [...this.data.tabList, ...res.result]
      })
      this.getShopList()
    })
  },

  /**
   * 点击分类
   */
  onClassify(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.id,
      page: 1
    })
    this.getShopList()
  },



  /**
   * 分类更多
   */
  onMore() {
    this.setData({
      moreBoard: true
    })
  },

  /**
   *  关闭更多
   */
  closeBoard() {
    this.setData({
      moreBoard: false
    })
  },

  /**
   * 点击更多选项
   */
  onTabMoreItem(e) {
    this.closeBoard()
    this.setData({
      srollId: 'a-' + e.currentTarget.dataset.index,
      currentTab: e.currentTarget.dataset.id
    })
    this.getShopList()
  },

  /**
   * 获取列表
   */
  getShopList() {
    http.post(app.globalData.storeGoodList, {
      category: this.data.currentTab,
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
    })
  },

  /**
   * 加载更多
   */
  loadmore() {
    if (this.data.total > this.data.list.length) {
      this.data.page++;
      this.getShopList()
    }
  },

  onShop(e) {
    wx.navigateTo({
      url: '/nearbyShops/shopDetail/shopDetail?storeId=' + e.currentTarget.dataset.id,
    })
  },

  onGood(e) {
    wx.navigateTo({
      url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + e.currentTarget.dataset.id,
    })
  }
})