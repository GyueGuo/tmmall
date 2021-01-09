// pages/home/home.js
const app = getApp();
const event = require('../../utils/event.js');
import http from '../../utils/http';
const navBar = require('../../components/navBar/navBar.js');
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk = new QQMapWX({
  key: app.globalData.MapKey
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo: null, //首页数据
    bannerSwiperIdx: 0, //banner当前轮播下标
    location: '全国', //默认定位
    limitIndex: 0, //限时选中下标
    isApplication: true, //是否第一次进入应用
    isBannerAutoplay: true, //首页banner是否自动滚动
    isRefresh: false //首页是否刷新
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.globalData.navType = 'only1'
    this.getSystemInfo()
    //代言id
    if (options.supId) {
      wx.setStorage({
        key: 'supId',
        data: options.supId
      })
    }
    // 分享二维码
    if (options.scene) {
      let obj = http.scene(options.scene)
      console.log(obj)
      //上级id
      let sId = obj.member
      wx.setStorage({
        key: 'sId',
        data: sId
      })
      //上级代言id
      let supId = obj.supId
      wx.setStorage({
        key: 'supId',
        data: supId
      })
    }
    // obj = {
    //   isApplication: false
    // }
    // this.setData(obj)
    app.appDIY(() => {
      this.location()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    event.on('refreshHome', this, () => {
      this.setData({
        isRefresh: true
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      isBannerAutoplay: true,
      isHotAutoplay: true,
    })
    if (this.data.isRefresh) {
      this.location()
    }
    if (!this.data.isApplication) {
      this.indexCurLimitList()
      this.countDown() //倒计时
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      isBannerAutoplay: false,
      isApplication: false,
      isHotAutoplay: false,
      isRefresh: false
    })
    clearInterval(this.data.countDown)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.setData({
      isBannerAutoplay: false,
      isHotAutoplay: false,
      isApplication: true,
      isRefresh: false
    })
    clearInterval(this.data.countDown)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.location()
  },
  /**
   * 页面滑动
   */
  onPageScroll(e) {
    this.nav()
    //返回顶部
    if (e.scrollTop > 100) {
      this.selectComponent("#go_top").rise()
    } else {
      this.selectComponent("#go_top").decline()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 获取系统信息
   */
  getSystemInfo() {
    this.setData({
      model: app.globalData.model
    })
  },
  /**
   * 获取数据
   * pattern
   */
  getData() {
    http.post(app.globalData.index, {
      pattern: 1
    }).then(res => {
      this.setData({
        dataInfo: res.data,
      })
      this.countDown() //倒计时
      this.navAttr()
    })
  },

  /**
   * 定位
   */
  location() {
    qqmapsdk.reverseGeocoder({
      success: res => {
        app.globalData.lat = res.result.location.lat
        app.globalData.lng = res.result.location.lng
        const { city } = res.result.address_component;
        app.globalData.location = city
        app.globalData.currentLocation = city
        this.setData({
          location: city
        })
      },
      fail: res => {
        this.setData({
          location: app.globalData.location
        })
      },
      complete: () => {

      }
    })
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch,
      model: app.globalData.model
    })
    wx.nextTick(() => {
      this.getData()
      this.blendent()
      navBar.tabbar("tabBar", 0, this) //0首页
      wx.setNavigationBarTitle({
        title: this.data.configSwitch.appInfo.title
      })
    })
  },

  /**
   * DIY配色
   */
  blendent() {
    let obj = {
      diyColor: app.globalData.diyColor
    }
    this.selectComponent("#cart").blendent(obj)
    this.selectComponent("#buy_board").blendent(obj)
  },
  /**
   * banner
   */
  bannerChange(e) {
    this.setData({
      bannerSwiperIdx: e.detail.current
    })
  },
  /**
   * swiper禁止滑动
   */
  stopTouchMove() {
    return false
  },

  /**
   * 回到顶部
   */
  onBackTop() {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  /**
   * 限时抢购选择场次
   */
  limitTap(e) {
    this.setData({
      limitIndex: e.currentTarget.dataset.idx
    })
  },
  /**
   * 倒计时
   */
  countDown() {
    clearInterval(this.data.countDown)
    this.data.limitTime = this.data.dataInfo.limit.time.countDown
    this.countCallback()
    this.data.countDown = setInterval(() => {
      this.data.limitTime--;
      this.setData({
        limitTime: this.data.limitTime
      })
      this.countCallback()
    }, 1000)
  },
  /**
   * 倒计时回调
   */
  countCallback() {
    if (this.data.limitTime <= 0) {
      this.indexCurLimitList()
      return
    }
  },
  /**
   * 点击地理位置
   */
  onLocation() {
    wx.navigateTo({
      url: '/pages/citySelect/citySelect',
    })
  },
  /**
   * 搜索
   */
  onSearch() {
    wx.navigateTo({
      url: '/pages/search/search?type=1',
    })
  },
  /**
   * 扫一扫
   */
  onScan() {
    wx.scanCode({
      success(res) {
        console.log(res)
        // return
        let scene = decodeURIComponent(res.path.split("=")[1])
        let obj = http.scene(scene)
        console.log(obj)
        let data = scene.split("-")[0]
        console.log(data.split(",")[0])
        switch (data.split(",")[0]) {
          case 'goods':
            wx.navigateTo({
              url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + obj.goods
            })
            break;
          case 'store':
            wx.navigateTo({
              url: '/nearbyShops/shopDetail/shopDetail?storeId=' + obj.store
            })
            break;
        }
      }
    })
  },

  /**
   * 付款码
   */
  onPayCode() {
    if (app.login()) {
      wx.navigateTo({
        url: `/my/vipCard/vipCard?&tab=1`
      })
    }
  },
  /**
   * 广告点击
   */
  onAdv(e) {
    let item = e.currentTarget.dataset.item
    switch (item.type) {
      case 1: //商品
        wx.navigateTo({
          url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + item.content,
          success: () => {
            http.post(app.globalData.indexAdBrowseInc, {
              advId: item.advId
            }).then(res => {})
          }
        })
        break;
      case 2: //店铺
        return
        wx.navigateTo({
          url: '/nearbyShops/shopDetail/shopDetail?storeId=' + item.content,
          success: () => {
            http.post(app.globalData.indexAdBrowseInc, {
              advId: item.advId
            }).then(res => {})
          }
        })
        break;
    }
  },
  /**
   * 导航条
   */
  onNavigation(e) {
    let item = e.currentTarget.dataset.item
    if (item.type == 1) {
      switch (item.name) {
        case 'signIn': //签到
          wx.navigateTo({
            url: '/my/integral/integral',
          })
          break;
        case 'invit': //邀请有礼
          if (app.login()) {
            wx.navigateTo({
              url: `/pages/invitation/invitation?token=${this.data.dataInfo.parameter}`,
            })
          }
          break;
        case 'group': //拼团
          wx.navigateTo({
            url: '/pages/collageBuy/collageBuy',
          })
          break;
        case 'cut': //砍价
          wx.navigateTo({
            url: '/pages/bargainList/bargainList',
          })
          break;
        case 'coupon': //领券
          wx.navigateTo({
            url: '/my/couponCenter/couponCenter',
          })
          break;
        case 'recharge': //充值
          wx.navigateTo({
            url: '/my/accountRecharge/accountRecharge',
          })
          break;
        case 'ranking': //排行榜
          wx.navigateTo({
            url: '/pages/rankGood/rankGood',
          })
          break;
        case 'brand': //品牌甄选
          wx.navigateTo({
            url: '/pages/brandSelect/brandSelect',
          })
          break;
        case 'merchant': //商家入驻
          if (app.login()) {
            wx.navigateTo({
              url: '/my/merchantGuide/merchantGuide',
            })
          }
          break;
        case 'distribution': //代言
          http.post(app.globalData.distributionJumpSign, {}).then(res => {
            wx.navigateTo({
              url: res.data.path
            })
          })
          break;
        case 'vip': //会员卡
          if (app.login()) {
            wx.navigateTo({
              url: '/my/vipCard/vipCard',
            })
          }
          break;
        case 'type': //分类
          wx.switchTab({
            url: '/pages/classify/classify',
          })
          break;
        case 'redPacket': // 口令红包
          wx.navigateTo({
            url: '/pages/passwordRedPacket/index',
          })
          break;
      }
    } else if (item.type == 2) { //分类
      wx.navigateTo({
        url: `/pages/searchGoods/searchGoods?goodsClassifyId=${item.name}`
      })
    }
  },
  /**
   * 获取导航
   */
  navAttr() {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          'navAttr.windowWidth': res.windowWidth
        })
      }
    })
    wx.createSelectorQuery().selectAll('.nav-indicator-con').boundingClientRect(rect => {
      this.setData({
        'navAttr.indicatorWidth': rect[0].width
      })
    }).exec()
  },
  /**
   * 导航
   */
  navScroll(e) {
    this.navAttr()
    this.setData({
      navScroll: e.detail
    })
  },
  /**
   * 头条
   */
  onHotSpot() {
    wx.navigateTo({
      url: '/pages/hotSpots/hotSpots',
    })
  },
  /**
   * 领券
   */
  onGetCoupon(e) {
    if (!app.login()) {
      return
    }
    let item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index
    http.post(app.globalData.getCoupon, {
      couponId: item.couponId,
      goodsClassifyId: item.type == 1 ? item.classifyStr : '',
      storeId: item.type == 0 ? item.classifyStr : '',
    }).then(res => {
      this.data.list[index].memberState = 1
      this.setData({
        list: this.data.list
      })
      app.showSuccessToast('领取成功')
    })
  },
  /**
   * 头条内容
   */
  onHotSpotContent(e) {
    wx.navigateTo({
      url: '/pages/infoDetail/infoDetail?articleId=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 限时抢购
   */
  onLimit() {
    wx.navigateTo({
      url: '/pages/flashSale/flashSale',
    })
  },
  /**
   * 限时抢购商品
   */
  onLimitGood(e) {
    wx.navigateTo({
      url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 限时抢购
   * type 0老版 1新版多店
   */
  indexCurLimitList() {
    http.post(app.globalData.indexCurLimitList, {
      type: 2
    }).then(res => {
      this.setData({
        'dataInfo.limit': res.result, //限时抢购
        limitTime: res.result.time.countDown //倒计时时间
      })
    })
  },
  /**
   * 商品
   */
  onGood(e) {
    wx.navigateTo({
      url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 好物推荐
   */
  onRecommend() {
    wx.navigateTo({
      url: '../recommend/recommend',
    })
  },

  /**
   * 新品上市
   */
  onNew() {
    wx.navigateTo({
      url: '/pages/searchGoods/searchGoods?key=' + '&type=new',
    })
  },
  /**
   * 大牌推荐
   */
  onBrand() {
    wx.navigateTo({
      url: '/pages/brandSelect/brandSelect'
    })
  },
  /**
   * 今日爆款
   */
  onRank() {
    wx.navigateTo({
      url: '/pages/rankGood/rankGood',
    })
  },
  /**
   * 分类
   */
  onClassify(e) {
    let item = e.currentTarget.dataset.item
    console.info(item.adv.type)
    switch (item.adv.type) {
      case 1: //商品
        wx.navigateTo({
          url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + item.adv.content,
          success: () => {
            http.post(app.globalData.indexAdBrowseInc, {
              advId: item.advId
            }).then(res => {})
          }
        })
        break;
      case 3: //店铺
        if (this.data.configSwitch.versionInfo.oneMore == 1) {
          wx.navigateTo({
            url: '/nearbyShops/shopDetail/shopDetail?storeId=' + item.adv.content,
            success: () => {
              http.post(app.globalData.indexAdBrowseInc, {
                advId: item.advId
              }).then(res => {})
            }
          })
        } else {
          
          wx.navigateTo({
            url: '/pages/searchGoods/searchGoods?goodsClassifyId=' + item.goodsClassifyId,
            success: () => {
              if (e.currentTarget.dataset.adv == 1) {
                http.post(app.globalData.indexAdBrowseInc, {
                  advId: item.advId
                }).then(res => {})
              }
            }
          })
        }
        break;
    }
  },
  /**
   * 加入购物车
   */
  addCart(e) {
    if (!app.login()) {
      return
    }
    let item = e.currentTarget.dataset.item
    item.addCartType = 2
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
        goodsAttr: '',
      }).then(res => {
        event.emit('refreshCart')
        event.emit('refreshCartNumber')
        app.showSuccessToast('添加购物车成功')
      })
    } else {
      this.setData({
        info: item
      })
      this.selectComponent("#buy_board").show()
    }
  },
  /**
   * 打开新人礼包
   */
  onNewGift() {
    this.closeExclusive()
    wx.navigateTo({
      url: '/pages/newGift/newGift'
    })
  },

  /**
   * 关闭新人礼包
   */
  closeExclusive() {
    this.setData({
      'dataInfo.set.popupAdvStatus': 0
    })
  },
  nav() {
    const query = wx.createSelectorQuery()
    query.selectViewport().scrollOffset((res) => {
      this.setData({
        scrollTop: res.scrollTop
      })
    })
    query.exec()
  },
  onLabel(e) {
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: `/nearbyShops/goodDetail/goodDetail?goodsId=${e.currentTarget.dataset.goodsId}&label=${e.currentTarget.dataset.id}`,
    })
  }

})