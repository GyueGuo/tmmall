// my/my_prize/my_prize.js
const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_tab: 0,
    page: 1,
    list: [],
    total: '',
    nav: ['全部', '待收货', '已获得'],
    order_id: '',
    modal_confirm: [{
      title: '提示',
      content: '确认已收到货?',
      tip: '',
      callback: 'confirm_take'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color
    })
    event.on('changeAddress', this, res => {
      this.setData({
        member_address_id: res.address.member_address_id,
      })
      http.post(app.globalData.set_addres, {
        activity_order_id: this.data.order_id,
        member_address_id: res.member_address_id
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
    switch (this.data.current_tab) {
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
    http.post(app.globalData.lottery_activity_list, {
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
  nav_tab(e) {
    this.setData({
      current_tab: e.currentTarget.dataset.tab,
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
  confirm_take(e) {
    let id = e.detail.id,
      index = e.detail.index
    http.post(app.globalData.confirm_take, {
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
      express_value: e.currentTarget.dataset.item.express_value,
      express_number: e.currentTarget.dataset.item.express_number,
      order_attach_id: e.currentTarget.dataset.item.order_id,
      type: 'draw'
    }
    wx.navigateTo({
      url: '/my/logistics_detail/logistics_detail?info=' + JSON.stringify(info),
    })
  },
  /**
   * 选择地址
   */
  address(e) {
    this.setData({
      order_id: e.currentTarget.dataset.item.order_id
    })
    wx.navigateTo({
      url: '/my/address/address?choose=true&oType=3',
    })
  },
  onOrder(e){
    console.log(e)
    return
    wx.navigateTo({
      url: `/my/games_order/games_order?id=${e.currentTarget.dataset.item.order_id}&index=${e.currentTarget.dataset.index}`,
    })
  },
  changeAddress(res) {
    this.setData({
      member_address_id: res.member_address_id,
    })
    http.post(app.globalData.set_addres, {
      activity_order_id: this.data.order_id,
      member_address_id: res.member_address_id
    }).then(res => {
      this.getData()
    })
  }
})