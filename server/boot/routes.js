module.exports = function(app) {
    var router = app.loopback.Router();
    router.get('/', function(req, res) {
        var js = ['/js/line-chart-min.js'];
        res.render('home',{js: js});
    });
    app.use(router);
};