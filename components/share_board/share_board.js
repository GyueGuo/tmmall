const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    distribution: null,
    infoData: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    board: true,
    //透明度
    opacity: 0,
    info: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    share_btn() {
      this.setData({
        info: app.globalData.configSwitch.share_text
      })
    },

    /**
     * 淡入效果
     */
    fadeIn() {
      this.setData({
        isShow: true
      })
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
      this.setData({
        isShow: false
      })
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
      this.setData({
        isShow: false
      })
    },

    onShareFriend() {
      this.closeBoard()
      this.triggerEvent('shareFriend')
    },

    onShareCircle() {
      if (this.data.distribution == 1) {
        wx.showLoading({
          title: '生成中...',
        })
        wx.getImageInfo({
          src: app.globalData.HTTP + this.data.infoData.combination,
          success: res => {
            wx.saveImageToPhotosAlbum({
              filePath: res.path,
              success: res => {
                app.showSuccessToast('保存成功')
                wx.hideLoading()
              },
              fail: res => {
                app.showToast('请开启保存到相册权限')
                wx.hideLoading()
              }
            })
          }
        })
        return
      }
      this.closeBoard()
      this.triggerEvent('shareCircle', {
        text: this.data.info[1]
      })
    }
  }
})