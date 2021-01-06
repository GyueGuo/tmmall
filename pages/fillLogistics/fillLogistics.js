const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    storeId: '',
    //退回方式 1 快递商家 2送至门店
    returnWay: 1,
    picList: [],
    expressInfo: {
      name: '',
      code: ''
    },
    //物流单号
    trackNum: '',
    //联系电话
    phone: '',
    //退货说明
    complain: '',
    fileName: '',
    //门店自提列表
    takeList: [],
    //当前选中的id
    takeId: '',
    //当前选中takeItem
    takeItem: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      id: options.id,
      storeId: options.storeId,
      distributionType: options.distributionType
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getTakeList()
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
   * 获取门店自提列表
   */
  getTakeList() {
    http.post(app.globalData.takeList, {
      storeId: this.data.storeId,
      lat: 0,
      lng: 0,
      keyword: '',
      area: ''
    }).then(res => {
      this.setData({
        takeList: res.result
      })
    })
  },

  /**
   * 选择自提门店
   */
  selectSelfPick() {
    this.selectComponent("#select_self_pick").show(this.data.takeId, this.data.takeList, '', this.data.takeItem)
  },

  /**
   * 确定选择
   */
  selectPick(e) {
    this.setData({
      takeId: e.detail.takeId,
      takeItem: e.detail
    })
  },

  /**
   * 快递至商家
   */
  onExpress() {
    this.setData({
      returnWay: 1
    })
  },

  /**
   * 送货至自提
   */
  onSelfPick() {
    this.setData({
      returnWay: 2
    })
  },

  /**
   * 选择物流公司
   */
  onSelectLogistics() {
    wx.navigateTo({
      url: '../selectLogistics/selectLogistics',
    })
  },

  /**
   * 选择门店
   */
  onSelectShop() {
    this.setData({
      board: true
    })
  },

  /**
   * 物流单号输入
   */
  numberInput(e) {
    this.data.trackNum = e.detail.value
  },

  /**
   * 手机输入
   */
  phoneInput(e) {
    this.data.phone = e.detail.value
  },

  /**
   * 退货说明
   */
  complainInput(e) {
    this.data.complain = e.detail.value
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

  /**
   * 提交
   */
  commit() {
    //快递至商家
    if (this.data.returnWay == 1) {
      if (this.data.expressInfo.name == '') {
        app.showToast('请选择物流公司')
        return
      }
      if (this.data.trackNum == '') {
        app.showToast('请填写物流单号')
        return
      }
    } else {
      //门店自提
    }

    if (this.data.phone == '' || this.data.phone.length != 11) {
      app.showToast('请填写手机号码')
      return
    }

    this.data.fileName = ''
    wx.showLoading({
      title: '加载中...',
    })
    this.uploadImage(0)

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
        }
      })
    } else {
      wx.hideLoading()
      http.post(app.globalData.returnConfirmed, {
        orderGoodsRefundid: this.data.id,
        returnType: this.data.returnWay,
        takeId: this.data.takeId,
        phone: this.data.phone,
        returnReason: this.data.complain,
        returnMultipleFile: this.data.fileName,
        expressName: this.data.expressInfo.name,
        expressValue: this.data.expressInfo.code,
        expressNumber: this.data.trackNum
      }).then(res => {
        app.showSuccessToast('提交成功', () => {
          wx.navigateBack()
        })
        event.emit('refreshOrderDetail')
        event.emit('refreshReturnDetail')
      })
    }
  },
})