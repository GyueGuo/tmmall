const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: '',
    scale: '16',
    orderAttachId: '',
    info: {},
    markers: [],
    list: [],
    isShow: false,
    isMu: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderAttachId: options.orderAttachId,
      diyColor: app.globalData.diyColor
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getData()
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
   * 获取数据
   */
  getData() {
    http.post(app.globalData.dadaExpress, {
      orderAttachId: this.data.orderAttachId
    }).then((res) => {
      this.setData({
        info: res.result,
        longitude: res.result.time.addressLng,
        latitude: res.result.time.addressLat
      })
      let list = [],
        listcon = [],
        list1 = {
          tit: '订单已提交',
          time: this.data.info.time.createTime
        },
        list2 = {
          tit: '支付成功',
          time: this.data.info.time.payTime
        },
        list3 = {
          tit: '商家已接单',
          time: this.data.info.data.createTime
        },
        list4 = {
          tit: '骑手已取货',
          time: this.data.info.data.fetchTime
        },
        list5 = {
          tit: '骑手已送达',
          time: this.data.info.data.finishTime
        },
        list6 = {
          tit: '订单已取消',
          time: this.data.info.data.cancelTime
        }
      list.push(list1, list2, list3, list4, list5, list6)
      for (let i = 0, len = list.length; i < len; i++) {
        if (list[i].time != '') {
          listcon.push(list[i])
        }
      }
      this.setData({
        list: listcon
      })

      let markersData = []
      let merchant, horseman, destination
      merchant = {
        id: 1,
        name: res.result.data.supplierName,
        latitude: res.result.data.supplierLat,
        longitude: res.result.data.supplierLng,
        companyPhone: res.result.data.supplierPhone,
        companyAddress: res.result.data.supplierAddress,
        width: 26,
        height: 34,
        iconPath: `${app.globalData.HTTP}mobile/small/image/img/shangj.png`
      }
      horseman = {
        id: 2,
        name: res.result.data.transporterName,
        latitude: res.result.data.transporterLat,
        longitude: res.result.data.transporterLng,
        companyPhone: res.result.data.transporterPhone,
        width: 25,
        height: 21,
        iconPath: `${app.globalData.HTTP}mobile/small/image/img/qs.png`
      }
      destination = {
        id: 3,
        latitude: res.result.time.addressLat,
        longitude: res.result.time.addressLng,
        width: 26,
        height: 34,
        iconPath: `${app.globalData.HTTP}mobile/small/image/img/zhogd.png`
      }
      markersData.push(merchant, horseman, destination)
      this.setData({
        markers: markersData
      })
    })
  },

  /**
   * 骑手电话
   */
  qsPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.info.data.transporterPhone
    })
  },

  /**
   * 弹出动画
   */
  showAnimation() {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    animation.translateY(-wx.getSystemInfoSync().windowHeight)
    this.setData({
      animation: animation.step(),
      isShow: true
    })
    this.fadeIn()
  },

  /**
   * 关闭动画
   */
  hiddenAnimation() {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    animation.translateY(wx.getSystemInfoSync().windowHeight)
    this.setData({
      animation: animation.step(),
      isMu: false
    })
    this.fadeOut()
  },

  /**
   * 淡入效果
   */
  fadeIn() {
    setTimeout(() => {
      this.setData({
        isMu: true
      })
    }, 10)
  },

  /**
   * 淡出效果
   */
  fadeOut() {
    setTimeout(() => {
      this.setData({
        isShow: false
      })
    }, 500)
  },

  /**
   * 显示
   */
  // show() {
  //   this.setData({
  //     isShow: false
  //   })
  //   setTimeout(() => {
  //     this.setData({
  //       isTop: false
  //     })
  //   }, 50)
  // },
  /**
   * 隐藏
   */
  // close() {
  //   this.setData({
  //     isTop: true
  //   })
  //   setTimeout(() => {
  //     this.setData({
  //       isShow: true
  //     })
  //   }, 300)
  // }
})