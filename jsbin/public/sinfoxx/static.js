#!/usr/bin/env node

var Static = require('node-static');
var static = new Static.Server(__dirname);

require('http').createServer(function(req, res) {
  static.serve(req, res);
}).listen(8080);