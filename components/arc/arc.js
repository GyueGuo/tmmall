// components/arc/arc.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    percent: {
      type: String,
      observer: function() {
        const ctx = wx.createCanvasContext('back', this)
        ctx.arc(30, 30, 24, 0.75 * Math.PI, 2.25 * Math.PI); //绘制圆形弧线
        ctx.setStrokeStyle(app.globalData.diy_color.f_color_2); //设置填充线条颜色
        ctx.setLineWidth("4"); //设置线条宽度
        ctx.setLineCap("round"); //设置线条端点样式
        ctx.stroke(); //对路径进行描边，也就是绘制线条。
        ctx.draw(); //开始绘制
        let degree = 0.75 + 0.015 * parseInt(this.data.percent)
        ctx.arc(30, 30, 24, 0.75 * Math.PI, degree * Math.PI); //绘制圆形弧线
        ctx.setStrokeStyle(app.globalData.diy_color.z_color); //设置填充线条颜色
        ctx.setLineWidth("4"); //设置线条宽度
        ctx.setLineCap("round"); //设置线条端点样式
        ctx.stroke(); //对路径进行描边，也就是绘制线条。
        ctx.draw(true,()=>{
          wx.canvasToTempFilePath({
            canvasId: 'back',
            success: res => {
              this.setData({
                arc: res.tempFilePath
              })
            }
          }, this)
        }); //开始绘制
        
      }
    }
  },
  ready() {
    this.setData({
      diy_color: app.globalData.diy_color
    })
  },

  /**
   * 组件的初始数据
   */
  data: {},

  attached: function() {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})