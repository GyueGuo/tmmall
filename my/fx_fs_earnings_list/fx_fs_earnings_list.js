// my/fx_total_earnings/fx_total_earnings.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '0', //0累计收益，1已结算，2待结算
    navTab: [{
      name: '累计收益',
      type: '0'
    }, {
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
      diy_color: app.globalData.diy_color,
      distribution_id: options.distribution_id
    })
    // this.getYear()
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
    if (this.data.page != this.data.last_page) {
      this.data.page++;
      this.getData()
    }
  },

  /**
   * 获取数据
   * title: total累计收益数据，today今天收益数据
   * type:  0已结算，1未结算
   * page:  分页
   * month: 月份
   */
  getData() {
    http.post(app.globalData.distribution_my_earnings_details, {
      distribution_id: this.data.distribution_id,
      date: this.data.date,
      type: this.data.type,
      page: this.data.page
    }).then((res) => {
      if (this.data.page == 1) {
        this.setData({
          data: res.data,
          last_page: res.data.last_page,
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
    this.setData({
      navIndex: e.currentTarget.dataset.index,
      type: e.currentTarget.dataset.type,
      date: '',
      page: 1
    })
    this.getData()
  },
  /**
   * 选择发货时间
   */
  sy_time(e) {
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
      start: '2018-01',
      end: year + '-' + month,
      year: year,
      month: month,
      date: year + '-' + month
    })
  }
})