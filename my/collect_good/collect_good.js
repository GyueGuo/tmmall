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
    inventoryBoard: false,
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
      diyColor: app.globalData.diyColor
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
      inventoryBoard: !this.data.inventoryBoard
    })
  },

  /**
   * 关闭库存弹窗
   */
  closeBoard() {
    this.setData({
      inventoryBoard: false
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
    http.postList(app.globalData.collectGoodsList, {
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
      url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + e.currentTarget.dataset.item.goodsId,
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
    http.post(app.globalData.collectGoodsDelete, {
      collectGoodsId: this.data.item.collectGoodsId + '',
      goodsId: this.data.item.goodsId + ''
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
      url: '/nearbyShops/priceNotification/priceNotification?goodsId=' + item.goodsId + '&price=' + (parseFloat(item.shopPrice)).toFixed(2) + '&storeId=' + item.storeId,
    })
  },

  addCart(e) {
    let item = e.currentTarget.dataset.item
    item['attr'] = item.attributeList
    if (item.goodsNumber == 0) {
      app.showToast('该商品已经卖光了')
      return
    }
    if (item['attr'].length == 0) {
      http.encPost(app.globalData.cartCreate, {
        storeId: item.storeId,
        goodsId: item.goodsId,
        goodsName: item.goodsName,
        file: item.cartFile,
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