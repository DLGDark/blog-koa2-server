// 加密算法 加密
// 引入 nodejs 加密模块
const crypto=require('crypto');

// 密钥
const SECRET_KEY = 'HELLO!#wo_zhe_shi_mi_yao@666';

// md5加密
function md5(content){
  // 创建并返回一个 Hash 对象，该对象可用于生成哈希摘要（使用给定的参数，此处为md5）
  let md5=crypto.createHash('md5');
  //将content转换为16进制编码作为参数传入update函数，使用content更新加密
  return md5.update(content).digest('hex');
}

// 加密函数
function genPassword(password){
  const str=`password=${password}&key=${SECRET_KEY}`;
  return md5(str);
}

module.exports={
  genPassword
}