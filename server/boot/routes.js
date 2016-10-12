module.exports = function(app) {
    var router = app.loopback.Router();
    router.get('/', function(req, res) {
        var js = ['/js/bundle.js'];
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.render('home',{js: js});
    });
    app.use(router);
};