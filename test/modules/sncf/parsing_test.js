var expect = require("chai").expect;

var _ = require('underscore');

describe("Parsing", function() {
    var parsing = require('../../../modules/scnf/parsing');

    describe("Translate Status", function() {
        it("should translate 'past'", function() {
            var res = parsing.translateStatus('past');
            expect(res).to.be.equal("Passé");
        });

        it("should translate 'active'", function() {
            var res = parsing.translateStatus('active');
            expect(res).to.be.equal("Actif");
        });

        it("should translate 'future'", function() {
            var res = parsing.translateStatus('future');
            expect(res).to.be.equal("Futur");
        });

        it("should handle unknown status", function() {
            var res = parsing.translateStatus('my unknown status');
            expect(res).to.be.equal("Inconnu");
        });

    });

    /**
     * Example (October 2016)
     *
     * "messages": [
     {
         "text": "Panne de signalisation",
         "channel": {
             "content_type": "",
             "id": "rt",
             "types": [
                 "web",
                 "mobile"
             ],
             "name": "rt"
         }
     }
     ],
     */
    describe("Retrieve Message", function() {
        var defaultMessage = "Non fourni";

        it("should handle empty message", function() {
            var message = parsing.getMessage();
            expect(message).to.be.equal(defaultMessage);
        });


        it("should retrieve message", function() {
            var message = parsing.getMessage([{text: "message"}]);
            expect(message).to.be.equal("message");
        });

        it("should give first message", function() {
            var message = parsing.getMessage([{text: "message1"}, {text: "message2"}]);
            expect(message).to.be.equal("message1");
        });
    });

    /**
     * Example October 2016
     * "impacted_objects": [
     {
         "pt_object": {
             "embedded_type": "trip",
             "trip": {
                 "id": "OCE:SN850944F01001",
                 "name": "850944"
             },
             "quality": 0,
             "id": "OCE:SN850944F01001",
             "name": "OCE:SN850944F01001"
         }
     }
     ],
     */
    describe("Retrieve train number", function() {

        it("should handle empty train", function() {
            var train = parsing.getTrainNumber();
            expect(train).to.be.equal("Inconnu");
        });

        it("should give train number", function() {
            var train = parsing.getTrainNumber([{pt_object: {trip: {name: "858585"}}}]);
            expect(train).to.be.equal("858585");
        });

        it("should give first train number", function() {
            var message = parsing.getTrainNumber(
                    [
                        {pt_object: {trip: {name: "858585"}}},
                        {pt_object: {trip: {name: "number2"}}}
                    ]);
            expect(message).to.be.equal("858585");
        });
    });

    describe("Parsing all disruptions", function() {
        var realMessage1 = {
                "status": "past",
                "messages": [
                    {
                        "text": "Incident affectant la voie",
                        "channel": {
                            "content_type": "",
                            "id": "rt",
                            "types": [
                                "web",
                                "mobile"
                            ],
                            "name": "rt"
                        }
                    }
                ],
                "impacted_objects": [
                    {
                        "pt_object": {
                            "embedded_type": "trip",
                            "trip": {
                                "id": "OCE:SN017647F01002",
                                "name": "17647"
                            },
                            "quality": 0,
                            "id": "OCE:SN017647F01002",
                            "name": "OCE:SN017647F01002"
                        }
                    }
                ],
                "application_periods": [
                    {
                        "begin": "20161004T055400",
                        "end": "20161004T062359"
                    }
                ],
                "updated_at": "20161008T050618"
            };

        it("should give an empty array as default 1", function() {
            var dis = parsing.translateDisruption();
            expect(dis).to.be.instanceof(Array);
        });

        it("should give an empty array as default 2", function() {
            var dis = parsing.translateDisruption([]);
            expect(dis).to.be.instanceof(Array);
        });

        it("should return one entry", function() {
            var dis = parsing.translateDisruption([realMessage1]);
            var expected = {
                status: "Passé",
                object_name: "17647",
                text: "Incident affectant la voie",
                application_period: {
                    begin: parsing.toTimeStamp("20161004T055400"),
                    end: parsing.toTimeStamp("20161004T062359"),
                    updated_at: parsing.toTimeStamp("20161008T050618")
                }
            };
            expect(dis).to.be.deep.equal([expected]);
        });
    });

    describe("Translate dates to timestamp", function() {
        it("should return empty value", function() {
            var time = parsing.toTimeStamp();
            expect(time).to.be.undefined;
        });

        it("should handle empty string", function() {
            var time = parsing.toTimeStamp("");
            expect(time).to.be.undefined;
        });

        var incorrectTime = ["fake", "2016", "201610", "20161010", "20161025T",
                             "20161025T10", "20161025T1030"];
        it("should translate only dates", function() {

            incorrectTime.forEach(function(t) {
                var time = parsing.toTimeStamp(t);
                expect(time).to.be.undefined;
            });
        });

        it("should translate correct dates", function() {
            var time = parsing.toTimeStamp("20161008T181602");
            expect(time).to.be.equal(1475943362000);
        });

    });

    describe("Retrieve dates", function() {
        var messageWithDates = {
            "application_periods": [
                {
                    "begin": "20161004T055400",
                    "end": "20161004T062359"
                }
            ],
            "updated_at": "20161008T050618"
        };

        it("should look for application_periods entry", function() {
            var period = parsing.getApplicationPeriod({});
            expect(period).to.be.deep.equal({updated_at: undefined});
        });

        it("should retrieve application_periods", function() {
            var period = parsing.getApplicationPeriod(messageWithDates);

            var ap = messageWithDates.application_periods[0];
            var expected = {
                begin: parsing.toTimeStamp(ap.begin),
                end: parsing.toTimeStamp(ap.end),
                updated_at: parsing.toTimeStamp(messageWithDates.updated_at)
            };
            expect(period).to.exist;
            expect(period).to.be.deep.equal(expected);
        });
    });

});