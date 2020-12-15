// my/fx_fans_list/fx_fans_list.js
const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTab: ['全部粉丝', '直属粉丝', '推荐粉丝'],
    navIndex: 0,
    current_tab: 0,
    page: 1,
    type: '0',
    order: '0',
    sort: '1',
    list: []
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
  loadmore() {
    if (this.data.list.length < this.data.total) {
      this.data.page++;
      this.getData()
    }
  },

  /**
   * 导航切换
   */
  navTab(e) {
    switch (e.currentTarget.dataset.index) {
      case 0:
        this.setData({
          navIndex: e.currentTarget.dataset.index,
          type: e.currentTarget.dataset.index,
          current_tab: 0,
          page: 1,
          order: '1',
          sort: '1'
        })
        break;
      case 1:
        this.setData({
          navIndex: e.currentTarget.dataset.index,
          type: e.currentTarget.dataset.index,
          current_tab: 0,
          page: 1,
          order: '1',
          sort: '1'
        })
        break;
      case 2:
        this.setData({
          navIndex: e.currentTarget.dataset.index,
          type: e.currentTarget.dataset.index,
          current_tab: 0,
          page: 1,
          order: '1',
          sort: '1'
        })
        break;
    }
    this.getData()
  },
  /**
   * 筛选
   */
  current_tab(e) {
    switch (e.currentTarget.dataset.index) {
      case '1':
        if (this.data.sort == 1 && this.data.current_tab == e.currentTarget.dataset.index) {
          this.setData({
            sort: '2'
          })
        } else {
          this.setData({
            sort: '1'
          })
        }
        this.setData({
          current_tab: e.currentTarget.dataset.index,
          page: 1,
          order: '1',
        })
        break;
      case '2':
        if (this.data.sort == 1 && this.data.current_tab == e.currentTarget.dataset.index) {
          this.setData({
            sort: '2'
          })
        } else {
          this.setData({
            sort: '1'
          })
        }
        this.setData({
          current_tab: e.currentTarget.dataset.index,
          page: 1,
          order: '2',
        })
        break;
      case '3':
        if (this.data.sort == 1 && this.data.current_tab == e.currentTarget.dataset.index) {
          this.setData({
            sort: '2'
          })
        } else {
          this.setData({
            sort: '1'
          })
        }
        this.setData({
          current_tab: e.currentTarget.dataset.index,
          page: 1,
          order: '3',
        })
        break;
    }
    this.getData()
  },
  /**
   * 获取数据
   */
  getData() {
    http.post(app.globalData.distribution_my_fans, {
      type: this.data.type,
      order: this.data.order,
      sort: this.data.sort,
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          total: res.data.total,
          list: res.data.data
        })
      } else {
        this.setData({
          total: res.data.total,
          list: [...this.data.list, ...res.data.data]
        })
      }
    })
  },
  /**
   * 粉丝详情
   */
  goDetails(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/my/fx_fs_earnings_list/fx_fs_earnings_list?distribution_id=${item.distribution_id}`,
    })
  }
})