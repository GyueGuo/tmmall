const app = getApp();
const http = require('../../utils/http.js');
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
    goods_id: '', //商品id
    shop_tab: 1, //店铺推荐 排行榜
    buy_type: 1, //选择属性1 立即购买2
    order_type: 1, //商品类型 1普通线上 2拼团 3砍价 4限时抢购
    info: {
      web_content: '' //商品详情图
    },
    group_interval: {}, //拼团列表计时器
    collage_interval: {}, //滚动定时器
    bargain_interval: {}, //砍价倒计时
    limit_interval: {}, //限时抢购倒计时
    discount: '',
    qr_code_file: '',
    sup_id: null,
    //----
    current_banner: 1, //商品轮播下标
    preIndex: 0,
    isVideoPlay: 0,
    //--------
    //评价
    evaluate_current_tab: 0, //评价按钮下标
    evaluate_page: 1, //评价页数
    evaluate_total: 0, //评价数量
    evaluate_list: [], //评价列表
    evaluate_arr: [{
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
    tag_bind_goods_id: '' //标签id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //上级代言id
    if (options.sup_id) {
      app.globalData.sup_id = options.sup_id
      this.setData({
        sup_id: options.sup_id,
        goods_id: options.goods_id
      })
      if (app.globalData.member_id != '') {
        this.distribution_bindDistribution(options.sup_id)
      }
    }
    if (options.label) {
      this.setData({
        tag_bind_goods_id: options.label
      })
    }
    if (options.scene) {
      let obj = http.scene(options.scene)
      //上级代言id
      if (obj.sup_id) {
        app.globalData.sup_id = obj.sup_id
        if (app.globalData.member_id != '') {
          this.distribution_bindDistribution(obj.sup_id)
        }
        this.setData({
          sup_id: options.sup_id
        })
      }
      this.setData({
        goods_id: obj.goods
      })
    } else {
      this.setData({
        goods_id: options.goods_id,
        sup_id: app.globalData.sup_id
      })
    }
    app.app_DIY(() => {}, this)
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
    clearInterval(this.data.group_interval)
    clearInterval(this.data.collage_interval)
    clearInterval(this.data.bargain_interval)
    clearInterval(this.data.limit_interval)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.group_interval)
    clearInterval(this.data.collage_interval)
    clearInterval(this.data.bargain_interval)
    clearInterval(this.data.limit_interval)
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
    let sup_id = null
    if (this.data.share_type == 'distribution') {
      sup_id = `&sup_id=${app.globalData.distribution.cur.distribution_id}`
    } else {
      sup_id = ''
    }
    if (res.from === 'button') {
      http.post(app.globalData.notify, {}).then(res => {})
    } else {}
    return {
      title: this.data.info.goods_name,
      path: '/nearby_shops/good_detail/good_detail?goods_id=' + this.data.goods_id + sup_id
    }
  },

  /**
   * 商品详情屏幕切换 0商品 1详情 2评价
   */
  wrap_swiper(e) {
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
   * order_type: 商品类型 1普通 2拼团 3砍价 4限时抢购
   */
  getData() {
    http.post(app.globalData.goods_view, {
      goodsId: this.data.goods_id,
      tagBindGoodsId: this.data.tag_bind_goods_id
    }).then(res => {
      this.data.info = res.result
      if (res.result.video != null && res.result.video != '') {
        let oVideo = {
          content: res.result.video,
          video_snapshot: res.result.videoSnapshot
        }
        wx.nextTick(() => {
          this.setData({
            video_file: oVideo,
            bannerType: 0
          })
        })
      }
      this.setData({
        qr_code_file: res.appletGoodsCodeFile,
        qr_code_file_distribution: res.appletDistributionCodeFile,
        info: res.result,
        discount: res.discount == null ? 100 : res.discount,
        collage_num: res.result.groupList.length == 1 ? 1 : 2
      })
      wx.setNavigationBarTitle({
        title: res.result.goodsName,
      })
      // wx.setNavigationBarTitle({
      //   title: res.result.goods_name,
      // })
      clearInterval(this.data.group_interval)
      //团购推荐倒计时
      if (this.data.info.is_group == 1 && this.data.info.group_list.length != 0) {
        this.calGroupCount()
        this.data.group_interval = setInterval(() => {
          this.calGroupCount()
        }, 1000)
      }
      clearInterval(this.data.collage_interval)
      if (this.data.info.is_group == 1) {
        this.setData({
          order_type: 2
        })
        this.data.collage_interval = setInterval(() => {
          this.getCollageData()
        }, 300000)
        this.getCollageData()
      }

      clearInterval(this.data.bargain_interval)
      //砍价
      if (this.data.info.is_bargain == 1) {
        this.setData({
          order_type: 3
        })
        this.calBargainCount(this.data.info.continue_time)
        this.data.bargain_interval = setInterval(() => {
          this.calBargainCount(this.data.info.continue_time)
        }, 1000)
      }

      clearInterval(this.data.limit_interval)
      //限时抢购
      if (this.data.info.is_limit == 1) {
        this.setData({
          order_type: 4
        })
        this.calBargainCount(this.data.info.continue_time)
        this.data.limit_interval = setInterval(() => {
          this.calBargainCount(this.data.info.continue_time)
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
        video_snapshot: this.data.info.video_snapshot
      }
    }
    wx.nextTick(() => {
      this.setData({
        video_file: obj
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
      current_banner: e.detail.current + 1,
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
      evaluate_current_tab: item.type
    })
    this.data.evaluate_page = 1
    this.getEvaluateList()
  },

  /**
   * 获取评价数据
   */
  getEvaluateList() {
    let star_level = ''
    if (this.data.evaluate_current_tab == 2) {
      star_level = "good"
    } else if (this.data.evaluate_current_tab == 3) {
      star_level = "medium"
    } else if (this.data.evaluate_current_tab == 4) {
      star_level = "negative"
    }
    http.post(app.globalData.evaluate_list, {
      goodsId: this.data.goods_id,
      newest: this.data.evaluate_current_tab == 1 ? '1' : '',
      file: this.data.evaluate_current_tab == 5 ? '1' : '',
      video: this.data.evaluate_current_tab == 6 ? '1' : '',
      starLevel: star_level,
      page: this.data.evaluate_page
    }).then(res => {
      if (this.data.evaluate_page == 1) {
        let evaluate_arr = this.data.evaluate_arr.map(val => {
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
              val.title = `视频(${res.statistics.video})`
              break;
          }
          return val
        })
        this.setData({
          evaluate_arr: evaluate_arr,
          evaluate_total: res.result.total,
          evaluate_list: res.result.data
        })
      } else {
        this.setData({
          evaluate_list: [...this.data.evaluate_list, ...res.result.data]
        })
      }
    })
  },

  /**
   * 评价加载更多
   */
  evaluate_loadMore(e) {
    if (this.data.evaluate_total > this.data.evaluate_list.length) {
      this.data.evaluate_page++;
      this.getEvaluateList()
    }
  },






  share(e) {
    this.setData({
      share_type: e.currentTarget.dataset.type == 'distribution' ? e.currentTarget.dataset.type : null
    })
    this.selectComponent("#share").fadeIn()
    this.selectComponent("#share").share_btn()
  },

  shareCircle(e) {
    this.drawPoster(e.detail.text)
  },

  drawPoster(e) {
    let price
    if (this.data.info.is_bargain == 1) {
      price = this.data.info.cut_price
    } else if (this.data.info.is_group == 1) {
      price = this.data.info.group_price
    } else if (this.data.info.is_limit == 1) {
      price = this.data.info.time_limit_price
    } else {
      price = this.data.info.shop_price
    }
    let poster
    if (this.data.info.is_distribution == 1 && this.data.share_type == 'distribution') {
      let distribution_gain;
      if (this.data.is_limit == 1) {
        //限时
        distribution_gain = this.data.info.distribution.limit_max_brokerage
      } else if (this.data.is_group == 1) {
        //拼团
        distribution_gain = this.data.info.distribution.group_max_brokerage
      } else if (this.data.is_bargain == 1) {
        //砍价
        distribution_gain = this.data.info.distribution.cut_max_brokerage
      } else {
        distribution_gain = this.data.info.distribution.shop_max_brokerage
      }
      poster = {
        text: e,
        file: encodeURIComponent(this.data.info.file),
        price: price,
        name: this.data.info.goods_name,
        order_type: this.data.order_type,
        // is_bargain: this.data.info.is_bargain,
        // is_group: this.data.info.is_group,
        // is_limit: this.data.info.is_limit,
        shop_logo: app.globalData.isShops == 0 ? encodeURIComponent(this.data.info.logo) : encodeURIComponent(this.data.configSwitch.app_info.logo),
        group_num: this.data.info.group_num,
        sales_volume: this.data.info.sales_volume,
        limit_number: this.data.info.limit_number ? this.data.info.limit_number : 0,
        qrCode: this.data.qr_code_file_distribution,
        distribution_gain: distribution_gain
      }
    } else {
      poster = {
        text: e,
        file: encodeURIComponent(this.data.info.file),
        price: price,
        name: this.data.info.goods_name,
        order_type: this.data.order_type,
        // is_bargain: this.data.info.is_bargain,
        // is_group: this.data.info.is_group,
        // is_limit: this.data.info.is_limit,
        shop_logo: app.globalData.isShops == 0 ? encodeURIComponent(this.data.info.logo) : encodeURIComponent(this.data.configSwitch.app_info.logo),
        group_num: this.data.info.group_num,
        sales_volume: this.data.info.sales_volume,
        limit_number: this.data.info.limit_number ? this.data.info.limit_number : 0,
        qrCode: this.data.qr_code_file
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
      animation_top: animation.export()
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
      animation_top: animation.export()
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
      distribution_animation: animation.export()
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
      distribution_animation: animation.export()
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
        currentScrollTop_0: 0
      })
    } else if (this.data.currentIndex == 1) {
      this.setData({
        currentScrollTop_1: 0
      })
    } else if (this.data.currentIndex == 2) {
      this.setData({
        currentScrollTop_2: 0
      })
    }
  },
  /**
   * 商品参数
   */
  onParameter() {
    this.setData({
      parameter_board: true
    })
  },

  /**
   * 优惠券
   */
  // onCoupon() {
  //   if (app.login()) {
  //     let obj = {
  //       store_id: this.data.info.store_id,
  //       goods_classify_id: this.data.info.goods_classify_id,
  //       goods_id:this.data.goods_id
  //     }
  //     this.selectComponent("#receive_coupon").getCouponList(obj)
  //   }
  // },
  onCoupon() {
    if (app.login()) {
      this.selectComponent("#receive_coupon").getCouponList(this.data.info.store_id, this.data.info.goods_classify_id)
    }
  },

  /**
   *  促销
   */
  onSalePromotion() {
    this.setData({
      sale_board: true
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
    //   url: '../evaluate/evaluate?goods_id=' + this.data.goods_id,
    // })
  },

  /**
   * 店铺推荐
   */
  onShopRecommend() {
    this.setData({
      shop_tab: 1
    })
  },

  /**
   * 排行榜
   */
  onShopRank() {
    this.setData({
      shop_tab: 2
    })
  },

  /**
   * 选择属性
   */
  chooseAttribute() {
    if (!app.login()) {
      return
    }
    if (this.data.info.is_bargain == 1 || this.data.info.is_group == 1 || this.data.info.is_limit == 1) {
      this.setData({
        buy_type: 2,
      })
    } else {
      this.setData({
        buy_type: 1,
      })
    }
    let obj = {
      order_type: this.data.order_type
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
    if (this.data.info.is_own_shop == 1) {
      app.showToast('您的商品，留给别人购买')
      return
    }
    http.encPost(app.globalData.cart_create, {
      storeId: this.data.info.store_id,
      goodsId: this.data.info.goods_id,
      goodsName: this.data.info.goods_name,
      file: this.data.info.cart_file,
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
    if (this.data.info.is_own_shop == 1) {
      app.showToast('您的商品，留给别人购买')
      return
    }
    if (e.currentTarget.dataset.group == 1) {
      this.setData({
        group_buy: true,
      })
    } else if (e.currentTarget.dataset.group == 0) {
      this.setData({
        group_buy: false,
        'info.is_original': 1
      })
    } else {
      this.setData({
        group_buy: false
      })
    }
    this.setData({
      buy_type: 2,
    })
    let obj = {
      order_type: this.data.order_type == 2 && !this.data.group_buy ? 1 : this.data.order_type
    }
    this.selectComponent("#buy_board").show(obj)
  },


  /**
   * 进入店铺
   */
  goShop() {
    wx.navigateTo({
      url: '/nearby_shops/shop_detail/shop_detail?store_id=' + this.data.info.store_id,
    })
  },
  /**
   * 排行榜
   */
  goRanking() {
    wx.navigateTo({
      url: '/pages/rank_good/rank_good?first_goods_classify_id=' + this.data.info.first_goods_classify_id,
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
      url: '/nearby_shops/shop_classify/shop_classify?store_id=' + this.data.info.store_id,
    })
  },

  /**
   * 参团
   */
  onCollage(e) {
    wx.navigateTo({
      url: '/pages/collage_detail/collage_detail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 砍价玩法
   */
  onBargainRule() {
    this.setData({
      bargain_rule: true
    })
  },

  /**
   * 获取拼团信息
   */
  getCollageData() {
    if (this.data.info.is_group == 1) {
      http.post(app.globalData.groupMsgList, {
        goodsId: this.data.goods_id
      }).then(res => {
        this.setData({
          collage_info: res.result
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
        url: '/pages/collage_detail/collage_detail?id=' + item.group_activity_id,
      })
    }
  },

  /**
   * 计算团购列表倒计时
   */
  calGroupCount() {
    let group_count = this.data.info.group_list
    for (let i = 0, len = group_count.length; i < len; i++) {
      let second = group_count[i].continue_time;
      if (second == 0) {
        this.getData()
        return
      }
      group_count[i]['hour'] = Math.floor(second / 3600) < 10 ? '0' + Math.floor(second / 3600) : Math.floor(second / 3600)
      group_count[i]['min'] = Math.floor(second / 60 % 60) < 10 ? '0' + Math.floor(second / 60 % 60) : Math.floor(second / 60 % 60)
      group_count[i]['sec'] = Math.floor(second % 60) < 10 ? '0' + Math.floor(second % 60) : Math.floor(second % 60)
      group_count[i].continue_time--;
    }
    this.setData({
      group_count: group_count
    })
  },

  /**
   * 计算砍价倒计时
   */
  calBargainCount(second) {
    if (second < 0) {
      this.setData({
        order_type: 1
      })
      return
    }
    if (second == 0) {
      this.getData()
      return
    }
    let bargain_time = {}
    bargain_time['day'] = parseInt((second) / (24 * 3600))
    bargain_time['hour'] = Math.floor((second) % (24 * 3600) / 3600) < 10 ? '0' + Math.floor((second) % (24 * 3600) / 3600) : Math.floor((second) % (24 * 3600) / 3600)
    bargain_time['min'] = Math.floor(second / 60 % 60) < 10 ? '0' + Math.floor(second / 60 % 60) : Math.floor(second / 60 % 60)
    bargain_time['sec'] = Math.floor(second % 60) < 10 ? '0' + Math.floor(second % 60) : Math.floor(second % 60)
    this.data.info.continue_time--;
    this.setData({
      bargain_time: bargain_time
    })
  },

  /**
   * 拼团玩法
   */
  onCollageRule() {
    wx.navigateTo({
      url: '/my/web_view/web_view?id=20',
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
   * 收藏,取消收藏
   */
  onCollect() {
    let url = ''
    if (!app.login()) {
      return
    }
    if (this.data.info.collect == null) {
      url = app.globalData.collect_goods
    } else {
      url = app.globalData.collect_delete
    }
    http.post(url, {
      goodsId: this.data.goods_id,
      storeId: this.data.info.store_id,
    }).then(res => {
      this.data.info.collect = this.data.info.collect == null ? '1' : null
      this.setData({
        info: this.data.info
      })
      if (this.data.info.collect != null) {
        wx.showToast({
          title: '收藏成功',
        })
      } else {
        wx.showToast({
          title: '取消收藏成功',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 降价通知
   */
  onNotification() {
    if (app.login()) {
      let price = this.data.info.shop_price
      wx.navigateTo({
        url: '/nearby_shops/price_notification/price_notification?goods_id=' + this.data.goods_id + '&price=' + price + '&store_id=' + this.data.info.store_id,
      })
    }
  },

  /**
   * 成为代言人
   */
  goFx() {
    if (app.login()) {
      wx.navigateTo({
        url: '/my/fx_cwdy/fx_cwdy',
      })
    }
  },

  /**
   * 获取代言信息
   */
  getDistributionData() {
    http.post(app.globalData.distribution_share_info, {
      distributionId: app.globalData.sup_id == '' ? 0 : app.globalData.sup_id
    }).then(res => {
      try {
        this.setData({
          distribution: res.data
        })
        app.globalData.distribution = res.data
        let member_info = wx.getStorageSync('member_info')
        if (member_info.distribution_record == null) {
          let distribution_record = {
            distribution_id: res.data.cur == null ? null : res.data.cur.distribution_id,
            audit_status: res.data.cur == null ? null : res.data.cur.audit_status
          }
          member_info.distribution_record = distribution_record
        } else {
          member_info.distribution_record.distribution_id = res.data.cur == null ? null : res.data.cur.distribution_id
          member_info.distribution_record.audit_status = res.data.cur == null ? null : res.data.cur.audit_status
        }
        wx.setStorageSync('member_info', member_info)
      } catch (e) {}
    })
  },
  /**
   * 客服
   */
  service() {
    let price = 0
    if (this.data.info.is_bargain == 1) {
      price = this.data.info.cut_price
    } else if (this.data.info.is_group == 1) {
      price = this.data.info.group_price
    } else if (this.data.info.is_limit == 1) {
      price = this.data.info.time_limit_price
    } else {
      price = this.data.info.shop_price
    }
    let data = {
      file: encodeURIComponent(this.data.info.file),
      goods_name: encodeURIComponent(this.data.info.goods_name),
      goods_id: this.data.goods_id,
      price: price
    }
    let service_info = {
      store_title: encodeURIComponent(this.data.info.store_name),
      form_type: 'goods',
      detail: data,
      TARGET_ID: this.data.info.store_id,
      DIVERSION_ID: '1001'
    }
    if (app.login()) {
      wx.navigateTo({
        url: '/my/service/service?service_info=' + JSON.stringify(service_info),
      })
    }
  },
  /**
   * 绑定代言关系
   */
  distribution_bindDistribution(superior) {
    http.post(app.globalData.distribution_bindDistribution, {
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
      },
      fail: () => {
        app.showToast('定位失败,请检查网络或定位权限', () => {})
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
    // if (e.currentTarget.dataset.type == 'video') {
    //   let arr = []
    //   arr.push(encodeURIComponent(this.data.video_file.content))
    //   console.log(arr)
    //   wx.previewImage({
    //     current: encodeURIComponent(this.data.video_file.content),
    //     urls: arr
    //   })
    //   return
    // }
    wx.previewImage({
      current: e.currentTarget.dataset.path,
      urls: this.data.info.multiple_file
    })
  },
  /**
   * 预览
   */
  onPreview(e) {
    let index = e.currentTarget.dataset.index,
      idx = parseInt(e.currentTarget.dataset.idx),
      current = 0
    if (idx == -1 && this.data.evaluate_list[index].video != '') {
      current = 0
    } else if (this.data.evaluate_list[index].video != '') {
      current = idx + 1
    } else {
      current = idx
    }
    let multiple_file = this.data.evaluate_list[index].multiple_file.map((val) => {
      return val = encodeURIComponent(val)
    })

    let list = {
      multiple_file: multiple_file,
      video: encodeURIComponent(this.data.evaluate_list[index].video),
      current: current
    }
    wx.navigateTo({
      url: '/nearby_shops/preview/preview?info=' + JSON.stringify(list),
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
      phoneNumber: this.data.info.store_phone,
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
    http.post(app.globalData.goods_tagClickLog, {
      tag_bind_goods_id: e.currentTarget.dataset.id
    }).then(res => {})
  }

})