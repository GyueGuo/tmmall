const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    info: {},
    countDown: {},
    status: null,
    modalConfirm: [{
      title: '提示',
      content: '您将撤销本次申请，如果问题未解决',
      tip: '您可以再次发起。确定继续吗？',
      callback: 'onRevocation'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch,
      id: options.id,
      status: options.status
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    event.on('refreshReturnDetail', this, res => {
      this.getData()
    })
    this.getData()
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
    event.remove('refreshReturnDetail', this)
    clearInterval(this.data.countDown)
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
   * 获取数据
   */
  getData() {
    http.post(app.globalData.refundDetails, {
      orderGoodsId: this.data.id
    }).then(res => {
      this.setData({
        info: res.result
      })
      clearInterval(this.data.countDown)
      if (res.result.remainingTime > 0) {
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
    if (second == 0) {
      this.getData()
    } else {
      this.data.info['day'] = parseInt((second) / (24 * 3600))
      this.data.info['hour'] = Math.floor((second) % (24 * 3600) / 3600) < 10 ? '0' + Math.floor((second) % (24 * 3600) / 3600 / 3600) : Math.floor((second) % (24 * 3600) / 3600)
      this.data.info['min'] = Math.floor(second / 60 % 60) < 10 ? '0' + Math.floor(second / 60 % 60) : Math.floor(second / 60 % 60)
      this.setData({
        info: this.data.info
      })
      this.data.info.remainingTime--
    }
  },

  /**
   * 撤销申请
   */
  onRevocation() {
    http.post(app.globalData.revokeApply, {
      orderGoodsId: this.data.id
    }).then(() => {
      app.showSuccessToast('撤销成功', () => {
        wx.navigateBack()
        event.emit('refreshOrderDetail')
      })
    })
  },

  /**
   * 修改申请
   * status 店铺订单状态 0待付款 1待配送 2配送中 3已完成 4已关闭 5退款中
   * state 是否收到货 1未收到货 2已收到货
   * type: 退款类型 1退款 2退货退款
   */
  changeApply() {
    let dataInfo = {}
    dataInfo.info = this.data.info
    dataInfo.status = this.data.status
    dataInfo.distributionType = this.data.info.distributionType
    //是否收到货 1未收到货 2已收到货
    dataInfo.state = 1
    //退款类型 1退款 2退货退款
    if (this.data.info.orderGoodsStatus == 5.2 || this.data.info.orderGoodsStatus == 5.3 || this.data.info.orderGoodsStatus == 5.4 || this.data.info.orderGoodsStatus == 5.6) {
      dataInfo.type = 2
    } else {
      dataInfo.type = 1
    }
    dataInfo.info.file = encodeURIComponent(dataInfo.info.file)
    wx.navigateTo({
      url: `/my/applyRefund/applyRefund?dataInfo=${JSON.stringify(dataInfo)}`
    })
    dataInfo.info.file = decodeURIComponent(dataInfo.info.file)
  },
  amend(){
    let dataInfo = {}
    dataInfo.info = this.data.info
    dataInfo.info.file = encodeURIComponent(dataInfo.info.file)
    let obj = {
      info: this.data.info,
      distributionType: this.data.info.distributionType, //配送方式 1同城速递 2预约自提 3快递邮寄
      status: this.data.status // 订单状态 0待付款 1待配送 2配送中 3已完成 4已关闭 5退款中
    }
    wx.navigateTo({
      url: `/my/serviceType/serviceType?dataInfo=${JSON.stringify(obj)}`,
    })
    dataInfo.info.file = decodeURIComponent(dataInfo.info.file)
  },

  /**
   * 填写退货物流
   */
  fillLogistics(e) {
    wx.navigateTo({
      url: '/pages/fillLogistics/fillLogistics?id=' + this.data.info.orderGoodsRefundId + '&storeId=' + this.data.info.storeId + '&distributionType=' + this.data.info.distributionType,
    })
  },

  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.info.phone,
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
  /**
   * 客服
   */
  service() {
    let serviceInfo = {
      storeTitle: encodeURIComponent(this.data.info.storeName),
      TARGETID: this.data.info.storeId,
      DIVERSIONID: '1005'
    }
    wx.navigateTo({
      url: '/my/service/service?serviceInfo=' + JSON.stringify(serviceInfo),
    })
  },
  /**
   * 平台客服
   */
  servicePt() {
    let serviceInfo = {
      TARGETID: '0',
      DIVERSIONID: '5002'
    }
    wx.navigateTo({
      url: '/my/service/service?serviceInfo=' + JSON.stringify(serviceInfo),
    })
  },
  showModal(e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      showModal: e.currentTarget.dataset.confirmtype
    })
    this.selectComponent("#modal").showModal(e.currentTarget.dataset)
  },

})