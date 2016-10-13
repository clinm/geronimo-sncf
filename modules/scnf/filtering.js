module.exports = (function() {
    var _ = require('underscore');

    var filtering = {
        /**
         *  Say whether date is after the limit or not
         * @param {string} date     timestamp
         * @param {string} limit    timestamp
         * @returns {boolean}   returns date > limit
         */
        isAfterDate: function(date, limit) {
            var d = parseInt(date);
            var l = parseInt(limit);

            return d >= l;
        },
        /**
         *  Returns the current day (at 00:00)
         * @returns {Date} Midnight of the current day
         */
        getBeginningOfDay: function() {
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            return today;
        },
        /**
         *  Keeps only disruptions that are after the 'limit' date
         * @param {Array} disruptions   List of disruptions
         * @param {Number} limit        Timestamp limit in the past
         */
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