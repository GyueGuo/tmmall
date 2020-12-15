const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否是长按删除
    bool: false,
    //当前选中的item
    item: {},
    //当前选中的index
    index: '',
    tab: 1,
    inventory_board: false,
    list: [],
    page: 1,
    total: '',
    discount: ''
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
    event.on('notifyPrice', this, price => {
      this.data.list[this.data.index].price = price
      this.setData({
        list: this.data.list
      })
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
    event.remove('notifyPrice', this)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.data.page = 1
    this.getData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.total > this.data.list.length) {
      this.data.page++;
      this.getData()
    }
  },

  /**
   * 默认
   */
  onDefault() {
    this.closeBoard()
    this.setData({
      tab: 1
    })
  },

  /**
   * 降价
   */
  onDepreciate() {
    this.closeBoard()
    this.setData({
      tab: 2
    })
  },

  /**
   * 促销
   */
  onPromotion() {
    this.closeBoard()
    this.setData({
      tab: 3
    })
  },

  /**
   * 库存
   */
  onInventory() {
    this.setData({
      inventory_board: !this.data.inventory_board
    })
  },

  /**
   * 关闭库存弹窗
   */
  closeBoard() {
    this.setData({
      inventory_board: false
    })
  },

  /**
   * 点击库存item
   */
  onPromotionItem(e) {
    this.closeBoard()
    this.setData({
      tab: 4
    })
  },

  /**
   * 获取数据
   */
  getData() {
    http.postList(app.globalData.collect_goods_list, {
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          list: res.result.data,
          total: res.result.total,
          discount: res.discount == null ? 100 : res.discount,
        })
      } else {
        this.setData({
          list: [...this.data.list, ...res.result.data]
        })
      }
    })
  },

  /**
   * 商品详情
   */
  onGood(e) {
    if (this.data.bool) {
      this.data.bool = false
      return
    }
    wx.navigateTo({
      url: '/nearby_shops/good_detail/good_detail?goods_id=' + e.currentTarget.dataset.item.goods_id,
    })
  },

  /**
   * 删除框
   */
  deleteGood(e) {
    this.data.bool = true
    this.data.item = e.currentTarget.dataset.item
    this.data.index = e.currentTarget.dataset.index
    this.selectComponent("#modal").showModal()
  },

  /**
   * 确认删除
   */
  confirmDelete() {
    http.post(app.globalData.collect_goods_delete, {
      collectGoodsId: this.data.item.collect_goods_id + '',
      goodsId: this.data.item.goods_id + ''
    }).then(res => {
      app.showSuccessToast(res.message, () => {
        this.data.list.splice(this.data.index, 1)
        this.setData({
          list: this.data.list
        })
      })
    })
  },

  /**
   * 降价通知
   */
  priceNotification(e) {
    let item = e.currentTarget.dataset.item
    this.data.index = e.currentTarget.dataset.index
    if (this.data.bool) {
      this.data.bool = false
      return
    }
    wx.navigateTo({
      url: '/nearby_shops/price_notification/price_notification?goods_id=' + item.goods_id + '&price=' + (parseFloat(item.shop_price)).toFixed(2) + '&store_id=' + item.store_id,
    })
  },

  addCart(e) {
    let item = e.currentTarget.dataset.item
    item['attr'] = item.attribute_list
    if (item.goods_number == 0) {
      app.showToast('该商品已经卖光了')
      return
    }
    if (item['attr'].length == 0) {
      http.encPost(app.globalData.cart_create, {
        storeId: item.store_id,
        goodsId: item.goods_id,
        goodsName: item.goods_name,
        file: item.cart_file,
        number: 1,
        productsId: '',
        attr: '',
        goodsAttr: ''
      }).then(res => {
        event.emit('refreshCart')
        event.emit('refreshCartNumber')
        app.showSuccessToast('添加购物车成功')
      })
    } else {
      this.selectComponent("#buy_board").resetAll()
      this.setData({
        info: item,
      })
      this.selectComponent("#buy_board").show()
    }
  }
})