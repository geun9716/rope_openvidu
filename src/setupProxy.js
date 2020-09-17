var { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function(app) {

    app.use(  
    createProxyMiddleware('/users',  {
    
    target: 'http://localhost/',
    changeOrigin: true
    })
 );
};