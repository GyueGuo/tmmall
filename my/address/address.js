const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    total: 0,
    list: [],
    //当前选中的item
    item: {},
    //当前选中item的index
    index: '',
    //是否是选择地址状态
    status: false,
    //长按状态
    longPress: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let obj = {}
    obj.diyColor = app.globalData.diyColor
    if (options.choose) {
      obj.status = true
    }
    if (options.oType) {
      obj.oType = options.oType
    }
    this.setData(obj)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    event.on('refreshAddress', this, () => {
      this.getData()
      if (this.data.list.length == 0) {
        app.globalData.addressLen = false
      } else {
        app.globalData.addressLen = true
      }
    })
    this.getData()
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
    event.remove('refreshAddress', this)
  },

  /**
   * 刷新
   */
  onPullDownRefresh() {
    this.data.page = 1
    this.getData()
  },

  /**
   * 加载更多
   */
  loadmore() {
    if (this.data.list.length < this.data.total) {
      this.data.page++;
      this.getData()
    }
  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.addressIndex, {
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          list: res.result.data,
          total: res.result.total
        })
      } else {
        this.setData({
          list: [...this.data.list, ...res.result.data]
        })
      }
    })
  },


  /**
   * 删除收货地址
   */
  delAddress(e) {
    this.selectComponent("#modal").showModal()
    this.data.item = e.currentTarget.dataset.item
    this.data.index = e.currentTarget.dataset.index
    this.data.longPress = true
  },

  /**
   * 确认删除
   */
  confirmDelete() {
    this.data.longPress = false
    http.post(app.globalData.addressDestroy, {
      memberAddressId: this.data.item.memberAddressId
    }).then(res => {
      app.showSuccessToast(res.message, () => {
        this.data.list.splice(this.data.index, 1)
        this.setData({
          list: this.data.list
        })
        if (this.data.list.length == 0) {
          app.globalData.addressSelect.memberAddressId = null
          return
        } else {
          for (let i of this.data.list) {
            if (i.memberAddressId != app.globalData.addressSelect.memberAddressId) {
              app.globalData.addressSelect.memberAddressId = null;
            }
          }
        }

      })
    })
  },

  confirmCancel() {
    this.data.longPress = false
  },

  /**
   * 增加收货地址
   */
  increaseAddress() {
    wx.navigateTo({
      url: '../editAddress/editAddress',
    })
  },

  /**
   * 修改收货地址
   */
  changeAddress(e) {
    wx.navigateTo({
      url: '../editAddress/editAddress?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 确认地址
   */
  confirmAddress(e) {
    if (this.data.status && !this.data.longPress) {
      let address = e.currentTarget.dataset.item;
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2];
      switch (this.data.oType) {
        case '2':
          console.log(address)
          prevPage.setData({
            'info.address': address,
            memberAddressId: address.memberAddressId
          })
          break;
        case '3':
          prevPage.changeAddress(address)
          break;
        default:
          prevPage.setData({
            address,
            memberAddressId: address.memberAddressId
          })
          prevPage.getData()
      }
      wx.navigateBack()
    }
  }
})