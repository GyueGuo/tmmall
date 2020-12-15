const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    count_down: {},
    //第一次进入砍价
    is_first: false,
    is_Cutout: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.app_DIY(() => { }, this)
    this.data.cut_activity_id = options.id
    if (options.first) {
      this.data.is_first = true
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    event.on('refreshBargainDetail', this, () => {
      this.getData()
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    event.remove('refreshBargainDetail', this)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      path: '/pages/bargain/bargain?id=' + this.data.cut_activity_id
    }
  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.cut_detail, {
      cutActivityId: this.data.cut_activity_id
    }).then(res => {
      this.setData({
        info: res.result,
        good_list: res.recommend_list,
        discount: res.discount == null ? 100 : res.discount,
      })
      let cj = parseFloat(this.data.info.present_price) - parseFloat(this.data.info.cut_price)
      if (cj == 0) {
        this.setData({
          is_Cutout: true
        })
      } else {
        this.setData({
          is_Cutout: false
        })
      }
      if (this.data.is_first) {
        this.selectComponent("#bargainModal").show(res.result.attach_list[0].cut_price, res.result.attach_list[0].member.avatar)
      }
      this.data.is_first = false
      clearInterval(this.data.count_down)
      // this.countDown()
      this.data.count_down = setInterval(()=> {
        this.countDown()
      }, 1000)
    })
  },

  /**
   * 倒计时
   */
  countDown() {
    if (this.data.info.status == 1) {
      let second = this.data.info.expiration_time
      if (second == 0) {
        this.getData()
      } else {
        this.data.info['day'] = Math.floor(second / 86400);
        this.data.info['hour'] = Math.floor(second % 86400 / 3600) < 10 ? '0' + Math.floor(second % 86400 / 3600) : Math.floor(second % 86400 / 3600);
        this.data.info['min'] = Math.floor(second % 86400 % 3600 / 60) < 10 ? '0' + Math.floor(second % 86400 % 3600 / 60) : Math.floor(second % 86400 % 3600 / 60);
        this.data.info['sec'] = Math.floor(second % 60) < 10 ? '0' + Math.floor(second % 60) : Math.floor(second % 60);
        this.data.info.expiration_time--;
      }
    }
    this.setData({
      info: this.data.info
    })
  },

  /**
   * 帮助砍价
   */
  helpBargain() {
    if (app.globalData.member_id == '') {
      wx.navigateTo({
        url: '/pages/accredit/accredit',
      })
      return
    }
    http.post(app.globalData.cut_help, {
      cutActivityId: this.data.cut_activity_id,
      goodsId: this.data.info.goods_id,
      goodsAttr: this.data.info.goods_attr
    }).then(res => {
      this.selectComponent("#bargainModal").show(res.random_price, res.member.avatar)
      this.getData()
    })
  },

  /**
   * 付款
   */
  payOrder() {
    this.getData()
    setTimeout(() => {
      let obj = {
        //商品类型 1正常商品 2团购 3砍价 4限时抢购
        good_type: 3,
        //商品id
        goods_id: this.data.info.goods_id,
        //砍价id
        cut_activity_id: this.data.info.cut_activity_id,
        //参团id
        group_activity_id: '',
        //购买数量
        num: 1,
        //店铺id
        store_id: this.data.info.store_id,
        //店铺名称
        store_name: this.data.info.store_name,
        //价格
        shop_price: parseFloat(this.data.info.present_price).toFixed(2),
        //商品名称
        goods_name: this.data.info.goods.goods_name,
        //商品规格id
        products_id: this.data.info.products_id,
        //规格展示
        attr_detail: this.data.info.attr,
        //规格
        attr: this.data.info.goods_attr,
        //库存
        goods_number: 1,
        //团购价
        group_price: '',
        //砍价
        cut_price: parseFloat(this.data.info.present_price).toFixed(2),
        //差价
        price_spread: (parseFloat(this.data.info.original_price) - parseFloat(this.data.info.present_price)).toFixed(2),
        //限时抢购价
        limit_price: '',
        //总金额
        subtotal: parseFloat(this.data.info.present_price).toFixed(2)
      }

      wx.navigateTo({
        url: '/pages/confirm_order/confirm_order?info=' + encodeURIComponent(JSON.stringify(obj)) + '&good_image=' + encodeURIComponent(this.data.info.file),
      })
    }, 200)
  },

  /**
   * 参加其他
   */
  onOthers() {
    wx.navigateTo({
      url: '/pages/bargain_list/bargain_list',
    })
  },
  /**
   * 重砍一个
   */
  onAnother() {
    wx.redirectTo({
      url: '/nearby_shops/good_detail/good_detail?goods_id=' + this.data.info.goods_id,
    })
  },

  /**
   * 活动规则
   */
  onBargainRule() {
    wx.navigateTo({
      url: '/my/web_view/web_view?id=' + 21,
    })
  },
  onGoods(e) {
    wx.navigateTo({
      url: '/nearby_shops/good_detail/good_detail?goods_id=' + e.currentTarget.dataset.id,
    })
  }
})