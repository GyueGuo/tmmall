const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{
      title: '交易通知',
      type: "1",
    }, {
      title: '通知',
      type: "0"
    }, {
      title: '优惠',
      type: "2"
    }],
    tab: 1,
    page: 1,
    total: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      tab: options.tab
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getList()
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
    this.setData({
      list: [],
      page: 1
    })
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.total > this.data.list.length) {
      this.data.page++;
      this.getList()
    }
  },

  /**
   * 点击选项卡
   */
  onTab(e) {
    this.setData({
      tab: e.currentTarget.dataset.index,
      page: 1,
      list: []
    })
    this.getList()
  },

  /**
   * 获取列表
   */
  getList() {
    http.post(app.globalData.messageList, {
      type: this.data.tab,
      page: this.data.page
    }).then(res => {
      if (this.data.tab == 2) {
        for (let i = 0, len = res.result.data.length; i < len; i++) {
          if (res.result.data[i].currentTimeStamp > res.result.data[i].endTimeStamp) {
            res.result.data[i]['finish'] = true
          } else {
            res.result.data[i]['finish'] = false
          }
        }
      }
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
    })
  },

  /**
   * 物流详情
   */
  onLogistics(e) {
    let info = {
      expressNumber: e.expressNumber,
      expressValue: e.expressValue,
      orderAttachId: e.attachId,
      type: e.expressType
    }
    wx.navigateTo({
      url: '/my/logisticsDetail/logisticsDetail?info=' + JSON.stringify(info),
    })
  },

  /**
   * 信息详情
   */
  onMessage(e) {
    let item = e.currentTarget.dataset.item
    switch (item.jumpState) {
      case "-1": //无跳转
        break;
      case "0": //订单详情
        wx.navigateTo({
          url: `/my/orderDetail/orderDetail?id=${item.attachId}`,
        })
        break;
      case "1": //砍价详情
        wx.navigateTo({
          url: `/pages/bargain/bargain?id=${item.attachId}`,
        })
        break;
      case "2": //拼团详情
        wx.navigateTo({
          url: `/pages/collageDetail/collageDetail?id=${item.attachId}`,
        })
        break;
      case "3": //分销-我的等级
        wx.navigateTo({
          url: `/my/fxGrade/fxGrade?`,
        })
        break;
      case "4": //商品详情
        wx.navigateTo({
          url: `/nearbyShops/goodDetail/goodDetail?goodsId=${item.attachId}`,
        })
        break;
      case "5": //文章详情
        wx.navigateTo({
          url: `/pages/infoDetail/infoDetail?articleId=${item.attachId}`,
        })
        break;
      case "6": //退款详情
        wx.navigateTo({
          url: `/pages/returnDetail/returnDetail?id=${item.attachId}`,
        })
        break;
      case "7": //我的粉丝
        wx.navigateTo({
          url: `/my/fxFansList/fxFansList`,
        })
        break;
      case "8": //我的-会员等级
        wx.navigateTo({
          url: `/my/member/member`,
        })
        break;
      case "9": //入驻申请页
        wx.navigateTo({
          url: `/my/merchantGuide/merchantGuide`,
        })
        break;
      case "10": //抽奖-订单详情
        wx.navigateTo({
          url: `/my/gamesOrder/gamesOrder?id=${item.attachId}`,
        })
        break;
      case "11": //积分-订单详情
        wx.navigateTo({
          url: `/my/integralOrder/integralOrder?id=${item.attachId}`,
        })
        break;
      case "12": //分销-代言规则
        wx.navigateTo({
          url: `/my/fxCwdy/fxCwdy`,
        })
        break;
      case "13": //积分首页
        wx.navigateTo({
          url: `/my/integral/integral`,
        })
        break;
      case "14": //红包列表
        wx.navigateTo({
          url: `/my/redPocket/redPocket`,
        })
        break;
      case "15": //优惠券列表
        wx.navigateTo({
          url: `/my/coupon/coupon`,
        })
        break;
      case "16": //店铺审核成功
        const data = {
          describe: item.describe
        }
        wx.navigateTo({
          url: `/nearbyShops/shopAudit/shopAudit?data=${JSON.stringify(data)}`,
        })
        break;
    }

  }
})