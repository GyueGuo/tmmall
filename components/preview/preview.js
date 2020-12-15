// components/preview/preview.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      observer: function() {
        if (this.data.info.multiple_file != undefined) {
          if (this.data.info.video != 'null' && this.data.info.video != '') {
            this.setData({
              video: this.data.info.video
            })
          }
          for (let i = 0, len = this.data.info.multiple_file.length; i < len; i++) {
            let image = {
              type: 'image',
              content: this.data.info.multiple_file[i]
            }
            this.data.banner.push(image)
          }

          this.setData({
            current_banner: this.data.info.current + 1,
            current: this.data.info.current,
            banner: this.data.banner,
            banner_length: this.data.info.video != 'null' && this.data.info.video != '' ? this.data.info.multiple_file.length + 1 : this.data.info.multiple_file.length
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
    current_banner: 1,
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
        current_banner: e.detail.current + 1,
        current: e.detail.current
      })
    },

    /**
     * 播放视频
     */
    _onVideo() {
      this.setData({
        video_board: true
      })
      wx.createVideoContext('video', this).play()
    },

    _videoStart(e) {
      this.data.moveX = e.touches[0].pageX
    },

    _videoMove(e) {
      let length = this.data.info.multiple_file.length
      if (e.touches[0].pageX - this.data.moveX < -50) {
        if (length >= 1) {
          this.setData({
            current: 1,
            video_board: false
          })
          wx.createVideoContext('video').pause()
        }
      }

      if (e.touches[0].pageX - this.data.moveX > 50) {
        if (length >= 1) {
          this.setData({
            current: length,
            video_board: false
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
        video_board: false
      })
    },
  }
})