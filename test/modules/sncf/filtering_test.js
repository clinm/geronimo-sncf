var expect = require("chai").expect;

describe("Filtering", function() {
    var filtering = require('../../../modules/scnf/filtering');



    describe("isAfterDay", function() {
        var beginDay = new Date(2016, 9, 15, 0, 0, 0, 0).getTime();


        it("should reject too older dates", function () {
            var dayBefore = new Date(2016, 9, 14, 0, 0, 0).getTime();

            var res = filtering.isAfterDate(dayBefore, beginDay);

            expect(res).to.be.false;
        });

        it("should accept midnight", function () {
            var res = filtering.isAfterDate(beginDay, beginDay);

            expect(res).to.be.true;
        });

        it("should accept later dates", function () {
            var dayAfter = new Date(2016, 9, 16, 0, 0, 0).getTime();
            var res = filtering.isAfterDate(dayAfter, beginDay);

            expect(res).to.be.true;
        });
    });

    describe("getBeginningOfDay", function() {
        it("should give midnight", function() {
            var midnight = new Date();
            midnight.setHours(0, 0, 0, 0);

            var res = filtering.getBeginningOfDay();
            expect(res.getTime()).to.be.equal(midnight.getTime());
        });
    });

    describe("filterKeepToday", function() {
        var beginDay = "1475964000000";

        it("should return empty array", function() {
            var res = filtering.filterAfterDay([], beginDay);
            expect(res).to.be.deep.equal([]);
        });

        it("should keep items with begin > today", function() {

            var elt = {
                application_period: {
                    begin:  "1475964000055",
                    end:    "1475964001000"
                }
            };

            var res = filtering.filterAfterDay([elt], beginDay);
            expect(res).to.be.deep.equal([elt]);
        });

        it("should keep items with end > today", function() {

            var elt = {
                application_period: {
                    begin:  "1475960000055",
                    end:    "1475964001000"
                }
            };

            var res = filtering.filterAfterDay([elt], beginDay);
            expect(res).to.be.deep.equal([elt]);
        });

    });
});