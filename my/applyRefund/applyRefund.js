const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picList: [],
    fileName: '',
    //退款原因
    reason: '',
    //退款金额
    price: '',
    dataInfo: null,
    isSubmit: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.dataInfo = JSON.parse(options.dataInfo)
    this.data.dataInfo.info.file = decodeURIComponent(this.data.dataInfo.info.file)
    this.setData({
      diyColor: app.globalData.diyColor,
      dataInfo: this.data.dataInfo
    }, () => {
      this.getData()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
   * 选择未收到货
   */
  onNotReceive() {
    this.setData({
      'dataInfo.state': 1
    })
  },

  /**
   * 选择已收到货 
   */
  onReceived() {
    this.setData({
      'dataInfo.state': 2
    })
  },

  /**
   * 退款原因
   */
  reasonInput(e) {
    this.setData({
      reason: e.detail.value.replace(/ /g, '')
    })
  },

  /**
   * 退款金额
   */
  priceInput(e) {
    this.setData({
      price: e.detail.value
    })
  },

  /**
   * 选择图片
   */
  choosePic() {
    wx.chooseImage({
      count: 3 - this.data.picList.length,
      success: res => {
        this.setData({
          picList: [...this.data.picList, ...res.tempFilePaths]
        })
      },
    })
  },

  /**
   * 删除图片
   */
  delectPic(e) {
    this.data.picList.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      picList: this.data.picList
    })
  },

  getData() {
    http.post(app.globalData.orderRefundMoney, {
      orderGoodsId: this.data.dataInfo.info.orderGoodsId
    }).then(res => {
      this.setData({
        maxTotal: res.result.maxTotal,
        subFreightPrice: res.result.subFreightPrice
      })
    })
  },

  /**
   * 提交
   */
  submit() {
    if (!this.data.isSubmit) {
      return
    }
    this.setData({
      isSubmit: false
    })
    if (this.data.reason == '') {
      app.showToast('请输入退款原因')
      this.setData({
        isSubmit: true
      })
      return
    }
    if (this.data.price == '') {
      app.showToast('请输入退款金额')
      this.setData({
        isSubmit: true
      })
      return
    }
    if (parseFloat(this.data.price) <= 0) {
      app.showToast('请输入正确退款金额')
      this.setData({
        isSubmit: true
      })
      return
    }
    if (parseFloat(this.data.price).toFixed(2) > parseFloat(this.data.maxTotal)) {
      app.showToast(`最多可退款金额为${this.data.maxTotal}元`)
      this.setData({
        isSubmit: true
      })
      return
    }

    this.data.fileName = ''
    wx.showLoading({
      title: '加载中...',
    })
    this.uploadImage(0)
    http.post(app.globalData.appletMySaveFormId, {
      microFormId: this.data.formId
    }).then(res => {})
  },

  /**
   * 上传图片
   */
  uploadImage(i) {
    if (i < this.data.picList.length) {
      wx.uploadFile({
        url: app.globalData.uploadPic,
        filePath: this.data.picList[i],
        name: 'image',
        formData: {
          type: 'goods'
        },
        success: res => {
          this.data.fileName += JSON.parse(res.data).url
          if (i != this.data.picList.length - 1) {
            this.data.fileName += ','
          }
          this.uploadImage(i + 1)
        },
        fail: () => {
          this.setData({
            isSubmit: true
          })
        }
      })
    } else {
      http.post(app.globalData.refundAndReturn, {
        orderGoodsId: this.data.dataInfo.info.orderGoodsId,
        type: this.data.dataInfo.type,
        refundAmount: this.data.price,
        reason: this.data.reason,
        isGetGoods: (this.data.dataInfo.status != 2 && this.data.dataInfo.distributionType != 2 && this.data.dataInfo.type == 1) || this.data.dataInfo.type == 1 ? this.data.dataInfo.state : 2,
        multipleFile: this.data.fileName
      }).then(() => {
        wx.hideLoading()
        app.showSuccessToast('提交成功', () => {
          event.emit('refreshOrderDetail')
          event.emit('refreshReturnDetail')
          const page = getCurrentPages()
          for (let i = 0, len = page.length; i < len; i++) {
            if (page[i].route == 'my/orderDetail/orderDetail') {
              wx.navigateBack({
                delta: page.length - i - 1
              })
              break;
              return
            } else if (page[i].route != 'my/orderDetail/orderDetail' && i == page.length - 1) {
              wx.navigateBack({})
            }
          }
        })
      }).catch(() => {
        this.setData({
          isSubmit: true
        })
      })
    }
  },
  formId(e) {
    this.data.formId = e.detail.formId
  }
})