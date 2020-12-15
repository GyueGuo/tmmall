//是否开启加密
const b = false;
// const RSA = require('../utils/jsencrypt.min.js')
// const RSA = require('../utils/rsa/jsencrypt.js')
const privateKey_pkcs1 = '-----BEGIN PRIVATE KEY-----MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBALgQq1AZujJ4aE65i8 / A0YcRsN8 + DJD6Z0tspAd2yyhq24pjz7FRnqPUdW8jJVSQpNTEkTRRackPrd8hAhJGXef9BclnhBrz0cg0eQDvSRMQmlXx / 6jyEOxl2rKkV9DsVrHm5+ gvkrBT8d1IgdP1zTEwKC1wl2 / rin / NAypfpprzAgMBAAECgYB7V1A04MiQwXbEKjmyAbdmF0i6j83D6MgHFsnj5orEjraGydOHMvZnOhtnWdnODQ8nNIFI2bVVchhFCM1miZiqk0YC3R6kxapZBndPoxjMuJj6Tnp+ Vy / H5hnFdEY76EH3uqU9kaHX6pcx2BM4ppGzEBbbN3Ni3BemYRQwJpGKYQJBAPQudLCGtyUpy7vgJeIVSbKQQjRTzmFUuyHVsUOimqTZcI8ibjtRC1PQWvMXwN8O4sTMWwAgSnBN74 / Zm5sNIU8CQQDA + VabywlzfaxNOZ2kqyYLlGbA4mlNwXG0Hn5klJEb1Ba3Ih1SQGxKWtf7bUnB4NRjyu7Hljb + 5Pgu1KEOUZsdAkA4CH0QkSlv5sJwz4QB + H6b8kyu81hVr3rtzbrK2YKBN8CDqBQBmpxt1E86n4XL6f + Rx49OXRqX4NqLeRUjJIUzAkA3XBBll0S51hbE / L9lyxeaANPNh + ZvwQwOgST / U8OhOSHfHbFNtF + coR0O6xZawVYM3t3LciOK0kMEpEkj43NdAkAGzYtIw2bEGuS1NIv9ggQV47hLtZPHFI + cXFcHbzJiXfer8uH6 / 9Qvuxy1CcvVhd1Sr1Di4ORhMp0nQYnFC3 + I-----END PRIVATE KEY-----';
const publicKey_pkcs1 = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDP42epiVnB/jin6LeGa7JLe5eFXR61PhJy7TnjZwThsUNq5pH75yU0sOWRLIkLk1OFe93Dr2pY/PZhF9aaht9MQTUXrPCILPRw3R5yXL61mG9BjmaKgGP0xrPmwapBVClU2SAKnYvgpf9Pi01l1FKPYUGAyuhLNLf6lcUK+nm7+QIDAQAB-----END PUBLIC KEY-----';

const app = getApp();

const enc = res => {
  if (b) {
    //加密
    let rsa = new RSA.JSEncrypt()
    rsa.setKey(publicKey_pkcs1)
    let data = rsa.encrypt(JSON.stringify(res))
    res = {
      data: data
    }
  }
  return res
};

const dec = res => {
  if (b) {
    //解密
    let rsa = new RSA.JSEncrypt()
    rsa.setKey(privateKey_pkcs1)
    res = JSON.parse(rsa.decrypt(res))
  }
  return res
};

const get = (url, data = {}, hidden) => {
  console.log(data)
  let pages = getCurrentPages();
  let currentPages = pages[pages.length - 1]
  let promise = new Promise((success, fail) => {
    wx.request({
      url: url,
      data: data,
      method: 'GET',
      header: {
        "Content-Type": "json",
        "token": app.globalData.token || ''
      },
      success: res => {
        if (res.data.code == 0) {
          if (res.header.token == '500' || res.header.Token == '500') {
            clearLoginState()
          }
          getToken(res)
          success(res.data)
          // wx.hideLoading()
          console.log(res.data)
        } else if (res.data.code == -200) {
          clearLoginState()
        } else if (res.data.code == -201) {
          clearLoginState()
        } else if (res.data.code == -202) {
          return
        } else {
          fail(res.data)
          app.showToast(res.data.message, () => {
            // wx.hideLoading()
          })
        }

      },
      fail: res => {},
      complete: () => {

      }
    })
  });
  return promise;
};

const postList = (url, data = {}) => {
  // wx.showLoading({
  //   title: '加载中',
  // })
  // wx.showNavigationBarLoading()
  console.log(data)
  let pages = getCurrentPages();
  let currentPages = pages[pages.length - 1]
  currentPages.setData({
    loading: true
  })
  let promise = new Promise(success => {
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        "Content-Type": "json",
        "token": app.globalData.token || ''
      },
      success: res => {
        if (res.data.code == 0) {
          getToken(res)
          success(res.data)
          console.log(res.data)
        } else if (res.data.code == -200) {
          clearLoginState()
        } else if (res.data.code == -201) {
          clearLoginState()
        } else if (res.data.code == -202) {
          return
        } else {
          app.showToast(res.data.message)
        }

      },
      fail: res => {
        // app.showToast(res.data.message)
      },
      complete: () => {
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        currentPages.setData({
          loading: false,
        })
      }
    })
  });
  return promise;
};

const post = (url, data = {}, hidden) => {
  // data = data || {};
  if (!hidden) {
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    wx.showNavigationBarLoading()
  }
  console.log(data)
  let pages = getCurrentPages();
  let currentPages = pages[pages.length - 1]
  // currentPages.setData({
  //   loading: true,
  // })
  let promise = new Promise((success, fail) => {
    wx.request({
      url: url,
      data: data,
      header: {
        "Content-Type": "json",
        "token": app.globalData.token || ''
      },
      method: 'POST',
      success: res => {
        if (res.data.code == 0) {
          getToken(res)
          success(res.data)
          // wx.hideLoading()
          console.log(res.data)
        } else if (res.data.code == -200) {
          clearLoginState()
        } else if (res.data.code == -201) {
          clearLoginState()
        } else if (res.data.code == -202) {
          return
        } else {
          fail(res.data)
          app.showToast(res.data.message, () => {
            wx.hideLoading()
          })
        }
      },
      fail: res => {
        // app.showToast(res.data.message)
      },
      complete: () => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        // currentPages.setData({
        //   loading: false
        // })
      }
    })
  });
  return promise;
};


const encPost = (url, data = {}, hidden) => {
  // data = data || {};
  if (!hidden) {
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    wx.showNavigationBarLoading()
  }
  console.log(data)
  let promise = new Promise((success, fail) => {
    wx.request({
      url: url,
      data: enc(data),
      header: {
        "Content-Type": "json",
        "token": app.globalData.token || ''
      },
      method: 'POST',
      success: res => {
        if (dec(res.data).code == 0) {
          getToken(res)
          success(dec(res.data))
        } else if (res.data.code == -200) {
          clearLoginState()
        } else if (res.data.code == -201) {
          clearLoginState()
        } else if (res.data.code == -202) {
          return
        } else {
          fail(res.data)
          wx.showToast({
            title: dec(res.data).message,
            icon: 'none',
            mask: true
          })
        }
      },
      fail: res => {
        fail(res.data)
        wx.showToast({
          title: dec(res.data).message,
          icon: 'none',
          mask: true,
        })
      },
      complete: () => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    }) //微信请求API  
  });
  return promise;
};

const uploadFile = (url, path, name, data, success) => {
  wx.showLoading({
    title: '加载中...',
  })
  wx.uploadFile({
    url: url,
    header: {
      "Content-Type": "json",
      "token": app.globalData.token || ''
    },
    filePath: path,
    name: name,
    formData: data,
    success: res => {
      success(res)
    },
    complete: () => {
      wx.hideLoading()
    }
  })
};

const getToken = (res) => {
  if (res.header.token == '500' || res.header.Token == '500') {
    clearLoginState()
  }
  if (res.header.Token && res.header.Token != '') {
    wx.setStorageSync('token', res.header.Token)
    app.globalData.token = res.header.Token
  }
  if (res.header.token && res.header.token != '') {
    wx.setStorageSync('token', res.header.token)
    app.globalData.token = res.header.token
  }
};
const scene = data => {
  let scene = decodeURIComponent(data)
  let sceneArr = scene.split("-")
  let obj = {}
  for (let i = 0, len = sceneArr.length; i < len; i++) {
    obj[sceneArr[i].split(",")[0]] = sceneArr[i].split(",")[1]
  }
  return obj
};
const throttle = (_this, callback, t) => {
  if (_this.buttonClicked == 1) {
    return false
  }
  _this.buttonClicked = 1

  setTimeout(() => {
    _this.buttonClicked = 0
  }, t)
  callback()
};
/**
 * 清空登录状态
 */
const clearLoginState = () => {
  wx.clearStorageSync()
  app.globalData.member_id = ''
  app.globalData.phone = ''
  app.globalData.openid = ''
  app.globalData.unionId = ''
  app.globalData.token = ''
  //代言人ID
  app.globalData.sup_id = ''
  app.globalData.distribution = {}
  wx.closeSocket()
  clearTimeout(app.app_socketHeartTime)
  if (app.globalData.PAST_LOGIN) {
    return
  }
  wx.navigateTo({
    url: '/pages/accredit/accredit'
  })
  app.globalData.PAST_LOGIN = true
  return
};

module.exports = {
  get,
  post,
  postList,
  encPost,
  uploadFile,
  scene,
  clearLoginState,
  throttle
}