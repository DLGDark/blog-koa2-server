const xss = require("xss");
const { exec, escape } = require("../db/mysql");

const getList = async (author, keyword) => {
  author = escape(author);
  // 写上where 1=1 是为了后面的参数判断不确定而写的,最后留空格方便与后面的语句拼接，防止语法错误
  let sql = `select * from blog where 1=1 `;

  if (author) {
    sql += `and author=${author} `;
  }
  if (keyword) {
    sql += ` and title like '%${keyword}%' `;
  }

  sql += `order by createtime desc;`;

  return await exec(sql);
};

const getDetail = async id => {
  const sql = `select * from blog where id='${id}'`;
  const rows = await exec(sql);
  //单个结果的话处理处理返回数组为对象，即取出数组里第一个对象数据，也是唯一一条数据
  return rows[0];
};

const newBlog = async (blogData = {}) => {
  // blogData 是一个博客对象 包含标题 作者等信息
  const title = xss(blogData.title);
  const content = xss(blogData.content);
  const author = escape(blogData.author);
  const createtime = Date.now();

  const sql = `insert into blog (title,content,createtime,author) values ('${title}','${content}',${createtime},${author})`;

  const insertData = await exec(sql);

  return {
    id: insertData.insertId
  };
};

const updateBlog = async (id, blogData = {}) => {
  // id 是要更新的博客的id
  // blogData 是一个博客对象 包含标题 作者等信息
  const title = xss(blogData.title);
  const content = xss(blogData.content);

  const sql = `update blog set title='${title}', content='${content}' where id='${id}'`;

  const updataData = await exec(sql);

  if (updataData.affectedRows > 0) {
    return true;
  }
  return false;
};

const deleteBlog = async (id, author) => {
  // id 是要删除的博客的id
  author = escape(author);
  const sql = `delete from blog where id='${id}' and author=${author}`;

  const deldata = await exec(sql);

  if (deldata.affectedRows > 0) {
    return true;
  }
  return false;
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
};
