const Koa = require("koa");
const app = new Koa();
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const session = require("koa-generic-session");
const redisStore = require("koa-redis");
const path = require("path");
const fs = require("fs");
const morgan = require("koa-morgan");

// 引入路由
const user = require("./routes/user");
const blog = require("./routes/blog");

const { REDIS_CONF } = require("./config/db");

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"]
  })
);
app.use(json());
app.use(logger());

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 写日志
const ENV = process.env.NODE_ENV;
if (ENV !== "production") {
  app.use(morgan("dev"));
} else {
  const logFileName = path.join(__dirname, "logs", "access.log");
  const writeStream = fs.createWriteStream(logFileName, {
    flags: "a"
  });
  app.use(
    morgan("combined", {
      stream: writeStream
    })
  );
}

// session 配置
app.keys = ["HELLO!#wo_zhe_shi_mi_yao@888"];
app.use(
  session({
    cookie: {
      //设置存放sessionid的cookie的相关选项
      path: "/", // 默认配置
      httpOnly: true, // 默认配置
      maxAge: 24 * 60 * 60 * 1000
    },
    // 配置 redis
    // store 会将session存进redis中去，没有的话，只是将session存在了内存中
    store: redisStore({
      // all: "127.0.0.1:6379"   //暂时写死
      all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
    }) //session的存储方式，默认为存放在内存中，我们可以自定义redis等
  })
);

// routes
app.use(user.routes(), user.allowedMethods());
app.use(blog.routes(), blog.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
