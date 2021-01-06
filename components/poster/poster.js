const app = getApp();
const http = require('../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {},
  /**
   * 组件的初始数据
   */
  data: {
    limit: true,
    ctx: {},
    file: '',
    qrCode: '',
    opacity: 0,
    poster: '',
    tip: '保存图片到手机后,您可分享该商品图片到',
    text: ''
  },
  ready() {
    this.setData({
      diyColor: app.globalData.diyColor,
      configSwitch: app.globalData.configSwitch
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    download(poster) {
      this.setData({
        text: poster.text
      })
      wx.showLoading({
        title: '生成中...',
      })
      poster.file = decodeURIComponent(poster.file)
      poster.shopLogo = decodeURIComponent(poster.shopLogo)
      wx.getImageInfo({
        src: poster.file,
        success: res => {
          this.data.file = res.path
          wx.getImageInfo({
            src: poster.qrCode,
            success: res => {
              this.data.qrCode = res.path
              wx.getImageInfo({
                src: poster.shopLogo,
                success: res => {
                  this.data.shopLogo = res.path
                  this.draw(poster)
                }
              })
            }
          })
        }
      })
    },
    draw(poster) {
      let price = poster.price
      this.ctx = wx.createCanvasContext('poster', this)
      wx.getImageInfo({
        src: app.globalData.HTTP + 'mobile/small/hb-xsqqg-bj.png',
        success: res => {
          this.ctx.drawImage(res.path, 0, 0, 375, 667)
          wx.getImageInfo({
            src: app.globalData.HTTP + 'mobile/small/image/hb-bj.png',
            success: res => {
              this.ctx.drawImage(res.path, 15, 35, 345, 590)
              if (app.globalData.memberId != '' && app.globalData.phone != '') {
                wx.getImageInfo({
                  src: wx.getStorageSync('memberInfo').avatar,
                  success: res => {
                    this.ctx.save()
                    this.ctx.beginPath()
                    this.ctx.arc(45, 65, 15, 0, 2 * Math.PI)
                    this.ctx.clip()
                    this.ctx.drawImage(res.path, 30, 50, 30, 30)
                    this.ctx.restore()
                    if (poster.distributionGain != undefined) {
                      let titleName = {
                        x: 68,
                        y: 60,
                        width: 50,
                        height: 18,
                        line: 1,
                        color: '#0433FF',
                        size: 14,
                        align: 'left',
                        baseline: 'top',
                        text: wx.getStorageSync('memberInfo').nickname,
                        bold: false
                      }
                      this.textWrap(titleName)
                      let metrics = this.ctx.measureText(wx.getStorageSync('memberInfo').nickname)
                      let titleTip = {
                        x: metrics.width > 50 ? 118 : 74 + metrics.width,
                        y: 60,
                        width: 200,
                        height: 18,
                        line: 2,
                        color: '#666c72',
                        size: 14,
                        align: 'left',
                        baseline: 'top',
                        text: '(诚挚邀请您成为代言人)',
                        // text: poster.distributionGain != undefined ? '(诚挚邀请您成为代言人)' : '发现一个好物,推荐给你呀',
                        bold: false
                      }
                      this.textWrap(titleTip)
                    } else {
                      let titleName = {
                        x: 68,
                        y: 60,
                        width: 50,
                        height: 18,
                        line: 1,
                        color: '#0433FF',
                        size: 14,
                        align: 'left',
                        baseline: 'top',
                        text: wx.getStorageSync('memberInfo').nickname,
                        bold: false
                      }
                      this.textWrap(titleName)
                      let metrics = this.ctx.measureText(wx.getStorageSync('memberInfo').nickname)
                      let titleTip = {
                        x: metrics.width > 50 ? 118 : 74 + metrics.width,
                        y: 60,
                        width: 200,
                        height: 18,
                        line: 2,
                        color: '#666c72',
                        size: 14,
                        align: 'left',
                        baseline: 'top',
                        text: '发现一个好物,推荐给你呀',
                        bold: false
                      }
                      this.textWrap(titleTip)
                    }
                    let titleText = {
                      x: 38,
                      y: 90,
                      width: 200,
                      height: 18,
                      line: 2,
                      color: 'black',
                      size: 15,
                      align: 'left',
                      baseline: 'top',
                      text: '',
                      bold: false
                    }
                    this.textWrap(titleText)
                    this.ctx.drawImage(this.data.file, 32, 90, 310, 310)
                    this.ctx.setFillStyle('rgba(255,255,255,0.8)')
                    this.ctx.fillRect(32, 400, 310, 30)
                    this.ctx.font = 'normal 15px sans-serif';
                    this.ctx.setFillStyle('black')
                    if (this.ctx.measureText(poster.name).width < 330) {
                      this.ctx.fillText(poster.name, 38, 420)
                    } else {
                      let text = {
                        x: 38,
                        y: 402,
                        width: 330,
                        height: 20,
                        line: 1,
                        color: 'black',
                        size: 15,
                        align: 'left',
                        baseline: 'top',
                        text: poster.name,
                        bold: false
                      }
                      this.textWrap(text)
                    }
                    this.ctx.font = 'normal normal 14px sans-serif';
                    let sale = '',
                      kjWidth = 0
                    if (poster.isLimit == 1) {
                      wx.getImageInfo({
                        src: app.globalData.HTTP + 'mobile/small/image/hb-xsqqg-tb.png',
                        success: res => {
                          this.ctx.drawImage(res.path, 30, 452, 42, 14)
                        }
                      })
                      sale = '已抢' + poster.limitNumber + '件'
                      kjWidth = 48
                    } else if (poster.isGroup == 1) {
                      sale = '已拼' + poster.limitNumber + '件'
                      this.ctx.font = 'normal 10px sans-serif';
                      this.ctx.setFillStyle('#f20230')
                      wx.getImageInfo({
                        src: app.globalData.HTTP + 'mobile/small/image/hb-pt-tb.png',
                        success: res => {
                          this.ctx.drawImage(res.path, 30, 452, 42, 14)
                        }
                      })
                      this.ctx.fillText(poster.groupNum + '人拼', 43, 462.4)
                      kjWidth = 48
                    } else if (poster.isBargain == 1) {
                      wx.getImageInfo({
                        src: app.globalData.HTTP + 'mobile/small/image/hb-kj-tb.png',
                        success: res => {
                          this.ctx.drawImage(res.path, 30, 452, 42, 14)
                        }
                      })
                      sale = '已售' + poster.salesVolume + '件'
                      kjWidth = 48
                    } else {
                      sale = '已售' + poster.salesVolume + '件'
                    }
                    this.ctx.font = 'normal 19px sans-serif';
                    this.ctx.setFillStyle('#f20230')
                    this.ctx.fillText('￥', 30 + kjWidth, 466)
                    let unitWidth = this.ctx.measureText('￥').width
                    this.ctx.font = 'normal bold 26px sans-serif';
                    this.ctx.fillText(price.split('.')[0] + '.', 30 + unitWidth + kjWidth, 466)
                    let integer = this.ctx.measureText(price.split('.')[0] + '.').width
                    let left = parseFloat(30 + unitWidth + integer + kjWidth)
                    this.ctx.font = 'normal normal 19px sans-serif';
                    this.ctx.fillText(price.split('.')[1], left, 466)
                    let saleWidth = this.ctx.measureText(sale).width
                    let goodsText = {
                      x: 336 - saleWidth,
                      y: 450,
                      width: 530,
                      height: 18,
                      line: 2,
                      color: '#acacac',
                      size: 14,
                      align: 'left',
                      baseline: 'top',
                      text: sale,
                      bold: false
                    }
                    this.textWrap(goodsText)
                    this.ctx.drawImage(this.data.qrCode, 38, 500, 106, 106)
                    this.ctx.save()
                    this.ctx.beginPath()
                    this.ctx.arc(91, 553, 26.5, 0, 2 * Math.PI)
                    this.ctx.clip()
                    this.ctx.drawImage(this.data.shopLogo, 64.5, 526.5, 53, 53)
                    this.ctx.restore()
                    let codeText = {
                      x: 170,
                      y: 520,
                      width: 530,
                      height: 18,
                      line: 2,
                      color: 'black',
                      size: 18,
                      align: 'left',
                      baseline: 'top',
                      text: '长按识别二维码',
                      bold: true
                    }
                    this.textWrap(codeText)
                    let codeTip = {
                      x: 170,
                      y: 550,
                      width: 530,
                      height: 18,
                      line: 2,
                      color: '#9a9a9a',
                      size: 14,
                      align: 'left',
                      baseline: 'top',
                      text: '超值好货一起购',
                      bold: false
                    }
                    this.textWrap(codeTip)
                    this.ctx.draw(false, () => {
                      setTimeout(() => {
                        wx.canvasToTempFilePath({
                          canvasId: 'poster',
                          success: res => {
                            this.setData({
                              poster: res.tempFilePath
                            })
                            this.show()
                            wx.hideLoading()
                          },
                          fail(e) {
                            app.showToast('生成失败')
                            wx.hideLoading()
                          }
                        }, this)
                      }, 1000)
                    })
                  },
                  fail() { }
                })
              } else {
                let titleTip = {
                  x: 40,
                  y: 60,
                  width: 200,
                  height: 18,
                  line: 2,
                  color: '#666c72',
                  size: 14,
                  align: 'left',
                  baseline: 'top',
                  text: '发现一个好物,推荐给你呀',
                  bold: false
                }
                this.textWrap(titleTip)
                let titleText = {
                  x: 38,
                  y: 90,
                  width: 200,
                  height: 18,
                  line: 2,
                  color: 'black',
                  size: 15,
                  align: 'left',
                  baseline: 'top',
                  text: '',
                  bold: false
                }
                this.textWrap(titleText)
                this.ctx.drawImage(this.data.file, 32, 90, 310, 310)
                this.ctx.setFillStyle('rgba(255,255,255,0.8)')
                this.ctx.fillRect(32, 400, 310, 30)
                this.ctx.font = 'normal 15px sans-serif';
                this.ctx.setFillStyle('black')
                if (this.ctx.measureText(poster.name).width < 330) {
                  this.ctx.fillText(poster.name, 38, 420)
                } else {
                  let text = {
                    x: 38,
                    y: 402,
                    width: 330,
                    height: 20,
                    line: 1,
                    color: 'black',
                    size: 15,
                    align: 'left',
                    baseline: 'top',
                    text: poster.name,
                    bold: false
                  }
                  this.textWrap(text)
                }
                this.ctx.font = 'normal normal 14px sans-serif';
                let sale = '',
                  kjWidth = 0
                if (poster.isLimit == 1) {
                  wx.getImageInfo({
                    src: app.globalData.HTTP + 'mobile/small/image/hb-xsqqg-tb.png',
                    success: res => {
                      this.ctx.drawImage(res.path, 30, 452, 42, 14)
                    }
                  })
                  sale = '已抢' + poster.limitNumber + '件'
                  kjWidth = 48
                } else if (poster.isGroup == 1) {
                  sale = '已拼' + poster.limitNumber + '件'
                  this.ctx.font = 'normal 10px sans-serif';
                  this.ctx.setFillStyle('#f20230')
                  wx.getImageInfo({
                    src: app.globalData.HTTP + 'mobile/small/image/hb-pt-tb.png',
                    success: res => {
                      this.ctx.drawImage(res.path, 30, 452, 42, 14)
                    }
                  })
                  this.ctx.fillText(poster.groupNum + '人拼', 43, 462.4)
                  kjWidth = 48
                } else if (poster.isBargain == 1) {
                  wx.getImageInfo({
                    src: app.globalData.HTTP + 'mobile/small/image/hb-kj-tb.png',
                    success: res => {
                      this.ctx.drawImage(res.path, 30, 452, 42, 14)
                    }
                  })
                  sale = '已售' + poster.salesVolume + '件'
                  kjWidth = 48
                } else {
                  sale = '已售' + poster.salesVolume + '件'
                }
                this.ctx.font = 'normal 19px sans-serif';
                this.ctx.setFillStyle('#f20230')
                this.ctx.fillText('￥', 30 + kjWidth, 466)
                let unitWidth = this.ctx.measureText('￥').width
                this.ctx.font = 'normal bold 26px sans-serif';
                this.ctx.fillText(price.split('.')[0] + '.', 30 + unitWidth + kjWidth, 466)
                let integer = this.ctx.measureText(price.split('.')[0] + '.').width
                let left = parseFloat(30 + unitWidth + integer + kjWidth)
                this.ctx.font = 'normal normal 19px sans-serif';
                this.ctx.fillText(price.split('.')[1], left, 466)
                let saleWidth = this.ctx.measureText(sale).width
                let goodsText = {
                  x: 336 - saleWidth,
                  y: 450,
                  width: 530,
                  height: 18,
                  line: 2,
                  color: '#acacac',
                  size: 14,
                  align: 'left',
                  baseline: 'top',
                  text: sale,
                  bold: false
                }
                this.textWrap(goodsText)
                this.ctx.drawImage(this.data.qrCode, 38, 500, 106, 106)
                this.ctx.save()
                this.ctx.beginPath()
                this.ctx.arc(91, 553, 26.5, 0, 2 * Math.PI)
                this.ctx.clip()
                this.ctx.drawImage(this.data.shopLogo, 64.5, 526.5, 53, 53)
                this.ctx.restore()
                let codeText = {
                  x: 170,
                  y: 520,
                  width: 530,
                  height: 18,
                  line: 2,
                  color: 'black',
                  size: 18,
                  align: 'left',
                  baseline: 'top',
                  text: '长按识别二维码',
                  bold: true
                }
                this.textWrap(codeText)
                let codeTip = {
                  x: 170,
                  y: 550,
                  width: 530,
                  height: 18,
                  line: 2,
                  color: '#9a9a9a',
                  size: 14,
                  align: 'left',
                  baseline: 'top',
                  text: '超值好货一起购',
                  bold: false
                }
                this.textWrap(codeTip)
                this.ctx.draw(false, () => {
                  setTimeout(() => {
                    wx.canvasToTempFilePath({
                      canvasId: 'poster',
                      success: res => {
                        this.setData({
                          poster: res.tempFilePath
                        })
                        this.show()
                        wx.hideLoading()
                      },
                      fail(e) {
                        app.showToast('生成失败')
                        wx.hideLoading()
                      }
                    }, this)
                  }, 1000)
                })

              }
            }
          })
        }
      })
    },
    /**
     * 渲染文字
     *
     * @param {Object} obj
     */
    drawText(obj) {
      this.ctx.save();
      this.ctx.setFillStyle(obj.color);
      this.ctx.setFontSize(obj.size);
      this.ctx.setTextAlign(obj.align);
      this.ctx.setTextBaseline(obj.baseline);
      if (obj.bold) {
        this.ctx.fillText(obj.text, obj.x, obj.y - 0.5);
        this.ctx.fillText(obj.text, obj.x - 0.5, obj.y);
      }
      this.ctx.fillText(obj.text, obj.x, obj.y);
      if (obj.bold) {
        this.ctx.fillText(obj.text, obj.x, obj.y + 0.5);
        this.ctx.fillText(obj.text, obj.x + 0.5, obj.y);
      }
      this.ctx.restore();
    },
    /**
     * 获取文本折行
     * @param {Object} obj
     * @return {Array} arrTr
     */
    getTextLine(obj) {
      this.ctx.setFontSize(obj.size);
      let arrText = obj.text.split('');
      let line = '';
      let arrTr = [];
      for (let i = 0, len = arrText.length; i < len; i++) {
        let testLine = line + arrText[i];
        let metrics = this.ctx.measureText(testLine);
        let width = metrics.width;
        if (width > obj.width && i > 0) {
          arrTr.push(line);
          line = arrText[i];
        } else {
          line = testLine;
        }
        if (i == arrText.length - 1) {
          arrTr.push(line);
        }
      }
      return arrTr;
    },
    /**
     * 文本换行
     *
     * @param {Object} obj
     */
    textWrap(obj) {
      let tr = this.getTextLine(obj);
      for (let i = 0, len = tr.length; i < len; i++) {
        if (i < obj.line) {
          let txt = {
            x: obj.x,
            y: obj.y + (i * obj.height),
            color: obj.color,
            size: obj.size,
            align: obj.align,
            baseline: obj.baseline,
            text: tr[i],
            bold: obj.bold
          };
          if (i == obj.line - 1 && tr.length > 1) {
            txt.text = txt.text.substring(0, txt.text.length - 3) + '...';
          }
          this.drawText(txt);
        }
      }
    },
    /**
     * 显示
     */
    show() {
      this.showAnimation()
    },
    /**
     * 弹出动画
     */
    showAnimation(anim) {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      animation.translateY(-wx.getSystemInfoSync().windowHeight)
      this.setData({
        animation: animation.step(),
        isShow: true
      })
      this.fadeIn()
    },
    /**
     * 关闭动画
     */
    hiddenAnimation() {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      animation.translateY(wx.getSystemInfoSync().windowHeight)
      this.setData({
        animation: animation.step(),
        isShow: false
      })
      this.fadeOut()
    },
    /**
     * 淡入效果
     */
    fadeIn() {
      let interval = setInterval(() => {
        if (this.data.opacity >= 0.3) {
          clearInterval(interval)
        }
        this.setData({
          opacity: this.data.opacity + 0.01
        })
      }, 10)
    },
    /**
     * 淡出效果
     */
    fadeOut() {
      let interval = setInterval(() => {
        if (this.data.opacity <= 0) {
          clearInterval(interval)
        }
        this.setData({
          opacity: this.data.opacity - 0.1
        })
      }, 100)
    },
    /**
     * 关闭窗口
     */
    close() {
      this.hiddenAnimation()
    },
    savePoster() {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.poster,
        success: res => {
          app.showSuccessToast('保存成功')
          this.close()
        },
        fail(res) {
          app.showToast('请开启保存到相册权限')
        }
      })
    },
    changeLimit(e) {
      this.setData({
        limit: e
      })
    }
  }
})