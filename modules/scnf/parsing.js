module.exports = (function() {
    var _ = require('underscore');

    var parsing = {
        /**
         * Status in SNCF API is in english, as the target audience will
         * be only french people, status needs to be in French
         * @param {string} status   The english status (past, active, future)
         * @returns {string} The french equivalent status
         */
        translateStatus: function(status) {
            var newStatus;
            switch (status) {
                case "active":
                    newStatus = "Actif";
                    break;
                case "past":
                    newStatus = "Passé";
                    break;
                case "future":
                    newStatus = "Futur";
                    break;
                default:
                    newStatus = "Inconnu";
            }

            return newStatus;
        },
        /**
         * Retrieve the first message in the array if any
         * @param {array} messages
         * @returns {string}
         */
        getMessage: function(messages) {
            var mess = "Non fourni";

            if (messages && messages[0] && messages[0].text) {
                mess = messages[0].text;
            }

            // tracking purpose, if several message are available
            if ( messages && messages.length > 1) {
                console.log("More than one message provided !");
                console.log(messages);
            }
            return mess;
        },
        /**
         * Retrieve train number of the first entry only
         * @param {array} impacted_obj
         * @returns {string}    Train number
         */
        getTrainNumber: function(impacted_obj) {
            var trainNumber = "Inconnu";

            if (impacted_obj && impacted_obj[0] && impacted_obj[0].pt_object) {
                trainNumber = impacted_obj[0].pt_object.trip.name;
            }

            // tracking purpose, if several message are available
            if (impacted_obj && impacted_obj.length > 1) {
                console.log("More than one object provided !");
                console.log(impacted_obj);
            }
            return trainNumber;
        },
        /**
         * Translate all disruptions in the given array
         * @param {Array} disruptions
         * @returns {Array}
         */
        translateDisruption: function(disruptions) {
            var translated = [];
            _.forEach(disruptions, function(disruption) {
                var obj = {
                    status: parsing.translateStatus(disruption.status),
                    object_name: parsing.getTrainNumber(disruption.impacted_objects),
                    text: parsing.getMessage(disruption.messages)
                };

                translated.push(obj);
            });

            return translated;
        }
    };

    return parsing;

})();