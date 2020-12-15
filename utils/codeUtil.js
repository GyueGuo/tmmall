var barcode = require('./barcode');
var qrcode = require('./qrcode');

function convert_length(length) {
  return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
}

function barc(id, code, width, height,_this) {
  barcode.code128(wx.createCanvasContext(id), code, convert_length(width), convert_length(height), id, _this)
}

function qrc(id, code, width, height,_this) {
  qrcode.api.draw(code, {
    ctx: wx.createCanvasContext(id),
    width: convert_length(width),
    height: convert_length(height),
    id:id,
    _this: _this
  })
}

module.exports = {
  barcode: barc,
  qrcode: qrc
}