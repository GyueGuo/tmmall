const app = getApp();
const event = require('../../utils/event.js');
let mapContext;
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk = new QQMapWX({
  key: app.globalData.MapKey
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: app.globalData.MapKey,
    search_key: '',
    latitude: '',
    longitude: '',
    location: {},
    scrollIndex: '',
    address:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color
    })
    mapContext = wx.createMapContext('map', this)
    if (options.address) {
      let address = JSON.parse(options.address)
      this.setData({
        search_key: `${address.province}${address.city}${address.area}${address.street}`,
        address: address
      })
      let type = 1
      this.onSearch(type)
    } else {
      this.getLocation()
    }
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
   * 表单输入
   */
  searchInput(e) {
    this.data.search_key = e.detail.value
  },
  /**
   * 搜索
   */
  onSearch(type = 0) {
    if (type == 1) {
      qqmapsdk.geocoder({
        address: this.data.search_key,
        success: res => {
          if (res.status != 0) {
            app.showToast('搜索不到地址', () => {})
            return
          }
          let location = {
            latitude: res.result.location.lat,
            longitude: res.result.location.lng
          }
          this.map_search(location)
        },
        fail: res => {
          if (res.status != 0) {
            app.showToast(res.message, () => {})
            return
          }
        }
      })
    } else {
      console.log('b')
      this.map_search()
    }
  },

  map_search(location) {
    qqmapsdk.getSuggestion({
      keyword: this.data.search_key,
      location: location ? location : undefined,
      success: (res, data) => {
        console.log(data)
        if (res.data.length == 0) {
          app.showToast('搜索不到地址', () => {})
          return
        }
        this.setData({
          bubble: true,
          location: res.data[0],
          longitude: res.data[0].location.lng,
          latitude: res.data[0].location.lat,
          list: res.data,
          scrollIndex: 'a-0'
        })
      }
    })
  },

  /**
   * 获取当前地址
   */
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        let location = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        this.getAddressInfo(location)
      },
      fail: () => {}
    })
  },


  /**
   * 地图视野移动
   */
  regionChange(e) {
    if (e.type == 'begin') {
      this.setData({
        bubble: false
      })
    }
    if (e.type == 'end') {
      this.setData({
        bubble: true
      })
      if (e.causedBy == "drag") {
        mapContext.getCenterLocation({
          success: res => {
            let location = {
              latitude: res.latitude,
              longitude: res.longitude
            }
            this.getAddressInfo(location)
          }
        })
      }
    }
  },

  /**
   * 地址详情
   */
  getAddressInfo(location) {
    let sLocation = `${location.latitude},${location.longitude}`
    qqmapsdk.reverseGeocoder({
      get_poi: 1,
      location: sLocation,
      success: res => {
        console.log(res)
        this.setData({
          bubble: true,
          location: res.result.pois[0],
          list: res.result.pois,
          scrollIndex: 'a-0'
        })
      },
      fail: res => {

      }
    })
  },

  /**
   * 确认地址
   */
  submit() {
    let location = {
      location: this.data.location.address,
      latitude: this.data.location.location.lat,
      longitude: this.data.location.location.lng
    }
    event.emit('changeLocation', location)
    wx.navigateBack()
  },

  onListAddress(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item,
      location = {
        location: item.title,
        latitude: item.location.lat,
        longitude: item.location.lng
      }
    event.emit('changeLocation', location)
    wx.navigateBack()
  }
})