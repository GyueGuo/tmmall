const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    //支付方式 1 余额 2 微信
    payType: 2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
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
      payType: 1
    })
  },

  /**
   * 微信支付
   */
  onWx() {
    this.setData({
      payType: 2
    })
  },

  /**
   * 确认付款
   */
  commit() {
    http.post(app.globalData.orderGetOrderState, {
      number: this.data.data.orderNumber != '' ? this.data.data.orderNumber : this.data.data.orderAttachNumber,
      price: this.data.data.totalPrice,
      type: '2'
    }).then(res => {
      if (res.data.status == 0) {
        //余额支付
        if (this.data.payType == 1) {
          http.post(app.globalData.payRecharge, {
            type: '0'
          }).then(res => {
            if (res.result.hasPayPassword == 1) {
              this.selectComponent("#enter_psw").show(this.data.data.totalPrice, this.data.data.orderNumber)
            } else {
              app.showToast('请设置支付密码', (res) => {
                wx.navigateTo({
                  url: '/my/setPayPsw/setPayPsw',
                })
              })
            }
          })
        } else if (this.data.payType == 2) {
          http.post(app.globalData.wxPay, {
            integralId: this.data.data.id,
            outTradeNo: this.data.data.orderNumber,
            memberAddressId: this.data.data.address.memberAddressId,
            attach: `exchange|2|${app.globalData.memberId}`,
            totalFee: this.data.data.totalPrice,
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
                    url: '/my/integralRecord/integralRecord',
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