const RSA = require('./rsa.js');
let request = {
	/**
	分段加密， 传入json对象
	*/
  encode(RequestObject, publicKey) {
    return RSA.encryptPublicLong(JSON.stringify(RequestObject), publicKey);
  }
}

module.exports = request