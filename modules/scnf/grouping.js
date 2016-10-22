var grouping;

(function(grouping_module) {

    if (typeof module !== 'undefined') {
        module.exports = grouping_module();
    } else {
        grouping = grouping_module();
    }

})(function() {
    var grouping = {
        /**
         * Returns an associated array when the key is a text value of disruption
         * and the value the number of time this value appeared
         * @param {Array} disruptions as returned after parsing
         * @returns {Array}
         */
        groupByText: function(disruptions) {
            var grouped = [];

            disruptions.forEach(function(disruption) {
                if (typeof grouped[disruption.text] === 'undefined') {
                    grouped[disruption.text] = 1;
                } else {
                    grouped[disruption.text] += 1;
                }
            });

            return grouped;
        },
        /**
         * Wrapper for toArray and groupByText call
         * @param disruptions
         * @returns {Array}
         */
        groupByTextToArray: function(disruptions) {
            return grouping.toArray(grouping.groupByText(disruptions));
        },
        /**
         * Transforms an associated array into a simple array where value
         * is the key and count is the value
         * @param associatedArray   returns by groupBy methods
         * @returns {Array}
         */
        toArray: function(associatedArray) {
            var array = [];

            Object.keys(associatedArray).forEach(function(item) {
                array.push(
                        {
                            value: item,
                            count: associatedArray[item]
                        });
            });

            return array;
        }
    };

    return grouping;
});