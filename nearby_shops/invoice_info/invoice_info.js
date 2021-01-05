const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    diyColor: app.globalData.diyColor,
    //发票类型
    invoiceCon: [{
      name: '电子普通发票',
      type: '1'
    }, {
      name: '普通发票',
      type: '2'
    }, {
      name: '增值税专用发票',
      type: '3'
    }],
    invoiceType: '1',
    //发票抬头
    riseCon: [{
      name: '个人或事业单位',
      type: '1'
    }, {
      name: '企业',
      type: '2'
    }],
    rise: '1',
    //发票内容
    detailCon: [{
      name: '商品明细',
      type: '1'
    }, {
      name: '商品类型',
      type: '2'
    }],
    detailType: '1',
    isAnew: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let data
    if (options.isAnew) {
      data = {
        orderAttachId: options.orderAttachId,
        isAnew: options.isAnew,
        storeId: options.storeId
      }
    } else {
      data = {
        orderAttachId: options.orderAttachId,
        storeId: options.storeId
      }
    }
    this.setData(data)
    this.invoiceExplainType()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getData() {
    http.post(app.globalData.invoiceExplainReopening, {
      orderAttachId: this.data.orderAttachId
    }).then(res => {
      if (res.result != null && res.result != '') {
        this.setData({
          data: res.result,
          isAmend: 1,
          invoiceType: res.result.invoiceType,
          rise: res.result.rise,
          riseName: res.result.rise == 1 ? res.result.riseName : '',
          detailType: res.result.detailType,
          personMobile: res.result.InvoiceAttach.personMobile != undefined ? res.result.InvoiceAttach.personMobile : '',
          personMail: res.result.InvoiceAttach.personMail != undefined ? res.result.InvoiceAttach.personMail : '',
          company: res.result.rise == 2 ? res.result.company : undefined,
          identification: res.result.rise == 2 ? (res.result.identification == undefined ? '' : res.result.identification) : undefined,
          invoiceAddress: res.result.rise == 2 ? (res.result.invoiceAddress == undefined ? '' : res.result.invoiceAddress) : undefined,
          invoicePhone: res.result.rise == 2 ? (res.result.invoicePhone == undefined ? '' : res.result.invoicePhone) : undefined,
          bank: res.result.rise == 2 ? (res.result.bank == undefined ? '' : res.result.bank) : undefined,
          account: res.result.rise == 2 ? (res.result.account == undefined ? '' : res.result.account) : undefined,
        })
      }
    })
  },

  /**
   * 发票可开具类型
   */
  invoiceExplainType() {
    http.post(app.globalData.invoiceExplainType, {
      storeId: this.data.storeId
    }).then(res => {
      let invoiceType = null
      for (let i = 0, len = res.result.length; i < len; i++) {
        this.data.invoiceCon[i].status = res.result[i]
        if (res.result[i] == 1 && invoiceType != 1) {
          invoiceType = i
        }
      }
      this.setData({
        invoiceCon: this.data.invoiceCon,
        invoiceType: invoiceType
      })
    })
  },

  /**
   * 选择发票类型
   */
  invoiceClick(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      invoiceType: type
    })
    if (type == 3) {
      this.setData({
        riseCon: [{
          name: '企业',
          type: '2'
        }],
        rise: '2',
      })
    } else {
      this.setData({
        riseCon: [{
          name: '个人或事业单位',
          type: '1'
        }, {
          name: '企业',
          type: '2'
        }],
      })
    }
  },
  /**
   * 选择发票抬头
   */
  riseClick(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      rise: type
    })
  },
  /**
   * 选择发票内容
   */
  detailClick(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      detailType: type
    })
  },
  /**
   * 个人发票抬头
   */
  riseName(e) {
    let val = e.detail.value
    this.setData({
      riseName: val
    })
  },
  /**
   * 企业名称
   */
  company(e) {
    let val = e.detail.value
    this.setData({
      company: val
    })
  },
  /**
   * 纳税人识别号
   */
  identification(e) {
    let val = e.detail.value
    this.setData({
      identification: val
    })
  },
  /**
   * 注册地址
   */
  invoiceAddress(e) {
    let val = e.detail.value
    this.setData({
      invoiceAddress: val
    })
  },
  /**
   * 注册电话
   */
  invoicePhone(e) {
    let val = e.detail.value
    this.setData({
      invoicePhone: val
    })
  },
  /**
   * 开户银行
   */
  bank(e) {
    let val = e.detail.value
    this.setData({
      bank: val
    })
  },
  /**
   * 银行账户
   */
  account(e) {
    let val = e.detail.value
    this.setData({
      account: val
    })
  },
  /**
   * 收票人手机号
   */
  spPhone(e) {
    let val = e.detail.value
    this.setData({
      personMobile: val
    })
  },
  /**
   * 收票人邮箱
   */
  spEmail(e) {
    console.log(e)
    let val = e.detail.value
    this.setData({
      personMail: val
    })
  },

  submit() {
    if (this.data.rise == 1 && (this.data.riseName == '' || this.data.riseName == undefined)) {
      app.showToast('请填写抬头名称', res => {})
      return
    }
    if (this.data.rise == 2 && (this.data.company == '' || this.data.company == undefined)) {
      app.showToast('请填写企业名称', res => {})
      return
    }
    if (this.data.rise == 2 && (this.data.identification == '' || this.data.identification == undefined)) {
      app.showToast('请填写纳税人识别码', res => {})
      return
    }
    if (this.data.invoiceType != 2 && !app.isPoneAvailable(this.data.personMobile)) {
      app.showToast('请输入正确的手机号', res => {})
      return
    }

    let data = {
      invoiceType: this.data.invoiceType,
      rise: this.data.rise,
      riseName: this.data.rise == 1 ? this.data.riseName : this.data.company,
      detailType: this.data.detailType,
      personMobile: this.data.personMobile != undefined ? this.data.personMobile : '',
      personMail: this.data.personMail != undefined ? this.data.personMail : '',
      company: this.data.rise == 2 ? this.data.company : undefined,
      identification: this.data.rise == 2 ? (this.data.identification == undefined ? '' : this.data.identification) : undefined,
      invoiceAddress: this.data.rise == 2 ? (this.data.invoiceAddress == undefined ? '' : this.data.invoiceAddress) : undefined,
      invoicePhone: this.data.rise == 2 ? (this.data.invoicePhone == undefined ? '' : this.data.invoicePhone) : undefined,
      bank: this.data.rise == 2 ? (this.data.bank == undefined ? '' : this.data.bank) : undefined,
      account: this.data.rise == 2 ? (this.data.account == undefined ? '' : this.data.account) : undefined,
      orderAttachId: this.data.orderAttachId,
      invoiceAttr: this.data.isAnew == 1 ? 3 : 2,
      storeId: this.data.isAnew == 1 ? this.data.storeId : undefined
    }

    let obj = {
      storeId: this.data.storeId,
      isAnew: this.data.isAnew == 1 ? 3 : 2,
      orderAttachId: this.data.orderAttachId
    }

    if (this.data.isAnew == 1 && this.data.invoiceType == 1) { // 重开发票（电子发票）
      http.post(app.globalData.invoiceAnew, data).then(res => {
        http.post(app.globalData.invoiceChangeStatus, {
          orderAttachId: this.data.orderAttachId
        }).then(res => {
          wx.redirectTo({
            url: `/nearbyShops/invoiceOver/invoiceOver?info=${JSON.stringify(obj)}`,
          })
        })
      })
    } else if (this.data.isAnew == 1 && this.data.invoiceType != 1) { // 重开发票（普通纸质发票/增值税纸质发票）
      http.post(app.globalData.invoiceAnew, data).then(res => {
        wx.redirectTo({
          url: `/pages/invoiceConfirmOrder/invoiceConfirmOrder?info=${JSON.stringify(obj)}`,
        })
      })
    } else if (this.data.isAnew != 1 && this.data.invoiceType == 1) { // 补开发票（电子发票）
      http.post(app.globalData.invoiceSupplement, data).then(res => {
        http.post(app.globalData.invoiceChangeStatus, {
          orderAttachId: this.data.orderAttachId
        }).then(res => {
          wx.redirectTo({
            url: `/nearbyShops/invoiceOver/invoiceOver?info=${JSON.stringify(obj)}`,
          })
        })
      })
    } else if (this.data.isAnew != 1 && this.data.invoiceType != 1) { // 补开发票（普通纸质发票/增值税纸质发票）
      http.post(app.globalData.invoiceSupplement, data).then(res => {
        wx.redirectTo({
          url: `/pages/invoiceConfirmOrder/invoiceConfirmOrder?info=${JSON.stringify(obj)}`,
        })
      })
    }
  }
})