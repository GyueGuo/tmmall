const app = getApp();
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //引导页
    tab: 1,
    feedback: '',
    pic_list: [],
    //图片文件名
    file_name: '',
    contact: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      diy_color: app.globalData.diy_color
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
   * 提建议
   */
  onSuggest() {
    this.setData({
      tab: 1
    })
  },

  /**
   * 想咨询
   */
  onConsult() {
    this.setData({
      tab: 2
    })
  },

  /**
   * 要投诉
   */
  onComplain() {
    this.setData({
      tab: 3
    })
  },

  /**
   * 反馈详情
   */
  feedbackInput(e) {
    this.setData({
      feedback: e.detail.value.replace(/ /g, '')
    })
  },

  /**
   * 选择图片
   */
  choosePic() {
    wx.chooseImage({
      count: 3 - this.data.pic_list.length,
      success: res => {
        this.setData({
          pic_list: [...this.data.pic_list, ...res.tempFilePaths]
        })
      },
    })
  },

  /**
   * 删除图片
   */
  delectPic(e) {
    this.data.pic_list.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      pic_list: this.data.pic_list
    })
  },

  /**
   * 联系方式
   */
  contactInput(e) {
    let value = e.detail.value
    this.setData({
      contact: value
    })
    // this.setData({
    //   contact: value.replace(/[^u4E00-u9FA5][^.]/g, '')
    // })
  },

  /**
   * 提交
   */ 
  submit() {
    if (this.data.feedback.length == 0) {
      app.showToast('请输入您的反馈详情')
      return
    }
    if (this.data.contact.length == 0) {
      let regBox = {
          regEmail: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, //邮箱  
          regMobile: /^0?1[3|4|5|6|7|8][0-9]\d{8}$/, //手机
        },
        mflag = regBox.regMobile.test(this.data.contact),
        eflag = regBox.regEmail.test(this.data.contact)
      if (mflag || eflag) {
      } else {
        app.showToast('联系方式格式错误')
        return
      }
    }
    this.data.file_name = ''
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.uploadImage(0)
  },

  /**
   * 上传图片
   */
  uploadImage(i) {
    if (i < this.data.pic_list.length) {
      wx.uploadFile({
        url: app.globalData.upload_pic,
        filePath: this.data.pic_list[i],
        name: 'image',
        formData: {
          type: 'feedback'
        },
        success: res => {
          this.data.file_name += JSON.parse(res.data).url
          if (i != this.data.pic_list.length - 1) {
            this.data.file_name += ','
          }
          this.uploadImage(i + 1)
        }
      })
    } else {
      wx.hideLoading()
      let type = ''
      if (this.data.tab == 1) {
        type = '提建议'
      } else if (this.data.tab == 2) {
        type = '想咨询'
      } else {
        type = '要投诉'
      }
      http.post(app.globalData.feedback, {
        type: type,
        content: this.data.feedback,
        file: this.data.file_name,
        contact: this.data.contact
      }).then(res => {
        app.showSuccessToast(res.message, () => {
          wx.navigateBack()
        })
      })
    }
  },
})