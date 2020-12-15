// components/sale_progress/sale_progress.js
const app =getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    percent:String
  },
  ready(){
    this.setData({
      diy_color: app.globalData.diy_color
    })
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
