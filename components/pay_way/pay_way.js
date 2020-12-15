const app = getApp();
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
    opacity: 0,
    array: [],
  },
  ready(){
    this.setData({
      diy_color: app.globalData.diy_color
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 弹出动画
     */
    showAnimation() {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      animation.translateY(-wx.getSystemInfoSync().windowHeight)
      this.setData({
        animation_coupon: animation.step(),
        isShow: true
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
        animation_coupon: animation.step(),
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
     * 显示
     */
    show(array) {
      this.setData({
        array: array,
      })
      this.showAnimation()
    },

    /**
     * 关闭
     */
    close() {
      this.hiddenAnimation()
    },

    /**
     * 在线支付
     */
    onlinePay(e) {
      let index = e.currentTarget.dataset.index
      this.data.array[index].way = 1
      this.data.array[index].delivery_method = 3
      this.setData({
        array: this.data.array
      })
    },

    /**
     * 货到付款
     */
    deliveryPay(e) {
      let index = e.currentTarget.dataset.index
      // if (this.data.array[index].delivery_method == 2) {
      //   app.showToast('预约自提只支持在线付款')
      //   return
      // }
      this.data.array[index].delivery_method = 1
      this.data.array[index].way = 2
      this.setData({
        array: this.data.array
      })
    },

    /**
     * 确定
     */
    confirm() {
      this.close()
      this.triggerEvent("confirmWay", this.data.array)
    }
  }
})