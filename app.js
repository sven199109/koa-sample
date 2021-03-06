//'use strict';

var koa    = require('koa');
var app    = koa();
global.app = module.exports = app;
global.db  = require('./app/models/index');

var boot   = require("./config/boot");
var middlewares = require('koa-middlewares');
var config = require('./config/settings');
var path   = require('path');
var http   = require('http');
var notFound = require('./config/404');
require('./config/routes');

// ignore favicon
// app.use(middlewares.favicon());

// response time header
app.use(middlewares.rt());

// 404
app.use(notFound.pageNotFound());

// static file server
app.use(middlewares.staticCache(path.join(__dirname, 'public'), {
  buffer: !config.debug,
  maxAge: config.debug ? 0 : 60 * 60 * 24 * 7
}));

if (config.debug && process.env.NODE_ENV !== 'test') {
  app.use(middlewares.logger());
}

/*
 * favicon
 */
app.use(middlewares.favicon(__dirname + '/public/favicon.ico'));

/*
 * router
 */
app.use(middlewares.router(app));
// app.use(routes.routes());

app = module.exports = http.createServer(app.callback());

if (!module.parent) {
  app.listen(config.port);
  console.log("koa server was started suceessfully, to visit http://0.0.0.0:" + config.port);
}

