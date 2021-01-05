const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    store_id: '',
    //退回方式 1 快递商家 2送至门店
    return_way: 1,
    pic_list: [],
    express_info: {
      name: '',
      code: ''
    },
    //物流单号
    track_num: '',
    //联系电话
    phone: '',
    //退货说明
    complain: '',
    file_name: '',
    //门店自提列表
    take_list: [],
    //当前选中的id
    take_id: '',
    //当前选中take_item
    take_item: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      id: options.id,
      store_id: options.store_id,
      distribution_type: options.distribution_type
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
    http.post(app.globalData.take_list, {
      storeId: this.data.store_id,
      lat: 0,
      lng: 0,
      keyword: '',
      area: ''
    }).then(res => {
      this.setData({
        take_list: res.result
      })
    })
  },

  /**
   * 选择自提门店
   */
  selectSelfPick() {
    this.selectComponent("#select_self_pick").show(this.data.take_id, this.data.take_list, '', this.data.take_item)
  },

  /**
   * 确定选择
   */
  selectPick(e) {
    this.setData({
      take_id: e.detail.take_id,
      take_item: e.detail
    })
  },

  /**
   * 快递至商家
   */
  onExpress() {
    this.setData({
      return_way: 1
    })
  },

  /**
   * 送货至自提
   */
  onSelfPick() {
    this.setData({
      return_way: 2
    })
  },

  /**
   * 选择物流公司
   */
  onSelectLogistics() {
    wx.navigateTo({
      url: '../select_logistics/select_logistics',
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
    this.data.track_num = e.detail.value
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
      count: 3 - this.data.pic_list.length,
      success: res => {
        this.setData({
          pic_list: [...this.data.pic_list, ...res.tempFilePaths]
        })
      },
    })
  },

  /**
   * 删除图片
   */
  delectPic(e) {
    this.data.pic_list.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      pic_list: this.data.pic_list
    })
  },

  /**
   * 提交
   */
  commit() {
    //快递至商家
    if (this.data.return_way == 1) {
      if (this.data.express_info.name == '') {
        app.showToast('请选择物流公司')
        return
      }
      if (this.data.track_num == '') {
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

    this.data.file_name = ''
    wx.showLoading({
      title: '加载中...',
    })
    this.uploadImage(0)

  },

  /**
   * 上传图片
   */
  uploadImage(i) {
    if (i < this.data.pic_list.length) {
      wx.uploadFile({
        url: app.globalData.upload_pic,
        filePath: this.data.pic_list[i],
        name: 'image',
        formData: {
          type: 'goods'
        },
        success: res => {
          this.data.file_name += JSON.parse(res.data).url
          if (i != this.data.pic_list.length - 1) {
            this.data.file_name += ','
          }
          this.uploadImage(i + 1)
        }
      })
    } else {
      wx.hideLoading()
      http.post(app.globalData.return_confirmed, {
        orderGoodsRefundid: this.data.id,
        returnType: this.data.return_way,
        takeId: this.data.take_id,
        phone: this.data.phone,
        returnReason: this.data.complain,
        returnMultiple_file: this.data.file_name,
        expressName: this.data.express_info.name,
        expressValue: this.data.express_info.code,
        expressNumber: this.data.track_num
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