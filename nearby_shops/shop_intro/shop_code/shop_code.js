// nearby_shops/shop_intro/shop_code.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    opacity: 0,
    isShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 显示
     */
    show() {
      this.showAnimation()
    },
    /**
     * 弹出动画
     */
    showAnimation(anim) {
      this.setData({
        isShow: true
      })
      setTimeout(() => {
        let animation = wx.createAnimation({
          duration: 400,
          timingFunction: 'ease',
        })
        animation.opacity(1)
        this.setData({
          animation: animation.step()
        })
      }, 100)
    },

    /**
     * 关闭动画
     */
    hiddenAnimation() {
      let animation = wx.createAnimation({
        duration: 400,
        timingFunction: 'ease',
      })
      animation.opacity(0)
      this.setData({
        animation: animation.step()
      })
      setTimeout(() => {
        this.setData({
          isShow: false
        })
      }, 400)
    },

    /**
     * 关闭窗口
     */
    _close() {
      this.hiddenAnimation()
    },
  }
})
