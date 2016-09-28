module.exports = function(app) {
    var router = app.loopback.Router();
    router.get('/', function(req, res) {
        var js = ['/js/bundle.js'];
        res.render('home',{js: js});
    });
    app.use(router);
};