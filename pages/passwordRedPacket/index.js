const app = getApp();
import http from '../../utils/http';
Page({
  data: {
    isModalVisible: false,
    redComand: '',
    redPacketInfo: {},
  },
  onLoad() {
    if (!app.globalData.memberId || !app.globalData.phone) {
      wx.redirectTo({
        url: '/pages/accredit/accredit',
      })
    }
  },
  handleInput(e) {
    this.setData({
      redComand: e.detail.value,
    })
  },
  handleExchange() {
    const { redComand } = this.data;
    if (redComand) {
      http.post(app.globalData.getRedComandPacket, {
        redComand,
      }).then(({ result, message, code }) => {
        if (code === 0) {
          this.setData({
            isModalVisible: true,
            redPacketInfo: result,
          });
        } else {
          wx.showToast({
            titke: message,
            icon: 'none',
            duration: 3000,
          });
        }
      })
    }
  },
  handleCloseModal() {
    this.setData({
      isModalVisible: false,
    })
  }
})