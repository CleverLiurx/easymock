var http = require('http'),
    httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({});

var isDev = process.env.NODE_ENV === 'development'

var server = http.createServer(function(req, res) {
  if(req.url.indexOf("/favicon.ico") !== -1){
    // 过滤掉 favicon.ico
    res.end();
  } else {
    var host = req.headers.host
    var projectId = isDev ? req.headers['project-id'] : host.split('.easymock.bayuechuqi.com')[0]
    var isLegal = /^\/[0-9a-zA-Z_\-\/]{1,}/.test(req.url) && /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/.test(projectId)
    if (!isLegal) {
      // 确保projectId正确 并且 url存在
      res.writeHead(301, {'Location': 'http://easymock.bayuechuqi.com/'});
      res.end()
    }else {
      // 代理
      proxy.web(req, res, {
        target: 'http://127.0.0.1:9907/user-http-proxy',
        headers: {
          'project-id': projectId,
          'secret': '4QaKDPznG9iw0YsHftqVWO65mLMAhSdu'
        }
      });
    }
  }
});

console.log("listening on port 5050")
server.listen(5050);
