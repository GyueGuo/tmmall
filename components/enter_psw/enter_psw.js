const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    board: true,
    //透明度
    opacity: 0,
    //密码
    password: '',
    //弹出键盘
    focus: false,
    inputDisabled: false,
    orderInfo: {},
    adjustPosition:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 修改密码
     */
    changePsw(){
      wx.navigateTo({
        url: '/my/changePassword/changePassword',
      })
    },
    /**
     * 忘记密码
     */
    forgetPsw() {
      wx.navigateTo({
        url: '/my/forgetPswOne/forgetPswOne',
      })
    },
    /**
     * 弹出动画
     */
    showAnimation(anim) {
      let animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease',
      })
      animation.translateY(-wx.getSystemInfoSync().windowHeight)
      this.setData({
        animation: animation.step(),
        focus: true,
        isShow: true
      })
      this.fadeIn()
    },

    /**
     * 关闭动画
     */
    hiddenAnimation() {
      let animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease',
      })
      animation.translateY(wx.getSystemInfoSync().windowHeight)
      this.setData({
        animation: animation.step(),
        focus: false,
        isShow: false
      })
      this.fadeOut()
    },
    /**
     * 淡入效果
     */
    fadeIn() {
      let interval = setInterval(()=> {
        if (this.data.opacity >= 0.3) {
          clearInterval(interval)
        }
        this.setData({
          opacity: this.data.opacity + 0.01
        })
      }, 10)
    },

    /**
     * 淡出效果
     */
    fadeOut() {
      let interval = setInterval(()=> {
        if (this.data.opacity <= 0) {
          clearInterval(interval)
        }
        this.setData({
          opacity: this.data.opacity - 0.1
        })
      }, 100)
    },

    /**
     * 关闭弹窗
     */
    closeBoard(){
      this.hiddenAnimation()
      this.setData({
        isShow: false
      })
    },

    /**
     * 
     */
    show(orderInfo) {
      this.showAnimation()
      this.setData({
        orderInfo: orderInfo
      })
    },

    /**
     * 点击输入框
     */
    enterPassword() {
      this.setData({
        focus:true
      })
    },

    /**
     * 密码输入
     */
    pswInput(e) {
      this.setData({
        password: e.detail.value
      })
      if (e.detail.value.length == 6) {
        this.setData({
          inputDisabled: true,
          focus: false,
          password: e.detail.value
        })
        http.post(app.globalData.balanceExec, {
          outTradeNo: this.data.orderInfo.orderNumber == '' ? this.data.orderInfo.orderAttachNumber : this.data.orderInfo.orderNumber,
          payPassword: this.data.password,
          casePayType: 2
        }).then(res=> {
          app.showSuccessToast('支付成功', ()=> {
            this.payCallback(res)
            // wx.navigateBack()
            event.emit('payOrder')
            event.emit('refreshCart')
            event.emit('refreshOrderDetail')
            event.emit('refreshCollageDetail')
            event.emit('refreshBargainDetail')
          })
        }).catch(res=> {
          this.setData({
            password: '',
            inputDisabled: false,
            focus: true
          })
          app.showToast(res.message)
        })
      }
    },
    /**
     * 支付回调
     */
    payCallback(res) {
      let item = {
        totalPrice: this.data.orderInfo.totalPrice,
        orderType: this.data.orderInfo.orderType,
        orderAttachId: this.data.orderInfo.orderAttachId,
        outTradeNo: this.data.orderInfo.orderNumber == '' ? this.data.orderInfo.orderAttachNumber : this.data.orderInfo.orderNumber,
      }
      //商品类型 1正常商品 2团购 3砍价 4限时抢购
      let orderType = this.data.orderInfo.orderType
      console.log(orderType)
      switch (orderType) {
        case 1:
          wx.redirectTo({
            url: '/nearbyShops/payResult/payResult?item=' + JSON.stringify(item),
          })
          break;
        case 2:
          wx.redirectTo({
            url: '/pages/collageDetail/collageDetail?id=' + res.groupActivityAttachId,
          })
          break;
        case 3:
          wx.redirectTo({
            url: '/nearbyShops/payResult/payResult?item=' + JSON.stringify(item),
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
    }
  }
})