const wxbarcode = require('../../utils/codeUtil.js');
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    show(info) {
      this.setData({ 
        isShow: true,
        info: info
      })
      wxbarcode.barcode('barcode', info.take_code + '', 584, 126);
      wxbarcode.qrcode('qrcode', info.take_code + '', 330, 330);
    },
    /**
     * 关闭
     */
    closeBoard() {
      this.setData({
        isShow: false
      })
    }
  }
})