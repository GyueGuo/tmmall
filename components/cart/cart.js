const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    diyColor:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    diyColor: null,
    number: 0
  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
      this.getData()
      event.on('refreshCartNumber', this, () => {
        this.getData()
      })
    },
    hide: function() {
      // 页面被隐藏
      event.remove('refreshCartNumber', this)
    },
    resize: function(size) {
      // 页面尺寸变化
    }
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
    getData() {
      if (app.globalData.memberId != '') {
        setTimeout(() => {
          http.post(app.globalData.cartNumber, {}).then(res => {
            this.setData({
              number: res.result
            })
          })
        }, 800)
      }
    },
    onCart() {
      wx.switchTab({
        url: '/pages/cart/cart',
      })
    }
  }
})