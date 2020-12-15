const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_list: [{
      title: '全部',
      status: null
    }, {
      title: '充值',
      status: "0,1"
    }, {
      title: '消费',
      status: "2"
    }, {
      title: '退款',
      status: "3"
    }],
    current_tab: null,
    page: 1,
    total: '',
    list: [],
    month_text: '1',
    month_list: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let myDate = new Date()
    this.setData({
      diy_color: app.globalData.diy_color,
      month_text: myDate.getMonth() + 1
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.page = 1
    this.getData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.total > this.data.list.length) {
      this.data.page++
      this.getData()
    }
  },

  /**
   * 点击选项卡
   */
  onTab(e) {
    this.setData({
      current_tab: e.currentTarget.dataset.status,
      page: 1,
      list: []
    })
    this.getData()
  },

  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.balance_record, {
      type: this.data.current_tab,
      page: this.data.page,
      month: this.data.month_text
    }).then(res=> {
      if (this.data.page == 1) {
        this.setData({
          total: res.result.total,
          list: res.result.data
        })
      } else {
        this.setData({
          list: [...this.data.list,...res.result.data]
        })
      }
    })
  },
  /**
   * 
   */
  month(e) {
    this.setData({
      month_text: parseInt(e.detail.value) + 1
    })
    this.getData()
  }
})