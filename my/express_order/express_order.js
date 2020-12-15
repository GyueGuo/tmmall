const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //快递邮寄
    tab_view: [{
      id: '0',
      title: '全部',
      distribution_type: '0',
      status: null
    }, {
      id: '1',
      title: '待付款',
      distribution_type: '0',
      status: '0'
    }, {
      id: '2',
      title: '待收货',
      distribution_type: '1,3,4',
      status: '1,2'
    }, {
      id: '3',
      title: '待自提',
      distribution_type: '2',
      status: '2'
    }, {
      id: '4',
      title: '待评价',
      distribution_type: '0',
      status: '3'
    }],
    //选项卡当前选中
    current_status: null,
    //配送方式
    distribution_type: '0',
    page: 1,
    list: [],
    total: '',
    //当前进入详情index
    index: '',
    modal_confirm: [{
        title: '提示',
        content: '确认已收到货?',
        tip: '',
        callback: 'confirmCollect'
      },
      {
        title: '提示',
        content: '是否确认提货?',
        tip: '',
        callback: 'confirmReceipt'
      },
      {
        title: '',
        content: '删除订单会取消您的退款申请',
        tip: '确定继续吗?',
        callback: 'confirmDelete'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let obj = {
      diy_color: app.globalData.diy_color,
      configSwitch: app.globalData.configSwitch
    }
    if (options.type) {
      obj.distribution_type = JSON.parse(options.type).distribution_type
      obj.current_status = JSON.parse(options.type).status
    }
    // let title = null
    // if (options.city) { //同城速递订单
    //   title = '同城速递订单'
    //   obj.distribution_type = 1
    // } else if (options.pickup) { //门店自提订单
    //   obj.distribution_type = 2
    //   title = '门店自提订单'
    // } else { //快递邮寄订单
    //   title = '快递邮寄订单'
    // }
    wx.setNavigationBarTitle({
      title: '我的订单',
    })
    this.setData(obj)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //取消订单
    event.on('closeOrder', this, () => {
      if (this.data.current_status == null) {
        this.data.list[this.data.index].status = -1
      } else {
        this.data.list.splice(this.data.index, 1)
      }
      this.setData({
        list: this.data.list
      })
    })
    //支付
    event.on('payOrder', this, () => {
      if (this.data.current_status == null) {
        this.data.list[this.data.index].status = 1
      } else {
        this.data.list.splice(this.data.index, 1)
      }
      this.setData({
        list: this.data.list
      })
    })
    //确认收货
    event.on('confirmReceipt', this, () => {
      if (this.data.current_status == null) {
        this.data.list[this.data.index].status = 3
      } else {
        this.data.list.splice(this.data.index, 1)
      }
      this.setData({
        list: this.data.list
      })
    })
    //删除订单
    event.on('deleteOrder', this, () => {
      this.data.list.splice(this.data.index, 1)
      this.setData({
        list: this.data.list
      })
    })
    //评价成功
    event.on('evaluateOrder', this, () => {
      this.data.page = 1
      this.getOrderList()
      // that.data.list.splice(that.data.index, 1)
      // that.setData({
      //   list: that.data.list
      // })
    })

    // this.getOrderList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getOrderList()
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
    event.remove('closeOrder', this)
    event.remove('payOrder', this)
    event.remove('confirmReceipt', this)
    event.remove('deleteOrder', this)
    event.remove('evaluateOrder', this)
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
   * 选择选项卡
   */
  onTab(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
    this.setData({
      current_status: e.currentTarget.dataset.item.status,
      distribution_type: e.currentTarget.dataset.item.distribution_type,
      page: 1,
      list: []
    })
    this.getOrderList()
  },

  /**
   * 页面滑动 返回顶部是否显示
   */
  scroll(e) {
    if (e.detail.scrollTop > 100) {
      this.selectComponent("#go_top").rise()
    } else {
      this.selectComponent("#go_top").decline()
    }
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
   * 获取订单列表
   */
  getOrderList() {
    http.postList(app.globalData.order_list, {
      distributionType: this.data.distribution_type,
      status: this.data.current_status,
      keyword: '',
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
   * 加载更多
   */
  loadMore() {
    if (this.data.list.length < this.data.total) {
      this.data.page++;
      this.getOrderList()
    }
  },

  /**
   * 售后订单
   */
  onSaleAfter() {
    wx.navigateTo({
      url: '../after_sale/after_sale?distribution_type=' + this.data.distribution_type,
    })
  },

  /**
   * 店铺
   */
  onShopDetail(e) {
    wx.navigateTo({
      url: '/nearby_shops/shop_detail/shop_detail?store_id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 订单详情
   */
  onOrderDetail(e) {
    this.data.index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../order_detail/order_detail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 线下详情
   */
  onDetail(e) {
    wx.navigateTo({
      url: '/my/offline_detail/offline_detail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 搜索订单
   */
  onSearch() {
    wx.navigateTo({
      url: '../search_order/search_order?distribution_type=' + this.data.distribution_type,
    })
  },

  /**
   * 物流详情
   */
  onLogistics(e) {
    let item = e.currentTarget.dataset.item
    //如果是同城
    if (item.distribution_type == 1) {
      wx.navigateTo({
        url: '/my/take_out/take_out?order_attach_id=' + item.order_attach_id,
      })
      return
    }
    let info = {
      express_number: item.express_number,
      express_value: item.express_value,
      order_attach_id: item.order_attach_id,
      type: 'order'
    }
    wx.navigateTo({
      url: '../logistics_detail/logistics_detail?info=' + JSON.stringify(info),
    })
  },

  /**
   * 取消订单
   */
  cancelOrder(e) {
    let index = e.currentTarget.dataset.index
    http.post(app.globalData.cancel_order, {
      orderAttachId: e.currentTarget.dataset.id,
    }).then(res => {
      app.showSuccessToast('取消成功')
      if (this.data.current_status == null) {
        this.data.list[index].status = -1
      } else {
        this.data.list.splice(index, 1)
      }
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
    let id = e.currentTarget.dataset.id
    if (this.data.list[index].has_refund == 1) {
      app.showModal('', '删除订单会取消您的退款申请,确定继续吗?', () => {
        this.confirmDelete(id, index)
      })
    } else {
      this.confirmDelete(id, index)
    }
  },

  /**
   * 删除订单
   */
  confirmDelete(id, index) {
    http.post(app.globalData.delete_order, {
      orderAttachId: id
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
    let item = e.currentTarget.dataset.item
    let order_info = {
      total_price: item.subtotal_price,
      order_number: '',
      order_type: item.order_type,
      order_attach_number: item.order_attach_number,
      order_attach_id: item.order_attach_id,
      type: 2
    }
    wx.navigateTo({
      url: '/pages/cashier_desk/cashier_desk?order_info=' + JSON.stringify(order_info),
    })
    this.data.index = e.currentTarget.dataset.index
  },

  /**
   * 确提货
   */
  confirmReceipt(e) {
    console.log(e)
    let order_obj = e.detail
    let group_take = order_obj.group_take == undefined ? '' : order_obj.group_take
    if (group_take == 1) {
      app.showToast('该订单团购尚未成功,暂不能提货')
    }
    if (this.data.list[order_obj.index].order_goods_list[0].status == 2.2) {
      app.showToast('该订单团购尚未成功,暂不能提货')
      return
    }
    if (this.data.list[order_obj.index].has_refund == 1) {
      app.showModal('', '确认收货会取消您的退款申请,确定继续吗?', () => {
        this.confirmCollect(e)
      })
    } else {
      this.confirmCollect(e)
    }
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
  confirmCollect(e) {
    let order_obj = e.detail
    console.log(e.detail)
    http.post(app.globalData.confirm_collect, {
      orderAttachId: order_obj.id
    }).then(res => {
      app.showSuccessToast('收货成功')
      if (this.data.current_status == null) {
        this.data.list[order_obj.index].status = 3
      } else {
        this.data.list.splice(order_obj.index, 1)
      }
      this.setData({
        list: this.data.list
      })
    })
  },

  /**
   * 评价
   */
  onComment(e) {
    let item = e.currentTarget.dataset.item,
      list = []
    this.data.index = e.currentTarget.dataset.index
    for (var i = 0; i < item.order_goods_list.length; i++) {
      item.order_goods_list[i].file = encodeURIComponent(item.order_goods_list[i].file)
      if (item.order_goods_list[i].status != 4.2 && item.order_goods_list[i].status != 4.3) {
        list.push(item.order_goods_list[i])
      }
    }
    wx.navigateTo({
      url: '/pages/comment/comment?info=' + JSON.stringify(list),
    })
    // if (this.data.list[this.data.index].has_refund == 1) {
    //   app.showModal('', '评价会取消您的退款申请,确定继续吗?', () => {
    //     wx.navigateTo({
    //       url: '/pages/comment/comment?info=' + JSON.stringify(list),
    //     })
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '/pages/comment/comment?info=' + JSON.stringify(list),
    //   })
    // }

  },

  /**
   * 申请重开发票
   */
  invoice_anew(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/nearby_shops/invoice_detail/invoice_detail?order_attach_id=' + item.order_attach_id + '&status=' + item.status,
    })
  },
  /**
   * 申请发票
   */
  invoice_apply(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/nearby_shops/invoice_info/invoice_info?order_attach_id=' + item.order_attach_id + '&store_id=' + item.store_id,
    })
  },
})