const app = getApp();
import http from '../../utils/http';

const tabList = [{
  title: '未使用',
  status: '0'
}, {
  title: '已使用',
  status: '1'
}, {
  title: '已过期',
  status: '2'
}];
Page({
  data: {
    //选项卡
    tabList,
    list: [],
    total: 0,
    currentStatus: tabList[0].status
  },
  onLoad() {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch
    })
    this.currentPage = 1;
  },
  onReady() {
    this.getList();
  },
  onPullDownRefresh: function() {
    this.currentPage = 1
    this.getList()
  },
  onReachBottom: function() {
    if (this.data.total > this.data.list.length) {
      this.currentPage++;
      this.getList()
    }
  },

  onTab(e) {
    this.currentPage = 1;
    this.setData({
      currentStatus: e.currentTarget.dataset.status,
      list: []
    })
    this.getList()
  },

  goUse(e) {
    let item = e.currentTarget.dataset.item
    if (item.type == 0) {
      if (this.data.configSwitch.versionInfo.oneMore == 1 && app.globalData.isShops == 0) {
        wx.navigateTo({
          url: '/nearbyShops/shopDetail/shopDetail?storeId=' + item.storeId,
        })
      } else {
        wx.navigxateTo({
          url: '/pages/searchGoods/searchGoods'
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/searchGoods/searchGoods',
      })
    }
  },
  getList() {
    http.post(app.globalData.getRedPacketList, {
      status: this.data.currentStatus + '',
      page: this.currentPage,
    }).then(res => {
      for (let i of res.result.data) {
        i.startTime = i.startTime.replace(/-/g, '.')
        i.endTime = i.endTime.replace(/-/g, '.')
      }
      if (this.data.page == 1) {
        this.setData({
          list: res.result.data,
          total: res.result.total,
          tabList: this.data.tabList
        })
      } else {
        this.setData({
          list: [...this.data.list, ...res.result.data]
        })
      }
    })
  }
})