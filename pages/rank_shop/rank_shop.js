const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选项卡
    tab_list: [],
    //当前一级分类
    current_tab: 0,
    page: 1,
    shop_list: [],
    total: '',
    classify: []
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
    this.getClassify()
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 获取一级列表
   */
  getClassify() {
    http.post(app.globalData.platform_classify).then(res => {
      this.setData({
        classify: res.result,
        current_tab: res.result[0].storeClassifyId,
      })
      this.getShopList()
    })
  },

  /**
   * 点击分类
   */
  onClassify(e) {
    this.setData({
      current_tab: e.currentTarget.dataset.id,
      shop_list: [],
      page: 1
    })

    this.getShopList()
  },



  /**
   * 分类更多
   */
  onMore() {
    this.setData({
      more_board: true
    })
  },

  /**
   *  关闭更多
   */
  closeBoard() {
    this.setData({
      more_board: false
    })
  },

  /**
   * 点击更多选项
   */
  onTabMoreItem(e) {
    this.closeBoard()
    this.setData({
      sroll_id: 'a-' + e.currentTarget.dataset.index,
      current_tab: e.currentTarget.dataset.id,
      shop_list: []
    })
    this.getShopList()
  },

  /**
   * 获取店铺列表
   */
  getShopList() {
    http.postList(app.globalData.store_ranking, {
      goodsClassifyId: this.data.current_tab,
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          shop_list: res.result.data,
          total: res.result.total
        })
      } else {
        this.setData({
          shop_list: [...this.data.shop_list, ...res.result.data]
        })
      }
    })
  },

  /**
   * 加载更多
   */
  loadMore() {
    if (this.data.total > this.data.shop_list.length) {
      this.data.page++;
      this.getShopList()
    }
  },

  /**
   * 店铺详情
   */
  onShop(e) {
    wx.navigateTo({
      url: '/nearby_shops/shop_detail/shop_detail?store_id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 商品详情
   */
  onGood(e) {
    wx.navigateTo({
      url: '/nearby_shops/good_detail/good_detail?goods_id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 热卖榜
   */
  onRankGood() {
    wx.redirectTo({
      url: '../rank_good/rank_good',
    })
  },
  /**
   * 页面滑动 返回顶部是否显示
   */
  scroll(e) {
    if (e.detail.scrollTop > 100) {
      this.selectComponent("#go_top").rise()
    } else {
      this.selectComponent("#go_top").decline()
    }
  },

  /**
   * 返回顶部
   */
  onBackTop() {
    this.setData({
      scroll_top: 0
    })
  },
})