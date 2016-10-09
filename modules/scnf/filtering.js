module.exports = (function() {
    var _ = require('underscore');

    var filtering = {
        isAfterDate: function(date, limit) {
            var d = parseInt(date);
            var l = parseInt(limit);

            return d >= l;
        },
        getBeginningOfDay: function() {
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            return today;
        },
        filterAfterDay: function(disruptions, limit) {

            return _.filter(disruptions, function(item) {
                var beginToday = filtering.isAfterDate(item.application_period.begin, limit);
                var endToday = filtering.isAfterDate(item.application_period.end, limit);

                return beginToday || endToday;
            });
        }
    };

    return filtering;

})();