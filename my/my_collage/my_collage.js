const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_view: ['全部', '进行中', '成功', '失败'],
    current_tab: 0,
    page: 1,
    list: [],
    total: ''
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
    this.getOrderList()
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
   * 切换选项卡
   */
  onTab(e) {
    this.setData({
      current_tab: e.currentTarget.dataset.index,
      list: [],
      page: 1
    })
    this.getOrderList()
  },

  /**
   * 获取订单列表
   */
  getOrderList() {
    http.postList(app.globalData.group_my_index, {
      status: this.data.current_tab,
      page: this.data.page
    }).then(res=> {
      if (this.data.page == 1) {
        this.setData({
          list: res.result.data,
          total: res.result.total
        })
      } else {
        this.setData({
          list: [...this.data.list,...res.result.data]
        })
      }
    })
  },

  /**
   * 加载更多
   */
  loadMore() {
    if (this.data.list.length < this.data.total) {
      this.data.page++
      this.getOrderList()
    }
  },

  
  /**
   * 订单详情
   */
  onOrderDetail(e) {
    wx.navigateTo({
      url: '../order_detail/order_detail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 拼团详情
   */
  onCollageDetail(e) {
    wx.navigateTo({
      url: '/pages/collage_detail/collage_detail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 拼团商城
   */
  onCollage() {
    wx.redirectTo({
      url: '/pages/collage_buy/collage_buy',
    })
  }
})