const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      observer: function() {
        if (this.data.isShow) {
          this.showAnimation()
        } else {
          this.hiddenAnimation()
        }
      }
    },
    parameter: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    opacity: 0
  },
  ready() {
    this.setData({
      diyColor: app.globalData.diyColor
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
        animation: animation.step(),
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
     * 关闭商品参数
     */
    closeParameter() {
      this.hiddenAnimation()
    },
  }
})