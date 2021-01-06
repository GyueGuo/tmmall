const app = getApp();
const Base64 = require('../../utils/base64.min.js').Base64;
//初始化数据
function tabbarinit(bindName = "tabdata", id, that) {
  wx.hideTabBar({})
  wx.request({
    url: app.globalData.navigation,
    data: {
      type: app.globalData.navType //底部导航样式 首页判断
    },
    method: 'POST',
    success: (res) => {
      let otabbar = res.data.data,
        bindData = {}
      for (let i of otabbar) {
        i.iconPath = Base64.encode(i.iconPath)
        i.selectedIconPath = Base64.encode(i.selectedIconPath.split('#7f7f7f').join(app.globalData.diyColor.zColor))
      }
      //换当前的icon
      otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']
      otabbar[id]['current'] = 1;
      bindData[bindName] = otabbar
      that.setData({
        bindData
      })
    }
  })
}

module.exports = {
  tabbar: tabbarinit
}