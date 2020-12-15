const app = getApp();
const http = require('../../utils/http.js');
const navBar = require('../../components/navBar/navBar.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login_status: false,
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
      diy_color: app.globalData.diy_color,
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
    if (app.globalData.member_id != '' && app.globalData.phone != '') {
      this.setData({
        login_status: true
      })
    } else {
      this.setData({
        login_status: false
      })
    }
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
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 登录
   */
  login_status() {
    app.login()
  },

  /**
   * 请求数据
   */
  getData() {
    http.encPost(app.globalData.my, {}).then(res => {
      this.setData({
        info: res.data,
        parameter: res.data.encrypt.parameter,
        information: res.data.userInfo.information
      })
      this.getDistributionData()
    }).catch(res => {
      wx.navigateTo({
        url: '/pages/accredit/accredit',
      })
    })
    navBar.tabbar("tabBar", app.globalData.isShops == 0 && this.data.configSwitch.version_info.one_more == 1 ? 4 : 3, this) // 我的 多店4，单店3
  },

  /**
   * 设置
   */
  onSetting() {
    if (app.globalData.member_id == '') {
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
        url: `/my/vip_card/vip_card`
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
        url: `/my/my_wallet/my_wallet`
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
        distribution_type: '0',
        status: null
      }
      switch (item) {
        case 'all': //查看全部
          wx.navigateTo({
            url: `/my/express_order/express_order`
          })
          break;
        case 'notPay': //待付款
          type.distribution_type = '0'
          type.status = '0'
          wx.navigateTo({
            url: `/my/express_order/express_order?type=${JSON.stringify(type)}`
          })
          break;
        case 'stayRec': //待收货
          type.distribution_type = '1,3,4'
          type.status = '1,2'
          wx.navigateTo({
            url: `/my/express_order/express_order?type=${JSON.stringify(type)}`
          })
          break;
        case 'stayTake': //待自提
          type.distribution_type = '2'
          type.status = '2'
          wx.navigateTo({
            url: `/my/express_order/express_order?type=${JSON.stringify(type)}`
          })
          break;
        case 'stayEval': //待评价
          type.distribution_type = '0'
          type.status = '3'
          wx.navigateTo({
            url: `/my/express_order/express_order?type=${JSON.stringify(type)}`
          })
          break;
        case 'afterSale': //退换/售后
          wx.navigateTo({
            url: `/my/after_sale/after_sale`
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
      if (this.data.info.distribution.distribution_id == 0) {
        http.post(app.globalData.distribution_jumpSign, {}).then(res => {
          wx.navigateTo({
            url: res.data.path
          })
        })
        // wx.navigateTo({
        //   url: '/my/fx_cwdy/fx_cwdy',
        // })
        return
      }
      let item = e.currentTarget.dataset.item
      switch (item) {
        case 'sy': //收益
          wx.navigateTo({
            url: `/my/fx_earnings/fx_earnings`
          })
          break;
        case 'fs': //粉丝
          wx.navigateTo({
            url: `/my/fx_fans_list/fx_fans_list`
          })
          break;
        case 'yq': //邀请
          wx.navigateTo({
            url: `/my/fx_invitation/fx_invitation`
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
            url: `/my/collect_good/collect_good`
          })
          break;
        case 'storeFoll': //店铺关注
          wx.navigateTo({
            url: `/my/collect_shop/collect_shop`
          })
          break;
        case 'contentColl': //内容收藏
          wx.navigateTo({
            url: `/my/collect_content/collect_content`
          })
          break;
        case 'browseRec': //浏览纪录
          wx.navigateTo({
            url: `/my/browse_histroy/browse_histroy`
          })
          break;
        case 'myGroup': //我的拼团
          wx.navigateTo({
            url: `/my/my_collage/my_collage`
          })
          break;
        case 'myCut': //我的砍价
          wx.navigateTo({
            url: `/my/my_bargain/my_bargain`
          })
          break;
        case 'myLuck': //我的抽奖
          wx.navigateTo({
            url: `/my/my_prize/my_prize`
          })
          break;
        case 'myEval': //我的评价
          wx.navigateTo({
            url: `/my/my_comment/my_comment`
          })
          break;
        case 'customer': //客户服务
          wx.navigateTo({
            url: `/my/customer_service/customer_service`
          })
          break;
        case 'storeIn': //商家入驻
          wx.navigateTo({
            url: `/my/merchant_guide/merchant_guide`
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
      url: `/my/fx_grade/fx_grade`
    })
  },

  //-----------------------
  /**
   * 获取代言信息
   */
  getDistributionData() {
    http.post(app.globalData.distribution_share_info, {
      distributionId: app.globalData.sup_id == '' ? 0 : app.globalData.sup_id
    }).then(res => {
      try {
        let member_info = wx.getStorageSync('member_info')
        if (member_info.distribution_record == null) {
          let distribution_record = {
            distribution_id: res.data.cur == null ? null : res.data.cur.distribution_id,
            audit_status: res.data.cur == null ? null : res.data.cur.audit_status
          }
          member_info['distribution_record'] = distribution_record
        } else {
          member_info.distribution_record.distribution_id = res.data.cur == null ? null : res.data.cur.distribution_id
          member_info.distribution_record.audit_status = res.data.cur == null ? null : res.data.cur.audit_status
        }
        wx.setStorageSync('member_info', member_info)
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