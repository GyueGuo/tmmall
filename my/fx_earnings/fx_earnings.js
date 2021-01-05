import F2 from './f2-canvas/lib/f2';
const app = getApp();
const http = require('../../utils/http.js');
let aData;

function initChart(canvas, width, height) {
  const chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  http.post(app.globalData.dyEarningsView, {
    distributionId: app.globalData.distribution.cur.distributionId
  }).then(res => {
    aData = res.data.sevenData
    let num = aData.map(val => {
      return {
        brokerage: Number(val.brokerage),
        dayTime: val.dayTime
      }
    })
    chart.source(num);
    chart.scale('dayTime', {
      tickCount: 7
    });
    chart.axis('dayTime', {
      line: null
    })
    chart.axis('brokerage', false)

    // tooltip 与图例结合
    chart.tooltip({
      showCrosshairs: true,
      custom: true, // 自定义 tooltip 内容框
      onChange(obj) {
        const legend = chart.get('legendController').legends.top[0];
        const tooltipItems = obj.items;
        const legendItems = legend.items;
        const map = {};
        legendItems.map(item => {
          map[item.name] = Object.assign({}, item);
        });
        tooltipItems.map(item => {
          const {
            name,
            value
          } = item;
          if (map[name]) {
            map[name].value = value;
          }
        });
        legend.setItems(Object.values(map));
      },
      onHide() {
        const legend = chart.get('legendController').legends.top[0];
        legend.setItems(chart.getLegendItems().country);
      }
    });

    // 柱状图添加文本
    aData.map(function(obj) {
      chart.guide().text({
        position: [obj.dayTime, obj.brokerage],
        content: obj.brokerage,
        style: {
          textAlign: 'center',
          textBaseline: 'bottom',
          stroke: '#f23030'
        },
        offsetY: -4
      });
    });

    chart.area().position('dayTime*brokerage').color('l(90) 0:#f23030 1:#f7f7f7').shape('smooth');
    chart.line().position('dayTime*brokerage').color('l(90) 0:#f23030 1:#f23030').shape('smooth');
    chart.point().position('dayTime*brokerage').color('#fff').shape('smooth').style({
      stroke: '#f23030',
      lineWidth: 2
    });
    chart.render();
  })
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    opts: {
      onInit: initChart
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diyColor: app.globalData.diyColor
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
   * 获取数据
   */
  getData() {
    http.post(app.globalData.dyEarningsView, {
      distributionId: app.globalData.distribution.cur.distributionId
    }).then(res => {
      this.setData({
        info: res.data
      })
    })
  },

  /**
   * 累计收入
   */
  fxEarningsList(e) {
    let type = e.currentTarget.dataset.type,
      title = e.currentTarget.dataset.title
    if (title == 'total') {
      if (type == 0) {
        wx.navigateTo({
          url: '/my/fxEarningsList/fxEarningsList?title=' + title + '&type=' + type,
        })
      } else if (type == 1) {
        wx.navigateTo({
          url: '/my/fxEarningsList/fxEarningsList?title=' + title + '&type=' + type,
        })
      }
    } else if (title == 'today') {
      if (type == 0) {
        wx.navigateTo({
          url: '/my/fxEarningsList/fxEarningsList?title=' + title + '&type=' + type,
        })
      } else if (type == 1) {
        wx.navigateTo({
          url: '/my/fxEarningsList/fxEarningsList?title=' + title + '&type=' + type,
        })
      }
    }
  },
  /**
   * 提现
   */
  fxWithdrawal(e) {
    wx.navigateTo({
      url: '/my/fxWithdrawal/fxWithdrawal'
    })
  },

  /**
   * 代言说明
   */
  goExplain() {
    wx.navigateTo({
      url: '/my/webView/webView?id=distribution'
    })
  }

})