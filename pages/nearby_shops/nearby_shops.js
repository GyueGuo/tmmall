const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
const navBar = require('../../components/navBar/navBar.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    isCurrent_banner: false,
    isBanner: true,
    current_banner: 0,
    current_tab: 1,
    //固定标题
    fixed: false,
    //全部分类筛选条件
    classify_condition: [{
      title: '全部分类',
      store_classify_id: ''
    }],
    classify_board: false,
    //筛选文字
    classify: '全部分类',
    //销量排序
    sale: false,
    //距离最近
    sort: false,
    is_filtrate: false,
    //参数
    lat: 0,
    lng: 0,
    sales_volume: '',
    shop: '',
    is_shop: '',
    is_city: '',
    category: '',
    distance: '',
    nearby_page: 1,
    nearby_list: [],
    nearby_total: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      model: app.globalData.model
    })
    navBar.tabbar("tabBar", 2, this) // 2附近门店
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    event.on('refreshNearby', this, () => {
      this.setData({
        nearby_list: [],
        nearby_page: 1,
        nearby_total: ''
      })
      this.getNeabyList()
    })
    this.getNeabyList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      isBanner: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      isBanner: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    event.remove('refreshNearby', this)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      classify: '全部分类',
      //销量排序
      sale: false,
      //距离最近
      sort: false,
      is_filtrate: false,
      sales_volume: '',
      shop: '',
      is_shop: '',
      is_city: '',
      category: '',
      distance: '',
      nearby_page: 1,
      nearby_list: [],
      nearby_total: ''
    })
    this.getNeabyList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.nearby_total > this.data.nearby_list.length) {
      this.data.nearby_page++;
      this.getNeabyList()
    }
  },

  /**
   * 页面滑动
   */
  onPageScroll(e) {
    //固定状态栏
    let query = wx.createSelectorQuery().in(this)
    query.select('#top').boundingClientRect(res => {
      if (res.height < e.scrollTop) {
        this.setData({
          fixed: true
        })
      } else {
        this.setData({
          fixed: false
        })
      }
    }).exec()
  },

  /**
   * 轮播图播放第几张
   */
  bannerChange(e) {
    this.setData({
      current_banner: e.detail.current,
    })
  },

  /**
   * 全部分类
   */
  onClassify() {
    if (this.data.classify_board) {
      this.setData({
        classify_board: true
      })
      return
    }
    if (!this.data.fixed) {
      this.scrollFixedPosition()
    }

    if (this.data.classify_condition.length == 1) {
      http.postList(app.globalData.platform_classify).then(res => {
        setTimeout(() => {
          this.setData({
            classify_board: true,
            sort: false,
          })
          clearTimeout(this)
        }, 300)
        this.setData({
          classify_condition: this.data.classify_condition.concat(res.result)
        })
      })
    } else {
      setTimeout(() => {
        this.setData({
          classify_board: true,
          sort: false,
        })
        clearTimeout(this)
      }, 300)
    }
  },

  /**
   * 销量
   */
  onSale() {
    setTimeout(() => {
      this.setData({
        classify_board: false,
        sale: true,
        sort: false,
      })
      this.scrollFixedPosition()
      this.getNeabyList()
      clearTimeout(this)
    }, 300)
  },

  /**
   * 搜索
   */
  onSearch() {
    wx.navigateTo({
      url: '/pages/search/search?type=2',
    })
  },

  /**
   * 距离最近
   */
  onSort() {
    setTimeout(() => {
      this.setData({
        sort: true,
        sale: false,
        classify_board: false
      })
      this.getNeabyList()
      this.scrollFixedPosition()
      clearTimeout(this)
    }, 300)
  },

  /**
   * 页面滚动到固定位置
   */
  scrollFixedPosition() {
    let query = wx.createSelectorQuery().in(this)
    query.select('#top').boundingClientRect(res => {
      wx.pageScrollTo({
        scrollTop: res.height,
        duration: 0,
      })
    }).exec()
  },

  /**
   * 关闭全部分类弹出框
   */
  closeClassify() {
    this.setData({
      classify_board: false
    })
  },

  /**
   * 选择全部分类
   */
  selectClassify(e) {
    let item = e.currentTarget.dataset.item
    this.setData({
      classify: item.title,
      category: item.store_classify_id
    })
    this.closeClassify()
    this.scrollFixedPosition()
    this.getNeabyList()
  },

  /**
   * 筛选
   */
  OnChangeFilter() {
    this.closeClassify()
    this.setData({
      filtrate_board: true,
    })
  },

  /**
   * 关闭筛选
   */
  closeFiltrate() {
    this.setData({
      filtrate_board: false,
    })
  },

  /**
   * 确定筛选
   */
  onFiltrateConfirm(e) {
    // this.setData({
    //   is_filtrate: true
    // })
    let filtrate = e.detail
    this.data.shop = filtrate.shop
    this.data.is_shop = filtrate.is_shop
    this.data.is_city = filtrate.is_city
    this.getNeabyList()
    this.scrollFixedPosition()
    this.closeFiltrate()
  },

  /**
   * 重置筛选
   */
  onFiltrateReset() {
    this.setData({
      is_filtrate: false
    })
    this.data.shop = ''
    this.data.is_shop = ''
    this.data.is_city = ''
    this.getNeabyList()
    this.scrollFixedPosition()
    this.closeFiltrate()
  },

  /**
   * 更多好店
   */
  onFindShops() {
    wx.navigateTo({
      url: '/nearby_shops/find_shops/find_shops',
    })
  },

  /**
   * 进店
   */
  goShop(e) {
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

  /**
   * 获取数据
   */
  getNeabyList() {
    this.data.sales_volume = this.data.sale ? '1' : ''
    this.data.distance = this.data.sort ? '1' : ''
    http.postList(app.globalData.store_nearby_list, {
      lat: app.globalData.lat,
      lng: app.globalData.lng,
      city: app.globalData.location == '全国' ? '' : app.globalData.location,
      salesVolume: this.data.sales_volume,
      shop: this.data.shop,
      isShop: this.data.is_shop,
      isCity: this.data.is_city,
      category: this.data.category,
      distance: this.data.distance,
      page: this.data.nearby_page
    }).then(res => {
      let obj = {}
      if (this.data.nearby_page == 1) {
        if (this.data.banner.length == 0) {
          obj.banner = res.result
        }
        obj.nearby_list = res.storeList.data
        obj.nearby_total = res.storeList.total
        this.setData(obj)
      } else {
        this.setData({
          nearby_list: [...this.data.nearby_list, ...res.storeList.data]
        })
      }
    })
  },
  route(e) {
    if (e.currentTarget.dataset.item.id == 3) {
      wx.stopPullDownRefresh()
      wx.startPullDownRefresh()
    }
  }
})