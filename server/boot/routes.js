module.exports = function(app) {
    var router = app.loopback.Router();
    router.get('/', function(req, res) {
        res.render('home');
    });
    app.use(router);
};