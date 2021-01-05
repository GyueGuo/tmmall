const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_info: {},
    pay_type: 2, //支付方式 1 余额 2 微信
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch,
      order_info: JSON.parse(options.order_info),
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
      number: this.data.order_info.order_number != '' ? this.data.order_info.order_number : this.data.order_info.order_attach_number,
      price:this.data.order_info.total_price,
      orderAttachId: this.data.order_info.order_attach_id,
      type: '1'
    }).then(res => {
      if (res.data.status == 0) {
        //余额支付
        if (this.data.pay_type == 1) {
          http.post(app.globalData.pay_recharge, {
            type: '0'
          }).then(res => {
            if (res.result.hasPayPassword == 1) {
              this.selectComponent("#enter_psw").show(this.data.order_info)
            } else {
              app.showToast('请设置支付密码', (res) => {
                wx.navigateTo({
                  url: '/my/set_pay_psw/set_pay_psw',
                })
              })
            }
          })
        } else {
          http.post(app.globalData.wx_pay, {
            body: '购买商品',
            outTradeNo: this.data.order_info.order_number == '' ? this.data.order_info.order_attach_number : this.data.order_info.order_number,
            totalFee: this.data.order_info.total_price,
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
                  this.pay_callback()
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
      http.post(app.globalData.applet_my_saveFormId, {
        microFormId: this.data.formId
      }).then(res => { })
    })
  },

  /**
   * 支付回调
   */
  pay_callback() {
    const item = {
      total_price: this.data.order_info.total_price,
      order_type: this.data.order_info.order_type,
      order_attach_id: this.data.order_info.order_attach_id,
      out_trade_no: this.data.order_info.order_number == '' ? this.data.order_info.order_attach_number : this.data.order_info.order_number,
    }
    switch (this.data.order_info.order_type) {
      case 1:
        wx.redirectTo({
          url: '/nearby_shops/pay_result/pay_result?item=' + JSON.stringify(item)
        })
        
        break;
      case 2:
        http.post(app.globalData.payInfo_getPayInfo, {
          outTradeNo: this.data.order_info.order_number == '' ? this.data.order_info.order_attach_number : this.data.order_info.order_number
        }).then(res => {
          wx.redirectTo({
            url: '/pages/collage_detail/collage_detail?id=' + res.data.group_activity_attach_id,
          })
        })
        break;
      case 3:
        http.post(app.globalData.payInfo_getPayInfo, {
          outTradeNo: this.data.order_info.order_number == '' ? this.data.order_info.order_attach_number : this.data.order_info.order_number
        }).then(res => {
          wx.redirectTo({
            url: '/nearby_shops/pay_result/pay_result?item=' + JSON.stringify(item),
          })
        })
        break;
      case 4:
        wx.redirectTo({
          url: '/nearby_shops/pay_result/pay_result?item=' + JSON.stringify(item),
        })
        break;
      case 'invoice':
        wx.redirectTo({
          url: '/nearby_shops/invoice_over/invoice_over?item=' + JSON.stringify(item),
        })
        break;
    }
  },

  formId(e) {
    this.data.formId = e.detail.formId
  }
})