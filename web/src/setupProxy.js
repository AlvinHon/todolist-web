const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://' + (process.env.REACT_APP_BACKEND_URL ?? 'localhost:8080'),
            changeOrigin: true,
        })
    );
};