// my/service/service.js
const app = getApp();
const http = require('../../utils/http.js');
const service = require('../../utils/service.js');
let s_socket, s_socketType = false,
  s_socketHeartTime, s_socketAgainTime;
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();

let recorderManager_obj = {
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
    service_info: {
      TARGET_ID: '', //接收者店铺ID
      DIVERSION_ID: ''
    },
    chatType: 0, //0输入法 1语音
    service_input: '',
    show_confirm: false,
    fixed: true,
    spkStartY: 0,
    //聊天列表
    msglist: [],
    msglist_index: '',
    userinfo: null,
    focus: false,
    isLogin: true,
    //功能按钮
    funbtn_list: [{
        img: 'mobile/small/image/service/kf-tjtp.png',
        name: '相册',
        route: 'photo'
      }, {
        img: 'mobile/small/image/service/kf-pz.png',
        name: '拍照',
        route: 'takepictures'
      },
      // {
      //   img: 'mobile/small/image/service/btn-goods.png',
      //   name: '商品',
      //   route: 'goods'
      // }, {
      //   img: 'mobile/small/image/service/btn-shops.png',
      //   name: '订单',
      //   route: 'order'
      // }
    ],
    service_fun: false, //是否打开功能按钮节面
    emojiList: [], //表情列表
    isEmoji: false, //是否打开表情列表
    recorderTitle: '按住 说话', //语音按钮提示语
    recorderTime: 0, //语音时间
    recorderIndex: '', //语音播放索引
    service_enter: true,
    scrollTop: '',
    scrollAnimation: false,
    spkMoveY: 0,
    orderList_type: false,
    orderList: [],
    list_type: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let service_info = ''
    if (options.service_info) {
      service_info = JSON.parse(options.service_info)
      service_info.store_title = decodeURIComponent(service_info.store_title)
      if (service_info.detail) {
        service_info.detail.goods_name = decodeURIComponent(service_info.detail.goods_name)
        service_info.detail.file = decodeURIComponent(service_info.detail.file)
      }
    }
    this.setData({
      diy_color: app.globalData.diy_color,
      service_info: service_info
    })
    app.app_socketSite = 1
    if (this.data.service_info.TARGET_ID == '0' || app.globalData.isShops == 1) {
      wx.setNavigationBarTitle({
        title: '平台客服',
      })
    } else if (this.data.service_info.TARGET_ID != '0' && app.globalData.isShops == 0) {
      wx.setNavigationBarTitle({
        title: this.data.service_info.store_title,
      })
    }
    console.log(app.app_socketSite)

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
        MSG_TYPE: '',
        MESSAGE_ID: timestamp,
        FROM_ID: app.globalData.member_id,
        MESSAGE_TYPE: 'VOICE',
        HEADIMG: '',
        MESSAGE_DATA: res.tempFilePath,
        VOICE_TIME: this.data.recorderTime,
        voiceplay_type: '0'
      }
      this.data.msglist.push(list)
      this.setData({
        msglist: this.data.msglist,
        msglist_index: `id${timestamp}`
      })

      wx.uploadFile({
        url: app.globalData.service_uploadFile,
        filePath: res.tempFilePath,
        name: 'file',
        success: resData => {
          let data = JSON.parse(resData.data)
          console.log(data)
          let DATA = {
            "MESSAGE_ID": timestamp.toString(), // 字符串类型的毫秒级时间戳
            "MESSAGE_TYPE": 'VOICE', // 文本
            "MESSAGE_DATA": data.ossUrl, // 消息内容
            "TARGET_TYPE": "CUSTOMER", // 接收者用户类型
            "TARGET_ID": this.data.service_info.TARGET_ID.toString(), // 接收者店铺ID
            "DIVERSION_ID": this.data.service_info.DIVERSION_ID.toString(), //客服分流ID
            "VOICE_TIME": this.data.recorderTime.toString()
          }
          this.socketSend(DATA)
          this.setData({
            recorderTime: 0
          })
        }
      })
    })
    //播放声音监听
    // innerAudioContext.onStop(res => {
    //   console.log(res)
    //   console.log('播放停止1')
    //   this.data.msglist[this.data.recorderIndex].voiceplay_type = 0
    //   this.setData({
    //     msglist: this.data.msglist
    //   })
    // })
    innerAudioContext.onEnded(res => {
      console.log('播放停止2')
      this.data.msglist[this.data.recorderIndex].voiceplay_type = 0
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
      mid: app.globalData.member_id
    })
    if (this.data.userinfo == null) {
      this.getUserinfo()
    }
    this.getStoreinfo()
    console.log('客服进入')
    if (app.globalData.member_id == '') {
      return
    }
    setTimeout(() => {
      //预聊天消息
      let data = {
        "TYPE": "MATCH_CUSTOMER",
        "DATA": {
          "TARGET_ID": this.data.service_info.TARGET_ID.toString(),
          "DIVERSION_ID": this.data.service_info.DIVERSION_ID.toString()
        }
      }
      app.app_socket.send({
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
    app.app_socketSite = 0
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
    http.post(app.globalData.my_info, {}).then(res => {
      this.setData({
        userinfo: res.result
      })
    })
  },
  /**
   * 获取店铺信息
   */
  getStoreinfo() {
    http.post(app.globalData.customer_getStoreInfo, {
      storeId: this.data.service_info.TARGET_ID
    }).then(res => {
      this.setData({
        storeinfo: res.data
      })
    })
  },
  /**
   * 输入文本
   */
  service_text(e) {
    this.setData({
      service_input: e.detail.value
    })
  },
  /**
   * 发送方式
   */
  service_type() {
    this.setData({
      chatType: this.data.chatType == 0 ? 1 : 0,
      service_fun: false,
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
          recorderManager.start(recorderManager_obj)
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
   * MESSAGE_ID 字符串类型的毫秒级时间戳
   * MESSAGE_TYPE 文本
   * MESSAGE_DATA 消息内容
   * TARGET_ID 接收者店铺ID
   * DIVERSION_ID 客服分流ID
   */
  submit() {
    if (this.data.service_input == '' || this.data.service_input.length == 0) {
      return
    }
    console.log('fa')
    let timestamp = Date.parse(new Date())
    let list = {
      MSG_TYPE: '',
      MESSAGE_ID: timestamp,
      FROM_ID: app.globalData.member_id,
      MESSAGE_TYPE: 'TEXT',
      HEADIMG: '',
      MESSAGE_DATA: this.data.service_input,
      VOICE_TIME: '',
      voiceplay_type: '0'
    }
    this.data.msglist.push(list)
    this.setData({
      msglist: this.data.msglist,
      msglist_index: `id${timestamp}`
    })
    let DATA = {
      "MESSAGE_ID": timestamp.toString(), // 字符串类型的毫秒级时间戳
      "MESSAGE_TYPE": 'TEXT', // 文本
      "MESSAGE_DATA": this.data.service_input, // 消息内容
      "TARGET_TYPE": "CUSTOMER", // 接收者用户类型
      "TARGET_ID": this.data.service_info.TARGET_ID.toString(), // 接收者店铺ID
      "DIVERSION_ID": this.data.service_info.DIVERSION_ID.toString(), //客服分流ID
      "VOICE_TIME": ''
    }
    this.socketSend(DATA)
    this.setData({
      service_input: ''
    })
  },

  /**
   * 发送消息
   */
  socketSend(DATA) {
    let data = {
      "TYPE": "MESSAGE",
      "DATA": {
        "MESSAGE_ID": DATA.MESSAGE_ID, // 字符串类型的毫秒级时间戳
        "MESSAGE_TYPE": DATA.MESSAGE_TYPE, // 文本
        "MESSAGE_DATA": DATA.MESSAGE_DATA, // 消息内容
        "TARGET_TYPE": "CUSTOMER", // 接收者用户类型
        "TARGET_ID": DATA.TARGET_ID, // 接收者店铺ID
        "DIVERSION_ID": DATA.DIVERSION_ID, //客服分流ID
        "VOICE_TIME": DATA.VOICE_TIME
      }
    }

    app.app_socket.send({
      data: JSON.stringify(data),
      success: res => {
        console.log(res)
        for (let i = 0, len = this.data.msglist.length; i < len; i++) {
          if (DATA.MESSAGE_ID == this.data.msglist[i].MESSAGE_ID) {
            let list = {
              MSG_TYPE: 'success',
              MESSAGE_ID: DATA.MESSAGE_ID,
              FROM_ID: app.globalData.member_id,
              MESSAGE_TYPE: DATA.MESSAGE_TYPE,
              HEADIMG: '',
              MESSAGE_DATA: DATA.MESSAGE_TYPE == 'TEXT' ? this.chat(DATA.MESSAGE_DATA) : DATA.MESSAGE_DATA,
              VOICE_TIME: DATA.VOICE_TIME == undefined ? '' : DATA.VOICE_TIME,
              voiceplay_type: '0'
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
          if (DATA.MESSAGE_ID == this.data.msglist[i].MESSAGE_ID) {
            let list = {
              MSG_TYPE: 'error',
              MESSAGE_ID: DATA.MESSAGE_ID,
              FROM_ID: app.globalData.member_id,
              MESSAGE_TYPE: DATA.MESSAGE_TYPE,
              HEADIMG: '',
              MESSAGE_DATA: DATA.MESSAGE_TYPE == 'TEXT' ? this.chat(DATA.MESSAGE_DATA) : DATA.MESSAGE_DATA,
              VOICE_TIME: DATA.VOICE_TIME == undefined ? '' : DATA.VOICE_TIME,
              voiceplay_type: '0'
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
  msg_image(e) {
    console.log(e)
    this.setData({
      msg_image_width: e.detail.width / 2
    })
  },
  /**
   * 预览图片
   */
  preview(e) {
    console.log(e.currentTarget.dataset.url)
    let urls = []
    for (let arr of this.data.msglist) {
      if (arr.MESSAGE_TYPE == 'IMAGE') {
        urls.push(arr.MESSAGE_DATA)
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
  photo_uploadFile(sourceType) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: sourceType,
      success: res => {
        let tempFilePaths = res.tempFilePaths
        for (let i = 0; i < tempFilePaths.length; i++) {
          let timestamp = Date.parse(new Date()) + i
          let list = {
            MSG_TYPE: '',
            MESSAGE_ID: timestamp,
            FROM_ID: app.globalData.member_id,
            MESSAGE_TYPE: 'IMAGE',
            HEADIMG: '',
            MESSAGE_DATA: tempFilePaths[i],
            VOICE_TIME: '',
            voiceplay_type: '0'
          }
          this.data.msglist.push(list)
          this.setData({
            msglist: this.data.msglist,
            msglist_index: `id${timestamp}`
          })

          wx.uploadFile({
            url: app.globalData.service_uploadFile,
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              user: 'test'
            },
            success: resData => {
              let data = JSON.parse(resData.data)
              console.log(data)
              let DATA = {
                "MESSAGE_ID": timestamp.toString(), // 字符串类型的毫秒级时间戳
                "MESSAGE_TYPE": 'IMAGE', // 文本
                "MESSAGE_DATA": data.ossUrl, // 消息内容
                "TARGET_TYPE": "CUSTOMER", // 接收者用户类型
                "TARGET_ID": this.data.service_info.TARGET_ID.toString(), // 接收者店铺ID
                "DIVERSION_ID": this.data.service_info.DIVERSION_ID.toString(), //客服分流ID
                "VOICE_TIME": ''
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
  service_funbtn(e) {
    let sourceType
    switch (e.currentTarget.dataset.item.route) {
      case 'photo':
        sourceType = ['album', 'camera']
        this.photo_uploadFile(sourceType)
        break;
      case 'takepictures':
        sourceType = ['camera']
        this.photo_uploadFile(sourceType)
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
      service_fun: false,
      isEmoji: false,
      focus: true
    })
  },
  /**
   * 
   */
  service_fun() {
    this.setData({
      service_fun: !this.data.service_fun,
      chatType: 0,
      isEmoji: false
    })
  },

  viewReset() {
    this.setData({
      service_fun: false,
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
      service_input: `${this.data.service_input}${e.currentTarget.dataset.item.name}`
    })
  },
  /**
   * 删除
   */
  emoji_del(e) {
    this.setData({
      service_input: `${this.data.service_input}${e.currentTarget.dataset.item.name}`
    })
  },
  /**
   * 
   */
  emoji_type() {
    this.setData({
      service_fun: false,
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
        this.data.msglist[i].voiceplay_type = 1
      } else {
        this.data.msglist[i].voiceplay_type = 0
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
    let last_id = 0,
      first_message_time = 0;
    if (this.data.msglist.length != 0) {
      last_id = this.data.msglist[0].id
      first_message_time = this.data.msglist[0].MESSAGE_ID
      this.setData({
        scrollAnimation: false
      })
    }
    http.post(app.globalData.getChatLog, {
      limit: 10,
      storeId: this.data.service_info.TARGET_ID,
      lastId: last_id,
      memberId: app.globalData.member_id,
      firstMessageTime: first_message_time
    }).then(res => {
      let list_con = res.data
      if (list_con.length != 0) {
        let list_chat = []
        for (let i = 0, len = list_con.length; i < len; i++) {
          let obj = {
            id: list_con[i].id,
            MSG_TYPE: 'success',
            MESSAGE_ID: list_con[i].message.MESSAGE_ID,
            FROM_ID: list_con[i].message.FROM_ID,
            MESSAGE_TYPE: list_con[i].message.MESSAGE_TYPE,
            HEADIMG: '',
            MESSAGE_DATA: list_con[i].message.MESSAGE_TYPE == 'TEXT' ? this.chat(list_con[i].message.MESSAGE_DATA) : list_con[i].message.MESSAGE_DATA,
            VOICE_TIME: list_con[i].message.VOICE_TIME,
            GOODS_DATA: null,
          }
          list_chat.push(obj)

          if (list_con[i].message.MESSAGE_TYPE == 'GOODS') {
            http.post(app.globalData.getGoodsInfo, {
              goodsId: list_con[i].message.MESSAGE_DATA
            }).then(ress => {
              let goods_data = ress.data
              for (let j = 0, len = this.data.msglist.length; j < len; j++) {
                if (list_con[i].id == this.data.msglist[j].id) {
                  console.log(goods_data)
                  this.data.msglist[j].GOODS_DATA = goods_data
                  this.setData({
                    msglist: this.data.msglist
                  })
                  break;
                }
              }
            })
          }
        }
        this.data.msglist = [...list_chat, ...this.data.msglist]
        this.setData({
          msglist: this.data.msglist
        })
        if (this.data.service_enter) {
          this.setData({
            msglist_index: `id${list_con[list_con.length - 1].message.MESSAGE_ID}`
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
    if (this.data.service_enter) {
      this.setData({
        scrollTops: e.detail.scrollTop,
        service_enter: false
      })
    }
  },

  /**
   * 进店
   */
  go_shop(e) {
    //店铺id
    let store_id = e.currentTarget.dataset.data
    wx.navigateTo({
      url: `/nearby_shops/shop_detail/shop_detail?store_id=${store_id}`,
    })
  },
  /**
   * 去商品详情
   */
  go_Goods(e) {
    //店铺id
    let goods_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/nearby_shops/good_detail/good_detail?goods_id=${goods_id}`,
    })
  },
  /**
   * 发送商品链接
   */
  goodslink(e) {
    //商品id
    const goods_id = e.currentTarget.dataset.id
    let timestamp = Date.parse(new Date())
    let list = {
      MSG_TYPE: '',
      MESSAGE_ID: timestamp,
      FROM_ID: app.globalData.member_id,
      MESSAGE_TYPE: 'GOODS',
      HEADIMG: '',
      MESSAGE_DATA: goods_id,
      VOICE_TIME: '',
      voiceplay_type: '0',
      GOODS_DATA: null
    }
    this.data.msglist.push(list)
    this.setData({
      msglist: this.data.msglist,
      msglist_index: `id${timestamp}`
    })
    let DATA = {
      "MESSAGE_ID": timestamp.toString(), // 字符串类型的毫秒级时间戳
      "MESSAGE_TYPE": 'GOODS', // 文本
      "MESSAGE_DATA": goods_id.toString(), // 消息内容
      "TARGET_TYPE": "CUSTOMER", // 接收者用户类型
      "TARGET_ID": this.data.service_info.TARGET_ID.toString(), // 接收者店铺ID
      "DIVERSION_ID": this.data.service_info.DIVERSION_ID.toString(), //客服分流ID
      "VOICE_TIME": ''
    }
    this.socketSend(DATA)
    http.post(app.globalData.getGoodsInfo, {
      goodsId: goods_id
    }).then(res => {
      const goods_data = res.data
      for (let i = 0, len = this.data.msglist.length; i < len; i++) {
        if (this.data.msglist[i].MESSAGE_ID == timestamp) {
          this.data.msglist[i].GOODS_DATA = goods_data
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
    http.post(app.globalData.customer_getStoreOrderList, {
      memberId: app.globalData.member_id,
      storeId: this.data.service_info.TARGET_ID,
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
    http.post(app.globalData.customer_getGoodsList, {
      memberId: app.globalData.member_id,
      listType: this.data.list_type,
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
      orderList_type: true,
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
        orderList_type: false,
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