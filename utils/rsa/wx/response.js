const RSA = require('./rsa.js');
let response = {
	/**
	分段解密， 传入json对象
	*/
  decode (content, privateKey){
    return JSON.parse(RSA.decryptPrivateLong(content, privateKey));
  }
}

module.exports = response