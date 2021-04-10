const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
const wxbarcode = require('../../utils/codeUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderAttachId: '',
    info: {},
    countDown: {},
    modalConfirm: [{
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
  onLoad: function (options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch,
      orderAttachId: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    event.on('refreshOrderDetail', this, () => {
      this.getDetail()
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDetail()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.countDown)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    event.remove('refreshOrderDetail', this)
    clearInterval(this.data.countDown)
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
   * 获取订单详情
   */
  getDetail() {
    http.post(app.globalData.orderDetails, {
      orderAttachId: this.data.orderAttachId
    }).then(res => {
      // 计算总价
      res.result['total'] = (parseFloat(res.result.orderGoodsDetails[0].originalPrice) * parseFloat(res.result.orderGoodsDetails[0].quantity)).toFixed(2)
      this.setData({
        info: res.result,
        discounts: (parseFloat(res.result.subtotalCouponPrice) + parseFloat(res.result.totalPacketPrice)).toFixed(2)
      })
      if (res.result.distributionType == 2) {
        wxbarcode.barcode('barcode', res.result.takeCode, 500, 136);
        wxbarcode.qrcode('qrcode', res.result.takeCode, 286, 286);
      }
      clearInterval(this.data.countDown)
      // 倒计时
      if (res.result.status == 0) {
        this.countDown()
        this.data.countDown = setInterval(() => {
          this.countDown()
        }, 1000)
      }
    })
  },

  /**
   * 倒计时
   */
  countDown() {
    let second = this.data.info.remainingTime
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
      this.data.info.remainingTime--;
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
      phoneNumber: this.data.info.storeList.phone,
    })
  },
  /**
   * 拨打平台电话
   */
  callPtPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.configSwitch.appInfo.contact,
    })
  },

  goShop() {
    wx.navigateTo({
      url: '/nearbyShops/shopDetail/shopDetail?storeId=' + this.data.info.storeId,
    })
  },

  /**
   * 物流信息
   */
  onLogistics() {
    //如果是同城 达达
    if (this.data.info.distributionType == 1 && this.data.info.dada == 1) {
      wx.navigateTo({
        url: `/my/takeOut/takeOut?orderAttachId=${this.data.orderAttachId}`,
      })
      return
    } else {
      //快递
      let info = {
        expressNumber: this.data.info.expressNumber,
        expressValue: this.data.info.expressValue,
        orderAttachId: this.data.orderAttachId,
        type: 'order'
      }
      wx.navigateTo({
        url: `/my/logisticsDetail/logisticsDetail?info=${JSON.stringify(info)}`,
      })
    }
  },

  /**
   * 同城自主配送电话
   */
  onCourierPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.info.distributionTel,
    })
  },

  /**
   * 提货凭证
   */
  onSelfDelivery() {
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
      url: `/pages/returnDetail/returnDetail?id=${e.currentTarget.dataset.id}&status=${this.data.info.status}`,
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
      distributionType: this.data.info.distributionType, //配送方式 1同城速递 2预约自提 3快递邮寄
      status: this.data.info.status // 订单状态 0待付款 1待配送 2配送中 3已完成 4已关闭 5退款中
    }
    wx.navigateTo({
      url: `/my/serviceType/serviceType?dataInfo=${JSON.stringify(obj)}`,
    })
  },

  /**
   * 填写退货物流
   */
  fillLogistics(e) {
    let item = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/fillLogistics/fillLogistics?id=${item}`,
    })
  },

  /**
   * 取消订单
   */
  cancelOrder(e) {
    http.post(app.globalData.cancelOrder, {
      orderAttachId: this.data.orderAttachId
    }).then((res) => {
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
    if (this.data.info.hasRefund == 1) {
      // app.showModal('', '删除订单会取消您的退款申请,确定继续吗?', () => {
      this.showModal(e)
      this.confirmDelete()
      // })
    } else {
      this.confirmDelete()
    }

  },

  confirmDelete() {
    http.post(app.globalData.deleteOrder, {
      orderAttachId: this.data.orderAttachId
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
    for (let i = 0, len = this.data.info.orderGoodsDetails.length; i < len; i++) {
      this.data.info.orderGoodsDetails[i].file = encodeURIComponent(this.data.info.orderGoodsDetails[i].file)
      if (this.data.info.orderGoodsDetails[i].status != 4.2 && this.data.info.orderGoodsDetails[i].status != 4.3) {
        list.push(this.data.info.orderGoodsDetails[i])
      }
    }
    wx.navigateTo({
      url: `/pages/comment/comment?info=${JSON.stringify(list)}`,
    })
  },

  /**
   * 立即支付
   */
  payOrder() {
    let orderInfo = {
      totalPrice: this.data.info.subtotalPrice,
      orderNumber: '',
      orderType: this.data.info.orderType,
      orderAttachNumber: this.data.info.orderAttachNumber,
      orderAttachId: this.data.info.orderAttachId,
      type: 1
    }
    wx.navigateTo({
      url: `/pages/cashierDesk/cashierDesk?orderInfo=${JSON.stringify(orderInfo)}`,
    })
  },

  /**
   * 确认收货
   */
  confirmOrder() {
    if (this.data.info.hasRefund == 1) {
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
    http.post(app.globalData.confirmCollect, {
      orderAttachId: this.data.orderAttachId,
      orderStatus: 3,
    }).then(res => {
      app.showSuccessToast('收货成功', () => {
        this.getDetail()
        event.emit('confirmReceipt')
        event.emit('confirmSearchReceipt')
      })
    })
  },

  /**
   * 拼团详情
   */
  onCollageDetail() {
    wx.navigateTo({
      url: `/pages/collageDetail/collageDetail?id=${this.data.info.groupActivityAttachId}`,
    })
  },

  /**
   * 砍价详情
   */
  onBargainDetail() {
    wx.navigateTo({
      url: `/pages/bargain/bargain?id=${this.data.info.cutActivityId}`
    })
  },

  /**
   * 复制
   */
  copyOrderNumber() {
    wx.setClipboardData({
      data: this.data.info.orderAttachNumber,
    })
  },

  onGood(e) {
    wx.navigateTo({
      url: `/nearbyShops/goodDetail/goodDetail?goodsId=${e.currentTarget.dataset.id}`
    })
  },
  /**
   * 客服
   */
  service() {
    let serviceInfo = {
      storeTitle: this.data.info.storeList.storeName,
      TARGETID: this.data.info.storeId,
      DIVERSIONID: '1004'
    }
    wx.navigateTo({
      url: `/my/service/service?serviceInfo=${JSON.stringify(serviceInfo)}`,
    })
  },
  /**
   * 申请重开发票
   */
  invoiceAnew(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/nearbyShops/invoiceDetail/invoiceDetail?orderAttachId=${item.orderAttachId}&status=${item.status}`
    })
  },
  /**
   * 申请发票
   */
  invoiceApply(e) {
    let orderAttachId = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/nearbyShops/invoiceInfo/invoiceInfo?orderAttachId=${orderAttachId}&storeId=${this.data.info.storeId}`
    })
  },

  showModal(e) {
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
      latitude: parseFloat(this.data.info.takeLat),
      longitude: parseFloat(this.data.info.takeLng),
      scale: 18,
      name: this.data.info.storeList.storeName,
      address: this.data.info.takeProvince + this.data.info.takeCity + this.data.info.takeArea + this.data.info.takeStreet + this.data.info.takeAddress,
    })
  },
})