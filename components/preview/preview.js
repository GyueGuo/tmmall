// components/preview/preview.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      observer: function () {
        if (this.data.info.multipleFile != undefined) {
          if (this.data.info.video != 'null' && this.data.info.video != '') {
            this.setData({
              video: this.data.info.video
            })
          }
          for (let i = 0, len = this.data.info.multipleFile.length; i < len; i++) {
            let image = {
              type: 'image',
              content: this.data.info.multipleFile[i]
            }
            this.data.banner.push(image)
          }

          this.setData({
            currentBanner: this.data.info.current + 1,
            current: this.data.info.current,
            banner: this.data.banner,
            bannerLength: this.data.info.video != 'null' && this.data.info.video != '' ? this.data.info.multipleFile.length + 1 : this.data.info.multipleFile.length
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    banner: [],
    bannerLength: 1,
    currentBanner: 1,
    //图片滑动开始X
    moveX: '',
    current: 0,
    info: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 轮播图滚动
     */
    bannerChange(e) {
      this.setData({
        currentBanner: e.detail.current + 1,
        current: e.detail.current
      })
    },

    /**
     * 播放视频
     */
    _onVideo() {
      this.setData({
        videoBoard: true
      })
      wx.createVideoContext('video', this).play()
    },

    _videoStart(e) {
      this.data.moveX = e.touches[0].pageX
    },

    _videoMove(e) {
      let length = this.data.info.multipleFile.length
      if (e.touches[0].pageX - this.data.moveX < -50) {
        if (length >= 1) {
          this.setData({
            current: 1,
            videoBoard: false
          })
          wx.createVideoContext('video').pause()
        }
      }

      if (e.touches[0].pageX - this.data.moveX > 50) {
        if (length >= 1) {
          this.setData({
            current: length,
            videoBoard: false
          })
          wx.createVideoContext('video').pause()
        }

      }
    },

    /**
     * 视频播放结束
     */
    _videoEnd() {
      this.setData({
        videoBoard: false
      })
    },
  }
})