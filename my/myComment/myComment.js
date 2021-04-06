const app = getApp();
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    page: 1,
    list: [],
    total: []
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

  onAll() {
    this.setData({
      list: [],
      type: 0,
      page: 1
    })
    this.getData()
  },

  onPhoto() {
    this.setData({
      list: [],
      type: 1,
      page: 1
    })
    this.getData()
  },

  loadmore() {
    if (this.data.total > this.data.list.length) {
      this.data.page++;
      this.getData()
    }
  },

  getData() {
    http.post(app.globalData.myEvaluateList, {
      type: this.data.type,
      page: this.data.page
    }).then(res => {
      if (this.data.page == 1) {
        this.setData({
          total: res.result.total,
          list: res.result.data
        })
      } else {
        this.setData({
          list: [...this.data.list, ...res.result.data]
        })
      }
    })
  },

  /**
   * 预览
   */
  onPreview(e) {
    let index = e.currentTarget.dataset.index,
      idx = parseInt(e.currentTarget.dataset.idx),
      current = 0
    if (idx == -1 && this.data.list[index].video != '') {
      current = 0
    } else if (this.data.list[index].video != '') {
      current = idx + 1
    } else {
      current = idx
    }
    let multipleFile = []
    for (let i = 0, len = this.data.list[index].multipleFile.length; i < len; i++) {
      multipleFile.push(encodeURIComponent(this.data.list[index].multipleFile[i]))
    }
    let list = {
      multipleFile: multipleFile,
      video: encodeURIComponent(this.data.list[index].video),
      current: current
    }
    wx.navigateTo({
      url: '/nearbyShops/preview/preview?info=' + JSON.stringify(list),
    })
  },

  goComment() {
    wx.redirectTo({
      url: '/pages/commentSuccess/commentSuccess?write=1',
    })
  },
  onGoods(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/nearbyShops/goodDetail/goodDetail?goodsId=' + item.goodsId,
    })
  },
  onDelete(e) {
    const { item } = e.currentTarget.dataset;
    http.post(app.globalData.deleteEvaluate, {
      goodsEvaluateId: item.goodsEvaluateId,
    }).then((res) => {
      this.setData({
        page: res.result.currentPage,
        total: res.result.total,
        list: res.result.data
      });
    })
  }
})