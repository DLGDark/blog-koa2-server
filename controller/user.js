const { exec, escape } = require("../db/mysql");

const { genPassword } = require("../utils/crypto");

const login = async (username, password) => {
  username = escape(username);

  password = genPassword(password); // 密码加密
  password = escape(password);

  const sql = `select username,realname from user where username=${username} and password=${password}`;

  const rows = await exec(sql);

  return rows[0] || {};
};

module.exports = {
  login
};
