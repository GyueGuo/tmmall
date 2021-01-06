const app = getApp();
const http = require('../../utils/http.js');
const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let info = JSON.parse(options.info)
    for (let i = 0, len = info.length; i < len; i++) {
      info[i].file = decodeURIComponent(info[i].file)
      info[i]['goodLevel'] = 5
      info[i]['isAnonymous'] = 1
      info[i]['content'] = ''
      info[i]['multipleFile'] = ''
      info[i]['videoSrc'] = ''
      info[i]['video'] = ''
      info[i]['picList'] = []
      //匿名
      info[i]['anonymity'] = true
    }
    info['storeLevel'] = 5
    info['logisticsLevel'] = 5
    info['expressContent'] = ''
    this.setData({
      info: info,
      diyColor: app.globalData.diyColor,
      write: options.write
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
   * 商品评分等级
   */
  goodStar(e) {
    this.data.info[e.currentTarget.dataset.index].goodLevel = e.detail
    this.setData({
      info: this.data.info
    })
  },

  /**
   * 店铺评分
   */
  storeStar(e) {
    this.data.info['storeLevel'] = e.detail
    this.setData({
      info: this.data.info
    })
  },

  /**
   * 物流评分
   */
  logisticsStar(e) {
    this.data.info['logisticsLevel'] = e.detail
    this.setData({
      info: this.data.info
    })
  },

  /**
   * 输入内容
   */
  contentInput(e) {
    let index = e.currentTarget.dataset.index
    this.data.info[index].content = e.detail.value.replace(/ /g, '')

  },

  /**
   * 选择视频
   */
  chooseVideo(e) {
    let index = e.currentTarget.dataset.index
    wx.chooseVideo({
      maxDuration: 10,
      success: res => {
        this.data.info[index].video = res.tempFilePath
        this.setData({
          info: this.data.info
        })
      },
    })
  },

  /**
   * 删除视频
   */
  deleteVideo(e) {
    let index = e.currentTarget.dataset.index
    this.data.info[index].video = ''
    this.setData({
      info: this.data.info
    })
  },

  /**
   * 选择图片
   */
  choosePic(e) {
    let index = e.currentTarget.dataset.index
    wx.chooseImage({
      count: 5 - this.data.info[index].picList.length,
      success: res => {
        this.data.info[index].picList = [...this.data.info[index].picList, ...res.tempFilePaths]
        this.setData({
          info: this.data.info
        })
      },
    })
  },

  /**
   * 删除图片
   */
  delectPic(e) {
    let idx = e.currentTarget.dataset.idx,
      index = e.currentTarget.dataset.index
    this.data.info[idx].picList.splice(index, 1)
    this.setData({
      info: this.data.info
    })
  },

  /**
   * 预览
   */
  onPreview(e) {
    let index = e.currentTarget.dataset.index,
      idx = parseInt(e.currentTarget.dataset.idx),
      current = 0
    if (idx == -1 && this.data.info[index].video != '') {
      current = 0
    } else if (this.data.info[index].video != '') {
      current = idx + 1
    } else {
      current = idx
    }
    let list = {
      multipleFile: this.data.info[index].picList,
      video: this.data.info[index].video,
      current: current
    }
    wx.navigateTo({
      url: '/pages/preview/preview?info=' + JSON.stringify(list),
    })
  },

  /**
   * 匿名
   */
  onAnonymity(e) {
    let index = e.currentTarget.dataset.index
    this.data.info[index].anonymity = !this.data.info[index].anonymity
    this.setData({
      info: this.data.info
    })
  },

  expressInput(e) {
    this.data.info.expressContent = e.detail.value
  },

  commit() {
    wx.showLoading({
      title: '上传中...',
      mask: true
    })
    this.uploadFile(0)
  },

  uploadFile(index) {
    if (index < this.data.info.length) {
      this.uploadVideo(index)
    } else {
      this.evaluate()
    }
  },

  /**
   * 上传视频
   */
  uploadVideo(index) {
    if (index < this.data.info.length) {
      if (this.data.info[index].video != '') {
        wx.uploadFile({
          url: app.globalData.uploadVideo,
          filePath: this.data.info[index].video,
          name: 'video',
          success: res => {
            this.data.info[index].videoSrc = (JSON.parse(res.data)).url
            this.uploadImage(index, 0)
          }
        })
      } else {
        this.uploadImage(index, 0)
      }
    } else {
      this.evaluate()
    }

  },

  /**
   * 上传图片
   */
  uploadImage(index, i) {
    if (i < this.data.info[index].picList.length) {
      wx.uploadFile({
        url: app.globalData.uploadPic,
        filePath: this.data.info[index].picList[i],
        name: 'image',
        formData: {
          type: 'goods'
        },
        success: res => {
          this.data.info[index].multipleFile += JSON.parse(res.data).url
          if (i != this.data.info[index].picList.length - 1) {
            this.data.info[index].multipleFile += ','
            this.uploadImage(index, i + 1)
          } else {
            this.uploadVideo(index + 1)
          }
        }
      })
    } else {
      this.uploadVideo(index + 1)
    }

  },

  /**
   * 发表评论
   */
  evaluate() {
    wx.hideLoading()
    let list = []
    for (let i = 0, len = this.data.info.length; i < len; i++) {
      let obj = {
        orderGoodsId: this.data.info[i].orderGoodsId,
        starNum: this.data.info[i].goodLevel,
        content: this.data.info[i].content,
        multipleFile: this.data.info[i].multipleFile,
        video: this.data.info[i].videoSrc,
        attr: this.data.info[i].goodsAttr,
        isAnonymous: this.data.info[i].anonymity ? 1 : 0,
      }
      list.push(obj)
    }

    http.post(app.globalData.evaluateReport, {
      storeStarNum: this.data.info.storeLevel,
      expressStarNum: this.data.info.logisticsLevel,
      expressContent: this.data.info.expressContent,
      goodsSet: list
    }).then(() => {
      app.showSuccessToast('评价成功', () => {
        event.emit('evaluateOrder')
        if (this.data.write == 1) {
          wx.navigateBack({})
        } else {
          wx.redirectTo({
            url: '/pages/commentSuccess/commentSuccess',
          })
        }
      })
    })
  }

})