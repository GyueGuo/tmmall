// nearby_shops/invoice_info/invoice_info.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    diy_color: app.globalData.diy_color,
    //发票类型
    invoice_con: [{
      name: '电子普通发票',
      type: '1'
    }, {
      name: '普通发票',
      type: '2'
    }, {
      name: '增值税专用发票',
      type: '3'
    }],
    invoice_type: '1',
    //发票抬头
    rise_con: [{
      name: '个人或事业单位',
      type: '1'
    }, {
      name: '企业',
      type: '2'
    }],
    rise: '1',
    //发票内容
    detail_con: [{
      name: '商品明细',
      type: '1'
    }, {
      name: '商品类型',
      type: '2'
    }],
    detail_type: '1',
    is_anew: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let data
    if (options.is_anew) {
      data = {
        order_attach_id: options.order_attach_id,
        is_anew: options.is_anew,
        store_id: options.store_id
      }
    } else {
      data = {
        order_attach_id: options.order_attach_id,
        store_id: options.store_id
      }
    }
    this.setData(data)
    this.invoice_explain_type()
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
    http.post(app.globalData.invoice_explain_reopening, {
      orderAttachId: this.data.order_attach_id
    }).then(res => {
      if (res.result != null && res.result != '') {
        this.setData({
          data: res.result,
          is_amend: 1,
          invoice_type: res.result.invoice_type,
          rise: res.result.rise,
          rise_name: res.result.rise == 1 ? res.result.rise_name : '',
          detail_type: res.result.detail_type,
          person_mobile: res.result.InvoiceAttach.person_mobile != undefined ? res.result.InvoiceAttach.person_mobile : '',
          person_mail: res.result.InvoiceAttach.person_mail != undefined ? res.result.InvoiceAttach.person_mail : '',
          company: res.result.rise == 2 ? res.result.company : undefined,
          identification: res.result.rise == 2 ? (res.result.identification == undefined ? '' : res.result.identification) : undefined,
          invoice_address: res.result.rise == 2 ? (res.result.invoice_address == undefined ? '' : res.result.invoice_address) : undefined,
          invoice_phone: res.result.rise == 2 ? (res.result.invoice_phone == undefined ? '' : res.result.invoice_phone) : undefined,
          bank: res.result.rise == 2 ? (res.result.bank == undefined ? '' : res.result.bank) : undefined,
          account: res.result.rise == 2 ? (res.result.account == undefined ? '' : res.result.account) : undefined,
        })
      }
    })
  },

  /**
   * 发票可开具类型
   */
  invoice_explain_type() {
    http.post(app.globalData.invoice_explain_type, {
      store_id: this.data.store_id
    }).then(res => {
      let invoice_type = null
      for (let i = 0, len = res.result.length; i < len; i++) {
        this.data.invoice_con[i].status = res.result[i]
        if (res.result[i] == 1 && invoice_type != 1) {
          invoice_type = i
        }
      }
      this.setData({
        invoice_con: this.data.invoice_con,
        invoice_type: invoice_type
      })
    })
  },

  /**
   * 选择发票类型
   */
  invoiceClick(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      invoice_type: type
    })
    if (type == 3) {
      this.setData({
        rise_con: [{
          name: '企业',
          type: '2'
        }],
        rise: '2',
      })
    } else {
      this.setData({
        rise_con: [{
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
      detail_type: type
    })
  },
  /**
   * 个人发票抬头
   */
  rise_name(e) {
    let val = e.detail.value
    this.setData({
      rise_name: val
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
  invoice_address(e) {
    let val = e.detail.value
    this.setData({
      invoice_address: val
    })
  },
  /**
   * 注册电话
   */
  invoice_phone(e) {
    let val = e.detail.value
    this.setData({
      invoice_phone: val
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
      person_mobile: val
    })
  },
  /**
   * 收票人邮箱
   */
  spEmail(e) {
    console.log(e)
    let val = e.detail.value
    this.setData({
      person_mail: val
    })
  },

  submit() {
    if (this.data.rise == 1 && (this.data.rise_name == '' || this.data.rise_name == undefined)) {
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
    if (this.data.invoice_type != 2 && !app.isPoneAvailable(this.data.person_mobile)) {
      app.showToast('请输入正确的手机号', res => {})
      return
    }

    let data = {
      invoiceType: this.data.invoice_type,
      rise: this.data.rise,
      riseName: this.data.rise == 1 ? this.data.rise_name : this.data.company,
      detailType: this.data.detail_type,
      personMobile: this.data.person_mobile != undefined ? this.data.personMobile : '',
      personMail: this.data.person_mail != undefined ? this.data.personMail : '',
      company: this.data.rise == 2 ? this.data.company : undefined,
      identification: this.data.rise == 2 ? (this.data.identification == undefined ? '' : this.data.identification) : undefined,
      invoiceAddress: this.data.rise == 2 ? (this.data.invoice_address == undefined ? '' : this.data.invoice_address) : undefined,
      invoicePhone: this.data.rise == 2 ? (this.data.invoice_phone == undefined ? '' : this.data.invoice_phone) : undefined,
      bank: this.data.rise == 2 ? (this.data.bank == undefined ? '' : this.data.bank) : undefined,
      account: this.data.rise == 2 ? (this.data.account == undefined ? '' : this.data.account) : undefined,
      orderAttachId: this.data.order_attach_id,
      invoiceAttr: this.data.is_anew == 1 ? 3 : 2,
      storeId: this.data.is_anew == 1 ? this.data.store_id : undefined
    }

    let obj = {
      store_id: this.data.store_id,
      is_anew: this.data.is_anew == 1 ? 3 : 2,
      order_attach_id: this.data.order_attach_id
    }

    if (this.data.is_anew == 1 && this.data.invoice_type == 1) { // 重开发票（电子发票）
      http.post(app.globalData.invoice_anew, data).then(res => {
        http.post(app.globalData.invoice_change_status, {
          orderAttachId: this.data.order_attach_id
        }).then(res => {
          wx.redirectTo({
            url: `/nearby_shops/invoice_over/invoice_over?info=${JSON.stringify(obj)}`,
          })
        })
      })
    } else if (this.data.is_anew == 1 && this.data.invoice_type != 1) { // 重开发票（普通纸质发票/增值税纸质发票）
      http.post(app.globalData.invoice_anew, data).then(res => {
        wx.redirectTo({
          url: `/pages/invoice_confirm_order/invoice_confirm_order?info=${JSON.stringify(obj)}`,
        })
      })
    } else if (this.data.is_anew != 1 && this.data.invoice_type == 1) { // 补开发票（电子发票）
      http.post(app.globalData.invoice_supplement, data).then(res => {
        http.post(app.globalData.invoice_change_status, {
          orderAttachId: this.data.order_attach_id
        }).then(res => {
          wx.redirectTo({
            url: `/nearby_shops/invoice_over/invoice_over?info=${JSON.stringify(obj)}`,
          })
        })
      })
    } else if (this.data.is_anew != 1 && this.data.invoice_type != 1) { // 补开发票（普通纸质发票/增值税纸质发票）
      http.post(app.globalData.invoice_supplement, data).then(res => {
        wx.redirectTo({
          url: `/pages/invoice_confirm_order/invoice_confirm_order?info=${JSON.stringify(obj)}`,
        })
      })
    }
  }
})