const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前选项卡
    tab: 1,
    page: 1,
    total: '',
    list: [],
    //是否是长按
    is_long: false,
    //当前选中item
    item: '',
    //当前索引
    index: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
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
    if (this.data.list.length < this.data.total) {
      this.data.page++;
      this.getData()
    }
  },

  /**
   * 默认
   */
  onDefault() {
    this.setData({
      tab: 1
    })
  },

  /**
   * 促销
   */
  onPromotion() {
    this.setData({
      tab: 2
    })
  },

  /**
   * 有券
   */
  onCoupon() {
    this.setData({
      tab: 3
    })
  },

  /**
   * 筛选
   */
  onFiltrate() {
    this.setData({
      filtrate: true
    })
  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.collect_store_list, {
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
    })
  },

  onShop(e) {
    if (!this.data.is_long) {
      let item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: '/nearby_shops/shop_detail/shop_detail?store_id=' + item.store_id,
      })
    }
    this.data.is_long = false
  },

  /**
   * 删除
   */
  deleteShop(e) {
    this.data.is_long = true
    this.data.item = e.currentTarget.dataset.item
    this.data.index = e.currentTarget.dataset.index
    this.selectComponent("#modal").showModal()
  },

  /**
   * 删除店铺关注
   */
  delectConfirm() {
    http.post(app.globalData.collect_store_delete, {
      collectStoreId: this.data.item.collect_store_id + '',
      storeId: this.data.item.store_id + ''
    }).then(res => {
      this.data.list.splice(this.data.index, 1)
      this.setData({
        list: this.data.list
      })
      app.showSuccessToast(res.message)
    })
  }
})