const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
const wxbarcode = require('../../utils/codeUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_attach_id: '',
    info: {},
    count_down: {},
    modal_confirm: [{
        title: '提示',
        content: '确认已收到货?',
        tip: '',
        callback: 'confirmOrder'
      },
      {
        title: '提示',
        content: '是否确认提货?',
        tip: '',
        callback: 'confirmOrder'
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
    this.setData({
      diy_color: app.globalData.diy_color,
      configSwitch: app.globalData.configSwitch,
      order_attach_id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    event.on('refreshOrderDetail', this, () => {
      this.getDetail()
    })
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getDetail()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(this.data.count_down)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    event.remove('refreshOrderDetail', this)
    clearInterval(this.data.count_down)
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
   * 获取订单详情
   */
  getDetail() {
    http.post(app.globalData.order_details, {
      order_attach_id: this.data.order_attach_id
    }).then(res => {
      // 计算总价
      // res.result['total'] = (parseFloat(res.result.subtotal_price) + parseFloat(res.result.subtotal_coupon_price) + parseFloat(res.result.total_packet_price) + parseFloat(res.result.total_cut_amount) - parseFloat(res.result.subtotal_freight_price)).toFixed(2)
      res.result['total'] = (parseFloat(res.result.order_goods_details[0].original_price) * parseFloat(res.result.order_goods_details[0].quantity)).toFixed(2)
      this.setData({
        info: res.result,
        discounts: (parseFloat(res.result.subtotal_coupon_price) + parseFloat(res.result.total_packet_price)).toFixed(2)
      })
      if (res.result.distribution_type == 2) {
        wxbarcode.barcode('barcode', res.result.take_code, 500, 136);
        wxbarcode.qrcode('qrcode', res.result.take_code, 286, 286);
      }
      clearInterval(this.data.count_down)
      // 倒计时
      if (res.result.status == 0) {
        this.countDown()
        this.data.count_down = setInterval(() => {
          this.countDown()
        }, 1000)
      }
    })
  },

  /**
   * 倒计时
   */
  countDown() {
    let second = this.data.info.remaining_time
    if (second < 0) {
      this.data.info.status = -1
      this.setData({
        info: this.data.info
      })
      return
    }
    if (second == 0) {
      this.getDetail()
    } else {
      // this.data.info['hour'] = Math.floor(second / 3600) < 10 ? '0' + Math.floor(second / 3600) : Math.floor(second / 3600)
      this.data.info['min'] = Math.floor(second / 60 % 60) < 10 ? '0' + Math.floor(second / 60 % 60) : Math.floor(second / 60 % 60)
      this.data.info['sec'] = Math.floor(second % 60) < 10 ? '0' + Math.floor(second % 60) : Math.floor(second % 60)
      this.data.info.remaining_time--;
      this.setData({
        'info.min': this.data.info['min'],
        'info.sec': this.data.info['sec']
      })
    }

  },

  /**
   * 拨打电话
   */
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.info.store_list.phone,
    })
  },
  /**
   * 拨打平台电话
   */
  callPtPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.configSwitch.app_info.contact,
    })
  },

  goShop() {
    wx.navigateTo({
      url: '/nearby_shops/shop_detail/shop_detail?store_id=' + this.data.info.store_id,
    })
  },

  /**
   * 物流信息
   */
  onLogistics() {
    //如果是同城 达达
    if (this.data.info.distribution_type == 1 && this.data.info.dada == 1) {
      wx.navigateTo({
        url: `/my/take_out/take_out?order_attach_id=${this.data.order_attach_id}`,
      })
      return
    } else {
      //快递
      let info = {
        express_number: this.data.info.express_number,
        express_value: this.data.info.express_value,
        order_attach_id: this.data.order_attach_id,
        type: 'order'
      }
      wx.navigateTo({
        url: `/my/logistics_detail/logistics_detail?info=${JSON.stringify(info)}`,
      })
    }
  },

  /**
   * 同城自主配送电话
   */
  onCourierPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.info.distribution_tel,
    })
  },

  /**
   * 提货凭证
   */
  onSelfDelivery() {
    // this.selectComponent("#self_voucher").show(this.data.info)
    this.setData({
      isShow: true
    })
  },

  /**
   * 关闭
   */
  closeBoard() {
    this.setData({
      isShow: false
    })
  },

  /**
   * 退款详情
   */
  refundDetail(e) {
    wx.navigateTo({
      url: `/pages/return_detail/return_detail?id=${e.currentTarget.dataset.id}&status=${this.data.info.status}`,
    })
  },

  /**
   * 退款
   */
  onRefund(e) {
    let item = e.currentTarget.dataset.item
    item['file'] = encodeURIComponent(item.file)
    let obj = {
      info: item,
      distribution_type: this.data.info.distribution_type, //配送方式 1同城速递 2预约自提 3快递邮寄
      status: this.data.info.status // 订单状态 0待付款 1待配送 2配送中 3已完成 4已关闭 5退款中
    }
    wx.navigateTo({
      url: `/my/service_type/service_type?dataInfo=${JSON.stringify(obj)}`,
    })
  },

  /**
   * 填写退货物流
   */
  fillLogistics(e) {
    let item = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/fill_logistics/fill_logistics?id=${item}`,
    })
  },

  /**
   * 取消订单
   */
  cancelOrder(e) {
    http.post(app.globalData.cancel_order, {
      orderAttachId: this.data.order_attach_id
    }).then(res => {
      app.showSuccessToast('取消成功')
      event.emit('closeOrder')
      event.emit('closeSearchOrder')
      this.getDetail()
    })
  },

  /**
   * 删除订单
   */
  deleteOrder(e) {
    console.log(e)
    // return
    if (this.data.info.has_refund == 1) {
      // app.showModal('', '删除订单会取消您的退款申请,确定继续吗?', () => {
      this.showModal(e)
      this.confirmDelete()
      // })
    } else {
      this.confirmDelete()
    }

  },

  confirmDelete() {
    http.post(app.globalData.delete_order, {
      orderAttachId: this.data.order_attach_id
    }).then(res => {
      app.showSuccessToast('删除成功', () => {
        wx.navigateBack()
      })
      event.emit('deleteOrder')
      event.emit('deleteSearchOrder')
    })
  },

  onComment() {
    let list = []
    for (let i = 0, len = this.data.info.order_goods_details.length; i < len; i++) {
      this.data.info.order_goods_details[i].file = encodeURIComponent(this.data.info.order_goods_details[i].file)
      if (this.data.info.order_goods_details[i].status != 4.2 && this.data.info.order_goods_details[i].status != 4.3) {
        list.push(this.data.info.order_goods_details[i])
      }
    }
    wx.navigateTo({
      url: `/pages/comment/comment?info=${JSON.stringify(list)}`,
    })
    // if (this.data.info.has_refund == 1) {
    //   app.showModal('', '评论会取消您的退款申请,确定继续吗?', () => {
    //     wx.navigateTo({
    //       url: `/pages/comment/comment?info=${JSON.stringify(list)}`,
    //     })
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: `/pages/comment/comment?info=${JSON.stringify(list)}`,
    //   })
    // }
  },

  /**
   * 立即支付
   */
  payOrder() {
    let order_info = {
      total_price: this.data.info.subtotal_price,
      order_number: '',
      order_type: this.data.info.order_type,
      order_attach_number: this.data.info.order_attach_number,
      order_attach_id: this.data.info.order_attach_id,
      type: 1
    }
    wx.navigateTo({
      url: `/pages/cashier_desk/cashier_desk?order_info=${JSON.stringify(order_info)}`,
    })
  },

  /**
   * 确认收货
   */
  confirmOrder() {
    if (this.data.info.has_refund == 1) {
      app.showModal('', '确认收货会取消您的退款申请,确定继续吗?', () => {
        this.confirmReceipt()
      })
    } else {
      this.confirmReceipt()
    }
  },

  /**
   * 
   */
  confirmReceipt() {
    // app.showModal('', '是否确定确认收货', () => {
    http.post(app.globalData.confirm_collect, {
      orderAttachId: this.data.order_attach_id
    }).then(res => {
      app.showSuccessToast('收货成功', () => {
        this.getDetail()
        event.emit('confirmReceipt')
        event.emit('confirmSearchReceipt')
      })
    })
    // })
  },

  /**
   * 拼团详情
   */
  onCollageDetail() {
    wx.navigateTo({
      url: `/pages/collage_detail/collage_detail?id=${this.data.info.group_activity_attach_id}`,
    })
  },

  /**
   * 砍价详情
   */
  onBargainDetail() {
    wx.navigateTo({
      url: `/pages/bargain/bargain?id=${this.data.info.cut_activity_id}`
    })
  },

  /**
   * 复制
   */
  copyOrderNumber() {
    wx.setClipboardData({
      data: this.data.info.order_attach_number,
    })
  },

  onGood(e) {
    wx.navigateTo({
      url: `/nearby_shops/good_detail/good_detail?goods_id=${e.currentTarget.dataset.id}`
    })
  },
  /**
   * 客服
   */
  service() {
    let service_info = {
      store_title: this.data.info.store_list.store_name,
      TARGET_ID: this.data.info.store_id,
      DIVERSION_ID: '1004'
    }
    wx.navigateTo({
      url: `/my/service/service?service_info=${JSON.stringify(service_info)}`,
    })
  },
  /**
   * 申请重开发票
   */
  invoice_anew(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/nearby_shops/invoice_detail/invoice_detail?order_attach_id=${item.order_attach_id}&status=${item.status}`
    })
  },
  /**
   * 申请发票
   */
  invoice_apply(e) {
    let order_attach_id = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/nearby_shops/invoice_info/invoice_info?order_attach_id=${order_attach_id}&store_id=${this.data.info.store_id}`
    })
  },

  showModal(e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      showModal: e.currentTarget.dataset.confirmtype
    })
    this.selectComponent("#modal").showModal(e.currentTarget.dataset)
  },
  /**
   * 导航
   */
  onNavigation() {
    wx.openLocation({
      latitude: parseFloat(this.data.info.take_lat),
      longitude: parseFloat(this.data.info.take_lng),
      scale: 18,
      name: this.data.info.store_list.store_name,
      address: this.data.info.take_province + this.data.info.take_city + this.data.info.take_area + this.data.info.take_street + this.data.info.take_address,
    })
  },
})