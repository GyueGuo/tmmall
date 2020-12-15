Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      observer: function() {
        if (this.data.isShow) {
          this.fadeIn()
        } else {
          this.fadeOut()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    filtrate_board: true,
    //透明度
    opacity: 0,
    //筛选触摸开始
    moveStart: '',
    //滑动距离
    move_distance: '100%'
  },


  /**
   * 组件的方法列表
   */
  methods: {
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
     * 滑动开始
     */
    filtrateStart(e) {
      this.data.moveStart = e.touches[0].pageX
    },

    /**
     * 滑动中
     */
    filtrateMove(e) {
      this.setData({
        move_distance: e.touches[0].pageX - this.data.moveStart > 0 ? e.touches[0].pageX - this.data.moveStart : 0
      })
    },

    /**
     * 滑动结束
     */
    filtrateEnd(e) {
      if (this.data.move_distance > 50) {
        this.closeTrans()
      } else {
        this.setData({
          move_distance: 0
        })
      }
    },


    /**
     * 确认筛选
     */
    onFiltrateConfirm() {
      this.setData({
        isShow: false,
        move_distance: '100%'
      })
      this.fadeOut()
      this.triggerEvent("onFiltrateConfirm")
    },

    /**
     * 关闭筛选
     */
    closeTrans() {
      this.setData({
        isShow: false,
        move_distance: '100%'
      })
      this.fadeOut()
      this.triggerEvent("closeFiltrate")
    }
  },

})