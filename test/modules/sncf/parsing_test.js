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
                ]
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
            var expected = {status: "Passé", object_name: "17647", text: "Incident affectant la voie"};
            expect(dis).to.be.deep.equal([expected]);
        });
    });
});