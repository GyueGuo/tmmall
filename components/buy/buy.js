const app = getApp();
import http from '../../utils/http';
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
            goodImage: this.data.info.file,
            goodFileImage: this.data.info.cartFile
          })
          if (this.data.attrArray.length != 0) {
            this._getGoodPrice()
          }
        }
      }
    },
    diyColor: Object,
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
    groupBuy: Boolean,
    //参团id
    groupActivityId: String,
    //折扣
    discount: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    diyColor: null,
    opacity: 0,
    //商品数量
    num: 1,
    //购买参数文字
    attrArray: [],
    //购买参数id
    attrValue: [],
    //购买参数文字
    attr: '请选择商品属性',
    //传入规格
    attrDetail: '',
    //商品图片
    goodImage: '',
    goodFileImage: '',
    //购买尺寸id
    productsId: '',
    orderType: 1
  },
  ready() {
    if (app.globalData.diyColor != null && this.data.diyColor == null) {
      this.setData({
        diyColor: app.globalData.diyColor
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    blendent(obj) {
      // this.setData({
      //   diyColor: obj.diyColor
      // })
    },
    /**
     * 显示
     */
    show(obj) {
      this.showAnimation()
      this.setData({
        orderType: obj ? obj.orderType : 1
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
      if (this.data.info.addCartType == 2) {
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
        attrArray: [],
        //购买参数id
        attrValue: [],
        //购买参数文字
        attr: '请选择商品属性',
        //传入规格
        attrDetail: '',
        //商品图片
        goodImage: '',
        goodFileImage: '',
        //购买尺寸id
        productsId: ''
      })
    },

    /**
     * 选择尺码
     */
    _onAttr(e) {
      let idx = e.currentTarget.dataset.idx,
        item = e.currentTarget.dataset.item;
      this.data.attrArray[idx] = {
        value: item.attrValue,
        id: item.goodsAttrId
      }
      this.data.attr = ''
      let attrDetail = ''
      for (let i = 0, len = this.data.attrArray.length; i < len; i++) {
        if (this.data.attrArray[i]) {
          this.data.attr += this.data.attrArray[i].value + ','
          attrDetail += this.data.info.attr[i].attrName + ':' + this.data.attrArray[i].value + ' '
        }
      }
      this.setData({
        attrArray: this.data.attrArray,
        attr: this.data.attr.substr(0, this.data.attr.length - 1),
        attrDetail: attrDetail
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
      http.post(app.globalData.attrFind, {
        type: this.data.orderType,
        goodsAttr: this.data.info.attr.length != 0 ? this.data.attr : '',
        goodsId: this.data.info.goodsId
      }).then(res => {
        this.setData({
          goodImage: res.result.attrFileImg,
          goodFileImage: res.result.attrFile
        })
        //团购
        this.data.info.groupPrice = res.result.attrGroupPrice
        //砍价
        this.data.info.cutPrice = res.result.attrCutPrice
        //限时
        this.data.info.timeLimitPrice = parseFloat(res.result.attrTimeLimitPrice).toFixed(2)
        //正常
        this.data.info.shopPrice = parseFloat(res.result.attrShopPrice).toFixed(2)
        //库存
        this.data.info.goodsNumber = res.result.attrGoodsNumber
        this.data.productsId = res.result.productsId
        if (this.data.num > res.result.attrGoodsNumber) {
          this.data.num = res.result.attrGoodsNumber
        } else if (this.data.num < res.result.attrGoodsNumber) {
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
      if (this.data.info.isOwnShop == 1) {
        app.showToast('您的商品，留给别人购买')
        return
      }
      //拼团上限
      if (this.data.info.isGroup == 1 && this.data.groupBuy && this.data.info.getGroupGoodsNum > this.data.info.buyCumLimit && this.data.info.buyCumLimit > 0) {
        app.showToast('该拼团商品已达到购买上限')
        return
      } else {
        if (this.data.info.isGroup == 1 && this.data.groupBuy && this.data.num >= this.data.info.buyCumLimit - this.data.info.getGroupGoodsNum && this.data.info.buyCumLimit > 0) {
          app.showToast('该拼团商品已达到购买上限')
          return
        }
      }
      /**
       * 限时抢购
       * limitNumber: 限时库存数量
       * limitPurchase: 限时购买限制数量 等于0是无购买限制
       * limitPurchaseUsed: 已购买数量
       */
      if (this.data.info.isLimit == 1 && this.data.info.limitPurchase != 0) {
        if (this.data.num >= ((this.data.info.limitPurchase - this.data.info.limitPurchaseUsed) || (this.data.info.limitPurchase - this.data.info.limitPurchaseUsed > 0)) || this.data.num >= this.data.info.limitNumber || this.data.num >= this.data.info.limitNumber) {
          app.showToast('抢购已达到上限')
          return
        }
      } else if (this.data.info.isLimit == 1 && this.data.info.limitPurchase == 0) {
        if (this.data.num >= this.data.info.limitNumber) {
          app.showToast('抢购已达到上限')
          return
        }
      }
      //正常购买上限
      if (this.data.num < this.data.info.goodsNumber) {
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
        if (this.data.info.isOwnShop == 1) {
          app.showToast('您的商品，留给别人购买')
          return
        }
        /**
         * 限时抢购
         * limitNumber: 限时库存数量
         * limitPurchase: 限时购买限制数量 等于0是无购买限制
         * limitPurchaseUsed: 已购买数量
         */
        if (this.data.info.isLimit == 1 && this.data.info.limitPurchase != 0) {
          if (this.data.num > ((this.data.info.limitPurchase - this.data.info.limitPurchaseUsed) || (this.data.info.limitPurchase - this.data.info.limitPurchaseUsed > 0)) || this.data.num > this.data.info.limitNumber || this.data.num > this.data.info.limitNumber) {
            app.showToast('抢购已达到上限')
            return
          }
        } else if (this.data.info.isLimit == 1 && this.data.info.limitPurchase == 0) {
          if (this.data.num > this.data.info.limitNumber) {
            app.showToast('抢购已达到上限')
            return
          }
        }
        //拼团上限
        if (this.data.info.isGroup == 1 && this.data.groupBuy && this.data.info.getGroupGoodsNum > this.data.info.buyCumLimit && this.data.info.buyCumLimit > 0) {
          app.showToast('该拼团商品已达到购买上限')
          return
        } else {
          if (this.data.info.isGroup == 1 && this.data.groupBuy && this.data.num > this.data.info.buyCumLimit - this.data.info.getGroupGoodsNum && this.data.info.buyCumLimit > 0) {
            app.showToast('该拼团商品已达到购买上限')
            return
          }
        }
        let isAttrArray = true
        for (let i of this.data.attrArray) {
          if (!i) {
            isAttrArray = false
          }
        }
        if (this.data.attrArray.length != this.data.info.attr.length || !isAttrArray) {
          app.showToast('请选择商品属性')
          return
        }
        if (this.data.num == 0) {
          app.showToast('购买数量不可为0')
          return
        }
        //砍价商品
        if (this.data.info.isBargain == 1) {
          this.bargain()
        } else {
          let fxType;
          if (this.data.info.isDistribution == 1 || this.data.info.isDistributor == 1) {
            fxType = 1
          }
          let obj = {
            //商品类型 1正常商品 2团购 3砍价 4限时抢购
            goodType: this.data.orderType,
            isOriginal: this.data.info.isOriginal ? '1' : '',
            //商品id
            goodsId: this.data.info.goodsId,
            //砍价id
            cutActivityId: '',
            //参团id
            groupActivityId: this.data.groupActivityId,
            //购买数量
            num: this.data.num,
            //店铺id
            storeId: this.data.info.storeId,
            //店铺名称
            storeName: encodeURIComponent(this.data.info.storeName),
            //价格
            shopPrice: this.data.info.shopPrice,
            //商品名称
            goodsName: encodeURIComponent(this.data.info.goodsName),
            //商品规格id
            productsId: this.data.productsId,
            //规格展示
            attrDetail: this.data.attrDetail,
            //规格
            attr: this.data.attr,
            //库存
            goodsNumber: this.data.info.goodsNumber,
            //团购价
            groupPrice: this.data.info.groupPrice,
            //砍价
            cutPrice: this.data.info.cutPrice,
            //限时抢购价
            timeLimitPrice: this.data.info.timeLimitPrice,
            //总金额
            subtotal: parseFloat(this.data.info.shopPrice * this.data.num).toFixed(2),
          }
          this.setData({
            isShow: false
          })
          http.post(app.globalData.appletMySaveFormId, {
            microFormId: this.data.formId
          })
          //跳转确认订单页
          wx.navigateTo({
            url: '/pages/confirmOrder/confirmOrder?info=' + encodeURIComponent(JSON.stringify(obj)) + '&goodImage=' + encodeURIComponent(this.data.goodImage),
          })
        }
      })
    },

    /**
     * 立即砍价
     */
    bargain() {
      let isAttrArray = true
      for (let i of this.data.attrArray) {
        if (!i) {
          isAttrArray = false
        }
      }
      if (this.data.attrArray.length != this.data.info.attr.length || !isAttrArray) {
        app.showToast('请选择商品属性')
        return
      }
      wx.nextTick(() => {
        if (this.data.info.isOwnShop == 1) {
          app.showToast('您的商品，留给别人购买')
          return
        }
        if (this.data.info.goodsNumber == 0) {
          app.showToast('暂无库存')
          return
        }
        http.post(app.globalData.bargainImmediately, {
          goodsId: this.data.info.goodsId,
          attr: this.data.attrDetail,
          goodsAttr: this.data.info.attr.length != 0 ? this.data.attr : '',
          productsId: this.data.productsId,
          price: this.data.info.cutPrice
        }).then(res => {
          http.post(app.globalData.appletMySaveFormId, {
            microFormId: this.data.formId
          }).then(res => {})
          wx.navigateTo({
            url: '/pages/bargain/bargain?id=' + res.cutActivityId + '&first=1'
          })
        })
      })
    },

    /**
     * 加入购物车
     */
    _addCart() {
      wx.nextTick(() => {
        let isAttrArray = true
        for (let i of this.data.attrArray) {
          if (!i) {
            isAttrArray = false
          }
        }
        if (this.data.info.isOwnShop == 1) {
          app.showToast('您的商品，留给别人购买')
          return
        }
        if (this.data.attrArray.length != this.data.info.attr.length || !isAttrArray) {
          app.showToast('请选择商品属性')
          return
        }
        if (this.data.num == 0) {
          app.showToast('购买数量不可为0')
          return
        }
        http.encPost(app.globalData.cartCreate, {
          storeId: this.data.info.storeId,
          goodsId: this.data.info.goodsId,
          goodsName: this.data.info.goodsName,
          file: this.data.goodFileImage,
          number: this.data.num,
          productsId: this.data.productsId,
          attr: this.data.attrDetail,
          goodsAttr: this.data.info.attr.length != 0 ? this.data.attr : '',
        }).then(res => {
          event.emit('refreshCart')
          event.emit('refreshCartNumber')
          let obj = {
            goodsId: this.data.info.goodsId,
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