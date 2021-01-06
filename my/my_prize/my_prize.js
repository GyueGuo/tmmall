const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    page: 1,
    list: [],
    total: '',
    nav: ['全部', '待收货', '已获得'],
    orderId: '',
    modalConfirm: [{
      title: '提示',
      content: '确认已收到货?',
      tip: '',
      callback: 'confirmTake'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor
    })
    event.on('changeAddress', this, res => {
      this.setData({
        memberAddressId: res.address.memberAddressId,
      })
      http.post(app.globalData.setAddres, {
        activityOrderId: this.data.orderId,
        memberAddressId: res.memberAddressId
      }).then(res => {
        this.getData()
      })
    })
    
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
    this.getData()
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
    event.remove('changeAddress', this)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function(e) {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.total > this.data.list.length) {
      this.data.page++
        this.getData()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 获取数据
   */
  getData() {
    let tab = ''
    switch (this.data.currentTab) {
      case 0:
        tab = 'all'
        break;
      case 1:
        tab = '2'
        break;
      case 2:
        tab = '3'
        break;
    }
    http.post(app.globalData.lotteryActivityList, {
      status: tab,
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          list: res.data.data,
          total: res.data.total
        })
      } else {
        this.setData({
          list: [...this.data.list, ...res.data.data],
        })
      }
    })

  },
  /**
   * 切换导航
   */
  navTab(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.tab,
      page: 1,
      list: []
    })
    this.getData()
  },
  showModal(e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      showModal: e.currentTarget.dataset.confirmtype
    })
    this.selectComponent("#modal").showModal(e.currentTarget.dataset)
  },
  /**
   * 确认收货
   */
  confirmTake(e) {
    let id = e.detail.id,
      index = e.detail.index
    http.post(app.globalData.confirmTake, {
      orderId: id
    }).then(res => {
      this.data.list.splice(index, 1)
      this.setData({
        list: this.data.list
      })
    })
  },
  /**
   * 查看物流
   */
  logistics(e) {
    let info = {
      expressValue: e.currentTarget.dataset.item.expressValue,
      expressNumber: e.currentTarget.dataset.item.expressNumber,
      orderAttachId: e.currentTarget.dataset.item.orderId,
      type: 'draw'
    }
    wx.navigateTo({
      url: '/my/logisticsDetail/logisticsDetail?info=' + JSON.stringify(info),
    })
  },
  /**
   * 选择地址
   */
  address(e) {
    this.setData({
      orderId: e.currentTarget.dataset.item.orderId
    })
    wx.navigateTo({
      url: '/my/address/address?choose=true&oType=3',
    })
  },
  onOrder(e){
    return
    wx.navigateTo({
      url: `/my/gamesOrder/gamesOrder?id=${e.currentTarget.dataset.item.orderId}&index=${e.currentTarget.dataset.index}`,
    })
  },
  changeAddress(res) {
    this.setData({
      memberAddressId: res.memberAddressId,
    })
    http.post(app.globalData.setAddres, {
      activityOrderId: this.data.orderId,
      memberAddressId: res.memberAddressId
    }).then(res => {
      this.getData()
    })
  }
})