const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabView: ['全部', '进行中', '成功', '失败'],
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
      currentTab: e.currentTarget.dataset.index,
      list: [],
      page: 1
    })
    this.getOrderList()
  },

  /**
   * 获取订单列表
   */
  getOrderList() {
    http.postList(app.globalData.groupMyIndex, {
      status: this.data.currentTab,
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
      url: '../orderDetail/orderDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 拼团详情
   */
  onCollageDetail(e) {
    wx.navigateTo({
      url: '/pages/collageDetail/collageDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 拼团商城
   */
  onCollage() {
    wx.redirectTo({
      url: '/pages/collageBuy/collageBuy',
    })
  }
})