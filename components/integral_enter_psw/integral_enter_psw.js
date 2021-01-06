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
    id: '',
    address: {},
    adjustPosition: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 修改密码
     */
    changePsw() {
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
        duration: 500,
        timingFunction: 'ease',
      })
      animation.translateY(-wx.getSystemInfoSync().windowHeight)
      this.setData({
        animation: animation.step(),
        isShow: true,
        focus: true
      })
      this.fadeIn()
    },

    /**
     * 关闭动画
     */
    hiddenAnimation() {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      animation.translateY(wx.getSystemInfoSync().windowHeight)
      this.setData({
        animation: animation.step(),
        isShow: false,
        focus: false
      })
      this.fadeOut()
    },
    /**
     * 淡入效果
     */
    fadeIn() {
      let interval = setInterval(() => {
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
      let interval = setInterval(() => {
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
    closeBoard() {
      this.hiddenAnimation()
      this.setData({
        isShow: false
      })
    },

    /**
     * 
     */
    show(totalPrice, orderNumber) {
      this.showAnimation()
      this.setData({
        orderNumber,
        totalPrice,
      })
    },

    /**
     * 点击输入框
     */
    enterPassword() {
      this.setData({
        focus: true
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
        http.encPost(app.globalData.redemptionMoney, {
          orderNumber: this.data.orderNumber,
          from: "2",
          payPass: e.detail.value
        }).then(res => {
          app.showSuccessToast('支付成功', () => {
            wx.redirectTo({
              url: '/my/integralRecord/integralRecord',
            })
            event.emit('refreshIntegral')
          })
        }).catch(res => {
          this.setData({
            password: ''
          })
          app.showToast(res.message)
        })
      }
    }
  }
})