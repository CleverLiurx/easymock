const http = require('http'),
    httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const isDev = process.env.NODE_ENV === 'development'

const server = http.createServer(function(req, res) {
  // 过滤掉 favicon.ico
  if(req.url.indexOf("/favicon.ico") !== -1){
    res.end();
    return
  }

  const host = req.headers.host
  const projectId = isDev ? req.headers['project-id'] : host.split('.easymock.bayuechuqi.com')[0]
  const isLegal = /^\/[0-9a-zA-Z_\-\/]{1,}/.test(req.url) && /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/.test(projectId)
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
});


server.listen(5050, () => console.log("Listening on port 5050"));
