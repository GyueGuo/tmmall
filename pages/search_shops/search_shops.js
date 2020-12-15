const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //搜索关键字
    search_key: '',
    //选项卡
    current_tab: 1,
    //筛选状态
    is_filtrate: false,
    //参数
    lat: 0,
    lng: 0,
    sales_volume: '',
    shop: '',
    is_shop: '',
    is_city: '',
    distance: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color,
      search_key: options.key
    })
    wx.getLocation({
      success:res=> {
        this.data.lat = res.latitude
        this.data.lng = res.longitude
        this.onSearch()
      },
      fail:res=> {
        app.showToast('请开启定位权限',()=> {
          wx.openSetting()
          this.onSearch()
        })
      }
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
    wx.getLocation({
      success: res => {
        if (this.data.lat == 0) {
          this.data.lat = res.latitude
          this.data.lng = res.longitude
          this.onSearch()
        }
      },
    })
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
   * 搜索框输入
   */
  searchInput(e) {
    this.setData({
      search_key: e.detail.value
    })
  },

  /**
   * 清空输入框
   */
  onClearKey() {
    this.setData({
      search_key: ''
    })
  },

  /**
   * 搜索
   */
  onSearch() {
    this.setData({
      current_tab: 1,
      page: 1,
      sales_volume: '',
      shop: '',
      is_shop: '',
      is_city: '',
      distance: ''
    })
    this.getShopList()
  },

  /**
   * 获取列表
   */
  getShopList() {
    http.post(app.globalData.store_search_list, {
      lat: this.data.lat,
      lng: this.data.lng,
      salesVolume: this.data.sales_volume,
      shop: this.data.shop,
      isShop: this.data.is_shop,
      keyword: this.data.search_key,
      distance: this.data.distance,
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

  /**
   * 综合
   */
  onComposite() {
    this.setData({
      current_tab: 1,
      sales_volume: '',
      distance: '',
      page: 1
    })
    this.getShopList()
  },

  /**
   * 销量
   */
  onSale() {
    //关闭综合列表框
    this.setData({
      current_tab: 2,
      sales_volume: '1',
      distance: '',
      page: 1
    })
    this.getShopList()

  },

  /**
   * 距离最近
   */
  onDistance() {
    this.setData({
      current_tab: 3,
      sales_volume: '',
      distance: '1',
      page: 1
    })
    this.getShopList()
  },

  /**
   * 筛选
   */
  OnChangeFilter() {
    this.setData({
      filtrate_board: true
    })
    this.selectComponent("#search_shop_filitrate").isIndex()
  },

  /**
   * 筛选重置
   */
  onFiltrateReset() {
    this.setData({
      is_filtrate: false,
      shop: '',
      is_city: '',
      is_shop: '',
    })
    this.getShopList()
  },

  /**
   * 筛选确定
   */
  onFiltrateConfirm(e) {
    this.setData({
      is_filtrate: true,
      shop: e.detail.shop,
      is_city: e.detail.is_city,
      is_shop: e.detail.is_shop,
    })
    this.getShopList()
  },

  /**
   * 加载更多
   */
  loadMore() {
    if (this.data.list.length < this.data.total) {
      this.data.page++;
      this.getShopList()
    }
  },

  /**
   * 进店
   */
  onShopDetail(e) {
    wx.navigateTo({
      url: '/nearby_shops/shop_detail/shop_detail?store_id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 进入商品详情
   */
  onGood(e) {
    wx.navigateTo({
      url: '/nearby_shops/good_detail/good_detail?goods_id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 导航
   */
  onNavigation(e) {
    let item = e.currentTarget.dataset.item
    wx.openLocation({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lng),
      scale: 18,
      name: item.store_name,
      address: item.address,
    })
  },
})