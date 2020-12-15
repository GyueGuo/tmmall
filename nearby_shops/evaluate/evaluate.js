const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_id: '',
    //当前选中
    current_tab: 1,
    page: 1,
    total: -1,
    list: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.goods_id = options.goods_id
    this.setData({
      diy_color: app.globalData.diy_color
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
      current_tab: 1
    })
    this.data.page = 1
    this.getList()
  },

  /**
   * 最新评价
   */
  onNewest() {
    this.setData({
      current_tab: 2
    })
    this.data.page = 1
    this.getList()
  },

  /**
   * 好评
   */
  onGood() {
    this.setData({
      current_tab: 3
    })
    this.data.page = 1
    this.getList()
  },

  /**
   * 中评
   */
  onMedium() {
    this.setData({
      current_tab: 4
    })
    this.data.page = 1
    this.getList()
  },

  /**
   * 差评
   */
  onNegative() {
    this.setData({
      current_tab: 5
    })
    this.data.page = 1
    this.getList()
  },

  /**
   * 有图
   */
  onPicture() {
    this.setData({
      current_tab: 6
    })
    this.data.page = 1
    this.getList()
  },

  /**
   * 视频
   */
  onVideo() {
    this.setData({
      current_tab: 7
    })
    this.data.page = 1
    this.getList()
  },

  /**
   * 获取数据
   */
  getList() {
    let star_level = ''
    if (this.data.current_tab == 3) {
      star_level = "good"
    } else if (this.data.current_tab == 4) {
      star_level = "medium"
    } else if (this.data.current_tab == 5) {
      star_level = "negative"
    }
    http.post(app.globalData.evaluate_list, {
      goodsId: this.data.goods_id,
      newest: this.data.current_tab == 2 ? '1' : '',
      file: this.data.current_tab == 6 ? '1' : '',
      video: this.data.current_tab == 7 ? '1' : '',
      starLevel: star_level,
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
})