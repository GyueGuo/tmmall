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
    move_distance: '100%',
    //同城配送
    city_wide: false,
    //门店自提
    store: false,
    //包邮
    exemption: false,
    //平台
    platform: false,
    //个人
    individual: false,
    //企业
    businesses: false,
    //是否有货
    is_stock: false,
    //最低价
    min_price: '',
    //最高价
    max_price: ''
  },

  ready() {
    this.setData({
      diy_color: app.globalData.diy_color,
      configSwitch: app.globalData.configSwitch
    })
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
     * 同城配送
     */
    onCityWide() {
      this.setData({
        city_wide: !this.data.city_wide
      })
    },

    /**
     * 门店自提
     */
    onStore() {
      this.setData({
        store: !this.data.store
      })
    },

    /**
     * 包邮
     */
    onExemption() {
      this.setData({
        exemption: !this.data.exemption
      })
    },

    /**
     * 平台自营
     */
    onPlatform() {
      this.setData({
        platform: !this.data.platform
      })
    },

    /**
     * 个人店铺
     */
    onIndividual() {
      this.setData({
        individual: !this.data.individual
      })
    },

    /**
     * 企业店铺
     */
    onBusinesses() {
      this.setData({
        businesses: !this.data.businesses
      })
    },

    /**
     * 仅显示有货
     */
    onStock() {
      this.setData({
        is_stock: !this.data.is_stock
      })
    },

    /**
     * 价格最低价
     */
    minInput(e) {
      this.data.min_price = e.detail.value
    },

    /**
     * 价格最高价
     */
    maxInput(e) {
      this.data.max_price = e.detail.value
    },


    /**
     * 确认筛选
     */
    onFiltrateConfirm() {
      if (parseFloat(this.data.min_price) > parseFloat(this.data.max_price)) {
        app.showToast('最低价不可大于最高价')
        return
      }
      this.setData({
        isShow: false,
        move_distance: '100%'
      })
      this.fadeOut()
      let shop = '',
        freight_status = '',
        is_freight = '',
        goods_number = ''
      if (this.data.city_wide) {
        freight_status += '3,'
      }
      if (this.data.store) {
        freight_status += '2,'
      }
      if (this.data.exemption) {
        is_freight = 1
      }
      if (this.data.platform) {
        shop += '0,'
      }
      if (this.data.individual) {
        shop += '1,'
      }
      if (this.data.businesses) {
        shop += '2,'
      }
      if (this.data.is_stock) {
        goods_number = 1
      }

      let filtrate = {
        shop: shop.length == 0 ? '' : shop.substring(0, shop.length - 1),
        freight_status: freight_status.length == 0 ? '' : freight_status.substring(0, freight_status.length - 1),
        is_freight: is_freight,
        goods_number: goods_number,
        minimum_price: this.data.min_price,
        top_price: this.data.max_price
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
        city_wide: false,
        store: false,
        exemption: false,
        platform: false,
        individual: false,
        businesses: false,
        is_stock: false,
        min_price: '',
        max_price: ''
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
    }
  },

})