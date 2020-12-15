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
    qr_code: '',
    opacity: 0,
    poster: '',
    tip: '保存图片到手机后,您可分享该商品图片到',
    text: ''
  },
  ready() {
    this.setData({
      diy_color: app.globalData.diy_color,
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
      poster.shop_logo = decodeURIComponent(poster.shop_logo)
      wx.getImageInfo({
        src: poster.file,
        success: res => {
          this.data.file = res.path
          wx.getImageInfo({
            src: poster.qrCode,
            success: res => {
              this.data.qr_code = res.path
              wx.getImageInfo({
                src: poster.shop_logo,
                success: res => {
                  this.data.shop_logo = res.path
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
          // if (poster.is_bargain == 1) {
          //   this.ctx.drawImage('/image/hb-kj-xwz.png', 0, 628, 375, 38)
          // } else if (poster.is_group == 1) {
          //   this.ctx.drawImage('/image/hb-pt-xwz.png', 0, 628, 375, 38)
          // } else if (poster.is_limit == 1) {
          //   this.ctx.drawImage('/image/hb-xsqqg-xwz.png', 0, 628, 375, 38)
          // } else {
          //   this.ctx.drawImage('/image/hb-ptsp-xwz.png', 0, 628, 375, 38)
          // }
          wx.getImageInfo({
            src: app.globalData.HTTP + 'mobile/small/image/hb-bj.png',
            success: res => {
              this.ctx.drawImage(res.path, 15, 35, 345, 590)
              if (app.globalData.member_id != '' && app.globalData.phone != '') {
                wx.getImageInfo({
                  src: wx.getStorageSync('member_info').avatar,
                  success: res => {
                    this.ctx.save()
                    this.ctx.beginPath()
                    this.ctx.arc(45, 65, 15, 0, 2 * Math.PI)
                    this.ctx.clip()
                    this.ctx.drawImage(res.path, 30, 50, 30, 30)
                    this.ctx.restore()
                    if (poster.distribution_gain != undefined) {
                      let title_name = {
                        x: 68,
                        y: 60,
                        width: 50,
                        height: 18,
                        line: 1,
                        color: '#0433FF',
                        size: 14,
                        align: 'left',
                        baseline: 'top',
                        text: wx.getStorageSync('member_info').nickname,
                        bold: false
                      }
                      this.textWrap(title_name)
                      let metrics = this.ctx.measureText(wx.getStorageSync('member_info').nickname)
                      let title_tip = {
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
                        // text: poster.distribution_gain != undefined ? '(诚挚邀请您成为代言人)' : '发现一个好物,推荐给你呀',
                        bold: false
                      }
                      this.textWrap(title_tip)
                    } else {
                      let title_name = {
                        x: 68,
                        y: 60,
                        width: 50,
                        height: 18,
                        line: 1,
                        color: '#0433FF',
                        size: 14,
                        align: 'left',
                        baseline: 'top',
                        text: wx.getStorageSync('member_info').nickname,
                        bold: false
                      }
                      this.textWrap(title_name)
                      let metrics = this.ctx.measureText(wx.getStorageSync('member_info').nickname)
                      let title_tip = {
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
                        // text: poster.distribution_gain != undefined ? '(诚挚邀请您成为代言人)' : '发现一个好物,推荐给你呀',
                        bold: false
                      }
                      this.textWrap(title_tip)
                      // let title_item = {
                      //   x: 68,
                      //   y: 60,
                      //   width: 200,
                      //   height: 18,
                      //   line: 1,
                      //   color: '#666c72',
                      //   size: 14,
                      //   align: 'left',
                      //   baseline: 'top',
                      //   text: wx.getStorageSync('member_info').nickname,
                      //   bold: false
                      // }
                      // this.textWrap(title_item)
                    }
                    // let title_text = {
                    //   x: 38,
                    //   y: 90,
                    //   width: 200,
                    //   height: 18,
                    //   line: 2,
                    //   color: 'black',
                    //   size: 15,
                    //   align: 'left',
                    //   baseline: 'top',
                    //   text: poster.distribution_gain != undefined ? '成为代言人,推广最高收益可达' : '发现一个好物,推荐给你呀',
                    //   bold: false
                    // }
                    let title_text = {
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
                    this.textWrap(title_text)
                    let metrics = this.ctx.measureText(title_text.text)
                    if (poster.distribution_gain != undefined) {
                      // let distribution_text = {
                      //   x: 38 + metrics.width + 4,
                      //   y: 90,
                      //   width: 200,
                      //   height: 18,
                      //   line: 2,
                      //   color: '#f20230',
                      //   size: 15,
                      //   align: 'left',
                      //   baseline: 'top',
                      //   text: `${poster.distribution_gain}`,
                      //   bold: false
                      // }
                      // this.textWrap(distribution_text)
                      // let member = this.ctx.measureText(distribution_text.text)
                      // var distribution_member = {
                      //   x: 38 + metrics.width + 6 + member.width,
                      //   y: 90,
                      //   width: 200,
                      //   height: 18,
                      //   line: 2,
                      //   color: 'black',
                      //   size: 15,
                      //   align: 'left',
                      //   baseline: 'top',
                      //   text: `元`,
                      //   bold: false
                      // }
                      // this.textWrap(distribution_member)
                    }
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
                      kj_width = 0
                    if (poster.is_limit == 1) {
                      wx.getImageInfo({
                        src: app.globalData.HTTP + 'mobile/small/image/hb-xsqqg-tb.png',
                        success: res => {
                          this.ctx.drawImage(res.path, 30, 452, 42, 14)
                        }
                      })
                      sale = '已抢' + poster.limit_number + '件'
                      kj_width = 48
                    } else if (poster.is_group == 1) {
                      sale = '已拼' + poster.limit_number + '件'
                      this.ctx.font = 'normal 10px sans-serif';
                      this.ctx.setFillStyle('#f20230')
                      wx.getImageInfo({
                        src: app.globalData.HTTP + 'mobile/small/image/hb-pt-tb.png',
                        success: res => {
                          this.ctx.drawImage(res.path, 30, 452, 42, 14)
                        }
                      })
                      this.ctx.fillText(poster.group_num + '人拼', 43, 462.4)
                      kj_width = 48
                    } else if (poster.is_bargain == 1) {
                      wx.getImageInfo({
                        src: app.globalData.HTTP + 'mobile/small/image/hb-kj-tb.png',
                        success: res => {
                          this.ctx.drawImage(res.path, 30, 452, 42, 14)
                        }
                      })
                      sale = '已售' + poster.sales_volume + '件'
                      kj_width = 48
                    } else {
                      sale = '已售' + poster.sales_volume + '件'
                    }
                    this.ctx.font = 'normal 19px sans-serif';
                    this.ctx.setFillStyle('#f20230')
                    this.ctx.fillText('￥', 30 + kj_width, 466)
                    let unit_width = this.ctx.measureText('￥').width
                    this.ctx.font = 'normal bold 26px sans-serif';
                    this.ctx.fillText(price.split('.')[0] + '.', 30 + unit_width + kj_width, 466)
                    let integer = this.ctx.measureText(price.split('.')[0] + '.').width
                    let left = parseFloat(30 + unit_width + integer + kj_width)
                    this.ctx.font = 'normal normal 19px sans-serif';
                    this.ctx.fillText(price.split('.')[1], left, 466)
                    let sale_width = this.ctx.measureText(sale).width
                    let goods_text = {
                      x: 336 - sale_width,
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
                    this.textWrap(goods_text)
                    this.ctx.drawImage(this.data.qr_code, 38, 500, 106, 106)
                    this.ctx.save()
                    this.ctx.beginPath()
                    this.ctx.arc(91, 553, 26.5, 0, 2 * Math.PI)
                    this.ctx.clip()
                    this.ctx.drawImage(this.data.shop_logo, 64.5, 526.5, 53, 53)
                    this.ctx.restore()
                    let code_text = {
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
                    this.textWrap(code_text)
                    let code_tip = {
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
                    this.textWrap(code_tip)
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
                let title_tip = {
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
                  // text: poster.distribution_gain != undefined ? '(诚挚邀请您成为代言人)' : '发现一个好物,推荐给你呀',
                  bold: false
                }
                this.textWrap(title_tip)
                // let title_item = {
                //   x: 68,
                //   y: 60,
                //   width: 200,
                //   height: 18,
                //   line: 1,
                //   color: '#666c72',
                //   size: 14,
                //   align: 'left',
                //   baseline: 'top',
                //   text: wx.getStorageSync('member_info').nickname,
                //   bold: false
                // }
                // this.textWrap(title_item)

                // let title_text = {
                //   x: 38,
                //   y: 90,
                //   width: 200,
                //   height: 18,
                //   line: 2,
                //   color: 'black',
                //   size: 15,
                //   align: 'left',
                //   baseline: 'top',
                //   text: poster.distribution_gain != undefined ? '成为代言人,推广最高收益可达' : '发现一个好物,推荐给你呀',
                //   bold: false
                // }
                let title_text = {
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
                this.textWrap(title_text)
                let metrics = this.ctx.measureText(title_text.text)
                if (poster.distribution_gain != undefined) {
                  // let distribution_text = {
                  //   x: 38 + metrics.width + 4,
                  //   y: 90,
                  //   width: 200,
                  //   height: 18,
                  //   line: 2,
                  //   color: '#f20230',
                  //   size: 15,
                  //   align: 'left',
                  //   baseline: 'top',
                  //   text: `${poster.distribution_gain}`,
                  //   bold: false
                  // }
                  // this.textWrap(distribution_text)
                  // let member = this.ctx.measureText(distribution_text.text)
                  // var distribution_member = {
                  //   x: 38 + metrics.width + 6 + member.width,
                  //   y: 90,
                  //   width: 200,
                  //   height: 18,
                  //   line: 2,
                  //   color: 'black',
                  //   size: 15,
                  //   align: 'left',
                  //   baseline: 'top',
                  //   text: `元`,
                  //   bold: false
                  // }
                  // this.textWrap(distribution_member)
                }
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
                  kj_width = 0
                if (poster.is_limit == 1) {
                  wx.getImageInfo({
                    src: app.globalData.HTTP + 'mobile/small/image/hb-xsqqg-tb.png',
                    success: res => {
                      this.ctx.drawImage(res.path, 30, 452, 42, 14)
                    }
                  })
                  sale = '已抢' + poster.limit_number + '件'
                  kj_width = 48
                } else if (poster.is_group == 1) {
                  sale = '已拼' + poster.limit_number + '件'
                  this.ctx.font = 'normal 10px sans-serif';
                  this.ctx.setFillStyle('#f20230')
                  wx.getImageInfo({
                    src: app.globalData.HTTP + 'mobile/small/image/hb-pt-tb.png',
                    success: res => {
                      this.ctx.drawImage(res.path, 30, 452, 42, 14)
                    }
                  })
                  this.ctx.fillText(poster.group_num + '人拼', 43, 462.4)
                  kj_width = 48
                } else if (poster.is_bargain == 1) {
                  wx.getImageInfo({
                    src: app.globalData.HTTP + 'mobile/small/image/hb-kj-tb.png',
                    success: res => {
                      this.ctx.drawImage(res.path, 30, 452, 42, 14)
                    }
                  })
                  sale = '已售' + poster.sales_volume + '件'
                  kj_width = 48
                } else {
                  sale = '已售' + poster.sales_volume + '件'
                }
                this.ctx.font = 'normal 19px sans-serif';
                this.ctx.setFillStyle('#f20230')
                this.ctx.fillText('￥', 30 + kj_width, 466)
                let unit_width = this.ctx.measureText('￥').width
                this.ctx.font = 'normal bold 26px sans-serif';
                this.ctx.fillText(price.split('.')[0] + '.', 30 + unit_width + kj_width, 466)
                let integer = this.ctx.measureText(price.split('.')[0] + '.').width
                let left = parseFloat(30 + unit_width + integer + kj_width)
                this.ctx.font = 'normal normal 19px sans-serif';
                this.ctx.fillText(price.split('.')[1], left, 466)
                let sale_width = this.ctx.measureText(sale).width
                let goods_text = {
                  x: 336 - sale_width,
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
                this.textWrap(goods_text)
                this.ctx.drawImage(this.data.qr_code, 38, 500, 106, 106)
                this.ctx.save()
                this.ctx.beginPath()
                this.ctx.arc(91, 553, 26.5, 0, 2 * Math.PI)
                this.ctx.clip()
                this.ctx.drawImage(this.data.shop_logo, 64.5, 526.5, 53, 53)
                this.ctx.restore()
                let code_text = {
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
                this.textWrap(code_text)
                let code_tip = {
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
                this.textWrap(code_tip)
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