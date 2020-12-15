const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      observer: function () {
        if (this.data.info.attr) {
          this.data.attrs = new Array(this.data.info.attr.length)
          this.setData({
            good_image: this.data.info.file,
            good_file_image: this.data.info.cart_file
          })
          if (this.data.attr_array.length != 0) {
            this._getGoodPrice()
          }
        }
      }
    },
    diy_color: Object,
    // order_type: null,
    type: String,
    isShow: {
      type: Boolean,
      observer: function () {
        if (this.data.isShow) {
          this.showAnimation()
        } else {
          this.hiddenAnimation()
        }
      }
    },
    nav: Boolean,
    //是否是开团
    group_buy: Boolean,
    //参团id
    group_activity_id: String,
    //折扣
    discount: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    diy_color: null,
    opacity: 0,
    //商品数量
    num: 1,
    //购买参数文字
    attr_array: [],
    //购买参数id
    attr_value: [],
    //购买参数文字
    attr: '请选择商品属性',
    //传入规格
    attr_detail: '',
    //商品图片
    good_image: '',
    good_file_image: '',
    //购买尺寸id
    products_id: '',
    order_type: 1
  },
  ready() {
    if (app.globalData.diy_color != null && this.data.diy_color == null) {
      this.setData({
        diy_color: app.globalData.diy_color
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    blendent(obj) {
      // this.setData({
      //   diy_color: obj.diy_color
      // })
    },
    /**
     * 显示
     */
    show(obj) {
      this.showAnimation()
      this.setData({
        order_type: obj ? obj.order_type : 1
      })
    },
    /**
     * 弹出动画
     */
    showAnimation() {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      animation.translateY(-wx.getSystemInfoSync().windowHeight)
      this.setData({
        animation: animation.step(),
        isShow: true
      })
      this.fadeIn()
    },

    /**
     * 关闭动画
     */
    hiddenAnimation() {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      animation.translateY(wx.getSystemInfoSync().windowHeight)
      this.setData({
        animation: animation.step(),
        isShow: false
      })
      this.fadeOut()
    },

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
     * 关闭窗口
     */
    _close() {
      this.hiddenAnimation()
      this.triggerEvent("closeBuy")
      if (this.data.info.add_cart_type == 2) {
        this.resetAll()
      }
    },

    /**
     * 重置属性
     */
    resetAll() {
      this.setData({
        //商品数量
        num: 1,
        //购买参数文字
        attr_array: [],
        //购买参数id
        attr_value: [],
        //购买参数文字
        attr: '请选择商品属性',
        //传入规格
        attr_detail: '',
        //商品图片
        good_image: '',
        good_file_image: '',
        //购买尺寸id
        products_id: ''
      })
      console.log(this.data.attr_array)
    },

    /**
     * 选择尺码
     */
    _onAttr(e) {
      let idx = e.currentTarget.dataset.idx,
        item = e.currentTarget.dataset.item;
      this.data.attr_array[idx] = {
        value: item.attr_value,
        id: item.goods_attr_id
      }
      this.data.attr = ''
      let attr_detail = ''
      for (let i = 0, len = this.data.attr_array.length; i < len; i++) {
        if (this.data.attr_array[i]) {
          this.data.attr += this.data.attr_array[i].value + ','
          attr_detail += this.data.info.attr[i].attr_name + ':' + this.data.attr_array[i].value + ' '
        }
      }
      this.setData({
        attr_array: this.data.attr_array,
        attr: this.data.attr.substr(0, this.data.attr.length - 1),
        attr_detail: attr_detail
      })
      if (this.data.attr.split(',').length == this.data.info.attr.length) {
        this._getGoodPrice()
      }

    },

    /**
     * 获取商品价格
     */
    _getGoodPrice() {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      http.post(app.globalData.attr_find, {
        type: this.data.order_type,
        goodsAttr: this.data.info.attr.length != 0 ? this.data.attr : '',
        goodsId: this.data.info.goods_id
      }).then(res => {
        this.setData({
          good_image: res.result.attr_file_img,
          good_file_image: res.result.attr_file
        })
        //团购
        this.data.info.group_price = res.result.attr_group_price
        //砍价
        this.data.info.cut_price = res.result.attr_cut_price
        //限时
        this.data.info.time_limit_price = parseFloat(res.result.attr_time_limit_price).toFixed(2)
        //正常
        this.data.info.shop_price = parseFloat(res.result.attr_shop_price).toFixed(2)
        //库存
        this.data.info.goods_number = res.result.attr_goods_number
        this.data.products_id = res.result.products_id
        if (this.data.num > res.result.attr_goods_number) {
          this.data.num = res.result.attr_goods_number
        } else if (this.data.num < res.result.attr_goods_number) {
          this.data.num = 1
        }
        this.setData({
          info: this.data.info,
          num: this.data.num
        })
        wx.hideLoading()
      })
    },

    /**
     * 减少商品数量
     */
    _reduceNum() {
      if (this.data.num > 1) {
        this.data.num--;
        this.setData({
          num: this.data.num
        })
      }
    },
    /**
     * 增加商品数量
     */
    _increaseNum() {
      if (this.data.info.is_own_shop == 1) {
        app.showToast('您的商品，留给别人购买')
        return
      }
      //拼团上限
      if (this.data.info.is_group == 1 && this.data.group_buy && this.data.info.get_group_goods_num > this.data.info.buy_cum_limit && this.data.info.buy_cum_limit > 0) {
        app.showToast('该拼团商品已达到购买上限')
        return
      } else {
        if (this.data.info.is_group == 1 && this.data.group_buy && this.data.num >= this.data.info.buy_cum_limit - this.data.info.get_group_goods_num && this.data.info.buy_cum_limit > 0) {
          app.showToast('该拼团商品已达到购买上限')
          return
        }
      }
      /**
       * 限时抢购
       * limit_number: 限时库存数量
       * limit_purchase: 限时购买限制数量 等于0是无购买限制
       * limit_purchase_used: 已购买数量
       */
      if (this.data.info.is_limit == 1 && this.data.info.limit_purchase != 0) {
        if (this.data.num >= ((this.data.info.limit_purchase - this.data.info.limit_purchase_used) || (this.data.info.limit_purchase - this.data.info.limit_purchase_used > 0)) || this.data.num >= this.data.info.limit_number || this.data.num >= this.data.info.limit_number) {
          app.showToast('抢购已达到上限')
          return
        }
      } else if (this.data.info.is_limit == 1 && this.data.info.limit_purchase == 0) {
        if (this.data.num >= this.data.info.limit_number) {
          app.showToast('抢购已达到上限')
          return
        }
      }
      //正常购买上限
      if (this.data.num < this.data.info.goods_number) {
        if (this.data.num == 99) {
          app.showToast('已达到购买上限')
        } else {
          this.data.num++;
          this.setData({
            num: this.data.num
          })
        }
      } else {
        app.showToast('已达到最大数量')
      }
    },
    /**
     * 购买
     */
    _buyNow() {
      wx.nextTick(() => {
        if (this.data.info.is_own_shop == 1) {
          app.showToast('您的商品，留给别人购买')
          return
        }
        /**
         * 限时抢购
         * limit_number: 限时库存数量
         * limit_purchase: 限时购买限制数量 等于0是无购买限制
         * limit_purchase_used: 已购买数量
         */
        if (this.data.info.is_limit == 1 && this.data.info.limit_purchase != 0) {
          if (this.data.num > ((this.data.info.limit_purchase - this.data.info.limit_purchase_used) || (this.data.info.limit_purchase - this.data.info.limit_purchase_used > 0)) || this.data.num > this.data.info.limit_number || this.data.num > this.data.info.limit_number) {
            app.showToast('抢购已达到上限')
            return
          }
        } else if (this.data.info.is_limit == 1 && this.data.info.limit_purchase == 0) {
          if (this.data.num > this.data.info.limit_number) {
            app.showToast('抢购已达到上限')
            return
          }
        }
        //拼团上限
        if (this.data.info.is_group == 1 && this.data.group_buy && this.data.info.get_group_goods_num > this.data.info.buy_cum_limit && this.data.info.buy_cum_limit > 0) {
          app.showToast('该拼团商品已达到购买上限')
          return
        } else {
          if (this.data.info.is_group == 1 && this.data.group_buy && this.data.num > this.data.info.buy_cum_limit - this.data.info.get_group_goods_num && this.data.info.buy_cum_limit > 0) {
            app.showToast('该拼团商品已达到购买上限')
            return
          }
        }
        let is_attr_array = true
        for (let i of this.data.attr_array) {
          if (!i) {
            is_attr_array = false
          }
        }
        if (this.data.attr_array.length != this.data.info.attr.length || !is_attr_array) {
          app.showToast('请选择商品属性')
          return
        }
        if (this.data.num == 0) {
          app.showToast('购买数量不可为0')
          return
        }
        //砍价商品
        if (this.data.info.is_bargain == 1) {
          this.bargain()
        } else {
          let fx_type;
          if (this.data.info.is_distribution == 1 || this.data.info.is_distributor == 1) {
            fx_type = 1
          }
          let obj = {
            //商品类型 1正常商品 2团购 3砍价 4限时抢购
            good_type: this.data.order_type,
            is_original: this.data.info.is_original ? '1' : '',
            //商品id
            goods_id: this.data.info.goods_id,
            //砍价id
            cut_activity_id: '',
            //参团id
            group_activity_id: this.data.group_activity_id,
            //购买数量
            num: this.data.num,
            //店铺id
            store_id: this.data.info.store_id,
            //店铺名称
            store_name: encodeURIComponent(this.data.info.store_name),
            //价格
            shop_price: this.data.info.shop_price,
            //商品名称
            goods_name: encodeURIComponent(this.data.info.goods_name),
            //商品规格id
            products_id: this.data.products_id,
            //规格展示
            attr_detail: this.data.attr_detail,
            //规格
            attr: this.data.attr,
            //库存
            goods_number: this.data.info.goods_number,
            //团购价
            group_price: this.data.info.group_price,
            //砍价
            cut_price: this.data.info.cut_price,
            //限时抢购价
            time_limit_price: this.data.info.time_limit_price,
            //总金额
            subtotal: parseFloat(this.data.info.shop_price * this.data.num).toFixed(2),
          }
          this.setData({
            isShow: false
          })
          http.post(app.globalData.applet_my_saveFormId, {
            microFormId: this.data.formId
          })
          //跳转确认订单页
          wx.navigateTo({
            url: '/pages/confirm_order/confirm_order?info=' + encodeURIComponent(JSON.stringify(obj)) + '&good_image=' + encodeURIComponent(this.data.good_image),
          })
        }
      })
    },

    /**
     * 立即砍价
     */
    bargain() {
      let is_attr_array = true
      for (let i of this.data.attr_array) {
        if (!i) {
          is_attr_array = false
        }
      }
      if (this.data.attr_array.length != this.data.info.attr.length || !is_attr_array) {
        app.showToast('请选择商品属性')
        return
      }
      wx.nextTick(() => {
        if (this.data.info.is_own_shop == 1) {
          app.showToast('您的商品，留给别人购买')
          return
        }
        if (this.data.info.goods_number == 0) {
          app.showToast('暂无库存')
          return
        }
        http.post(app.globalData.bargain_immediately, {
          goodsId: this.data.info.goods_id,
          attr: this.data.attr_detail,
          goodsAttr: this.data.info.attr.length != 0 ? this.data.attr : '',
          productsId: this.data.products_id,
          price: this.data.info.cut_price
        }).then(res => {
          http.post(app.globalData.applet_my_saveFormId, {
            microFormId: this.data.formId
          }).then(res => {})
          wx.navigateTo({
            url: '/pages/bargain/bargain?id=' + res.cut_activity_id + '&first=1'
          })
        })
      })
    },

    /**
     * 加入购物车
     */
    _addCart() {
      wx.nextTick(() => {
        let is_attr_array = true
        for (let i of this.data.attr_array) {
          if (!i) {
            is_attr_array = false
          }
        }
        if (this.data.info.is_own_shop == 1) {
          app.showToast('您的商品，留给别人购买')
          return
        }
        if (this.data.attr_array.length != this.data.info.attr.length || !is_attr_array) {
          app.showToast('请选择商品属性')
          return
        }
        if (this.data.num == 0) {
          app.showToast('购买数量不可为0')
          return
        }
        http.encPost(app.globalData.cart_create, {
          storeId: this.data.info.store_id,
          goodsId: this.data.info.goods_id,
          goodsName: this.data.info.goods_name,
          file: this.data.good_file_image,
          number: this.data.num,
          productsId: this.data.products_id,
          attr: this.data.attr_detail,
          goodsAttr: this.data.info.attr.length != 0 ? this.data.attr : '',
        }).then(res => {
          event.emit('refreshCart')
          event.emit('refreshCartNumber')
          let obj = {
            goods_id: this.data.info.goods_id,
            number: this.data.num
          }
          event.emit('shopAddCart', obj)
          this.setData({
            isShow: false
          })
          app.showSuccessToast(res.message)
          this.resetAll()
        })
      })
    },
    formId(e) {
      this.data.formId = e.detail.formId
    }
  }
})