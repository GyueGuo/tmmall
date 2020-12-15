// components/choose_sex/choose_sex.js
Component({
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
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    board: true,
    //透明度
    opacity: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
    closeBoard() {
      this.setData({
        isShow: false
      })
    },

    /**
     * 相册
     */
    onAlbum() {
      this.closeBoard()
      this.triggerEvent('confirmAvatar', 0)
    },

    /**
     * 拍照
     */
    onCamera() {
      this.closeBoard()
      this.triggerEvent('confirmAvatar', 1)
    },
    
  }
})