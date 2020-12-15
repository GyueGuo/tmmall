const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    page: 1,
    list: [],
    total: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
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

  },

  onAll() {
    this.setData({
      list: [],
      type: 0,
      page: 1
    })
    this.getData()
  },

  onPhoto() {
    this.setData({
      list: [],
      type: 1,
      page: 1
    })
    this.getData()
  },

  loadmore() {
    if (this.data.total > this.data.list.length) {
      this.data.page++;
      this.getData()
    }
  },

  getData() {
    http.post(app.globalData.myEvaluateList, {
      type: this.data.type,
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          total: res.result.total,
          list: res.result.data
        })
      } else {
        this.setData({
          list: [...this.data.list, ...res.result.data]
        })
      }
    })
  },

  /**
   * 预览
   */
  onPreview(e) {
    let index = e.currentTarget.dataset.index,
      idx = parseInt(e.currentTarget.dataset.idx),
      current = 0
    if (idx == -1 && this.data.list[index].video != '') {
      current = 0
    } else if (this.data.list[index].video != '') {
      current = idx + 1
    } else {
      current = idx
    }
    let multiple_file = []
    for (let i = 0, len = this.data.list[index].multiple_file.length; i < len; i++) {
      multiple_file.push(encodeURIComponent(this.data.list[index].multiple_file[i]))
    }
    let list = {
      multiple_file: multiple_file,
      video: encodeURIComponent(this.data.list[index].video),
      current: current
    }
    wx.navigateTo({
      url: '/nearby_shops/preview/preview?info=' + JSON.stringify(list),
    })
  },

  goComment() {
    wx.redirectTo({
      url: '/pages/comment_success/comment_success?write=1',
    })
  },
  onGoods(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/nearby_shops/good_detail/good_detail?goods_id=' + item.goods_id,
    })
  }
})