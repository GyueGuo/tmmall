const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    payType: 2, //支付方式 1 余额 2 微信
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch,
      orderInfo: JSON.parse(options.orderInfo),
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
      number: this.data.orderInfo.orderNumber != '' ? this.data.orderInfo.orderNumber : this.data.orderInfo.orderAttachNumber,
      price:this.data.orderInfo.totalPrice,
      orderAttachId: this.data.orderInfo.orderAttachId,
      type: '1'
    }).then(res => {
      if (res.data.status == 0) {
        //余额支付
        if (this.data.payType == 1) {
          http.post(app.globalData.payRecharge, {
            type: '0'
          }).then(res => {
            if (res.result.hasPayPassword == 1) {
              this.selectComponent("#enter_psw").show(this.data.orderInfo)
            } else {
              app.showToast('请设置支付密码', (res) => {
                wx.navigateTo({
                  url: '/my/setPayPsw/setPayPsw',
                })
              })
            }
          })
        } else {
          http.post(app.globalData.wxPay, {
            body: '购买商品',
            outTradeNo: this.data.orderInfo.orderNumber == '' ? this.data.orderInfo.orderAttachNumber : this.data.orderInfo.orderNumber,
            totalFee: this.data.orderInfo.totalPrice,
            openId: app.globalData.openid,
            casePayType: 2,
            attach: 'pay|2',
          }).then(res => {
            wx.requestPayment({
              timeStamp: res.result.timestamp,
              nonceStr: res.result.nonceStr,
              package: res.result.package,
              signType: res.result.signType,
              paySign: res.result.paySign,
              success: res => {
                app.showSuccessToast('支付成功', res => {
                  this.payCallback()
                })
              },
              fail: res => {
                app.showToast()
              }
            })
          })
        }
      } else if (res.data.status == 1) {
        app.showToast(res.message, () => {
          wx.navigateBack({})
        })
      }
      http.post(app.globalData.appletMySaveFormId, {
        microFormId: this.data.formId
      }).then(res => { })
    })
  },

  /**
   * 支付回调
   */
  payCallback() {
    const item = {
      totalPrice: this.data.orderInfo.totalPrice,
      orderType: this.data.orderInfo.orderType,
      orderAttachId: this.data.orderInfo.orderAttachId,
      outTradeNo: this.data.orderInfo.orderNumber == '' ? this.data.orderInfo.orderAttachNumber : this.data.orderInfo.orderNumber,
    }
    switch (this.data.orderInfo.orderType) {
      case 1:
        wx.redirectTo({
          url: '/nearbyShops/payResult/payResult?item=' + JSON.stringify(item)
        })
        
        break;
      case 2:
        http.post(app.globalData.payInfoGetPayInfo, {
          outTradeNo: this.data.orderInfo.orderNumber == '' ? this.data.orderInfo.orderAttachNumber : this.data.orderInfo.orderNumber
        }).then(res => {
          wx.redirectTo({
            url: '/pages/collageDetail/collageDetail?id=' + res.data.groupActivityAttachId,
          })
        })
        break;
      case 3:
        http.post(app.globalData.payInfoGetPayInfo, {
          outTradeNo: this.data.orderInfo.orderNumber == '' ? this.data.orderInfo.orderAttachNumber : this.data.orderInfo.orderNumber
        }).then(res => {
          wx.redirectTo({
            url: '/nearbyShops/payResult/payResult?item=' + JSON.stringify(item),
          })
        })
        break;
      case 4:
        wx.redirectTo({
          url: '/nearbyShops/payResult/payResult?item=' + JSON.stringify(item),
        })
        break;
      case 'invoice':
        wx.redirectTo({
          url: '/nearbyShops/invoiceOver/invoiceOver?item=' + JSON.stringify(item),
        })
        break;
    }
  },

  formId(e) {
    this.data.formId = e.detail.formId
  }
})