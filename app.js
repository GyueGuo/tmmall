
var HTTP = 'https://tmtest.tianmushenyang.com/';
// var HTTP = 'https://8.131.64.231/';

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
    this.globalData.memberId = wx.getStorageSync('memberId')
    this.globalData.token = wx.getStorageSync('token') || ''
    this.globalData.phone = wx.getStorageSync('phone') == null ? '' : wx.getStorageSync('phone')
    this.globalData.openid = wx.getStorageSync('openid')
    this.globalData.unionId = wx.getStorageSync('unionId')
  },
  onShow() {
    this.appLeave = false
    this.appDIY(() => {})
    this.updateManager() // 系统更新
  },
  onHide() {},
  /**
   * 客服
   */
  service(callback) {
    this.appSocket = wx.connectSocket({
      // url: 'wss://ishoptest.zihaiwangluo.com/ws',
      url: 'wss://ishop.zihaiwangluo.com/ws',
      // url: 'ws://125.211.218.59:60013',
      header: {
        'content-type': 'application/json;charset=UTF-8'
      },
      method: 'GET',
    })
    //创建连接
    this.appSocket.onOpen(res => {
      console.log(res, '客服创建连接成功')
      this.appSocketType = true
      clearTimeout(this.appSocketAgainTime)
      let data = {
        "TYPE": "LOGIN",
        "DATA": {
          "USERTYPE": "USER",
          "MEMBERID": this.globalData.memberId.toString(),
          "PLATFORMID": "1"
        }
      }
      this.appSocket.send({
        data: JSON.stringify(data),
        success: res => {
          this.socketHeart()
          if (callback) {
            callback()
          }
        },
        fail: res => {},
      })
    })

    //监听关闭
    this.appSocket.onClose(res => {
      console.log(res, '连接断开')
      this.appSocketType = false
      if (res.code != 10000 && !this.appLeave) {
        clearTimeout(this.appSocketHeartTime)
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
            this.socketServiceRoom(resData, _this)
          }
          if (type == 'serviceMsgList') {
            console.log('发' + resData)
            this.socketMsgList(resData, _this)
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
  socketServiceRoom(resData, _this) {
    if (_this.data.serviceInfo.TARGETID != resData.DATA.FROMID) {
      return
    }
    let list, writeData
    switch (resData.DATA.MESSAGETYPE) {
      case 'TEXT':
        console.log('收到文本')
        list = {
          MSGTYPE: 'success',
          MESSAGEID: resData.DATA.MESSAGEID,
          FROMID: resData.DATA.FROMID,
          MESSAGETYPE: resData.DATA.MESSAGETYPE,
          HEADIMG: '',
          MESSAGEDATA: _this.chat(resData.DATA.MESSAGEDATA),
        }
        _this.data.msglist.push(list)
        _this.setData({
          msglist: _this.data.msglist,
        })
        if (_this.data.scrollAnimation) {
          _this.setData({
            msglistIndex: `id${resData.DATA.MESSAGEIDD}`
          })
        }
        writeData = {
          "TYPE": "MESSAGEDELIVERD",
          "DATA": {
            "MESSAGEID": resData.DATA.MESSAGEID, // 字符串类型的毫秒级时间戳
            "TARGETTYPE": resData.DATA.TARGETTYPE, // 收到消息的店铺ID
            "TARGETID": resData.DATA.TARGETID // 接收者店铺ID
          }
        }
        this.appSocket.send({
          data: JSON.stringify(writeData),
          success: res => {
            console.log(res)
          }
        })
        break;
      case 'IMAGE':
        list = {
          MSGTYPE: 'success',
          MESSAGEID: resData.DATA.MESSAGEID,
          FROMID: resData.DATA.FROMID,
          MESSAGETYPE: resData.DATA.MESSAGETYPE,
          HEADIMG: '',
          MESSAGEDATA: resData.DATA.MESSAGEDATA,
        }
        _this.data.msglist.push(list)
        _this.setData({
          msglist: _this.data.msglist,
        })
        if (_this.data.scrollAnimation) {
          _this.setData({
            msglistIndex: `id${resData.DATA.MESSAGEID}`
          })
        }
        writeData = {
          "TYPE": "MESSAGEDELIVERD",
          "DATA": {
            "MESSAGEID": resData.DATA.MESSAGEID, // 字符串类型的毫秒级时间戳
            "TARGETTYPE": resData.DATA.FROMTYPE, // 收到消息的店铺ID
            "TARGETID": resData.DATA.FROMID // 接收者店铺ID
          }
        }
        this.appSocket.send({
          data: JSON.stringify(writeData),
          success: res => {
            console.log(res)
          }
        })
        break;
      case 'VOICE':
        console.log('收到语音')
        list = {
          MSGTYPE: 'success',
          MESSAGEID: resData.DATA.MESSAGEID,
          FROMID: resData.DATA.FROMID,
          MESSAGETYPE: resData.DATA.MESSAGETYPE,
          HEADIMG: '',
          MESSAGEDATA: resData.DATA.MESSAGEDATA,
        }
        _this.data.msglist.push(list)
        _this.setData({
          msglist: _this.data.msglist,
        })
        if (_this.data.scrollAnimation) {
          _this.setData({
            msglistIndex: `id${resData.DATA.MESSAGEID}`
          })
        }
        break;
      case 'GOODS':
        console.log('收到商品')
        list = {
          MSGTYPE: 'success',
          MESSAGEID: resData.DATA.MESSAGEID,
          FROMID: resData.DATA.FROMID,
          MESSAGETYPE: resData.DATA.MESSAGETYPE,
          HEADIMG: '',
          MESSAGEDATA: resData.DATA.MESSAGEDATA,
          GOODSDATA: null
        }
        _this.data.msglist.push(list)
        _this.setData({
          msglist: _this.data.msglist,
        })
        if (_this.data.scrollAnimation) {
          _this.setData({
            msglistIndex: `id${resData.DATA.MESSAGEID}`
          })
        }
        wx.request({
          url: this.globalData.getGoodsInfo,
          method: 'POST',
          header: {
            "Content-Type": "application/json;charset=UTF-8",
            "token": this.globalData.token
          },
          data: {
            goodsId: resData.DATA.MESSAGEDATA
          },
          success: res => {
            for (let i = 0, len = _this.data.msglist.length; i < len; i++) {
              if (resData.DATA.MESSAGEID == _this.data.msglist[i].MESSAGEID) {
                _this.data.msglist[i].GOODSDATA = res.data.data
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
  socketMsgList(resData, _this) {
    let serviceList = _this.data.serviceList.map((value, index, arr) => {
      if (resData.DATA.FROMID == value.storeId) {
        switch (resData.DATA.MESSAGETYPE) {
          case 'TEXT':
            value.afterChatTime = resData.DATA.MESSAGEID
            value.message.MESSAGETYPE = resData.DATA.MESSAGETYPE
            value.message.MESSAGEDATA = resData.DATA.MESSAGEDATA
            break;
          case 'IMAGE':
            value.afterChatTime = resData.DATA.MESSAGEID
            value.message.MESSAGETYPE = resData.DATA.MESSAGETYPE
            value.message.MESSAGEDATA = '[图片]'
            break;
          case 'VOICE':
            value.afterChatTime = resData.DATA.MESSAGEID
            value.message.MESSAGETYPE = resData.DATA.MESSAGETYPE
            value.message.MESSAGEDATA = '[语音]'
            break;
          case 'GOODS':
            value.afterChatTime = resData.DATA.MESSAGEID
            value.message.MESSAGETYPE = resData.DATA.MESSAGETYPE
            value.message.MESSAGEDATA = '[商品]'
            break;
          case 'ORDER':
            value.afterChatTime = resData.DATA.MESSAGEID
            value.message.MESSAGETYPE = resData.DATA.MESSAGETYPE
            value.message.MESSAGEDATA = '[订单]'
            break;
        }
      }
      return value
    })
    _this.setData({
      serviceList,
    })
  },

  /**
   * 心跳
   */
  socketHeart() {
    let data = {
      "TYPE": "HEART"
    }
    this.appSocketHeartTime = setTimeout(() => {
      this.appSocket.send({
        data: JSON.stringify(data),
        success: res => {
          this.socketHeart()
          console.log('噗通通')
        },
        fail: res => {},
      })
    }, 50000)
  },

  // DIY风格
  appDIY(callback, that) {
    if (this.globalData.diyColor == null) {
      wx.request({
        url: this.globalData.appDIY,
        success: res => {
          let data = res.data.result
          if (res.data.code == -201) {
            wx.clearStorageSync()
            app.globalData.memberId = ''
            app.globalData.phone = ''
            app.globalData.openid = ''
            app.globalData.unionId = ''
            app.globalData.token = ''
            //代言人ID
            app.globalData.supId = ''
            app.globalData.distribution = {}
            wx.closeSocket()
            clearTimeout(app.appSocketHeartTime)
          }

          const obj = {
            zColor: `rgb(${data.primaryR},${data.primaryG},${data.primaryB})`,
            cColor: `rgb(${data.deputyR},${data.deputyG},${data.deputyB})`,
            fColor: `rgba(${data.primaryR},${data.primaryG},${data.primaryB},0.4)`,
            fColor2: `rgba(${data.primaryR},${data.primaryG},${data.primaryB},0.2)`,
            fColor6: `rgba(${data.primaryR},${data.primaryG},${data.primaryB},0.6)`,
            fColor8: `rgba(${data.primaryR},${data.primaryG},${data.primaryB},0.8)`,
            textColor: `rgb(${data.contrastR},${data.contrastG},${data.contrastB})`,
            primaryHex: data.primaryHex
          }
          const config = {
            appInfo: data.appInfo,
            showSwitch: data.showSwitch,
            versionInfo: data.versionInfo,
            shareText: data.shareText
          }
          this.globalData.diyColor = obj
          this.globalData.configSwitch = config
          if (that) {
            that.setData({
              diyColor: obj,
              configSwitch: config
            })
          }
          callback()
        }
      })
    } else {
      if (that) {
        that.setData({
          diyColor: this.globalData.diyColor,
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
    if (this.globalData.memberId == '') {
      wx.navigateTo({
        url: '/pages/accredit/accredit',
      })
      return false
    }

    if (this.globalData.phone == '') {
      wx.navigateTo({
        url: '/pages/bindPhone/bindPhone',
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
      confirmColor: this.globalData.diyColor.primaryHex,
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
  appSocket: null,
  appSocketType: false,
  appSocketSite: 0,
  appSocketHeartTime: null,
  appSocketAgainTime: null,
  appLeave: false, //离开程序
  PASTLOGIN: false,
  globalData: {
    isShops: 0, //多店，单店开关 多店：0，单店：1
    memberId: '',
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
    supId: '',
    //定位信息
    lat: 0,
    lng: 0,
    PASTLOGIN: false,
    address: null,
    addressSelect: {
      memberAddressId: null
    },
    location: '全国',
    currentLocation: '全国',
    //底部导航索引
    navIndex: 0,
    navHeight: '',
    navBar: null,
    //DIY配色
    diyColor: null,
    //配置开关
    configSwitch: {},
    //代言信息
    distribution: {},
    service: {
      msglist: []
    },
    HTTP: HTTP,
    //风格
    appDIY: HTTP + 'v2.0/shopStyle/get',
    //0.底部导航
    navigation: HTTP + 'v2.0/appletMy/navigation',
    //1.发送验证码
    messageSend: HTTP + 'v2.0/sms/send',
    //绑定手机号
    bindPhone: HTTP + 'v2.0/appletMy/info',
    //2.我的
    my: HTTP + 'v2.0/my/index',
    //3.个人资料
    myInfo: HTTP + 'v2.0/my/info',
    //4.修改性别or昵称
    myOther: HTTP + 'v2.0/my/other',
    //5.修改头像
    avatar: HTTP + 'v2.0/my/avatar',
    //6.会员等级
    memberGrade: HTTP + 'v2.0/rank/index',
    //7.设置首页
    setting: HTTP + 'v2.0/setting/index',
    //8.账户与安全
    safety: HTTP + 'v2.0/setting/safety',
    //9.设置支付密码
    setPassword: HTTP + 'v2.0/setting/setPayPassword',
    //9.设置密码
    setPasswordLogin: HTTP + 'v2.0/setting/setPassword',
    //10.修改密码
    updatePassword: HTTP + 'v2.0/setting/updatePayPassword',
    //11.检测验证码
    checkCode: HTTP + 'v2.0/sms/checkCodeInvalid',
    //12.忘记密码
    forgetPassword: HTTP + 'v2.0/setting/forgetPassword',
    //13.修改手机号码
    updatePhone: HTTP + 'v2.0/setting/updatePhone',
    //14.收货地址
    addressIndex: HTTP + 'v2.0/address/index',
    //15.省市区街道
    addressLinkage: HTTP + 'v2.0/address/linkage',
    //16.保存收货地址
    addressCreate: HTTP + 'v2.0/address/create',
    //17.编辑收货地址
    addressUpdate: HTTP + 'v2.0/address/update',
    //18.读取收货地址
    addressFind: HTTP + 'v2.0/address/find',
    //19.删除地址
    addressDestroy: HTTP + 'v2.0/address/destroy',
    //20.反馈
    feedback: HTTP + 'v2.0/setting/feedback',
    //21.上传图片
    uploadPic: HTTP + 'v2.0/image/upload',
    //22.上传视频
    uploadVideo: HTTP + 'v2.0/image/uploadVideo',
    //23.帮助中心
    helpCenter: HTTP + 'v2.0/setting/helpCenter',
    //24.积分首页
    integralIndex: HTTP + 'v2.0/integral/index',
    //25.积分分类列表
    integralClassify: HTTP + 'v2.0/integral/classify',
    //26.积分签到
    sign: HTTP + 'v2.0/integral/sign',
    //27.积分商品列表
    integralGoods: HTTP + 'v2.0/integral/goods',
    //28.积分明细
    integralDetail: HTTP + 'v2.0/integral/detail',
    //29.积分商品详情
    integralView: HTTP + 'v2.0/integral/view',
    //30.兑换展示
    integralConversion: HTTP + 'v2.0/integral/conversion',
    //31.积分任务
    integralTask: HTTP + 'v2.0/integral/task',
    //32.兑换商品
    integralConfirm: HTTP + 'v2.0/integral/redemption',
    //33.兑换商品加余额
    redemptionMoney: HTTP + 'v2.0/integral/redemptionMoney',
    //34.兑换记录
    integralRecord: HTTP + 'v2.0/integral/conversionRecord',
    //35.兑换记录详情
    integralOrder: HTTP + 'v2.0/integral/conversionView',
    //36.确认收货
    confirmReceipt: HTTP + 'v2.0/integral/confirmReceipt',
    //37.商品分类
    classifyParent: HTTP + 'v2.0/goodsClassify/parent',
    //38.下级分类
    subClassify: HTTP + 'v2.0/goodsClassify/subordinate',
    //39.热门搜索
    hotSearch: HTTP + 'v2.0/search/hot',
    //40.商品列表
    goodList: HTTP + 'v2.0/goods/index',
    //41.商品详情
    goodsView: HTTP + 'v2.0/goods/view',
    //42.商品评价
    evaluateList: HTTP + 'v2.0/goods/evaluateList',
    //43.商品购物券列表
    goodCouponList: HTTP + 'v2.0/goods/couponList',
    //44.商品属性
    attrFind: HTTP + 'v2.0/goods/attrFind',
    //45.收藏商品
    collectGoods: HTTP + 'v2.0/goods/collectGoods',
    //46.取消收藏
    collectDelete: HTTP + 'v2.0/goods/viewCollectGoodsDelete',
    //47.收藏列表
    collectGoodsList: HTTP + 'v2.0/goods/collectGoodsList',
    //48.收藏列表取消收藏
    collectGoodsDelete: HTTP + 'v2.0/goods/collectGoodsDelete',
    //49.登录
    login: HTTP + 'v2.0/appletMy/login',
    //50.店铺头部
    storeHead: HTTP + 'v2.0/store/head',
    //51.店铺首页
    storeIndex: HTTP + 'v2.0/store/index',
    //52.店铺全部商品
    storeGoodsList: HTTP + 'v2.0/store/goodsList',
    //53.店铺新品
    newProductList: HTTP + 'v2.0/store/newProductList',
    //54.店铺热门分类
    storeHotClassifyList: HTTP + 'v2.0/store/hotClassifyList',
    //55.店铺分类
    storeClassifyList: HTTP + 'v2.0/store/classifyList',
    //56.店铺详情
    storeInfo: HTTP + 'v2.0/store/info',
    //57.收藏店铺
    collectStore: HTTP + 'v2.0/store/collectStore',
    //58.取消收藏店铺
    storeIndexDelete: HTTP + 'v2.0/store/viewCollectStoreDelete',
    //59.收藏店铺列表
    collectStoreList: HTTP + 'v2.0/store/collectStoreList',
    //60.删除收藏店铺
    collectStoreDelete: HTTP + 'v2.0/store/collectStoreDelete',
    //61.店铺动态
    storeArticleList: HTTP + 'v2.0/store/articleList',
    //62.店铺动态
    articleView: HTTP + 'v2.0/store/articleView',
    //63.附近店铺
    storeNearbyList: HTTP + 'v2.0/store/nearbyList',
    //64.发现好店
    storeGoodList: HTTP + 'v2.0/store/goodList',
    //65.搜索店铺
    storeSearchList: HTTP + 'v2.0/store/searchList',
    //66.领券中心
    couponCenter: HTTP + 'v2.0/coupon/get',
    //67.换券中心 
    couponExchangeList: HTTP + 'v2.0/coupon/exchange',
    //68.换券详情
    couponExchangeView: HTTP + 'v2.0/coupon/exchangeView',
    //69.换券促销列表
    couponGoodsList: HTTP + 'v2.0/coupon/goodsList',
    //70.领取优惠券
    getCoupon: HTTP + 'v2.0/memberCoupon/get',
    //71.换取优惠券
    exchangeCoupon: HTTP + 'v2.0/memberCoupon/exchange',
    //72.我的优惠券
    memberCoupon: HTTP + 'v2.0/memberCoupon/index',
    //73.我的红包
    memberPacket: HTTP + 'v2.0/memberPacket/index',
    //74.好物推荐 精选
    choicenessList: HTTP + 'v2.0/goods/choicenessList',
    //75.好物推荐列表
    goodRecommendList: HTTP + 'v2.0/goods/goodRecommendList',
    //76.浏览记录
    recordGoods: HTTP + 'v2.0/recordGoods/index',
    //77.删除记录
    deleteRecord: HTTP + 'v2.0/recordGoods/delete',
    //78.限时抢购分类
    timeLimit: HTTP + 'v2.0/timeLimit/classify',
    //79.限时抢购商品
    limitList: HTTP + 'v2.0/timeLimit/index',
    //80.加入购物车
    cartCreate: HTTP + 'v2.0/cart/create',
    //81.购物车列表
    cartIndex: HTTP + 'v2.0/cart/index',
    //82.购物车增加
    cartAdd: HTTP + 'v2.0/cart/addNumber',
    //83.购物车减少
    cartReduce: HTTP + 'v2.0/cart/reduceNumber',
    //84.商品规格
    cartAttr: HTTP + 'v2.0/cart/attr',
    //85.商品
    cartUpdate: HTTP + 'v2.0/cart/update',
    //86.购物车删除
    cartDelete: HTTP + 'v2.0/cart/delete',
    //87.购物车收藏
    cartCollect: HTTP + 'v2.0/cart/collect',
    //88.店铺优惠券
    cartCouponList: HTTP + 'v2.0/cart/couponList',
    //89.购物车确认订单
    cartConfirmOrder: HTTP + 'v2.0/cart/confirmOrder',
    //90.城市列表
    areaIndex: HTTP + 'v2.0/area/index',
    //91.砍价列表
    bargainIndex: HTTP + 'v2.0/bargain/index',
    //92.立即砍价
    bargainImmediately: HTTP + 'v2.0/bargain/immediately',
    //93.我的砍价列表
    myBargain: HTTP + 'v2.0/bargain/myCut',
    //94.砍价详情
    cutDetail: HTTP + 'v2.0/bargain/myCutView',
    //95.帮忙砍价
    cutHelp: HTTP + 'v2.0/bargain/myCutHelp',
    //96.充值列表
    rechargeList: HTTP + 'v2.0/recharge/index',
    //97.商品排行榜
    goodsRanking: HTTP + 'v2.0/home/goodsRanking',
    //98.店铺排行榜
    storeRanking: HTTP + 'v2.0/home/storeRanking',
    //99.品牌甄选分类
    brandClassList: HTTP + 'v2.0/home/brandClassList',
    //100.品牌甄选列表
    brandList: HTTP + 'v2.0/home/brandList',
    //101.热点
    hotList: HTTP + 'v2.0/home/hotList',
    //102.热点详情
    hotView: HTTP + 'v2.0/home/hotView',
    //103.收藏文章列表
    articleList: HTTP + 'v2.0/home/articleList',
    //104.收藏文章
    collectArticle: HTTP + 'v2.0/home/collectArticle',
    //105.取消收藏
    viewCollectArticleDelete: HTTP + 'v2.0/home/viewCollectArticleDelete',
    //106.取消收藏
    collectArticleDelete: HTTP + 'v2.0/home/collectArticleDelete',
    //107.首页
    index: HTTP + 'v2.0/index/index',
    //限时抢购
    indexCurLimitList: HTTP + 'v2.0/index/curLimitList',
    //108.新人专享礼包
    newGift: HTTP + 'v2.0/index/couponList',
    //109.获取专享礼包
    getGift: HTTP + 'v2.0/index/getCoupon',
    //110.购物车数量
    cartNumber: HTTP + 'v2.0/cart/number',
    //111.订单列表
    orderList: HTTP + 'v2.0/order/orderList',
    //112.取消订单
    cancelOrder: HTTP + 'v2.0/order/cancel',
    //113.删除订单
    deleteOrder: HTTP + 'v2.0/order/destroyOrder',
    //114.确认订单
    confirmCollect: HTTP + 'v2.0/order/updateOrderStatus',
    //115.订单退款
    refundAndReturn: HTTP + 'v2.0/order/refundAndReturn',
    //116.消息通知
    messageList: HTTP + 'v2.0/message/index',
    //117.余额记录
    balanceRecord: HTTP + 'v2.0/recharge/balanceRecord',
    //118.消息统计
    messageStatistics: HTTP + 'v2.0/message/statistics',
    //119.积分说明
    integralHelp: HTTP + 'v2.0/html/articleView?articleId=27',
    //120.订单详情
    orderDetails: HTTP + 'v2.0/order/orderDetails',
    //121.确认订单
    commonConfirmOrder: HTTP + 'v2.0/cart/commonConfirmOrder',
    //122.拼团分类列表
    groupClassIndex: HTTP + 'v2.0/group/classIndex',
    //123.拼团列表
    groupIndex: HTTP + 'v2.0/group/index',
    //124.我的拼团
    groupMyIndex: HTTP + 'v2.0/group/myIndex',
    //125.拼团详情
    groupView: HTTP + 'v2.0/group/view',
    //126.提交订单
    orderConfirm: HTTP + 'v2.0/order/confirm',
    //127.余额支付
    balanceExec: HTTP + 'v2.0/balance/exec',
    //128.邀请好友数据
    packetIndex: HTTP + 'v2.0/packet/index',
    //129.售后订单列表
    orderAfterSaleList: HTTP + 'v2.0/order/orderAfterSaleList',
    //130.退款详情
    refundDetails: HTTP + 'v2.0/order/refundDetails',
    //131.物流详情
    expressView: HTTP + 'v2.0/express/view',
    //132.降价通知
    depreciateGoods: HTTP + 'v2.0/goods/depreciateGoods',
    //133.web页 活动规则
    collageRuleWeb: HTTP + 'v2.0/html/articleView?articleId=20',
    //砍价规则
    bargainRuleWeb: HTTP + 'v2.0/html/articleView?articleId=21',
    //134.充值说明
    rechargeWeb: HTTP + 'v2.0/html/articleView?articleId=24',
    //134.购物流程
    processWeb: HTTP + 'v2.0/html/articleView?articleId=28',
    //135.优惠券使用
    couponWeb: HTTP + 'v2.0/html/articleView?articleId=29',
    //136.同城配送说明
    cityWeb: HTTP + 'v2.0/html/articleView?articleId=30',
    //137.配送服务费说明
    deliveryServiceWeb: HTTP + 'v2.0/html/articleView?articleId=31',
    //138.在线支付说明
    payOnlineWeb: HTTP + 'v2.0/html/articleView?articleId=32',
    //139.门店自提说明
    storeSelfWeb: HTTP + 'v2.0/html/articleView?articleId=33',
    //140.撤销退换货
    revokeApply: HTTP + 'v2.0/order/revokeApply',
    //141.物流列表
    expressList: HTTP + 'v2.0/express/expressList',
    //142.填写退货物流
    returnConfirmed: HTTP + 'v2.0/order/returnConfirmed',
    //143.发表评价
    evaluateReport: HTTP + 'v2.0/evaluate/report',
    //144.创建店铺
    createStore: HTTP + 'v2.0/my/createStore',
    //145.门店自提列表
    takeList: HTTP + 'v2.0/goods/takeList',
    //146.配送说明
    shippingInstructions: HTTP + 'v2.0/goods/shippingInstructions',
    //147.成长值
    myTask: HTTP + 'v2.0/my/task',
    //148会员卡
    rankCard: HTTP + 'v2.0/rank/card',
    //149线下订单
    orderUnderLineList: HTTP + 'v2.0/order/orderUnderLineList',
    //150会员卡web
    indexWeb: HTTP + 'v2.0/my/indexWeb',
    //151微信支付
    wxPay: HTTP + 'v2.0/appletPay/payment',
    //152充值生成订单号
    commonOrder: HTTP + 'v2.0/commonOrder/number',
    //153微信充值
    appletPayRecharge: HTTP + 'v2.0/appletPay/recharge',
    //154待评价订单
    orderEvaluateList: HTTP + 'v2.0/order/orderEvaluateList',
    //155我的评价
    myEvaluateList: HTTP + 'v2.0/evaluate/myEvaluateList',
    //156会员专享价web
    premiumPrice: HTTP + 'v2.0/rank/premiumPrice',
    //157支付密码
    payRecharge: HTTP + 'v2.0/pay/recharge',
    //158拼团信息列表
    groupMsgList: HTTP + 'v2.0/order/groupMsgList',
    //159付款码
    paymentCode: HTTP + 'v2.0/my/paymentCode',
    //160店铺服务
    shopServiceWeb: HTTP + 'v2.0/html/articleView?articleId=34',
    //161主营类目店铺
    shopCategoryWeb: HTTP + 'v2.0/html/articleView?articleId=35',
    //162 面对面扫码
    faceCode: HTTP + 'v2.0/appletMy/faceCode',
    //163邀请活动规则
    redPocketRule: HTTP + 'v2.0/html/appletArticleView?articleId=19',
    //164注册协议
    registWeb: HTTP + 'v2.0/html/articleView?articleId=17',
    //165web
    serviceWeb: HTTP + 'v2.0/html/articleView?articleId=',
    //167客服热线
    hotline: HTTP + 'v2.0/setting/hotline',
    //168分享按钮
    shareBtn: HTTP + 'v2.0/share/text',
    //169分享
    notify: HTTP + 'v2.0/share/notify',
    //170平台店铺主营分类
    platformClassify: HTTP + 'v2.0/store/platformClassify',
    //171注释
    label: HTTP + 'v2.0/share/test',
    //172抽奖详情
    activityGoodsList: HTTP + 'v2.0/lotteryActivity/activityGoodsList',
    //173抽奖
    lotteryActivity: HTTP + 'v2.0/lotteryActivity/draw',
    //174我的抽奖
    lotteryActivityList: HTTP + 'v2.0/lotteryActivity/orderList',
    //175抽奖确认到货
    confirmTake: HTTP + 'v2.0/lotteryActivity/confirmTake',
    //176填写抽奖收货地址
    setAddres: HTTP + 'v2.0/lotteryActivity/setAddres',
    //177抽奖分享
    shareActivity: HTTP + 'v2.0/lotteryActivity/shareActivity',
    //178达达快递
    dadaExpress: HTTP + 'v2.0/express/dadaExpress',
    //179忘记支付密码
    forgetPayPassword: HTTP + 'v2.0/setting/forgetPayPassword',
    //180修改登录密码
    dUpdatePassword: HTTP + 'v2.0/setting/updatePassword',
    //181抽奖规则
    drawActivityView: HTTP + 'v2.0/html/drawActivityView',
    //182积分删除订单
    conversionRecordDelete: HTTP + 'v2.0/integral/conversionRecordDelete',
    //183积分微信支付
    pointsRedemption: HTTP + 'v2.0/appletPay/pointsRedemption',
    //获取订单状态
    orderGetOrderState: HTTP + 'v2.0/order/getOrderState',
    // 是否创建店铺
    myGetInState: HTTP + 'v2.0/my/getInState',
    customerGetStoreInfo: HTTP + 'v2.0/customer/getStoreInfo',
    //积分下订单
    integralPreOrder: HTTP + 'v2.0/integral/preOrder',
    //增加广告点击数
    indexAdBrowseInc: HTTP + 'v2.0/index/adBrowseInc',
    //185代言收益首页
    dyEearningsView: HTTP + 'v2.0/distributionMy/earningsView',
    //186代言收益提现首页
    distributionWithdrawalIndex: HTTP + 'v2.0/distributionWithdrawal/index',
    //187代言收益提现
    distributionWithdrawalToApply: HTTP + 'v2.0/distributionWithdrawal/toApply',
    //188代言提现记录
    distributionWithdrawalRecord: HTTP + 'v2.0/distributionWithdrawal/record',
    //189代言粉丝列表
    distributionMyFans: HTTP + 'v2.0/distributionMy/fans',
    //190代言申请代言
    distributionBecomeApply: HTTP + 'v2.0/distributionBecome/apply',
    //191代言收益详情
    distributionMyEarningsDetails: HTTP + 'v2.0/distributionMy/earningsDetails',
    //192代言代言升降记录
    distributionLevelChangeRecord: HTTP + 'v2.0/distributionLevel/changeRecord',
    //193代言申请代言设置
    distributionFormSet: HTTP + 'v2.0/distributionBecome/distributionFormSet',
    //194代言规则
    tobeDistributorRule: HTTP + 'v2.0/distributionBecome/tobeDistributorRule',
    //195代言我的代言等级
    distributionMyLevel: HTTP + 'v2.0/distributionLevel/myLevel',
    //196代言说明
    distributionMyExplain: HTTP + 'v2.0/distributionMy/explain',
    //197代言邀请你代言
    distributionYq: HTTP + 'v2.0/distributionShare/toInvite',
    //198代言人商信息
    distributionShareInfo: HTTP + 'v2.0/distributionShare/getInfo',
    //199代言商品列表
    distributionGoodsList: HTTP + 'v2.0/distributionGoods/goodsList',
    //200绑定代言人关系
    distributionBindDistribution: HTTP + 'v2.0/distributionShare/bindDistribution',
    //
    distributionQueryPoint: HTTP + 'v2.0/distributionBecome/queryPoint',
    //
    distributionJumpSign: HTTP + 'v2.0/share/jumpSign',
    //
    distributionVipTurnDist: HTTP + 'v2.0/distributionBecome/vipTurnDist',
    distributionGetRiseHistory: HTTP + 'v2.0/invoiceExplain/getRiseHistory',
    //201客服上传图片
    serviceUploadFile: HTTP + 'v2.0/customer/uploadFile',
    //202客服历史消息
    getChatLog: HTTP + 'v2.0/customer/getChatLog',
    //203客服店铺列表
    getCustomerList: HTTP + 'v2.0/customer/getCustomerList',
    //获得商品详情接口
    getGoodsInfo: HTTP + 'v2.0/customer/getGoodsInfo',
    //获取咨询订单
    customerGetStoreOrderList: HTTP + 'v2.0/customer/getStoreOrderList',
    // 会员获得商品列表
    customerGetGoodsList: HTTP + 'v2.0/customer/getGoodsList',
    //我的钱包
    myMyWallet: HTTP + 'v2.0/my/myWallet',
    //平台证照信息
    license: HTTP + 'v2.0/share/license',
    //发票信息
    invoiceDetail: HTTP + 'v2.0/invoiceExplain/detail',
    //收票人信息
    invoiceSupplement: HTTP + 'v2.0/invoice/supplement',
    //发票确认订单
    invoiceOrderDetail: HTTP + 'v2.0/invoice/orderDetail',
    //
    invoiceAnew: HTTP + 'v2.0/invoice/anew',
    //支付成功返回活动id
    payInfoGetPayInfo: HTTP + 'v2.0/payInfo/getPayInfo',
    //发票可开具类型
    invoiceExplainEditInvoice: HTTP + 'v2.0/invoiceExplain/editInvoice',
    //重开补开发票时保留未付款的发票信息数据
    invoiceExplainReopening: HTTP + 'v2.0/invoiceExplain/reopening',
    //重开补开发票时修改发票信息
    invoiceEdit: HTTP + 'v2.0/invoice/edit',
    //No.9重开补开发票运费为0时更改信息
    invoiceChangeStatus: HTTP + 'v2.0/invoice/changeStatus',
    //---------------------------------------------------------------------------------
    //获取FormId
    appletMySaveFormId: HTTP + 'v2.0/appletMy/saveFormId',
    //商品标签
    goodsTagClickLog: HTTP + 'v2.0/goods/tagClickLog',
    //抽奖订单详情
    lotteryActivityOrderInfo: HTTP + 'v2.0/lotteryActivity/orderInfo',
    //银行卡列表
    cardIndex: HTTP + 'v2.0/card/index',
    //添加银行卡
    cardCreate: HTTP + 'v2.0/card/create',
    //删除银行卡
    cardDestroy: HTTP + 'v2.0/card/destroy',
    //银行卡详情
    cardDetails: HTTP + 'v2.0/card/details',
    //退款金额
    orderRefundMoney: HTTP + 'v2.0/order/refundMoney',
    // 口令红包兑换
    getRedComandPacket: HTTP+ 'v2.0/red/getRedComandPacket',
    // 
    deleteEvaluate: HTTP+ 'v2.0/evaluate/deleteEvaluate'
  }
})