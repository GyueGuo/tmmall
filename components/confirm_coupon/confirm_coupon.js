const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    coupon: {
      type: Array,
    }
  },

  ready() {
    this.setData({
      diy_color: app.globalData.diy_color
    })
  },

  /**
   * 组件的初始数据
   */
  data: {
    opacity: 0
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
     * 关闭优惠券
     */
    closeCoupon() {
      this.hiddenAnimation()
    },

    /**
     * 确定
     */
    confirm() {
      this.hiddenAnimation()
      this.triggerEvent("confirm", this.data.coupon)
    },
    /**
     * 显示
     */
    show() {
      this.showAnimation()
    },

    /**
     * 选择
     */
    chooseCoupon(e) {
      this.data.coupon[e.currentTarget.dataset.index].select = !this.data.coupon[e.currentTarget.dataset.index].select
      this.setData({
        coupon: this.data.coupon
      })
    }
  }
})