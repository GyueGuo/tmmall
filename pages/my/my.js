const app = getApp();
import http from '../../utils/http';

const navBar = require('../../components/navBar/navBar.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginStatus: false,
    aDistribution: [{
      'title': '收益',
      'img': 'mobile/small/image/fx/wd-sy.png',
      'key': 'sy'
    }, {
      'title': '粉丝',
      'img': 'mobile/small/image/fx/wd-fs.png',
      'key': 'fs'
    }, {
      'title': '邀请',
      'img': 'mobile/small/image/fx/wd-yq.png',
      'key': 'yq'
    }],
    information: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch,
      model: app.globalData.model
    })
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
    this.setData({
      loginStatus: app.globalData.memberId != '' && app.globalData.phone != ''
    })
    this.getData()
  },
  onPullDownRefresh: function() {
    this.getData()
  },

  loginStatus() {
    app.login()
  },

  /**
   * 请求数据
   */
  getData() {
    http.encPost(app.globalData.my, {}).then(res => {
      this.setData({
        info: res.data,
        information: res.data.userInfo.information
      })
      this.getDistributionData()
    }).catch(res => {
      wx.navigateTo({
        url: '/pages/accredit/accredit',
      })
    })
    navBar.tabbar("tabBar", app.globalData.isShops == 0 && this.data.configSwitch.versionInfo.oneMore == 1 ? 4 : 3, this) // 我的 多店4，单店3
  },

  /**
   * 设置
   */
  onSetting() {
    if (app.globalData.memberId == '') {
      wx.navigateTo({
        url: '/pages/accredit/accredit',
      })
      return
    }
    wx.navigateTo({
      url: `/my/setting/setting`
    })
  },

  /**
   * 个人资料
   */
  onInfo() {
    if (app.login()) {
      wx.navigateTo({
        url: `/my/personal/personal`
      })
    }
  },

  /**
   * 消息
   */
  onMessage() {
    if (app.login()) {
      wx.navigateTo({
        url: `/my/message/message`,
      })
    }
  },

  /**
   * 会员卡
   */
  onVipCard() {
    if (app.login()) {
      wx.navigateTo({
        url: `/my/vipCard/vipCard`
      })
    }
  },

  /**
   * 会员
   */
  onMember() {
    if (app.login()) {
      wx.navigateTo({
        url: `/my/member/member`
      })
    }
  },

  /**
   * 我的钱包
   */
  myWallet() {
    if (app.login()) {
      wx.navigateTo({
        url: `/my/myWallet/myWallet`
      })
    }
  },

  /**
   * 我的订单
   */
  order(e) {
    if (app.login()) {
      let item = e.currentTarget.dataset.item
      let type = {
        distributionType: '0',
        status: null
      }
      switch (item) {
        case 'all': //查看全部
          wx.navigateTo({
            url: `/my/expressOrder/expressOrder`
          })
          break;
        case 'notPay': //待付款
          type.distributionType = '0'
          type.status = '0'
          wx.navigateTo({
            url: `/my/expressOrder/expressOrder?type=${JSON.stringify(type)}`
          })
          break;
        case 'stayRec': //待收货
          type.distributionType = '1,3,4'
          type.status = '1,2'
          wx.navigateTo({
            url: `/my/expressOrder/expressOrder?type=${JSON.stringify(type)}`
          })
          break;
        case 'stayTake': //待自提
          type.distributionType = '2'
          type.status = '2'
          wx.navigateTo({
            url: `/my/expressOrder/expressOrder?type=${JSON.stringify(type)}`
          })
          break;
        case 'stayEval': //待评价
          type.distributionType = '0'
          type.status = '3'
          wx.navigateTo({
            url: `/my/expressOrder/expressOrder?type=${JSON.stringify(type)}`
          })
          break;
        case 'afterSale': //退换/售后
          wx.navigateTo({
            url: `/my/afterSale/afterSale`
          })
          break;
      }
    }
  },

  /**
   * 代言中心
   */
  distribution(e) {
    if (app.login()) {
      if (this.data.info.distribution.distributionId == 0) {
        http.post(app.globalData.distributionJumpSign, {}).then(res => {
          wx.navigateTo({
            url: res.data.path
          })
        })
        return
      }
      let item = e.currentTarget.dataset.item
      switch (item) {
        case 'sy': //收益
          wx.navigateTo({
            url: `/my/fxEarnings/fxEarnings`
          })
          break;
        case 'fs': //粉丝
          wx.navigateTo({
            url: `/my/fxFansList/fxFansList`
          })
          break;
        case 'yq': //邀请
          wx.navigateTo({
            url: `/my/fxInvitation/fxInvitation`
          })
          break;
      }
    }
  },

  /**
   * 小助手
   */
  tool(e) {
    if (app.login()) {
      let item = e.currentTarget.dataset.item
      switch (item) {
        case 'goodsFoll': //商品关注
          wx.navigateTo({
            url: `/my/collectGood/collectGood`
          })
          break;
        case 'storeFoll': //店铺关注
          wx.navigateTo({
            url: `/my/collectShop/collectShop`
          })
          break;
        case 'contentColl': //内容收藏
          wx.navigateTo({
            url: `/my/collectContent/collectContent`
          })
          break;
        case 'browseRec': //浏览纪录
          wx.navigateTo({
            url: `/my/browseHistroy/browseHistroy`
          })
          break;
        case 'myGroup': //我的拼团
          wx.navigateTo({
            url: `/my/myCollage/myCollage`
          })
          break;
        case 'myCut': //我的砍价
          wx.navigateTo({
            url: `/my/myBargain/myBargain`
          })
          break;
        case 'myLuck': //我的抽奖
          wx.navigateTo({
            url: `/my/myPrize/myPrize`
          })
          break;
        case 'myEval': //我的评价
          wx.navigateTo({
            url: `/my/myComment/myComment`
          })
          break;
        case 'customer': //客户服务
          wx.navigateTo({
            url: `/my/customerService/customerService`
          })
          break;
        case 'storeIn': //商家入驻
          wx.navigateTo({
            url: `/my/merchantGuide/merchantGuide`
          })
          break;
      }
    }
  },

  /**
   * 代言等级
   */
  goVicon() {
    wx.navigateTo({
      url: `/my/fxGrade/fxGrade`
    })
  },

  //-----------------------
  /**
   * 获取代言信息
   */
  getDistributionData() {
    http.post(app.globalData.distributionShareInfo, {
      distributionId: app.globalData.supId == '' ? 0 : app.globalData.supId
    }).then(res => {
      try {
        let memberInfo = wx.getStorageSync('memberInfo')
        if (memberInfo.distributionRecord == null) {
          let distributionRecord = {
            distributionId: res.data.cur == null ? null : res.data.cur.distributionId,
            auditStatus: res.data.cur == null ? null : res.data.cur.auditStatus
          }
          memberInfo['distributionRecord'] = distributionRecord
        } else {
          memberInfo.distributionRecord.distributionId = res.data.cur == null ? null : res.data.cur.distributionId
          memberInfo.distributionRecord.auditStatus = res.data.cur == null ? null : res.data.cur.auditStatus
        }
        wx.setStorageSync('memberInfo', memberInfo)
        app.globalData.distribution = res.data
        this.setData({
          distribution: res.data
        })
      } catch (e) {}
    })
  },
  route(e) {
    if (e.currentTarget.dataset.item.id == 5) {
      wx.stopPullDownRefresh()
      wx.startPullDownRefresh()
    }
  }
})