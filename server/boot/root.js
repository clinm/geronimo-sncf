module.exports = function() {
    var message = "Executing in ";
    if (process.env.NODE_ENV) {
        message += process.env.NODE_ENV;
    } else {
        message += "production";
    }
    console.log(message);
};
