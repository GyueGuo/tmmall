// pages/self_delivery /self_delivery .js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_view: ['全部', '待付款', '待自提', '待评价'],
    current_tab: 0,
    list: [{
      status: 1
    }, {
      status: 2
    }, {
      status: 3
    }, {
      status: 4
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 选择选项卡
   */
  onTab(e) {
    this.setData({
      current_tab: e.currentTarget.dataset.index
    })
  },

  /**
   * 页面滑动 返回顶部是否显示
   */
  scroll(e) {
    if (e.detail.scrollTop > 100) {
      this.riseAnimation()
    } else {
      this.declineAnimation()
    }
  },

  /**
   * 返回顶部上升动画
   */
  riseAnimation() {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    animation.translateY(-90).step()
    this.setData({
      animation_top: animation.export()
    })
  },

  /**
   * 返回顶部下降动画
   */
  declineAnimation() {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    animation.translateY(90).step()
    this.setData({
      animation_top: animation.export()
    })
  },

  /**
   * 返回顶部
   */
  onBackTop() {
    this.setData({
      scroll_top: 0
    })
  },

  /**
   * 售后订单
   */
  onSaleAfter() {
    wx.navigateTo({
      url: '../after_sale/after_sale',
    })
  },

  /**
   * 订单详情
   */
  onOrderDetail() {
    wx.navigateTo({
      url: '../order_detail/order_detail',
    })
  },

  /**
  * 搜索订单
  */
  onSearch() {
    wx.navigateTo({
      url: '../search_order/search_order',
    })
  }
})