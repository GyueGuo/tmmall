const app = getApp();
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
          this.setData({
            move_distance:'0'
          })
          this.fadeIn()
        } else {
          this.fadeOut()
        }
      }
    }
  },
  ready() {
    this.setData({
      diy_color: app.globalData.diy_color,
      configSwitch: app.globalData.configSwitch
    })
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
    move_distance: '100%',
    platform: false,
    company: false,
    personal: false,
    city: false,
    pickup: false,
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
     * 平台自营
     */
    _onPlatform() {
      this.setData({
        platform: !this.data.platform
      })
    },

    /**
     * 个人店铺
     */
    _onPersonal() {
      this.setData({
        personal: !this.data.personal
      })
    },

    /**
     * 企业店铺
     */
    _onCompany() {
      this.setData({
        company: !this.data.company
      })
    },

    /**
     * 同城配送
     */
    _onCity() {
      this.setData({
        city: !this.data.city
      })
    },

    /**
     * 门店自提
     */
    _onPickup() {
      this.setData({
        pickup: !this.data.pickup
      })
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
      let shop = ''
      if (this.data.platform) {
        shop += 0 + ','
      }
      if (this.data.company) {
        shop += 1 + ','
      }
      if (this.data.personal) {
        shop += 2 + ','
      }

      let filtrate = {
        shop: shop.length == 0 ? '' : shop.substring(0, shop.length - 1),
        is_shop: this.data.pickup ? '1' : '',
        is_city: this.data.city ? '1' : '',
      }

      this.triggerEvent("onFiltrateConfirm", filtrate)
    },

    /**
     * 重置筛选
     */
    onFiltrateReset() {
      this.setData({
        isShow: false,
        move_distance: '100%',
        platform: false,
        company: false,
        personal: false,
        city: false,
        pickup: false,
      })
      this.fadeOut()
      this.triggerEvent("onFiltrateReset")
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
    },
  },

})