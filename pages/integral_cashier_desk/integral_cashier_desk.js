// pages/cashier_desk/cashier_desk.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    //支付方式 1 余额 2 微信
    pay_type: 2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      data: JSON.parse(options.data),
      configSwitch: app.globalData.configSwitch
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
   * 余额支付
   */
  onBalance() {
    this.setData({
      pay_type: 1
    })
  },

  /**
   * 微信支付
   */
  onWx() {
    this.setData({
      pay_type: 2
    })
  },

  /**
   * 确认付款
   */
  commit() {
    http.post(app.globalData.order_getOrderState, {
      number: this.data.data.order_number != '' ? this.data.data.order_number : this.data.data.order_attach_number,
      price: this.data.data.total_price,
      type: '2'
    }).then(res => {
      if (res.data.status == 0) {
        //余额支付
        if (this.data.pay_type == 1) {
          http.post(app.globalData.pay_recharge, {
            type: '0'
          }).then(res => {
            if (res.result.hasPayPassword == 1) {
              this.selectComponent("#enter_psw").show(this.data.data.total_price, this.data.data.order_number)
            } else {
              app.showToast('请设置支付密码', (res) => {
                wx.navigateTo({
                  url: '/my/set_pay_psw/set_pay_psw',
                })
              })
            }
          })
        } else if (this.data.pay_type == 2) {
          http.post(app.globalData.wx_pay, {
            integralId: this.data.data.id,
            outTradeNo: this.data.data.order_number,
            memberAddressId: this.data.data.address.member_address_id,
            attach: `exchange|2|${app.globalData.member_id}`,
            totalFee: this.data.data.total_price,
            openId: app.globalData.openid,
            body: '积分',
          }).then(res => {
            wx.requestPayment({
              timeStamp: res.result.timestamp,
              nonceStr: res.result.nonceStr,
              package: res.result.package,
              signType: res.result.signType,
              paySign: res.result.paySign,
              success: res => {
                app.showSuccessToast('支付成功', () => {
                  wx.redirectTo({
                    url: '/my/integral_record/integral_record',
                  })
                })
              }
            })
          })
        }
      } else if (res.data.status == 1) {
        app.showToast(res.message, () => {
          wx.navigateBack({})
        })
      }
    })
  }
})