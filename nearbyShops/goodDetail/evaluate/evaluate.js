const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId: '',
    //当前选中
    currentTab: 1,
    page: 1,
    total: -1,
    list: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.goodsId = options.goodsId
    this.setData({
      diyColor: app.globalData.diyColor
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getList()
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
    this.data.page = 1
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.total > this.data.list.length) {
      this.data.page++;
      this.getList()
    }
  },

  /**
   * 全部评价
   */
  onAll() {
    this.setData({
      currentTab: 1
    })
    this.data.page = 1
    this.getList()
  },

  /**
   * 最新评价
   */
  onNewest() {
    this.setData({
      currentTab: 2
    })
    this.data.page = 1
    this.getList()
  },

  /**
   * 好评
   */
  onGood() {
    this.setData({
      currentTab: 3
    })
    this.data.page = 1
    this.getList()
  },

  /**
   * 中评
   */
  onMedium() {
    this.setData({
      currentTab: 4
    })
    this.data.page = 1
    this.getList()
  },

  /**
   * 差评
   */
  onNegative() {
    this.setData({
      currentTab: 5
    })
    this.data.page = 1
    this.getList()
  },

  /**
   * 有图
   */
  onPicture() {
    this.setData({
      currentTab: 6
    })
    this.data.page = 1
    this.getList()
  },

  /**
   * 视频
   */
  onVideo() {
    this.setData({
      currentTab: 7
    })
    this.data.page = 1
    this.getList()
  },

  /**
   * 获取数据
   */
  getList() {
    let starLevel = ''
    if (this.data.currentTab == 3) {
      starLevel = "good"
    } else if (this.data.currentTab == 4) {
      starLevel = "medium"
    } else if (this.data.currentTab == 5) {
      starLevel = "negative"
    }
    http.post(app.globalData.evaluateList, {
      goodsId: this.data.goodsId,
      newest: this.data.currentTab == 2 ? '1' : '',
      file: this.data.currentTab == 6 ? '1' : '',
      video: this.data.currentTab == 7 ? '1' : '',
      starLevel: starLevel,
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          statistics: res.statistics,
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
    let multipleFile = []
    for (let i = 0, len = this.data.list[index].multipleFile.length; i < len; i++) {
      multipleFile.push(encodeURIComponent(this.data.list[index].multipleFile[i]))
    }

    let list = {
      multipleFile: multipleFile,
      video: encodeURIComponent(this.data.list[index].video),
      current: current
    }
    wx.navigateTo({
      url: '/nearbyShops/preview/preview?info=' + JSON.stringify(list),
    })
  },
})