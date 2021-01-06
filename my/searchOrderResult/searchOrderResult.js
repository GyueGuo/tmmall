const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    keyword: '',
    distributionType: '',
    page: 1,
    total: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      keyword: options.keyword,
      configSwitch: app.globalData.configSwitch,
      distributionType: options.distributionType
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //取消订单
    event.on('closeSearchOrder', this, () => {
      this.data.list[this.data.index].status = -1
      this.setData({
        list: this.data.list
      })
    })
    //支付
    event.on('paySearchOrder', this, () => {
      this.data.list[this.data.index].status = 1
      this.setData({
        list: this.data.list
      })
    })
    //确认收货
    event.on('confirmSearchReceipt', this, () => {
      this.data.list[this.data.index].status = 3
      this.setData({
        list: this.data.list
      })
    })
    //删除订单
    event.on('deleteSearchOrder', this, () => {
      this.data.list.splice(this.data.index, 1)
      this.setData({
        list: this.data.list
      })
    })
    this.getOrderList()
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
    event.remove('closeSearchOrder', this)
    event.remove('paySearchOrder', this)
    event.remove('confirmSearchReceipt', this)
    event.remove('deleteSearchOrder', this)
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
    this.data.page = 1
    this.getOrderList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.total > this.data.list.length) {
      this.data.page++;
      this.getOrderList()
    }
  },

  /**
   * 订单详情
   */
  onOrderDetail(e) {
    this.data.index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 线下详情
   */
  onDetail(e) {
    wx.navigateTo({
      url: '/my/offlineDetail/offlineDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 获取数据
   */
  getOrderList() {
    http.postList(app.globalData.orderList, {
      distributionType: this.data.distributionType,
      keyword: this.data.keyword,
      status: '',
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          total: res.result.total,
          list: res.result.data
        })
      } else {
        this.setData({
          total: res.result.total,
          list: [...this.data.list, ...res.result.data]
        })
      }
    })
  },

  /**
   * 物流详情
   */
  onLogistics(e) {
    let item = e.currentTarget.dataset.item
    //如果是同城
    if (item.distributionType == 1) {
      wx.navigateTo({
        url: '/my/takeOut/takeOut?orderAttachId=' + item.orderAttachId,
      })
      return
    }
    let info = {
      expressNumber: item.expressNumber,
      expressValue: item.expressValue,
      orderAttachId: item.orderAttachId,
      type: 'order'
    }
    wx.navigateTo({
      url: '../logisticsDetail/logisticsDetail?info=' + JSON.stringify(info),
    })
  },

  /**
   * 取消订单
   */
  cancelOrder(e) {
    let index = e.currentTarget.dataset.index
    http.post(app.globalData.cancelOrder, {
      orderAttachId: e.currentTarget.dataset.id
    }).then((res) => {
      app.showSuccessToast('取消成功')
      this.data.list[index].status = -1
      this.setData({
        list: this.data.list
      })
    })
  },

  /**
   * 删除订单
   */
  deleteOrder(e) {
    let index = e.currentTarget.dataset.index
    http.post(app.globalData.deleteOrder, {
      orderAttachId: e.currentTarget.dataset.id
    }).then(res => {
      app.showSuccessToast('删除成功')
      this.data.list.splice(index, 1)
      this.setData({
        list: this.data.list
      })
    })
  },


  /**
   * 付款
   */
  payOrder(e) {
    this.data.index = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/cashierDesk/cashierDesk?totalPrice=' + item.subtotalPrice + '&orderNumber=' + item.orderAttachNumber + '&orderId=',
    })
  },

  /**
   * 确认收货
   */
  confirmReceipt(e) {
    let index = e.currentTarget.dataset.index
    http.post(app.globalData.confirmCollect, {
      orderAttachId: e.currentTarget.dataset.id
    }).then(res => {
      app.showSuccessToast('收货成功')
      this.data.list[index].status = 3
      this.setData({
        list: this.data.list
      })
    })
  },

  /**
   * 评价
   */
  onComment(e) {
    let item = e.currentTarget.dataset.item
    for (let i = 0, len = item.orderGoodsList.length; i < len; i++) {
      item.orderGoodsList[i].file = encodeURIComponent(item.orderGoodsList[i].file)
    }
    wx.navigateTo({
      url: '/pages/comment/comment?info=' + JSON.stringify(item.orderGoodsList),
    })
  }
})