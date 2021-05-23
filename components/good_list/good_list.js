const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: Array,
    columns: {
      type: Number,
      default: 2,
      observer: function () {
        this.setData({
          columns: this.data.columns
        })
      }
    },
    discount: Number,
    //排行榜
    rank: Boolean
  },
  ready() {
    if (app.globalData.diyColor != null && this.data.diyColor == null) {
      this.setData({
        diyColor: app.globalData.diyColor
      })
    }
    this.setData({
      configSwitch: app.globalData.configSwitch
    })    
  },

  /**
   * 组件的初始数据
   */
  data: {
    diyColor:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    blendent(obj) {
      this.setData({
        diyColor: obj.diyColor
      })
    },
    /**
     * 商品
     */
    onGoods(e) {
      wx.navigateTo({
        url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + e.currentTarget.dataset.id,
      })
    },

    onShop(e) {
      wx.navigateTo({
        url: '/nearbyShops/shopDetail/shopDetail?storeId=' + e.currentTarget.dataset.id,
      })
    },

    /**
     * 加入购物车
     */
    addCart(e) {
      if (!app.login()) {
        return
      }
      let item = e.currentTarget.dataset.item
      item.addCartType = 2
      item.attr = item.attributeList || []
      if (item.goodsNumber == 0) {
        app.showToast('该商品已经卖光了')
        return
      }
      if (item.attr.length == 0) {
        http.encPost(app.globalData.cartCreate, {
          storeId: item.storeId,
          goodsId: item.goodsId,
          goodsName: item.goodsName,
          file: item.cartFile,
          number: 1,
          productsId: '',
          attr: '',
          goodsAttr: '',
        }).then(()=> {
          event.emit('refreshCart')
          event.emit('refreshCartNumber')
          app.showSuccessToast('添加购物车成功')
        })
      } else {
        this.triggerEvent("addCart", item)
      }
    },
    onLabel(e) {
      console.log(e.currentTarget.dataset)
      wx.navigateTo({
        url: `/nearbyShops/goodDetail/goodDetail?goodsId=${e.currentTarget.dataset.goodsId}&label=${e.currentTarget.dataset.id}`,
      })
    }
  }
})