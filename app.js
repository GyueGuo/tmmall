
var HTTP = 'https://sc.tianmushenyang.cn/';

App({
  onLaunch(data) {
    wx.getSystemInfo({
      success: res => {
        console.log(res)
        if (res.model.search('iPhone X') != -1 || res.model.search('iPhone XS') != -1 || res.model.search('iPhone XS Max') != -1 || res.model.search('iPhone XR') != -1 || res.model.search('unknown') != -1) {
          this.globalData.model.phone = 'iPhone X'
          this.globalData.model.topHeight = 88 + 4
        } else if (res.model.search('iPhone') != -1) {
          this.globalData.model.phone = 'iPhone'
          this.globalData.model.topHeight = 64 + 4
        } else {
          this.globalData.model.phone = res.model
          this.globalData.model.topHeight = 68 + 4
        }
      }
    })
    this.globalData.member_id = wx.getStorageSync('member_id')
    this.globalData.token = wx.getStorageSync('token') || ''
    this.globalData.phone = wx.getStorageSync('phone') == null ? '' : wx.getStorageSync('phone')
    this.globalData.openid = wx.getStorageSync('openid')
    this.globalData.unionId = wx.getStorageSync('unionId')
  },
  onShow() {
    this.app_leave = false
    this.app_DIY(() => {})
    this.updateManager() // 系统更新
    this.checkClipBoard();
  },
  onHide() {
  },
  // 口令红包
  checkClipBoard() {
    wx.getClipboardData({
      success: ({ res }) {
        console.log(res); 
      },
    })
  },
  /**
   * 客服
   */
  service(callback) {
    this.app_socket = wx.connectSocket({
      // url: 'wss://ishoptest.zihaiwangluo.com/ws',
      url: 'wss://ishop.zihaiwangluo.com/ws',
      // url: 'ws://125.211.218.59:60013',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
    })
    //创建连接
    this.app_socket.onOpen(res => {
      console.log(res, '客服创建连接成功')
      this.app_socketType = true
      clearTimeout(this.app_socketAgainTime)
      let data = {
        "TYPE": "LOGIN",
        "DATA": {
          "USER_TYPE": "USER",
          "MEMBER_ID": this.globalData.member_id.toString(),
          "PLATFORM_ID": "1"
        }
      }
      this.app_socket.send({
        data: JSON.stringify(data),
        success: res => {
          console.log(res)
          this.socketHeart()
          if (callback) {
            callback()
          }
        },
        fail: res => {},
      })
    })

    //监听关闭
    this.app_socket.onClose(res => {
      console.log(res, '连接断开')
      this.app_socketType = false
      if (res.code != 10000 && !this.app_leave) {
        clearTimeout(this.app_socketHeartTime)
        setTimeout(res => {
          this.service()
        }, 3000)
      }
    })
  },
  /**
   * 监听消息
   */
  socketOnMessage(type, _this) {
    wx.onSocketMessage(res => {
      let resData = JSON.parse(res.data)
      switch (resData.TYPE) {
        case 'CONNECTED':
          break;
        case 'LOGIN':
          break;
        case 'WARNING':
          break;
        case 'ERROR':
          break;
        case 'MESSAGE':
          if (type == 'serviceRoom') {
            console.log(resData)
            this.socket_serviceRoom(resData, _this)
          }
          if (type == 'serviceMsgList') {
            console.log('发' + resData)
            this.socket_msgList(resData, _this)
          }
          break;
        case 'SUCCESS':
          break;
      }
    })
  },
  /**
   * 聊天房间
   */
  socket_serviceRoom(resData, _this) {
    if (_this.data.service_info.TARGET_ID != resData.DATA.FROM_ID) {
      return
    }
    let list, writeData
    switch (resData.DATA.MESSAGE_TYPE) {
      case 'TEXT':
        console.log('收到文本')
        list = {
          MSG_TYPE: 'success',
          MESSAGE_ID: resData.DATA.MESSAGE_ID,
          FROM_ID: resData.DATA.FROM_ID,
          MESSAGE_TYPE: resData.DATA.MESSAGE_TYPE,
          HEADIMG: '',
          MESSAGE_DATA: _this.chat(resData.DATA.MESSAGE_DATA),
        }
        _this.data.msglist.push(list)
        _this.setData({
          msglist: _this.data.msglist,
        })
        if (_this.data.scrollAnimation) {
          _this.setData({
            msglist_index: `id${resData.DATA.MESSAGE_ID}`
          })
        }
        writeData = {
          "TYPE": "MESSAGE_DELIVERD",
          "DATA": {
            "MESSAGE_ID": resData.DATA.MESSAGE_ID, // 字符串类型的毫秒级时间戳
            "TARGET_TYPE": resData.DATA.FROM_TYPE, // 收到消息的店铺ID
            "TARGET_ID": resData.DATA.FROM_ID // 接收者店铺ID
          }
        }
        this.app_socket.send({
          data: JSON.stringify(writeData),
          success: res => {
            console.log(res)
          }
        })
        break;
      case 'IMAGE':
        console.log('收到图片')
        list = {
          MSG_TYPE: 'success',
          MESSAGE_ID: resData.DATA.MESSAGE_ID,
          FROM_ID: resData.DATA.FROM_ID,
          MESSAGE_TYPE: resData.DATA.MESSAGE_TYPE,
          HEADIMG: '',
          MESSAGE_DATA: resData.DATA.MESSAGE_DATA,
        }
        _this.data.msglist.push(list)
        _this.setData({
          msglist: _this.data.msglist,
        })
        if (_this.data.scrollAnimation) {
          _this.setData({
            msglist_index: `id${resData.DATA.MESSAGE_ID}`
          })
        }
        writeData = {
          "TYPE": "MESSAGE_DELIVERD",
          "DATA": {
            "MESSAGE_ID": resData.DATA.MESSAGE_ID, // 字符串类型的毫秒级时间戳
            "TARGET_TYPE": resData.DATA.FROM_TYPE, // 收到消息的店铺ID
            "TARGET_ID": resData.DATA.FROM_ID // 接收者店铺ID
          }
        }
        this.app_socket.send({
          data: JSON.stringify(writeData),
          success: res => {
            console.log(res)
          }
        })
        break;
      case 'VOICE':
        console.log('收到语音')
        list = {
          MSG_TYPE: 'success',
          MESSAGE_ID: resData.DATA.MESSAGE_ID,
          FROM_ID: resData.DATA.FROM_ID,
          MESSAGE_TYPE: resData.DATA.MESSAGE_TYPE,
          HEADIMG: '',
          MESSAGE_DATA: resData.DATA.MESSAGE_DATA,
        }
        _this.data.msglist.push(list)
        _this.setData({
          msglist: _this.data.msglist,
        })
        if (_this.data.scrollAnimation) {
          _this.setData({
            msglist_index: `id${resData.DATA.MESSAGE_ID}`
          })
        }
        break;
      case 'GOODS':
        console.log('收到商品')
        list = {
          MSG_TYPE: 'success',
          MESSAGE_ID: resData.DATA.MESSAGE_ID,
          FROM_ID: resData.DATA.FROM_ID,
          MESSAGE_TYPE: resData.DATA.MESSAGE_TYPE,
          HEADIMG: '',
          MESSAGE_DATA: resData.DATA.MESSAGE_DATA,
          GOODS_DATA: null
        }
        _this.data.msglist.push(list)
        _this.setData({
          msglist: _this.data.msglist,
        })
        if (_this.data.scrollAnimation) {
          _this.setData({
            msglist_index: `id${resData.DATA.MESSAGE_ID}`
          })
        }
        wx.request({
          url: this.globalData.getGoodsInfo,
          method: 'POST',
          header: {
            "Content-Type": "json",
            "token": this.globalData.token
          },
          data: {
            goodsId: resData.DATA.MESSAGE_DATA
          },
          success: res => {
            for (let i = 0, len = _this.data.msglist.length; i < len; i++) {
              if (resData.DATA.MESSAGE_ID == _this.data.msglist[i].MESSAGE_ID) {
                _this.data.msglist[i].GOODS_DATA = res.data.data
                _this.setData({
                  msglist: _this.data.msglist
                })
                break;
              }
            }
          }
        })
        break;
    }
  },
  /**
   * 消息列表
   */
  socket_msgList(resData, _this) {
    console.log(resData)
    let service_list = _this.data.service_list.map((value, index, arr) => {
      if (resData.DATA.FROM_ID == value.store_id) {
        switch (resData.DATA.MESSAGE_TYPE) {
          case 'TEXT':
            value.after_chat_time = resData.DATA.MESSAGE_ID
            value.message.MESSAGE_TYPE = resData.DATA.MESSAGE_TYPE
            value.message.MESSAGE_DATA = resData.DATA.MESSAGE_DATA
            break;
          case 'IMAGE':
            value.after_chat_time = resData.DATA.MESSAGE_ID
            value.message.MESSAGE_TYPE = resData.DATA.MESSAGE_TYPE
            value.message.MESSAGE_DATA = '[图片]'
            break;
          case 'VOICE':
            value.after_chat_time = resData.DATA.MESSAGE_ID
            value.message.MESSAGE_TYPE = resData.DATA.MESSAGE_TYPE
            value.message.MESSAGE_DATA = '[语音]'
            break;
          case 'GOODS':
            value.after_chat_time = resData.DATA.MESSAGE_ID
            value.message.MESSAGE_TYPE = resData.DATA.MESSAGE_TYPE
            value.message.MESSAGE_DATA = '[商品]'
            break;
          case 'ORDER':
            value.after_chat_time = resData.DATA.MESSAGE_ID
            value.message.MESSAGE_TYPE = resData.DATA.MESSAGE_TYPE
            value.message.MESSAGE_DATA = '[订单]'
            break;
        }
      }
      return value
    })
    _this.setData({
      service_list: service_list
    })
  },

  /**
   * 心跳
   */
  socketHeart() {
    let data = {
      "TYPE": "HEART"
    }
    this.app_socketHeartTime = setTimeout(() => {
      this.app_socket.send({
        data: JSON.stringify(data),
        success: res => {
          this.socketHeart()
          console.log('噗通通')
        },
        fail: res => {},
      })
    }, 50000)
  },
  /**
   * 重连
   */
  againSocket() {
    if (this.app_leave) {
      return
    }
    this.app_socketAgainTime = setTimeout(() => {
      console.log('重连')
      this.service()
    }, 3000)
  },

  // DIY风格
  app_DIY(callback, that) {
    if (this.globalData.diy_color == null) {
      wx.request({
        url: this.globalData.app_DIY,
        success: res => {
          let data = res.data.result
          if (res.data.code == -201) {
            wx.clearStorageSync()
            app.globalData.member_id = ''
            app.globalData.phone = ''
            app.globalData.openid = ''
            app.globalData.unionId = ''
            app.globalData.token = ''
            //代言人ID
            app.globalData.sup_id = ''
            app.globalData.distribution = {}
            wx.closeSocket()
            clearTimeout(app.app_socketHeartTime)
          }

          const obj = {
            z_color: `rgb(${data.primary_r},${data.primary_g},${data.primary_b})`,
            c_color: `rgb(${data.deputy_r},${data.deputy_g},${data.deputy_b})`,
            f_color: `rgba(${data.primary_r},${data.primary_g},${data.primary_b},0.4)`,
            f_color_2: `rgba(${data.primary_r},${data.primary_g},${data.primary_b},0.2)`,
            f_color_6: `rgba(${data.primary_r},${data.primary_g},${data.primary_b},0.6)`,
            f_color_8: `rgba(${data.primary_r},${data.primary_g},${data.primary_b},0.8)`,
            text_color: `rgb(${data.contrast_r},${data.contrast_g},${data.contrast_b})`,
            primary_hex: data.primary_hex
          }
          const config = {
            app_info: data.app_info,
            show_switch: data.show_switch,
            version_info: data.version_info,
            share_text: data.share_text
          }
          this.globalData.diy_color = obj
          this.globalData.configSwitch = config
          if (that) {
            that.setData({
              diy_color: obj,
              configSwitch: config
            })
          }
          callback()
        }
      })
    } else {
      if (that) {
        that.setData({
          diy_color: this.globalData.diy_color,
          configSwitch: this.globalData.configSwitch
        })
      }
      callback()
    }
  },

  /**
   * 监听小程序更新
   */
  updateManager() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(res => {
      console.log(res.hasUpdate) // 请求完新版本信息的回调
    })
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate() // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          }
        }
      })
    })
    updateManager.onUpdateFailed(() => {
      wx.showToast({ // 新版本下载失败
        title: '更新失败',
        icon: 'none'
      })
    })
  },

  //登录
  login() {
    if (this.globalData.member_id == '') {
      wx.navigateTo({
        url: '/pages/accredit/accredit',
      })
      return false
    }

    if (this.globalData.phone == '') {
      wx.navigateTo({
        url: '/pages/bind_phone/bind_phone',
      })
      return false
    }
    return true
  },
  // 判断是否为手机号
  isPhone(pone) {
    var myreg = /^[1][3-9][0-9]{8}$/;
    if (!myreg.test(pone)) {
      return false;
    } else {
      return true;
    }
  },

  // 判断是否为手机号
  isPoneAvailable(pone) {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(pone)) {
      return false;
    } else {
      return true;
    }
  },
  showToast(e, success) {
    wx.showToast({
      title: e,
      icon: 'none',
      mask: true,
      duration: 1500,
      success: () => {
        if (success) {
          setTimeout(() => {
            success()
          }, 500)
        }
      }
    })
  },
  showSuccessToast(e, success) {
    wx.showToast({
      title: e,
      mask: true,
      duration: 1500,
      success: () => {
        if (success) {
          setTimeout(() => {
            success()
          }, 500)
        }
      }
    })
  },

  showModal(title, content, success) {
    wx.showModal({
      title: title,
      content: content,
      confirmColor: this.globalData.diy_color.primary_hex,
      success: (res) => {
        if (res.confirm) {
          success()
        }
      }
    })
  },

  /**
   *  是否有定位权限
   */
  openLocation(success, fail) {
    wx.showLoading({})
    wx.getLocation({
      success: (res) => {
        success(res)
      },
      fail: (res) => {
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.userLocation']) {
              success()
            } else {
              fail()
            }
          }
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })

  },
  app_socket: null,
  app_socketType: false,
  app_socketSite: 0,
  app_socketHeartTime: null,
  app_socketAgainTime: null,
  app_leave: false, //离开程序
  PAST_LOGIN: false,
  globalData: {
    isShops: 0, //多店，单店开关 多店：0，单店：1
    member_id: '',
    phone: '',
    openid: '',
    unionId: '',
    token: '',
    model: {
      phone: '',
      topHeight: ''
    },
    //腾讯地图KEY
    MapKey: 'RPHBZ-PVZK5-RQHIN-QGZCU-KJFQT-ZQBH4',
    messageList: [],
    //上级代言人ID
    sup_id: '',
    //定位信息
    lat: 0,
    lng: 0,
    PAST_LOGIN: false,
    address: null,
    addressSelect: {
      member_address_id: null
    },
    location: '全国',
    current_location: '全国',
    //底部导航索引
    nav_index: 0,
    navHeight: '',
    navBar: null,
    //DIY配色
    diy_color: null,
    //配置开关
    configSwitch: {},
    //代言信息
    distribution: {},
    service: {
      msglist: []
    },
    HTTP: HTTP,
    //风格
    app_DIY: HTTP + 'v2.0/shopStyle/get',
    //0.底部导航
    navigation: HTTP + 'v2.0/appletMy/navigation',
    //1.发送验证码
    message_send: HTTP + 'v2.0/sms/send',
    //绑定手机号
    bind_phone: HTTP + 'v2.0/appletMy/info',
    //2.我的
    my: HTTP + 'v2.0/my/index',
    //3.个人资料
    my_info: HTTP + 'v2.0/my/info',
    //4.修改性别or昵称
    my_other: HTTP + 'v2.0/my/other',
    //5.修改头像
    avatar: HTTP + 'v2.0/my/avatar',
    //6.会员等级
    member_grade: HTTP + 'v2.0/rank/index',
    //7.设置首页
    setting: HTTP + 'v2.0/setting/index',
    //8.账户与安全
    safety: HTTP + 'v2.0/setting/safety',
    //9.设置支付密码
    set_password: HTTP + 'v2.0/setting/setPayPassword',
    //9.设置密码
    set_password_login: HTTP + 'v2.0/setting/setPassword',
    //10.修改密码
    update_password: HTTP + 'v2.0/setting/updatePayPassword',
    //11.检测验证码
    check_code: HTTP + 'v2.0/sms/checkCodeInvalid',
    //12.忘记密码
    forget_password: HTTP + 'v2.0/setting/forgetPassword',
    //13.修改手机号码
    update_phone: HTTP + 'v2.0/setting/updatePhone',
    //14.收货地址
    address_index: HTTP + 'v2.0/address/index',
    //15.省市区街道
    address_linkage: HTTP + 'v2.0/address/linkage',
    //16.保存收货地址
    address_create: HTTP + 'v2.0/address/create',
    //17.编辑收货地址
    address_update: HTTP + 'v2.0/address/update',
    //18.读取收货地址
    address_find: HTTP + 'v2.0/address/find',
    //19.删除地址
    address_destroy: HTTP + 'v2.0/address/destroy',
    //20.反馈
    feedback: HTTP + 'v2.0/setting/feedback',
    //21.上传图片
    upload_pic: HTTP + 'v2.0/image/upload',
    //22.上传视频
    upload_video: HTTP + 'v2.0/image/uploadVideo',
    //23.帮助中心
    help_center: HTTP + 'v2.0/setting/helpCenter',
    //24.积分首页
    integral_index: HTTP + 'v2.0/integral/index',
    //25.积分分类列表
    integral_classify: HTTP + 'v2.0/integral/classify',
    //26.积分签到
    sign: HTTP + 'v2.0/integral/sign',
    //27.积分商品列表
    integral_goods: HTTP + 'v2.0/integral/goods',
    //28.积分明细
    integral_detail: HTTP + 'v2.0/integral/detail',
    //29.积分商品详情
    integral_view: HTTP + 'v2.0/integral/view',
    //30.兑换展示
    integral_conversion: HTTP + 'v2.0/integral/conversion',
    //31.积分任务
    integral_task: HTTP + 'v2.0/integral/task',
    //32.兑换商品
    integral_confirm: HTTP + 'v2.0/integral/redemption',
    //33.兑换商品加余额
    redemption_money: HTTP + 'v2.0/integral/redemptionMoney',
    //34.兑换记录
    integral_record: HTTP + 'v2.0/integral/conversionRecord',
    //35.兑换记录详情
    integral_order: HTTP + 'v2.0/integral/conversionView',
    //36.确认收货
    confirm_receipt: HTTP + 'v2.0/integral/confirmReceipt',
    //37.商品分类
    classify_parent: HTTP + 'v2.0/goodsClassify/parent',
    //38.下级分类
    sub_classify: HTTP + 'v2.0/goodsClassify/subordinate',
    //39.热门搜索
    hot_search: HTTP + 'v2.0/search/hot',
    //40.商品列表
    good_list: HTTP + 'v2.0/goods/index',
    //41.商品详情
    goods_view: HTTP + 'v2.0/goods/view',
    //42.商品评价
    evaluate_list: HTTP + 'v2.0/goods/evaluateList',
    //43.商品购物券列表
    good_coupon_list: HTTP + 'v2.0/goods/couponList',
    //44.商品属性
    attr_find: HTTP + 'v2.0/goods/attrFind',
    //45.收藏商品
    collect_goods: HTTP + 'v2.0/goods/collectGoods',
    //46.取消收藏
    collect_delete: HTTP + 'v2.0/goods/viewCollectGoodsDelete',
    //47.收藏列表
    collect_goods_list: HTTP + 'v2.0/goods/collectGoodsList',
    //48.收藏列表取消收藏
    collect_goods_delete: HTTP + 'v2.0/goods/collectGoodsDelete',
    //49.登录
    login: HTTP + 'v2.0/appletMy/login',
    //50.店铺头部
    store_head: HTTP + 'v2.0/store/head',
    //51.店铺首页
    store_index: HTTP + 'v2.0/store/index',
    //52.店铺全部商品
    store_goods_list: HTTP + 'v2.0/store/goodsList',
    //53.店铺新品
    new_product_list: HTTP + 'v2.0/store/newProductList',
    //54.店铺热门分类
    store_hot_classify_list: HTTP + 'v2.0/store/hotClassifyList',
    //55.店铺分类
    store_classify_list: HTTP + 'v2.0/store/classifyList',
    //56.店铺详情
    store_info: HTTP + 'v2.0/store/info',
    //57.收藏店铺
    collect_store: HTTP + 'v2.0/store/collectStore',
    //58.取消收藏店铺
    store_index_delete: HTTP + 'v2.0/store/viewCollectStoreDelete',
    //59.收藏店铺列表
    collect_store_list: HTTP + 'v2.0/store/collectStoreList',
    //60.删除收藏店铺
    collect_store_delete: HTTP + 'v2.0/store/collectStoreDelete',
    //61.店铺动态
    store_article_list: HTTP + 'v2.0/store/articleList',
    //62.店铺动态
    article_view: HTTP + 'v2.0/store/articleView',
    //63.附近店铺
    store_nearby_list: HTTP + 'v2.0/store/nearbyList',
    //64.发现好店
    store_good_list: HTTP + 'v2.0/store/goodList',
    //65.搜索店铺
    store_search_list: HTTP + 'v2.0/store/searchList',
    //66.领券中心
    coupon_center: HTTP + 'v2.0/coupon/get',
    //67.换券中心 
    coupon_exchange_list: HTTP + 'v2.0/coupon/exchange',
    //68.换券详情
    coupon_exchange_view: HTTP + 'v2.0/coupon/exchangeView',
    //69.换券促销列表
    coupon_goods_list: HTTP + 'v2.0/coupon/goodsList',
    //70.领取优惠券
    get_coupon: HTTP + 'v2.0/memberCoupon/get',
    //71.换取优惠券
    exchange_coupon: HTTP + 'v2.0/memberCoupon/exchange',
    //72.我的优惠券
    member_coupon: HTTP + 'v2.0/memberCoupon/index',
    //73.我的红包
    member_packet: HTTP + 'v2.0/memberPacket/index',
    //74.好物推荐 精选
    choiceness_list: HTTP + 'v2.0/goods/choicenessList',
    //75.好物推荐列表
    good_recommend_list: HTTP + 'v2.0/goods/goodRecommendList',
    //76.浏览记录
    record_goods: HTTP + 'v2.0/recordGoods/index',
    //77.删除记录
    delete_record: HTTP + 'v2.0/recordGoods/delete',
    //78.限时抢购分类
    time_limit: HTTP + 'v2.0/timeLimit/classify',
    //79.限时抢购商品
    limit_list: HTTP + 'v2.0/timeLimit/index',
    //80.加入购物车
    cart_create: HTTP + 'v2.0/cart/create',
    //81.购物车列表
    cart_index: HTTP + 'v2.0/cart/index',
    //82.购物车增加
    cart_add: HTTP + 'v2.0/cart/addNumber',
    //83.购物车减少
    cart_reduce: HTTP + 'v2.0/cart/reduceNumber',
    //84.商品规格
    cart_attr: HTTP + 'v2.0/cart/attr',
    //85.商品
    cart_update: HTTP + 'v2.0/cart/update',
    //86.购物车删除
    cart_delete: HTTP + 'v2.0/cart/delete',
    //87.购物车收藏
    cart_collect: HTTP + 'v2.0/cart/collect',
    //88.店铺优惠券
    cart_coupon_list: HTTP + 'v2.0/cart/couponList',
    //89.购物车确认订单
    cart_confirm_order: HTTP + 'v2.0/cart/confirmOrder',
    //90.城市列表
    area_index: HTTP + 'v2.0/area/index',
    //91.砍价列表
    bargain_index: HTTP + 'v2.0/bargain/index',
    //92.立即砍价
    bargain_immediately: HTTP + 'v2.0/bargain/immediately',
    //93.我的砍价列表
    my_bargain: HTTP + 'v2.0/bargain/myCut',
    //94.砍价详情
    cut_detail: HTTP + 'v2.0/bargain/myCutView',
    //95.帮忙砍价
    cut_help: HTTP + 'v2.0/bargain/myCutHelp',
    //96.充值列表
    recharge_list: HTTP + 'v2.0/recharge/index',
    //97.商品排行榜
    goods_ranking: HTTP + 'v2.0/home/goodsRanking',
    //98.店铺排行榜
    store_ranking: HTTP + 'v2.0/home/storeRanking',
    //99.品牌甄选分类
    brand_class_list: HTTP + 'v2.0/home/brandClassList',
    //100.品牌甄选列表
    brand_list: HTTP + 'v2.0/home/brandList',
    //101.热点
    hot_list: HTTP + 'v2.0/home/hotList',
    //102.热点详情
    hot_view: HTTP + 'v2.0/home/hotView',
    //103.收藏文章列表
    article_list: HTTP + 'v2.0/home/articleList',
    //104.收藏文章
    collect_article: HTTP + 'v2.0/home/collectArticle',
    //105.取消收藏
    view_collect_article_delete: HTTP + 'v2.0/home/viewCollectArticleDelete',
    //106.取消收藏
    collect_article_delete: HTTP + 'v2.0/home/collectArticleDelete',
    //107.首页
    index: HTTP + 'v2.0/index/index',
    //限时抢购
    index_curLimitList: HTTP + 'v2.0/index/curLimitList',
    //108.新人专享礼包
    new_gift: HTTP + 'v2.0/index/couponList',
    //109.获取专享礼包
    get_gift: HTTP + 'v2.0/index/getCoupon',
    //110.购物车数量
    cart_number: HTTP + 'v2.0/cart/number',
    //111.订单列表
    order_list: HTTP + 'v2.0/order/orderList',
    //112.取消订单
    cancel_order: HTTP + 'v2.0/order/cancel',
    //113.删除订单
    delete_order: HTTP + 'v2.0/order/destroyOrder',
    //114.确认订单
    confirm_collect: HTTP + 'v2.0/order/confirmCollect',
    //115.订单退款
    refundAndReturn: HTTP + 'v2.0/order/refundAndReturn',
    //116.消息通知
    message_list: HTTP + 'v2.0/message/index',
    //117.余额记录
    balance_record: HTTP + 'v2.0/recharge/balanceRecord',
    //118.消息统计
    message_statistics: HTTP + 'v2.0/message/statistics',
    //119.积分说明
    integral_help: HTTP + 'v2.0/html/articleView?articleId=27',
    //120.订单详情
    order_details: HTTP + 'v2.0/order/orderDetails',
    //121.确认订单
    common_confirm_order: HTTP + 'v2.0/cart/commonConfirmOrder',
    //122.拼团分类列表
    group_class_index: HTTP + 'v2.0/group/classIndex',
    //123.拼团列表
    group_index: HTTP + 'v2.0/group/index',
    //124.我的拼团
    group_my_index: HTTP + 'v2.0/group/myIndex',
    //125.拼团详情
    group_view: HTTP + 'v2.0/group/view',
    //126.提交订单
    order_confirm: HTTP + 'v2.0/order/confirm',
    //127.余额支付
    balance_exec: HTTP + 'v2.0/balance/exec',
    //128.邀请好友数据
    packet_index: HTTP + 'v2.0/packet/index',
    //129.售后订单列表
    order_fter_sale_ist: HTTP + 'v2.0/order/orderAfterSaleList',
    //130.退款详情
    refund_details: HTTP + 'v2.0/order/refundDetails',
    //131.物流详情
    express_view: HTTP + 'v2.0/express/view',
    //132.降价通知
    depreciate_goods: HTTP + 'v2.0/goods/depreciateGoods',
    //133.web页 活动规则
    collage_rule_web: HTTP + 'v2.0/html/articleView?articleId=20',
    //砍价规则
    bargain_rule_web: HTTP + 'v2.0/html/articleView?articleId=21',
    //134.充值说明
    recharge_web: HTTP + 'v2.0/html/articleView?articleId=24',
    //134.购物流程
    process_web: HTTP + 'v2.0/html/articleView?articleId=28',
    //135.优惠券使用
    coupon_web: HTTP + 'v2.0/html/articleView?articleId=29',
    //136.同城配送说明
    city_web: HTTP + 'v2.0/html/articleView?articleId=30',
    //137.配送服务费说明
    delivery_service_web: HTTP + 'v2.0/html/articleView?articleId=31',
    //138.在线支付说明
    pay_online_web: HTTP + 'v2.0/html/articleView?articleId=32',
    //139.门店自提说明
    store_self_web: HTTP + 'v2.0/html/articleView?articleId=33',
    //140.撤销退换货
    revoke_apply: HTTP + 'v2.0/order/revokeApply',
    //141.物流列表
    express_list: HTTP + 'v2.0/express/expressList',
    //142.填写退货物流
    return_confirmed: HTTP + 'v2.0/order/returnConfirmed',
    //143.发表评价
    evaluate_report: HTTP + 'v2.0/evaluate/report',
    //144.创建店铺
    create_store: HTTP + 'v2.0/my/createStore',
    //145.门店自提列表
    take_list: HTTP + 'v2.0/goods/takeList',
    //146.配送说明
    shipping_instructions: HTTP + 'v2.0/goods/shippingInstructions',
    //147.成长值
    my_task: HTTP + 'v2.0/my/task',
    //148会员卡
    rank_card: HTTP + 'v2.0/rank/card',
    //149线下订单
    order_under_line_list: HTTP + 'v2.0/order/orderUnderLineList',
    //150会员卡web
    index_web: HTTP + 'v2.0/my/indexWeb',
    //151微信支付
    wx_pay: HTTP + 'v2.0/appletPay/payment',
    //152充值生成订单号
    common_order: HTTP + 'v2.0/commonOrder/number',
    //153微信充值
    applet_pay_recharge: HTTP + 'v2.0/appletPay/recharge',
    //154待评价订单
    orderEvaluateList: HTTP + 'v2.0/order/orderEvaluateList',
    //155我的评价
    myEvaluateList: HTTP + 'v2.0/evaluate/myEvaluateList',
    //156会员专享价web
    premium_price: HTTP + 'v2.0/rank/premiumPrice',
    //157支付密码
    pay_recharge: HTTP + 'v2.0/pay/recharge',
    //158拼团信息列表
    groupMsgList: HTTP + 'v2.0/order/groupMsgList',
    //159付款码
    payment_code: HTTP + 'v2.0/my/paymentCode',
    //160店铺服务
    shop_service_web: HTTP + 'v2.0/html/articleView?articleId=34',
    //161主营类目店铺
    shop_category_web: HTTP + 'v2.0/html/articleView?articleId=35',
    //162 面对面扫码
    face_code: HTTP + 'v2.0/appletMy/faceCode',
    //163邀请活动规则
    red_pocket_rule: HTTP + 'v2.0/html/appletArticleView?articleId=19',
    //164注册协议
    regist_web: HTTP + 'v2.0/html/articleView?articleId=17',
    //165web
    service_web: HTTP + 'v2.0/html/articleView?articleId=',
    //167客服热线
    hotline: HTTP + 'v2.0/setting/hotline',
    //168分享按钮
    share_btn: HTTP + 'v2.0/share/text',
    //169分享
    notify: HTTP + 'v2.0/share/notify',
    //170平台店铺主营分类
    platform_classify: HTTP + 'v2.0/store/platformClassify',
    //171注释
    label: HTTP + 'v2.0/share/test',
    //172抽奖详情
    activity_goods_list: HTTP + 'v2.0/lotteryActivity/activityGoodsList',
    //173抽奖
    lottery_activity: HTTP + 'v2.0/lotteryActivity/draw',
    //174我的抽奖
    lottery_activity_list: HTTP + 'v2.0/lotteryActivity/orderList',
    //175抽奖确认到货
    confirm_take: HTTP + 'v2.0/lotteryActivity/confirmTake',
    //176填写抽奖收货地址
    set_addres: HTTP + 'v2.0/lotteryActivity/setAddres',
    //177抽奖分享
    share_activity: HTTP + 'v2.0/lotteryActivity/shareActivity',
    //178达达快递
    dadaExpress: HTTP + 'v2.0/express/dadaExpress',
    //179忘记支付密码
    forget_pay_password: HTTP + 'v2.0/setting/forgetPayPassword',
    //180修改登录密码
    d_update_password: HTTP + 'v2.0/setting/updatePassword',
    //181抽奖规则
    draw_activity_view: HTTP + 'v2.0/html/drawActivityView',
    //182积分删除订单
    conversion_record_delete: HTTP + 'v2.0/integral/conversionRecordDelete',
    //183积分微信支付
    points_redemption: HTTP + 'v2.0/appletPay/pointsRedemption',
    //获取订单状态
    order_getOrderState: HTTP + 'v2.0/order/getOrderState',
    // 是否创建店铺
    my_getInState: HTTP + 'v2.0/my/getInState',
    customer_getStoreInfo: HTTP + 'v2.0/customer/getStoreInfo',
    //积分下订单
    integral_preOrder: HTTP + 'v2.0/integral/preOrder',
    //增加广告点击数
    index_adBrowseInc: HTTP + 'v2.0/index/adBrowseInc',
    //185代言收益首页
    dy_earnings_view: HTTP + 'v2.0/distributionMy/earningsView',
    //186代言收益提现首页
    distribution_withdrawal_index: HTTP + 'v2.0/distributionWithdrawal/index',
    //187代言收益提现
    distribution_withdrawal_to_apply: HTTP + 'v2.0/distributionWithdrawal/toApply',
    //188代言提现记录
    distribution_withdrawal_record: HTTP + 'v2.0/distributionWithdrawal/record',
    //189代言粉丝列表
    distribution_my_fans: HTTP + 'v2.0/distributionMy/fans',
    //190代言申请代言
    distribution_become_apply: HTTP + 'v2.0/distributionBecome/apply',
    //191代言收益详情
    distribution_my_earnings_details: HTTP + 'v2.0/distributionMy/earningsDetails',
    //192代言代言升降记录
    distribution_level_change_record: HTTP + 'v2.0/distributionLevel/changeRecord',
    //193代言申请代言设置
    distribution_form_set: HTTP + 'v2.0/distributionBecome/distributionFormSet',
    //194代言规则
    tobe_distributor_rule: HTTP + 'v2.0/distributionBecome/tobeDistributorRule',
    //195代言我的代言等级
    distribution_my_level: HTTP + 'v2.0/distributionLevel/myLevel',
    //196代言说明
    distribution_my_explain: HTTP + 'v2.0/distributionMy/explain',
    //197代言邀请你代言
    distribution_yq: HTTP + 'v2.0/distributionShare/toInvite',
    //198代言人商信息
    distribution_share_info: HTTP + 'v2.0/distributionShare/getInfo',
    //199代言商品列表
    distribution_goods_list: HTTP + 'v2.0/distributionGoods/goodsList',
    //200绑定代言人关系
    distribution_bindDistribution: HTTP + 'v2.0/distributionShare/bindDistribution',
    //
    distribution_query_point: HTTP + 'v2.0/distributionBecome/queryPoint',
    //
    distribution_jumpSign: HTTP + 'v2.0/share/jumpSign',
    //
    distribution_vipTurnDist: HTTP + 'v2.0/distributionBecome/vipTurnDist',
    distribution_getRiseHistory: HTTP + 'v2.0/invoiceExplain/getRiseHistory',
    //201客服上传图片
    service_uploadFile: HTTP + 'v2.0/customer/uploadFile',
    //202客服历史消息
    getChatLog: HTTP + 'v2.0/customer/getChatLog',
    //203客服店铺列表
    getCustomerList: HTTP + 'v2.0/customer/getCustomerList',
    //获得商品详情接口
    getGoodsInfo: HTTP + 'v2.0/customer/getGoodsInfo',
    //获取咨询订单
    customer_getStoreOrderList: HTTP + 'v2.0/customer/getStoreOrderList',
    // 会员获得商品列表
    customer_getGoodsList: HTTP + 'v2.0/customer/getGoodsList',
    //我的钱包
    my_myWallet: HTTP + 'v2.0/my/myWallet',
    //平台证照信息
    license: HTTP + 'v2.0/share/license',
    //发票信息
    invoice_detail: HTTP + 'v2.0/invoiceExplain/detail',
    //收票人信息
    invoice_supplement: HTTP + 'v2.0/invoice/supplement',
    //发票确认订单
    invoice_order_detail: HTTP + 'v2.0/invoice/orderDetail',
    //
    invoice_anew: HTTP + 'v2.0/invoice/anew',
    //支付成功返回活动id
    payInfo_getPayInfo: HTTP + 'v2.0/payInfo/getPayInfo',
    //发票可开具类型
    //invoice_explain_type: HTTP + 'v2.0/invoice_explain/type',
    invoice_explain_editInvoice: HTTP + 'v2.0/invoiceExplain/editInvoice',
    //重开补开发票时保留未付款的发票信息数据
    invoice_explain_reopening: HTTP + 'v2.0/invoiceExplain/reopening',
    //重开补开发票时修改发票信息
    invoice_edit: HTTP + 'v2.0/invoice/edit',
    //No.9重开补开发票运费为0时更改信息
    invoice_change_status: HTTP + 'v2.0/invoice/changeStatus',
    //---------------------------------------------------------------------------------
    //获取FormId
    applet_my_saveFormId: HTTP + 'v2.0/appletMy/saveFormId',
    //商品标签
    goods_tagClickLog: HTTP + 'v2.0/goods/tagClickLog',
    //抽奖订单详情
    lottery_activity_order_info: HTTP + 'v2.0/lotteryActivity/orderInfo',
    //银行卡列表
    card_index: HTTP + 'v2.0/card/index',
    //添加银行卡
    card_create: HTTP + 'v2.0/card/create',
    //删除银行卡
    card_destroy: HTTP + 'v2.0/card/destroy',
    //银行卡详情
    card_details: HTTP + 'v2.0/card/details',
    //退款金额
    order_refundMoney: HTTP + 'v2.0/order/refundMoney'
    //---------------------------------------------------------------------------------
  }
})