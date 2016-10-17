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

    describe("isBeforeDay", function() {
        var beginDay = new Date(2016, 9, 15, 0, 0, 0, 0).getTime();

        it("should reject later dates", function () {
            var dayAfter = new Date(2016, 9, 16, 0, 0, 0).getTime();

            var res = filtering.isBeforeDate(dayAfter, beginDay);

            expect(res).to.be.false;
        });

        it("should accept midnight", function () {
            var res = filtering.isBeforeDate(beginDay, beginDay);

            expect(res).to.be.true;
        });

        it("should accept before dates", function () {
            var dayBefore = new Date(2016, 9, 14, 0, 0, 0).getTime();
            var res = filtering.isBeforeDate(dayBefore, beginDay);

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

    describe("filterKeepBetween", function() {
        var dayBefore   = "1475963000000";
        var dayBefore1  = "1475963100000";
        var dayOne      = "1475964000000";   // 09/10/2016 à 0:00:00
        var dayBetween  = "1475964500000";
        var dayTwo      = "1476050400000";   // 10/10/2016 à 0:00:00
        var dayAfter   = "1476051400000";

        it("internal: checking dates", function() {
            expect(filtering.isBeforeDate(dayBefore, dayBefore1)).to.be.true;
            expect(filtering.isBeforeDate(dayBefore1, dayOne)).to.be.true;
            expect(filtering.isBeforeDate(dayOne, dayBetween)).to.be.true;
            expect(filtering.isBeforeDate(dayBetween, dayTwo)).to.be.true;
            expect(filtering.isBeforeDate(dayTwo, dayAfter)).to.be.true;
        });

        it("should check for begin < end", function() {
            var res = filtering.filterKeepBetween([], dayTwo, dayOne);

            expect(res).to.be.false;
        });

        it("should remove days < begin", function(){
            var elt = {
                application_period: {
                    begin:  dayBefore
                }
            };

            var res = filtering.filterKeepBetween([elt], dayOne, dayTwo);
            expect(res).to.be.deep.equal([]);
        });

        it("should remove days > end", function(){
            var elt = {
                application_period: {
                    begin:  dayAfter
                }
            };

            var res = filtering.filterKeepBetween([elt], dayOne, dayTwo);
            expect(res).to.be.deep.equal([]);
        });

        it("should keep begin < days < end", function(){
            var elt = {
                application_period: {
                    begin:  dayBetween
                }
            };

            var res = filtering.filterKeepBetween([elt], dayOne, dayTwo);
            expect(res).to.be.deep.equal([elt]);
        });
    });
});