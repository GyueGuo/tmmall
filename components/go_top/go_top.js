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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
       * 返回顶部上升动画
       */
    rise() {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      animation.translateY('-180px').step()
      // animation.translateY(-180 / 1334 * wx.getSystemInfoSync().screenHeight).step()
      this.setData({
        animationTop: animation.export()
      })
    },

    /**
     * 返回顶部下降动画
     */
    decline() {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      animation.translateY(180 / 1334 * wx.getSystemInfoSync().screenHeight).step()
      this.setData({
        animationTop: animation.export()
      })
    },
  }
})
