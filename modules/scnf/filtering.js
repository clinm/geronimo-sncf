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
         * Say whether date is before the limit or not
         * @param {string} date     timestamp
         * @param {string} limit    timestamp
         * @returns {boolean}   returns date < limit
         */
        isBeforeDate: function(date, limit) {
            var d = parseInt(date);
            var l = parseInt(limit);

            return d <= l;
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
        },
        /**
         *  Checks only the application_period.begin field.
         *  So if a disruption has its 'begin date' between the range but the end outside
         *  (after 'end') is will still be selected
         * @param {array} disruptions
         * @param {number} begin    Timestamp
         * @param {number} end      Timestamp
         * @returns {boolean|array} False if dates are incorrect, array otherwise
         */
        filterKeepBetween: function(disruptions, begin, end) {
            if (filtering.isBeforeDate(end, begin)) {
                return false;
            }

            return _.filter(disruptions, function(item) {
                var beginInRange = filtering.isAfterDate(item.application_period.begin, begin);
                var endInRange = filtering.isBeforeDate(item.application_period.begin, end);

                return beginInRange && endInRange;
            });
        }
    };

    return filtering;

})();