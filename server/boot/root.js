module.exports = function(server) {
    var message = "Executing in ";
    if (process.env.NODE_ENV) {
        message += process.env.NODE_ENV;
    } else {
        message += "production";
    }
    console.log(message);

    // Install a `/` route that returns server status
    var router = server.loopback.Router();
    router.get('/', server.loopback.status());
    server.use(router);

};
