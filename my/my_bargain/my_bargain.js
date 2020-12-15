const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_view: ['全部', '进行中', '成功', '失败'],
    current_tab: 0,
    //倒计时
    count_down: {},
    list: [],
    total: '',
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color
    })
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
    //砍价成功
    event.on('refreshBargain', this, id => {
      for (var i = 0, len = this.data.list.length; i < len; i++) {
        if (this.data.list[i].cut_activity_id == id) {
          if (this.data.current_tab == 0) {
            this.data.list[i].status = 2
          } else {
            this.data.list.splice(i, 1)
          }
          this.setData({
            list: this.data.list
          })
        }
      }
    })
    this.getBargainList()
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
    event.remove('bargainSuccess', this)
    clearInterval(this.data.count_down)
  },

  /**
   * 砍价商品
   */
  onBargainGood() {
    wx.redirectTo({
      url: '/pages/bargain_list/bargain_list',
    })
  },

  /**
   * 切换选项卡
   */
  onTab(e) {
    this.setData({
      current_tab: e.currentTarget.dataset.index,
      page: 1,
      list: []
    })
    this.getBargainList()
  },

  /**
   * 获取砍价列表
   */
  getBargainList() {
    http.postList(app.globalData.my_bargain, {
      status: this.data.current_tab == 0 ? '' : this.data.current_tab,
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          list: res.result.data,
          total: res.result.total
        })
      } else {
        this.setData({
          list: [...this.data.list, ...res.result.data]
        })
      }
      clearInterval(this.data.count_down)
      this.countDown()
      this.data.count_down = setInterval(() => {
        this.countDown()
      }, 1000)
    })
  },

  /**
   * 倒计时
   */
  countDown() {
    for (let i = 0, len = this.data.list.length; i < len; i++) {
      if (this.data.list[i].status == 1) {
        let second = this.data.list[i].expiration_time
        if (second == 0) {
          this.data.list[i].status = 3
        } else {
          this.data.list[i]['day'] = Math.floor(second / 86400);
          this.data.list[i]['hour'] = Math.floor(second % 86400 / 3600) < 10 ? '0' + Math.floor(second % 86400 / 3600) : Math.floor(second % 86400 / 3600);
          this.data.list[i]['min'] = Math.floor(second % 86400 % 3600 / 60) < 10 ? '0' + Math.floor(second % 86400 % 3600 / 60) : Math.floor(second % 86400 % 3600 / 60);
          this.data.list[i]['sec'] = Math.floor(second % 60) < 10 ? '0' + Math.floor(second % 60) : Math.floor(second % 60);
          this.data.list[i].expiration_time--;
        }
      }
    }
    this.setData({
      list: this.data.list
    })
  },

  /**
   * 加载更多
   */
  loadMore() {
    if (this.data.total > this.data.list.length) {
      this.data.page++;
      this.getBargainList()
    }
  },

  /**
   * 砍价详情
   */
  onBargainDetail(e) {
    wx.navigateTo({
      url: '/pages/bargain/bargain?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 订单详情
   */
  onOrderDetail(e) {
    wx.navigateTo({
      url: '../order_detail/order_detail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 重砍一个
   */
  onAnother(e) {
    wx.redirectTo({
      url: '/nearby_shops/good_detail/good_detail?goods_id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 付款
   */
  onPayOrder(e) {
    let item = e.currentTarget.dataset.item,
      obj = {
        //商品类型 1正常商品 2团购 3砍价 4限时抢购
        good_type: 3,
        //商品id
        goods_id: item.goods_id,
        //砍价id
        cut_activity_id: item.cut_activity_id,
        //参团id
        group_activity_id: '',
        //购买数量
        num: 1,
        //店铺id
        store_id: item.store_id,
        //店铺名称
        store_name: item.store_name,
        //价格
        shop_price: parseFloat(item.present_price).toFixed(2),
        //商品名称
        goods_name: item.goods_name,
        //商品规格id
        products_id: item.products_id,
        //规格展示
        attr_detail: item.attr,
        //规格
        attr: item.goods_attr,
        //库存
        goods_number: 1,
        //团购价
        group_price: '',
        //砍价
        cut_price: parseFloat(item.present_price).toFixed(2),
        //砍价的差价
        price_spread: (parseFloat(item.original_price) - parseFloat(item.present_price)).toFixed(2),
        //限时抢购价
        limit_price: '',
        //总金额
        subtotal: parseFloat(item.present_price).toFixed(2)
      }
    wx.navigateTo({
      url: '/pages/confirm_order/confirm_order?info=' + JSON.stringify(obj) + '&good_image=' + encodeURIComponent(item.file),
    })
  }
})