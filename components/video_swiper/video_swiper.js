Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      observer: function() {
        if (this.data.info.multiple_file != undefined) {
          if (this.data.info.video != null && this.data.info.video != '') {
            this.setData({
              video: this.data.info.video,
              video_snapshot: this.data.info.video_snapshot
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
            banner: this.data.banner,
            banner_length: this.data.info.video != null && this.data.info.video != '' ? this.data.info.multiple_file.length + 1 : this.data.info.multiple_file.length
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
    info: {},
    isPlay: true,
    video_autoplay: false
  },

  ready() {
    this.networkStatus()
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
      if (e.detail.current = 1) {
        this.setData({
          isPlay: true
        })
      }
    },

    /**
     * 播放视频
     */
    _onVideo() {
      this.setData({
        video_board: true,
        isPlay: false
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
        video_board: false,
        isPlay: true
      })
    },

    /**
     * 预览
     */
    onPreview(e) {
      let index = e.currentTarget.dataset.index,
        current = 0
      if (index == -1 && this.data.info.video != '' && this.data.info.video != null) {
        current = 0
      } else if (this.data.info.video != '' && this.data.info.video != null) {
        current = index + 1
      } else {
        current = index
      }
      let multiple_file = []
      for (let i = 0, len = this.data.info.multiple_file.length; i < len; i++) {
        multiple_file.push(encodeURIComponent(this.data.info.multiple_file[i]))
      }
      let list = {
        multiple_file: multiple_file,
        video: encodeURIComponent(this.data.info.video),
        current: current
      }
      wx.navigateTo({
        url: '/nearby_shops/preview/preview?info=' + JSON.stringify(list),
      })
    },

    /**
     * 监听网络状态变化事件
     */
    networkStatus() {
      wx.onNetworkStatusChange(res => {
        if (res.networkType == 'wifi') {

        }
      })
    }
  }
})