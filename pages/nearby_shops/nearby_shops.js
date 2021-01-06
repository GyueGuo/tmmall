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
    isCurrentBanner: false,
    isBanner: true,
    currentBanner: 0,
    currentTab: 1,
    //固定标题
    fixed: false,
    //全部分类筛选条件
    classifyCondition: [{
      title: '全部分类',
      storeClassifyId: ''
    }],
    classifyBoard: false,
    //筛选文字
    classify: '全部分类',
    //销量排序
    sale: false,
    //距离最近
    sort: false,
    isFiltrate: false,
    //参数
    lat: 0,
    lng: 0,
    salesVolume: '',
    shop: '',
    isShop: '',
    isCity: '',
    category: '',
    distance: '',
    nearbyPage: 1,
    nearbyList: [],
    nearbyTotal: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      model: app.globalData.model
    })
    navBar.tabbar("tabBar", 2, this) // 2附近门店
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    event.on('refreshNearby', this, () => {
      this.setData({
        nearbyList: [],
        nearbyPage: 1,
        nearbyTotal: ''
      })
      this.getNeabyList()
    })
    this.getNeabyList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isBanner: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isBanner: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    event.remove('refreshNearby', this)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      classify: '全部分类',
      //销量排序
      sale: false,
      //距离最近
      sort: false,
      isFiltrate: false,
      salesVolume: '',
      shop: '',
      isShop: '',
      isCity: '',
      category: '',
      distance: '',
      nearbyPage: 1,
      nearbyList: [],
      nearbyTotal: ''
    })
    this.getNeabyList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.nearbyTotal > this.data.nearbyList.length) {
      this.data.nearbyPage++;
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
      currentBanner: e.detail.current,
    })
  },

  /**
   * 全部分类
   */
  onClassify() {
    if (this.data.classifyBoard) {
      this.setData({
        classifyBoard: true
      })
      return
    }
    if (!this.data.fixed) {
      this.scrollFixedPosition()
    }

    if (this.data.classifyCondition.length == 1) {
      http.postList(app.globalData.platformClassify).then(res => {
        setTimeout(() => {
          this.setData({
            classifyBoard: true,
            sort: false,
          })
          clearTimeout(this)
        }, 300)
        this.setData({
          classifyCondition: this.data.classifyCondition.concat(res.result)
        })
      })
    } else {
      setTimeout(() => {
        this.setData({
          classifyBoard: true,
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
        classifyBoard: false,
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
        classifyBoard: false
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
      classifyBoard: false
    })
  },

  /**
   * 选择全部分类
   */
  selectClassify(e) {
    let item = e.currentTarget.dataset.item
    this.setData({
      classify: item.title,
      category: item.storeClassifyId
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
      filtrateBoard: true,
    })
  },

  /**
   * 关闭筛选
   */
  closeFiltrate() {
    this.setData({
      filtrateBoard: false,
    })
  },

  /**
   * 确定筛选
   */
  onFiltrateConfirm(e) {
    // this.setData({
    //   isFiltrate: true
    // })
    let filtrate = e.detail
    this.data.shop = filtrate.shop
    this.data.isShop = filtrate.isShop
    this.data.isCity = filtrate.isCity
    this.getNeabyList()
    this.scrollFixedPosition()
    this.closeFiltrate()
  },

  /**
   * 重置筛选
   */
  onFiltrateReset() {
    this.setData({
      isFiltrate: false
    })
    this.data.shop = ''
    this.data.isShop = ''
    this.data.isCity = ''
    this.getNeabyList()
    this.scrollFixedPosition()
    this.closeFiltrate()
  },

  /**
   * 更多好店
   */
  onFindShops() {
    wx.navigateTo({
      url: '/nearbyShops/findShops/findShops',
    })
  },

  /**
   * 进店
   */
  goShop(e) {
    wx.navigateTo({
      url: '/nearbyShops/shopDetail/shopDetail?storeId=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 进入商品详情
   */
  onGood(e) {
    wx.navigateTo({
      url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + e.currentTarget.dataset.id,
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
      name: item.storeName,
      address: item.address,
    })
  },

  /**
   * 获取数据
   */
  getNeabyList() {
    this.data.salesVolume = this.data.sale ? '1' : ''
    this.data.distance = this.data.sort ? '1' : ''
    http.postList(app.globalData.storeNearbyList, {
      lat: app.globalData.lat,
      lng: app.globalData.lng,
      city: app.globalData.location == '全国' ? '' : app.globalData.location,
      salesVolume: this.data.salesVolume,
      shop: this.data.shop,
      isShop: this.data.isShop,
      isCity: this.data.isCity,
      category: this.data.category,
      distance: this.data.distance,
      page: this.data.nearbyPage
    }).then(res => {
      let obj = {}
      if (this.data.nearbyPage == 1) {
        if (this.data.banner.length == 0) {
          obj.banner = res.result
        }
        obj.nearbyList = res.storeList.data
        obj.nearbyTotal = res.storeList.total
        this.setData(obj)
      } else {
        this.setData({
          nearbyList: [...this.data.nearbyList, ...res.storeList.data]
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