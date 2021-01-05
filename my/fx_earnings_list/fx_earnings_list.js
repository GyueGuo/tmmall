const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '', // total累计收益数据，today今天收益数据
    type: '', //0已结算，1未结算
    navTab: [{
      name: '已结算',
      type: '2'
    }, {
      name: '待结算',
      type: '1'
    }],
    navIndex: 0,
    page: 1, //分页
    month: '', //月份
    list: [],
    date: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      title: options.title,
      type: options.type == 0 ? '2' : '1',
      diyColor: app.globalData.diyColor,
      navIndex: options.type
    })
    // this.getYear()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.title == 'total' ? '收益记录' : '今日记录',
    })
  },

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
   * 加载更多
   */
  loadMore() {
    if (this.data.page != this.data.lastPage) {
      this.data.page++;
      this.getData()
    }
  },

  /**
   * 获取数据
   * title: total累计收益数据，today今天收益数据
   * type:  2已结算，1未结算
   * page:  分页
   * month: 月份
   */
  getData() {
    let data
    if (this.data.title == 'total') {
      //累计收益数据
      data = {
        distributionId: app.globalData.distribution.cur.distributionId,
        date: this.data.date,
        type: this.data.type,
        page: this.data.page
      }
    } else if (this.data.title == 'today') {
      //今天收益数据
      data = {
        distributionId: app.globalData.distribution.cur.distributionId,
        date: 'today',
        type: this.data.type,
        page: this.data.page
      }
    }
    http.post(app.globalData.distributionMyEarningsDetails, data).then((res) => {
      if (this.data.page == 1) {
        this.setData({
          data: res.data,
          lastPage: res.data.lastPage,
          list: res.data.data
        })
      } else {
        if (this.data.list[this.data.list.length - 1].date == res.data.data[0].date) {
          this.data.list[this.data.list.length - 1].list = [...this.data.list[this.data.list.length - 1].list, ...res.data.data[0].list]
          res.data.data.splice(0, 1)
        }
        this.setData({
          list: this.data.list
        })
      }

    })
  },

  /**
   * 导航切换
   */
  navTab(e) {
    if (this.data.title == 'total') {
      //累计收益数据
      this.setData({
        navIndex: e.currentTarget.dataset.index,
        type: e.currentTarget.dataset.type,
        date: '',
        page: 1,
        list: []
      })
    } else if (this.data.title == 'today') {
      //今天收益数据
      this.setData({
        navIndex: e.currentTarget.dataset.index,
        type: e.currentTarget.dataset.type,
        date: 'today',
        page: 1,
        list: []
      })
    }
    this.getData()
  },
  /**
   * 选择发货时间
   */
  syTime(e) {
    let date = e.detail.value.split("-")
    this.setData({
      year: date[0],
      month: date[1],
      date: date[0] + '-' + date[1],
      page: 1
    })
    this.getData()
  },
  /**
   * 获取当前年月份
   */
  getYear() {
    let year = new Date().getFullYear(),
      month = new Date().getMonth() + 1;
    this.setData({
      start: '2019-01',
      end: year + '-' + month,
      year: year,
      month: month,
      date: year + '-' + month
    })
  }
})