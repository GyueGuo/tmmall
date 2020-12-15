// components/star_level/star_level.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    level: 5
  },
  ready(){
    this.setData({
      diy_color: app.globalData.diy_color
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onOneStar() {
      this.setData({
        level: 1
      })
      this.triggerEvent("changeStar", 1)
    },
    onTwoStar() {
      this.setData({
        level: 2
      })
      this.triggerEvent("changeStar", 2)
    },
    onThreeStar() {
      this.setData({
        level: 3
      })
      this.triggerEvent("changeStar", 3)
    },
    onFourStar() {
      this.setData({
        level: 4
      })
      this.triggerEvent("changeStar", 4)
    },
    onFiveStar() {
      this.setData({
        level: 5
      })
      this.triggerEvent("changeStar", 5)
    },
  }
})