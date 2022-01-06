var { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function(app) {

    app.use(  
    createProxyMiddleware('/users',  {
    
    target: 'http://52.79.134.9:5000/',
    changeOrigin: true
    })
 );
};