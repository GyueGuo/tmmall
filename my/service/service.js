// my/service/service.js
const app = getApp();
import http from '../../utils/http';
const service = require('../../utils/service.js');
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();

let recorderManagerObj = {
  duration: 60000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
  frameSize: 50
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mid: '',
    serviceInfo: {
      TARGETID: '', //接收者店铺ID
      DIVERSIONID: ''
    },
    chatType: 0, //0输入法 1语音
    serviceInput: '',
    showConfirm: false,
    fixed: true,
    spkStartY: 0,
    //聊天列表
    msglist: [],
    msglistIndex: '',
    userinfo: null,
    focus: false,
    isLogin: true,
    //功能按钮
    funbtnList: [{
        img: 'mobile/small/image/service/kf-tjtp.png',
        name: '相册',
        route: 'photo'
      }, {
        img: 'mobile/small/image/service/kf-pz.png',
        name: '拍照',
        route: 'takepictures'
      },
    ],
    serviceFun: false, //是否打开功能按钮节面
    emojiList: [], //表情列表
    isEmoji: false, //是否打开表情列表
    recorderTitle: '按住 说话', //语音按钮提示语
    recorderTime: 0, //语音时间
    recorderIndex: '', //语音播放索引
    serviceEnter: true,
    scrollTop: '',
    scrollAnimation: false,
    spkMoveY: 0,
    orderListType: false,
    orderList: [],
    listType: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let serviceInfo = ''
    if (options.serviceInfo) {
      serviceInfo = JSON.parse(options.serviceInfo)
      serviceInfo.storeTitle = decodeURIComponent(serviceInfo.storeTitle)
      if (serviceInfo.detail) {
        serviceInfo.detail.goodsName = decodeURIComponent(serviceInfo.detail.goodsName)
        serviceInfo.detail.file = decodeURIComponent(serviceInfo.detail.file)
      }
    }
    this.setData({
      diyColor: app.globalData.diyColor,
      serviceInfo: serviceInfo
    })
    app.appSocketSite = 1
    if (this.data.serviceInfo.TARGETID == '0' || app.globalData.isShops == 1) {
      wx.setNavigationBarTitle({
        title: '平台客服',
      })
    } else if (this.data.serviceInfo.TARGETID != '0' && app.globalData.isShops == 0) {
      wx.setNavigationBarTitle({
        title: this.data.serviceInfo.storeTitle,
      })
    }
    console.log(app.appSocketSite)

    //-------------------------------------------------
    //录音监听
    recorderManager.onStart(() => {
      let recorderTime = 1
      console.log('recorder start')
      this.data.recorderSet = setInterval(() => {
        recorderTime++
        this.setData({
          recorderTime: recorderTime
        })
      }, 1000)
    })
    recorderManager.onPause(() => {
      console.log('recorder pause')
    })
    recorderManager.onStop(res => {
      if (this.data.spkMoveY >= 200 || this.data.recorderTime === 0) {
        this.setData({
          spkMoveY: 0,
          recorderTime: 0
        })
        return
      }
      this.setData({
        spkMoveY: 0,
      })
      clearInterval(this.data.recorderSet)
      this.speakEnd()
      console.log(res.tempFilePath)
      if (!res.tempFilePath) {
        return
      }
      let timestamp = Date.parse(new Date())
      let list = {
        MSGTYPE: '',
        MESSAGEID: timestamp,
        FROMID: app.globalData.memberId,
        MESSAGETYPE: 'VOICE',
        HEADIMG: '',
        MESSAGEDATA: res.tempFilePath,
        VOICETIME: this.data.recorderTime,
        voiceplayType: '0'
      }
      this.data.msglist.push(list)
      this.setData({
        msglist: this.data.msglist,
        msglistIndex: `id${timestamp}`
      })

      wx.uploadFile({
        url: app.globalData.serviceUploadFile,
        filePath: res.tempFilePath,
        name: 'file',
        success: resData => {
          let data = JSON.parse(resData.data)
          console.log(data)
          let DATA = {
            "MESSAGEID": timestamp.toString(), // 字符串类型的毫秒级时间戳
            "MESSAGETYPE": 'VOICE', // 文本
            "MESSAGEDATA": data.ossUrl, // 消息内容
            "TARGETTYPE": "CUSTOMER", // 接收者用户类型
            "TARGETID": this.data.serviceInfo.TARGETID.toString(), // 接收者店铺ID
            "DIVERSIONID": this.data.serviceInfo.DIVERSIONID.toString(), //客服分流ID
            "VOICETIME": this.data.recorderTime.toString()
          }
          this.socketSend(DATA)
          this.setData({
            recorderTime: 0
          })
        }
      })
    })
    innerAudioContext.onEnded(res => {
      this.data.msglist[this.data.recorderIndex].voiceplayType = 0
      this.setData({
        msglist: this.data.msglist
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let swiperArr = [],
      itemArr = [];
    for (let i = 0, len = service.emoji.length; i < len; i += 24) {
      swiperArr.push(service.emoji.slice(i, i + 24))
    }
    this.setData({
      emojiList: swiperArr
    })
    this.history()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      mid: app.globalData.memberId
    })
    if (this.data.userinfo == null) {
      this.getUserinfo()
    }
    this.getStoreinfo()
    console.log('客服进入')
    if (app.globalData.memberId == '') {
      return
    }
    setTimeout(() => {
      //预聊天消息
      let data = {
        "TYPE": "MATCH_CUSTOMER",
        "DATA": {
          "TARGETID": this.data.serviceInfo.TARGETID.toString(),
          "DIVERSIONID": this.data.serviceInfo.DIVERSIONID.toString()
        }
      }
      app.appSocket.send({
        data: JSON.stringify(data),
        success: res => {
          console.log(res)
          app.socketOnMessage('serviceRoom', this)
        },
        fail: res => {},
      })
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    innerAudioContext.stop()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    app.appSocketSite = 0
    innerAudioContext.stop()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 获取个人信息
   */
  getUserinfo() {
    http.post(app.globalData.myInfo, {}).then(res => {
      this.setData({
        userinfo: res.result
      })
    })
  },
  /**
   * 获取店铺信息
   */
  getStoreinfo() {
    http.post(app.globalData.customerGetStoreInfo, {
      storeId: this.data.serviceInfo.TARGETID
    }).then(res => {
      this.setData({
        storeinfo: res.data
      })
    })
  },
  /**
   * 输入文本
   */
  serviceText(e) {
    this.setData({
      serviceInput: e.detail.value
    })
  },
  /**
   * 发送方式
   */
  serviceType() {
    this.setData({
      chatType: this.data.chatType == 0 ? 1 : 0,
      serviceFun: false,
      isEmoji: false
    })
  },
  /**
   * 按住
   */
  speakStart(e) {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.record']) {
          wx.vibrateShort()
          innerAudioContext.stop()
          let spkStartY = e.touches["0"].pageY
          this.setData({
            spkStartY: spkStartY,
            recorderTitle: '松开 结束'
          })
          recorderManager.start(recorderManagerObj)
        }
      }
    })
  },
  /**
   * 按住移动
   */
  speakMove(e) {
    let pageY = e.touches["0"].pageY
    this.setData({
      spkMoveY: this.data.spkStartY - pageY
    })
  },
  /**
   * 松开
   */
  speakEnd(e) {
    setTimeout(res => {
      this.setData({
        spkStartY: 0,
        recorderTitle: '按住 说话'
      })
      recorderManager.stop()
    }, 300)
  },
  /**
   * 发送
   * MESSAGEID 字符串类型的毫秒级时间戳
   * MESSAGETYPE 文本
   * MESSAGEDATA 消息内容
   * TARGETID 接收者店铺ID
   * DIVERSIONID 客服分流ID
   */
  submit() {
    if (this.data.serviceInput == '' || this.data.serviceInput.length == 0) {
      return
    }
    console.log('fa')
    let timestamp = Date.parse(new Date())
    let list = {
      MSGTYPE: '',
      MESSAGEID: timestamp,
      FROMID: app.globalData.memberId,
      MESSAGETYPE: 'TEXT',
      HEADIMG: '',
      MESSAGEDATA: this.data.serviceInput,
      VOICETIME: '',
      voiceplayType: '0'
    }
    this.data.msglist.push(list)
    this.setData({
      msglist: this.data.msglist,
      msglistIndex: `id${timestamp}`
    })
    let DATA = {
      "MESSAGEID": timestamp.toString(), // 字符串类型的毫秒级时间戳
      "MESSAGETYPE": 'TEXT', // 文本
      "MESSAGEDATA": this.data.serviceInput, // 消息内容
      "TARGETTYPE": "CUSTOMER", // 接收者用户类型
      "TARGETID": this.data.serviceInfo.TARGETID.toString(), // 接收者店铺ID
      "DIVERSIONID": this.data.serviceInfo.DIVERSIONID.toString(), //客服分流ID
      "VOICETIME": ''
    }
    this.socketSend(DATA)
    this.setData({
      serviceInput: ''
    })
  },

  /**
   * 发送消息
   */
  socketSend(DATA) {
    let data = {
      "TYPE": "MESSAGE",
      "DATA": {
        "MESSAGEID": DATA.MESSAGEID, // 字符串类型的毫秒级时间戳
        "MESSAGETYPE": DATA.MESSAGETYPE, // 文本
        "MESSAGEDATA": DATA.MESSAGEDATA, // 消息内容
        "TARGETTYPE": "CUSTOMER", // 接收者用户类型
        "TARGETID": DATA.TARGETID, // 接收者店铺ID
        "DIVERSIONID": DATA.DIVERSIONID, //客服分流ID
        "VOICETIME": DATA.VOICETIME
      }
    }

    app.appSocket.send({
      data: JSON.stringify(data),
      success: res => {
        console.log(res)
        for (let i = 0, len = this.data.msglist.length; i < len; i++) {
          if (DATA.MESSAGEID == this.data.msglist[i].MESSAGEID) {
            let list = {
              MSGTYPE: 'success',
              MESSAGEID: DATA.MESSAGEID,
              FROMID: app.globalData.memberId,
              MESSAGETYPE: DATA.MESSAGETYPE,
              HEADIMG: '',
              MESSAGEDATA: DATA.MESSAGETYPE == 'TEXT' ? this.chat(DATA.MESSAGEDATA) : DATA.MESSAGEDATA,
              VOICETIME: DATA.VOICETIME == undefined ? '' : DATA.VOICETIME,
              voiceplayType: '0'
            }
            this.data.msglist[i] = list
            this.setData({
              msglist: this.data.msglist
            })
            break;
          }
        }
      },
      fail: res => {
        for (let i = 0, len = this.data.msglist.length; i < len; i++) {
          if (DATA.MESSAGEID == this.data.msglist[i].MESSAGEID) {
            let list = {
              MSGTYPE: 'error',
              MESSAGEID: DATA.MESSAGEID,
              FROMID: app.globalData.memberId,
              MESSAGETYPE: DATA.MESSAGETYPE,
              HEADIMG: '',
              MESSAGEDATA: DATA.MESSAGETYPE == 'TEXT' ? this.chat(DATA.MESSAGEDATA) : DATA.MESSAGEDATA,
              VOICETIME: DATA.VOICETIME == undefined ? '' : DATA.VOICETIME,
              voiceplayType: '0'
            }
            this.data.msglist[i] = list
            this.setData({
              msglist: this.data.msglist
            })
            break;
          }
        }
      },
    })
  },

  /**
   * 获取图片尺寸
   */
  msgImage(e) {
    console.log(e)
    this.setData({
      msgImageWidth: e.detail.width / 2
    })
  },
  /**
   * 预览图片
   */
  preview(e) {
    console.log(e.currentTarget.dataset.url)
    let urls = []
    for (let arr of this.data.msglist) {
      if (arr.MESSAGETYPE == 'IMAGE') {
        urls.push(arr.MESSAGEDATA)
      }
    }
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: urls
    })
  },
  /**
   * 相册
   */
  photoUploadFile(sourceType) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: sourceType,
      success: res => {
        let tempFilePaths = res.tempFilePaths
        for (let i = 0; i < tempFilePaths.length; i++) {
          let timestamp = Date.parse(new Date()) + i
          let list = {
            MSGTYPE: '',
            MESSAGEID: timestamp,
            FROMID: app.globalData.memberId,
            MESSAGETYPE: 'IMAGE',
            HEADIMG: '',
            MESSAGEDATA: tempFilePaths[i],
            VOICETIME: '',
            voiceplayType: '0'
          }
          this.data.msglist.push(list)
          this.setData({
            msglist: this.data.msglist,
            msglistIndex: `id${timestamp}`
          })

          wx.uploadFile({
            url: app.globalData.serviceUploadFile,
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              user: 'test'
            },
            success: resData => {
              let data = JSON.parse(resData.data)
              console.log(data)
              let DATA = {
                "MESSAGEID": timestamp.toString(), // 字符串类型的毫秒级时间戳
                "MESSAGETYPE": 'IMAGE', // 文本
                "MESSAGEDATA": data.ossUrl, // 消息内容
                "TARGETTYPE": "CUSTOMER", // 接收者用户类型
                "TARGETID": this.data.serviceInfo.TARGETID.toString(), // 接收者店铺ID
                "DIVERSIONID": this.data.serviceInfo.DIVERSIONID.toString(), //客服分流ID
                "VOICETIME": ''
              }
              this.socketSend(DATA)
            }
          })
        }
      }
    })
  },
  /**
   * 按钮
   */
  serviceFunbtn(e) {
    let sourceType
    switch (e.currentTarget.dataset.item.route) {
      case 'photo':
        sourceType = ['album', 'camera']
        this.photoUploadFile(sourceType)
        break;
      case 'takepictures':
        sourceType = ['camera']
        this.photoUploadFile(sourceType)
        break;
      case 'goods':
        this.setData({
          template: 'goods'
        })
        this.xzGoods()
        break;
      case 'order':
        this.setData({
          template: 'order'
        })
        this.xzOrder()
        break;
    }

  },
  inputtap() {
    this.setData({
      serviceFun: false,
      isEmoji: false,
      focus: true
    })
  },
  /**
   * 
   */
  serviceFun() {
    this.setData({
      serviceFun: !this.data.serviceFun,
      chatType: 0,
      isEmoji: false
    })
  },

  viewReset() {
    this.setData({
      serviceFun: false,
      isEmoji: false
    })
  },
  /**
   * 发表情
   */
  chat(text) {
    let reg1 = /\[[\u4e00-\u9fa5]+\]/g
    let emojiArr, textArr
    try {
      emojiArr = text.match(reg1)
      textArr = text.split(/\[|\]/)
      let emoji = []
      let obj = {}
      for (let i = 0, len = textArr.length; i < len; i++) {
        obj = {
          type: 'text',
          data: textArr[i]
        }
        emoji.push(obj)
        for (let j = 0, len = service.emoji.length; j < len; j++) {
          if (`[${textArr[i]}]` == service.emoji[j].name) {
            obj = {
              type: 'emoji',
              data: service.emoji[j].url
            }
            emoji[i] = obj
          }
        }
      }
      return emoji
    } catch (err) {
      let emoji = []
      let obj = {}
      obj = {
        type: 'text',
        data: text
      }
      emoji.push(obj)
      return emoji
    }
  },
  /**
   * 选择表情
   */
  emojiBtn(e) {
    this.setData({
      serviceInput: `${this.data.serviceInput}${e.currentTarget.dataset.item.name}`
    })
  },
  /**
   * 删除
   */
  emojiDel(e) {
    this.setData({
      serviceInput: `${this.data.serviceInput}${e.currentTarget.dataset.item.name}`
    })
  },
  /**
   * 
   */
  emojiType() {
    this.setData({
      serviceFun: false,
      isEmoji: !this.data.isEmoji
    })
  },

  /**
   * 播放语音
   */
  recorderPlay(e) {
    let index = e.currentTarget.dataset.index
    let src = e.currentTarget.dataset.src
    innerAudioContext.stop()
    for (let i = 0, len = this.data.msglist.length; i < len; i++) {
      if (index == i) {
        this.data.msglist[i].voiceplayType = 1
      } else {
        this.data.msglist[i].voiceplayType = 0
      }
    }
    this.setData({
      msglist: this.data.msglist,
      recorderIndex: index
    })
    innerAudioContext.obeyMuteSwitch = false
    wx.setInnerAudioOption({
      obeyMuteSwitch: false
    })
    innerAudioContext.src = src
    setTimeout(res => {

    }, 300)
    innerAudioContext.play()
  },
  /**
   * 获取历史消息
   */
  history() {
    let lastId = 0,
      firstMessageTime = 0;
    if (this.data.msglist.length != 0) {
      lastId = this.data.msglist[0].id
      firstMessageTime = this.data.msglist[0].MESSAGEID
      this.setData({
        scrollAnimation: false
      })
    }
    http.post(app.globalData.getChatLog, {
      limit: 10,
      storeId: this.data.serviceInfo.TARGETID,
      lastId: lastId,
      memberId: app.globalData.memberId,
      firstMessageTime: firstMessageTime
    }).then(res => {
      let listCon = res.data
      if (listCon.length != 0) {
        let listChat = []
        for (let i = 0, len = listCon.length; i < len; i++) {
          let obj = {
            id: listCon[i].id,
            MSGTYPE: 'success',
            MESSAGEID: listCon[i].message.MESSAGEID,
            FROMID: listCon[i].message.FROMID,
            MESSAGETYPE: listCon[i].message.MESSAGETYPE,
            HEADIMG: '',
            MESSAGEDATA: listCon[i].message.MESSAGETYPE == 'TEXT' ? this.chat(listCon[i].message.MESSAGEDATA) : listCon[i].message.MESSAGEDATA,
            VOICETIME: listCon[i].message.VOICETIME,
            GOODSDATA: null,
          }
          listChat.push(obj)

          if (listCon[i].message.MESSAGETYPE == 'GOODS') {
            http.post(app.globalData.getGoodsInfo, {
              goodsId: listCon[i].message.MESSAGEDATA
            }).then(ress => {
              let goodsData = ress.data
              for (let j = 0, len = this.data.msglist.length; j < len; j++) {
                if (listCon[i].id == this.data.msglist[j].id) {
                  console.log(goodsData)
                  this.data.msglist[j].GOODSDATA = goodsData
                  this.setData({
                    msglist: this.data.msglist
                  })
                  break;
                }
              }
            })
          }
        }
        this.data.msglist = [...listChat, ...this.data.msglist]
        this.setData({
          msglist: this.data.msglist
        })
        if (this.data.serviceEnter) {
          this.setData({
            msglistIndex: `id${listCon[listCon.length - 1].message.MESSAGEID}`
          })
        } else {
          this.setData({
            scrollTop: this.data.scrollTops
          })
        }
      }
    })
  },

  bindscrolltolower() {
    this.setData({
      scrollAnimation: true
    })
  },

  bindscroll(e) {
    if (this.data.serviceEnter) {
      this.setData({
        scrollTops: e.detail.scrollTop,
        serviceEnter: false
      })
    }
  },

  /**
   * 进店
   */
  goShop(e) {
    //店铺id
    let storeId = e.currentTarget.dataset.data
    wx.navigateTo({
      url: `/nearbyShops/shopDetail/shopDetail?storeId=${storeId}`,
    })
  },
  /**
   * 去商品详情
   */
  goGoods(e) {
    //店铺id
    let goodsId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/nearbyShops/goodDetail/goodDetail?goodsId=${goodsId}`,
    })
  },
  /**
   * 发送商品链接
   */
  goodslink(e) {
    //商品id
    const goodsId = e.currentTarget.dataset.id
    let timestamp = Date.parse(new Date())
    let list = {
      MSGTYPE: '',
      MESSAGEID: timestamp,
      FROMID: app.globalData.memberId,
      MESSAGETYPE: 'GOODS',
      HEADIMG: '',
      MESSAGEDATA: goodsId,
      VOICETIME: '',
      voiceplayType: '0',
      GOODSDATA: null
    }
    this.data.msglist.push(list)
    this.setData({
      msglist: this.data.msglist,
      msglistIndex: `id${timestamp}`
    })
    let DATA = {
      "MESSAGEID": timestamp.toString(), // 字符串类型的毫秒级时间戳
      "MESSAGETYPE": 'GOODS', // 文本
      "MESSAGEDATA": goodsId.toString(), // 消息内容
      "TARGETTYPE": "CUSTOMER", // 接收者用户类型
      "TARGETID": this.data.serviceInfo.TARGETID.toString(), // 接收者店铺ID
      "DIVERSIONID": this.data.serviceInfo.DIVERSIONID.toString(), //客服分流ID
      "VOICETIME": ''
    }
    this.socketSend(DATA)
    http.post(app.globalData.getGoodsInfo, {
      goodsId: goodsId
    }).then(res => {
      const goodsData = res.data
      for (let i = 0, len = this.data.msglist.length; i < len; i++) {
        if (this.data.msglist[i].MESSAGEID == timestamp) {
          this.data.msglist[i].GOODSDATA = goodsData
          this.setData({
            msglist: this.data.msglist
          })
          break;
        }
      }
    })
  },

  /**
   * 选择咨询订单
   */
  xzOrder() {
    this.showUp()
    http.post(app.globalData.customerGetStoreOrderList, {
      memberId: app.globalData.memberId,
      storeId: this.data.serviceInfo.TARGETID,
    }).then(res => {
      this.setData({
        orderList: res.data.data,
      })
    })
  },

  /**
   * 选择咨询商品
   */
  xzGoods() {
    this.showUp()
    http.post(app.globalData.customerGetGoodsList, {
      memberId: app.globalData.memberId,
      listType: this.data.listType,
    }).then(res => {
      this.setData({
        orderList: res.data.data,
      })
    })
  },

  /**
   * 关闭弹出层
   */
  popupsClose() {
    this.showDown()
  },

  showUp() {
    this.setData({
      orderListType: true,
    })
    this.fadeIn()
    setTimeout(() => {
      let animation = wx.createAnimation({
        duration: 400,
        timingFunction: 'ease',
      })
      this.animation = animation
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }, 100)

  },
  showDown() {
    let animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.translateY(wx.getSystemInfoSync().windowHeight).step()
    this.setData({
      animationData: animation.export()
    })
    setTimeout(() => {
      this.setData({
        orderListType: false,
      })
    }, 400)
    this.fadeOut()
  },
  /**
   * 淡入效果
   */
  fadeIn() {
    setTimeout(() => {
      let animation = wx.createAnimation({
        duration: 400,
        timingFunction: 'ease',
      })
      this.animation = animation
      animation.backgroundColor('rgba(0,0,0,0.5)').step()
      this.setData({
        animationFade: animation.export()
      })
    }, 100)
  },

  /**
   * 淡出效果
   */
  fadeOut() {
    let animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.backgroundColor('transparent').step()
    this.setData({
      animationFade: animation.export()
    })
  },
})