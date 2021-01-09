const app = getApp();
import http from '../../utils/http';
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabView: ['全部', '进行中', '成功', '失败'],
    currentTab: 0,
    //倒计时
    countDown: {},
    list: [],
    total: '',
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      diyColor: app.globalData.diyColor
    })
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
    //砍价成功
    event.on('refreshBargain', this, id => {
      for (var i = 0, len = this.data.list.length; i < len; i++) {
        if (this.data.list[i].cutActivityId == id) {
          if (this.data.currentTab == 0) {
            this.data.list[i].status = 2
          } else {
            this.data.list.splice(i, 1)
          }
          this.setData({
            list: this.data.list
          })
        }
      }
    })
    this.getBargainList()
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
    event.remove('bargainSuccess', this)
    clearInterval(this.data.countDown)
  },

  /**
   * 砍价商品
   */
  onBargainGood() {
    wx.redirectTo({
      url: '/pages/bargainList/bargainList',
    })
  },

  /**
   * 切换选项卡
   */
  onTab(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.index,
      page: 1,
      list: []
    })
    this.getBargainList()
  },

  /**
   * 获取砍价列表
   */
  getBargainList() {
    http.postList(app.globalData.myBargain, {
      status: this.data.currentTab == 0 ? '' : this.data.currentTab,
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
      clearInterval(this.data.countDown)
      this.countDown()
      this.data.countDown = setInterval(() => {
        this.countDown()
      }, 1000)
    })
  },

  /**
   * 倒计时
   */
  countDown() {
    for (let i = 0, len = this.data.list.length; i < len; i++) {
      if (this.data.list[i].status == 1) {
        let second = this.data.list[i].expirationTime
        if (second == 0) {
          this.data.list[i].status = 3
        } else {
          this.data.list[i]['day'] = Math.floor(second / 86400);
          this.data.list[i]['hour'] = Math.floor(second % 86400 / 3600) < 10 ? '0' + Math.floor(second % 86400 / 3600) : Math.floor(second % 86400 / 3600);
          this.data.list[i]['min'] = Math.floor(second % 86400 % 3600 / 60) < 10 ? '0' + Math.floor(second % 86400 % 3600 / 60) : Math.floor(second % 86400 % 3600 / 60);
          this.data.list[i]['sec'] = Math.floor(second % 60) < 10 ? '0' + Math.floor(second % 60) : Math.floor(second % 60);
          this.data.list[i].expirationTime--;
        }
      }
    }
    this.setData({
      list: this.data.list
    })
  },

  /**
   * 加载更多
   */
  loadMore() {
    if (this.data.total > this.data.list.length) {
      this.data.page++;
      this.getBargainList()
    }
  },

  /**
   * 砍价详情
   */
  onBargainDetail(e) {
    wx.navigateTo({
      url: '/pages/bargain/bargain?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 订单详情
   */
  onOrderDetail(e) {
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 重砍一个
   */
  onAnother(e) {
    wx.redirectTo({
      url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 付款
   */
  onPayOrder(e) {
    let item = e.currentTarget.dataset.item,
      obj = {
        //商品类型 1正常商品 2团购 3砍价 4限时抢购
        goodType: 3,
        //商品id
        goodsId: item.goodsId,
        //砍价id
        cutActivityId: item.cutActivityId,
        //参团id
        groupActivityId: '',
        //购买数量
        num: 1,
        //店铺id
        storeId: item.storeId,
        //店铺名称
        storeName: item.storeName,
        //价格
        shopPrice: parseFloat(item.presentPrice).toFixed(2),
        //商品名称
        goodsName: item.goodsName,
        //商品规格id
        productsId: item.productsId,
        //规格展示
        attrDetail: item.attr,
        //规格
        attr: item.goodsAttr,
        //库存
        goodsNumber: 1,
        //团购价
        groupPrice: '',
        //砍价
        cutPrice: parseFloat(item.presentPrice).toFixed(2),
        //砍价的差价
        priceSpread: (parseFloat(item.originalPrice) - parseFloat(item.presentPrice)).toFixed(2),
        //限时抢购价
        limitPrice: '',
        //总金额
        subtotal: parseFloat(item.presentPrice).toFixed(2)
      }
    wx.navigateTo({
      url: '/pages/confirmOrder/confirmOrder?info=' + JSON.stringify(obj) + '&goodImage=' + encodeURIComponent(item.file),
    })
  }
})