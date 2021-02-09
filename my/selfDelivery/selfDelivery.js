Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabView: ['全部', '待付款', '待自提', '待评价'],
    currentTab: 0,
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
      currentTab: e.currentTarget.dataset.index
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
      animationTop: animation.export()
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
      animationTop: animation.export()
    })
  },

  /**
   * 返回顶部
   */
  onBackTop() {
    this.setData({
      scrollTop: this.data.scrollTop ? 0 : -1
    })
  },

  /**
   * 售后订单
   */
  onSaleAfter() {
    wx.navigateTo({
      url: '../afterSale/afterSale',
    })
  },

  /**
   * 订单详情
   */
  onOrderDetail() {
    wx.navigateTo({
      url: '../orderDetail/orderDetail',
    })
  },

  /**
  * 搜索订单
  */
  onSearch() {
    wx.navigateTo({
      url: '../searchOrder/searchOrder',
    })
  }
})