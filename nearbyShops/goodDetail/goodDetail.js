const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk = new QQMapWX({
  key: app.globalData.MapKey
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0, //商品详情 0商品 1详情 2评价
    goodsId: '', //商品id
    shopTab: 1, //店铺推荐 排行榜
    buyType: 1, //选择属性1 立即购买2
    orderType: 1, //商品类型 1普通线上 2拼团 3砍价 4限时抢购
    info: {
      webContent: '' //商品详情图
    },
    groupInterval: {}, //拼团列表计时器
    collageInterval: {}, //滚动定时器
    bargainInterval: {}, //砍价倒计时
    limitInterval: {}, //限时抢购倒计时
    discount: '',
    qrCodeFile: '',
    supId: null,
    //----
    currentBanner: 1, //商品轮播下标
    preIndex: 0,
    isVideoPlay: 0,
    //--------
    //评价
    evaluateCurrentTab: 0, //评价按钮下标
    evaluatePage: 1, //评价页数
    evaluateTotal: 0, //评价数量
    evaluateList: [], //评价列表
    evaluateArr: [{
      title: '全部(0)',
      type: 0,
    }, {
      title: '最新',
      type: 1,
    }, {
      title: '好评',
      type: 2,
    }, {
      title: '中评',
      type: 3,
    }, {
      title: '差评',
      type: 4,
    }, {
      title: '有图',
      type: 5,
    }, {
      title: '视频',
      type: 6,
    }], //评价按钮
    bannerContner: [{
      title: '视频',
      id: 0
    }, {
      title: '图片',
      id: 1
    }],
    bannerType: 1,
    tagBindGoodsId: '' //标签id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //上级代言id
    if (options.supId) {
      app.globalData.supId = options.supId
      this.setData({
        supId: options.supId,
        goodsId: options.goodsId
      })
      if (app.globalData.memberId != '') {
        this.distributionBindDistribution(options.supId)
      }
    }
    if (options.label) {
      this.setData({
        tagBindGoodsId: options.label
      })
    }
    if (options.scene) {
      let obj = http.scene(options.scene)
      //上级代言id
      if (obj.supId) {
        app.globalData.supId = obj.supId
        if (app.globalData.memberId != '') {
          this.distributionBindDistribution(obj.supId)
        }
        this.setData({
          supId: options.supId
        })
      }
      this.setData({
        goodsId: obj.goods
      })
    } else {
      this.setData({
        goodsId: options.goodsId,
        supId: app.globalData.supId
      })
    }
    app.appDIY(() => {}, this)
    this.getSystemInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    setTimeout(() => {
      this.getEvaluateList()
    }, 500)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDistributionData()
    this.location()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.groupInterval)
    clearInterval(this.data.collageInterval)
    clearInterval(this.data.bargainInterval)
    clearInterval(this.data.limitInterval)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.groupInterval)
    clearInterval(this.data.collageInterval)
    clearInterval(this.data.bargainInterval)
    clearInterval(this.data.limitInterval)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let supId = null
    if (this.data.shareType == 'distribution') {
      supId = `&supId=${app.globalData.distribution.cur.distributionId}`
    } else {
      supId = ''
    }
    if (res.from === 'button') {
      http.post(app.globalData.notify, {}).then(res => {})
    }
    return {
      title: this.data.info.goodsName,
      path: '/nearbyShops/goodDetail/goodDetail?goodsId=' + this.data.goodsId + supId
    }
  },

  /**
   * 商品详情屏幕切换 0商品 1详情 2评价
   */
  wrapSwiper(e) {
    this.setData({
      currentIndex: e.detail.current
    })
    let title = null
    wx.nextTick(() => {
      if (e.detail.current == 0) {
        title = '商品'
      } else if (e.detail.current == 1) {
        title = '详情'
      } else if (e.detail.current == 2) {
        title = '评价'
      }
      wx.setNavigationBarTitle({
        title: title,
      })
    })
  },

  /**
   * 获取数据
   * orderType: 商品类型 1普通 2拼团 3砍价 4限时抢购
   */
  getData() {
    http.post(app.globalData.goodsView, {
      goodsId: this.data.goodsId,
      tagBindGoodsId: this.data.tagBindGoodsId
    }).then(res => {
      this.data.info = res.result
      if (res.result.video != null && res.result.video != '') {
        let oVideo = {
          content: res.result.video,
          videoSnapshot: res.result.videoSnapshot
        }
        wx.nextTick(() => {
          this.setData({
            videoFile: oVideo,
            bannerType: 0
          })
        })
      }
      this.setData({
        qrCodeFile: res.appletGoodsCodeFile,
        qrCodeFileDistribution: res.appletDistributionCodeFile,
        info: res.result,
        discount: res.discount == null ? 100 : res.discount,
        collageNum: res.result.groupList.length == 1 ? 1 : 2
      })
      wx.setNavigationBarTitle({
        title: res.result.goodsName,
      })
      clearInterval(this.data.groupInterval)
      //团购推荐倒计时
      if (this.data.info.isGroup == 1 && this.data.info.groupList.length != 0) {
        this.calGroupCount()
        this.data.groupInterval = setInterval(() => {
          this.calGroupCount()
        }, 1000)
      }
      clearInterval(this.data.collageInterval)
      if (this.data.info.isGroup == 1) {
        this.setData({
          orderType: 2
        })
        this.data.collageInterval = setInterval(() => {
          this.getCollageData()
        }, 300000)
        this.getCollageData()
      }

      clearInterval(this.data.bargainInterval)
      //砍价
      if (this.data.info.isBargain == 1) {
        this.setData({
          orderType: 3
        })
        this.calBargainCount(this.data.info.continueTime)
        this.data.bargainInterval = setInterval(() => {
          this.calBargainCount(this.data.info.continueTime)
        }, 1000)
      }

      clearInterval(this.data.limitInterval)
      //限时抢购
      if (this.data.info.isLimit == 1) {
        this.setData({
          orderType: 4
        })
        this.calBargainCount(this.data.info.continueTime)
        this.data.limitInterval = setInterval(() => {
          this.calBargainCount(this.data.info.continueTime)
        }, 1000)
      }
    })
  },

  /**
   * 防止页面卡死
   */
  changeGoodsSwip(detail) {
    if (detail.detail.source == "touch") {
      //当页面卡死的时候，current的值会变成0 
      if (detail.detail.current == 0) {
        //有时候这算是正常情况，所以暂定连续出现3次就是卡了
        let swiperError = this.data.swiperError
        swiperError += 1
        this.setData({
          swiperError: swiperError
        })
        if (swiperError >= 3) { //在开关被触发3次以上
          // console.error(this.data.swiperError)
          this.setData({
            currentIndex: this.data.preIndex
          }); //，重置current为正确索引
          this.setData({
            swiperError: 0
          })
        }
      } else { //正常轮播时，记录正确页码索引
        this.setData({
          preIndex: detail.detail.current
        });
        //将开关重置为0
        this.setData({
          swiperError: 0
        })
      }
    }
  },

  /**
   * 轮播banner
   */
  banner() {
    if (this.data.info.video != null && this.data.info.video != '') {
      let obj = {
        content: this.data.info.video,
        videoSnapshot: this.data.info.videoSnapshot
      }
    }
    wx.nextTick(() => {
      this.setData({
        videoFile: obj
      })
    })
  },

  onBannerType(e) {
    this.setData({
      bannerType: e.currentTarget.dataset.id
    })
    console.log(e)
  },

  /**
   * 轮播图滚动
   */
  bannerChange(e) {
    this.setData({
      currentBanner: e.detail.current + 1,
      current: e.detail.current
    })
    if (e.detail.current = 1) {
      this.setData({
        isPlay: true
      })
    }
  },
  /**
   * 评价选项按钮
   */
  onEvaluateType(e) {
    let item = e.currentTarget.dataset
    this.setData({
      evaluateCurrentTab: item.type
    })
    this.data.evaluatePage = 1
    this.getEvaluateList()
  },

  /**
   * 获取评价数据
   */
  getEvaluateList() {
    let starLevel = ''
    if (this.data.evaluateCurrentTab == 2) {
      starLevel = "good"
    } else if (this.data.evaluateCurrentTab == 3) {
      starLevel = "medium"
    } else if (this.data.evaluateCurrentTab == 4) {
      starLevel = "negative"
    }
    http.post(app.globalData.evaluateList, {
      goodsId: this.data.goodsId,
      newest: this.data.evaluateCurrentTab == 1 ? '1' : '',
      file: this.data.evaluateCurrentTab == 5 ? '1' : '',
      video: this.data.evaluateCurrentTab == 6 ? '1' : '',
      starLevel: starLevel,
      page: this.data.evaluatePage
    }).then(res => {
      if (this.data.evaluatePage == 1) {
        let evaluateArr = this.data.evaluateArr.map(val => {
          switch (val.type) {
            case 0:
              val.title = `全部(${res.statistics.all})`
              break;
            case 2:
              val.title = `好评(${res.statistics.good})`
              break;
            case 3:
              val.title = `中评(${res.statistics.medium})`
              break;
            case 4:
              val.title = `差评(${res.statistics.negative})`
              break;
            case 5:
              val.title = `有图(${res.statistics.file})`
              break;
            case 6:
              val.title = `视频(${res.statistics.videos})`
              break;
          }
          return val
        })
        res.result.data.forEach((item) => {
          if (item.multipleFile) {
            item.multipleFile = item.multipleFile.split(',')
          }
        });
        this.setData({
          evaluateArr: evaluateArr,
          evaluateTotal: res.result.total,
          evaluateList: res.result.data
        })
      } else {
        this.setData({
          evaluateList: [...this.data.evaluateList, ...res.result.data]
        })
      }
    })
  },

  /**
   * 评价加载更多
   */
  evaluateLoadMore(e) {
    if (this.data.evaluateTotal > this.data.evaluateList.length) {
      this.data.evaluatePage++;
      this.getEvaluateList()
    }
  },






  share(e) {
    this.setData({
      shareType: e.currentTarget.dataset.type == 'distribution' ? e.currentTarget.dataset.type : null
    })
    this.selectComponent("#share").fadeIn()
    this.selectComponent("#share").shareBtn()
  },

  shareCircle(e) {
    this.drawPoster(e.detail.text)
  },

  drawPoster(e) {
    let price
    if (this.data.info.isBargain == 1) {
      price = this.data.info.cutPrice
    } else if (this.data.info.isGroup == 1) {
      price = this.data.info.groupPrice
    } else if (this.data.info.isLimit == 1) {
      price = this.data.info.timeLimitPrice
    } else {
      price = this.data.info.shopPrice
    }
    let poster
    if (this.data.info.isDistribution == 1 && this.data.shareType == 'distribution') {
      let distributionGain;
      if (this.data.isLimit == 1) {
        //限时
        distributionGain = this.data.info.distribution.limitMaxBrokerage
      } else if (this.data.isGroup == 1) {
        //拼团
        distributionGain = this.data.info.distribution.groupMaxBrokerage
      } else if (this.data.isBargain == 1) {
        //砍价
        distributionGain = this.data.info.distribution.cutMaxBrokerage
      } else {
        distributionGain = this.data.info.distribution.shopMaxBrokerage
      }
      poster = {
        text: e,
        file: encodeURIComponent(this.data.info.file),
        price: price,
        name: this.data.info.goodsName,
        orderType: this.data.orderType,
        shopLogo: app.globalData.isShops == 0 ? encodeURIComponent(this.data.info.logo) : encodeURIComponent(this.data.configSwitch.appInfo.logo),
        groupNum: this.data.info.groupNum,
        salesVolume: this.data.info.salesVolume,
        limitNumber: this.data.info.limitNumber ? this.data.info.limitNumber : 0,
        qrCode: this.data.qrCodeFileDistribution,
        distributionGain: distributionGain
      }
    } else {
      poster = {
        text: e,
        file: encodeURIComponent(this.data.info.file),
        price: price,
        name: this.data.info.goodsName,
        orderType: this.data.orderType,
        shopLogo: app.globalData.isShops == 0 ? encodeURIComponent(this.data.info.logo) : encodeURIComponent(this.data.configSwitch.appInfo.logo),
        groupNum: this.data.info.groupNum,
        salesVolume: this.data.info.salesVolume,
        limitNumber: this.data.info.limitNumber ? this.data.info.limitNumber : 0,
        qrCode: this.data.qrCodeFile
      }
    }
    this.selectComponent("#poster").download(poster)
  },


  /**
   * 返回顶部上升动画
   */
  riseAnimation() {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    animation.translateY('-180px').step()
    this.setData({
      animationTop: animation.export()
    })
  },

  /**
   * 返回顶部下降动画
   */
  declineAnimation() {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    animation.translateY(200 / 1334 * wx.getSystemInfoSync().screenHeight).step()
    this.setData({
      animationTop: animation.export()
    })
  },


  /**
   * 
   */
  distributionAnimationUp() {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    animation.translateY('-84px').step()
    this.setData({
      distributionAnimation: animation.export()
    })
  },

  /**
   * 
   */
  distributionAnimationDown() {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    animation.translateY('0').step()
    this.setData({
      distributionAnimation: animation.export()
    })
  },

  /**
   * 页面滑动
   */
  scroll(e) {
    if (e.detail.scrollTop > 100) {
      this.riseAnimation()
      this.distributionAnimationUp()
    } else {
      this.declineAnimation()
      this.distributionAnimationDown()
    }
  },

  /**
   * 回到顶部
   */
  onBackTop() {
    if (this.data.currentIndex == 0) {
      this.setData({
        currentScrollTop0: 0
      })
    } else if (this.data.currentIndex == 1) {
      this.setData({
        currentScrollTop1: 0
      })
    } else if (this.data.currentIndex == 2) {
      this.setData({
        currentScrollTop2: 0
      })
    }
  },
  /**
   * 商品参数
   */
  onParameter() {
    this.setData({
      parameterBoard: true
    })
  },
  onCoupon() {
    if (app.login()) {
      this.selectComponent("#receive_coupon").getCouponList(this.data.info.storeId, this.data.info.goodsClassifyId)
    }
  },

  /**
   *  促销
   */
  onSalePromotion() {
    this.setData({
      saleBoard: true
    })
  },

  /**
   * 配送说明
   */
  onDelivery() {
    this.selectComponent("#delivery_info").showAnimation()
  },
  /**
   * 配送说明
   */
  onServe() {
    this.selectComponent("#brand_label").showAnimation()
  },

  /**
   * 评价
   */
  onEvaluate() {
    this.setData({
      currentIndex: 2
    })
    // wx.navigateTo({
    //   url: '../evaluate/evaluate?goodsId=' + this.data.goodsId,
    // })
  },

  /**
   * 店铺推荐
   */
  onShopRecommend() {
    this.setData({
      shopTab: 1
    })
  },

  /**
   * 排行榜
   */
  onShopRank() {
    this.setData({
      shopTab: 2
    })
  },

  /**
   * 选择属性
   */
  chooseAttribute() {
    if (!app.login()) {
      return
    }
    if (this.data.info.isBargain == 1 || this.data.info.isGroup == 1 || this.data.info.isLimit == 1) {
      this.setData({
        buyType: 2,
      })
    } else {
      this.setData({
        buyType: 1,
      })
    }
    let obj = {
      orderType: this.data.orderType
    }
    this.selectComponent("#buy_board").show(obj)
  },

  /**
   * 加入购物车
   */
  addCart() {
    if (!app.login()) {
      return
    }
    if (this.data.info.isOwnShop == 1) {
      app.showToast('您的商品，留给别人购买')
      return
    }
    http.encPost(app.globalData.cartCreate, {
      storeId: this.data.info.storeId,
      goodsId: this.data.info.goodsId,
      goodsName: this.data.info.goodsName,
      file: this.data.info.cartFile,
      number: 1,
      productsId: '',
      attr: '',
      goodsAttr: this.data.info.attr.length != 0 ? this.data.attr : '',
    }).then(res => {
      event.emit('refreshCart')
      event.emit('refreshCartNumber')
      event.emit('shopAddCart')
      wx.showToast({
        icon: 'none',
        title: res.message
      })
    })
  },

  /**
   * 显示购买界面
   */
  buyNow(e) {
    if (!app.login()) {
      return
    }
    if (this.data.info.isOwnShop == 1) {
      app.showToast('您的商品，留给别人购买')
      return
    }
    if (e.currentTarget.dataset.group == 1) {
      this.setData({
        groupBuy: true,
      })
    } else if (e.currentTarget.dataset.group == 0) {
      this.setData({
        groupBuy: false,
        'info.isOriginal': 1
      })
    } else {
      this.setData({
        groupBuy: false
      })
    }
    this.setData({
      buyType: 2,
    })
    let obj = {
      orderType: this.data.orderType == 2 && !this.data.groupBuy ? 1 : this.data.orderType
    }
    this.selectComponent("#buy_board").show(obj)
  },


  /**
   * 进入店铺
   */
  goShop() {
    wx.navigateTo({
      url: '/nearbyShops/shopDetail/shopDetail?storeId=' + this.data.info.storeId,
    })
  },
  /**
   * 排行榜
   */
  goRanking() {
    wx.navigateTo({
      url: '/pages/rankGood/rankGood?firstGoodsClassifyId=' + this.data.info.firstGoodsClassifyId,
    })
  },
  /**
   * 去首页
   */
  onHome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  /**
   * 查看分类
   */
  goClassify() {
    wx.navigateTo({
      url: '/nearbyShops/shopClassify/shopClassify?storeId=' + this.data.info.storeId,
    })
  },

  /**
   * 参团
   */
  onCollage(e) {
    wx.navigateTo({
      url: '/pages/collageDetail/collageDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 砍价玩法
   */
  onBargainRule() {
    this.setData({
      bargainRule: true
    })
  },

  /**
   * 获取拼团信息
   */
  getCollageData() {
    if (this.data.info.isGroup == 1) {
      http.post(app.globalData.groupMsgList, {
        goodsId: this.data.goodsId
      }).then(res => {
        this.setData({
          collageInfo: res.result
        })
      })
    }
  },

  /**
   * 
   */
  onCollageMessage(e) {
    let item = e.currentTarget.dataset.item
    if (item.status != 2) {
      wx.navigateTo({
        url: '/pages/collageDetail/collageDetail?id=' + item.groupActivityId,
      })
    }
  },

  /**
   * 计算团购列表倒计时
   */
  calGroupCount() {
    let groupCount = this.data.info.groupList
    for (let i = 0, len = groupCount.length; i < len; i++) {
      let second = groupCount[i].continueTime;
      if (second == 0) {
        this.getData()
        return
      }
      groupCount[i]['hour'] = Math.floor(second / 3600) < 10 ? '0' + Math.floor(second / 3600) : Math.floor(second / 3600)
      groupCount[i]['min'] = Math.floor(second / 60 % 60) < 10 ? '0' + Math.floor(second / 60 % 60) : Math.floor(second / 60 % 60)
      groupCount[i]['sec'] = Math.floor(second % 60) < 10 ? '0' + Math.floor(second % 60) : Math.floor(second % 60)
      groupCount[i].continueTime--;
    }
    this.setData({
      groupCount: groupCount
    })
  },

  /**
   * 计算砍价倒计时
   */
  calBargainCount(second) {
    if (second < 0) {
      this.setData({
        orderType: 1
      })
      return
    }
    if (second == 0) {
      this.getData()
      return
    }
    let bargainTime = {}
    bargainTime['day'] = parseInt((second) / (24 * 3600))
    bargainTime['hour'] = Math.floor((second) % (24 * 3600) / 3600) < 10 ? '0' + Math.floor((second) % (24 * 3600) / 3600) : Math.floor((second) % (24 * 3600) / 3600)
    bargainTime['min'] = Math.floor(second / 60 % 60) < 10 ? '0' + Math.floor(second / 60 % 60) : Math.floor(second / 60 % 60)
    bargainTime['sec'] = Math.floor(second % 60) < 10 ? '0' + Math.floor(second % 60) : Math.floor(second % 60)
    this.data.info.continueTime--;
    this.setData({
      bargainTime: bargainTime
    })
  },

  /**
   * 拼团玩法
   */
  onCollageRule() {
    wx.navigateTo({
      url: '/my/webView/webView?id=20',
    })
  },
  /**
   * 商品详情
   */
  onGood(e) {
    wx.navigateTo({
      url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 收藏,取消收藏
   */
  onCollect() {
    let url = ''
    if (!app.login()) {
      return
    }
    if (this.data.info.collect) {
      url = app.globalData.collectDelete
    } else {
      url = app.globalData.collectGoods
    }
    http.post(url, {
      goodsId: this.data.goodsId,
      storeId: this.data.info.storeId,
    }).then(res => {
      const { collect } = this.data.info
      this.data.info.collect = collect ? 0 : 1
      this.setData({
        info: this.data.info
      })
      wx.showToast({
        title: collect ? '取消收藏成功' : '收藏成功',
      });
    })
  },

  /**
   * 降价通知
   */
  onNotification() {
    if (app.login()) {
      let price = this.data.info.shopPrice
      wx.navigateTo({
        url: '/nearbyShops/priceNotification/priceNotification?goodsId=' + this.data.goodsId + '&price=' + price + '&storeId=' + this.data.info.storeId,
      })
    }
  },

  /**
   * 成为代言人
   */
  goFx() {
    if (app.login()) {
      wx.navigateTo({
        url: '/my/fxCwdy/fxCwdy',
      })
    }
  },

  /**
   * 获取代言信息
   */
  getDistributionData() {
    http.post(app.globalData.distributionShareInfo, {
      distributionId: app.globalData.supId == '' ? 0 : app.globalData.supId
    }).then(res => {
      try {
        this.setData({
          distribution: res.data
        })
        app.globalData.distribution = res.data
        let memberInfo = wx.getStorageSync('memberInfo')
        if (memberInfo.distributionRecord == null) {
          let distributionRecord = {
            distributionId: res.data.cur == null ? null : res.data.cur.distributionId,
            auditStatus: res.data.cur == null ? null : res.data.cur.auditStatus
          }
          memberInfo.distributionRecord = distributionRecord
        } else {
          memberInfo.distributionRecord.distributionId = res.data.cur == null ? null : res.data.cur.distributionId
          memberInfo.distributionRecord.auditStatus = res.data.cur == null ? null : res.data.cur.auditStatus
        }
        wx.setStorageSync('memberInfo', memberInfo)
      } catch (e) {}
    })
  },
  /**
   * 客服
   */
  service() {
    if (app.login()) {
      let price = 0
      if (this.data.info.isBargain == 1) {
        price = this.data.info.cutPrice
      } else if (this.data.info.isGroup == 1) {
        price = this.data.info.groupPrice
      } else if (this.data.info.isLimit == 1) {
        price = this.data.info.timeLimitPrice
      } else {
        price = this.data.info.shopPrice
      }
      let data = {
        file: encodeURIComponent(this.data.info.file),
        goodsName: encodeURIComponent(this.data.info.goodsName),
        goodsId: this.data.goodsId,
        price: price
      }
      let serviceInfo = {
        storeTitle: encodeURIComponent(this.data.info.storeName),
        formType: 'goods',
        detail: data,
        TARGETID: this.data.info.storeId,
        DIVERSIONID: '1001'
      }
      wx.navigateTo({
        url: '/my/service/service?serviceInfo=' + JSON.stringify(serviceInfo),
      })
    }
  },
  /**
   * 绑定代言关系
   */
  distributionBindDistribution(superior) {
    http.post(app.globalData.distributionBindDistribution, {
      superior,
    })
  },
  /**
   * 定位
   */
  location() {
    this.setData({
      configSwitch: app.globalData.configSwitch
    })
    qqmapsdk.reverseGeocoder({
      success: data => {
        app.globalData.address = {
          province: data.result.ad_info.province,
          city: data.result.ad_info.city,
          area: data.result.ad_info.district,
        }
        app.globalData.lat = data.result.location.lat
        app.globalData.lng = data.result.location.lng
      }
    })
    wx.nextTick(() => {
      this.getData()
    })
  },
  /**
   * banner预览
   */
  onPreviewSwiper(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.path,
      urls: this.data.info.multipleFile
    })
  },
  /**
   * 预览
   */
  onPreview(e) {
    let index = e.currentTarget.dataset.index,
      idx = parseInt(e.currentTarget.dataset.idx),
      current = 0
    if (idx == -1 && this.data.evaluateList[index].video != '') {
      current = 0
    } else if (this.data.evaluateList[index].video != '') {
      current = idx + 1
    } else {
      current = idx
    }
    let multipleFile = this.data.evaluateList[index].multipleFile.map((val) => {
      return val = encodeURIComponent(val)
    })

    let list = {
      multipleFile: multipleFile,
      video: encodeURIComponent(this.data.evaluateList[index].video),
      current: current
    }
    wx.navigateTo({
      url: '/nearbyShops/preview/preview?info=' + JSON.stringify(list),
    })
  },

  /**
   * 获取系统信息
   */
  getSystemInfo() {
    wx.getSystemInfo({
      success: res => {
        console.log(res.system)
        let system = res.system
        this.setData({
          system: system.includes('iOS')
        })
      }
    })
  },
  /**
   * 拨打电话
   */
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.info.storePhone,
    })
  },
  /**
   * 播放视频
   */
  videoPlay() {
    this.setData({
      isVideoPlay: 1
    })
    wx.createVideoContext('video').requestFullScreen()
    wx.createVideoContext('video').play()
  },
  onLabel(e) {
    http.post(app.globalData.goodsTagClickLog, {
      tagBindGoodsId: e.currentTarget.dataset.id
    }).then(res => {})
  }
})