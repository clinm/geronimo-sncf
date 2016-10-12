module.exports = function(app) {
    var router = app.loopback.Router();
    router.get('/', function(req, res) {
        var js = ['/js/bundle.js'];
        var meta_description = "Etat en temps réel des trains circulant sur le réseau SNCF";
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.render('home',{js: js});
    });
    app.use(router);
};